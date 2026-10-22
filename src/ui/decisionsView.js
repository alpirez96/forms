// Onaylı kararlar. Kararlar geri bildirimden ayrıdır; açık geri bildirim onaylı değişiklik sayılmaz.
// Alan değişikliği içeren kararlar prototipe hemen uygulanır.

import { FORMS, findRequirement, requirementsFor } from '../data/registry.js';
import { BRANCH_SCOPES, FIELD_TYPES, FEEDBACK_CATEGORIES, FORM_LABELS, STATUS } from '../data/enums.js';
import { targetOptions, targetLabel, effectiveForm, sectionFields, statusLookup, noteLookup } from '../core/schema.js';
import { nextId, nowIso } from '../core/state.js';
import { h, button, badge, select, labeled, openDialog, confirmDialog, toast, formatDate } from './dom.js';

function fieldChoices(formId, state) {
  const out = [];
  const seen = new Set();
  for (const b of FORMS[formId].hasBranches ? ['issue', 'receive'] : [null]) {
    for (const s of effectiveForm(formId, state, b).sections) {
      for (const f of sectionFields(s, { includeRemoved: true })) {
        if (seen.has(f.id)) continue;
        seen.add(f.id);
        out.push({ value: f.id, label: `${f.label} · ${s.pageLabel}`, field: f });
      }
    }
  }
  return out;
}

export function describeChange(formId, state, d) {
  const c = d.change || { kind: 'none' };
  if (c.kind === 'modify') {
    const p = c.patch || {};
    const parts = [];
    if (p.label) parts.push(`etiket → "${p.label}"`);
    if (p.help) parts.push(`açıklama → "${p.help}"`);
    if (p.placeholder) parts.push(`yer tutucu → "${p.placeholder}"`);
    if (p.required === 'required') parts.push('zorunlu');
    if (p.required === 'optional') parts.push('isteğe bağlı');
    if (p.options && p.options.length) parts.push(`seçenekler → ${p.options.join(', ')}`);
    if (p.removed) parts.push('alan kaldırıldı');
    return `${targetLabel(formId, state, `field:${c.fieldId}`)}: ${parts.join('; ') || 'değişiklik yok'}`;
  }
  if (c.kind === 'add' && c.add) {
    const sec = FORMS[formId].sections.find((s) => s.id === c.add.sectionId);
    return `Yeni alan "${c.add.label}" (${FIELD_TYPES[c.add.type]}, ${c.add.required ? 'zorunlu' : 'isteğe bağlı'}) → ${sec ? sec.pageLabel : c.add.sectionId}`;
  }
  return '';
}

