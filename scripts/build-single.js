// Uygulamayı tek bir HTML dosyasına paketler: dist/muhasebe-form-prototipi.html
// Bu dosya çift tıklanarak (file://) veya herhangi bir localhost sunucusundan açılabilir; kurulum gerekmez.
// Kullanım: npm run build
//
// Bağımlılıksız küçük bir paketleyicidir; yalnızca bu projede kullanılan ES modül biçimlerini destekler:
//   import { a, b as c } from './x.js';   import x from './x.js';
//   export function / export async function / export const / export default
// Başka bir biçim görürse sessizce geçmez, hata verir.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join, posix, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
export const DEFAULT_OUT = join(root, 'dist', 'muhasebe-form-prototipi.html');
const ENTRY = 'src/app.js';

const IMPORT_RE = /^import\s+([\s\S]*?)\s+from\s+'([^']+)';[ \t]*$/gm;
const EXPORT_DECL_RE = /^export (async function|function|const|let|class) ([A-Za-z_$][\w$]*)/gm;

const resolveSpec = (fromId, spec) => {
  if (!spec.startsWith('.')) throw new Error(`${fromId}: yalnızca göreli import desteklenir (${spec})`);
  return posix.normalize(posix.join(posix.dirname(fromId), spec));
};

function parseImports(id, code) {
  const deps = [];
  for (const m of code.matchAll(IMPORT_RE)) deps.push(resolveSpec(id, m[2]));
  return deps;
}

function transform(id, code) {
  const exported = [];
  let out = code.replace(IMPORT_RE, (whole, clause, spec) => {
    const dep = JSON.stringify(resolveSpec(id, spec));
    const c = clause.trim();
    if (c.startsWith('{') && c.endsWith('}')) {
      const names = c
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => s.replace(/^([\w$]+)\s+as\s+([\w$]+)$/, '$1: $2'));
      return `const { ${names.join(', ')} } = __mod(${dep});`;
    }
    if (/^[A-Za-z_$][\w$]*$/.test(c)) return `const ${c} = __mod(${dep}).default;`;
    throw new Error(`${id}: desteklenmeyen import biçimi: ${whole}`);
  });
  out = out.replace(/^export default /gm, '__exports.default = ');
  out = out.replace(EXPORT_DECL_RE, (whole, kind, name) => {
    exported.push(name);
    return `${kind} ${name}`;
  });
  const leftover = out.match(/^\s*(import|export)\b.*$/m);
  if (leftover) throw new Error(`${id}: desteklenmeyen biçim: ${leftover[0].trim()}`);
  const assign = exported.length ? `\nObject.assign(__exports, { ${exported.join(', ')} });` : '';
  return `__define(${JSON.stringify(id)}, function (__exports) {\n${out}${assign}\n});`;
}

export async function bundle() {
  const sources = new Map();
  const order = [];
  const visiting = new Set();
  async function visit(id) {
    if (sources.has(id)) return;
    if (visiting.has(id)) throw new Error(`Döngüsel bağımlılık: ${id}`);
    visiting.add(id);
    const code = await readFile(join(root, id), 'utf8');
    for (const dep of parseImports(id, code)) await visit(dep);
    visiting.delete(id);
    sources.set(id, code);
    order.push(id);
  }
  await visit(ENTRY);
  const modules = order.map((id) => transform(id, sources.get(id)));
  const runtime = [
    'const __registry = Object.create(null);',
    'function __define(id, factory) { const e = {}; factory(e); __registry[id] = e; }',
    "function __mod(id) { if (!(id in __registry)) throw new Error('Modül bulunamadı: ' + id); return __registry[id]; }",
  ].join('\n');
  return { code: `(function () {\n'use strict';\n${runtime}\n${modules.join('\n')}\n})();\n`, modules: order };
}

export async function buildSingle(outFile = DEFAULT_OUT) {
  const [html, css, { code, modules }] = await Promise.all([
    readFile(join(root, 'index.html'), 'utf8'),
    readFile(join(root, 'assets', 'styles.css'), 'utf8'),
    bundle(),
  ]);
  const safeCode = code.replace(/<\/script/gi, '<\\/script');
  let out = html;
  const swap = (from, to) => {
    if (!out.includes(from)) throw new Error(`index.html içinde beklenen parça yok: ${from}`);
    out = out.replace(from, () => to);
  };
  swap('<link rel="stylesheet" href="assets/styles.css" />', `<style>\n${css}</style>`);
  swap('<script type="module" src="src/app.js"></script>', `<script>\n${safeCode}</script>`);
  // Kaynak sürümdeki "çift tıklayınca çalışmaz" uyarısı tek dosyada gerekmez.
  out = out.replace(/[ \t]*<!-- dosya-uyarisi:baslangic -->[\s\S]*?<!-- dosya-uyarisi:bitis -->\n?/, '');
  out = out.replace('<!doctype html>', '<!doctype html>\n<!-- Bu dosya scripts/build-single.js ile üretildi; doğrudan düzenlemeyin. Kaynak: src/ ve assets/ -->');
  await mkdir(dirname(outFile), { recursive: true });
  await writeFile(outFile, out);
  return { outFile, modules, bytes: Buffer.byteLength(out) };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { outFile, modules, bytes } = await buildSingle(process.argv[2] ? resolve(process.argv[2]) : DEFAULT_OUT);
  console.log(`Tek dosya üretildi: ${outFile} (${modules.length} modül, ${(bytes / 1024).toFixed(0)} KB)`);
}
