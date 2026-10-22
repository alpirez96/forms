// Geri bildirim listesi ve ekleme/düzenleme diyaloğu. Her form kendi listesini tutar.

import { FORMS, FORM_IDS } from '../data/registry.js';
import { FEEDBACK_CATEGORIES, FEEDBACK_STATUS, PRIORITIES, BRANCH_SCOPES, FORM_LABELS } from '../data/enums.js';
import { targetOptions, targetLabel } from '../core/schema.js';
import { nextId, nowIso } from '../core/state.js';
import { h, button, badge, select, labeled, openDialog, confirmDialog, toast, formatDate } from './dom.js';
import { openDecisionDialog } from './decisionsView.js';

const STATUS_TONE = { acik: 'amber', cozuldu: 'green', ertelendi: 'gray' };
const PRIORITY_TONE = { dusuk: 'gray', orta: 'blue', yuksek: 'amber', kritik: 'red' };

export function openFeedbackDialog(app, prefill = {}, existing = null) {
  const original = existing ? { ...existing } : null;
  const draft = {
    form: existing ? existing.form : prefill.form || app.formId,
    branch: existing ? existing.branch : prefill.branch || 'all',
    target: existing ? existing.target : prefill.target || '',
    category: existing ? existing.category : prefill.category || '',
    description: existing ? existing.description : prefill.description || '',
    expected: existing ? existing.expected : prefill.expected || '',
    status: existing ? existing.status : 'acik',
    priority: existing ? existing.priority : '',
  };

  const body = h('form', { class: 'dialog-form', id: 'feedback-form', novalidate: true });
  const errorBox = h('div', { class: 'form-errors', role: 'alert' });

  const formSel = select(FORM_IDS.map((id) => ({ value: id, label: FORM_LABELS[id] })), draft.form, { id: 'fb-form' });
  const branchSel = select(Object.entries(BRANCH_SCOPES).map(([value, label]) => ({ value, label })), draft.branch || 'all', { id: 'fb-branch' });
  const branchCtl = labeled('Cari Form branşı', branchSel, { hint: 'Notun hangi fatura yönünde geçerli olduğunu seçin.' });
  const targetHolder = h('div', {});
  const buildTarget = () => {
    const sel = select(targetOptions(draft.form, app.state), draft.target, { id: 'fb-target' });
    sel.addEventListener('change', () => {
      draft.target = sel.value;
    });
    targetHolder.replaceChildren(labeled('İlgili bölüm veya alan', sel));
    branchCtl.hidden = !FORMS[draft.form].hasBranches;
  };
  formSel.addEventListener('change', () => {
    draft.form = formSel.value;
    draft.target = '';
    buildTarget();
  });
  branchSel.addEventListener('change', () => {
    draft.branch = branchSel.value;
  });
  buildTarget();

  const catSel = select([{ value: '', label: 'Kategori seçin' }, ...Object.entries(FEEDBACK_CATEGORIES).map(([value, label]) => ({ value, label }))], draft.category, { id: 'fb-category', 'aria-required': 'true' });
  const desc = h('textarea', { id: 'fb-description', rows: 4, 'aria-required': 'true' });
  desc.value = draft.description;
  const expected = h('textarea', { id: 'fb-expected', rows: 3 });
  expected.value = draft.expected;
  const statusSel = select(Object.entries(FEEDBACK_STATUS).map(([value, label]) => ({ value, label })), draft.status, { id: 'fb-status' });
  const prioSel = select(Object.entries(PRIORITIES).map(([value, label]) => ({ value, label })), draft.priority, { id: 'fb-priority' });

  body.append(
    errorBox,
    h('div', { class: 'grid-2' }, labeled('Form', formSel), branchCtl),
    targetHolder,
    h('div', { class: 'grid-2' }, labeled('Kategori', catSel, { required: true }), labeled('Öncelik (isteğe bağlı)', prioSel)),
    labeled('Açıklama', desc, { required: true, hint: 'Ne gözlemlediniz? Hangi adımda, hangi yanıtlarla?' }),
    labeled('Beklenen davranış / önerilen değişiklik', expected, { hint: 'Nasıl olmalı? Bu not onaylanana kadar gereksinim sayılmaz.' }),
    labeled('Durum', statusSel),
  );

  const save = (close) => {
    const errors = [];
    if (!catSel.value) errors.push('Kategori seçin.');
    if (!desc.value.trim()) errors.push('Açıklama girin.');
    errorBox.replaceChildren(...errors.map((e) => h('p', {}, e)));
    if (errors.length) {
      (catSel.value ? desc : catSel).focus();
      return;
    }
    const formId = formSel.value;
    const values = {
      form: formId,
      branch: FORMS[formId].hasBranches ? branchSel.value : '',
      target: draft.target,
      category: catSel.value,
      description: desc.value.trim(),
      expected: expected.value.trim(),
      status: statusSel.value,
      priority: prioSel.value,
    };
    app.commit((state) => {
      if (original && original.form === formId) {
        const item = state.forms[formId].feedback.find((f) => f.id === original.id);
        Object.assign(item, values, { updatedAt: nowIso() });
      } else {
        if (original) {
          const src = state.forms[original.form];
          src.feedback = src.feedback.filter((f) => f.id !== original.id);
        }
        const fs = state.forms[formId];
        const now = nowIso();
        fs.feedback.push({ id: nextId(fs, 'feedback', formId), ...values, decisionId: '', createdAt: now, updatedAt: now });
      }
    });
    close();
    toast(original && original.form !== formId ? `Not ${FORM_LABELS[formId]} listesine taşındı.` : 'Geri bildirim kaydedildi.', 'success');
  };

  openDialog({
    title: existing ? `Geri bildirimi düzenle — ${existing.id}` : 'Yeni geri bildirim',
    wide: true,
    body,
    actions: (close) => [button('Vazgeç', close), button('Kaydet', () => save(close), { variant: 'primary', id: 'fb-save' })],
  });
  body.addEventListener('submit', (e) => e.preventDefault());
  setTimeout(() => (draft.category ? desc : catSel).focus(), 0);
}

