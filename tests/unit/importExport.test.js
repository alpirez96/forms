import test from 'node:test';
import assert from 'node:assert/strict';
import { buildExport, validateImport, applyImport, EXPORT_KIND } from '../../src/core/importExport.js';
import { normalizeState } from '../../src/core/state.js';
import { freshState, addFeedback, addDecision, setStatus } from './helpers.js';

function sampleState() {
  const s = freshState();
  addFeedback(s, 'cari', { category: 'eksik-alan', description: 'IBAN yanında açıklama yok', target: 'field:ibanTry', branch: 'receive', priority: 'yuksek' });
  addFeedback(s, 'talent', { category: 'kosul-hatasi', description: 'Diğer ajans adı sorulmalı' });
  addDecision(s, 'cari', { text: 'Müşteride IBAN opsiyonel', branch: 'receive', change: { kind: 'modify', fieldId: 'ibanTry', patch: { required: 'optional' } } });
  setStatus(s, 'cari', 'C-Q05', 'test-onayli', 'Müşteride IBAN opsiyonel');
  setStatus(s, 'talent', 'S-002', 'ertelendi', 'Sonra');
  s.forms.cari.answers.values.ibanTry = 'TR00 GERCEK VERI'; // dışa aktarılmamalı
  return s;
}

test('dışa aktarım test yanıtlarını içermez ve geri yüklenebilir', () => {
  const s = sampleState();
  const exported = buildExport(s, '2026-01-01T00:00:00.000Z');
  const text = JSON.stringify(exported);
  assert.equal(exported.kind, EXPORT_KIND);
  assert.ok(!text.includes('GERCEK VERI'));
  assert.ok(!('answers' in exported.forms.cari));

  const result = validateImport(text);
  assert.equal(result.ok, true, result.errors.join());
  assert.deepEqual(result.warnings, []);
  const target = normalizeState(null);
  applyImport(target, result.data);
  assert.equal(target.forms.cari.feedback[0].description, 'IBAN yanında açıklama yok');
  assert.equal(target.forms.cari.feedback[0].priority, 'yuksek');
  assert.equal(target.forms.talent.feedback.length, 1);
  assert.equal(target.forms.cari.decisions[0].change.patch.required, 'optional');
  assert.equal(target.forms.cari.reqStatus['C-Q05'].status, 'test-onayli');
  assert.equal(target.shared.reqStatus['S-002'].status, 'ertelendi');
  assert.equal(target.forms.cari.counters.feedback, 1);
});

test('sürüm 1 verisi taşınır: eski "Vergi Dairesi" sayfası (s6) canlı formdaki s4 olur', () => {
  const v1 = {
    kind: EXPORT_KIND,
    schemaVersion: 1,
    forms: {
      cari: {
        feedback: [{ id: 'GB-C-001', category: 'diger', description: 'Vergi dairesi notu', target: 'section:s6' }],
        decisions: [{ id: 'K-C-001', text: 'Yeni alan', target: 'section:s6', change: { kind: 'add', add: { sectionId: 's6', label: 'Ek', type: 'text' } } }],
        sectionReviewed: { 'issue:s6': true, 'issue:s2': true },
      },
    },
  };
  const r = validateImport(JSON.stringify(v1));
  assert.equal(r.ok, true);
  const cari = r.data.forms.cari;
  assert.equal(cari.feedback[0].target, 'section:s4');
  assert.equal(cari.decisions[0].target, 'section:s4');
  assert.equal(cari.decisions[0].change.add.sectionId, 's4');
  assert.deepEqual(Object.keys(cari.sectionReviewed).sort(), ['issue:s2', 'issue:s4']);

  const stored = normalizeState({ schemaVersion: 1, forms: { cari: { ui: { step: 's6', simulate: { s5: false } }, feedback: [{ id: 'GB-C-001', target: 'section:s6' }] } } });
  assert.equal(stored.forms.cari.ui.step, 's4');
  assert.ok(!('simulate' in stored.forms.cari.ui));
  assert.equal(stored.forms.cari.feedback[0].target, 'section:s4');
  const current = normalizeState({ schemaVersion: 2, forms: { cari: { ui: { step: 's6' } } } });
  assert.equal(current.forms.cari.ui.step, 's6', 'güncel sürüm yeniden taşınmaz');
});

test('bozuk dosyalar anlaşılır hatayla reddedilir', () => {
  assert.equal(validateImport('').ok, false);
  assert.match(validateImport('{bozuk').errors[0], /JSON/);
  assert.match(validateImport('[]').errors[0], /nesne/);
  assert.match(validateImport(JSON.stringify({ kind: 'baska' })).errors[0], /kind/);
  assert.match(validateImport(JSON.stringify({ kind: EXPORT_KIND, schemaVersion: 99, forms: {} })).errors[0], /sürüm/);
  assert.match(validateImport(JSON.stringify({ kind: EXPORT_KIND, schemaVersion: 1 })).errors[0], /forms/);
});

test('geçersiz kayıtlar atlanır, uyarı verilir; formlar karışmaz', () => {
  const payload = {
    kind: EXPORT_KIND,
    schemaVersion: 1,
    forms: {
      cari: {
        feedback: [
          { id: 'GB-C-001', category: 'diger', description: 'geçerli', status: 'acik', branch: 'issue' },
          { id: 'GB-C-002', category: 'olmayan', description: 'x' },
          { id: 'GB-C-003', category: 'diger', description: '   ' },
          'metin',
          { id: 'GB-C-004', category: 'diger', description: '<img src=x onerror=alert(1)>', status: 'tuhaf', priority: 'çok' },
        ],
        decisions: [{ id: 'K-C-001', text: '' }, { id: 'K-C-002', text: 'ok', change: { kind: 'hack' } }],
        reqStatus: { 'C-001': { status: 'reddedildi' }, 'T-010': { status: 'oneri' }, 'C-002': { status: 'yok' } },
      },
    },
    shared: { reqStatus: { 'S-001': { status: 'ertelendi' }, 'C-001': { status: 'oneri' } } },
  };
  const r = validateImport(JSON.stringify(payload));
  assert.equal(r.ok, true);
  const cari = r.data.forms.cari;
  assert.deepEqual(cari.feedback.map((f) => f.id), ['GB-C-001', 'GB-C-004']);
  assert.equal(cari.feedback[1].status, 'acik');
  assert.equal(cari.feedback[1].priority, '');
  assert.equal(cari.feedback[1].description, '<img src=x onerror=alert(1)>', 'metin olarak saklanır; arayüz textContent kullanır');
  assert.deepEqual(cari.decisions.map((d) => d.id), ['K-C-002']);
  assert.equal(cari.decisions[0].change.kind, 'none');
  assert.deepEqual(Object.keys(cari.reqStatus), ['C-001'], 'Talent kimliği Cari durumuna giremez');
  assert.deepEqual(Object.keys(r.data.shared.reqStatus), ['S-001']);
  assert.equal(r.data.forms.talent.feedback.length, 0);
  assert.ok(r.warnings.length >= 7);
  assert.equal(cari.counters.feedback, 4, 'sayaç en yüksek kimlikten devam eder');
});
