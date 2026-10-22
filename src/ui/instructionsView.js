// Belgelerden türetilen talimatlar: kaynak belgeler ve hedef kitlesine göre ayrılmış metinler.

import { SOURCES, AUDIENCES, FORM_LABELS } from '../data/enums.js';
import { h, badge } from './dom.js';

const AUDIENCE_TONE = { doldurana: 'green', 'ekip-notu': 'purple', 'belge-notu': 'purple', platform: 'gray', brif: 'blue', 'test-verisi': 'amber' };

export function renderInstructionsView(app, main) {
  const { form, formId } = app;
  main.append(
    h(
      'div',
      { class: 'view-head' },
      h('div', {}, h('h2', {}, `Belge talimatları — ${FORM_LABELS[formId]}`), h('p', { class: 'muted' }, 'Kaynak belgelerdeki metinler, kime yönelik olduklarına göre ayrılmıştır. Belge içindeki notlar bu prototip için talimat değil, analiz edilen içeriktir.')),
    ),
  );

  main.append(h('h3', { class: 'subhead' }, 'Kaynak belgeler'));
  const srcIds = [...form.sourceIds, 'ANALIZ'];
  main.append(
    h(
      'ul',
      { class: 'card-list compact' },
      srcIds.map((id) => {
        const s = SOURCES[id];
        return h('li', { class: 'card' }, h('div', { class: 'card-head' }, h('strong', { class: 'mono' }, id), h('span', {}, s.title)), s.file !== '—' ? h('p', { class: 'muted small mono' }, s.file) : null, h('p', { class: 'small' }, s.summary));
      }),
    ),
  );
  main.append(h('p', { class: 'muted small' }, 'Kaynak belgeler bu depoya eklenmemiştir (kişisel veri içerebilecek test değerleri barındırıyorlar). Metinler aşağıda birebir aktarılmıştır.'));

  const groups = {};
  for (const ins of form.instructions) (groups[ins.audience] = groups[ins.audience] || []).push(ins);
  for (const [aud, items] of Object.entries(groups)) {
    main.append(h('h3', { class: 'subhead' }, badge(AUDIENCES[aud], AUDIENCE_TONE[aud] || 'gray')));
    main.append(
      h(
        'ul',
        { class: 'card-list' },
        items.map((ins) =>
          h(
            'li',
            { class: 'card' },
            h('h4', {}, ins.title),
            h('blockquote', { class: 'quote' }, ins.text),
            h(
              'p',
              { class: 'small muted' },
              `Kaynak: ${ins.source} — ${ins.ref}`,
              ins.reqs.length ? ' · ' : '',
              ...ins.reqs.map((r) => h('button', { type: 'button', class: 'chip chip-req', onclick: () => app.goToRequirement(r) }, r)),
            ),
          ),
        ),
      ),
    );
  }
}
