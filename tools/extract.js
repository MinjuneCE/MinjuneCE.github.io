#!/usr/bin/env node
/*
 * extract.js — index.html 번들을 편집 가능한 src/ 트리로 분해한다.
 *
 *   node tools/extract.js
 *
 * 산출물:
 *   src/scaffold.html      로더 스크립트 + 플레이스홀더(__MANIFEST_JSON__, __TEMPLATE_JSON__)
 *   src/template.html      디코드된 HTML 템플릿(<style> CSS 포함, body는 React 렌더)
 *   src/ext_resources.json ext_resources 배열(현재 [])
 *   src/assets/<uuid>.<ext> 각 에셋 원본 바이트(gzip 해제됨) — 이 파일들을 편집한다
 *   src/meta.json          에셋 순서·mime 기록(build가 manifest 재생성에 사용)
 *
 * build.js 가 이 트리를 다시 index.html 로 묶는다.
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const ASSETS = path.join(SRC, 'assets');

const MANIFEST_PH = '__MANIFEST_JSON__';
const TEMPLATE_PH = '__TEMPLATE_JSON__';

const EXT_BY_MIME = {
  'text/javascript': '.js',
  'application/javascript': '.js',
  'text/css': '.css',
  'application/json': '.json',
  'font/woff2': '.woff2',
  'font/woff': '.woff',
};
function extFor(mime) {
  return EXT_BY_MIME[mime] || '.bin';
}

function main() {
  const raw = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const lines = raw.split('\n');

  // 페이로드 줄 찾기: 여는 태그 다음 줄이 JSON 본문.
  const manifestTagIdx = lines.findIndex((l) => l.trim().startsWith('<script type="__bundler/manifest">'));
  const templateTagIdx = lines.findIndex((l) => l.trim().startsWith('<script type="__bundler/template">'));
  if (manifestTagIdx < 0 || templateTagIdx < 0) throw new Error('번들 태그를 찾지 못함');

  const manifestLineIdx = manifestTagIdx + 1;
  const templateLineIdx = templateTagIdx + 1;

  const manifest = JSON.parse(lines[manifestLineIdx]);
  const template = JSON.parse(lines[templateLineIdx]);

  // 스캐폴드: 두 페이로드 줄을 플레이스홀더로 치환(원본 줄바꿈/공백 보존).
  const scaffoldLines = lines.slice();
  scaffoldLines[manifestLineIdx] = MANIFEST_PH;
  scaffoldLines[templateLineIdx] = TEMPLATE_PH;
  const scaffold = scaffoldLines.join('\n');

  fs.mkdirSync(ASSETS, { recursive: true });
  fs.writeFileSync(path.join(SRC, 'scaffold.html'), scaffold);
  fs.writeFileSync(path.join(SRC, 'template.html'), template);
  fs.writeFileSync(path.join(SRC, 'ext_resources.json'), '[]\n');

  // 에셋 디코드. 순서·mime 기록.
  const order = [];
  const meta = {};
  for (const uuid of Object.keys(manifest)) {
    const e = manifest[uuid];
    let buf = Buffer.from(e.data, 'base64');
    if (e.compressed) buf = zlib.gunzipSync(buf);
    const file = uuid + extFor(e.mime);
    fs.writeFileSync(path.join(ASSETS, file), buf);
    order.push(uuid);
    meta[uuid] = { mime: e.mime, file };
  }
  fs.writeFileSync(path.join(SRC, 'meta.json'), JSON.stringify({ order, assets: meta }, null, 2) + '\n');

  console.log(`추출 완료: ${order.length}개 에셋 → src/assets/`);
  console.log('편집 대상 핵심 파일:');
  for (const u of order) {
    if (/\.(js|css)$/.test(meta[u].file)) console.log('  src/assets/' + meta[u].file + '  (' + meta[u].mime + ')');
  }
}
main();
