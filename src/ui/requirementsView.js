// Gereksinim envanteri ve açık sorular: kaynak izlenebilirliği, durum ve karar notu.

import { FORMS, isSharedReq } from '../data/registry.js';
import { STATUS, CONFIDENCE, REQ_TYPES, SOURCES, FORM_LABELS } from '../data/enums.js';
import { requirementsWithStatus } from '../core/readiness.js';
import { nowIso } from '../core/state.js';
import { h, button, badge, select, labeled } from './dom.js';
import { openFeedbackDialog } from './feedbackView.js';
import { openDecisionDialog } from './decisionsView.js';

function setReqStatus(app, reqId, patch) {
  app.commit((state) => {
    const store = isSharedReq(reqId) ? state.shared.reqStatus : state.forms[app.formId].reqStatus;
    const prev = store[reqId] || {};
    store[reqId] = { status: prev.status, note: prev.note || '', ...patch, updatedAt: nowIso() };
  }, { render: 'status' in patch });
}

export function renderRequirementsView(app, main) {
  const { formId } = app;
  const filter = app.transient.reqFilter[formId];
  const all = requirementsWithStatus(formId, app.state);

  main.append(
    h(
      'div',
      { class: 'view-head' },
      h('div', {}, h('h2', {}, `Gereksinimler ve açık sorular — ${FORM_LABELS[formId]}`), h('p', { class: 'muted' }, 'Her madde kaynağıyla birlikte listelenir. Durumu değiştirerek onaylayın, reddedin veya erteleyin; açık soruların cevabını karar notuna yazın. "Ortak" maddeler iki formda da aynı durumu paylaşır.')),
    ),
  );

  // Durum özetleri (filtre kısayolu)
  const counts = h('div', { class: 'status-strip', role: 'group', 'aria-label': 'Duruma göre filtrele' });
  const mk = (value, label, n, tone) => button([label, h('span', { class: 'count' }, String(n))], () => {
    filter.status = filter.status === value ? '' : value;
    app.render();
  }, { small: true, variant: filter.status === value ? 'primary' : `tone-${tone}`, id: `rs-${value || 'all'}` });
  counts.append(mk('', 'Tümü', all.length, 'gray'));
  for (const [key, s] of Object.entries(STATUS)) counts.append(mk(key, s.label, all.filter((r) => r.status === key).length, s.tone));
  const blockerCount = all.filter((r) => r.blocker && r.status === 'acik-soru').length;
  main.append(counts);

  const setF = (k, v) => {
    filter[k] = v;
    app.render();
  };
  main.append(
    h(
      'div',
      { class: 'filters' },
      labeled('Tür', select([{ value: '', label: 'Tümü' }, ...Object.entries(REQ_TYPES).map(([value, label]) => ({ value, label }))], filter.type || '', { id: 'rf-type', onchange: (e) => setF('type', e.target.value) })),
      labeled('Güven', select([{ value: '', label: 'Tümü' }, ...Object.entries(CONFIDENCE).map(([value, c]) => ({ value, label: c.label }))], filter.confidence || '', { id: 'rf-conf', onchange: (e) => setF('confidence', e.target.value) })),
      labeled('Kaynak', select([{ value: '', label: 'Tümü' }, ...Object.keys(SOURCES).map((value) => ({ value, label: value }))], filter.source || '', { id: 'rf-source', onchange: (e) => setF('source', e.target.value) })),
      labeled('Ara', h('input', { type: 'search', id: 'rf-search', class: 'input', value: filter.search || '', placeholder: 'Kimlik veya metin', oninput: (e) => setF('search', e.target.value) })),
      h('label', { class: 'switch', for: 'rf-blockers' }, h('input', { type: 'checkbox', id: 'rf-blockers', checked: Boolean(filter.blockers), onchange: (e) => setF('blockers', e.target.checked) }), ` Yalnızca engelleyiciler (${blockerCount} açık)`),
      h('label', { class: 'switch', for: 'rf-conflicts' }, h('input', { type: 'checkbox', id: 'rf-conflicts', checked: Boolean(filter.conflicts), onchange: (e) => setF('conflicts', e.target.checked) }), ' Yalnızca belge çelişkileri'),
    ),
  );

  const q = (filter.search || '').toLocaleLowerCase('tr-TR');
  const list = all
    .filter((r) => !filter.status || r.status === filter.status)
    .filter((r) => !filter.type || r.type === filter.type)
    .filter((r) => !filter.confidence || r.confidence === filter.confidence)
    .filter((r) => !filter.source || r.source.includes(filter.source))
    .filter((r) => !filter.blockers || r.blocker)
    .filter((r) => !filter.conflicts || r.conflict)
    .filter((r) => !q || `${r.id} ${r.description} ${r.ref} ${r.note}`.toLocaleLowerCase('tr-TR').includes(q));

  main.append(h('p', { class: 'muted' }, `Gösterilen: ${list.length} / ${all.length}`));
  if (!list.length) {
    main.append(h('div', { class: 'empty' }, 'Filtreye uyan madde yok.'));
    return;
  }

  const ul = h('ul', { class: 'card-list' });
  for (const r of list) ul.append(reqCard(app, r));
  main.append(ul);
}

