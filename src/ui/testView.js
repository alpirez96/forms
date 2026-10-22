// "Formu test et" ekranı: formun kendisi (sol) ve test notları (sağ).

import { FORMS } from '../data/registry.js';
import { SOURCES, BRANCHES, REQUIRED_MESSAGE } from '../data/enums.js';
import {
  effectiveForm, sectionFields, statusLookup, behaviorOn, flagActive, displayValue,
  invalidChoicesAfterBranchChange, isMandatoryStatus, sectionTitle, routedSectionIds, routeAnswersFor, routeGroups,
} from '../core/schema.js';
import { validateFields, validateField, fileErrors } from '../core/validation.js';
import { h, clear, button, badge, toast, confirmDialog } from './dom.js';
import { openFeedbackDialog } from './feedbackView.js';

// --- Adımlar -----------------------------------------------------------------

export function stepsFor(formId, state) {
  const form = FORMS[formId];
  const fs = state.forms[formId];
  const steps = [];
  if (form.hasBranches) steps.push({ id: 'yon', kind: 'branch', label: 'Fatura yönü', short: 'Adım 0' });
  for (const id of routedSectionIds(form, fs.answers.values).ids) {
    const s = form.sections.find((x) => x.id === id);
    steps.push({ id: s.id, kind: 'section', label: s.title, short: s.pageLabel });
  }
  if (behaviorOn(formId, state, 'review')) steps.push({ id: 'review', kind: 'review', label: 'Gözden geçir', short: 'Son adım' });
  return steps;
}

// Bir sayfadan sonra yönlendirmeye göre ne geldiği (notlar için).
function nextAfter(form, sectionId) {
  for (const g of routeGroups(form)) {
    const i = g.path.indexOf(sectionId);
    if (i < 0) continue;
    const next = g.path[i + 1];
    return next ? sectionTitle(form.sections.find((s) => s.id === next)) : null;
  }
  return null;
}

export function stepForField(formId, state, fieldId) {
  const form = FORMS[formId];
  if (form.hasBranches && fieldId === form.branchQuestion.fieldId) return 'yon';
  for (const b of form.hasBranches ? ['issue', 'receive'] : [null]) {
    for (const s of effectiveForm(formId, state, b).sections) {
      if (sectionFields(s, { includeRemoved: true }).some((f) => f.id === fieldId)) return s.id;
    }
  }
  return null;
}

function currentStep(formId, state) {
  const steps = stepsFor(formId, state);
  const fs = state.forms[formId];
  let idx = steps.findIndex((s) => s.id === fs.ui.step);
  // Yol dışında kalan bir sayfadaysak (ör. yanıt değişti) ilk form sayfasına dön.
  if (idx < 0) idx = Math.max(0, steps.findIndex((s) => s.kind === 'section'));
  if (FORMS[formId].hasBranches && !fs.answers.branch) idx = 0;
  return { steps, idx, step: steps[idx] };
}

function validationOpts(formId, state) {
  return { whitespaceIsEmpty: behaviorOn(formId, state, 'whitespace') };
}

function validateStep(formId, state, stepId) {
  const fs = state.forms[formId];
  const form = FORMS[formId];
  if (stepId === 'yon') {
    const ok = Boolean(fs.answers.branch);
    return { results: {}, errors: ok ? [] : [{ fieldId: 'faturaYonu', label: form.branchQuestion.label, message: REQUIRED_MESSAGE }] };
  }
  if (stepId === 'review') return { results: {}, errors: [] };
  const eff = effectiveForm(formId, state, fs.answers.branch);
  const section = eff.sections.find((s) => s.id === stepId);
  if (!section) return { results: {}, errors: [] };
  const fields = sectionFields(section);
  const { results } = validateFields(fields, fs.answers, statusLookup(state, formId), validationOpts(formId, state));
  const errors = [];
  for (const f of fields) for (const m of results[f.id].errors) errors.push({ fieldId: f.id, label: f.label, message: m });
  return { results, errors };
}

// --- Ana görünüm -------------------------------------------------------------

export function renderTestView(app, main) {
  const { formId, form, fs, state } = { formId: app.formId, form: app.form, fs: app.fs, state: app.state };
  const { steps, idx, step } = currentStep(formId, state);
  const branch = fs.answers.branch;
  const showNotes = fs.ui.showNotes !== false;
  const submitted = app.transient.submitted[formId];

  main.append(testToolbar(app, step));
  const layout = h('div', { class: `test-layout ${showNotes ? '' : 'notes-hidden'}` });
  const formCol = h('div', { class: 'form-col' });
  const notesCol = showNotes ? h('aside', { class: 'notes-col', 'aria-label': 'Test notları' }) : null;
  layout.append(formCol, notesCol || '');
  main.append(layout);

  const card = h('div', { class: 'form-card' });
  formCol.append(card);
  card.append(formHeader(app, idx === 0));

  if (submitted) {
    card.append(successPanel(app));
    if (notesCol) notesCol.append(notesForStep(app, { id: 'review', kind: 'review', label: 'Gönderim' }));
    return;
  }

  card.append(stepper(app, steps, idx));
  if (form.hasBranches && branch && step.id !== 'yon') card.append(branchChip(app));

  const attempted = Boolean(app.transient.attempted[formId][step.id]);
  const validation = attempted ? validateStep(formId, state, step.id) : null;
  if (validation && validation.errors.length) card.append(errorSummary(validation.errors));

  const body = h('div', { class: 'step-body' });
  card.append(body);
  if (step.kind === 'branch') body.append(branchStep(app, attempted));
  else if (step.kind === 'review') body.append(reviewStep(app));
  else body.append(sectionStep(app, step.id, validation));

  card.append(navBar(app, steps, idx));
  if (notesCol) notesCol.append(notesForStep(app, step));

  if (app.transient.focusFirstError) {
    app.transient.focusFirstError = false;
    setTimeout(() => {
      const target = main.querySelector('[aria-invalid="true"]') || document.getElementById('error-summary');
      if (target) target.focus();
    }, 0);
  }
  if (app.transient.highlight) {
    const id = app.transient.highlight;
    app.transient.highlight = null;
    setTimeout(() => {
      const el = document.getElementById(`fld-${id}`);
      if (el) {
        el.classList.add('highlight');
        el.scrollIntoView({ block: 'center' });
        setTimeout(() => el.classList.remove('highlight'), 2500);
      }
    }, 0);
  }
}