export function renderFeedbackView(app, main) {
  const { formId, fs } = app;
  const filter = app.transient.feedbackFilter[formId];
  const hasBranches = FORMS[formId].hasBranches;

  const setFilter = (key, value) => {
    filter[key] = value;
    app.render();
  };

  main.append(
    h(
      'div',
      { class: 'view-head' },
      h('div', {}, h('h2', {}, `Geri bildirim — ${FORM_LABELS[formId]}`), h('p', { class: 'muted' }, 'Test sırasında aldığınız notlar. Geri bildirim, siz "Karara dönüştür" demeden onaylı gereksinim sayılmaz.')),
      button('Yeni geri bildirim', () => openFeedbackDialog(app, { form: formId }), { variant: 'primary', id: 'btn-new-feedback' }),
    ),
  );

  const filters = h(
    'div',
    { class: 'filters', role: 'group', 'aria-label': 'Filtreler' },
    labeled('Durum', select([{ value: '', label: 'Tümü' }, ...Object.entries(FEEDBACK_STATUS).map(([value, label]) => ({ value, label }))], filter.status || '', { id: 'ff-status', onchange: (e) => setFilter('status', e.target.value) })),
    labeled('Kategori', select([{ value: '', label: 'Tümü' }, ...Object.entries(FEEDBACK_CATEGORIES).map(([value, label]) => ({ value, label }))], filter.category || '', { id: 'ff-category', onchange: (e) => setFilter('category', e.target.value) })),
    hasBranches ? labeled('Branş', select([{ value: '', label: 'Tümü' }, ...Object.entries(BRANCH_SCOPES).map(([value, label]) => ({ value, label }))], filter.branch || '', { id: 'ff-branch', onchange: (e) => setFilter('branch', e.target.value) })) : null,
    labeled('Ara', h('input', { type: 'search', id: 'ff-search', class: 'input', value: filter.search || '', placeholder: 'Metin veya kimlik', oninput: (e) => {
      filter.search = e.target.value;
      app.render();
    } })),
  );
  main.append(filters);

  const q = (filter.search || '').toLocaleLowerCase('tr-TR');
  const list = fs.feedback
    .filter((f) => !filter.status || f.status === filter.status)
    .filter((f) => !filter.category || f.category === filter.category)
    .filter((f) => !filter.branch || f.branch === filter.branch)
    .filter((f) => !q || `${f.id} ${f.description} ${f.expected}`.toLocaleLowerCase('tr-TR').includes(q))
    .slice()
    .sort((a, b) => b.id.localeCompare(a.id, 'tr', { numeric: true }));

  const counts = Object.keys(FEEDBACK_STATUS).map((k) => `${FEEDBACK_STATUS[k]}: ${fs.feedback.filter((f) => f.status === k).length}`).join(' · ');
  main.append(h('p', { class: 'muted' }, `Toplam ${fs.feedback.length} kayıt (${counts}). Gösterilen: ${list.length}.`));

  if (!list.length) {
    main.append(h('div', { class: 'empty' }, fs.feedback.length ? 'Filtreye uyan kayıt yok.' : 'Henüz geri bildirim yok. Formu test ederken alanların yanındaki "Not" düğmesini kullanın.'));
    return;
  }

  const ul = h('ul', { class: 'card-list' });
  for (const f of list) {
    const decision = f.decisionId ? fs.decisions.find((d) => d.id === f.decisionId) : null;
    ul.append(
      h(
        'li',
        { class: 'card', id: `fbcard-${f.id}` },
        h(
          'div',
          { class: 'card-head' },
          h('strong', { class: 'mono' }, f.id),
          badge(FEEDBACK_STATUS[f.status], STATUS_TONE[f.status]),
          f.priority ? badge(`Öncelik: ${PRIORITIES[f.priority]}`, PRIORITY_TONE[f.priority]) : null,
          badge(FEEDBACK_CATEGORIES[f.category], 'gray'),
          hasBranches ? badge(BRANCH_SCOPES[f.branch || 'all'], 'teal') : null,
          decision ? badge(`Karar: ${decision.id}`, 'blue') : null,
        ),
        h('p', { class: 'card-target' }, 'Hedef: ', f.target && f.target.startsWith('field:')
          ? h('button', { type: 'button', class: 'linklike', onclick: () => app.goToField(formId, f.target.slice(6)) }, targetLabel(formId, app.state, f.target))
          : targetLabel(formId, app.state, f.target)),
        h('p', {}, f.description),
        f.expected ? h('p', { class: 'expected' }, h('strong', {}, 'Beklenen / öneri: '), f.expected) : null,
        h('p', { class: 'muted small' }, `Oluşturma: ${formatDate(f.createdAt)}${f.updatedAt && f.updatedAt !== f.createdAt ? ` · Güncelleme: ${formatDate(f.updatedAt)}` : ''}`),
        h(
          'div',
          { class: 'row' },
          button('Düzenle', () => openFeedbackDialog(app, {}, f), { small: true, id: `fb-edit-${f.id}` }),
          f.status !== 'cozuldu' ? button('Çözüldü', () => setStatus(app, f.id, 'cozuldu'), { small: true, id: `fb-resolve-${f.id}` }) : button('Yeniden aç', () => setStatus(app, f.id, 'acik'), { small: true, id: `fb-reopen-${f.id}` }),
          f.status !== 'ertelendi' ? button('Ertele', () => setStatus(app, f.id, 'ertelendi'), { small: true, id: `fb-defer-${f.id}` }) : null,
          !decision ? button('Karara dönüştür', () => openDecisionDialog(app, { fromFeedback: f }), { small: true, variant: 'primary', id: `fb-decide-${f.id}` }) : null,
          button('Sil', () => removeFeedback(app, f), { small: true, variant: 'danger-ghost', id: `fb-delete-${f.id}` }),
        ),
      ),
    );
  }
  main.append(ul);
}

function setStatus(app, id, status) {
  app.commit(() => {
    const item = app.fs.feedback.find((f) => f.id === id);
    item.status = status;
    item.updatedAt = nowIso();
  });
}

async function removeFeedback(app, f) {
  const ok = await confirmDialog({ title: 'Geri bildirimi sil', message: `${f.id} kalıcı olarak silinsin mi?${f.decisionId ? ` Bağlı karar (${f.decisionId}) silinmez.` : ''}`, confirmText: 'Sil', danger: true });
  if (!ok) return;
  app.commit(() => {
    app.fs.feedback = app.fs.feedback.filter((x) => x.id !== f.id);
  });
}