function reqCard(app, r) {
  const { formId } = app;
  const st = STATUS[r.status];
  const statusId = `req-status-${r.id}`;
  const noteId = `req-note-${r.id}`;
  const fields = r.fields || [];
  const note = h('textarea', { id: noteId, rows: 2, placeholder: r.type === 'unresolved' || r.status === 'acik-soru' ? 'Cevabınız / kararınız (prompta girer)' : 'Karar notu (isteğe bağlı)' });
  note.value = r.note || '';
  note.addEventListener('change', () => setReqStatus(app, r.id, { note: note.value.trim() }));
  const statusSel = select(Object.entries(STATUS).map(([value, s]) => ({ value, label: s.label })), r.status, { id: statusId, onchange: (e) => setReqStatus(app, r.id, { status: e.target.value, note: note.value.trim() }) });

  return h(
    'li',
    { class: `card req-card tone-${st.tone}`, id: `reqcard-${r.id}` },
    h(
      'div',
      { class: 'card-head' },
      h('strong', { class: 'mono' }, r.id),
      badge(st.label, st.tone),
      badge(CONFIDENCE[r.confidence].label, CONFIDENCE[r.confidence].tone, 'Güven düzeyi'),
      badge(REQ_TYPES[r.type], 'gray'),
      r.blocker ? badge(r.status === 'acik-soru' ? 'Engelleyici' : 'Engelleyiciydi', r.status === 'acik-soru' ? 'red' : 'gray') : null,
      r.conflict ? badge('Belge çelişkisi', 'red') : null,
      r.form === 'both' ? badge('Ortak (iki form)', 'teal') : null,
      r.prototypeBehavior ? badge('Prototip deneyimi', 'purple') : null,
    ),
    h('p', { class: 'req-desc' }, r.description),
    h('p', { class: 'req-source' }, h('strong', {}, 'Kaynak: '), r.source.map((s) => `${s}${SOURCES[s] && SOURCES[s].file !== '—' ? ` (${SOURCES[s].file})` : ''}`).join(', '), ' — ', r.ref),
    r.implications ? h('p', { class: 'small' }, h('strong', {}, 'Uygulama etkisi: '), r.implications) : null,
    r.openQuestions ? h('p', { class: 'small open-q' }, h('strong', {}, 'Açık soru / not: '), r.openQuestions) : null,
    fields.length
      ? h('p', { class: 'small' }, 'İlgili alanlar: ', ...fields.map((f) => h('button', { type: 'button', class: 'chip', onclick: () => app.goToField(formId, f) }, f)))
      : null,
    h(
      'div',
      { class: 'req-controls' },
      labeled('Durum', statusSel, { hint: r.status !== r.defaultStatus ? `Varsayılan: ${STATUS[r.defaultStatus].label}` : null }),
      labeled(r.status === 'acik-soru' ? 'Cevap / karar notu' : 'Karar notu', note, { class: 'grow' }),
    ),
    h(
      'div',
      { class: 'row' },
      button('Geri bildirim ekle', () => openFeedbackDialog(app, { form: formId, target: fields[0] ? `field:${fields[0]}` : '', description: `[${r.id}] ` }), { small: true, id: `req-fb-${r.id}` }),
      FORMS[formId] ? button('Değişiklik kararı ekle', () => openDecisionDialog(app, { reqId: r.id }), { small: true, id: `req-dc-${r.id}` }) : null,
    ),
  );
}
