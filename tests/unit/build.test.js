// Tek dosya paketinin (dist/muhasebe-form-prototipi.html) bütünlüğü.
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSingle, DEFAULT_OUT } from '../../scripts/build-single.js';

const root = fileURLToPath(new URL('../..', import.meta.url));

async function jsFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await jsFiles(full)));
    else if (entry.name.endsWith('.js')) out.push(relative(root, full).split('\\').join('/'));
  }
  return out;
}

test('tek dosya paketi: tüm modüller dahil, import/export kalmadı, sözdizimi geçerli', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'tek-dosya-'));
  try {
    const { outFile, modules } = await buildSingle(join(dir, 'paket.html'));
    const html = await readFile(outFile, 'utf8');
    const script = html.match(/<script>\n([\s\S]*?)<\/script>\s*<\/body>/)[1];
    assert.doesNotThrow(() => new vm.Script(script), 'paket sözdizimi geçerli');
    assert.ok(!/^\s*(import|export)\b/m.test(script), 'import/export kalmadı');
    assert.ok(!html.includes('type="module"') && !html.includes('assets/styles.css'), 'dış dosya bağlantısı yok');
    assert.ok(!html.includes('dosya-uyarisi'), 'kaynak sürümün file:// uyarısı çıkarıldı');
    assert.ok(html.includes('<style>') && html.includes('.form-card'), 'stil gömülü');
    assert.deepEqual(modules.slice().sort(), (await jsFiles(join(root, 'src'))).sort(), 'src altındaki her modül pakette');
    assert.equal(modules[modules.length - 1], 'src/app.js', 'giriş modülü en son çalışır');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('depodaki tek dosya güncel (kaynak değiştiyse "npm run build" çalıştırılmalı)', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'tek-dosya-'));
  try {
    const { outFile } = await buildSingle(join(dir, 'paket.html'));
    const fresh = await readFile(outFile, 'utf8');
    const committed = await readFile(DEFAULT_OUT, 'utf8');
    assert.ok(fresh === committed, 'dist/muhasebe-form-prototipi.html eski; "npm run build" çalıştırın');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
