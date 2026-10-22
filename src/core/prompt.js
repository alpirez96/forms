// Geliştirme promptu üretici. Aynı inceleme verisi her zaman aynı metni üretir (tarih/saat içermez).
// Her form için ayrı, kendi başına yeterli bir prompt üretilir; diğer formun alanları eklenmez.

import { getForm, requirementsFor } from '../data/registry.js';
import {
  SOURCES, STATUS, CONFIDENCE, REQ_TYPES, BRANCHES, BRANCH_SCOPES, FEEDBACK_CATEGORIES, PRIORITIES, FIELD_TYPES,
  AUDIENCES, REQUIRED_MESSAGE,
} from '../data/enums.js';
import {
  effectiveForm, sectionFields, statusLookup, noteLookup, isMandatoryStatus, isDroppedStatus, describeFlagCondition,
  sectionTitle, targetLabel, BEHAVIOR_REQS,
} from './schema.js';
import { CHECKS } from './validation.js';
import { readiness } from './readiness.js';

// --- Yardımcılar -------------------------------------------------------------

export function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(',')}}`;
  }
  return JSON.stringify(value === undefined ? null : value);
}

export function fnv1a(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

const withoutTimes = ({ createdAt, updatedAt, ...rest }) => rest;

export function reviewHash(formId, state) {
  const fs = state.forms[formId];
  const statusOf = statusLookup(state, formId);
  const noteOf = noteLookup(state, formId);
  const statuses = requirementsFor(formId).map((r) => [r.id, statusOf(r.id), noteOf(r.id)]);
  return fnv1a(
    stableStringify({
      formId,
      statuses,
      decisions: fs.decisions.map(withoutTimes),
      feedback: fs.feedback.map(withoutTimes),
      experienceConfirmed: Boolean(fs.experienceConfirmed),
      reviewed: fs.sectionReviewed,
    }),
  );
}

const q = (s) => `"${s}"`;
const byId = (a, b) => a.id.localeCompare(b.id, 'tr', { numeric: true });

function sourceText(ids) {
  return ids.map((id) => (SOURCES[id] ? id : id)).join(', ');
}

function fieldTypeText(field) {
  return FIELD_TYPES[field.type] || field.type;
}

function fileText(file) {
  const parts = [`en fazla ${file.maxFiles || 1} dosya`];
  parts.push(file.maxSizeMB ? `en fazla ${file.maxSizeMB} MB` : 'boyut sınırı belgede yok');
  parts.push(file.acceptLabel ? `yalnızca ${file.acceptLabel}` : 'dosya türü kısıtı belgede yok');
  return parts.join(', ');
}

function decisionChangeText(decision, formId, state) {
  const change = decision.change || { kind: 'none' };
  if (change.kind === 'modify') {
    const p = change.patch || {};
    const parts = [];
    if (p.label) parts.push(`etiket → ${q(p.label)}`);
    if (p.help) parts.push(`açıklama metni → ${q(p.help)}`);
    if (p.placeholder) parts.push(`yer tutucu → ${q(p.placeholder)}`);
    if (p.required === 'required') parts.push('zorunlu yapılır');
    if (p.required === 'optional') parts.push('isteğe bağlı yapılır');
    if (p.options && p.options.length) parts.push(`seçenekler → ${p.options.map(q).join(', ')}`);
    if (p.removed) parts.push('alan kaldırılır');
    if (p.restore) parts.push('alan geri eklenir');
    return `${targetLabel(formId, state, `field:${change.fieldId}`)}: ${parts.join('; ') || 'yapısal değişiklik yok'}`;
  }
  if (change.kind === 'add' && change.add) {
    const a = change.add;
    const section = getForm(formId).sections.find((s) => s.id === a.sectionId);
    const opts = a.options && a.options.length ? `; seçenekler: ${a.options.map(q).join(', ')}` : '';
    const help = a.help ? `; açıklama: ${q(a.help)}` : '';
    return `Yeni alan ${q(a.label)} (${FIELD_TYPES[a.type] || a.type}, ${a.required ? 'zorunlu' : 'isteğe bağlı'}${opts}${help}) → ${section ? sectionTitle(section) : a.sectionId} bölümünün sonuna eklenir`;
  }
  return '';
}

// Bir alanın prompt için öznitelik satırları (sıralı [anahtar, değer]).
function fieldAttrs(field, ctx) {
  const a = [];
  a.push(['Tür', fieldTypeText(field)]);
  a.push(['Zorunlu', field.required ? 'Evet' : 'Hayır (isteğe bağlı)']);
  if (field.help) a.push(['Açıklama metni (alan altında)', q(field.help)]);
  if (field.placeholder) a.push(['Yer tutucu', q(field.placeholder)]);
  if (field.options && field.options.length) a.push(['Seçenekler (bu sırayla)', field.options.map(q).join(', ')]);
  if (field.clearable) a.push(['Seçimi temizle', 'Var (yanıt seçildikten sonra "Seçimi temizle" eylemi)']);
  if (field.file) a.push(['Dosya kısıtları', fileText(field.file)]);
  for (const check of field.checks || []) {
    const status = ctx.statusOf(check.req);
    if (isMandatoryStatus(status)) a.push([`Format doğrulaması (${check.req}, onaylı)`, `${CHECKS[check.kind].label} — hata metni: ${q(CHECKS[check.kind].message)}`]);
    else if (status === 'oneri' || status === 'acik-soru') a.push([`Önerilen format doğrulaması (${check.req})`, `${CHECKS[check.kind].label} — OPSİYONEL, onaylanmadı; onay almadan uygulama`]);
  }
  if (field.proposalReq && !isMandatoryStatus(ctx.statusOf(field.proposalReq))) {
    a.push(['Durum', `ÖNERİLEN ALAN (${field.proposalReq}, ${STATUS[ctx.statusOf(field.proposalReq)].label}) — onaylanmadan uygulama`]);
  }
  if (field.originalOptions) a.push(['Belgedeki eski seçenekler', `${field.originalOptions.map(q).join(', ')} — C-002 ile değiştirildi; kullanma`]);
  if (field.prototypeOptions && field.prototypeOptions.length) {
    a.push(['Prototip yer tutucu seçeneği', `${field.prototypeOptions.map((o) => q(o.label)).join(', ')} yalnızca prototipte test içindir; belgede yok, UYGULAMA`]);
  }
  if (field.labelNote) a.push(['Not', field.labelNote]);
  a.push(['Kaynak', `${field.source}${field.ref ? ` — ${field.ref}` : ''}${field.reqs && field.reqs.length ? ` (${field.reqs.join(', ')})` : ''}`]);
  if (field.changedBy && field.changedBy.length) a.push(['Onaylı değişiklik uygulandı', `${field.changedBy.join(', ')} (Bölüm 11)`]);
  for (const flag of field.flags || []) {
    const status = ctx.statusOf(flag.req);
    if (isDroppedStatus(status)) continue;
    const cond = describeFlagCondition(flag, ctx.fieldsById, BRANCHES);
    if (isMandatoryStatus(status)) {
      const note = ctx.noteOf(flag.req);
      if (note) a.push([`Karar (${flag.req})`, `${cond}: ${note}`]);
    } else {
      a.push([`Belirsizlik (${flag.req})`, `${cond}: ${flag.text} Davranış uydurma; Bölüm 12'ye bak.`]);
    }
  }
  return a;
}

// --- Bağlam ------------------------------------------------------------------

function buildContext(formId, state) {
  const form = getForm(formId);
  const fs = state.forms[formId];
  const statusOf = statusLookup(state, formId);
  const noteOf = noteLookup(state, formId);
  const reqs = requirementsFor(formId).map((r) => ({ ...r, status: statusOf(r.id), note: noteOf(r.id) })).sort(byId);
  const branches = form.hasBranches ? ['issue', 'receive'] : [null];
  const eff = {};
  for (const b of branches) eff[b] = effectiveForm(formId, state, b);
  const fieldsById = new Map();
  for (const b of branches) for (const [id, f] of eff[b].fieldsById) if (!fieldsById.has(id)) fieldsById.set(id, f);
  return { formId, form, fs, state, statusOf, noteOf, reqs, branches, eff, fieldsById, ready: readiness(formId, state), hash: reviewHash(formId, state) };
}

