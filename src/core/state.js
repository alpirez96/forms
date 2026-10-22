// Uygulama durumu ve yerel kalıcılık (localStorage). Veritabanı veya sunucu yoktur.

import { FORM_IDS } from '../data/registry.js';

export const STORAGE_KEY = 'muhasebe-form-inceleme.v1';
// 2: Cari Form sayfa kimlikleri canlı form tanımına (DOC-D) göre düzenlendi.
export const SCHEMA_VERSION = 2;

export const ID_PREFIX = { cari: 'C', talent: 'T' };

// Sürüm 1'de "Vergi Dairesi" sayfası s6 idi (DOC-A'daki "Sayfa 6/6"); canlı formda 4/6 olduğu için s4 oldu.
const SECTION_RENAMES_V2 = { cari: { s6: 's4' } };

// Eski sürümden gelen bölüm referanslarını (adım, inceleme işaretleri, not/karar hedefleri) günceller.
export function migrateSectionRefs(formId, formState, fromVersion) {
  if (fromVersion >= 2) return formState;
  const map = SECTION_RENAMES_V2[formId];
  if (!map) return formState;
  const sec = (id) => map[id] || id;
  const target = (t) => (typeof t === 'string' && t.startsWith('section:') ? `section:${sec(t.slice(8))}` : t);
  if (formState.ui) {
    if (formState.ui.step) formState.ui.step = sec(formState.ui.step);
    if (formState.ui.visited) formState.ui.visited = Object.fromEntries(Object.entries(formState.ui.visited).map(([k, v]) => [sec(k), v]));
  }
  if (formState.sectionReviewed) {
    formState.sectionReviewed = Object.fromEntries(Object.entries(formState.sectionReviewed).map(([k, v]) => {
      const [branch, id] = k.split(':');
      return [`${branch}:${sec(id)}`, v];
    }));
  }
  for (const f of formState.feedback || []) f.target = target(f.target);
  for (const d of formState.decisions || []) {
    d.target = target(d.target);
    if (d.change && d.change.add && d.change.add.sectionId) d.change.add.sectionId = sec(d.change.add.sectionId);
  }
  return formState;
}

export function emptyFormState(formId) {
  return {
    activeTab: 'test',
    answers: { branch: null, values: {}, files: {} },
    ui: { step: formId === 'cari' ? 'yon' : 't1', showNotes: true },
    sectionReviewed: {},
    feedback: [],
    decisions: [],
    reqStatus: {},
    experienceConfirmed: false,
    prompt: { text: '', dataHash: '', edited: false },
    counters: { feedback: 0, decision: 0 },
  };
}

export function defaultState() {
  const forms = {};
  for (const id of FORM_IDS) forms[id] = emptyFormState(id);
  return { schemaVersion: SCHEMA_VERSION, activeForm: 'cari', forms, shared: { reqStatus: {} } };
}

// Eksik anahtarları tamamlayarak eski/eksik durumları güvenle yükler.
export function normalizeState(raw) {
  const base = defaultState();
  if (!raw || typeof raw !== 'object') return base;
  const out = { ...base, activeForm: FORM_IDS.includes(raw.activeForm) ? raw.activeForm : 'cari' };
  const fromVersion = typeof raw.schemaVersion === 'number' ? raw.schemaVersion : 1;
  for (const id of FORM_IDS) {
    const src = (raw.forms && raw.forms[id]) || {};
    const def = base.forms[id];
    // Sürüm 1'deki "simulate" anahtarı artık kullanılmıyor.
    const srcUi = { ...(src.ui || {}) };
    delete srcUi.simulate;
    out.forms[id] = migrateSectionRefs(id, {
      ...def,
      ...src,
      answers: {
        ...def.answers,
        ...(src.answers || {}),
        values: { ...((src.answers && src.answers.values) || {}) },
        files: { ...((src.answers && src.answers.files) || {}) },
      },
      ui: { ...def.ui, ...srcUi },
      prompt: { ...def.prompt, ...(src.prompt || {}) },
      counters: { ...def.counters, ...(src.counters || {}) },
      feedback: Array.isArray(src.feedback) ? src.feedback : [],
      decisions: Array.isArray(src.decisions) ? src.decisions : [],
      reqStatus: src.reqStatus && typeof src.reqStatus === 'object' ? src.reqStatus : {},
      sectionReviewed: src.sectionReviewed && typeof src.sectionReviewed === 'object' ? src.sectionReviewed : {},
    }, fromVersion);
  }
  out.shared = { reqStatus: (raw.shared && raw.shared.reqStatus) || {} };
  return out;
}

export function loadState(storage) {
  try {
    const text = storage.getItem(STORAGE_KEY);
    if (!text) return { state: defaultState(), error: null };
    return { state: normalizeState(JSON.parse(text)), error: null };
  } catch (err) {
    return { state: defaultState(), error: 'Kayıtlı veri okunamadı; boş bir oturumla başlatıldı.' };
  }
}

export function saveState(storage, state) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return null;
  } catch (err) {
    return 'Veriler tarayıcıya kaydedilemedi (depolama kapalı veya dolu olabilir). Lütfen JSON olarak dışa aktarın.';
  }
}

export function nextId(formState, kind, formId) {
  formState.counters[kind] = (formState.counters[kind] || 0) + 1;
  const prefix = kind === 'feedback' ? 'GB' : 'K';
  return `${prefix}-${ID_PREFIX[formId]}-${String(formState.counters[kind]).padStart(3, '0')}`;
}

export function nowIso() {
  return new Date().toISOString();
}