// --- Araç çubuğu -------------------------------------------------------------

function testToolbar(app, step) {
  const fs = app.fs;
  const notesId = `toggle-notes-${app.formId}`;
  return h(
    'div',
    { class: 'test-toolbar', role: 'toolbar', 'aria-label': 'Test araçları' },
    h('span', { class: 'toolbar-label' }, 'Test araçları:'),
    button('Örnek veri doldur', () => fillSample(app), { small: true, id: 'btn-sample', title: 'Açıkça "ÖRNEK" olarak işaretlenmiş sahte veri doldurur' }),
    button('Senaryoyu sıfırla', () => resetScenario(app), { small: true, id: 'btn-reset' }),
    button('Bu adım için not ekle', () => openFeedbackDialog(app, { form: app.formId, branch: fs.answers.branch || 'all', target: step && step.id !== 'yon' ? `section:${step.id}` : 'section:yon' }), { small: true, id: 'btn-step-feedback' }),
    h(
      'label',
      { class: 'switch', for: notesId },
      h('input', {
        type: 'checkbox',
        id: notesId,
        checked: fs.ui.showNotes !== false,
        onchange: (e) => app.commit(() => {
          fs.ui.showNotes = e.target.checked;
        }),
      }),
      ' Test notlarını göster',
    ),
  );
}

function fillSample(app) {
  const form = app.form;
  const fs = app.fs;
  if (form.hasBranches && !fs.answers.branch) {
    toast('Önce fatura yönünü seçin; örnek veri seçilen yöne göre doldurulur.', 'warn');
    return;
  }
  app.commit(() => {
    Object.assign(fs.answers.values, form.sampleAnswers.common);
    if (form.sampleAnswers.byBranch && fs.answers.branch) Object.assign(fs.answers.values, form.sampleAnswers.byBranch[fs.answers.branch]);
    for (const [id, meta] of Object.entries(form.sampleAnswers.files || {})) fs.answers.files[id] = { ...meta };
    app.transient.submitted[app.formId] = null;
  });
  toast('ÖRNEK veri dolduruldu. Bu veriler sahtedir ve kaynak belgelerden alınmamıştır.', 'success');
}

async function resetScenario(app) {
  const ok = await confirmDialog({ title: 'Senaryoyu sıfırla', message: 'Bu formdaki test yanıtları, adım ilerlemesi ve simülasyon anahtarları sıfırlanır. Geri bildirimler, kararlar ve gereksinim durumları korunur.', confirmText: 'Sıfırla', danger: true });
  if (!ok) return;
  app.transient.attempted[app.formId] = {};
  app.transient.submitted[app.formId] = null;
  app.commit(() => {
    const fs = app.fs;
    fs.answers = { branch: null, values: {}, files: {} };
    fs.ui.step = app.form.hasBranches ? 'yon' : 't1';
    fs.ui.visited = {};
  });
  toast('Test senaryosu sıfırlandı.');
}

async function clearForm(app) {
  const ok = await confirmDialog({ title: 'Formu temizle', message: 'Bu formdaki tüm yanıtlar silinsin mi?', confirmText: 'Formu temizle', danger: true });
  if (!ok) return;
  app.transient.attempted[app.formId] = {};
  app.commit(() => {
    app.fs.answers = { branch: null, values: {}, files: {} };
    app.fs.ui.step = app.form.hasBranches ? 'yon' : 't1';
  });
}

// --- Form üst bilgisi ---------------------------------------------------------

function noteBox(app, req, text, tone = 'amber') {
  return h(
    'div',
    { class: `note note-${tone}` },
    h('button', { type: 'button', class: 'req-link', onclick: () => app.goToRequirement(req) }, req),
    ' ',
    text,
  );
}