const behaviorStatus = (ctx, key) => {
  const id = BEHAVIOR_REQS[ctx.formId][key];
  return id ? { id, status: ctx.statusOf(id) } : null;
};

// Prototip davranışının prompttaki durumu: 'on' (onaylı), 'off' (reddedildi/ertelendi), 'pending' (öneri/açık).
function behaviorMode(ctx, key) {
  const b = behaviorStatus(ctx, key);
  if (!b) return 'off';
  if (isMandatoryStatus(b.status)) return 'on';
  if (isDroppedStatus(b.status)) return 'off';
  return 'pending';
}

// Gösterim koşulu bilinmeyen sayfadaki alanlar için kısa not.
function conditionNote(ctx, field) {
  const section = ctx.form.sections.find((s) => s.id === field.sectionId);
  if (!section || !section.condition || !section.condition.unknown) return '';
  const st = ctx.statusOf(section.condition.req);
  if (isMandatoryStatus(st) && ctx.noteOf(section.condition.req)) return '';
  return ` (yalnızca sayfa gösterildiğinde; koşul bilinmiyor — ${section.condition.req})`;
}

const proposalPending = (ctx, f) => Boolean(f.proposalReq && !isMandatoryStatus(ctx.statusOf(f.proposalReq)));

function behaviorLine(ctx, key, onText) {
  const b = behaviorStatus(ctx, key);
  if (!b) return null;
  if (isMandatoryStatus(b.status)) return `${onText} (${b.id} — onaylı, ZORUNLU).`;
  if (isDroppedStatus(b.status)) return `${onText} — UYGULANMAYACAK (${b.id}: ${STATUS[b.status].label}).`;
  return `${onText} — OPSİYONEL ÖNERİ (${b.id}, onaylanmadı; uygulamadan önce onay iste).`;
}

// --- Bölümler ----------------------------------------------------------------

function header(ctx, L) {
  const { form, ready } = ctx;
  L.push(`# ${form.title} — Geliştirme Promptu`, '');
  L.push(
    `Bu prompt, "Muhasebe Formları Gereksinim Prototipi" uygulamasındaki kaynak belge analizinden, test sırasında verilen kararlardan ve açık sorulardan deterministik olarak üretilmiştir. Kendi başına yeterlidir; başka bir prompt veya belge okumayı gerektirmez.`,
    '',
  );
  L.push(`- Form: ${form.title}`);
  L.push(`- İnceleme verisi özeti (sürüm izleme için): ${ctx.hash}`);
  L.push(`- Hazırlık durumu: ${ready.label.toLocaleUpperCase('tr-TR')} — ${ready.detail}`);
  L.push(
    `- Engelleyici açık soru: ${ready.blockers.length} · Diğer açık soru: ${ready.openQuestions.length} · Onay bekleyen öneri: ${ready.proposals.length} · Açık geri bildirim: ${ready.openFeedback.length} · Onaylı karar: ${ready.decisions}`,
  );
  L.push(`- İncelenen bölüm: ${ready.reviewed}/${ready.reviewTotal} · Prototip deneyimi final onayı: ${ready.experienceConfirmed ? 'VERİLDİ' : 'henüz verilmedi'}`);
  if (ready.blockers.length) {
    L.push('', `> UYARI: Bu bir TASLAK prompttur. ${ready.blockers.length} engelleyici soru (Bölüm 12.1) cevaplanmadan ilgili kısımları uygulama; yapılandırılabilir yer tutucu/TODO bırak ve soruları raporla.`);
  }
  L.push('');
}

function readingRules(ctx, L) {
  L.push('## 0. Bu promptu nasıl uygulamalısın', '');
  L.push('- ZORUNLU: Bölüm 3.1\'deki gereksinimler, Bölüm 4–10\'daki tanımlar (aksi işaretlenmedikçe), Bölüm 11\'deki onaylı değişiklikler ve Bölüm 14\'teki kabul kriterleri.');
  L.push('- OPSİYONEL: "OPSİYONEL ÖNERİ" olarak işaretli maddeler (Bölüm 3.2). Onay almadan uygulama; uygulamak istersen önce sor.');
  L.push('- AÇIK SORU: Bölüm 12\'deki maddeler. Cevap uydurma, varsayımla doldurma. İlgili kısmı yapılandırılabilir yer tutucu veya açık bir TODO ile bırak ve soruyu raporla.');
  L.push('- Öncelik: Bölüm 11\'deki onaylı kararlar kaynak belgedeki tanımın yerine geçer. Alan envanteri (Bölüm 4) bu kararlar uygulanmış hâliyle verilmiştir. Kaynak belgeler arasındaki çelişkileri kendi başına çözme (Bölüm 12.3).');
  L.push('- Tüm kullanıcıya görünen metinler (başlık, etiket, açıklama, seçenek, düğme, hata mesajı) Türkçe ve burada verildiği gibi birebir kullanılmalı; Türkçe karakterler (İ, ı, Ş, ş, Ğ, ğ, Ü, ü, Ö, ö, Ç, ç) korunmalı.');
  L.push('- Kaynak belgelerdeki ekran görüntülerinde alanlara girilmiş değerler test verisidir; gereksinim, varsayılan değer veya format kuralı olarak kullanma.');
  L.push('- Prototipteki test araçları (örnek veri doldurma, test notları, geri bildirim düğmeleri, bölüm göster/gizle simülasyon anahtarları, "incelendi" işaretleri) son ürünün parçası değildir.');
  L.push('');
}

function objective(ctx, L) {
  L.push('## 1. Proje amacı ve kapsam', '');
  if (ctx.formId === 'cari') {
    L.push('Muhasebe ekibinin kullandığı "Cari Hesap Açılış Talep Formu"nu, kaynak belgelerdeki mevcut yapı ve muhasebe ekibinin değişiklik notları esas alınarak geliştir. Form; tedarikçi veya müşteri olarak sisteme eklenecek carinin (cari hesabın) bilgilerini toplar.');
    L.push('');
    L.push('Temel değişiklik: Form, diğer tüm alanlardan önce "Fatura mı keseceğim, bana fatura mı kesilecek?" sorusuyla başlar. Seçenekler "Fatura keseceğim" ve "Bana fatura kesilecek"tir. Bu yanıt, kategori seçeneklerini ve onaylı kararlarla tanımlanan branşa özgü davranışları belirler. İki branşın belgelenmiş farkları korunmalı; belgelenmemiş farklar uydurulmamalıdır.');
  } else {
    L.push('"Yeni Talent Formu"nu kaynak belgede (DOC-B) görünen yapı esas alınarak geliştir. Form; yeni bir talentin (içerik üreticisi / influencer) temel bilgilerini, kategorisini, cari adını, belge tipini ve sosyal medya bağlantılarını toplar.');
  }
  L.push('', '**Kapsamda:** formun ekranları, alanları, metinleri, koşullu davranışları (yalnızca belgelenmiş veya onaylanmış olanlar), doğrulamaları, gözden geçirme/gönderim akışı ve testleri.', '');
  L.push('**Kapsam dışı (ayrıca onaylanmadıkça yapma):**');
  L.push('- Gerçek fatura kesme, muhasebe/ERP entegrasyonu, e-posta gönderimi, ödeme veya herhangi bir finansal işlem.');
  L.push('- Gönderilen verinin nereye kaydedileceği/iletileceği belirlenmediyse gerçek kalıcı gönderim (Bölüm 12).');
  if (ctx.formId === 'cari') {
    L.push('- Kurumdaki ayrı "Yeni Talent Formu". O form ayrı bir sistemdir ve bu görevde değiştirilmez. Yalnızca Bölüm 3 ve 12\'deki ortak (S-) maddelerde ondan söz edilir.');
  } else {
    L.push('- Kurumdaki ayrı "Cari Hesap Açılış Talep Formu". O form ayrı bir sistemdir ve bu görevde değiştirilmez. Yalnızca "Cari Adı" açıklaması ve ortak (S-) maddeler ondan söz eder.');
  }
  L.push('');
}

