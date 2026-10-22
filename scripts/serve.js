// Bağımlılıksız yerel statik sunucu.
// Kullanım: node scripts/serve.js [port] [--no-open]
// Port doluysa sıradaki boş portu dener; açılışta tarayıcıyı kendiliğinden açar (--no-open ile kapatılır).
import http from 'node:http';
import { spawn } from 'node:child_process';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const args = process.argv.slice(2);
const startPort = Number(args.find((a) => /^\d+$/.test(a)) || process.env.PORT || 8080);
const autoOpen = !args.includes('--no-open') && process.env.NO_OPEN !== '1';
const host = process.env.HOST || '127.0.0.1';
const MAX_TRIES = 20;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.md': 'text/plain; charset=utf-8',
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    let path = decodeURIComponent(url.pathname);
    if (path.endsWith('/')) path += 'index.html';
    const file = normalize(join(root, path));
    if (!file.startsWith(root) || /[\\/](node_modules|\.git)[\\/]/.test(file)) {
      res.writeHead(403).end('Yasak');
      return;
    }
    const info = await stat(file);
    if (!info.isFile()) throw new Error('not a file');
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(body);
  } catch (err) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Bulunamadı');
  }
});

function openBrowser(url) {
  const [cmd, cmdArgs] = process.platform === 'darwin' ? ['open', [url]] : process.platform === 'win32' ? ['explorer', [url]] : ['xdg-open', [url]];
  try {
    const child = spawn(cmd, cmdArgs, { stdio: 'ignore', detached: true });
    child.on('error', () => {}); // Tarayıcı açılamazsa adres zaten ekrana yazıldı.
    child.unref();
  } catch (err) {
    // Aynı nedenle sessizce geç.
  }
}

// Her deneme kendi dinleyicilerini kaldırır; böylece başarısız denemenin geri çağrısı sonraki portta tetiklenmez.
function listen(port, triesLeft) {
  const onError = (err) => {
    server.off('listening', onListening);
    if (err.code === 'EADDRINUSE' && triesLeft > 0) {
      console.log(`${port} portu kullanımda; ${port + 1} deneniyor…`);
      listen(port + 1, triesLeft - 1);
      return;
    }
    console.error(`Sunucu başlatılamadı: ${err.message}`);
    process.exit(1);
  };
  const onListening = () => {
    server.off('error', onError);
    const url = `http://localhost:${port}/`;
    console.log(`Prototip çalışıyor: ${url}  (veya http://127.0.0.1:${port}/)`);
    console.log('Durdurmak için Ctrl+C');
    if (autoOpen) openBrowser(url);
  };
  server.once('error', onError);
  server.once('listening', onListening);
  server.listen(port, host);
}

listen(startPort, MAX_TRIES);
