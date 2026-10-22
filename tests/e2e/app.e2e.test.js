// Uçtan uca testler (gerçek tarayıcı). Çalıştırma: npm run test:e2e
// SHOTS=<klasör> ortam değişkeni verilirse ekran görüntüleri o klasöre kaydedilir.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('../..', import.meta.url));
const REQUIRED = 'Bu, yanıtlanması zorunlu bir sorudur';
const ISSUE = ['Genel Tedarikçi', 'Satıcı (Ajans)', 'Yurtdışı Satıcı (Ajans)', 'Talent / Influencer'];
const RECEIVE = ['Müşteri', 'Yurtdışı Müşteri'];

let server;
let browser;
let base;

before(async () => {
  const port = 18000 + Math.floor(Math.random() * 1000);
  server = spawn(process.execPath, ['scripts/serve.js', String(port), '--no-open'], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
  // Port doluysa sunucu sıradakine geçer; gerçek portu çıktısından oku.
  const actualPort = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('sunucu başlamadı')), 8000);
    server.stdout.on('data', (d) => {
      const m = String(d).match(/çalışıyor: http:\/\/localhost:(\d+)/);
      if (m) {
        clearTimeout(timer);
        resolve(m[1]);
      }
    });
    server.on('exit', (code) => reject(new Error(`sunucu kapandı: ${code}`)));
  });
  base = process.env.E2E_TARGET === 'tek-dosya' ? pathToFileURL(join(root, 'dist', 'muhasebe-form-prototipi.html')).href : `http://127.0.0.1:${actualPort}/`;
  browser = await chromium.launch();
});

after(async () => {
  if (browser) await browser.close();
  if (server) server.kill();
});