function sources(ctx, L) {
  L.push('## 2. Kaynak belgeler ve geçerli talimatlar', '');
  const used = new Set(ctx.form.sourceIds);
  for (const r of ctx.reqs) for (const s of r.source) used.add(s);
  const order = ['DOC-A', 'DOC-B', 'DOC-C', 'BRIEF', 'ANALIZ'].filter((id) => used.has(id));
  for (const id of order) {
    const s = SOURCES[id];
    const sharedOnly = !ctx.form.sourceIds.includes(id) && id !== 'ANALIZ';
    L.push(`- **${id}** — ${s.title}${s.file !== '—' ? ` (dosya: ${s.file})` : ''}${sharedOnly ? ' — bu formda yalnızca ortak (S-) maddelerde atıf yapılır' : ''}`);
    L.push(`  ${sharedOnly && s.shortSummary ? s.shortSummary : s.summary}`);
  }
  L.push('', '### 2.1 Belgelerdeki talimatlar ve hedef kitleleri', '');
  L.push('Belgelerde farklı kitlelere yönelik metinler var. Formu dolduran kişiye gösterilecek metinlerle, ekibin tasarım/geliştirme notlarını ve platform metinlerini karıştırma.', '');
  for (const ins of ctx.form.instructions) {
    L.push(`- [${AUDIENCES[ins.audience]}] **${ins.title}** (${ins.source} — ${ins.ref}${ins.reqs.length ? `; ${ins.reqs.join(', ')}` : ''})`);
    L.push(`  ${ins.text}`);
  }
  L.push('');
}

function reqLine(r, L) {
  L.push(`- [${r.id}] ${r.description}`);
  L.push(`  Kaynak: ${sourceText(r.source)} — ${r.ref} · Tür: ${REQ_TYPES[r.type]} · Güven: ${CONFIDENCE[r.confidence].label} · Durum: ${STATUS[r.status].label}${r.form === 'both' ? ' · Ortak madde (iki form)' : ''}`);
  if (r.implications) L.push(`  Etki: ${r.implications}`);
  if (r.openQuestions) L.push(`  Not/soru: ${r.openQuestions}`);
  if (r.note) L.push(`  Karar notu: ${r.note}`);
}

function requirements(ctx, L) {
  L.push('## 3. Kaynağa izlenebilir gereksinimler', '');
  L.push('Her madde kaynak belge ve bölüm referansıyla verilmiştir. Açık sorular burada değil, Bölüm 12\'dedir.', '');
  const groups = [
    ['3.1 Zorunlu gereksinimler (kaynakla veya kullanıcı onayıyla doğrulanmış)', (r) => isMandatoryStatus(r.status)],
    ['3.2 Opsiyonel öneriler (onaylanmadı — onay almadan uygulama)', (r) => r.status === 'oneri'],
    ['3.3 Ertelenen kararlar (bu iterasyonda uygulama; gerekiyorsa TODO bırak)', (r) => r.status === 'ertelendi'],
    ['3.4 Reddedilen / kapsam dışı maddeler (UYGULAMA)', (r) => r.status === 'reddedildi'],
  ];
  for (const [title, pred] of groups) {
    const list = ctx.reqs.filter(pred);
    L.push(`### ${title}`, '');
    if (!list.length) L.push('- Yok.');
    for (const r of list) reqLine(r, L);
    L.push('');
  }
}

function orderedFieldIds(ctx, section) {
  const ids = [];
  for (const b of ctx.branches) {
    const s = ctx.eff[b].sections.find((x) => x.id === section.id);
    for (const f of sectionFields(s, { includeRemoved: true })) if (!ids.includes(f.id)) ids.push(f.id);
  }
  return ids;
}

function fieldInBranch(ctx, sectionId, fieldId, branch) {
  const s = ctx.eff[branch].sections.find((x) => x.id === sectionId);
  return sectionFields(s, { includeRemoved: true }).find((f) => f.id === fieldId) || null;
}

function fieldBlock(ctx, section, fieldId, n, L) {
  const per = ctx.branches.map((b) => [b, fieldInBranch(ctx, section.id, fieldId, b)]);
  const present = per.filter(([, f]) => f && !f.removed);
  const any = per.find(([, f]) => f)[1];
  if (!present.length) {
    if (any.proposalReq && !any.changedBy.length) return n; // reddedilen/ertelenen öneri alanı: Bölüm 3.4/3.3'te
    L.push(`${n}. \`${fieldId}\` — ${q(any.label)} — KALDIRILDI (${any.changedBy.join(', ')})`);
    return n + 1;
  }
  const first = present[0][1];
  L.push(`${n}. \`${fieldId}\` — ${q(first.label)}`);
  if (ctx.branches.length > 1) {
    const missing = per.filter(([, f]) => !f || f.removed).map(([b]) => BRANCHES[b]);
    if (missing.length) L.push(`   - Branş: yalnızca ${present.map(([b]) => BRANCHES[b]).join(', ')} (${missing.join(', ')} branşında yok)`);
  }
  const attrs = present.map(([b, f]) => [b, fieldAttrs(f, ctx)]);
  const keys = [];
  for (const [, list] of attrs) for (const [k] of list) if (!keys.includes(k)) keys.push(k);
  for (const key of keys) {
    const vals = attrs.map(([b, list]) => [b, (list.find(([k]) => k === key) || [])[1]]);
    const distinct = new Set(vals.map(([, v]) => v || ''));
    if (distinct.size === 1) {
      if (vals[0][1]) L.push(`   - ${key}: ${vals[0][1]}`);
    } else {
      for (const [b, v] of vals) L.push(`   - ${key} [${BRANCHES[b]}]: ${v || '—'}`);
    }
  }
  return n + 1;
}

function inventory(ctx, L) {
  L.push('## 4. Tam alan envanteri', '');
  L.push('Alanlar ekranda bu sırayla gösterilir. Onaylı kararlar uygulanmış hâldedir. Branşa göre farklılaşan öznitelikler "[branş]" etiketiyle ayrı verilmiştir.', '');
  if (ctx.form.hasBranches) {
    const bq = ctx.form.branchQuestion;
    L.push('### Adım 0 — Fatura yönü (ZORUNLU İLK SORU)', '');
    L.push(`1. \`${bq.fieldId}\` — ${q(bq.label)}`);
    L.push('   - Tür: Tek seçim (radyo / büyük seçim kartları) · Zorunlu: Evet');
    L.push(`   - Seçenekler (bu sırayla): ${bq.options.map((o) => `${q(o.label)} (değer: ${o.value})`).join(', ')}`);
    L.push('   - Diğer tüm alanlardan önce, tek başına gösterilir; yanıtlanmadan sonraki adımlara geçilemez.');
    L.push(`   - Kaynak: ${bq.source} (${bq.reqs.join(', ')})`, '');
  }
  for (const section of ctx.form.sections) {
    L.push(`### ${sectionTitle(section)}`, '');
    if (section.kind === 'missing') {
      L.push(`- İÇERİK BİLİNMİYOR (${section.reqs.join(', ')}). Kaynak: ${section.source} — ${section.ref}.`);
      L.push('- Bu sayfanın alanlarını uydurma. Sayfa yapısında yer tutucu/TODO bırak ve soruyu raporla.', '');
      continue;
    }
    if (section.titleNote) L.push(`Not: ${section.titleNote}`, '');
    if (section.condition && section.condition.unknown) {
      const st = ctx.statusOf(section.condition.req);
      const note = ctx.noteOf(section.condition.req);
      if (isMandatoryStatus(st) && note) L.push(`Gösterim koşulu (karar ${section.condition.req}): ${note}`, '');
      else L.push(`Gösterim koşulu: BİLİNMİYOR (${section.condition.req}). ${section.condition.text.replace(' Test için göster/gizle anahtarını kullanın.', '')} Koşulu uydurma; yapılandırılabilir bırak.`, '');
    }
    let n = 1;
    const baseGroups = ctx.eff[ctx.branches[0]].sections.find((s) => s.id === section.id).groups;
    const ids = orderedFieldIds(ctx, section);
    for (const group of baseGroups) {
      const groupIds = ids.filter((id) => group.fields.some((f) => f.id === id));
      if (group.title) L.push(`#### ${group.title}`, '');
      for (const id of groupIds) n = fieldBlock(ctx, section, id, n, L);
      if (group.title) L.push('');
    }
    // Yalnızca diğer branşta eklenmiş alanlar
    const leftovers = ids.filter((id) => !baseGroups.some((g) => g.fields.some((f) => f.id === id)));
    for (const id of leftovers) n = fieldBlock(ctx, section, id, n, L);
    L.push('');
  }
}

