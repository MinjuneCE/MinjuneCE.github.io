#!/usr/bin/env node
/*
 * build.js — src/ 트리를 다시 index.html 단일 번들로 묶는다.
 *
 *   node tools/build.js            # index.html 덮어쓰기
 *   node tools/build.js --check    # 빌드 결과를 다시 디코드해 src/와 일치하는지 검증(쓰지 않음)
 *
 * 동작: src/assets/* 를 gzip+base64 로 재인코딩해 manifest 를 만들고,
 *       src/template.html 을 JSON 문자열로 직렬화해 스캐폴드의 플레이스홀더를 채운다.
 *       에셋 바이트는 디코드 시 원본과 1:1 일치한다(gzip 압축 결과 바이트만 다를 수 있음).
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const ASSETS = path.join(SRC, 'assets');

const MANIFEST_PH = '__MANIFEST_JSON__';
const TEMPLATE_PH = '__TEMPLATE_JSON__';

function buildManifest() {
  const meta = JSON.parse(fs.readFileSync(path.join(SRC, 'meta.json'), 'utf8'));
  const manifest = {};
  for (const uuid of meta.order) {
    const a = meta.assets[uuid];
    const buf = fs.readFileSync(path.join(ASSETS, a.file));
    const gz = zlib.gzipSync(buf, { level: 9 });
    manifest[uuid] = { mime: a.mime, compressed: true, data: gz.toString('base64') };
  }
  return manifest;
}

function assemble() {
  const scaffold = fs.readFileSync(path.join(SRC, 'scaffold.html'), 'utf8');
  const template = fs.readFileSync(path.join(SRC, 'template.html'), 'utf8');
  const manifest = buildManifest();

  if (!scaffold.includes(MANIFEST_PH) || !scaffold.includes(TEMPLATE_PH)) {
    throw new Error('scaffold.html 에 플레이스홀더가 없음 — extract.js 를 다시 실행하세요');
  }
  // JSON 을 <script> 안에 임베드하므로 리터럴 '</script>' 가 HTML 파서를
  // 조기 종료시킨다. '</' → '<\/' 로 이스케이프(유효 JSON 유지, parse 시 원복).
  const esc = (s) => s.split('</').join('<\\/');
  // split/join 으로 치환($ 패턴 치환 회피).
  let out = scaffold.split(MANIFEST_PH).join(esc(JSON.stringify(manifest)));
  out = out.split(TEMPLATE_PH).join(esc(JSON.stringify(template)));
  return out;
}

function check(html) {
  // 빌드 결과를 다시 디코드해 src/ 원본과 바이트 일치 검증.
  const lines = html.split('\n');
  const mIdx = lines.findIndex((l) => l.trim().startsWith('<script type="__bundler/manifest">')) + 1;
  const tIdx = lines.findIndex((l) => l.trim().startsWith('<script type="__bundler/template">')) + 1;
  const manifest = JSON.parse(lines[mIdx]);
  const template = JSON.parse(lines[tIdx]);
  const meta = JSON.parse(fs.readFileSync(path.join(SRC, 'meta.json'), 'utf8'));

  let ok = true;
  if (template !== fs.readFileSync(path.join(SRC, 'template.html'), 'utf8')) {
    console.error('  ✗ template 불일치'); ok = false;
  }
  for (const uuid of meta.order) {
    const e = manifest[uuid];
    let buf = Buffer.from(e.data, 'base64');
    if (e.compressed) buf = zlib.gunzipSync(buf);
    const orig = fs.readFileSync(path.join(ASSETS, meta.assets[uuid].file));
    if (!buf.equals(orig)) { console.error('  ✗ 에셋 불일치:', uuid); ok = false; }
  }
  return ok;
}

function main() {
  const checkOnly = process.argv.includes('--check');
  const html = assemble();
  const ok = check(html);
  if (!ok) { console.error('검증 실패 — index.html 을 쓰지 않음'); process.exit(1); }
  if (checkOnly) { console.log('검증 통과(--check): 디코드 결과가 src/ 와 일치. 파일은 쓰지 않음.'); return; }
  fs.writeFileSync(path.join(ROOT, 'index.html'), html);
  const kb = (Buffer.byteLength(html) / 1024).toFixed(0);
  console.log(`빌드 완료 → index.html (${kb} KB), 검증 통과.`);
}
main();
