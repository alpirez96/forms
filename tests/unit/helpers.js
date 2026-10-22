import { defaultState } from '../../src/core/state.js';

export function freshState() {
  return defaultState();
}

export function addDecision(state, formId, decision) {
  const fs = state.forms[formId];
  fs.counters.decision += 1;
  const id = decision.id || `K-${formId === 'cari' ? 'C' : 'T'}-${String(fs.counters.decision).padStart(3, '0')}`;
  const full = { id, form: formId, branch: 'all', title: '', text: 'Karar', implications: '', reqIds: [], target: '', change: { kind: 'none' }, sourceFeedbackId: '', ...decision };
  fs.decisions.push(full);
  return full;
}

export function addFeedback(state, formId, item) {
  const fs = state.forms[formId];
  fs.counters.feedback += 1;
  const id = item.id || `GB-${formId === 'cari' ? 'C' : 'T'}-${String(fs.counters.feedback).padStart(3, '0')}`;
  const full = { id, form: formId, branch: formId === 'cari' ? 'all' : '', target: '', category: 'diger', description: 'Not', expected: '', status: 'acik', priority: '', decisionId: '', ...item };
  fs.feedback.push(full);
  return full;
}

export function setStatus(state, formId, reqId, status, note = '') {
  const store = reqId.startsWith('S-') ? state.shared.reqStatus : state.forms[formId].reqStatus;
  store[reqId] = { status, note };
}