function texts(ctx, L) {
  const { form } = ctx;
  const h = form.header;
  L.push('## 5. Metin içerikleri (birebir kullanılacak)', '');
  L.push(`- Form başlığı: ${q(h.title)}`);
  if (h.intro) L.push(`- Giriş metni: ${q(h.intro)}`);
  if (h.notices && h.notices.length) {
    L.push(`- Bilgilendirme başlığı (kalın): ${q(h.noticeTitle)}`);
    for (const n of h.notices) L.push(`  - Madde (${n.req}): kalın ${q(n.title)} + ${q(n.text)}${n.email ? ` + e-posta bağlantısı ${n.email} (mailto)` : ''}`);
    if (h.noticeFlag) {
      const st = ctx.statusOf(h.noticeFlag.req);
      if (!isMandatoryStatus(st)) L.push(`  - Belirsizlik (${h.noticeFlag.req}): ${h.noticeFlag.text} Karar verilene kadar bilgilendirme her iki branşta gösterilir; branşa göre gizleme uydurma.`);
      else if (ctx.noteOf(h.noticeFlag.req)) L.push(`  - Karar (${h.noticeFlag.req}): ${ctx.noteOf(h.noticeFlag.req)}`);
    }
  }
  if (h.privacy) {
    L.push(`- Gizlilik metni (${h.privacy.req}): ${q(h.privacy.before.trim())} + bağlantı metni ${q(h.privacy.link)}. Bağlantı adresi: ${ctx.noteOf(h.privacy.flag.req) && isMandatoryStatus(ctx.statusOf(h.privacy.flag.req)) ? ctx.noteOf(h.privacy.flag.req) : `BİLİNMİYOR (${h.privacy.flag.req}); yapılandırılabilir yer tutucu kullan, mevcut bozuk bağlantıyı kopyalama (C-009)`}.`);
  }
  L.push(`- Zorunluluk açıklaması: ${q(h.requiredLegend)} (yıldız kırmızı)`);
  L.push(`- Zorunlu alan hata mesajı: ${q(REQUIRED_MESSAGE)}`);
  if (form.hasBranches) {
    L.push(`- İlk soru: ${q(form.branchQuestion.label)}; seçenekler ${form.branchQuestion.options.map((o) => q(o.label)).join(' / ')}`);
    const cat = ctx.fieldsById.get('cariTuru');
    if (cat && cat.helpByBranch) {
      L.push(`- Kategori sorusu açıklaması [Fatura keseceğim]: ${q(cat.helpByBranch.issue)}`);
      L.push(`- Kategori sorusu açıklaması [Bana fatura kesilecek]: ${q(cat.helpByBranch.receive)}`);
    }
  }
  const nav = form.navigation;
  L.push(`- Düğmeler: ${Object.values(nav).filter((v) => !v.includes('X /')).map(q).join(', ')}${nav.progress ? `; ilerleme göstergesi biçimi ${q(nav.progress)} (sayfa sayısı yeni yapıya göre güncellenir)` : ''}`);
  L.push('');
}

function requiredMatrix(ctx, L) {
  L.push('## 6. Zorunlu ve isteğe bağlı alanlar', '');
  if (ctx.form.hasBranches) L.push(`- ${q(ctx.form.branchQuestion.label)}: Zorunlu (her iki branş için ilk adım)`);
  for (const section of ctx.form.sections) {
    if (section.kind === 'missing') {
      L.push(`- ${sectionTitle(section)}: bilinmiyor (${section.reqs.join(', ')})`);
      continue;
    }
    for (const id of orderedFieldIds(ctx, section)) {
      const per = ctx.branches.map((b) => [b, fieldInBranch(ctx, section.id, id, b)]);
      const any = per.find(([, f]) => f)[1];
      if (per.every(([, f]) => !f || f.removed)) continue;
      const word = (f) => (!f || f.removed ? 'Yok' : f.required ? 'Zorunlu' : 'İsteğe bağlı');
      const proposal = any.proposalReq && !isMandatoryStatus(ctx.statusOf(any.proposalReq)) ? ` — önerilen alan (${any.proposalReq}), onaylanmadı` : '';
      const cond = section.condition && section.condition.unknown ? ` — sayfa koşulu bilinmiyor (${section.condition.req})` : '';
      const words = per.map(([b, f]) => [b, word(f)]);
      const same = new Set(words.map(([, w]) => w)).size === 1;
      const value = same
        ? `${words[0][1]}${ctx.branches.length > 1 ? ' (her iki branş)' : ''}`
        : words.map(([b, w]) => `${BRANCHES[b]} → ${w}`).join(' · ');
      L.push(`- ${q(any.label)} (${sectionTitle(section)}): ${value}${proposal}${cond}`);
    }
  }
  L.push('');
}

function conditional(ctx, L) {
  L.push('## 7. Koşullu mantık ve dallanma', '');
  const decisionsBranch = ctx.fs.decisions.filter((d) => d.branch && d.branch !== 'all').sort(byId);
  if (ctx.form.hasBranches) {
    L.push('### 7.1 Fatura yönü (ana dallanma)', '');
    L.push('- Adım 0\'daki soru yanıtlanmadan form alanları gösterilmez ve sonraki adımlara geçilemez.');
    for (const b of ctx.branches) {
      const cat = ctx.eff[b].fieldsById.get('cariTuru');
      if (cat && !cat.removed) L.push(`- ${q(BRANCHES[b])} seçildiğinde ${q(cat.label)} seçenekleri tam olarak: ${cat.options.map(q).join(', ')}; açıklama: ${q(cat.help)}.`);
    }
    L.push('- Belgelerde iki branş arasında kategori listesi dışında başka bir fark tanımlanmamıştır. Aşağıda listelenen onaylı branş kararları dışında fark uydurma (açık soru: C-Q05).');
    const clear = behaviorLine(ctx, 'clearOnBranch', 'Yön değiştirildiğinde yeni branşta geçersiz kalan Cari Türü seçimi temizlenir, kullanıcı bilgilendirilir ve diğer yanıtlar korunur');
    if (clear) L.push(`- ${clear}`);
    if (decisionsBranch.length) {
      L.push('- Onaylı branşa özgü kararlar:');
      for (const d of decisionsBranch) L.push(`  - [${d.id}] Yalnızca ${q(BRANCH_SCOPES[d.branch])}: ${d.text}${decisionChangeText(d, ctx.formId, ctx.state) ? ` (${decisionChangeText(d, ctx.formId, ctx.state)})` : ''}`);
    }
    L.push('');
    L.push('### 7.2 Sayfa yönlendirmeleri', '');
    for (const section of ctx.form.sections) {
      if (section.kind === 'missing') L.push(`- ${sectionTitle(section)}: içerik ve gösterim koşulu bilinmiyor (${section.reqs.join(', ')}).`);
      else if (section.condition && section.condition.unknown) {
        const st = ctx.statusOf(section.condition.req);
        const note = ctx.noteOf(section.condition.req);
        L.push(`- ${sectionTitle(section)}: ${isMandatoryStatus(st) && note ? `koşul (karar): ${note}` : `gösterim koşulu bilinmiyor (${section.condition.req}); koşulu uydurma, yapılandırılabilir bırak`}.`);
      } else L.push(`- ${sectionTitle(section)}: her iki branşta gösterilir (belgede koşul yok).`);
    }
    L.push('');
  } else {
    L.push('- Kaynak belgede koşullu alan, dallanma veya sayfa yönlendirmesi tanımlanmamıştır. Onaylı kararlar (Bölüm 11) dışında koşullu davranış ekleme.', '');
  }
  const title = ctx.form.hasBranches ? '### 7.3 Davranışı belgelenmemiş durumlar' : '### Davranışı belgelenmemiş durumlar';
  L.push(title, '');
  let any = false;
  for (const [, f] of ctx.fieldsById) {
    for (const flag of f.flags || []) {
      if (!flag.when || flag.when.always) continue;
      const st = ctx.statusOf(flag.req);
      if (isMandatoryStatus(st) || isDroppedStatus(st)) continue;
      any = true;
      L.push(`- ${describeFlagCondition(flag, ctx.fieldsById, BRANCHES)}: ${flag.text} → Ek alan veya kural ekleme; ${flag.req} cevaplanana kadar belgedeki davranışı koru.`);
    }
  }
  if (!any) L.push('- Yok.');
  L.push('');
}

