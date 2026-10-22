// Prompt hazırlığı: iki formun hazırlık durumu, deneyim onayı, forma özel prompt üretimi ve "Final" akışı.

import { FORM_IDS, requirementsFor } from '../data/registry.js';
import { STATUS, FORM_LABELS } from '../data/enums.js';
import { readiness } from '../core/readiness.js';
import { generatePrompt, reviewHash, promptFileName } from '../core/prompt.js';
import { statusLookup } from '../core/schema.js';
import { nowIso } from '../core/state.js';
import { h, button, badge, toast, confirmDialog, openDialog, downloadText, copyText, formatDate } from './dom.js';

const EXPERIENCE_NOTE = 'Prototip deneyimi final olarak onaylandı (Prompt hazırlığı).';

const experienceBehaviors = (formId) => requirementsFor(formId).filter((r) => r.prototypeBehavior);

// Prototipin uyguladığı, öneri durumundaki deneyim davranışlarını onaylar (reddedilen/ertelenenler değişmez).
export function confirmExperience(state, formId) {
  const statusOf = statusLookup(state, formId);
  const f = state.forms[formId];
  f.experienceConfirmed = true;
  for (const r of experienceBehaviors(formId)) {
    if (statusOf(r.id) !== 'oneri') continue;
    const store = r.id.startsWith('S-') ? state.shared.reqStatus : f.reqStatus;
    store[r.id] = { status: 'test-onayli', note: EXPERIENCE_NOTE, updatedAt: nowIso() };
  }
}

function generateInto(state, formId) {
  state.forms[formId].prompt = { text: generatePrompt(formId, state), dataHash: reviewHash(formId, state), edited: false };
}

async function copyPrompt(text) {
  const ok = await copyText(text);
  toast(ok ? 'Prompt panoya kopyalandı.' : 'Kopyalanamadı; metni elle seçip kopyalayın.', ok ? 'success' : 'error');
}

// "Final": iki formun deneyimini onaylar ve iki ayrı promptu birlikte üretir.
export async function runFinal(app) {
  const edited = FORM_IDS.filter((id) => app.state.forms[id].prompt.text && app.state.forms[id].prompt.edited);
  const body = h(
    'div',
    {},
    h('p', {}, 'Test ettiğiniz deneyim iki form için final olarak onaylanır ve her form için ayrı, kendi başına yeterli bir geliştirme promptu oluşturulur.'),
    h(
      'ul',
      {},
      FORM_IDS.map((id) => {
        const r = readiness(id, app.state);
        return h('li', {}, h('strong', {}, FORM_LABELS[id]), `: ${r.blockers.length} engelleyici açık soru, ${r.openQuestions.length} diğer açık soru, ${r.openFeedback.length} açık not, ${r.decisions} onaylı karar`);
      }),
    ),
    h('p', { class: 'small muted' }, 'Açık sorular promptta ayrı bölümde listelenir ve geliştiriciye cevap uydurmaması söylenir. Açık notlarınız onaylı gereksinim sayılmaz; promptta "henüz onaylanmamış" olarak yer alır.'),
    edited.length ? h('p', { class: 'warn-text' }, `Elle düzenlediğiniz ${edited.map((id) => FORM_LABELS[id]).join(' ve ')} promptu yeniden oluşturulacak; düzenlemeler kaybolur.`) : null,
  );
  const ok = await new Promise((resolve) => {
    let confirmed = false;
    openDialog({
      title: 'Final: promptlar oluşturulsun mu?',
      body,
      onClose: () => resolve(confirmed),
      actions: (close) => [
        button('Vazgeç', close),
        button('Final — promptları oluştur', () => {
          confirmed = true;
          close();
        }, { variant: 'primary', id: 'confirm-final' }),
      ],
    });
  });
  if (!ok) return;
  app.commit((state) => {
    for (const id of FORM_IDS) {
      confirmExperience(state, id);
      generateInto(state, id);
    }
    state.finalizedAt = nowIso();
  });
  app.flush();
  showFinalResult(app);
}