function formHeader(app, full) {
  const { form, fs } = app;
  const hd = form.header;
  const showNotes = fs.ui.showNotes !== false;
  const statusOf = statusLookup(app.state, app.formId);
  const el = h('div', { class: 'form-header' }, h('h2', { class: 'form-title' }, hd.title));
  if (!full) return el;
  if (hd.intro) el.append(h('p', {}, hd.intro));
  if (hd.notices && hd.notices.length) {
    el.append(h('p', { class: 'strong' }, hd.noticeTitle));
    el.append(
      h(
        'ul',
        { class: 'notice-list' },
        hd.notices.map((n) =>
          h('li', {}, h('strong', {}, n.title), ' ', n.text, n.email ? h('ul', {}, h('li', {}, h('a', { href: `mailto:${n.email}` }, n.email))) : null),
        ),
      ),
    );
    if (showNotes && hd.noticeFlag && !isMandatoryStatus(statusOf(hd.noticeFlag.req))) {
      el.append(noteBox(app, hd.noticeFlag.req, hd.noticeFlag.text));
    }
  }
  if (hd.privacy) {
    el.append(
      h(
        'p',
        {},
        hd.privacy.before,
        h('a', { href: hd.privacy.url, target: '_blank', rel: 'noopener noreferrer', id: 'privacy-link' }, hd.privacy.link),
      ),
    );
    if (showNotes) el.append(noteBox(app, hd.privacy.flag.req, hd.privacy.flag.text));
  }
  el.append(h('p', { class: 'req-legend' }, hd.requiredLegend));
  return el;
}

// --- Adım göstergesi ----------------------------------------------------------

function stepper(app, steps, idx) {
  const fs = app.fs;
  const visited = fs.ui.visited || {};
  const locked = app.form.hasBranches && !fs.answers.branch;
  const route = routedSectionIds(app.form, fs.answers.values);
  const firstSection = steps.findIndex((s) => s.kind === 'section');
  const list = h('ol', { class: 'stepper', 'aria-label': `Adım ${idx + 1} / ${steps.length}` });
  steps.forEach((s, i) => {
    const reachable = i === 0 || (!locked && (visited[s.id] || i <= idx));
    const state = i === idx ? 'current' : visited[s.id] || i < idx ? 'done' : '';
    list.append(
      h(
        'li',
        { class: `step ${state}` },
        h(
          'button',
          {
            type: 'button',
            class: 'step-btn',
            disabled: !reachable,
            'aria-current': i === idx ? 'step' : null,
            onclick: () => goToStep(app, s.id),
          },
          h('span', { class: 'step-num' }, String(i + 1)),
          h('span', { class: 'step-label' }, s.kind === 'section' ? `${s.short} · ${s.label}` : s.label),
        ),
      ),
    );
    // Yönlendirme sorusu yanıtlanmadan ilk sayfadan sonraki sayfalar bilinmez.
    if (i === firstSection && (route.pending || route.unmapped)) {
      const routeField = effectiveForm(app.formId, app.state, fs.answers.branch).fieldsById.get(app.form.routing.fieldId);
      const text = route.pending ? `Sonraki sayfalar "${routeField.label}" yanıtına göre belirlenir` : `Bu "${routeField.label}" yanıtı için yönlendirme tanımlı değil`;
      list.append(h('li', { class: 'step pending', title: text }, h('span', { class: 'step-num' }, '…'), h('span', { class: 'step-label' }, text)));
    }
  });
  return h('div', { class: 'stepper-wrap' }, h('p', { class: 'step-count' }, `Adım ${idx + 1} / ${steps.length}`), list);
}

function goToStep(app, stepId) {
  app.commit(() => {
    app.fs.ui.step = stepId;
    app.fs.ui.visited = { ...(app.fs.ui.visited || {}), [stepId]: true };
  });
  window.scrollTo(0, 0);
}

function branchChip(app) {
  const branch = app.fs.answers.branch;
  return h(
    'div',
    { class: 'branch-chip' },
    h('span', {}, 'Fatura yönü: '),
    h('strong', {}, BRANCHES[branch]),
    button('Değiştir', () => goToStep(app, 'yon'), { small: true, variant: 'ghost', id: 'btn-change-branch' }),
  );
}

function errorSummary(errors) {
  return h(
    'div',
    { class: 'error-summary', role: 'alert', id: 'error-summary', tabindex: '-1' },
    h('h3', {}, `Lütfen ${errors.length} hatayı düzeltin`),
    h(
      'ul',
      {},
      errors.map((e) =>
        h('li', {}, h('a', { href: `#in-${e.fieldId}`, onclick: (ev) => {
          ev.preventDefault();
          const el = document.getElementById(`in-${e.fieldId}`) || document.querySelector(`[name="in-${e.fieldId}"]`);
          if (el) el.focus();
        } }, `${e.label}: ${e.message}`)),
      ),
    ),
  );
}

// --- Adım 0: fatura yönü ------------------------------------------------------

