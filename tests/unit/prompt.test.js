import test from 'node:test';
import assert from 'node:assert/strict';
import { generatePrompt, reviewHash } from '../../src/core/prompt.js';
import { readiness } from '../../src/core/readiness.js';
import { freshState, addDecision, addFeedback, setStatus } from './helpers.js';

const CARI_ONLY = ['IBAN (TRY)', 'Vergi Dairesi', 'Posta Kodu', 'Fatura keseceğim', 'Şirket/Belge Türü', 'Yetkili Mail', 'TC Kimlik'];
const TALENT_ONLY = ['Twitch Link', 'Talent Nickname', 'Bir ajansa bağlı mı?', 'Talebi Gönderen Kişi Mail', 'Fotoğraf', 'Gider Pusulası', 'Uberkuloz'];

test('prompt üretimi deterministiktir', () => {
  const s = freshState();
  addFeedback(s, 'cari', { description: 'not' });
  assert.equal(generatePrompt('cari', s), generatePrompt('cari', s));
  assert.equal(generatePrompt('talent', s), generatePrompt('talent', s));
  assert.ok(!/\d{4}-\d{2}-\d{2}T/.test(generatePrompt('cari', s)), 'zaman damgası içermez');
});

test('iki prompt bağımsızdır: diğer formun alanlarını içermez', () => {
  const s = freshState();
  const cari = generatePrompt('cari', s);
  const talent = generatePrompt('talent', s);
  for (const t of TALENT_ONLY) assert.ok(!cari.includes(t), `Cari promptunda "${t}" var`);
  for (const t of CARI_ONLY) assert.ok(!talent.includes(t), `Talent promptunda "${t}" var`);
  assert.ok(cari.startsWith('# Cari Hesap Açılış Talep Formu'));
  assert.ok(talent.startsWith('# Yeni Talent Formu'));
});

test('her prompt brifteki 18 bölümü içerir', () => {
  const s = freshState();
  for (const id of ['cari', 'talent']) {
    const p = generatePrompt(id, s);
    for (let n = 1; n <= 18; n += 1) assert.match(p, new RegExp(`^## ${n}\\. `, 'm'), `${id}: bölüm ${n}`);
  }
});

test('Cari promptu ilk soruyu ve iki branşın farkını korur', () => {
  const p = generatePrompt('cari', freshState());
  assert.ok(p.includes('"Fatura mı keseceğim, bana fatura mı kesilecek?"'));
  assert.ok(p.includes('ZORUNLU İLK SORU'));
  assert.ok(p.includes('Seçenekler (bu sırayla) [Fatura keseceğim]: "Genel Tedarikçi", "Satıcı (Ajans)", "Yurtdışı Satıcı (Ajans)", "Talent / Influencer"'));
  assert.ok(p.includes('Seçenekler (bu sırayla) [Bana fatura kesilecek]: "Müşteri", "Yurtdışı Müşteri"'));
});

test('belge metinleri prompta birebir aktarılır', () => {
  const cari = generatePrompt('cari', freshState());
  for (const t of [
    'Sistemimize tedarikçi veya müşteri olarak eklenmeniz ve faturalarınızın zamanında işleme alınabilmesi için bu formda gereken tüm bilgileri doğru şekilde doldurmanızı rica ederiz.',
    'Tüm tedarikçi faturalarında "E" harfi ile başlayan geçerli bir Satın Alma Sipariş (PO) numarası bulunmalıdır.',
    'E-arşiv ve kağıt faturalarınızı lütfen PDF formatında ilgili e-posta adreslerimize iletiniz:',
    'finans@dome.istanbul',
    'Desteklenen 1 dosya yükleyebilirsiniz. En fazla 10 MB olmalıdır.',
    'Örnek: DOME MEDYA VE İLETİŞİM ANONİM ŞİRKETİ',
    'Size fatura keseceksek aşağıdaki kategorilerden birini seçin lütfen.',
  ]) assert.ok(cari.includes(t), `Cari: ${t}`);
  const talent = generatePrompt('talent', freshState());
  for (const t of [
    'Eğer carisi sistemde kayıtlı değilse cari formu da doldurulmalıdır.',
    'Desteklenen 1 dosya yükleyebilirsiniz: image. En fazla 10 MB olmalıdır.',
    '"Evet, Dome / TEM", "Evet, Diğer.", "Hayır"',
    '"Bu, yanıtlanması zorunlu bir sorudur"',
  ]) assert.ok(talent.includes(t), `Talent: ${t}`);
});

test('açık ve engelleyici sorular görünür; geliştiriciye uydurmaması söylenir', () => {
  const p = generatePrompt('cari', freshState());
  assert.ok(p.includes('### 12.1 Engelleyici sorular'));
  for (const id of ['C-Q01', 'C-Q02', 'C-Q03', 'C-Q04', 'C-Q09']) assert.ok(p.includes(`[${id}]`), id);
  assert.ok(p.includes('Cevap uydurma'));
  assert.ok(p.includes('TASLAK'));
});