function validation(ctx, L) {
  L.push('## 8. Doğrulama ve hata yönetimi', '');
  L.push(`- Zorunlu alan boşsa ilerleme/gönderim engellenir; alan kırmızı çerçeveyle vurgulanır ve altında ${q(REQUIRED_MESSAGE)} gösterilir.`);
  const ws = behaviorLine(ctx, 'whitespace', 'Yalnızca boşluk karakterlerinden oluşan yanıt boş sayılır');
  if (ws) L.push(`- ${ws}`);
  L.push('- Tek seçimli/açılır liste alanlarında yalnızca tanımlı seçenekler kabul edilir.');
  for (const [, f] of ctx.fieldsById) {
    if (f.type !== 'file' || f.removed) continue;
    if (f.proposalReq && !isMandatoryStatus(ctx.statusOf(f.proposalReq))) continue;
    const rules = [];
    if (f.file.maxSizeMB) rules.push(`${f.file.maxSizeMB} MB üzeri dosya reddedilir: ${q(`Dosya en fazla ${f.file.maxSizeMB} MB olmalıdır.`)}`);
    if (f.file.accept === 'image/*') rules.push(`görsel olmayan dosya reddedilir: ${q('Yalnızca görsel (image) dosyası yükleyebilirsiniz.')}`);
    if (f.file.accept && f.file.accept.includes('pdf')) rules.push(`PDF olmayan dosya reddedilir: ${q('Yalnızca PDF dosyası yükleyebilirsiniz.')}`);
    rules.push(`en fazla ${f.file.maxFiles || 1} dosya`);
    L.push(`- ${q(f.label)}: ${rules.join('; ')}.`);
  }
  const approved = [];
  const pending = [];
  const seen = new Set();
  for (const [, f] of ctx.fieldsById) {
    for (const c of f.checks || []) {
      const key = `${c.req}|${f.id}`;
      if (seen.has(key) || f.removed) continue;
      seen.add(key);
      const st = ctx.statusOf(c.req);
      if (isMandatoryStatus(st)) approved.push([c, f]);
      else if (!isDroppedStatus(st)) pending.push([c, f]);
    }
  }
  if (approved.length) {
    L.push('- Onaylı format doğrulamaları (alan doluysa uygulanır; hata engeller):');
    for (const [c, f] of approved) L.push(`  - ${q(f.label)} — ${CHECKS[c.kind].label} (${c.req}): ${q(CHECKS[c.kind].message)}`);
  } else {
    const kinds = [...new Set(pending.map(([c]) => CHECKS[c.kind].label.toLocaleLowerCase('tr-TR')))].sort();
    L.push(`- Onaylı format doğrulaması yok. Belgelerde alan formatı (${kinds.join(', ') || 'hiçbiri'}) tanımlanmamıştır; onay olmadan format kısıtı ekleme.`);
  }
  if (pending.length) {
    const ids = [...new Set(pending.map(([c]) => c.req))].sort().join(', ');
    L.push(`- Onay bekleyen format önerileri: ${ids} (Bölüm 3.2). Prototipte yalnızca engellemeyen uyarı olarak test edildi. Son üründe onay almadan uygulama.`);
  }
  const pres = behaviorLine(ctx, 'presentation', 'Hata sunumu: alan altında kırmızı mesaj + form/sayfa üstünde hata özeti (her hata ilgili alana bağlantı) + ilk hatalı alana odak');
  if (pres) L.push(`- ${pres}`);
  L.push('- İstemci tarafı doğrulamalar, gerçek gönderim uygulanırsa sunucu tarafında da tekrarlanmalıdır.');
  L.push('');
}

function experience(ctx, L) {
  const { form } = ctx;
  L.push('## 9. Navigasyon, gözden geçirme ve test edilen deneyim akışı', '');
  L.push(
    ctx.fs.experienceConfirmed
      ? 'Aşağıdaki akış prototipte test edildi ve kullanıcı tarafından final olarak onaylandı. Son ürün bu deneyimi birebir sunmalıdır.'
      : 'Aşağıdaki akış prototipte test edilen deneyimdir. Kullanıcı henüz final onayı vermedi; "OPSİYONEL ÖNERİ" işaretli adımlar onay bekler.',
    '',
  );
  const review = behaviorLine(ctx, 'review', '"Gözden geçir" adımı: gönderimden önce tüm yanıtlar bölüm bölüm özetlenir; her bölümde "Düzenle" ile ilgili adıma dönülür, "Gönder" bu adımdadır');
  let step = 1;
  L.push(`${step++}. Üst bilgi bloğu: form başlığı${form.header.intro ? ', giriş metni, "Fatura Süreçleri Hakkında Önemli Bilgilendirme" maddeleri, gizlilik metni' : ''} ve ${q(form.header.requiredLegend)}. Her adımda formun üstünde görünür.`);
  if (form.hasBranches) {
    L.push(`${step++}. Adım 0 — Fatura yönü: soru ve iki büyük seçim kartı (${form.branchQuestion.options.map((o) => q(o.label)).join(' / ')}). Bu adım tamamlanmadan diğer adımlar kilitlidir. Seçim yapıldıktan sonraki her adımda seçili yön bir etiketle gösterilir ve "Değiştir" ile Adım 0'a dönülebilir.`);
    const pages = form.sections.map((s) => {
      if (s.kind === 'missing') return `${s.pageLabel} (içerik bilinmiyor — ${s.reqs.join(', ')})`;
      if (s.condition && s.condition.unknown) return `${sectionTitle(s)} (koşul bilinmiyor — ${s.condition.req})`;
      return sectionTitle(s);
    });
    L.push(`${step++}. Form sayfaları sırasıyla: ${pages.join(' → ')}. Prototip, içeriği bilinmeyen sayfaları atlar; son üründe bunlar için yer tutucu/TODO bırak.`);
    L.push(`${step++}. Her sayfada üstte adım/ilerleme göstergesi (adım adları ve "Adım X / N"), altta "Geri" ve "Sonraki". "Sonraki" yalnızca o sayfanın doğrulaması geçerse ilerler; "Geri" doğrulama yapmadan döner ve girilen değerler korunur. Daha önce ulaşılmış adımlara ilerleme göstergesinden dönülebilir.`);
  } else {
    L.push(`${step++}. Tek sayfa: tüm alanlar belgedeki sırayla, görsel alt başlıklar altında.`);
    L.push(`${step++}. Sayfa sonundaki birincil düğme tüm zorunlu alanları doğrular; hata varsa ilerlemez.`);
  }
  if (review) L.push(`${step++}. ${review}`);
  L.push(`${step++}. "Formu temizle": tüm yanıtları siler (belgelenmiş eylem). Onay penceresi gösterilmesi belgede yok; prototip onay sorar.`);
  const submitReq = form.hasBranches ? 'C-Q09' : 'T-Q06';
  const st = ctx.statusOf(submitReq);
  const note = ctx.noteOf(submitReq);
  L.push(`${step++}. Gönderim: ${isMandatoryStatus(st) && note ? `karar (${submitReq}): ${note}` : `gönderim hedefi bilinmiyor (${submitReq}, engelleyici). Gerçek kayıt/iletim uygulama; gönderim katmanını tek bir arayüz arkasında yer tutucu olarak bırak. Prototip başarı ekranında "gönderim simüle edildi" mesajı gösterir.`}`);
  L.push('');
}