function branchStep(app, attempted) {
  const { form, fs } = app;
  const bq = form.branchQuestion;
  const showNotes = fs.ui.showNotes !== false;
  const invalid = attempted && !fs.answers.branch;
  const fieldset = h(
    'fieldset',
    { class: `question branch-question ${invalid ? 'invalid' : ''}`, id: 'fld-faturaYonu', 'aria-describedby': invalid ? 'err-faturaYonu' : null },
    h('legend', {}, bq.label, h('span', { class: 'req', 'aria-hidden': 'true' }, ' *')),
  );
  if (showNotes) {
    fieldset.append(h('div', { class: 'field-meta' }, chipSource('BRIEF', 'Cari Form, Bölüm A'), ...bq.reqs.map((r) => reqChip(app, r))));
  }
  const cards = h('div', { class: 'branch-cards' });
  bq.options.forEach((opt, i) => {
    const id = i === 0 ? 'in-faturaYonu' : `in-faturaYonu-${i}`;
    const checked = fs.answers.branch === opt.value;
    cards.append(
      h(
        'label',
        { class: `branch-card ${checked ? 'selected' : ''}`, for: id },
        h('input', { type: 'radio', name: 'in-faturaYonu', id, value: opt.value, checked, 'aria-invalid': invalid ? 'true' : null, onchange: () => setBranch(app, opt.value) }),
        h('span', { class: 'branch-card-title' }, opt.label),
        showNotes ? h('span', { class: 'branch-card-hint' }, opt.hint) : null,
      ),
    );
  });
  fieldset.append(cards);
  if (invalid) fieldset.append(h('p', { class: 'field-error', id: 'err-faturaYonu' }, REQUIRED_MESSAGE));
  fieldset.append(fieldNoteButton(app, 'faturaYonu', bq.label));
  return fieldset;
}

function setBranch(app, value) {
  const formId = app.formId;
  const fs = app.fs;
  const prev = fs.answers.branch;
  if (prev === value) return;
  let cleared = [];
  if (prev && behaviorOn(formId, app.state, 'clearOnBranch')) {
    const probe = { ...app.state, forms: { ...app.state.forms, [formId]: fs } };
    cleared = invalidChoicesAfterBranchChange(formId, probe, value);
  }
  app.transient.submitted[formId] = null;
  app.commit(() => {
    fs.answers.branch = value;
    for (const f of cleared) delete fs.answers.values[f.id];
    app.transient.attempted[formId].yon = false;
  });
  if (cleared.length) toast(`${cleared.map((f) => `"${f.label}"`).join(', ')} seçimi yeni fatura yönünde geçerli olmadığı için temizlendi (C-P06).`, 'warn');
}

// --- Bölüm adımı --------------------------------------------------------------

function sectionStep(app, sectionId, validation) {
  const { formId, fs } = app;
  const eff = effectiveForm(formId, app.state, fs.answers.branch);
  const section = eff.sections.find((s) => s.id === sectionId);
  const showNotes = fs.ui.showNotes !== false;
  const wrap = h('section', { class: 'form-section', 'aria-labelledby': `sec-${sectionId}` });
  wrap.append(h('div', { class: 'section-head' }, h('p', { class: 'page-label' }, section.pageLabel), h('h3', { id: `sec-${sectionId}`, class: 'section-title' }, section.title)));
  if (showNotes && section.titleNote) wrap.append(h('p', { class: 'meta-note' }, section.titleNote));
  const groupingOn = behaviorOn(formId, app.state, 'presentation');
  for (const group of section.groups) {
    const fields = group.fields.filter((f) => !f.removed);
    if (!fields.length) continue;
    const g = h('div', { class: 'field-group' });
    if (group.title && groupingOn) g.append(h('h4', { class: 'group-title' }, group.title));
    for (const field of fields) g.append(renderField(app, field, validation ? validation.results[field.id] : null));
    wrap.append(g);
  }
  return wrap;
}

function chipSource(sourceId, ref) {
  return h('span', { class: 'chip chip-source', title: SOURCES[sourceId] ? SOURCES[sourceId].title : sourceId }, `${sourceId}${ref ? ` · ${ref}` : ''}`);
}

function reqChip(app, reqId) {
  return h('button', { type: 'button', class: 'chip chip-req', onclick: () => app.goToRequirement(reqId), title: 'Gereksinimi göster' }, reqId);
}

function fieldNoteButton(app, fieldId, label) {
  return h(
    'button',
    {
      type: 'button',
      class: 'note-btn',
      'aria-label': `"${label}" için geri bildirim ekle`,
      title: 'Bu alan için geri bildirim ekle',
      onclick: () => openFeedbackDialog(app, { form: app.formId, branch: app.fs.answers.branch || 'all', target: `field:${fieldId}` }),
    },
    'Not',
  );
}