export function openDecisionDialog(app, { fromFeedback = null, existing = null, reqId = null } = {}) {
  const formId = existing ? existing.form : fromFeedback ? fromFeedback.form : app.formId;
  const form = FORMS[formId];
  const src = existing || {};
  const fb = fromFeedback;
  const change = src.change || { kind: 'none' };
  const fbTargetField = fb && fb.target && fb.target.startsWith('field:') ? fb.target.slice(6) : '';

  const body = h('form', { class: 'dialog-form', novalidate: true });
  const errorBox = h('div', { class: 'form-errors', role: 'alert' });
  const title = h('input', { type: 'text', id: 'dc-title', class: 'input', value: src.title || (fb ? `${FEEDBACK_CATEGORIES[fb.category]} — ${targetLabel(formId, app.state, fb.target)}` : '') });
  const text = h('textarea', { id: 'dc-text', rows: 3, 'aria-required': 'true' });
  text.value = src.text || (fb ? fb.expected || fb.description : '');
  const impl = h('textarea', { id: 'dc-impl', rows: 2 });
  impl.value = src.implications || '';
  const branchSel = select(Object.entries(BRANCH_SCOPES).map(([value, label]) => ({ value, label })), src.branch || (fb && fb.branch) || 'all', { id: 'dc-branch' });
  const targetSel = select(targetOptions(formId, app.state), src.target || (fb ? fb.target : reqId ? '' : ''), { id: 'dc-target' });
  const reqs = h('input', { type: 'text', id: 'dc-reqs', class: 'input', value: (src.reqIds || (reqId ? [reqId] : [])).join(', '), placeholder: 'ör. C-Q05, C-033' });

  // Yapısal değişiklik
  const kindName = 'dc-kind';
  const kinds = [
    ['none', 'Alan yapısında değişiklik yok (yalnızca karar metni)'],
    ['modify', 'Mevcut alanı değiştir'],
    ['add', 'Yeni alan ekle'],
  ];
  let kind = src.change ? src.change.kind : fbTargetField ? 'modify' : 'none';
  const kindGroup = h('fieldset', { class: 'radio-group-inline' }, h('legend', {}, 'Değişiklik türü'));
  const modifyBox = h('div', { class: 'subpanel' });
  const addBox = h('div', { class: 'subpanel' });
  const choices = fieldChoices(formId, app.state);
  const p = change.patch || {};
  const fieldSel = select([{ value: '', label: 'Alan seçin' }, ...choices], change.fieldId || fbTargetField, { id: 'dc-field' });
  const newLabel = h('input', { type: 'text', id: 'dc-label', class: 'input', value: p.label || '' });
  const newHelp = h('input', { type: 'text', id: 'dc-help', class: 'input', value: p.help || '' });
  const reqSel = select([{ value: '', label: 'Değiştirme' }, { value: 'required', label: 'Zorunlu yap' }, { value: 'optional', label: 'İsteğe bağlı yap' }], p.required || '', { id: 'dc-required' });
  const newOptions = h('textarea', { id: 'dc-options', rows: 3, placeholder: 'Her satıra bir seçenek' });
  newOptions.value = (p.options || []).join('\n');
  const removeChk = h('input', { type: 'checkbox', id: 'dc-remove', checked: Boolean(p.removed) });
  const currentInfo = h('p', { class: 'muted small' });
  const showCurrent = () => {
    const hit = choices.find((c) => c.value === fieldSel.value);
    currentInfo.textContent = hit
      ? `Şu an: "${hit.field.label}" · ${FIELD_TYPES[hit.field.type]} · ${hit.field.required ? 'zorunlu' : 'isteğe bağlı'}${hit.field.options && hit.field.options.length ? ` · seçenekler: ${hit.field.options.join(', ')}` : ''}`
      : '';
  };
  fieldSel.addEventListener('change', showCurrent);
  showCurrent();
  modifyBox.append(
    labeled('Değiştirilecek alan', fieldSel),
    currentInfo,
    h('div', { class: 'grid-2' }, labeled('Yeni etiket (boş = değişmez)', newLabel), labeled('Zorunluluk', reqSel)),
    labeled('Yeni açıklama metni (boş = değişmez)', newHelp),
    labeled('Yeni seçenekler (yalnızca liste alanları; boş = değişmez)', newOptions),
    h('label', { class: 'switch', for: 'dc-remove' }, removeChk, ' Alanı formdan kaldır'),
  );

  const a = change.add || {};
  const addSection = select(form.sections.filter((s) => s.kind === 'fields').map((s) => ({ value: s.id, label: `${s.pageLabel} · ${s.title}` })), a.sectionId || (fb && fb.target && fb.target.startsWith('section:') ? fb.target.slice(8) : form.sections[0].id), { id: 'dc-add-section' });
  const addLabel = h('input', { type: 'text', id: 'dc-add-label', class: 'input', value: a.label || '' });
  const addType = select(Object.entries(FIELD_TYPES).map(([value, label]) => ({ value, label })), a.type || 'text', { id: 'dc-add-type' });
  const addReq = h('input', { type: 'checkbox', id: 'dc-add-required', checked: Boolean(a.required) });
  const addHelp = h('input', { type: 'text', id: 'dc-add-help', class: 'input', value: a.help || '' });
  const addOptions = h('textarea', { id: 'dc-add-options', rows: 3, placeholder: 'Her satıra bir seçenek (liste alanları için)' });
  addOptions.value = (a.options || []).join('\n');
  addBox.append(
    h('div', { class: 'grid-2' }, labeled('Bölüm (bölüm sonuna eklenir)', addSection), labeled('Alan türü', addType)),
    labeled('Etiket', addLabel, { required: true }),
    labeled('Açıklama metni', addHelp),
    labeled('Seçenekler', addOptions),
    h('label', { class: 'switch', for: 'dc-add-required' }, addReq, ' Zorunlu alan'),
  );

  const syncKind = () => {
    modifyBox.hidden = kind !== 'modify';
    addBox.hidden = kind !== 'add';
  };
  kinds.forEach(([value, label]) => {
    const id = `dc-kind-${value}`;
    kindGroup.append(h('label', { class: 'radio', for: id }, h('input', { type: 'radio', name: kindName, id, value, checked: kind === value, onchange: () => {
      kind = value;
      syncKind();
    } }), h('span', {}, label)));
  });
  syncKind();

  body.append(
    errorBox,
    fb ? h('p', { class: 'note note-blue' }, `Kaynak geri bildirim: ${fb.id} — ${fb.description}`) : null,
    labeled('Karar başlığı', title),
    labeled('Karar', text, { required: true, hint: 'Ne uygulanacak? Bu metin onaylı değişiklik olarak kaydedilir.' }),
    labeled('Etkisi / uygulama notu', impl),
    h('div', { class: 'grid-2' }, form.hasBranches ? labeled('Branş kapsamı', branchSel, { hint: 'Branşa özel kararlar yalnızca o yönde uygulanır.' }) : h('div', {}), labeled('İlgili gereksinimler (isteğe bağlı)', reqs)),
    labeled('Hedef bölüm/alan', targetSel),
    kindGroup,
    modifyBox,
    addBox,
  );

  const lines = (ta) => ta.value.split('\n').map((s) => s.trim()).filter(Boolean);

  const save = (close) => {
    const errors = [];
    if (!text.value.trim()) errors.push('Karar metnini girin.');
    const reqIds = reqs.value.split(/[\s,;]+/).map((s) => s.trim().toUpperCase()).filter(Boolean);
    const unknown = reqIds.filter((id) => !findRequirement(formId, id));
    if (unknown.length) errors.push(`Bilinmeyen gereksinim kimliği: ${unknown.join(', ')}`);
    let changeOut = { kind: 'none' };
    if (kind === 'modify') {
      if (!fieldSel.value) errors.push('Değiştirilecek alanı seçin.');
      changeOut = {
        kind: 'modify',
        fieldId: fieldSel.value,
        patch: { label: newLabel.value.trim(), help: newHelp.value.trim(), placeholder: '', required: reqSel.value, options: lines(newOptions), removed: removeChk.checked },
      };
      const pt = changeOut.patch;
      if (!pt.label && !pt.help && !pt.required && !pt.options.length && !pt.removed) errors.push('Alan için en az bir değişiklik girin veya "değişiklik yok" seçin.');
    } else if (kind === 'add') {
      if (!addLabel.value.trim()) errors.push('Yeni alanın etiketini girin.');
      if ((addType.value === 'select' || addType.value === 'radio') && !lines(addOptions).length) errors.push('Liste alanı için en az bir seçenek girin.');
      changeOut = { kind: 'add', add: { sectionId: addSection.value, label: addLabel.value.trim(), type: addType.value, required: addReq.checked, help: addHelp.value.trim(), options: lines(addOptions) } };
    }
    errorBox.replaceChildren(...errors.map((e) => h('p', {}, e)));
    if (errors.length) return;
    const values = {
      form: formId,
      branch: form.hasBranches ? branchSel.value : '',
      title: title.value.trim(),
      text: text.value.trim(),
      implications: impl.value.trim(),
      reqIds,
      target: targetSel.value,
      change: changeOut,
    };
    let id = existing ? existing.id : null;
    app.commit((state) => {
      const fs = state.forms[formId];
      if (existing) {
        Object.assign(fs.decisions.find((d) => d.id === existing.id), values, { updatedAt: nowIso() });
      } else {
        const now = nowIso();
        id = nextId(fs, 'decision', formId);
        fs.decisions.push({ id, ...values, sourceFeedbackId: fb ? fb.id : '', createdAt: now, updatedAt: now });
        if (fb) {
          const item = fs.feedback.find((f) => f.id === fb.id);
          if (item) {
            item.decisionId = id;
            item.status = 'cozuldu';
            item.updatedAt = now;
          }
        }
      }
    });
    close();
    toast(`${id} kaydedildi.${changeOut.kind !== 'none' ? ' Alan değişikliği prototipe uygulandı.' : ''}`, 'success');
  };

  openDialog({
    title: existing ? `Kararı düzenle — ${existing.id}` : `Yeni karar — ${FORM_LABELS[formId]}`,
    wide: true,
    body,
    actions: (close) => [button('Vazgeç', close), button('Kararı kaydet', () => save(close), { variant: 'primary', id: 'dc-save' })],
  });
  body.addEventListener('submit', (e) => e.preventDefault());
}

