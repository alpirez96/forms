import test from 'node:test';
import assert from 'node:assert/strict';
import { effectiveForm, sectionFields, statusLookup, flagActive, invalidChoicesAfterBranchChange, behaviorOn, routedSectionIds, routeAnswersFor } from '../../src/core/schema.js';
import { validateField, ibanValid, isEmptyValue } from '../../src/core/validation.js';
import { FORMS } from '../../src/data/registry.js';
import { REQUIRED_MESSAGE } from '../../src/data/enums.js';
import { freshState, addDecision, setStatus } from './helpers.js';

const field = (state, formId, branch, id) => effectiveForm(formId, state, branch).fieldsById.get(id);

test('Cari Türü seçenekleri fatura yönüne göre değişir; eski seçenekler kullanılmaz', () => {
  const s = freshState();
  assert.deepEqual(field(s, 'cari', 'issue', 'cariTuru').options, ['Genel Tedarikçi', 'Satıcı (Ajans)', 'Yurtdışı Satıcı (Ajans)', 'Talent / Influencer']);
  assert.deepEqual(field(s, 'cari', 'receive', 'cariTuru').options, ['Müşteri', 'Yurtdışı Müşteri']);
  for (const b of ['issue', 'receive']) {
    const opts = field(s, 'cari', b, 'cariTuru').options;
    assert.ok(!opts.includes('Marka') && !opts.includes('Ajans'));
  }
});

test('branşa özel karar yalnızca o branşta uygulanır', () => {
  const s = freshState();
  addDecision(s, 'cari', { branch: 'receive', change: { kind: 'modify', fieldId: 'ibanTry', patch: { required: 'optional' } } });
  assert.equal(field(s, 'cari', 'issue', 'ibanTry').required, true);
  assert.equal(field(s, 'cari', 'receive', 'ibanTry').required, false);
  assert.deepEqual(field(s, 'cari', 'receive', 'ibanTry').changedBy, ['K-C-001']);
});

test('kararla alan eklenir, etiketi değişir veya alan kaldırılır', () => {
  const s = freshState();
  addDecision(s, 'talent', { change: { kind: 'add', add: { sectionId: 't1', label: 'Ajans Adı', type: 'text', required: true } } });
  addDecision(s, 'talent', { change: { kind: 'modify', fieldId: 'twitch', patch: { removed: true } } });
  addDecision(s, 'talent', { change: { kind: 'modify', fieldId: 'kategori', patch: { label: 'İçerik Kategorisi', options: ['A', 'B'] } } });
  const eff = effectiveForm('talent', s, null);
  const fields = sectionFields(eff.sections[0]);
  assert.ok(fields.some((f) => f.label === 'Ajans Adı' && f.required && f.addedBy === 'K-T-001'));
  assert.ok(!fields.some((f) => f.id === 'twitch'));
  const kat = eff.fieldsById.get('kategori');
  assert.equal(kat.label, 'İçerik Kategorisi');
  assert.deepEqual(kat.options, ['A', 'B']);
  // Talent kararları Cari şemasını etkilemez
  const cari = effectiveForm('cari', s, 'issue');
  assert.ok(![...cari.fieldsById.values()].some((f) => f.label === 'Ajans Adı'));
});

test('önerilen PDF alanı öneri reddedilince prototipten kalkar', () => {
  const s = freshState();
  assert.equal(field(s, 'cari', 'issue', 'belgeYukleme').removed, false);
  setStatus(s, 'cari', 'C-040', 'reddedildi');
  assert.equal(field(s, 'cari', 'issue', 'belgeYukleme').removed, true);
});

test('belirsizlik bayrakları koşula göre etkinleşir', () => {
  const flag = { when: { field: 'cariTuru', in: ['Yurtdışı Müşteri'] } };
  assert.equal(flagActive(flag, { cariTuru: 'Yurtdışı Müşteri' }, 'receive'), true);
  assert.equal(flagActive(flag, { cariTuru: 'Müşteri' }, 'receive'), false);
  assert.equal(flagActive({ when: { branch: 'receive' } }, {}, 'issue'), false);
  assert.equal(flagActive({ when: { always: true } }, {}, null), true);
});

test('yön değişince geçersiz kategori seçimi tespit edilir', () => {
  const s = freshState();
  s.forms.cari.answers = { branch: 'issue', values: { cariTuru: 'Genel Tedarikçi', ulke: 'Türkiye' }, files: {} };
  const cleared = invalidChoicesAfterBranchChange('cari', s, 'receive');
  assert.deepEqual(cleared.map((f) => f.id), ['cariTuru']);
});

test('zorunlu alan, boşluk kuralı ve hata metni', () => {
  const s = freshState();
  const f = field(s, 'talent', null, 'talentNickname');
  const st = statusLookup(s, 'talent');
  assert.deepEqual(validateField(f, '', null, st).errors, [REQUIRED_MESSAGE]);
  assert.deepEqual(validateField(f, '   ', null, st).errors, [REQUIRED_MESSAGE]);
  assert.deepEqual(validateField(f, '   ', null, st, { whitespaceIsEmpty: false }).errors, []);
  assert.equal(isEmptyValue(' x '), false);
  assert.equal(behaviorOn('talent', s, 'whitespace'), true);
  setStatus(s, 'talent', 'T-P03', 'reddedildi');
  assert.equal(behaviorOn('talent', s, 'whitespace'), false);
});