function fileSize(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function liveResult(app, field) {
  const fs = app.fs;
  return validateField(field, fs.answers.values[field.id], fs.answers.files[field.id], statusLookup(app.state, app.formId), validationOpts(app.formId, app.state));
}

function feedbackBlock(field, result, showNotes) {
  const block = h('div', { class: 'field-feedback', id: `fb-${field.id}`, 'aria-live': 'polite' });
  if (!result) return block;
  result.errors.forEach((m, i) => block.append(h('p', { class: 'field-error', id: i === 0 ? `err-${field.id}` : null }, m)));
  if (showNotes) {
    for (const w of result.warnings) block.append(h('p', { class: 'field-warning' }, h('strong', {}, `Öneri (${w.req}, engellemez): `), w.message));
  }
  return block;
}

function renderField(app, field, result) {
  const { formId, fs } = app;
  const showNotes = fs.ui.showNotes !== false;
  const value = fs.answers.values[field.id] ?? '';
  const statusOf = statusLookup(app.state, formId);
  // Uyarılar her zaman canlı gösterilir; hatalar yalnızca adım denendikten sonra.
  const live = liveResult(app, field);
  const shown = result || (live.warnings.length ? { errors: [], warnings: live.warnings } : null);
  const invalid = Boolean(result && result.errors.length);
  const inputId = `in-${field.id}`;
  const describedBy = [field.help ? `help-${field.id}` : null, invalid ? `err-${field.id}` : null].filter(Boolean).join(' ') || null;

  const wrapper = h(field.type === 'radio' ? 'fieldset' : 'div', {
    class: `question ${invalid ? 'invalid' : ''} ${field.proposalReq ? 'proposed' : ''} ${field.addedBy ? 'added' : ''}`,
    id: `fld-${field.id}`,
  });
  const labelText = [field.label, field.required ? h('span', { class: 'req', 'aria-hidden': 'true' }, ' *') : null];
  const head = h('div', { class: `question-head ${field.type === 'radio' ? 'floating' : ''}` });
  if (field.type === 'radio') wrapper.append(h('legend', { class: 'question-label' }, ...labelText));
  else head.append(h('label', { class: 'question-label', for: inputId }, ...labelText));
  head.append(fieldNoteButton(app, field.id, field.label));
  wrapper.append(head);
  if (field.help) wrapper.append(h('p', { class: 'question-help', id: `help-${field.id}` }, field.help));

  if (showNotes) {
    const meta = h('div', { class: 'field-meta' });
    if (field.addedBy) meta.append(badge(`Kararla eklendi: ${field.addedBy}`, 'blue'));
    else meta.append(chipSource(field.source, field.ref));
    for (const r of field.reqs || []) meta.append(reqChip(app, r));
    if (field.changedBy && field.changedBy.length && !field.addedBy) meta.append(badge(`Kararla değişti: ${field.changedBy.join(', ')}`, 'blue'));
    if (field.proposalReq && !isMandatoryStatus(statusOf(field.proposalReq))) meta.append(badge('Önerilen alan — onay bekliyor', 'purple'));
    if (field.labelNote) meta.append(h('span', { class: 'meta-note inline' }, field.labelNote));
    if (field.optionsByBranch) meta.append(badge('Seçenekler fatura yönüne göre değişir', 'teal'));
    if (app.form.routing && field.id === app.form.routing.fieldId) meta.append(badge('Seçim sonraki sayfaları belirler', 'teal'));
    if (field.maxLength) meta.append(badge(`En fazla ${field.maxLength} karakter`, 'gray', 'Canlı formdaki yanıt doğrulaması (DOC-D)'));
    wrapper.append(meta);
    for (const flag of field.flags || []) {
      const st = statusOf(flag.req);
      if (isMandatoryStatus(st) || st === 'reddedildi' || st === 'ertelendi') continue;
      if (!flagActive(flag, fs.answers.values, fs.answers.branch)) continue;
      if (flag.req === field.proposalReq) continue;
      wrapper.append(noteBox(app, flag.req, flag.text));
    }
  }

  const refreshFeedback = () => {
    const old = document.getElementById(`fb-${field.id}`);
    if (!old) return;
    const attempted = app.transient.attempted[formId][field.sectionId];
    const res = liveResult(app, field);
    const next = feedbackBlock(field, attempted ? res : { errors: [], warnings: res.warnings }, showNotes);
    old.replaceWith(next);
    const input = document.getElementById(inputId);
    const bad = attempted && res.errors.length > 0;
    if (input) input.setAttribute('aria-invalid', bad ? 'true' : 'false');
    wrapper.classList.toggle('invalid', bad);
  };

  if (field.type === 'text' || field.type === 'textarea') {
    const input = h(field.type === 'textarea' ? 'textarea' : 'input', {
      type: field.type === 'text' ? 'text' : null,
      rows: field.type === 'textarea' ? 3 : null,
      id: inputId,
      class: 'input',
      value,
      placeholder: field.placeholder || null,
      inputmode: field.inputMode || null,
      autocomplete: 'off',
      'aria-invalid': invalid ? 'true' : 'false',
      'aria-describedby': describedBy,
      'aria-required': field.required ? 'true' : null,
    });
    input.addEventListener('input', () => {
      fs.answers.values[field.id] = input.value;
      app.transient.submitted[formId] = null;
      app.save();
      refreshFeedback();
    });
    wrapper.append(input);
  } else if (field.type === 'radio') {
    const group = h('div', { class: 'radio-group', role: 'radiogroup', 'aria-describedby': describedBy });
    field.options.forEach((opt, i) => {
      const id = i === 0 ? inputId : `${inputId}-${i}`;
      group.append(
        h(
          'label',
          { class: 'radio', for: id },
          h('input', { type: 'radio', name: inputId, id, value: opt, checked: value === opt, 'aria-invalid': invalid ? 'true' : 'false', onchange: () => setValue(app, field.id, opt) }),
          h('span', {}, opt),
        ),
      );
    });
    wrapper.append(group);
    if (field.clearable && value) wrapper.append(button('Seçimi temizle', () => setValue(app, field.id, ''), { small: true, variant: 'ghost', id: `clear-${field.id}` }));
  } else if (field.type === 'select') {
    const sel = h('select', { id: inputId, class: 'input select', 'aria-invalid': invalid ? 'true' : 'false', 'aria-describedby': describedBy, 'aria-required': field.required ? 'true' : null, onchange: (e) => setValue(app, field.id, e.target.value) });
    sel.append(h('option', { value: '' }, field.placeholder || 'Seçin'));
    for (const opt of field.options || []) sel.append(h('option', { value: opt }, opt));
    for (const opt of field.prototypeOptions || []) sel.append(h('option', { value: opt.value }, opt.label));
    sel.value = value;
    wrapper.append(sel);
  } else if (field.type === 'file') {
    const meta = fs.answers.files[field.id];
    const input = h('input', { type: 'file', id: inputId, class: 'file-input', accept: field.file && field.file.accept ? field.file.accept : null, 'aria-invalid': invalid ? 'true' : 'false', 'aria-describedby': describedBy });
    input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const next = { name: file.name, size: file.size, type: file.type };
      const problems = fileErrors(field, next);
      app.transient.submitted[formId] = null;
      app.commit(() => {
        fs.answers.files[field.id] = next;
      });
      if (problems.length) toast(problems.join(' '), 'error');
    });
    wrapper.append(
      h(
        'div',
        { class: 'file-row' },
        h('label', { class: 'btn btn-sm file-btn', for: inputId }, meta ? 'Dosyayı değiştir' : 'Dosya ekle'),
        input,
        meta
          ? h(
            'span',
            { class: 'file-name' },
            `${meta.name} (${fileSize(meta.size)})${meta.sample ? ' — ÖRNEK, simülasyon' : ''}`,
            button('Kaldır', () => app.commit(() => {
              delete fs.answers.files[field.id];
            }), { small: true, variant: 'ghost', id: `remove-${field.id}` }),
          )
          : h('span', { class: 'file-name muted' }, 'Dosya seçilmedi'),
      ),
    );
    if (showNotes) wrapper.append(h('p', { class: 'meta-note' }, 'Prototip: dosya hiçbir yere yüklenmez ve saklanmaz; yalnızca ad, boyut ve tür kontrol edilir.'));
  }
  wrapper.append(feedbackBlock(field, shown, showNotes));
  return wrapper;
}