function showFinalResult(app) {
  const body = h('div', { class: 'final-list' });
  let handle = null;
  for (const id of FORM_IDS) {
    const text = app.state.forms[id].prompt.text;
    const r = readiness(id, app.state);
    body.append(
      h(
        'div',
        { class: 'final-item', id: `final-${id}` },
        h('div', { class: 'card-head' }, h('h3', {}, `${FORM_LABELS[id]} geliştirme promptu`), badge(r.label, r.tone)),
        h('p', { class: 'small muted' }, `${text.length.toLocaleString('tr-TR')} karakter · ${r.blockers.length} engelleyici açık soru · ${r.openQuestions.length} diğer açık soru · ${r.openFeedback.length} açık not`),
        h(
          'div',
          { class: 'row' },
          button('Kopyala', () => copyPrompt(text), { variant: 'primary', id: `final-copy-${id}` }),
          button('Metin dosyası olarak indir (.txt)', () => downloadText(promptFileName(id), text), { id: `final-download-${id}` }),
          button('Görüntüle / düzenle', () => {
            handle.close();
            app.commit((s) => {
              s.activeForm = id;
              s.forms[id].activeTab = 'prompt';
            });
            window.scrollTo(0, 0);
          }, { variant: 'ghost', id: `final-view-${id}` }),
        ),
      ),
    );
  }
  body.append(h('p', { class: 'small' }, 'Promptları kodlama ajanına (ör. Claude Code) ayrı ayrı verin. Testi sürdürüp tekrar "Final"e basarsanız promptlar güncel verilerle yeniden oluşur.'));
  handle = openDialog({
    title: 'Final promptlar hazır',
    wide: true,
    body,
    actions: (close) => [button('İnceleme yedeğini indir (JSON)', () => app.exportReview(), { id: 'final-export' }), button('Kapat', close, { variant: 'primary', id: 'final-close' })],
  });
}

function readinessCard(app, formId) {
  const r = readiness(formId, app.state);
  const isActive = app.formId === formId;
  return h(
    'div',
    { class: `ready-card ${isActive ? 'active' : ''}`, id: `ready-${formId}` },
    h('div', { class: 'card-head' }, h('h3', {}, FORM_LABELS[formId]), badge(r.label, r.tone)),
    h('p', { class: 'small muted' }, r.detail),
    h(
      'dl',
      { class: 'ready-stats' },
      h('dt', {}, 'Engelleyici açık soru'), h('dd', { class: r.blockers.length ? 'bad' : '' }, String(r.blockers.length)),
      h('dt', {}, 'Diğer açık soru'), h('dd', {}, String(r.openQuestions.length)),
      h('dt', {}, 'Onay bekleyen öneri'), h('dd', {}, String(r.proposals.length)),
      h('dt', {}, 'Açık geri bildirim'), h('dd', {}, `${r.openFeedback.length}${r.urgentFeedback.length ? ` (${r.urgentFeedback.length} yüksek/kritik)` : ''}`),
      h('dt', {}, 'Onaylı karar'), h('dd', {}, String(r.decisions)),
      h('dt', {}, 'İncelenen bölüm'), h('dd', {}, `${r.reviewed} / ${r.reviewTotal}`),
      h('dt', {}, 'Deneyim onayı'), h('dd', {}, r.experienceConfirmed ? 'Verildi' : 'Verilmedi'),
    ),
    isActive ? null : button('Bu formun promptuna geç', () => {
      app.commit((s) => {
        s.activeForm = formId;
        s.forms[formId].activeTab = 'prompt';
      });
    }, { small: true, id: `goto-prompt-${formId}` }),
  );
}

function experienceBox(app) {
  const { formId, fs } = app;
  const statusOf = statusLookup(app.state, formId);
  const behaviors = experienceBehaviors(formId);
  const box = h('div', { class: 'panel' }, h('h3', {}, 'Test edilen deneyimi final olarak onayla'));
  box.append(
    h('p', { class: 'small' }, 'Prompt, prototipte test ettiğiniz deneyimi (adım akışı, gözden geçirme, hata gösterimi vb.) tanımlar. Prototipin uyguladığı ama belgelerde olmayan davranışlar siz onaylayana kadar promptta "opsiyonel öneri" olarak kalır. Onayladığınızda, aşağıdaki öneri durumundaki davranışlar "Testte benim onayım" olur. Reddettiğiniz/ertelediğiniz davranışlar değişmez.'),
    h('ul', { class: 'mini-list' }, behaviors.map((r) => h('li', {}, h('button', { type: 'button', class: 'chip chip-req', onclick: () => app.goToRequirement(r.id) }, r.id), ` ${STATUS[statusOf(r.id)].label} — `, r.description))),
  );
  if (!fs.experienceConfirmed) {
    box.append(button('Deneyimi final olarak onaylıyorum', async () => {
      const ok = await confirmDialog({ title: 'Deneyimi onayla', message: `Öneri durumundaki ${behaviors.filter((r) => statusOf(r.id) === 'oneri').length} prototip davranışı onaylanacak ve prompta zorunlu olarak girecek. Format doğrulama önerileri bu onaya dahil değildir.`, confirmText: 'Onaylıyorum' });
      if (!ok) return;
      app.commit((state) => confirmExperience(state, formId));
      toast('Deneyim onaylandı. Promptu yeniden oluşturun.', 'success');
    }, { variant: 'primary', id: 'btn-confirm-experience' }));
  } else {
    box.append(
      h('p', { class: 'ok-text' }, 'Deneyim final olarak onaylandı.'),
      button('Onayı geri al', () => {
        app.commit((state) => {
          const f = state.forms[formId];
          f.experienceConfirmed = false;
          for (const r of behaviors) {
            const entry = f.reqStatus[r.id];
            if (entry && entry.status === 'test-onayli' && entry.note === EXPERIENCE_NOTE) delete f.reqStatus[r.id];
          }
        });
      }, { small: true, id: 'btn-undo-experience' }),
    );
  }
  return box;
}