export function renderDecisionsView(app, main) {
  const { formId, fs } = app;
  const hasBranches = FORMS[formId].hasBranches;
  main.append(
    h(
      'div',
      { class: 'view-head' },
      h('div', {}, h('h2', {}, `Kararlar — ${FORM_LABELS[formId]}`), h('p', { class: 'muted' }, 'Onayladığınız değişiklikler. Bunlar belgedeki tanımın yerine geçer. Açık geri bildirimler buraya girmez.')),
      button('Yeni karar', () => openDecisionDialog(app), { variant: 'primary', id: 'btn-new-decision' }),
    ),
  );

  main.append(h('h3', { class: 'subhead' }, `Değişiklik kararları (${fs.decisions.length})`));
  if (!fs.decisions.length) main.append(h('div', { class: 'empty' }, 'Henüz karar yok. Bir geri bildirimi "Karara dönüştür" ile veya "Yeni karar" ile ekleyebilirsiniz.'));
  else {
    const ul = h('ul', { class: 'card-list' });
    for (const d of fs.decisions.slice().sort((a, b) => a.id.localeCompare(b.id, 'tr', { numeric: true }))) {
      const change = describeChange(formId, app.state, d);
      ul.append(
        h(
          'li',
          { class: 'card', id: `dccard-${d.id}` },
          h('div', { class: 'card-head' }, h('strong', { class: 'mono' }, d.id), badge('Onaylı karar', 'blue'), hasBranches ? badge(BRANCH_SCOPES[d.branch || 'all'], 'teal') : null, change ? badge('Alan değişikliği', 'purple') : null),
          d.title ? h('h4', {}, d.title) : null,
          h('p', {}, d.text),
          change ? h('p', { class: 'expected' }, h('strong', {}, 'Yapısal değişiklik: '), change) : null,
          d.implications ? h('p', { class: 'muted' }, h('strong', {}, 'Etki: '), d.implications) : null,
          d.target ? h('p', { class: 'muted small' }, `Hedef: ${targetLabel(formId, app.state, d.target)}`) : null,
          d.reqIds && d.reqIds.length ? h('p', { class: 'small' }, 'İlgili: ', ...d.reqIds.map((r) => h('button', { type: 'button', class: 'chip chip-req', onclick: () => app.goToRequirement(r) }, r))) : null,
          d.sourceFeedbackId ? h('p', { class: 'muted small' }, `Kaynak geri bildirim: ${d.sourceFeedbackId}`) : null,
          h('p', { class: 'muted small' }, `Oluşturma: ${formatDate(d.createdAt)}`),
          h(
            'div',
            { class: 'row' },
            button('Düzenle', () => openDecisionDialog(app, { existing: d }), { small: true, id: `dc-edit-${d.id}` }),
            button('Sil', () => removeDecision(app, d), { small: true, variant: 'danger-ghost', id: `dc-delete-${d.id}` }),
          ),
        ),
      );
    }
    main.append(ul);
  }

  const statusOf = statusLookup(app.state, formId);
  const noteOf = noteLookup(app.state, formId);
  const changed = requirementsFor(formId).filter((r) => statusOf(r.id) !== r.defaultStatus || noteOf(r.id));
  main.append(h('h3', { class: 'subhead' }, `Gereksinim durumu kararları (${changed.length})`));
  if (!changed.length) main.append(h('div', { class: 'empty' }, 'Gereksinimlerin hepsi belgedeki varsayılan durumunda. Durum ve cevapları "Gereksinimler ve açık sorular" sekmesinden girin.'));
  else {
    const ul = h('ul', { class: 'card-list' });
    for (const r of changed) {
      ul.append(
        h(
          'li',
          { class: 'card' },
          h('div', { class: 'card-head' }, h('button', { type: 'button', class: 'chip chip-req', onclick: () => app.goToRequirement(r.id) }, r.id), badge(`${STATUS[r.defaultStatus].short} → ${STATUS[statusOf(r.id)].label}`, STATUS[statusOf(r.id)].tone)),
          h('p', { class: 'small' }, r.description),
          noteOf(r.id) ? h('p', { class: 'expected' }, h('strong', {}, 'Karar notu: '), noteOf(r.id)) : null,
        ),
      );
    }
    main.append(ul);
  }
}

async function removeDecision(app, d) {
  const ok = await confirmDialog({ title: 'Kararı sil', message: `${d.id} silinsin mi? Alan değişikliği içeriyorsa prototipten de kaldırılır. Bağlı geri bildirim "Açık" durumuna döner.`, confirmText: 'Sil', danger: true });
  if (!ok) return;
  app.commit(() => {
    app.fs.decisions = app.fs.decisions.filter((x) => x.id !== d.id);
    for (const f of app.fs.feedback) {
      if (f.decisionId === d.id) {
        f.decisionId = '';
        f.status = 'acik';
        f.updatedAt = nowIso();
      }
    }
  });
}
