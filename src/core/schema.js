// Belgeden gelen temel şemayı, onaylanmış kararlar ve gereksinim durumlarıyla birleştirip
// "etkin" form şemasını üretir. Prototip ekranı ve prompt üretici aynı fonksiyonu kullanır.

import { getForm, findRequirement, isSharedReq } from '../data/registry.js';
import { DEFAULT_PLACEHOLDER, SELECT_PLACEHOLDER, MANDATORY_STATUSES } from '../data/enums.js';

// --- Gereksinim durumu -------------------------------------------------------

export function statusLookup(state, formId) {
  return (reqId) => {
    const store = isSharedReq(reqId) ? state.shared.reqStatus : state.forms[formId].reqStatus;
    const entry = store[reqId];
    if (entry && entry.status) return entry.status;
    const req = findRequirement(formId, reqId);
    return req ? req.defaultStatus : 'acik-soru';
  };
}

export function noteLookup(state, formId) {
  return (reqId) => {
    const store = isSharedReq(reqId) ? state.shared.reqStatus : state.forms[formId].reqStatus;
    return (store[reqId] && store[reqId].note) || '';
  };
}

export const isMandatoryStatus = (status) => MANDATORY_STATUSES.includes(status);
export const isDroppedStatus = (status) => status === 'reddedildi' || status === 'ertelendi';

// Prototipin kendi deneyim davranışları; bağlı öneri reddedilir/ertelenirse prototipte kapanır.
export const BEHAVIOR_REQS = {
  cari: { whitespace: 'C-P08', review: 'C-P07', clearOnBranch: 'C-P06', presentation: 'C-P09' },
  talent: { whitespace: 'T-P03', review: 'T-P04', presentation: 'T-P05' },
};

export function behaviorOn(formId, state, key) {
  const reqId = BEHAVIOR_REQS[formId][key];
  if (!reqId) return false;
  return !isDroppedStatus(statusLookup(state, formId)(reqId));
}

// --- Kararlar ----------------------------------------------------------------

