import { FORMS, FORM_IDS } from './data/registry.js';
import { loadState, saveState, defaultState } from './core/state.js';
import { buildExport, validateImport, applyImport } from './core/importExport.js';
import { readiness } from './core/readiness.js';
import { h, clear, button, toast, openDialog, downloadText } from './ui/dom.js';
import { renderTestView, stepForField } from './ui/testView.js';
import { renderInstructionsView } from './ui/instructionsView.js';
import { renderFeedbackView } from './ui/feedbackView.js';
import { renderRequirementsView } from './ui/requirementsView.js';
import { renderDecisionsView } from './ui/decisionsView.js';
import { renderPromptView } from './ui/promptView.js';

const TABS = [
  { id: 'test', label: 'Formu test et' },
  { id: 'instructions', label: 'Belge talimatları' },
  { id: 'feedback', label: 'Geri bildirim' },
  { id: 'requirements', label: 'Gereksinimler ve açık sorular' },
  { id: 'decisions', label: 'Kararlar' },
  { id: 'prompt', label: 'Prompt hazırlığı' },
];

const storage = (() => {
  try {
    const probe = '__probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch (err) {
    return null;
  }
})();

const loaded = storage ? loadState(storage) : { state: defaultState(), error: null };

export const app = {
  state: loaded.state,
  storageError: storage ? loaded.error : 'Tarayıcı depolaması kullanılamıyor; değişiklikler sayfa kapanınca kaybolur. Çalışmanızı JSON olarak dışa aktarın.',
  transient: {
    attempted: { cari: {}, talent: {} },
    submitted: { cari: null, talent: null },
    feedbackFilter: { cari: {}, talent: {} },
    reqFilter: { cari: {}, talent: {} },
    highlight: null,
  },

  get formId() {
    return this.state.activeForm;
  },
  get form() {
    return FORMS[this.state.activeForm];
  },
  get fs() {
    return this.state.forms[this.state.activeForm];
  },

  saveTimer: null,
  save() {
    if (!storage) return;
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.flush(), 150);
  },
  flush() {
    if (!storage) return;
    clearTimeout(this.saveTimer);
    const err = saveState(storage, this.state);
    if (err && err !== this.storageError) {
      this.storageError = err;
      renderBanner();
    }
  },

  commit(mutator, { render = true } = {}) {
    mutator(this.state);
    this.save();
    if (render) this.render();
  },

  setForm(formId) {
    this.commit((s) => {
      s.activeForm = formId;
    });
    window.scrollTo(0, 0);
  },

  setTab(tab) {
    this.commit(() => {
      this.fs.activeTab = tab;
    });
    window.scrollTo(0, 0);
  },

  goToField(formId, fieldId) {
    const step = stepForField(formId, this.state, fieldId);
    this.commit((s) => {
      s.activeForm = formId;
      s.forms[formId].activeTab = 'test';
      if (step) s.forms[formId].ui.step = step;
    }, { render: false });
    this.transient.highlight = fieldId;
    this.render();
    const el = document.getElementById(`fld-${fieldId}`);
    if (el) el.scrollIntoView({ block: 'center' });
  },

  goToRequirement(reqId, formId = this.formId) {
    this.transient.reqFilter[formId] = { search: reqId };
    this.commit((s) => {
      s.activeForm = formId;
      s.forms[formId].activeTab = 'requirements';
    });
    window.scrollTo(0, 0);
  },

  render() {
    const active = document.activeElement;
    const focusId = active && active.id ? active.id : null;
    const selStart = active && 'selectionStart' in active ? safe(() => active.selectionStart) : null;
    renderShell();
    if (focusId) {
      const el = document.getElementById(focusId);
      if (el) {
        el.focus({ preventScroll: true });
        if (selStart !== null && 'setSelectionRange' in el) safe(() => el.setSelectionRange(selStart, selStart));
      }
    }
  },
};

function safe(fn) {
  try {
    return fn();
  } catch (err) {
    return null;
  }
}

// --- Kabuk -------------------------------------------------------------------

function renderBanner() {
  const banner = document.getElementById('banner');
  clear(banner);
  if (app.storageError) banner.append(h('div', { class: 'banner banner-warn', role: 'alert' }, app.storageError));
}