export function renderPromptView(app, main) {
  const { formId, fs } = app;
  const r = readiness(formId, app.state);
  const label = formId === 'cari' ? 'Cari Form Geliştirme Promptunu Oluştur' : 'Yeni Talent Form Geliştirme Promptunu Oluştur';

  main.append(
    h(
      'div',
      { class: 'view-head' },
      h('div', {}, h('h2', {}, 'Prompt hazırlığı'), h('p', { class: 'muted' }, 'Her form için ayrı, kendi başına yeterli bir geliştirme promptu üretilir. Üretim deterministiktir; aynı inceleme verisi her zaman aynı metni verir. Yapay zekâ servisi kullanılmaz.')),
      h('div', {}, button('Final: iki promptu birlikte oluştur', () => runFinal(app), { variant: 'primary', id: 'btn-final-prompt' }), app.state.finalizedAt ? h('p', { class: 'small muted' }, `Son final: ${formatDate(app.state.finalizedAt)}`) : null),
    ),
    h('div', { class: 'ready-grid' }, FORM_IDS.map((id) => readinessCard(app, id))),
  );

  if (r.blockers.length) {
    main.append(
      h(
        'div',
        { class: 'panel panel-red' },
        h('h3', {}, `Engelleyiciler — ${FORM_LABELS[formId]} (${r.blockers.length})`),
        h('p', { class: 'small' }, 'Bunlar cevaplanmadan güvenilir bir final prompt üretilemez. Taslak prompt yine oluşturulabilir; bu sorular promptta ayrı bölümde listelenir ve geliştiriciye cevap uydurmaması söylenir.'),
        h('ul', { class: 'mini-list' }, r.blockers.map((b) => h('li', {}, h('button', { type: 'button', class: 'chip chip-req', onclick: () => app.goToRequirement(b.id) }, b.id), ' ', b.description))),
      ),
    );
  }

  main.append(experienceBox(app));

  const currentHash = reviewHash(formId, app.state);
  const panel = h('div', { class: 'panel' });
  panel.append(h('h3', {}, `${FORM_LABELS[formId]} — geliştirme promptu`));
  const ta = h('textarea', { id: `prompt-text-${formId}`, class: 'prompt-text', rows: 28, spellcheck: 'false', 'aria-label': `${FORM_LABELS[formId]} geliştirme promptu` });
  ta.value = fs.prompt.text || '';
  const meta = h('p', { class: 'small muted', id: 'prompt-meta' });
  const updateMeta = () => {
    const parts = [];
    if (!ta.value) parts.push('Henüz oluşturulmadı.');
    else {
      parts.push(`${ta.value.length.toLocaleString('tr-TR')} karakter`);
      if (fs.prompt.edited) parts.push('elle düzenlendi');
      if (fs.prompt.dataHash && fs.prompt.dataHash !== currentHash) parts.push('inceleme verisi prompt oluşturulduktan sonra değişti — yeniden oluşturmayı düşünün');
    }
    meta.textContent = parts.join(' · ');
  };
  ta.addEventListener('input', () => {
    fs.prompt.text = ta.value;
    fs.prompt.edited = true;
    app.save();
    updateMeta();
  });
  updateMeta();

  const generate = async () => {
    if (fs.prompt.text && fs.prompt.edited) {
      const ok = await confirmDialog({ title: 'Promptu yeniden oluştur', message: 'Bu prompt elle düzenlendi. Yeniden oluşturmak düzenlemelerin üzerine yazar. Diğer formun promptu etkilenmez.', confirmText: 'Üzerine yaz', danger: true });
      if (!ok) return;
    }
    app.commit((state) => generateInto(state, formId));
    toast(`${FORM_LABELS[formId]} promptu oluşturuldu.`, 'success');
  };

  panel.append(
    h(
      'div',
      { class: 'row' },
      button(label, generate, { variant: 'primary', id: 'btn-generate' }),
      button('Kopyala', () => {
        if (!ta.value) return toast('Önce promptu oluşturun.', 'warn');
        return copyPrompt(ta.value);
      }, { id: 'btn-copy' }),
      button('Metin dosyası olarak indir (.txt)', () => {
        if (!ta.value) return toast('Önce promptu oluşturun.', 'warn');
        downloadText(promptFileName(formId), ta.value);
      }, { id: 'btn-download' }),
    ),
    meta,
    ta,
  );
  main.append(panel);
}