function uxA11y(ctx, L) {
  L.push('## 10. UX ve erişilebilirlik beklentileri', '');
  L.push('Aşağıdakiler kaynak belgelerden değil, genel kalite beklentilerinden gelir; iş kuralı değildir.', '');
  L.push('- Arayüz dili Türkçe; metinler Bölüm 5 ve Bölüm 4\'teki gibi birebir.');
  L.push('- Her alanın görünür etiketi programatik olarak alana bağlı (label/for); açıklama ve hata metinleri aria-describedby ile bağlı; hatalı alanlarda aria-invalid="true".');
  L.push('- Tek seçimli sorular fieldset/legend ile gruplanır; tüm etkileşimler yalnızca klavyeyle yapılabilir ve odak göstergesi görünür.');
  L.push('- Zorunlu alanlar yalnızca renkle değil "*" ile de belirtilir; renk kontrastı WCAG 2.1 AA düzeyinde.');
  L.push('- Masaüstü öncelikli, mobil genişlikte (≈360 px) yatay kaydırma olmadan kullanılabilir.');
  L.push('- Geri navigasyonunda veri kaybı olmaz. Sayfa yenilemede taslak saklama belgede istenmemiştir; ekleme.');
  const sensitive = ctx.formId === 'cari' ? 'IBAN, vergi/TC kimlik numarası, telefon, e-posta, adres, yüklenen belgeler' : 'e-posta, ad soyad, fotoğraf';
  L.push(`- Kişisel veri içeren alanlar (${sensitive}) konsola veya analitik araçlarına yazılmaz.`);
  L.push('');
}

function approvedChanges(ctx, L) {
  L.push('## 11. İnceleme sürecinden onaylı değişiklikler', '');
  const decisions = ctx.fs.decisions.slice().sort(byId);
  L.push('### 11.1 Onaylı kararlar', '');
  if (!decisions.length) L.push('- Henüz onaylı karar yok.');
  for (const d of decisions) {
    const scope = ctx.form.hasBranches ? ` · Kapsam: ${BRANCH_SCOPES[d.branch || 'all']}` : '';
    L.push(`- [${d.id}] ${d.title || 'Karar'}${scope}${d.target ? ` · Hedef: ${targetLabel(ctx.formId, ctx.state, d.target)}` : ''}`);
    L.push(`  Karar: ${d.text}`);
    const change = decisionChangeText(d, ctx.formId, ctx.state);
    if (change) L.push(`  Yapısal değişiklik: ${change}`);
    if (d.implications) L.push(`  Etki: ${d.implications}`);
    if (d.reqIds && d.reqIds.length) L.push(`  İlgili gereksinimler: ${d.reqIds.join(', ')}`);
    if (d.sourceFeedbackId) L.push(`  Kaynak geri bildirim: ${d.sourceFeedbackId}`);
  }
  L.push('');
  L.push('### 11.2 Test sırasında gereksinim durumu kararları', '');
  const changed = ctx.reqs.filter((r) => r.status !== r.defaultStatus || r.note);
  if (!changed.length) L.push('- Yok (tüm gereksinimler belgedeki varsayılan durumunda).');
  for (const r of changed) {
    L.push(`- [${r.id}] ${STATUS[r.defaultStatus].label} → ${STATUS[r.status].label}${r.note ? ` — Not: ${r.note}` : ''}`);
  }
  L.push('');
  const closed = ctx.fs.feedback.filter((f) => f.status === 'cozuldu' && !f.decisionId).sort(byId);
  L.push('### 11.3 Değişiklik gerektirmeden kapatılan geri bildirimler (bilgi amaçlı)', '');
  if (!closed.length) L.push('- Yok.');
  for (const f of closed) L.push(`- [${f.id}] ${FEEDBACK_CATEGORIES[f.category]} — ${f.description}`);
  L.push('');
}

function feedbackLine(f, ctx) {
  const parts = [FEEDBACK_CATEGORIES[f.category]];
  if (f.priority) parts.push(`öncelik: ${PRIORITIES[f.priority]}`);
  if (ctx.form.hasBranches) parts.push(`branş: ${BRANCH_SCOPES[f.branch || 'all']}`);
  parts.push(`hedef: ${targetLabel(ctx.formId, ctx.state, f.target)}`);
  return `- [${f.id}] (${parts.join(' · ')}) ${f.description}${f.expected ? ` — Beklenen/öneri: ${f.expected}` : ''}`;
}

function unresolved(ctx, L) {
  L.push('## 12. Açık sorular ve uygulama sınırları', '');
  const { ready } = ctx;
  L.push('### 12.1 Engelleyici sorular', '');
  L.push('Bu sorular cevaplanmadan ilgili kısmı uygulama. Yapılandırılabilir yer tutucu veya TODO bırak, soruyu teslim raporunda tekrar sor.', '');
  if (!ready.blockers.length) L.push('- Yok.');
  for (const r of ready.blockers) {
    L.push(`- [${r.id}] ${r.description}`);
    L.push(`  Engellenen karar/uygulama: ${r.implications}`);
    L.push(`  Kaynak: ${sourceText(r.source)} — ${r.ref}`);
  }
  L.push('', '### 12.2 Diğer açık sorular', '');
  L.push('Cevap uydurma. Aşağıdaki "Geçici davranış" satırı, karar verilene kadar korunacak belgelenmiş davranıştır.', '');
  if (!ready.openQuestions.length) L.push('- Yok.');
  for (const r of ready.openQuestions) {
    L.push(`- [${r.id}] ${r.description}`);
    if (r.implications) L.push(`  Geçici davranış: ${r.implications}`);
    if (r.openQuestions) L.push(`  Ayrıntı: ${r.openQuestions}`);
  }
  L.push('', '### 12.3 Belge çelişkileri', '');
  const conflicts = ctx.reqs.filter((r) => r.conflict);
  if (!conflicts.length) L.push('- Belgeler arasında tespit edilmiş çelişki yok.');
  for (const r of conflicts) {
    L.push(`- [${r.id}] ${r.description}`);
    L.push(`  Referanslar: ${r.ref} · Durum: ${STATUS[r.status].label}${r.note ? ` — Karar: ${r.note}` : ' — kendi başına çözme'}`);
  }
  L.push('', '### 12.4 Henüz onaylanmamış açık geri bildirimler', '');
  L.push('Bunlar test sırasında alınan notlardır, onaylı gereksinim değildir. Uygulama; gerekiyorsa soru olarak raporla.', '');
  const open = ctx.fs.feedback.filter((f) => f.status === 'acik' && !f.decisionId).sort(byId);
  if (!open.length) L.push('- Yok.');
  for (const f of open) L.push(feedbackLine(f, ctx));
  L.push('', '### 12.5 Ertelenen geri bildirimler (bu iterasyonda uygulama)', '');
  const deferred = ctx.fs.feedback.filter((f) => f.status === 'ertelendi' && !f.decisionId).sort(byId);
  if (!deferred.length) L.push('- Yok.');
  for (const f of deferred) L.push(feedbackLine(f, ctx));
  L.push('', '### 12.6 Uygulama sınırları', '');
  L.push('- Belgelerde ve bu promptta olmayan alan, seçenek, iş kuralı, onay adımı, muhasebe prosedürü veya yasal gereksinim ekleme.');
  L.push('- Belirsiz noktalarda en "makul" görünen davranışı seçme; belgelenmiş davranışı koru ve soruyu raporla.');
  L.push('- Prototipteki yer tutucu seçenekleri ve örnek verileri ürüne taşıma.');
  L.push('');
}

