// Gereksinim envanterini ve açık soru listesini uygulamanın kullandığı aynı veriden
// Markdown olarak üretir.
// Kullanım: npm run docs

import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { FORMS, FORM_IDS, SHARED_REQUIREMENTS, requirementsFor } from '../src/data/registry.js';
import { SOURCES, STATUS, CONFIDENCE, REQ_TYPES, FORM_LABELS } from '../src/data/enums.js';

const docs = fileURLToPath(new URL('../docs/', import.meta.url));
const cell = (s) => String(s || '—').replace(/\|/g, '\\|').replace(/\n/g, ' ');

function formReqs(formId) {
  return requirementsFor(formId).filter((r) => r.form !== 'both');
}

function detail(r, formLabel) {
  const L = [];
  L.push(`#### ${r.id}${r.blocker ? ' · ENGELLEYİCİ' : ''}${r.conflict ? ' · BELGE ÇELİŞKİSİ' : ''}`, '');
  L.push(`- **Kaynak belge:** ${r.source.map((s) => `${s}${SOURCES[s].file !== '—' ? ` (\`${SOURCES[s].file}\`)` : ` (${SOURCES[s].title})`}`).join(', ')}`);
  L.push(`- **Kaynak bölüm/referans:** ${r.ref}`);
  L.push(`- **Açıklama:** ${r.description}`);
  L.push(`- **Etkilenen form:** ${formLabel}`);
  L.push(`- **Tür:** ${REQ_TYPES[r.type]}`);
  L.push(`- **Güven:** ${CONFIDENCE[r.confidence].label}`);
  L.push(`- **Başlangıç durumu:** ${STATUS[r.defaultStatus].label}`);
  L.push(`- **Uygulama etkisi:** ${r.implications || '—'}`);
  L.push(`- **Açık sorular:** ${r.openQuestions || '—'}`);
  if (r.fields && r.fields.length) L.push(`- **İlgili alanlar:** ${r.fields.map((f) => `\`${f}\``).join(', ')}`);
  L.push('');
  return L;
}

function inventoryDoc() {
  const L = [];
  L.push('# Gereksinim Envanteri', '');
  L.push('> Bu dosya `npm run docs` ile `src/data/` altındaki verilerden otomatik üretilir; elle düzenlemeyin. Uygulamadaki "Gereksinimler ve açık sorular" ekranı aynı veriyi gösterir.', '');
  L.push('Durumlar başlangıç (inceleme öncesi) durumlarıdır. Testte verdiğiniz kararlar uygulamada saklanır ve JSON dışa aktarımına girer.', '');
  L.push('## Kaynak belgeler', '');
  L.push('| Kimlik | Belge | Dosya | İçerik |', '|---|---|---|---|');
  for (const s of Object.values(SOURCES)) L.push(`| ${s.id} | ${cell(s.title)} | ${cell(s.file)} | ${cell(s.summary)} |`);
  L.push('');
  L.push('Güven düzeyleri: **Açıkça belgelenmiş** (belgede birebir görünür) · **Güçlü çıkarım** (belgeden doğrudan çıkarılır ama ifade kesin değil) · **Belirsiz** (belge yanıt vermiyor).', '');

  const sections = [
    ['cari', FORM_LABELS.cari, formReqs('cari')],
    ['talent', FORM_LABELS.talent, formReqs('talent')],
    ['both', FORM_LABELS.both, SHARED_REQUIREMENTS],
  ];
  for (const [, label, reqs] of sections) {
    L.push(`## ${label} (${reqs.length} madde)`, '');
    L.push('| Kimlik | Tür | Güven | Başlangıç durumu | Kaynak | Özet |', '|---|---|---|---|---|---|');
    for (const r of reqs) {
      const summary = r.description.length > 140 ? `${r.description.slice(0, 137)}…` : r.description;
      L.push(`| ${r.id}${r.blocker ? ' ⛔' : ''} | ${REQ_TYPES[r.type]} | ${CONFIDENCE[r.confidence].label} | ${STATUS[r.defaultStatus].label} | ${r.source.join(', ')} | ${cell(summary)} |`);
    }
    L.push('', '### Ayrıntılar', '');
    for (const r of reqs) {
      const formLabel = r.form === 'both'
        ? `Her iki form — Cari etkisi: ${requirementsFor('cari').find((x) => x.id === r.id).implications} / Talent etkisi: ${requirementsFor('talent').find((x) => x.id === r.id).implications}`
        : label;
      L.push(...detail(r.form === 'both' ? { ...r, implications: '' } : r, formLabel));
    }
  }
  return `${L.join('\n')}\n`;
}

function questionsDoc() {
  const L = [];
  L.push('# Açık Sorular ve Onayınızı Bekleyen Kararlar', '');
  L.push('> `npm run docs` ile otomatik üretilir. Bu liste inceleme öncesi durumu gösterir; cevaplarınızı uygulamada ilgili maddenin "Cevap / karar notu" alanına yazın.', '');
  const all = [...formReqs('cari'), ...formReqs('talent'), ...SHARED_REQUIREMENTS];
  const groups = [
    ['1. Engelleyici sorular', (r) => r.blocker && r.defaultStatus === 'acik-soru'],
    ['2. Belge çelişkileri', (r) => r.conflict],
    ['3. Diğer açık sorular', (r) => !r.blocker && !r.conflict && r.defaultStatus === 'acik-soru'],
    ['4. Onayınızı bekleyen öneriler (belgede yok veya belge "olabilir" diyor)', (r) => r.defaultStatus === 'oneri'],
  ];
  for (const [title, pred] of groups) {
    const list = all.filter(pred);
    L.push(`## ${title} — ${list.length}`, '');
    for (const formId of ['cari', 'talent', 'both']) {
      const sub = list.filter((r) => (r.form || (r.id.startsWith('C-') ? 'cari' : 'talent')) === formId);
      if (!sub.length) continue;
      L.push(`### ${FORM_LABELS[formId]}`, '');
      for (const r of sub) {
        L.push(`- **${r.id}** — ${r.description}`);
        L.push(`  - Kaynak: ${r.source.join(', ')} — ${r.ref}`);
        if (r.implications) L.push(`  - Etki / geçici davranış: ${r.implications}`);
        if (r.openQuestions) L.push(`  - Ayrıntı: ${r.openQuestions}`);
      }
      L.push('');
    }
  }
  return `${L.join('\n')}\n`;
}

await writeFile(`${docs}GEREKSINIM_ENVANTERI.md`, inventoryDoc());
await writeFile(`${docs}ACIK_SORULAR.md`, questionsDoc());
console.log('Üretildi: docs/GEREKSINIM_ENVANTERI.md, docs/ACIK_SORULAR.md');
console.log(`Formlar: ${FORM_IDS.map((id) => FORMS[id].title).join(', ')}`);
