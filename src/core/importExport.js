// İnceleme verisinin JSON olarak dışa/içe aktarımı ve içe aktarılan dosyanın doğrulanması.
// Test yanıtları (girilen form değerleri ve dosya bilgileri) dışa aktarılmaz.

import { FORM_IDS, knownReqIds, sharedReqIds } from '../data/registry.js';
import { STATUS, FEEDBACK_CATEGORIES, FEEDBACK_STATUS, PRIORITIES, BRANCH_SCOPES, FIELD_TYPES } from '../data/enums.js';
import { SCHEMA_VERSION, emptyFormState, migrateSectionRefs } from './state.js';

export const EXPORT_KIND = 'muhasebe-form-inceleme';
const MAX_TEXT = 20000;
const MAX_FILE_BYTES = 5 * 1024 * 1024;

export function buildExport(state, exportedAt) {
  const forms = {};
  for (const id of FORM_IDS) {
    const f = state.forms[id];
    forms[id] = {
      feedback: f.feedback,
      decisions: f.decisions,
      reqStatus: f.reqStatus,
      sectionReviewed: f.sectionReviewed,
      experienceConfirmed: f.experienceConfirmed,
      prompt: f.prompt,
      counters: f.counters,
    };
  }
  return {
    kind: EXPORT_KIND,
    schemaVersion: SCHEMA_VERSION,
    exportedAt,
    note: 'Test yanıtları bu dosyaya dahil edilmez. Gerçek kişisel, banka veya vergi verisi girmeyin.',
    forms,
    shared: { reqStatus: state.shared.reqStatus },
  };
}

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
const str = (v, max = MAX_TEXT) => (typeof v === 'string' ? v.slice(0, max) : '');
const oneOf = (v, allowed, fallback) => (Object.prototype.hasOwnProperty.call(allowed, v) ? v : fallback);

function cleanReqStatus(raw, allowedIds, where, warnings) {
  const out = {};
  if (!isObj(raw)) return out;
  for (const [id, entry] of Object.entries(raw)) {
    if (!allowedIds.has(id)) {
      warnings.push(`${where}: bilinmeyen gereksinim "${id}" atlandı.`);
      continue;
    }
    if (!isObj(entry) || !Object.prototype.hasOwnProperty.call(STATUS, entry.status)) {
      warnings.push(`${where}: "${id}" için geçersiz durum atlandı.`);
      continue;
    }
    out[id] = { status: entry.status, note: str(entry.note), updatedAt: str(entry.updatedAt, 40) };
  }
  return out;
}

function cleanFeedback(list, formId, warnings) {
  const out = [];
  if (!Array.isArray(list)) return out;
  list.forEach((item, i) => {
    const where = `${formId} geri bildirim #${i + 1}`;
    if (!isObj(item) || typeof item.id !== 'string' || !item.id) return warnings.push(`${where}: kimliği olmadığı için atlandı.`);
    if (!str(item.description).trim()) return warnings.push(`${where} (${item.id}): açıklama boş olduğu için atlandı.`);
    if (!Object.prototype.hasOwnProperty.call(FEEDBACK_CATEGORIES, item.category)) {
      return warnings.push(`${where} (${item.id}): geçersiz kategori "${String(item.category)}" nedeniyle atlandı.`);
    }
    out.push({
      id: str(item.id, 40),
      form: formId,
      branch: formId === 'cari' ? oneOf(item.branch, BRANCH_SCOPES, 'all') : '',
      target: str(item.target, 200),
      category: item.category,
      description: str(item.description),
      expected: str(item.expected),
      status: oneOf(item.status, FEEDBACK_STATUS, 'acik'),
      priority: oneOf(item.priority || '', PRIORITIES, ''),
      decisionId: str(item.decisionId, 40),
      createdAt: str(item.createdAt, 40),
      updatedAt: str(item.updatedAt, 40),
    });
  });
  return out;
}

function cleanDecisions(list, formId, warnings) {
  const out = [];
  if (!Array.isArray(list)) return out;
  list.forEach((item, i) => {
    const where = `${formId} karar #${i + 1}`;
    if (!isObj(item) || typeof item.id !== 'string' || !item.id) return warnings.push(`${where}: kimliği olmadığı için atlandı.`);
    if (!str(item.text).trim()) return warnings.push(`${where} (${item.id}): karar metni boş olduğu için atlandı.`);
    const change = isObj(item.change) ? item.change : { kind: 'none' };
    const kind = ['none', 'modify', 'add'].includes(change.kind) ? change.kind : 'none';
    const clean = { kind };
    if (kind === 'modify') {
      const p = isObj(change.patch) ? change.patch : {};
      clean.fieldId = str(change.fieldId, 80);
      clean.patch = {
        label: str(p.label, 300),
        help: str(p.help, 2000),
        placeholder: str(p.placeholder, 300),
        required: ['', 'required', 'optional'].includes(p.required) ? p.required : '',
        options: Array.isArray(p.options) ? p.options.map((o) => str(o, 300)).filter(Boolean) : [],
        removed: Boolean(p.removed),
        restore: Boolean(p.restore),
      };
      if (!clean.fieldId) warnings.push(`${where} (${item.id}): değiştirilecek alan belirtilmemiş.`);
    } else if (kind === 'add') {
      const a = isObj(change.add) ? change.add : {};
      clean.add = {
        sectionId: str(a.sectionId, 40),
        label: str(a.label, 300),
        type: oneOf(a.type, FIELD_TYPES, 'text'),
        required: Boolean(a.required),
        help: str(a.help, 2000),
        options: Array.isArray(a.options) ? a.options.map((o) => str(o, 300)).filter(Boolean) : [],
      };
    }
    out.push({
      id: str(item.id, 40),
      form: formId,
      branch: formId === 'cari' ? oneOf(item.branch, BRANCH_SCOPES, 'all') : '',
      title: str(item.title, 300),
      text: str(item.text),
      implications: str(item.implications),
      reqIds: Array.isArray(item.reqIds) ? item.reqIds.map((r) => str(r, 40)).filter(Boolean) : [],
      target: str(item.target, 200),
      change: clean,
      sourceFeedbackId: str(item.sourceFeedbackId, 40),
      createdAt: str(item.createdAt, 40),
      updatedAt: str(item.updatedAt, 40),
    });
  });
  return out;
}