function technical(ctx, L) {
  L.push('## 13. Teknik uygulama gereksinimleri (yalnızca kesinleşmiş kararlar)', '');
  const platformReq = ctx.formId === 'cari' ? 'C-Q09' : 'T-Q06';
  const authReq = ctx.formId === 'cari' ? 'C-Q08' : 'T-Q07';
  const decided = (id) => isMandatoryStatus(ctx.statusOf(id)) && ctx.noteOf(id);
  L.push(`- Platform, teknoloji ve gönderim hedefi: ${decided(platformReq) ? `karar (${platformReq}): ${ctx.noteOf(platformReq)}` : `BELİRLENMEDİ (${platformReq}). Önce mevcut projeyi incele (Bölüm 17). Mevcut bir yapı yoksa teknoloji seçimini kullanıcıya sor; varsayım yapma.`}`);
  L.push(`- Kimlik doğrulama: ${decided(authReq) ? `karar (${authReq}): ${ctx.noteOf(authReq)}` : `BELİRLENMEDİ (${authReq}). Kimlik doğrulama ekleme veya kaldırma; soruyu raporla.`}`);
  L.push('- Form tanımını (bölümler, alanlar, seçenekler, metinler, koşullar) mümkünse tek bir yapılandırma/şema kaynağında tut. Açık sorular cevaplandığında değişiklik tek yerden yapılabilsin.');
  L.push('- Belgede tanımlı dosya kısıtlarını (adet, boyut, tür) gerçek yüklemede de uygula.');
  const tech = ctx.fs.decisions.filter((d) => {
    const fb = ctx.fs.feedback.find((f) => f.id === d.sourceFeedbackId);
    return fb && fb.category === 'teknik';
  });
  const techReqs = ctx.reqs.filter((r) => r.type === 'technical' && isMandatoryStatus(r.status) && r.id !== platformReq && r.id !== authReq);
  for (const d of tech) L.push(`- Onaylı teknik karar [${d.id}]: ${d.text}`);
  for (const r of techReqs) L.push(`- [${r.id}] ${r.description}${r.note ? ` — Karar: ${r.note}` : ''}`);
  L.push(`- Kodda gerçek ${ctx.formId === 'cari' ? 'kişisel, banka veya vergi verisi' : 'kişisel veri veya fotoğraf'} bulunmamalı; test verisi açıkça "örnek" olarak işaretlenmeli.`);
  L.push('');
}

function acceptance(ctx, L) {
  L.push('## 14. Kabul kriterleri', '');
  const A = [];
  if (ctx.form.hasBranches) {
    A.push(`Form açıldığında ilk ve tek soru ${q(ctx.form.branchQuestion.label)} olarak gösterilir; diğer alanlar bu soru yanıtlanmadan gösterilmez/erişilemez.`);
    for (const b of ctx.branches) {
      const cat = ctx.eff[b].fieldsById.get('cariTuru');
      if (cat && !cat.removed) A.push(`${q(BRANCHES[b])} seçildiğinde ${q(cat.label)} tam olarak şu seçenekleri bu sırayla sunar: ${cat.options.map(q).join(', ')}.`);
    }
    A.push('Yön değiştirildiğinde kategori listesi anında yeni branşınkine döner; önceki branşın seçenekleri görünmez.');
  }
  const requiredLists = ctx.branches.map((b) => {
    const req = [];
    for (const s of ctx.eff[b].sections) {
      if (s.kind !== 'fields') continue;
      for (const f of sectionFields(s)) if (f.required && !proposalPending(ctx, f)) req.push(`${q(f.label)}${conditionNote(ctx, f)}`);
    }
    return [b, req];
  });
  const sameRequired = new Set(requiredLists.map(([, r]) => r.join('|'))).size === 1;
  const reqSentence = (list) => `${list.join(', ')} — boşken ilgili adım geçilemez/gönderilemez ve her birinin altında ${q(REQUIRED_MESSAGE)} görünür.`;
  if (sameRequired) A.push(`Zorunlu alanlar${ctx.branches.length > 1 ? ' (her iki branşta aynı)' : ''}: ${reqSentence(requiredLists[0][1])}`);
  else for (const [b, list] of requiredLists) A.push(`Zorunlu alanlar [${BRANCHES[b]}]: ${reqSentence(list)}`);
  const optional = [];
  for (const [, f] of ctx.fieldsById) if (!f.required && !f.removed && !proposalPending(ctx, f)) optional.push(q(f.label));
  if (optional.length) A.push(`İsteğe bağlı alanlar (${optional.join(', ')}) boş bırakıldığında gönderim engellenmez.`);
  for (const [, f] of ctx.fieldsById) {
    if (f.type === 'file' && !f.removed && f.file && f.file.maxSizeMB && !proposalPending(ctx, f)) {
      A.push(`${q(f.label)} en fazla 1 dosya kabul eder; ${f.file.maxSizeMB} MB üzeri dosya reddedilir${f.file.accept === 'image/*' ? '; görsel olmayan dosya reddedilir' : ''}.`);
    }
  }
  if (behaviorMode(ctx, 'review') === 'on') A.push('Gönderimden önce "Gözden geçir" adımı tüm yanıtları bölüm bölüm gösterir; her bölümden "Düzenle" ile ilgili adıma dönülür ve yanıtlar korunur.');
  A.push('Bölüm 5\'teki tüm metinler birebir (Türkçe karakterler dahil) görünür.');
  A.push('Alanlar Bölüm 4\'teki sırayla gösterilir; seçenek listeleri belgedeki sırayı korur.');
  for (const d of ctx.fs.decisions.slice().sort(byId)) A.push(`Onaylı karar ${d.id} uygulanmıştır: ${d.text}`);
  A.push('Bölüm 12\'deki açık sorular için hiçbir davranış uydurulmamış; her biri yer tutucu/TODO ile işaretlenmiş ve teslim raporunda listelenmiştir.');
  A.forEach((a, i) => L.push(`${i + 1}. ${a}`));
  L.push('');
}

function scenarios(ctx, L) {
  L.push('## 15. Test senaryoları', '');
  L.push(
    ctx.formId === 'cari'
      ? 'Test verisi açıkça örnek olmalı (ör. ornek@example.com, "ÖRNEK" ibareli adlar, banka kodu sıfırlardan oluşan TR IBAN). Gerçek kişisel, banka veya vergi verisi kullanma.'
      : 'Test verisi açıkça örnek olmalı (ör. ornek@example.com, "ÖRNEK" ibareli adlar, kişi içermeyen örnek görsel). Gerçek kişisel veri veya gerçek kişilere ait fotoğraf kullanma.',
    '',
  );
  L.push('### 15.1 Pozitif', '');
  const P = [];
  const reviewStep = behaviorMode(ctx, 'review') === 'on' ? 'gözden geçir ekranında tüm yanıtlar doğru görünür → ' : '';
  if (ctx.form.hasBranches) {
    for (const b of ctx.branches) {
      const cat = ctx.eff[b].fieldsById.get('cariTuru');
      P.push(`${q(BRANCHES[b])} → kategori ${cat && cat.options.length ? q(cat.options[0]) : '(seçilmeden)'} → tüm görünen zorunlu alanlar geçerli örnek verilerle dolu → ${reviewStep}gönderim başarılı (gönderim hedefi belirlenmediyse simüle).`);
    }
    for (const b of ctx.branches) {
      const cat = ctx.eff[b].fieldsById.get('cariTuru');
      if (cat && cat.options.length > 1) P.push(`${q(BRANCHES[b])} branşında her kategori seçeneği (${cat.options.map(q).join(', ')}) ayrı ayrı seçilip form tamamlanabilir.`);
    }
  } else {
    P.push(`Tüm zorunlu alanlar geçerli örnek verilerle dolu, fotoğraf olarak 10 MB altı bir görsel → ${reviewStep}gönderim başarılı (gönderim hedefi belirlenmediyse simüle).`);
    for (const [, f] of ctx.fieldsById) if ((f.type === 'select' || f.type === 'radio') && !f.removed) P.push(`${q(f.label)} için her seçenek (${f.options.map(q).join(', ')}) seçilebilir ve seçilen değer doğru kaydedilir.`);
  }
  P.push('Tüm isteğe bağlı alanlar boşken gönderim başarılı.');
  for (const d of ctx.fs.decisions.slice().sort(byId)) P.push(`Onaylı karar ${d.id} prototipte ve son üründe aynı şekilde davranır: ${d.text}`);
  P.forEach((p, i) => L.push(`P${i + 1}. ${p}`));
  L.push('', '### 15.2 Negatif', '');
  const N = [];
  if (ctx.form.hasBranches) N.push('İlk soru yanıtlanmadan ilerlemeye çalışılır → engellenir ve ilk soruda hata gösterilir.');
  const seen = new Set();
  for (const b of ctx.branches) {
    for (const s of ctx.eff[b].sections) {
      if (s.kind !== 'fields') continue;
      for (const f of sectionFields(s)) {
        if (!f.required || seen.has(f.id) || proposalPending(ctx, f)) continue;
        seen.add(f.id);
        N.push(`${q(f.label)}${conditionNote(ctx, f)} boş bırakılır → ${q(REQUIRED_MESSAGE)}, ilerleme/gönderim engellenir.`);
      }
    }
  }
  for (const [, f] of ctx.fieldsById) {
    if (f.type !== 'file' || f.removed || !f.file || proposalPending(ctx, f)) continue;
    if (f.file.maxSizeMB) N.push(`${q(f.label)} alanına ${f.file.maxSizeMB} MB'tan büyük dosya yüklenir → reddedilir.`);
    if (f.file.accept === 'image/*') N.push(`${q(f.label)} alanına PDF gibi görsel olmayan bir dosya yüklenir → reddedilir.`);
  }
  for (const [, f] of ctx.fieldsById) {
    for (const c of f.checks || []) if (isMandatoryStatus(ctx.statusOf(c.req)) && !f.removed) N.push(`${q(f.label)} alanına geçersiz değer girilir (${CHECKS[c.kind].label}) → ${q(CHECKS[c.kind].message)}.`);
  }
  N.forEach((n, i) => L.push(`N${i + 1}. ${n}`));
  L.push('');
}