function tabCount(tabId, formId) {
  const fs = app.state.forms[formId];
  if (tabId === 'feedback') {
    const open = fs.feedback.filter((f) => f.status === 'acik').length;
    return open ? `${open} açık` : null;
  }
  if (tabId === 'requirements') {
    const r = readiness(formId, app.state);
    const n = r.blockers.length + r.openQuestions.length;
    return n ? `${n} açık soru` : null;
  }
  if (tabId === 'decisions') return fs.decisions.length ? String(fs.decisions.length) : null;
  return null;
}

function renderShell() {
  renderBanner();
  const formSwitch = clear(document.getElementById('form-switch'));
  for (const id of FORM_IDS) {
    const f = FORMS[id];
    const r = readiness(id, app.state);
    const isActive = app.formId === id;
    formSwitch.append(
      h(
        'button',
        {
          type: 'button',
          class: `form-tab ${isActive ? 'active' : ''}`,
          'aria-pressed': isActive ? 'true' : 'false',
          id: `formtab-${id}`,
          onclick: () => app.setForm(id),
        },
        h('span', { class: 'form-tab-title' }, f.shortTitle),
        h('span', { class: 'form-tab-sub' }, f.title),
        h('span', { class: `dot dot-${r.tone}`, title: `Hazırlık: ${r.label}` }),
      ),
    );
  }

  const tabs = clear(document.getElementById('tabs'));
  for (const t of TABS) {
    const isActive = app.fs.activeTab === t.id;
    const count = tabCount(t.id, app.formId);
    tabs.append(
      h(
        'button',
        { type: 'button', role: 'tab', id: `tab-${t.id}`, class: `tab ${isActive ? 'active' : ''}`, 'aria-selected': isActive ? 'true' : 'false', 'aria-controls': 'main', onclick: () => app.setTab(t.id) },
        t.label,
        count ? h('span', { class: 'tab-count' }, count) : null,
      ),
    );
  }

  const main = clear(document.getElementById('main'));
  main.setAttribute('aria-labelledby', `tab-${app.fs.activeTab}`);
  const view = {
    test: renderTestView,
    instructions: renderInstructionsView,
    feedback: renderFeedbackView,
    requirements: renderRequirementsView,
    decisions: renderDecisionsView,
    prompt: renderPromptView,
  }[app.fs.activeTab] || renderTestView;
  view(app, main);
}

// --- Dışa / içe aktarma ------------------------------------------------------

function exportReview() {
  const data = buildExport(app.state, new Date().toISOString());
  const date = new Date().toISOString().slice(0, 10);
  downloadText(`form-inceleme-${date}.json`, `${JSON.stringify(data, null, 2)}\n`, 'application/json');
  toast('İnceleme verisi JSON olarak indirildi (test yanıtları dahil edilmedi).', 'success');
}

function importReview(file) {
  const reader = new FileReader();
  reader.onerror = () => toast('Dosya okunamadı.', 'error');
  reader.onload = () => {
    const result = validateImport(String(reader.result || ''));
    const body = h('div', {});
    if (!result.ok) {
      body.append(h('p', { class: 'error-text' }, 'Dosya içe aktarılamadı:'), h('ul', {}, result.errors.map((e) => h('li', {}, e))));
      openDialog({ title: 'İçe aktarma hatası', body, actions: (close) => [button('Kapat', close, { variant: 'primary' })] });
      return;
    }
    const s = result.summary;
    body.append(
      h('p', {}, 'Dosya doğrulandı. İçe aktarılırsa mevcut inceleme verisinin (geri bildirimler, kararlar, gereksinim durumları, promptlar) yerini alır. Test yanıtlarınız korunur.'),
      h(
        'ul',
        {},
        h('li', {}, `Cari Form: ${s.cari.feedback} geri bildirim, ${s.cari.decisions} karar, ${s.cari.reqStatus} gereksinim durumu`),
        h('li', {}, `Yeni Talent Form: ${s.talent.feedback} geri bildirim, ${s.talent.decisions} karar, ${s.talent.reqStatus} gereksinim durumu`),
        h('li', {}, `Ortak gereksinim durumu: ${s.shared.reqStatus}`),
      ),
    );
    if (result.warnings.length) {
      body.append(h('p', { class: 'warn-text' }, `${result.warnings.length} uyarı (bu kayıtlar atlandı veya düzeltildi):`), h('ul', { class: 'warn-list' }, result.warnings.map((w) => h('li', {}, w))));
    }
    openDialog({
      title: 'İnceleme verisini içe aktar',
      body,
      actions: (close) => [
        button('Vazgeç', close),
        button('İçe aktar', () => {
          app.commit((state) => applyImport(state, result.data));
          app.flush();
          close();
          toast('İnceleme verisi içe aktarıldı.', 'success');
        }, { variant: 'primary', id: 'confirm-import' }),
      ],
    });
  };
  reader.readAsText(file);
}

