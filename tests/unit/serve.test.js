// Yerel sunucu: port doluysa sıradakine geçer ve yalnızca gerçekten dinlediği adresi yazar.
import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { once } from 'node:events';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../..', import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

test('sunucu: port doluysa sıradaki porta geçer, tek ve doğru adres yazar', async () => {
  const blocker = http.createServer((req, res) => res.end('dolu')).listen(0, '127.0.0.1');
  await once(blocker, 'listening');
  const busy = blocker.address().port;
  const child = spawn(process.execPath, ['scripts/serve.js', String(busy), '--no-open'], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
  let out = '';
  child.stdout.on('data', (d) => {
    out += d;
  });
  try {
    for (let i = 0; i < 50 && !/çalışıyor/.test(out); i += 1) await sleep(100);
    await sleep(300); // olası ikinci "çalışıyor" satırını yakalamak için
    const lines = out.match(/çalışıyor: http:\/\/localhost:(\d+)/g) || [];
    assert.equal(lines.length, 1, `tek adres yazılmalı:\n${out}`);
    const port = Number(lines[0].match(/(\d+)$/)[1]);
    assert.ok(port > busy, 'dolu port atlandı');
    assert.match(out, new RegExp(`${busy} portu kullanımda`));
    const res = await fetch(`http://127.0.0.1:${port}/`);
    assert.equal(res.status, 200);
    assert.match(await res.text(), /Muhasebe Formları Prototipi/);
  } finally {
    child.kill();
    blocker.close();
  }
});
