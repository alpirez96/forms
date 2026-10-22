// Gereksinim envanterinin iç tutarlılığı ve izlenebilirliği.
import test from 'node:test';
import assert from 'node:assert/strict';
import { FORMS, FORM_IDS, requirementsFor, SHARED_REQUIREMENTS } from '../../src/data/registry.js';
import { SOURCES, STATUS, CONFIDENCE, REQ_TYPES, AUDIENCES } from '../../src/data/enums.js';
import { effectiveForm, sectionFields, statusLookup } from '../../src/core/schema.js';
import { validateField } from '../../src/core/validation.js';
import { freshState } from './helpers.js';

const allFields = (formId) => {
  const ids = new Set();
  const form = FORMS[formId];
  if (form.hasBranches) ids.add(form.branchQuestion.fieldId);
  for (const s of form.sections) for (const g of s.groups || []) for (const f of g.fields) ids.add(f.id);
  return ids;
};

test('gereksinim kimlikleri benzersiz', () => {
  const seen = new Set();
  for (const id of FORM_IDS) for (const r of FORMS[id].requirements) {
    assert.ok(!seen.has(r.id), `tekrarlanan kimlik ${r.id}`);
    seen.add(r.id);
  }
  for (const r of SHARED_REQUIREMENTS) {
    assert.ok(!seen.has(r.id), `tekrarlanan kimlik ${r.id}`);
    seen.add(r.id);
  }
});

test('her gereksinim geçerli kaynak, tür, güven ve durum kullanır', () => {
  for (const id of FORM_IDS) {
    for (const r of requirementsFor(id)) {
      assert.ok(r.source.length > 0, `${r.id} kaynaksız`);
      for (const s of r.source) assert.ok(SOURCES[s], `${r.id} bilinmeyen kaynak ${s}`);
      assert.ok(r.ref, `${r.id} referanssız`);
      assert.ok(REQ_TYPES[r.type], `${r.id} tür`);
      assert.ok(CONFIDENCE[r.confidence], `${r.id} güven`);
      assert.ok(STATUS[r.defaultStatus], `${r.id} durum`);
      assert.ok(r.description.length > 10, `${r.id} açıklama`);
    }
  }
});

test('gereksinimlerin işaret ettiği alanlar ilgili formda var', () => {
  for (const id of FORM_IDS) {
    const fields = allFields(id);
    for (const r of requirementsFor(id)) for (const f of r.fields) assert.ok(fields.has(f), `${id}: ${r.id} → ${f} alanı yok`);
  }
});

test('alanların, bayrakların ve kontrollerin gereksinim referansları mevcut', () => {
  for (const id of FORM_IDS) {
    const ids = new Set(requirementsFor(id).map((r) => r.id));
    for (const s of FORMS[id].sections) {
      for (const r of s.reqs || []) assert.ok(ids.has(r), `${id}: bölüm ${s.id} → ${r}`);
      for (const g of s.groups || []) for (const f of g.fields) {
        for (const r of f.reqs || []) assert.ok(ids.has(r), `${id}: ${f.id} → ${r}`);
        for (const fl of f.flags || []) assert.ok(ids.has(fl.req), `${id}: ${f.id} bayrak → ${fl.req}`);
        for (const c of f.checks || []) assert.ok(ids.has(c.req), `${id}: ${f.id} kontrol → ${c.req}`);
        if (f.proposalReq) assert.ok(ids.has(f.proposalReq));
        assert.ok(SOURCES[f.source], `${f.id} kaynak`);
      }
    }
    for (const ins of FORMS[id].instructions) {
      assert.ok(AUDIENCES[ins.audience], `${ins.title} kitle`);
      for (const r of ins.reqs) assert.ok(ids.has(r), `${id}: talimat ${ins.title} → ${r}`);
    }
  }
});