function showHelp() {
  const steps = [
    'Üstten formu seçin: Cari Form veya Yeni Talent Form. İki formun yanıtları, geri bildirimleri ve kararları birbirinden ayrı tutulur.',
    '"Formu test et" sekmesinde formu doldurun. Cari Form ilk adımda fatura yönünü sorar; seçim kategori seçeneklerini değiştirir.',
    'Sağdaki test notları belgedeki kaynağı, koşulları ve açık soruları gösterir. "Test notlarını göster" ile gizleyip formu sade hâliyle görebilirsiniz.',
    'Her alanın yanındaki "Not" düğmesiyle o alana bağlı geri bildirim kaydedin. Bölüm notu ve "Bu bölümü inceledim" işareti sağ paneldedir.',
    '"Gereksinimler" sekmesinde her maddenin kaynağını görün; durumunu (ör. onayladım, reddedildi, ertelendi) ve karar notunuzu girin. Açık soruları burada cevaplayın.',
    'Bir geri bildirimi uygulamaya karar verdiğinizde "Karara dönüştür" deyin. Geri bildirimler, siz onaylamadan gereksinim sayılmaz. Alan değişikliği içeren kararlar prototipe hemen yansır.',
    '"Prompt hazırlığı" sekmesinde hazırlık durumunu görün, deneyimi final olarak onaylayın ve her form için ayrı promptu oluşturun. Promptu düzenleyebilir, kopyalayabilir veya .txt olarak indirebilirsiniz.',
    'Çalışmanız tarayıcıda otomatik saklanır. Yedek veya paylaşım için "JSON dışa aktar" kullanın; devam etmek için "JSON içe aktar" ile geri yükleyin.',
    'Gerçek kişisel, banka veya vergi verisi girmeyin; "Örnek veri doldur" açıkça işaretli sahte veri kullanır.',
  ];
  openDialog({
    title: 'Nasıl kullanılır?',
    wide: true,
    body: h('ol', { class: 'help-list' }, steps.map((s) => h('li', {}, s))),
    actions: (close) => [button('Kapat', close, { variant: 'primary' })],
  });
}

// --- Başlat ------------------------------------------------------------------

function init() {
  const root = document.getElementById('app');
  const fileInput = h('input', { type: 'file', accept: 'application/json,.json', id: 'import-file', class: 'visually-hidden', 'aria-hidden': 'true', tabindex: '-1' });
  fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files[0]) importReview(fileInput.files[0]);
    fileInput.value = '';
  });
  root.append(
    h(
      'header',
      { class: 'topbar' },
      h('div', { class: 'brand' }, h('h1', {}, 'Muhasebe Formları · Gereksinim Prototipi'), h('p', {}, 'Test et, not al, karar ver, geliştirme promptunu üret. Gerçek işlem yapılmaz.')),
      h(
        'div',
        { class: 'topbar-actions' },
        button('Nasıl kullanılır?', showHelp, { id: 'btn-help' }),
        button('JSON dışa aktar', exportReview, { id: 'btn-export' }),
        button('JSON içe aktar', () => fileInput.click(), { id: 'btn-import' }),
        fileInput,
      ),
    ),
    h('div', { id: 'banner' }),
    h('nav', { id: 'form-switch', class: 'form-switch', 'aria-label': 'Form seçimi' }),
    h('nav', { id: 'tabs', class: 'tabs', role: 'tablist', 'aria-label': 'Bölümler' }),
    h('main', { id: 'main', class: 'main', role: 'tabpanel' }),
  );
  window.addEventListener('beforeunload', () => app.flush());
  app.render();
}

init();