function setValue(app, fieldId, value) {
  app.transient.submitted[app.formId] = null;
  app.commit(() => {
    if (value === '') delete app.fs.answers.values[fieldId];
    else app.fs.answers.values[fieldId] = value;
  });
}

// --- Gözden geçir -------------------------------------------------------------

function answerText(field, fs) {
  if (field.type === 'file') {
    const meta = fs.answers.files[field.id];
    return meta ? `${meta.name} (${fileSize(meta.size)})` : '—';
  }
  const v = fs.answers.values[field.id];
  if (v === undefined || v === null || String(v).trim() === '') return '—';
  return displayValue(field, v);
}

function reviewStep(app) {
  const { formId, form, fs } = app;
  const steps = stepsFor(formId, app.state);
  const eff = effectiveForm(formId, app.state, fs.answers.branch);
  const showNotes = fs.ui.showNotes !== false;
  const wrap = h('section', { class: 'form-section review', 'aria-labelledby': 'sec-review' });
  wrap.append(h('div', { class: 'section-head' }, h('p', { class: 'page-label' }, 'Son adım'), h('h3', { id: 'sec-review', class: 'section-title' }, 'Gözden geçir ve gönder')));
  wrap.append(h('p', { class: 'muted' }, 'Yanıtlarınızı kontrol edin. Değiştirmek için ilgili bölümde "Düzenle"yi kullanın.'));
  if (form.hasBranches) {
    wrap.append(
      h('div', { class: 'review-block' },
        h('div', { class: 'review-head' }, h('h4', {}, 'Adım 0 — Fatura yönü'), button('Düzenle', () => goToStep(app, 'yon'), { small: true, variant: 'ghost', id: 'edit-yon' })),
        h('dl', { class: 'review-list' }, h('dt', {}, form.branchQuestion.label), h('dd', {}, fs.answers.branch ? BRANCHES[fs.answers.branch] : '—')),
      ),
    );
  }
  // Yol sırasıyla (ör. İstisna yolunda 5/6 → 3/6).
  for (const step of steps.filter((s) => s.kind === 'section')) {
    const section = eff.sections.find((s) => s.id === step.id);
    const dl = h('dl', { class: 'review-list' });
    for (const f of sectionFields(section)) dl.append(h('dt', {}, f.label, f.required ? ' *' : ''), h('dd', {}, answerText(f, fs)));
    wrap.append(
      h('div', { class: 'review-block' },
        h('div', { class: 'review-head' }, h('h4', {}, sectionTitle(section)), button('Düzenle', () => goToStep(app, section.id), { small: true, variant: 'ghost', id: `edit-${section.id}` })),
        dl,
      ),
    );
  }
  if (showNotes && form.routing) {
    const offPath = form.sections.filter((s) => s.kind === 'fields' && !steps.some((st) => st.id === s.id));
    if (offPath.length) {
      wrap.append(h('p', { class: 'meta-note' }, `Bu yanıtlarla gösterilmeyen sayfalar (yanıtları gönderilmez): ${offPath.map(sectionTitle).join(' · ')}.`));
    }
  }
  return wrap;
}