test('dosya kısıtları: 10 MB ve görsel türü', () => {
  const s = freshState();
  const photo = field(s, 'talent', null, 'fotograf');
  const st = statusLookup(s, 'talent');
  assert.deepEqual(validateField(photo, undefined, null, st).errors, [REQUIRED_MESSAGE]);
  assert.deepEqual(validateField(photo, undefined, { name: 'a.jpg', size: 1000, type: 'image/jpeg' }, st).errors, []);
  assert.ok(validateField(photo, undefined, { name: 'a.jpg', size: 11 * 1024 * 1024, type: 'image/jpeg' }, st).errors[0].includes('10 MB'));
  assert.ok(validateField(photo, undefined, { name: 'a.pdf', size: 1000, type: 'application/pdf' }, st).errors[0].includes('görsel'));
  const istisna = field(s, 'cari', 'issue', 'istisnaBelgesi');
  assert.deepEqual(validateField(istisna, undefined, { name: 'a.docx', size: 1000, type: 'application/octet-stream' }, statusLookup(s, 'cari')).errors, [], 'tür kısıtı belgede yok');
});

test('format kontrolleri öneri iken uyarı, onaylanınca hata, reddedilince kapalı', () => {
  const s = freshState();
  const f = field(s, 'cari', 'issue', 'finansMail');
  let r = validateField(f, 'gecersiz', null, statusLookup(s, 'cari'));
  assert.deepEqual(r.errors, []);
  assert.equal(r.warnings[0].req, 'C-P01');
  setStatus(s, 'cari', 'C-P01', 'test-onayli');
  r = validateField(f, 'gecersiz', null, statusLookup(s, 'cari'));
  assert.equal(r.errors.length, 1);
  setStatus(s, 'cari', 'C-P01', 'reddedildi');
  r = validateField(f, 'gecersiz', null, statusLookup(s, 'cari'));
  assert.deepEqual(r, { errors: [], warnings: [] });
});

test('Şirket/Belge Türü yanıtı izlenen sayfa yolunu belirler (DOC-D)', () => {
  const route = (v) => routedSectionIds(FORMS.cari, { sirketBelgeTuru: v });
  assert.deepEqual(route('Limited / Anonim Şirketi').ids, ['s1', 's2', 's4']);
  assert.deepEqual(route('Şahıs Firması').ids, ['s1', 's2', 's4']);
  assert.deepEqual(route('İstisna Belgesi').ids, ['s1', 's5', 's3']);
  assert.deepEqual(route('Serbest Meslek Makbuzu').ids, ['s1', 's3']);
  assert.deepEqual(route('Gider Pusulası').ids, ['s1', 's3']);
  assert.deepEqual(routedSectionIds(FORMS.cari, {}), { ids: ['s1'], pending: true, unmapped: false });
  assert.deepEqual(route('Kararla eklenen seçenek'), { ids: ['s1'], pending: false, unmapped: true });
  assert.deepEqual(routeAnswersFor(FORMS.cari, 's3'), ['İstisna Belgesi', 'Serbest Meslek Makbuzu', 'Gider Pusulası']);
  assert.equal(routeAnswersFor(FORMS.cari, 's1'), null);
  assert.deepEqual(routedSectionIds(FORMS.talent, {}).ids, ['t1'], 'yönlendirmesiz formda tüm sayfalar');
  assert.ok(!FORMS.cari.sections.some((s) => s.kind === 'missing'), 'eksik sayfa kalmadı');
});

test('canlı formdaki uzunluk sınırları hata verir (DOC-D)', () => {
  const s = freshState();
  const st = statusLookup(s, 'cari');
  const vergiNo = field(s, 'cari', 'issue', 'vergiNo');
  const tckn = field(s, 'cari', 'issue', 'tcKimlikNo');
  assert.deepEqual(validateField(vergiNo, 'A'.repeat(15), null, st).errors, []);
  assert.match(validateField(vergiNo, 'A'.repeat(16), null, st).errors[0], /en fazla 15 karakter/);
  assert.deepEqual(validateField(tckn, '12345678901', null, st).errors, []);
  assert.match(validateField(tckn, '123456789012', null, st).errors[0], /en fazla 11 karakter/);
  assert.equal(validateField(tckn, '1234', null, st).warnings[0].req, 'C-P10', '11 hane kuralı yalnızca öneri');
  assert.deepEqual(field(s, 'cari', 'issue', 'ulke').options, ['Türkiye', 'Amerika Birleşik Devletleri', 'Birleşik Krallık', 'Çin', 'Diğer']);
  assert.equal(field(s, 'cari', 'issue', 'adres').type, 'textarea');
});

test('IBAN mod-97', () => {
  assert.equal(ibanValid('TR47 0000 0000 0000 0000 0000 00'), true);
  assert.equal(ibanValid('TR48 0000 0000 0000 0000 0000 00'), false);
  assert.equal(ibanValid('GB82 WEST 1234 5698 7654 32'), true);
  assert.equal(ibanValid('kısa'), false);
});
