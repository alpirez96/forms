import cari from './cari.js';
import talent from './talent.js';
import shared from './shared.js';

export const FORMS = { cari, talent };
export const FORM_IDS = ['cari', 'talent'];
export const SHARED_REQUIREMENTS = shared;

export function getForm(formId) {
  const form = FORMS[formId];
  if (!form) throw new Error(`Bilinmeyen form: ${formId}`);
  return form;
}

export function isSharedReq(reqId) {
  return reqId.startsWith('S-');
}

// Bir formun inceleme kapsamındaki tüm gereksinimleri: kendi maddeleri + ortak maddeler.
export function requirementsFor(formId) {
  const own = getForm(formId).requirements.map((r) => ({ ...r, form: formId }));
  const common = SHARED_REQUIREMENTS.map(({ implicationsByForm, openQuestionsByForm, ...r }) => ({
    ...r,
    implications: (implicationsByForm && implicationsByForm[formId]) || r.implications,
    openQuestions: (openQuestionsByForm && openQuestionsByForm[formId]) || r.openQuestions,
    fields: r.fields[formId] || [],
  }));
  return [...own, ...common];
}

export function findRequirement(formId, reqId) {
  return requirementsFor(formId).find((r) => r.id === reqId) || null;
}

export function knownReqIds(formId) {
  return new Set(getForm(formId).requirements.map((r) => r.id));
}

export function sharedReqIds() {
  return new Set(SHARED_REQUIREMENTS.map((r) => r.id));
}