function submitAll(app) {
  const { formId, fs } = app;
  const steps = stepsFor(formId, app.state);
  const failing = [];
  for (const s of steps) {
    const v = validateStep(formId, app.state, s.id);
    if (v.errors.length) failing.push({ step: s, count: v.errors.length });
  }
  if (failing.length) {
    for (const f of failing) app.transient.attempted[formId][f.step.id] = true;
    const first = failing[0].step.id;
    app.transient.focusFirstError = true;
    app.commit(() => {
      fs.ui.step = first;
    });
    toast(`Gönderilemedi: ${failing.map((f) => `${f.step.short} (${f.count})`).join(', ')} bölümlerinde eksik/hatalı yanıt var.`, 'error');
    return;
  }
  app.transient.submitted[formId] = { at: new Date().toISOString() };
  app.render();
  window.scrollTo(0, 0);
}

function successPanel(app) {
  const confirmation = app.form.confirmation;
  const showNotes = app.fs.ui.showNotes !== false;
  return h(
    'div',
    { class: 'success-panel', role: 'status' },
    h('h3', { id: 'confirmation-message' }, confirmation ? confirmation.text : 'Gönderim simüle edildi'),
    confirmation && showNotes ? h('p', { class: 'meta-note' }, `Canlı formdaki onay mesajı (${confirmation.source}, ${confirmation.req}).`) : null,
    h('p', {}, 'Prototip: gönderim simüle edildi. Veriler hiçbir yere gönderilmedi, fatura veya muhasebe işlemi yapılmadı.'),
    h('p', { class: 'muted' }, 'Gerçek gönderim hedefi henüz belirlenmedi (açık soru).'),
    h(
      'div',
      { class: 'row' },
      button('Yanıtlara dön', () => {
        app.transient.submitted[app.formId] = null;
        app.render();
      }, { id: 'btn-back-to-answers' }),
      button('Yeni test senaryosu', () => {
        app.transient.submitted[app.formId] = null;
        app.transient.attempted[app.formId] = {};
        app.commit(() => {
          app.fs.answers = { branch: null, values: {}, files: {} };
          app.fs.ui.step = app.form.hasBranches ? 'yon' : 't1';
          app.fs.ui.visited = {};
        });
      }, { variant: 'primary', id: 'btn-new-scenario' }),
    ),
  );
}

// --- Gezinme ------------------------------------------------------------------

function navBar(app, steps, idx) {
  const step = steps[idx];
  const next = steps[idx + 1];
  const isLast = !next;
  const primaryLabel = isLast ? 'Gönder' : next.kind === 'review' ? 'Gözden geçir' : 'Sonraki';
  const onPrimary = () => {
    const v = validateStep(app.formId, app.state, step.id);
    if (v.errors.length) {
      app.transient.attempted[app.formId][step.id] = true;
      app.transient.focusFirstError = true;
      app.render();
      return;
    }
    if (isLast) {
      submitAll(app);
      return;
    }
    goToStep(app, next.id);
  };
  return h(
    'div',
    { class: 'nav-bar' },
    h(
      'div',
      { class: 'row' },
      idx > 0 ? button('Geri', () => goToStep(app, steps[idx - 1].id), { id: 'btn-back' }) : null,
      button(primaryLabel, onPrimary, { variant: 'primary', id: 'btn-next' }),
    ),
    h('button', { type: 'button', class: 'linklike', id: 'btn-clear-form', onclick: () => clearForm(app) }, 'Formu temizle'),
  );
}

// --- Test notları paneli ------------------------------------------------------

