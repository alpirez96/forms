// Bir formun prompt üretimine hazırlık durumu.

import { getForm, requirementsFor } from '../data/registry.js';
import { statusLookup, noteLookup } from './schema.js';

export function reviewTargets(formId) {
  const form = getForm(formId);
  const sections = form.sections.filter((s) => s.kind === 'fields');
  const branches = form.hasBranches ? ['issue', 'receive'] : ['-'];
  const keys = [];
  for (const b of branches) for (const s of sections) keys.push(`${b}:${s.id}`);
  return keys;
}

export function requirementsWithStatus(formId, state) {
  const statusOf = statusLookup(state, formId);
  const noteOf = noteLookup(state, formId);
  return requirementsFor(formId).map((r) => ({ ...r, status: statusOf(r.id), note: noteOf(r.id) }));
}

export const LEVELS = {
  blocked: { label: 'Engelleyici açık soru var', detail: 'Taslak prompt üretilebilir; engellenen kısımlar promptta açıkça işaretlenir.', tone: 'red' },
  draft: { label: 'Taslak', detail: 'Açık soru, onay bekleyen öneri, açık geri bildirim veya incelenmemiş bölüm var.', tone: 'amber' },
  ready: { label: 'Hazır', detail: 'Engelleyici veya açık madde kalmadı.', tone: 'green' },
};

export function readiness(formId, state) {
  const fs = state.forms[formId];
  const reqs = requirementsWithStatus(formId, state);
  const blockers = reqs.filter((r) => r.blocker && r.status === 'acik-soru');
  const openQuestions = reqs.filter((r) => !r.blocker && r.status === 'acik-soru');
  const proposals = reqs.filter((r) => r.status === 'oneri');
  const deferred = reqs.filter((r) => r.status === 'ertelendi');
  const rejected = reqs.filter((r) => r.status === 'reddedildi');
  const openFeedback = fs.feedback.filter((f) => f.status === 'acik');
  const urgentFeedback = openFeedback.filter((f) => f.priority === 'yuksek' || f.priority === 'kritik');
  const targets = reviewTargets(formId);
  const reviewed = targets.filter((k) => fs.sectionReviewed[k]);
  let level = 'ready';
  if (blockers.length) level = 'blocked';
  else if (openQuestions.length || proposals.length || openFeedback.length || reviewed.length < targets.length || !fs.experienceConfirmed) level = 'draft';
  return {
    level,
    ...LEVELS[level],
    blockers,
    openQuestions,
    proposals,
    deferred,
    rejected,
    openFeedback,
    urgentFeedback,
    decisions: fs.decisions.length,
    reviewed: reviewed.length,
    reviewTotal: targets.length,
    experienceConfirmed: Boolean(fs.experienceConfirmed),
  };
}