/**
 * İçe aktarılan metni doğrular. Geçerliyse yalnızca inceleme verisini içeren temiz bir yapı döner.
 * @returns {{ok: boolean, errors: string[], warnings: string[], data?: object, summary?: object}}
 */
export function validateImport(text) {
  const errors = [];
  const warnings = [];
  if (typeof text !== 'string' || !text.trim()) return { ok: false, errors: ['Dosya boş.'], warnings };
  if (text.length > MAX_FILE_BYTES) return { ok: false, errors: ['Dosya çok büyük (en fazla 5 MB).'], warnings };

  let raw;
  try {
    raw = JSON.parse(text);
  } catch (err) {
    return { ok: false, errors: ['Dosya geçerli bir JSON değil.'], warnings };
  }
  if (!isObj(raw)) return { ok: false, errors: ['Beklenen yapı bir JSON nesnesi.'], warnings };
  if (raw.kind !== EXPORT_KIND) return { ok: false, errors: ['Bu dosya bu uygulamanın inceleme dışa aktarımı değil ("kind" alanı eşleşmiyor).'], warnings };
  if (typeof raw.schemaVersion !== 'number' || raw.schemaVersion > SCHEMA_VERSION) {
    return { ok: false, errors: [`Desteklenmeyen sürüm: ${String(raw.schemaVersion)}.`], warnings };
  }
  if (!isObj(raw.forms)) return { ok: false, errors: ['"forms" bölümü eksik.'], warnings };

  const data = { forms: {}, shared: { reqStatus: {} } };
  const summary = {};
  for (const id of FORM_IDS) {
    const src = raw.forms[id];
    if (!isObj(src)) {
      warnings.push(`"${id}" formu için veri yok; boş kabul edildi.`);
    }
    const f = isObj(src) ? src : {};
    const feedback = cleanFeedback(f.feedback, id, warnings);
    const decisions = cleanDecisions(f.decisions, id, warnings);
    const reqStatus = cleanReqStatus(f.reqStatus, knownReqIds(id), `${id} gereksinim durumu`, warnings);
    const sectionReviewed = {};
    if (isObj(f.sectionReviewed)) for (const [k, v] of Object.entries(f.sectionReviewed)) if (v === true) sectionReviewed[str(k, 80)] = true;
    const prompt = isObj(f.prompt)
      ? { text: str(f.prompt.text, 400000), dataHash: str(f.prompt.dataHash, 40), edited: Boolean(f.prompt.edited) }
      : emptyFormState(id).prompt;
    const maxNo = (list) => list.reduce((m, x) => Math.max(m, Number((x.id.match(/(\d+)$/) || [])[1]) || 0), 0);
    const counters = {
      feedback: Math.max(Number(f.counters && f.counters.feedback) || 0, maxNo(feedback)),
      decision: Math.max(Number(f.counters && f.counters.decision) || 0, maxNo(decisions)),
    };
    data.forms[id] = migrateSectionRefs(id, { feedback, decisions, reqStatus, sectionReviewed, prompt, counters, experienceConfirmed: Boolean(f.experienceConfirmed) }, raw.schemaVersion);
    summary[id] = { feedback: feedback.length, decisions: decisions.length, reqStatus: Object.keys(reqStatus).length };
  }
  data.shared.reqStatus = cleanReqStatus(raw.shared && raw.shared.reqStatus, sharedReqIds(), 'ortak gereksinim durumu', warnings);
  summary.shared = { reqStatus: Object.keys(data.shared.reqStatus).length };
  return { ok: true, errors, warnings, data, summary };
}

// Doğrulanmış içe aktarımı mevcut duruma uygular (inceleme verisinin yerini alır; test yanıtları korunur).
export function applyImport(state, data) {
  for (const id of FORM_IDS) {
    Object.assign(state.forms[id], data.forms[id]);
  }
  state.shared.reqStatus = data.shared.reqStatus;
  return state;
}