test('onaylı karar yalnızca kendi formunun promptuna girer ve alan envanterine uygulanır', () => {
  const s = freshState();
  addDecision(s, 'cari', { text: 'Müşteri branşında IBAN (TRY) isteğe bağlı', branch: 'receive', change: { kind: 'modify', fieldId: 'ibanTry', patch: { required: 'optional' } } });
  const cari = generatePrompt('cari', s);
  const talent = generatePrompt('talent', s);
  assert.ok(cari.includes('[K-C-001]'));
  assert.ok(cari.includes('Zorunlu [Bana fatura kesilecek]: Hayır (isteğe bağlı)'));
  assert.ok(cari.includes('"IBAN (TRY)" (Sayfa 1/6 — Temel bilgiler): Fatura keseceğim → Zorunlu · Bana fatura kesilecek → İsteğe bağlı'));
  assert.ok(!talent.includes('K-C-001'));
});

test('geri bildirim onaylanmadan gereksinim sayılmaz', () => {
  const s = freshState();
  addFeedback(s, 'talent', { description: 'Ajans adı sorulmalı', category: 'eksik-alan' });
  const p = generatePrompt('talent', s);
  const open = p.slice(p.indexOf('### 12.4'), p.indexOf('### 12.5'));
  assert.ok(open.includes('Ajans adı sorulmalı'));
  const approved = p.slice(p.indexOf('### 11.1'), p.indexOf('### 11.2'));
  assert.ok(!approved.includes('Ajans adı sorulmalı'));
});

test('cevaplanan engelleyici açık sorulardan çıkar ve karar notu promptta yer alır', () => {
  const s = freshState();
  setStatus(s, 'talent', 'T-Q06', 'test-onayli', 'Yanıtlar Google Sheets\'e yazılacak');
  const p = generatePrompt('talent', s);
  assert.ok(!p.slice(p.indexOf('### 12.1'), p.indexOf('### 12.2')).includes('[T-Q06]'));
  assert.ok(p.includes('karar (T-Q06): Yanıtlar Google Sheets\'e yazılacak'));
  assert.equal(readiness('talent', s).blockers.length, 0);
});

test('reddedilen öneri alanı envanterden çıkar ve kapsam dışı listelenir', () => {
  const s = freshState();
  setStatus(s, 'cari', 'C-040', 'reddedildi');
  const p = generatePrompt('cari', s);
  assert.ok(!p.includes('`belgeYukleme`'));
  const rejected = p.slice(p.indexOf('### 3.4'), p.indexOf('## 4.'));
  assert.ok(rejected.includes('[C-040]'));
});

test('deneyim onayı prototip davranışlarını zorunlu yapar, çelişki üretmez', () => {
  const s = freshState();
  let p = generatePrompt('cari', s);
  assert.ok(p.includes('OPSİYONEL ÖNERİ (C-P07'));
  assert.ok(!p.includes('gözden geçir ekranında tüm yanıtlar doğru görünür'), 'onaysız gözden geçir adımı testte zorunlu gibi geçmemeli');
  for (const id of ['C-P06', 'C-P07', 'C-P08', 'C-P09']) setStatus(s, 'cari', id, 'test-onayli');
  s.forms.cari.experienceConfirmed = true;
  p = generatePrompt('cari', s);
  assert.ok(p.includes('(C-P07 — onaylı, ZORUNLU)'));
  assert.ok(p.includes('gözden geçir ekranında tüm yanıtlar doğru görünür'));
  assert.ok(p.includes('kullanıcı tarafından final olarak onaylandı'));
});

test('ortak madde durumu iki promptta da aynı görünür', () => {
  const s = freshState();
  setStatus(s, 'cari', 'S-002', 'ertelendi', 'Bir sonraki sürüm');
  const c = generatePrompt('cari', s);
  const t = generatePrompt('talent', s);
  for (const p of [c, t]) {
    const deferred = p.slice(p.indexOf('### 3.3'), p.indexOf('### 3.4'));
    assert.ok(deferred.includes('[S-002]'));
  }
});

test('inceleme özeti veri değişince değişir', () => {
  const s = freshState();
  const before = reviewHash('cari', s);
  addFeedback(s, 'cari', { description: 'x' });
  assert.notEqual(reviewHash('cari', s), before);
  assert.equal(reviewHash('talent', s), reviewHash('talent', freshState()), 'Cari değişikliği Talent özetini etkilemez');
});

test('hazırlık seviyeleri', () => {
  const s = freshState();
  assert.equal(readiness('talent', s).level, 'blocked');
  setStatus(s, 'talent', 'T-Q06', 'test-onayli', 'karar');
  assert.equal(readiness('talent', s).level, 'draft');
});