function edgeCases(ctx, L) {
  L.push('## 16. Uç durumlar ve regresyon testleri', '');
  L.push('### 16.1 Uç durumlar', '');
  const E = [];
  if (ctx.form.hasBranches) {
    const clear = {
      on: 'geçersiz kategori seçimi temizlenir, kullanıcı bilgilendirilir, diğer yanıtlar korunur (C-P06)',
      off: 'geçersiz kategori seçimi kendiliğinden temizlenmez; doğrulamada "seçim mevcut seçenekler arasında değil" hatası verir ve diğer yanıtlar korunur (C-P06 reddedildi)',
      pending: 'diğer yanıtlar korunur; geçersiz kalan kategori seçiminin nasıl ele alınacağı C-P06 onayına bağlıdır, onay yoksa davranışı sor',
    }[behaviorMode(ctx, 'clearOnBranch')];
    E.push(`"Fatura keseceğim" ile kategori seçilip alanlar doldurulduktan sonra yön "Bana fatura kesilecek" olarak değiştirilir → ${clear}.`);
    E.push('Yön değiştirilip eski yöne geri dönülür → ortak alanlardaki yanıtlar kaybolmaz.');
    E.push('Gösterim koşulu bilinmeyen sayfalar (Bölüm 7.2) için yer tutucu davranışı tutarlıdır ve kullanıcıyı kilitlemez.');
  }
  E.push('Metin alanlarına Türkçe karakterler (İSTANBUL, ığüşöç, KAĞITHANE) girilir → değiştirilmeden saklanır ve gösterilir.');
  const wsId = BEHAVIOR_REQS[ctx.formId].whitespace;
  E.push({
    on: `Yalnızca boşluk içeren zorunlu yanıt → boş sayılır ve zorunlu alan hatası verir (${wsId}).`,
    off: `Yalnızca boşluk içeren yanıt → yanıt olarak kabul edilir (${wsId} reddedildi).`,
    pending: `Yalnızca boşluk içeren zorunlu yanıtın boş sayılıp sayılmayacağı ${wsId} onayına bağlıdır; onay yoksa davranışı sor.`,
  }[behaviorMode(ctx, 'whitespace')]);
  E.push('Çok uzun metin (ör. 1000+ karakter) → arayüz bozulmaz; belgede uzunluk sınırı yoktur, sınır ekleme.');
  E.push(behaviorMode(ctx, 'review') === 'on' ? 'Geri/ileri gezinmede ve gözden geçir ekranından "Düzenle" ile dönüşte yanıtlar korunur.' : 'Geri/ileri gezinmede yanıtlar korunur.');
  E.push('"Gönder" düğmesine art arda tıklanır → tek gönderim oluşur.');
  E.push('Dosya seçilip kaldırılır ve yeniden seçilir → yalnızca son dosya geçerlidir; zorunlu dosya kaldırılınca hata geri gelir.');
  E.push('Mobil genişlikte (≈360 px) tüm adımlar yatay kaydırma olmadan tamamlanır.');
  E.forEach((e, i) => L.push(`E${i + 1}. ${e}`));
  L.push('', '### 16.2 Regresyon', '');
  const R = [];
  if (ctx.form.hasBranches) R.push('İki branşın kategori listeleri birbirine karışmaz; "Marka" ve "Ajans" seçenekleri hiçbir branşta görünmez.');
  R.push('Bölüm 5\'teki metinler ve Bölüm 4\'teki alan sırası, seçenek sırası ve zorunluluklar değişmemiştir (anlık görüntü/snapshot testi önerilir).');
  R.push('İsteğe bağlı alanlar isteğe bağlı kalır; zorunlu alanlar zorunlu kalır (Bölüm 6 matrisine karşı otomatik test).');
  R.push('Bölüm 11\'deki her onaylı karar için en az bir otomatik test bulunur ve geçer.');
  R.push('Açık sorulara bağlı yer tutucular kodda bulunabilir (ör. TODO + gereksinim kimliği).');
  R.forEach((r, i) => L.push(`R${i + 1}. ${r}`));
  L.push('');
}

function inspect(ctx, L) {
  L.push('## 17. Mevcut projeyi inceleme talimatı', '');
  L.push('- Kod yazmadan önce çalışma dizinini incele: mevcut çerçeve, form kütüphanesi, doğrulama yaklaşımı, stil sistemi, test altyapısı ve bu formun varsa eski uygulaması.');
  L.push('- Mevcut yapı varsa onun kalıplarına uy. İlgisiz dosyaları değiştirme. Yeni bağımlılık eklemeden önce gerekçesini belirt.');
  L.push('- Proje boşsa veya teknoloji belirsizse teknoloji seçimini kullanıcıya sor (Bölüm 13). Varsayımla altyapı (veritabanı, kimlik doğrulama, dağıtım) kurma.');
  L.push('- Projenin kendi lint/format/test komutlarını çalıştır; teslimden önce hepsinin geçtiğini doğrula.');
  L.push('');
}

function reporting(ctx, L) {
  L.push('## 18. Teslim raporu gereksinimi', '');
  L.push('Teslimde kısa bir rapor ver:');
  L.push('1. Uygulanan gereksinimler (kimlikleriyle) ve bunları doğrulayan testler.');
  L.push('2. Yaptığın varsayımlar ve uygulama kararları (her biri gerekçesiyle). Varsayım yapmak zorunda kaldıysan bunu açıkça belirt.');
  L.push('3. Bu spesifikasyondan sapmalar ve nedenleri.');
  L.push('4. Yer tutucu/TODO bırakılan açık sorular (Bölüm 12 kimlikleriyle) ve kullanıcıya sorulması gereken sorular.');
  L.push('5. Çalıştırılan test/lint komutları ve sonuçları.');
  L.push('');
}

export function generatePrompt(formId, state) {
  const ctx = buildContext(formId, state);
  const L = [];
  header(ctx, L);
  readingRules(ctx, L);
  objective(ctx, L);
  sources(ctx, L);
  requirements(ctx, L);
  inventory(ctx, L);
  texts(ctx, L);
  requiredMatrix(ctx, L);
  conditional(ctx, L);
  validation(ctx, L);
  experience(ctx, L);
  uxA11y(ctx, L);
  approvedChanges(ctx, L);
  unresolved(ctx, L);
  technical(ctx, L);
  acceptance(ctx, L);
  scenarios(ctx, L);
  edgeCases(ctx, L);
  inspect(ctx, L);
  reporting(ctx, L);
  return `${L.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`;
}

export function promptFileName(formId) {
  return formId === 'cari' ? 'cari-form-gelistirme-promptu.txt' : 'yeni-talent-form-gelistirme-promptu.txt';
}
