// Alan doğrulama. Zorunluluk ve dosya kısıtları belgelerden gelir; format kontrolleri
// (e-posta, IBAN vb.) analist önerisidir ve bağlı gereksinimin durumuna göre çalışır:
//   onaylı  → engelleyen hata
//   öneri / açık soru → engellemeyen uyarı ("Öneri")
//   reddedildi / ertelendi → kontrol yok

import { REQUIRED_MESSAGE } from '../data/enums.js';
import { isMandatoryStatus, isDroppedStatus, optionValues } from './schema.js';

export function isEmptyValue(value, whitespaceIsEmpty = true) {
  if (value === undefined || value === null) return true;
  return whitespaceIsEmpty ? String(value).trim() === '' : String(value) === '';
}

export function ibanValid(raw) {
  const iban = String(raw).replace(/\s+/g, '').toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(iban)) return false;
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let remainder = 0;
  for (const ch of rearranged) {
    const code = ch >= 'A' && ch <= 'Z' ? String(ch.charCodeAt(0) - 55) : ch;
    for (const digit of code) remainder = (remainder * 10 + Number(digit)) % 97;
  }
  return remainder === 1;
}

export const CHECKS = {
  email: {
    label: 'E-posta biçimi',
    test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
    message: 'Geçerli bir e-posta adresi girin (ör. ad@alanadi.com).',
  },
  phone: {
    label: 'Telefon biçimi',
    test: (v) => /^[\d\s+()-]+$/.test(v.trim()) && (v.match(/\d/g) || []).length >= 10 && (v.match(/\d/g) || []).length <= 15,
    message: 'Telefon numarası yalnızca rakam, boşluk, +, parantez ve tire içermeli; 10–15 rakam olmalı.',
  },
  vkn_tckn: {
    label: 'Vergi No (10 hane) / TCKN (11 hane)',
    test: (v) => /^\d{10,11}$/.test(v.trim()),
    message: 'Vergi Kimlik No 10, TC Kimlik No 11 haneli olmalı ve yalnızca rakam içermeli.',
  },
  iban: {
    label: 'IBAN biçimi (mod-97)',
    test: (v) => ibanValid(v),
    message: 'Geçerli bir IBAN girin (ör. TR ile başlayan 26 karakter; boşluklar yok sayılır).',
  },
  postal: {
    label: 'Posta kodu (5 hane)',
    test: (v) => /^\d{5}$/.test(v.trim()),
    message: 'Posta kodu 5 haneli olmalı.',
  },
  url: {
    label: 'URL biçimi',
    test: (v) => /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(v.trim()),
    message: 'Bağlantı http:// veya https:// ile başlamalı.',
  },
};

export function fileErrors(field, meta) {
  const errors = [];
  if (!meta || !field.file) return errors;
  const { maxSizeMB, accept } = field.file;
  if (maxSizeMB && meta.size > maxSizeMB * 1024 * 1024) errors.push(`Dosya en fazla ${maxSizeMB} MB olmalıdır.`);
  if (accept === 'image/*' && !(meta.type || '').startsWith('image/')) errors.push('Yalnızca görsel (image) dosyası yükleyebilirsiniz.');
  if (accept && accept.includes('pdf')) {
    const isPdf = meta.type === 'application/pdf' || /\.pdf$/i.test(meta.name || '');
    if (!isPdf) errors.push('Yalnızca PDF dosyası yükleyebilirsiniz.');
  }
  return errors;
}

/**
 * @returns {{errors: string[], warnings: {req: string, message: string}[]}}
 */
export function validateField(field, value, fileMeta, statusOf, opts = {}) {
  const errors = [];
  const warnings = [];
  if (field.removed) return { errors, warnings };

  if (field.type === 'file') {
    if (field.required && !fileMeta) errors.push(REQUIRED_MESSAGE);
    errors.push(...fileErrors(field, fileMeta));
    return { errors, warnings };
  }

  if (isEmptyValue(value, opts.whitespaceIsEmpty !== false)) {
    if (field.required) errors.push(REQUIRED_MESSAGE);
    return { errors, warnings };
  }

  if (field.type === 'radio' || field.type === 'select') {
    if (!optionValues(field).includes(value)) errors.push('Bu seçim mevcut seçenekler arasında değil; lütfen yeniden seçin.');
    return { errors, warnings };
  }

  for (const check of field.checks || []) {
    const impl = CHECKS[check.kind];
    if (!impl || impl.test(String(value))) continue;
    const status = statusOf(check.req);
    if (isDroppedStatus(status)) continue;
    if (isMandatoryStatus(status)) errors.push(impl.message);
    else warnings.push({ req: check.req, message: impl.message });
  }
  return { errors, warnings };
}

export function validateFields(fields, answers, statusOf, opts = {}) {
  const results = {};
  let errorCount = 0;
  for (const field of fields) {
    const result = validateField(field, answers.values[field.id], answers.files[field.id], statusOf, opts);
    results[field.id] = result;
    errorCount += result.errors.length ? 1 : 0;
  }
  return { results, errorCount };
}
