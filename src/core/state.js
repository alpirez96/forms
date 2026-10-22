// Uygulama durumu ve yerel kalıcılık (localStorage). Veritabanı veya sunucu yoktur.

import { FORM_IDS } from '../data/registry.js';

export const STORAGE_KEY = 'muhasebe-form-inceleme.v1';
export const SCHEMA_VERSION = 1;

export const ID_PREFIX = { cari: 'C', talent: 'T' };

export function emptyFormState(formId) {
  return {
    activeTab: 'test',
    answers: { branch: null, values: {}, files: {} },
    ui: { step: formId === 'cari' ? 'yon' : 't1', simulate: {}, showNotes: true },
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
  for (const id of FORM_IDS) {
    const src = (raw.forms && raw.forms[id]) || {};
    const def = base.forms[id];
    out.forms[id] = {
      ...def,
      ...src,
      answers: {
        ...def.answers,
        ...(src.answers || {}),
        values: { ...((src.answers && src.answers.values) || {}) },
        files: { ...((src.answers && src.answers.files) || {}) },
      },
      ui: { ...def.ui, ...(src.ui || {}), simulate: { ...((src.ui && src.ui.simulate) || {}) } },
      prompt: { ...def.prompt, ...(src.prompt || {}) },
      counters: { ...def.counters, ...(src.counters || {}) },
      feedback: Array.isArray(src.feedback) ? src.feedback : [],
      decisions: Array.isArray(src.decisions) ? src.decisions : [],
      reqStatus: src.reqStatus && typeof src.reqStatus === 'object' ? src.reqStatus : {},
      sectionReviewed: src.sectionReviewed && typeof src.sectionReviewed === 'object' ? src.sectionReviewed : {},
    };
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