function notesForStep(app, step) {
  const { formId, form, fs } = app;
  const statusOf = statusLookup(app.state, formId);
  const panel = h('div', { class: 'notes' });
  panel.append(h('h2', { class: 'notes-title' }, 'Test notları'), h('p', { class: 'notes-sub' }, step.kind === 'section' ? `${step.short} · ${step.label}` : step.label));

  const sectionDef = form.sections.find((s) => s.id === step.id);
  const box = (title, ...children) => h('div', { class: 'notes-box' }, h('h3', {}, title), ...children);

  if (step.kind === 'branch') {
    panel.append(
      box(
        'Kaynak ve mantık',
        h('p', {}, 'Bu soru proje brifinden gelir (C-001) ve formun ilk adımıdır. Yanıtlanmadan diğer adımlar kilitlidir.'),
        h('p', {}, 'Eşleşme (C-003): "Fatura keseceğim" → DOCX\'teki "Fatura kesecekseniz…" kategorileri; "Bana fatura kesilecek" → "Size fatura keseceksek…" kategorileri.'),
        noteBox(app, 'C-Q06', 'Formu kim dolduruyor? Giriş metni karşı tarafa, "Talebi Gönderen Personel" DOME personeline işaret ediyor. Bu, ilk sorunun bakış açısını etkiler.'),
      ),
    );
  }

  if (sectionDef) {
    panel.append(box('Kaynak', h('p', {}, h('strong', {}, sectionDef.source), ` — ${SOURCES[sectionDef.source].title}`), h('p', { class: 'muted' }, sectionDef.ref)));
    if (step.id === 's1' && form.hasBranches) {
      const cat = form.sections[0].groups[0].fields.find((f) => f.id === 'cariTuru');
      panel.append(
        box(
          'Koşullu mantık (C-002)',
          h('p', {}, '"Cari Türü" seçenekleri fatura yönüne göre değişir:'),
          ...Object.entries(cat.optionsByBranch).map(([b, opts]) => h('p', { class: fs.answers.branch === b ? 'active-branch' : 'muted' }, h('strong', {}, `${BRANCHES[b]}: `), opts.join(' · '))),
          h('p', { class: 'muted' }, `Belgedeki eski seçenekler (kaldırıldı): ${cat.originalOptions.join(' · ')}`),
          h('p', { class: 'muted' }, 'Kategori dışındaki branş farkları belgelenmemiş (C-Q05).'),
        ),
      );
    }
    if (form.routing) {
      const routeReqs = form.routing.reqs.map((r) => h('button', { type: 'button', class: 'req-link', onclick: () => app.goToRequirement(r) }, r));
      const answers = routeAnswersFor(form, sectionDef.id);
      if (answers === null) {
        // İlk sayfa: tüm yolları göster, seçili yolu vurgula.
        const current = fs.answers.values[form.routing.fieldId];
        panel.append(
          box(
            'Sayfa yönlendirmesi',
            h('p', {}, ...routeReqs, ' "Şirket/Belge Türü" yanıtı bu sayfadan sonraki sayfaları belirler (canlı form, DOC-D):'),
            ...routeGroups(form).map((g) => h(
              'p',
              { class: g.answers.includes(current) ? 'active-branch' : 'muted' },
              h('strong', {}, `${g.answers.join(', ')}: `),
              [...g.path.map((id) => form.sections.find((s) => s.id === id).pageLabel), 'Gönder'].join(' → '),
            )),
          ),
        );
      } else {
        const next = nextAfter(form, sectionDef.id);
        panel.append(
          box(
            'Bu sayfa ne zaman gösterilir?',
            h('p', {}, ...routeReqs, ` Şirket/Belge Türü: ${answers.join(', ')}.`),
            h('p', {}, next ? `Bu sayfadan sonra: ${next}.` : 'Bu sayfadan sonra form gönderilir.'),
          ),
        );
      }
    }
    if (step.id === 's4' && formId === 'cari') {
      panel.append(box('Sayfa numarası farkı', noteBox(app, 'C-Q13', 'DOC-A ekran görüntüsünde bu sayfa "Sayfa 6/6" idi; canlı formda (DOC-D) 4/6. Form ekran görüntülerinden sonra değiştirilmiş görünüyor.')));
    }
    if (step.id === 's5' && formId === 'cari') {
      panel.append(box('Teknik bölüm', h('p', {}, h('button', { type: 'button', class: 'req-link', onclick: () => app.goToRequirement('C-045') }, 'C-045'), ' Canlı formun 6/6 bölümü boş bir "Submit" bölümüdür; bu sayfadan sonra TC Kimlik No sayfasına gitmeyi sağlar ve kullanıcıya gösterilmez.')));
    }
    const key = `${fs.answers.branch || '-'}:${sectionDef.id}`;
    const revId = `reviewed-${sectionDef.id}`;
    panel.append(
      box(
        'İnceleme',
        h('label', { class: 'switch', for: revId }, h('input', {
          type: 'checkbox',
          id: revId,
          checked: Boolean(fs.sectionReviewed[key]),
          onchange: (e) => app.commit(() => {
            if (e.target.checked) fs.sectionReviewed[key] = true;
            else delete fs.sectionReviewed[key];
          }),
        }), form.hasBranches ? ` Bu bölümü "${BRANCHES[fs.answers.branch] || '—'}" yönünde inceledim` : ' Bu bölümü inceledim'),
      ),
    );
  }

  if (step.kind === 'review') {
    const reqId = formId === 'cari' ? 'C-P07' : 'T-P04';
    panel.append(box('Gözden geçir adımı', h('p', {}, 'Bu adım belgelerde yok; analist önerisidir.'), h('p', {}, h('button', { type: 'button', class: 'req-link', onclick: () => app.goToRequirement(reqId) }, reqId), ` durumu: ${statusOf(reqId)}`), noteBox(app, formId === 'cari' ? 'C-Q09' : 'T-Q06', 'Gönderim sonrası ne olacağı ve verilerin nereye gideceği belgelerde yok.')));
  }

  // Bu adımla ilgili açık geri bildirimler
  const targets = new Set([`section:${step.id}`]);
  if (sectionDef && sectionDef.groups) for (const g of sectionDef.groups) for (const f of g.fields) targets.add(`field:${f.id}`);
  if (step.kind === 'branch') targets.add('field:faturaYonu');
  for (const d of fs.decisions) if (d.change && d.change.kind === 'add' && d.change.add && d.change.add.sectionId === step.id) targets.add(`field:ek_${d.id.replace(/[^A-Za-z0-9]/g, '_')}`);
  const related = fs.feedback.filter((f) => targets.has(f.target) && f.status === 'acik');
  panel.append(
    box(
      `Bu adımdaki açık notlar (${related.length})`,
      related.length ? h('ul', { class: 'mini-list' }, related.slice(0, 6).map((f) => h('li', {}, h('strong', {}, f.id), ' ', f.description))) : h('p', { class: 'muted' }, 'Henüz not yok.'),
      button('Not ekle', () => openFeedbackDialog(app, { form: formId, branch: fs.answers.branch || 'all', target: step.id === 'yon' ? 'section:yon' : `section:${step.id}` }), { small: true, id: 'btn-notes-feedback' }),
    ),
  );
  return panel;
}
