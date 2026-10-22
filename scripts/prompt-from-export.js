// Dışa aktarılmış inceleme JSON'undan geliştirme promptlarını komut satırında üretir.
// Kullanım:
//   node scripts/prompt-from-export.js <inceleme.json> [cari|talent|ikisi] [çıktı-klasörü]
// Çıktı klasörü verilmezse prompt(lar) standart çıktıya yazılır.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { defaultState } from '../src/core/state.js';
import { validateImport, applyImport } from '../src/core/importExport.js';
import { generatePrompt, promptFileName } from '../src/core/prompt.js';

const [file, which = 'ikisi', outDir] = process.argv.slice(2);
if (!file) {
  console.error('Kullanım: node scripts/prompt-from-export.js <inceleme.json> [cari|talent|ikisi] [çıktı-klasörü]');
  process.exit(2);
}

const result = validateImport(await readFile(file, 'utf8'));
if (!result.ok) {
  console.error(`İçe aktarılamadı:\n- ${result.errors.join('\n- ')}`);
  process.exit(1);
}
for (const w of result.warnings) console.error(`Uyarı: ${w}`);

const state = applyImport(defaultState(), result.data);
const forms = which === 'ikisi' ? ['cari', 'talent'] : [which];
for (const formId of forms) {
  if (!['cari', 'talent'].includes(formId)) {
    console.error(`Bilinmeyen form: ${formId}`);
    process.exit(2);
  }
  const text = generatePrompt(formId, state);
  if (outDir) {
    await mkdir(outDir, { recursive: true });
    const path = join(outDir, promptFileName(formId));
    await writeFile(path, text);
    console.error(`Yazıldı: ${path}`);
  } else {
    process.stdout.write(text);
    if (forms.length > 1) process.stdout.write('\n\n==========\n\n');
  }
}