test('yönlendirme tanımı tutarlı: her seçeneğin yolu var ve yollar mevcut sayfalara gider', () => {
  const { routing, sections } = FORMS.cari;
  const field = sections[0].groups.flatMap((g) => g.fields).find((f) => f.id === routing.fieldId);
  assert.ok(field, 'yönlendirme sorusu ilk sayfada');
  assert.deepEqual(Object.keys(routing.paths).sort(), field.options.slice().sort(), 'her seçeneğin bir yolu var');
  const pages = new Set(sections.filter((s) => s.kind === 'fields').map((s) => s.id));
  for (const path of Object.values(routing.paths)) for (const id of path) assert.ok(pages.has(id), `bilinmeyen sayfa ${id}`);
  const reached = new Set(Object.values(routing.paths).flat());
  for (const s of sections.slice(1)) {
    if (s.kind === 'fields') assert.ok(reached.has(s.id), `${s.id} hiçbir yoldan ulaşılmıyor`);
    else assert.ok(!reached.has(s.id), 'teknik bölüme ulaşılmamalı');
  }
  const reqIds = new Set(requirementsFor('cari').map((r) => r.id));
  for (const r of routing.reqs) assert.ok(reqIds.has(r));
  assert.ok(reqIds.has(FORMS.cari.confirmation.req));
});

test('Cari Form kaynak belgedeki alan sırasını korur', () => {
  const s1 = FORMS.cari.sections.find((s) => s.id === 's1');
  const order = s1.groups.flatMap((g) => g.fields.map((f) => f.label));
  assert.deepEqual(order, [
    'Talebi Gönderen Personel', 'Cari Türü', 'Cari Hesap Adı', 'Nickname', 'Ülke', 'İl ve İlçe', 'Adres', 'Posta Kodu',
    'Yetkili Adı Soyadı', 'Yetkili Telefon No', 'Yetkili Mail', 'Finans Mail', 'Finans Telefon No', 'IBAN (TRY)', 'IBAN (USD)',
    'Vergi Levhası ve İmzalı Banka Bilgisi (PDF)', 'Şirket/Belge Türü',
  ]);
});

test('Yeni Talent Formu kaynak belgedeki alan sırasını ve seçenekleri korur', () => {
  const fields = FORMS.talent.sections[0].groups.flatMap((g) => g.fields);
  assert.deepEqual(fields.map((f) => f.label), [
    'Talebi Gönderen Kişi Mail', 'Talent İsim Soyisim', 'Bir ajansa bağlı mı?', 'Fotoğraf', 'Talent Nickname', 'Kategori', 'Cari Adı', 'Belge Tipi',
    'Instagram Link', 'YouTube Link', 'TikTok Link', 'Twitch Link',
  ]);
  const byId = Object.fromEntries(fields.map((f) => [f.id, f]));
  assert.deepEqual(byId.kategori.options, ['Lifestyle', 'Entertainment', 'Technology', 'Gaming', 'Sports', 'Other']);
  assert.deepEqual(byId.belgeTipi.options, ['E-Fatura', 'E-Arşiv', 'Gider Pusulası', 'Serbest Meslek Makbuzu', 'İstisna Belgesi']);
  assert.deepEqual(byId.ajansBagli.options, ['Evet, Dome / TEM', 'Evet, Diğer.', 'Hayır']);
  assert.deepEqual(fields.filter((f) => !f.required).map((f) => f.id), ['instagram', 'youtube', 'tiktok', 'twitch']);
});

test('örnek veriler açıkça örnek ve tüm (önerilen dahil) kontrollerden geçer', () => {
  const state = freshState();
  for (const id of FORM_IDS) {
    const form = FORMS[id];
    const branches = form.hasBranches ? ['issue', 'receive'] : [null];
    for (const b of branches) {
      const values = { ...form.sampleAnswers.common, ...(b ? form.sampleAnswers.byBranch[b] : {}) };
      const files = form.sampleAnswers.files;
      for (const s of effectiveForm(id, state, b).sections) {
        for (const f of sectionFields(s)) {
          const r = validateField(f, values[f.id], files[f.id], statusLookup(state, id));
          assert.deepEqual(r.errors, [], `${id}/${b}: ${f.id} hata`);
          assert.deepEqual(r.warnings, [], `${id}/${b}: ${f.id} uyarı`);
        }
      }
    }
    const text = JSON.stringify(form.sampleAnswers);
    assert.ok(/ÖRNEK|ORNEK|ornek|example\.com/.test(text));
  }
});