async function open(opts = {}) {
  const context = await browser.newContext({ viewport: opts.viewport || { width: 1360, height: 900 }, acceptDownloads: true });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console: ${m.text()}`);
  });
  await page.goto(base);
  await page.waitForSelector('.form-title');
  return { context, page, errors };
}

async function shot(page, name) {
  if (process.env.SHOTS) await page.screenshot({ path: `${process.env.SHOTS}/${name}.png`, fullPage: true });
}

const radioLabels = (page, fieldId) => page.$$eval(`#fld-${fieldId} .radio span`, (els) => els.map((e) => e.textContent));

async function chooseBranch(page, which) {
  await page.click(which === 'issue' ? 'label[for="in-faturaYonu"]' : 'label[for="in-faturaYonu-1"]');
}

async function confirmModal(page, buttonText) {
  await page.click(`dialog[open] .dialog-foot button:has-text("${buttonText}")`);
}

test('iki form bağımsız olarak erişilebilir', async () => {
  const { context, page, errors } = await open();
  assert.equal(await page.textContent('.form-title'), 'Cari Hesap Açılış Talep Formu');
  await page.click('#formtab-talent');
  assert.equal(await page.textContent('.form-title'), 'Yeni Talent Formu');
  assert.ok(await page.isVisible('#in-talepEdenMail'));
  await shot(page, 'talent-form');
  await page.click('#formtab-cari');
  assert.equal(await page.textContent('.form-title'), 'Cari Hesap Açılış Talep Formu');
  assert.deepEqual(errors, []);
  await context.close();
});

test('Cari: ilk soru diğer alanlardan önce gelir ve yanıtlanmadan ilerlenemez', async () => {
  const { context, page, errors } = await open();
  assert.equal(await page.locator('#in-talepEden').count(), 0);
  assert.ok(await page.isVisible('#fld-faturaYonu'));
  const totalSteps = await page.locator('.stepper .step-btn').count();
  assert.ok(totalSteps >= 2);
  assert.equal(await page.locator('.stepper .step-btn:disabled').count(), totalSteps - 1, 'ilk adım dışındaki tüm adımlar kilitli');
  await page.click('#btn-next');
  assert.equal(await page.textContent('#err-faturaYonu'), REQUIRED);
  assert.equal(await page.locator('#in-talepEden').count(), 0);
  assert.deepEqual(errors, []);
  await context.close();
});

test('Cari: yön değişince kategori seçenekleri güncellenir, geçersiz seçim temizlenir, diğer yanıtlar korunur', async () => {
  const { context, page, errors } = await open();
  await chooseBranch(page, 'issue');
  await page.click('#btn-next');
  assert.deepEqual(await radioLabels(page, 'cariTuru'), ISSUE);
  await page.fill('#in-talepEden', 'ornek@example.com');
  await page.click('#fld-cariTuru label:has-text("Genel Tedarikçi")');
  assert.equal(await page.locator('#fld-cariTuru input:checked').count(), 1);
  await page.click('#btn-change-branch');
  await chooseBranch(page, 'receive');
  assert.match(await page.textContent('#toast-region'), /temizlendi/);
  await page.click('#btn-next');
  assert.deepEqual(await radioLabels(page, 'cariTuru'), RECEIVE);
  assert.equal(await page.locator('#fld-cariTuru input:checked').count(), 0);
  assert.equal(await page.inputValue('#in-talepEden'), 'ornek@example.com');
  assert.match(await page.textContent('#fld-ibanTry'), /C-Q05/, 'müşteri branşında IBAN belirsizliği görünür');
  await shot(page, 'cari-receive-page1');
  assert.deepEqual(errors, []);
  await context.close();
});

test('Talent: zorunlu alanlar ve belgelenmiş dosya kısıtları çalışır; öneri kontrolü engellemez', async () => {
  const { context, page, errors } = await open();
  await page.click('#formtab-talent');
  await page.click('#btn-next');
  assert.equal(await page.locator('.question .field-error').count(), 8);
  const msgs = await page.$$eval('.question .field-error', (els) => [...new Set(els.map((e) => e.textContent))]);
  assert.deepEqual(msgs, [REQUIRED]);
  assert.equal(await page.locator('#fld-instagram .field-error').count(), 0);
  assert.equal(await page.evaluate(() => document.activeElement.id), 'in-talepEdenMail', 'odak ilk hatalı alanda');
  await shot(page, 'talent-errors');

  await page.setInputFiles('#in-fotograf', { name: 'buyuk.jpg', mimeType: 'image/jpeg', buffer: Buffer.alloc(11 * 1024 * 1024) });
  assert.match(await page.textContent('#fb-fotograf'), /10 MB/);
  await page.setInputFiles('#in-fotograf', { name: 'belge.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4') });
  assert.match(await page.textContent('#fb-fotograf'), /görsel/);
  await page.setInputFiles('#in-fotograf', { name: 'ornek.png', mimeType: 'image/png', buffer: Buffer.from([137, 80, 78, 71]) });
  assert.equal(await page.locator('#fb-fotograf .field-error').count(), 0);

  await page.fill('#in-talepEdenMail', 'gecersiz');
  assert.match(await page.textContent('#fb-talepEdenMail'), /Öneri \(T-P01/);
  assert.equal(await page.locator('#fb-talepEdenMail .field-error').count(), 0);
  assert.deepEqual(errors, []);
  await context.close();
});

test('Talent: örnek veri → gözden geçir → gönderim simülasyonu', async () => {
  const { context, page, errors } = await open();
  await page.click('#formtab-talent');
  await page.click('#btn-sample');
  await page.click('#btn-next');
  assert.ok(await page.isVisible('#sec-review'));
  assert.match(await page.textContent('.review'), /ÖRNEK TALENT/);
  await shot(page, 'talent-review');
  await page.click('#btn-next');
  assert.ok(await page.isVisible('.success-panel'));
  assert.deepEqual(errors, []);
  await context.close();
});

for (const branch of ['issue', 'receive']) {
  test(`Cari (${branch}): örnek veriyle tüm adımlar tamamlanır`, async () => {
    const { context, page, errors } = await open();
    await chooseBranch(page, branch);
    await page.click('#btn-next');
    await page.click('#btn-sample');
    const visited = [];
    for (let i = 0; i < 10 && !(await page.locator('.success-panel').count()); i += 1) {
      visited.push(await page.textContent('.section-title'));
      await page.click('#btn-next');
    }
    assert.ok(await page.isVisible('.success-panel'));
    // Örnek veri "Limited / Anonim Şirketi" seçer: 1/6 → 2/6 → 4/6 (canlı form, DOC-D)
    assert.deepEqual(visited, ['Temel bilgiler', 'Vergi Bilgileri - Vergi Numarası / TC Kimlik No', 'Vergi Bilgileri - Vergi Dairesi', 'Gözden geçir ve gönder']);
    assert.equal(await page.textContent('#confirmation-message'), 'Teşekkürler. Cari Talebiniz Alınmıştır.');
    assert.deepEqual(errors, []);
    await context.close();
  });
}

const ROUTES = [
  { answer: 'Şahıs Firması', pages: ['Vergi Bilgileri - Vergi Numarası / TC Kimlik No', 'Vergi Bilgileri - Vergi Dairesi'] },
  { answer: 'İstisna Belgesi', pages: ['İstisna Belgesi', 'TC Kimlik No'] },
  { answer: 'Serbest Meslek Makbuzu', pages: ['TC Kimlik No'] },
  { answer: 'Gider Pusulası', pages: ['TC Kimlik No'] },
];

for (const route of ROUTES) {
  test(`Cari: Şirket/Belge Türü = ${route.answer} canlı formdaki sayfa yolunu izler`, async () => {
    const { context, page, errors } = await open();
    await chooseBranch(page, 'issue');
    await page.click('#btn-next');
    assert.match(await page.textContent('.stepper'), /Sonraki sayfalar "Şirket\/Belge Türü" yanıtına göre belirlenir/);
    await page.click('#btn-sample');
    await page.selectOption('#in-sirketBelgeTuru', route.answer);
    assert.doesNotMatch(await page.textContent('.stepper'), /yanıtına göre belirlenir/);
    const visited = [];
    for (let i = 0; i < 8 && !(await page.locator('.success-panel').count()); i += 1) {
      const title = await page.textContent('.section-title');
      visited.push(title);
      if (title === 'TC Kimlik No') {
        await page.fill('#in-tcKimlikNo', '123456789012');
        await page.click('#btn-next');
        assert.match(await page.textContent('#fb-tcKimlikNo'), /en fazla 11 karakter/, 'canlı formdaki uzunluk sınırı');
        await page.fill('#in-tcKimlikNo', '12345678901');
      }
      if (title === 'İstisna Belgesi') await shot(page, 'cari-istisna');
      await page.click('#btn-next');
    }
    assert.deepEqual(visited, ['Temel bilgiler', ...route.pages, 'Gözden geçir ve gönder']);
    assert.ok(await page.isVisible('.success-panel'));
    assert.deepEqual(errors, []);
    await context.close();
  });
}

test('Cari: yol dışındaki alana gidilmek istendiğinde hangi seçimin gerektiği söylenir', async () => {
  const { context, page, errors } = await open();
  await chooseBranch(page, 'issue');
  await page.click('#btn-next');
  await page.click('#btn-sample');
  await page.click('#tab-requirements');
  await page.fill('#rf-search', 'C-043');
  await page.click('#reqcard-C-043 .chip:has-text("tcKimlikNo")');
  assert.match(await page.textContent('#toast-region'), /İstisna Belgesi, Serbest Meslek Makbuzu, Gider Pusulası/);
  assert.equal(await page.textContent('.section-title'), 'Temel bilgiler');
  assert.ok(await page.isVisible('#fld-sirketBelgeTuru'));
  assert.deepEqual(errors, []);
  await context.close();
});

test('formlar arasında veri ve geri bildirim karışmaz; sayfa yenilenince korunur', async () => {
  const { context, page, errors } = await open();
  await chooseBranch(page, 'issue');
  await page.click('#btn-next');
  await page.fill('#in-cariHesapAdi', 'ÖRNEK CARİ');
  await page.click('#fld-cariHesapAdi .note-btn');
  await page.selectOption('#fb-category', 'yanlis-etiket');
  await page.fill('#fb-description', 'Örnek metni kafa karıştırıcı');
  await page.click('#fb-save');
  assert.match(await page.textContent('#tab-feedback'), /1 açık/);

  await page.click('#formtab-talent');
  assert.doesNotMatch(await page.textContent('#tab-feedback'), /açık/);
  assert.equal(await page.inputValue('#in-cariAdi'), '');
  await page.click('#tab-feedback');
  assert.ok(await page.isVisible('.empty'));

  await page.reload();
  await page.waitForSelector('#formtab-cari');
  assert.ok(await page.isVisible('.empty'), 'yenilemeden sonra Talent geri bildirim sekmesi açık ve boş kalır');
  await page.click('#formtab-cari');
  assert.match(await page.textContent('#tab-feedback'), /1 açık/);
  await page.click('#tab-test');
  assert.equal(await page.inputValue('#in-cariHesapAdi'), 'ÖRNEK CARİ');
  await page.click('#tab-feedback');
  assert.match(await page.textContent('#fbcard-GB-C-001'), /Örnek metni kafa karıştırıcı/);
  assert.match(await page.textContent('#fbcard-GB-C-001'), /Cari Hesap Adı/);
  assert.deepEqual(errors, []);
  await context.close();
});

test('geri bildirim → karar: alan değişikliği prototipe ve yalnızca kendi promptuna yansır', async () => {
  const { context, page, errors } = await open();
  await page.click('#tab-feedback');
  await page.click('#btn-new-feedback');
  await page.selectOption('#fb-branch', 'receive');
  await page.selectOption('#fb-target', 'field:ibanTry');
  await page.selectOption('#fb-category', 'is-kurali');
  await page.fill('#fb-description', 'Müşteriden IBAN istemek gereksiz olabilir');
  await page.fill('#fb-expected', 'Bana fatura kesilecek branşında IBAN (TRY) isteğe bağlı olsun');
  await page.click('#fb-save');
  await page.click('#fb-edit-GB-C-001');
  await page.selectOption('#fb-priority', 'yuksek');
  await page.click('#fb-save');
  assert.match(await page.textContent('#fbcard-GB-C-001'), /Öncelik: Yüksek/);

  await page.click('#fb-decide-GB-C-001');
  assert.equal(await page.inputValue('#dc-field'), 'ibanTry');
  assert.equal(await page.inputValue('#dc-branch'), 'receive');
  await page.selectOption('#dc-required', 'optional');
  await shot(page, 'decision-dialog');
  await page.click('#dc-save');
  assert.match(await page.textContent('#fbcard-GB-C-001'), /Karar: K-C-001/);
  assert.match(await page.textContent('#fbcard-GB-C-001'), /Çözüldü/);

  await page.click('#tab-test');
  await chooseBranch(page, 'receive');
  await page.click('#btn-next');
  assert.equal(await page.locator('#fld-ibanTry .req').count(), 0);
  assert.match(await page.textContent('#fld-ibanTry'), /Kararla değişti: K-C-001/);
  await page.click('#btn-change-branch');
  await chooseBranch(page, 'issue');
  await page.click('#btn-next');
  assert.equal(await page.locator('#fld-ibanTry .req').count(), 1);

  await page.click('#tab-prompt');
  await page.click('#btn-generate');
  const cariPrompt = await page.inputValue('#prompt-text-cari');
  assert.ok(cariPrompt.includes('[K-C-001]'));
  assert.ok(cariPrompt.includes('Fatura keseceğim → Zorunlu · Bana fatura kesilecek → İsteğe bağlı'));
  await shot(page, 'prompt-cari');
  await page.click('#formtab-talent');
  await page.click('#tab-prompt');
  assert.equal(await page.inputValue('#prompt-text-talent'), '');
  await page.click('#btn-generate');
  const talentPrompt = await page.inputValue('#prompt-text-talent');
  assert.ok(!talentPrompt.includes('K-C-001'));
  assert.ok(!talentPrompt.includes('IBAN'));
  await page.click('#formtab-cari');
  assert.equal(await page.inputValue('#prompt-text-cari'), cariPrompt, 'diğer formun promptu üzerine yazılmaz');
  assert.deepEqual(errors, []);
  await context.close();
});

test('prompt: açık sorular görünür, düzenleme korunur, yeniden oluşturma onay ister, .txt indirilir', async () => {
  const { context, page, errors } = await open();
  await page.click('#tab-prompt');
  await page.click('#btn-generate');
  const text = await page.inputValue('#prompt-text-cari');
  assert.ok(text.includes('### 12.1 Engelleyici sorular'));
  assert.ok(text.includes('[C-Q01]'));
  await page.click('#prompt-text-cari');
  await page.keyboard.press('Control+End');
  await page.keyboard.type('\nEK NOT');
  assert.match(await page.textContent('#prompt-meta'), /elle düzenlendi/);
  await page.reload();
  await page.waitForSelector('#prompt-text-cari');
  assert.ok((await page.inputValue('#prompt-text-cari')).endsWith('EK NOT'));
  await page.click('#btn-generate');
  await confirmModal(page, 'Vazgeç');
  assert.ok((await page.inputValue('#prompt-text-cari')).endsWith('EK NOT'));
  const [download] = await Promise.all([page.waitForEvent('download'), page.click('#btn-download')]);
  assert.equal(download.suggestedFilename(), 'cari-form-gelistirme-promptu.txt');
  const content = await readFile(await download.path(), 'utf8');
  assert.equal(content, await page.inputValue('#prompt-text-cari'));
  assert.deepEqual(errors, []);
  await context.close();
});

test('JSON dışa aktarma, içe aktarma ve bozuk dosya', async () => {
  const first = await open();
  await first.page.click('#formtab-talent');
  await first.page.click('#tab-feedback');
  await first.page.click('#btn-new-feedback');
  await first.page.selectOption('#fb-category', 'eksik-alan');
  await first.page.fill('#fb-description', 'Diğer ajans seçilince ajans adı sorulmalı');
  await first.page.click('#fb-save');
  await first.page.click('#tab-test');
  await first.page.fill('#in-talentIsimSoyisim', 'GİZLİ TEST YANITI');
  const [download] = await Promise.all([first.page.waitForEvent('download'), first.page.click('#btn-export')]);
  const json = await readFile(await download.path(), 'utf8');
  const data = JSON.parse(json);
  assert.equal(data.kind, 'muhasebe-form-inceleme');
  assert.equal(data.forms.talent.feedback[0].description, 'Diğer ajans seçilince ajans adı sorulmalı');
  assert.ok(!json.includes('GİZLİ TEST YANITI'), 'test yanıtları dışa aktarılmaz');
  assert.deepEqual(first.errors, []);
  await first.context.close();

  const second = await open();
  await second.page.setInputFiles('#import-file', { name: 'inceleme.json', mimeType: 'application/json', buffer: Buffer.from(json) });
  await second.page.click('#confirm-import');
  await second.page.click('#formtab-talent');
  await second.page.click('#tab-feedback');
  assert.match(await second.page.textContent('#fbcard-GB-T-001'), /ajans adı sorulmalı/);
  await second.page.setInputFiles('#import-file', { name: 'bozuk.json', mimeType: 'application/json', buffer: Buffer.from('bu json değil') });
  assert.match(await second.page.textContent('dialog[open]'), /İçe aktarma hatası/);
  assert.match(await second.page.textContent('dialog[open]'), /geçerli bir JSON değil/);
  await shot(second.page, 'import-error');
  await confirmModal(second.page, 'Kapat');
  assert.match(await second.page.textContent('#fbcard-GB-T-001'), /ajans adı sorulmalı/, 'bozuk dosya mevcut veriyi bozmaz');
  assert.deepEqual(second.errors, []);
  await second.context.close();
});

test('gereksinim durumu, deneyim onayı ve reddedilen öneri prototipi ve promptu günceller', async () => {
  const { context, page, errors } = await open();
  await page.click('#tab-requirements');
  await page.fill('#rf-search', 'C-Q09');
  await page.selectOption('#req-status-C-Q09', 'test-onayli');
  await page.fill('#req-note-C-Q09', 'ÖRNEK KARAR: yanıtlar şirket içi tabloya yazılacak');
  await page.locator('#req-note-C-Q09').blur();
  await shot(page, 'requirements');
  await page.click('#tab-prompt');
  assert.match(await page.textContent('#ready-cari'), /Engelleyici açık soru\s*0/);
  await page.click('#btn-confirm-experience');
  await confirmModal(page, 'Onaylıyorum');
  await page.click('#btn-generate');
  let text = await page.inputValue('#prompt-text-cari');
  assert.ok(text.includes('Prototip deneyimi final onayı: VERİLDİ'));
  assert.ok(text.includes('(C-P07 — onaylı, ZORUNLU)'));
  assert.ok(text.includes('karar (C-Q09): ÖRNEK KARAR: yanıtlar şirket içi tabloya yazılacak'));
  assert.ok(!text.includes('> UYARI: Bu bir TASLAK prompttur'), 'engelleyici kalmayınca taslak uyarısı yok');
  await shot(page, 'prompt-ready');

  await page.click('#tab-requirements');
  await page.fill('#rf-search', 'C-P07');
  await page.selectOption('#req-status-C-P07', 'reddedildi');
  await page.click('#tab-test');
  assert.ok(!(await page.textContent('.stepper')).includes('Gözden geçir'));
  await page.click('#tab-prompt');
  assert.match(await page.textContent('#prompt-meta'), /değişti/);
  await page.click('#btn-generate');
  text = await page.inputValue('#prompt-text-cari');
  assert.ok(text.includes('UYGULANMAYACAK (C-P07'));
  assert.deepEqual(errors, []);
  await context.close();
});

test('Final: iki form için deneyim onaylanır ve iki ayrı prompt üretilir', async () => {
  const { context, page, errors } = await open();
  await page.click('#btn-final');
  assert.match(await page.textContent('dialog[open]'), /Final: promptlar oluşturulsun mu\?/);
  await page.click('#confirm-final');
  await page.waitForSelector('#final-cari');
  assert.match(await page.textContent('#final-cari'), /Cari Form geliştirme promptu/);
  assert.match(await page.textContent('#final-talent'), /Yeni Talent Form geliştirme promptu/);
  await shot(page, 'final-dialog');
  const [d1] = await Promise.all([page.waitForEvent('download'), page.click('#final-download-cari')]);
  assert.equal(d1.suggestedFilename(), 'cari-form-gelistirme-promptu.txt');
  const cari = await readFile(await d1.path(), 'utf8');
  const [d2] = await Promise.all([page.waitForEvent('download'), page.click('#final-download-talent')]);
  assert.equal(d2.suggestedFilename(), 'yeni-talent-form-gelistirme-promptu.txt');
  const talent = await readFile(await d2.path(), 'utf8');
  assert.ok(cari.startsWith('# Cari Hesap Açılış Talep Formu') && cari.includes('Prototip deneyimi final onayı: VERİLDİ'));
  assert.ok(talent.startsWith('# Yeni Talent Formu') && talent.includes('Prototip deneyimi final onayı: VERİLDİ'));
  assert.ok(!talent.includes('IBAN') && !cari.includes('Twitch Link'), 'iki prompt bağımsız');
  await page.click('#final-view-talent');
  assert.equal(await page.inputValue('#prompt-text-talent'), talent);
  await page.reload();
  await page.waitForSelector('#prompt-text-talent');
  assert.equal(await page.inputValue('#prompt-text-talent'), talent, 'final promptlar yenilemede korunur');
  assert.match(await page.textContent('main'), /Son final:/);
  assert.deepEqual(errors, []);
  await context.close();
});

test('erişilebilirlik: her form denetiminin erişilebilir bir etiketi var', async () => {
  const { context, page, errors } = await open();
  const unlabeled = () => page.$$eval('input:not([type=hidden]):not(#import-file), select, textarea', (els) => els
    .filter((el) => {
      if (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby')) return false;
      if (el.closest('label')) return false;
      if (el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`)) return false;
      return true;
    })
    .map((el) => el.id || el.outerHTML.slice(0, 80)));
  assert.deepEqual(await unlabeled(), [], 'Adım 0');
  await chooseBranch(page, 'issue');
  await page.click('#btn-next');
  assert.deepEqual(await unlabeled(), [], 'Cari sayfa 1');
  await page.click('#formtab-talent');
  assert.deepEqual(await unlabeled(), [], 'Talent');
  for (const tab of ['feedback', 'requirements', 'prompt']) {
    await page.click(`#tab-${tab}`);
    assert.deepEqual(await unlabeled(), [], tab);
  }
  await page.click('#tab-feedback');
  await page.click('#btn-new-feedback');
  assert.deepEqual(await unlabeled(), [], 'geri bildirim diyaloğu');
  assert.deepEqual(errors, []);
  await context.close();
});

test('mobil genişlikte yatay kaydırma yok', async () => {
  const { context, page, errors } = await open({ viewport: { width: 375, height: 800 } });
  const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  for (const form of ['cari', 'talent']) {
    await page.click(`#formtab-${form}`);
    for (const tab of ['test', 'instructions', 'feedback', 'requirements', 'decisions', 'prompt']) {
      await page.click(`#tab-${tab}`);
      assert.ok((await overflow()) <= 1, `${form}/${tab} taşıyor`);
    }
  }
  await page.click('#formtab-cari');
  await page.click('#tab-test');
  await chooseBranch(page, 'issue');
  await page.click('#btn-next');
  assert.ok((await overflow()) <= 1, 'Cari sayfa 1 taşıyor');
  await shot(page, 'mobile-cari');
  assert.deepEqual(errors, []);
  await context.close();
});