export function decisionApplies(decision, branch) {
  if (!decision.branch || decision.branch === 'all') return true;
  return decision.branch === branch;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function addedFieldId(decisionId) {
  return `ek_${decisionId.replace(/[^A-Za-z0-9]/g, '_')}`;
}

// --- Etkin şema --------------------------------------------------------------

/**
 * @param {string} formId
 * @param {object} state  uygulama durumu
 * @param {string|null} branch  Cari için 'issue' | 'receive' | null
 * @returns {{sections: object[], fieldsById: Map}}
 */
export function effectiveForm(formId, state, branch) {
  const form = getForm(formId);
  const statusOf = statusLookup(state, formId);
  const decisions = (state.forms[formId].decisions || []).filter((d) => decisionApplies(d, branch));
  const sections = clone(form.sections);

  for (const section of sections) {
    for (const group of section.groups || []) {
      for (const field of group.fields) {
        field.sectionId = section.id;
        field.changedBy = [];
        if (field.optionsByBranch) field.options = branch ? field.optionsByBranch[branch] || [] : [];
        if (field.helpByBranch) field.help = branch ? field.helpByBranch[branch] || '' : '';
        if (!field.placeholder && field.type === 'text') field.placeholder = DEFAULT_PLACEHOLDER;
        if (!field.placeholder && field.type === 'select') field.placeholder = SELECT_PLACEHOLDER;
        field.proposalStatus = field.proposalReq ? statusOf(field.proposalReq) : null;
        field.removed = Boolean(field.proposalReq && isDroppedStatus(field.proposalStatus));
      }
    }
  }

  const fieldIndex = () => {
    const map = new Map();
    for (const section of sections) {
      for (const group of section.groups || []) for (const field of group.fields) map.set(field.id, field);
    }
    return map;
  };

  let index = fieldIndex();
  for (const decision of decisions) {
    const change = decision.change || { kind: 'none' };
    if (change.kind === 'modify' && index.has(change.fieldId)) {
      const field = index.get(change.fieldId);
      const patch = change.patch || {};
      if (patch.label) field.label = patch.label;
      if (patch.help !== undefined && patch.help !== '') field.help = patch.help;
      if (patch.placeholder) field.placeholder = patch.placeholder;
      if (patch.required === 'required') field.required = true;
      if (patch.required === 'optional') field.required = false;
      if (Array.isArray(patch.options) && patch.options.length) field.options = patch.options.slice();
      if (patch.removed) field.removed = true;
      if (patch.restore) field.removed = false;
      field.changedBy.push(decision.id);
    } else if (change.kind === 'add' && change.add) {
      const target = sections.find((s) => s.id === change.add.sectionId && s.kind === 'fields');
      if (!target) continue;
      const add = change.add;
      const field = {
        id: addedFieldId(decision.id),
        label: add.label || 'Yeni alan',
        type: ['text', 'textarea', 'radio', 'select', 'file'].includes(add.type) ? add.type : 'text',
        required: Boolean(add.required),
        help: add.help || '',
        options: Array.isArray(add.options) ? add.options.slice() : [],
        placeholder: add.type === 'select' ? SELECT_PLACEHOLDER : add.type === 'text' ? DEFAULT_PLACEHOLDER : '',
        file: add.type === 'file' ? { maxFiles: 1, maxSizeMB: add.maxSizeMB || null, accept: add.accept || null, acceptLabel: add.accept || null } : undefined,
        source: 'KARAR',
        ref: decision.id,
        reqs: decision.reqIds || [],
        addedBy: decision.id,
        changedBy: [decision.id],
        sectionId: target.id,
      };
      const groups = target.groups;
      const lastGroup = groups[groups.length - 1];
      lastGroup.fields.push(field);
      index = fieldIndex();
    }
  }

  return { sections, fieldsById: index };
}

export function sectionFields(section, { includeRemoved = false } = {}) {
  const out = [];
  for (const group of section.groups || []) {
    for (const field of group.fields) if (includeRemoved || !field.removed) out.push(field);
  }
  return out;
}

export function sectionShown(section, ui) {
  if (!section.condition || !section.condition.unknown) return true;
  const sim = ui && ui.simulate ? ui.simulate[section.id] : undefined;
  return sim === undefined ? section.condition.defaultShown : Boolean(sim);
}

// Seçenek değerleri: belgede tanımlı seçenekler + prototip yer tutucuları.
export function optionValues(field) {
  const values = (field.options || []).slice();
  for (const opt of field.prototypeOptions || []) values.push(opt.value);
  return values;
}

// --- Belirsizlik bayrakları -------------------------------------------------

export function flagActive(flag, values, branch) {
  const when = flag.when || { always: true };
  if (when.always) return true;
  if (when.branch) return when.branch === branch;
  if (when.field) {
    const value = values[when.field];
    if (when.equals !== undefined) return value === when.equals;
    if (when.in) return when.in.includes(value);
  }
  return false;
}

export function describeFlagCondition(flag, fieldsById, branchLabels) {
  const when = flag.when || { always: true };
  if (when.always) return 'Her durumda';
  if (when.branch) return `Branş "${branchLabels[when.branch]}" iken`;
  if (when.field) {
    const label = fieldsById && fieldsById.get(when.field) ? fieldsById.get(when.field).label : when.field;
    if (when.equals !== undefined) return `"${label}" = "${displayValue(fieldsById && fieldsById.get(when.field), when.equals)}" iken`;
    if (when.in) return `"${label}" şu değerlerden biri iken: ${when.in.map((v) => `"${v}"`).join(', ')}`;
  }
  return 'Koşul belirtilmemiş';
}

export function displayValue(field, value) {
  if (!field) return value;
  const proto = (field.prototypeOptions || []).find((o) => o.value === value);
  return proto ? proto.label : value;
}

// --- Geri bildirim / karar hedefleri ----------------------------------------

export function sectionTitle(section) {
  if (section.kind === 'missing') return `${section.pageLabel} — ${section.title}`;
  return section.pageLabel === section.title ? section.title : `${section.pageLabel} — ${section.title}`;
}

// Seçim listelerinde kullanılan hedefler: bölümler ve alanlar (kararla eklenenler dahil).
export function targetOptions(formId, state) {
  const form = getForm(formId);
  const out = [{ value: '', label: 'Genel (belirli bir alan/bölüm yok)', group: 'Genel' }];
  out.push({ value: 'section:header', label: 'Form üst bilgisi (başlık, giriş ve bilgilendirme metinleri)', group: 'Bölümler' });
  if (form.hasBranches) out.push({ value: 'section:yon', label: 'Adım 0 — Fatura yönü (ilk soru)', group: 'Bölümler' });
  for (const s of form.sections) out.push({ value: `section:${s.id}`, label: sectionTitle(s), group: 'Bölümler' });
  out.push({ value: 'section:review', label: 'Gözden geçir ve gönder adımı', group: 'Bölümler' });
  if (form.hasBranches) out.push({ value: `field:${form.branchQuestion.fieldId}`, label: form.branchQuestion.label, group: 'Alanlar' });
  const seen = new Set();
  const branches = form.hasBranches ? ['issue', 'receive'] : [null];
  for (const b of branches) {
    for (const section of effectiveForm(formId, state, b).sections) {
      for (const field of sectionFields(section, { includeRemoved: true })) {
        if (seen.has(field.id)) continue;
        seen.add(field.id);
        out.push({ value: `field:${field.id}`, label: `${field.label}${field.addedBy ? ' (kararla eklendi)' : ''} · ${section.pageLabel}`, group: 'Alanlar' });
      }
    }
  }
  return out;
}

export function targetLabel(formId, state, target) {
  if (!target) return 'Genel';
  const hit = targetOptions(formId, state).find((o) => o.value === target);
  return hit ? hit.label : target;
}

// Yön değişince yeni branşta geçersiz kalan seçimleri bulur (C-P06 davranışı).
export function invalidChoicesAfterBranchChange(formId, state, newBranch) {
  const { sections } = effectiveForm(formId, state, newBranch);
  const values = state.forms[formId].answers.values;
  const cleared = [];
  for (const section of sections) {
    for (const field of sectionFields(section)) {
      if ((field.type === 'radio' || field.type === 'select') && values[field.id]) {
        if (!optionValues(field).includes(values[field.id])) cleared.push(field);
      }
    }
  }
  return cleared;
}
