# 포트폴리오 소스 (편집 워크플로우)

`index.html` 은 빌드 산출물(단일 번들)이다. **직접 편집하지 말 것.**
내용은 이 `src/` 트리를 고친 뒤 `node tools/build.js` 로 다시 묶는다.

## 흐름
```
src/ 편집  →  node tools/build.js  →  index.html 갱신  →  git push (자동 배포)
```
- `node tools/build.js`         빌드 + 자체 검증 후 index.html 갱신
- `node tools/build.js --check` 검증만(파일 안 씀)
- `node tools/extract.js`       index.html → src/ 재분해(보통 다시 쓸 일 없음)

배포: `MinjuneCE.github.io` 는 GitHub Pages 사용자 사이트라 `main` 에 push 하면 1~2분 후 https://minjunece.github.io/ 에 반영.

## 무엇을 어디서 고치나

| 파일 | 내용 |
|------|------|
| `assets/7418bcd7-...js` | **데이터** — 프로젝트·경력·스킬·NAV (`window.PORTFOLIO_DATA`). 텍스트 대부분 여기. |
| `assets/add3a00a-...js` | **JSX 앱** — React 컴포넌트 + Hero/About/Contact 등 정적 카피. |
| `template.html` | `<style>` CSS(디자인 토큰·레이아웃) + `<head>` 메타·폰트. body 는 `<div id="root">` 뿐(React 렌더). |
| `assets/2936455f` `5f216985` `c987cb6f` | React · ReactDOM · Babel standalone (라이브러리, 건드릴 일 없음). |
| `assets/*.woff2` | 폰트(Inter·Geist Mono·JetBrains Mono). |
| `scaffold.html` | 런타임 로더 + `__MANIFEST_JSON__` / `__TEMPLATE_JSON__` 플레이스홀더. 손대지 말 것. |
| `meta.json` | 에셋 순서·mime(빌드용). 손대지 말 것. |

> 파일명이 UUID 인 이유: manifest 키와 template 의 폰트 참조가 UUID 라서 이름을 바꾸면 안 된다.
