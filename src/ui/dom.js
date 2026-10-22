// Küçük DOM yardımcıları. Dinamik metin her zaman textContent ile eklenir (innerHTML kullanılmaz).

const PROPS = new Set(['value', 'checked', 'selected', 'disabled', 'indeterminate', 'multiple']);

export function h(tag, props, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(props || {})) {
    if (value === undefined || value === null || value === false) continue;
    if (key === 'class') el.className = value;
    else if (key === 'dataset') Object.assign(el.dataset, value);
    else if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2).toLowerCase(), value);
    else if (PROPS.has(key)) el[key] = value;
    else el.setAttribute(key, value === true ? '' : String(value));
  }
  append(el, children);
  return el;
}

export function append(el, children) {
  for (const child of children.flat(Infinity)) {
    if (child === undefined || child === null || child === false || child === '') continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return el;
}

export function clear(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
  return el;
}

export function badge(text, tone = 'gray', title) {
  return h('span', { class: `badge badge-${tone}`, title }, text);
}

export function button(label, onClick, opts = {}) {
  return h(
    'button',
    { type: opts.type || 'button', class: `btn ${opts.variant ? `btn-${opts.variant}` : ''} ${opts.small ? 'btn-sm' : ''}`.trim(), onclick: onClick, disabled: opts.disabled, title: opts.title, 'aria-label': opts.ariaLabel, id: opts.id, dataset: opts.dataset },
    label,
  );
}

export function select(options, value, props = {}) {
  const el = h('select', props);
  let lastGroup = null;
  let target = el;
  for (const opt of options) {
    if (opt.group && opt.group !== lastGroup) {
      target = h('optgroup', { label: opt.group });
      el.append(target);
      lastGroup = opt.group;
    }
    target.append(h('option', { value: opt.value, selected: opt.value === value }, opt.label));
  }
  el.value = value ?? '';
  return el;
}

export function labeled(labelText, control, opts = {}) {
  const id = control.id || `ctl-${Math.random().toString(36).slice(2, 9)}`;
  control.id = id;
  return h(
    'div',
    { class: `ctl ${opts.class || ''}`.trim() },
    h('label', { for: id }, labelText, opts.required ? h('span', { class: 'req', 'aria-hidden': 'true' }, ' *') : null),
    opts.hint ? h('p', { class: 'ctl-hint', id: `${id}-hint` }, opts.hint) : null,
    control,
  );
}

// --- Bildirim (toast) -------------------------------------------------------

export function toast(message, tone = 'info') {
  let region = document.getElementById('toast-region');
  if (!region) {
    region = h('div', { id: 'toast-region', class: 'toast-region', role: 'status', 'aria-live': 'polite' });
    document.body.append(region);
  }
  const item = h('div', { class: `toast toast-${tone}` }, message);
  region.append(item);
  setTimeout(() => item.remove(), 4500);
}

// --- Diyaloglar --------------------------------------------------------------

export function openDialog({ title, body, actions, wide = false, onClose }) {
  const dialog = h('dialog', { class: `dialog ${wide ? 'dialog-wide' : ''}`, 'aria-labelledby': 'dlg-title' });
  const close = () => {
    dialog.close();
  };
  dialog.addEventListener('close', () => {
    dialog.remove();
    if (onClose) onClose();
  });
  const head = h('div', { class: 'dialog-head' }, h('h2', { id: 'dlg-title' }, title), h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Kapat', onclick: close }, '×'));
  const foot = h('div', { class: 'dialog-foot' }, ...(actions ? actions(close) : []));
  dialog.append(head, h('div', { class: 'dialog-body' }, body), foot);
  document.body.append(dialog);
  dialog.showModal();
  return { dialog, close };
}

export function confirmDialog({ title, message, confirmText = 'Onayla', danger = false }) {
  return new Promise((resolve) => {
    let result = false;
    openDialog({
      title,
      body: h('p', {}, message),
      onClose: () => resolve(result),
      actions: (close) => [
        button('Vazgeç', close),
        button(confirmText, () => {
          result = true;
          close();
        }, { variant: danger ? 'danger' : 'primary' }),
      ],
    });
  });
}

export function downloadText(filename, text, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = h('a', { href: url, download: filename });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    const ta = h('textarea', { style: 'position:fixed;left:-9999px' });
    ta.value = text;
    document.body.append(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (e) {
      ok = false;
    }
    ta.remove();
    return ok;
  }
}

export function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' });
  } catch (err) {
    return iso;
  }
}
