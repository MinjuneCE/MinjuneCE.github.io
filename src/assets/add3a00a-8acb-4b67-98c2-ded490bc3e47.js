const { useState, useEffect, useLayoutEffect, useRef } = React;

// ============ UTILITIES ============
function useReveal(dep) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const nodes = root.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((es) => {
      es.forEach((e) => {if (e.isIntersecting) {e.target.classList.add('in');obs.unobserve(e.target);}});
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, [dep]);
  return ref;
}

function Counter({ to, suffix = '', duration = 1600 }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let raf = null;
    const obs = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          const start = performance.now();
          const tick = (t) => {
            const p = Math.min(1, (t - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(to * eased));
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
          obs.disconnect();
        }
      });
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => {obs.disconnect();if (raf) cancelAnimationFrame(raf);};
  }, [to, duration]);
  return <b ref={ref}>{n}{suffix}</b>;
}

function SectionHeader({ slug, title, meta }) {
  return (
    <div className="section-header">
      <div className="left">// {slug}</div>
      <div className="right">
        <span>SECTION <b>{title}</b></span>
        {meta && <span>{meta}</span>}
      </div>
    </div>);

}

// 섹션 번호는 NAV 순서에서 계산 (섹션을 끼워 넣어도 번호가 따라옴)
const pad2 = (n) => String(n).padStart(2, '0');
function secIndex(id) {
  return window.PORTFOLIO_DATA.NAV.findIndex((n) => n.id === id);
}
function secNo(id) {
  return `${pad2(secIndex(id) + 1)} / ${pad2(window.PORTFOLIO_DATA.NAV.length)}`;
}
function screenLabel(id) {
  return `${pad2(secIndex(id) + 1)} ${window.PORTFOLIO_DATA.NAV[secIndex(id)].label}`;
}

// ============ NAV ============
function Nav({ page, total }) {
  const [time, setTime] = useState('');
  const activeId = window.PORTFOLIO_DATA.NAV[page].id;

  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      setTime(`SEL ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    };
    fmt();const id = setInterval(fmt, 1000);return () => clearInterval(id);
  }, []);

  return (
    <React.Fragment>
      <div id="scroll-progress" className="scroll-progress" style={{ width: (page + 1) / total * 100 + '%' }} />
      <nav className="nav">
        <a href="#hero" className="nav-brand">
          <span className="mark" />
          <span>Kim Minjune</span>
          <span className="sep">/</span>
          <span className="role">Backend → AX · FDE</span>
        </a>
        <div className="nav-links">
          {window.PORTFOLIO_DATA.NAV.map((n) =>
          <a key={n.id} href={`#${n.id}`} className={activeId === n.id ? 'active' : ''}>{n.label}</a>
          )}
        </div>
        <div className="nav-right">
          <span className="nav-time">{time}</span>
          <a href="mailto:richdream703@gmail.com" className="nav-cta">Contact →</a>
        </div>
      </nav>
    </React.Fragment>);

}

// ============ HERO ============
function Hero() {
  return (
    <section id="hero" className="hero" data-screen-label={screenLabel('hero')}>
      <div className="container hero-content">
        <div className="hero-top">
          <div>Kim Minjune ®</div>
          <div>Backend Engineer → AX · FDE, Seoul, Republic of Korea</div>
          <div>Portfolio · 2026.10</div>
        </div>

        <div className="hero-main">
          <div className="hero-num">
            {window.PORTFOLIO_DATA.NAV.map((n, i) =>
            <a key={n.id} href={`#${n.id}`} className={i === 0 ? 'cur' : ''}>
              {i === 0 ? <b>{String(i + 1).padStart(2, '0')}</b> : String(i + 1).padStart(2, '0')} · {n.label}
              {n.id === 'case-study' && <span className="hook">중앙영구 8서버 · 추가 인프라 0대</span>}
            </a>
            )}
          </div>
          <div className="hero-headline-wrap">
            <h1 className="hero-headline">
              <span className="line"><span>Systems</span></span>
              <span className="line"><span>That Hold <span className="accent">Up.</span></span></span>
              <span className="line"><span className="sub">김민준 · Kim Minjune · Backend → AX · FDE</span></span>
            </h1>
          </div>
        </div>

        <div className="hero-mid">
          <div className="hero-role">
            <span className="label">Role</span> <b>Backend · AI Harness · AX / FDE</b>
          </div>
          <div className="hero-slogan">
            설계부터 운영까지 끝까지 책임지던 방식 그대로, AI를 현장의 업무에 붙이는 일을 준비합니다.
            <a href="#case-study" className="case-hint">CASE STUDY 05 → 중앙영구기록관리 8서버 자율 분산 딥다이브</a>
          </div>
          <div className="hero-status"><span className="dot" /> Available</div>
        </div>

        <div className="hero-bottom">
          <div className="hero-ctas">
            <a href="#projects" className="btn primary">프로젝트 보기 <span className="arr">→</span></a>
            <a href="mailto:richdream703@gmail.com" className="btn ghost">연락하기</a>
          </div>
          <div className="hero-counters">
            <div><Counter to={3} suffix="+" />Years Exp</div>
            <div><Counter to={5} suffix="+" />Public Domains</div>
            <div><Counter to={8} />Projects</div>
            <div><Counter to={100} suffix="M+" />Files Analyzed</div>
          </div>
        </div>
      </div>
    </section>);

}

// ============ ABOUT ============
function Terminal() {
  const lines = [
  { type: 'cmd', text: 'whoami' },
  { type: 'out', text: 'kim_minjune · Backend → AX · FDE' },
  { type: 'spacer' },
  { type: 'cmd', text: 'cat stack.txt' },
  { type: 'out', text: 'Java, Spring Boot, eGovFrame,' },
  { type: 'out', text: 'Oracle, PostgreSQL,' },
  { type: 'out', text: 'Kubernetes (K-PaaS), Claude Code' },
  { type: 'spacer' },
  { type: 'cmd', text: 'echo $STATUS' },
  { type: 'out', text: 'shipping production code', color: 'green' }];

  const [shown, setShown] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let id = null;
    const obs = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          let i = 0;
          id = setInterval(() => {
            i++;
            setShown(i);
            if (i >= lines.length) clearInterval(id);
          }, 240);
          obs.disconnect();
        }
      });
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => {obs.disconnect();if (id) clearInterval(id);};
  }, []);

  return (
    <div className="terminal" ref={ref}>
      <div className="terminal-bar">
        <div className="dots">
          <span style={{ background: '#ff5f56' }} />
          <span style={{ background: '#ffbd2e' }} />
          <span style={{ background: '#27c93f' }} />
        </div>
        <span style={{ marginLeft: 8 }}>~/kim_minjune · zsh · 80×24</span>
      </div>
      <div className="terminal-body">
        {lines.slice(0, shown).map((ln, i) => {
          if (ln.type === 'spacer') return <div key={i} style={{ height: 10 }} />;
          if (ln.type === 'cmd') return <div key={i} className="terminal-line"><span className="prompt">$</span><span>{ln.text}</span></div>;
          return <div key={i} className="terminal-line"><span className="gray">›</span> <span className={ln.color === 'green' ? 'green' : 'out'}>{ln.text}</span></div>;
        })}
        {shown >= lines.length && <span className="terminal-cursor" />}
      </div>
    </div>);

}

function About() {
  return (
    <section id="about" className="about" data-screen-label={screenLabel('about')}>
      <div className="container">
        <SectionHeader slug="about" title="ABOUT" meta={secNo('about')} />
        <div className="about-grid">
          <div className="about-headline reveal">
            <h2>3 Years. 5 Domains.<br /><span className="ink-em">Public Data Infrastructure.</span></h2>
          </div>

          <div className="about-cols" style={{ gridColumn: '1 / -1' }}>
            <div className="about-prose reveal d1">
              <p>3년간 5개 이상의 공공 도메인에서 백엔드 시스템을 설계하고 운영해왔습니다. <strong>처리 계층 8서버 분산</strong>(중앙영구기록관리시스템), <strong>10년 · 약 1억 건 전수 분석</strong>(전자기록 기계검수), <strong>12개 MSA 배포 환경</strong>(대구광역시교육청 AI 평가 플랫폼)을 거치며, 안정성과 정합성이 중요한 시스템을 eGovFrame부터 Spring Boot 기반 MSA·K-PaaS까지 폭넓게 다뤄왔습니다.</p>
              <p>단순히 동작하는 코드보다 <span className="kw">변경에 강한 구조</span>를 만드는 데 관심이 많습니다. 공공 프로젝트는 전자정부프레임워크 표준(Spring MVC 계층형)을 따라야 하는 만큼, 그 제약 안에서 도메인 로직이 컨트롤러와 SQL로 흩어지지 않도록 <strong>서비스 계층의 책임을 나누는 데</strong> 집중했습니다.</p>
              <p>제약이 다른 개인 프로젝트에서는 <strong>DDD · 헥사고날 · TDD</strong>를 직접 적용합니다. <span className="kw">Claude Code 기반 에이전틱 워크플로우</span>로 개발할 때, 명확한 경계와 테스트가 곧 AI에 넘기는 명세이자 검증 장치이기 때문입니다.</p>
              <p>2026년 10월부터는 글로벌 D2C 커머스(Shopify)의 <strong>풀스택 개발자</strong>로 스토어와 결제 · 물류 연동 모듈을 맡고 있습니다. 공공 백엔드에서 쌓은 설계 · 운영 감각과 에이전트 하네스 경험을 묶어, 현업 가까이에서 문제를 풀고 AI로 일하는 방식을 바꾸는 <span className="kw">AX · FDE</span>를 준비합니다.</p>
            </div>
            <div className="about-terminal reveal d2">
              <Terminal />
            </div>
          </div>

          <div className="about-stats">
            <div className="about-stat reveal"><div className="n"><Counter to={3} suffix="+" /></div><div className="l">Years Experience</div></div>
            <div className="about-stat reveal d1"><div className="n"><Counter to={8} /></div><div className="l">Projects Shipped</div></div>
            <div className="about-stat reveal d2"><div className="n"><Counter to={100} suffix="M+" /></div><div className="l">Records Analyzed</div></div>
            <div className="about-stat featured reveal d3"><div className="n" style={{ fontSize: 'clamp(20px, 2.4vw, 32px)', letterSpacing: '-0.02em' }}>AI-Augmented</div><div className="l">Workflow</div></div>
          </div>
        </div>
      </div>
    </section>);
}

// ============ EXPERIENCE ============
function StarredItem({ p, idx }) {
  return (
    <div className="starred reveal">
      <div className="star">★</div>
      <div className="body">
        <div className="head">
          <span className="num">{p.no}</span>
          <h4>{p.title}</h4>
          <span className="period">{p.period}</span>
          {p.status && <span className="status">{p.status}</span>}
        </div>
        <div className="role-tag">ROLE · <b>{p.role}</b></div>
        <ul>
          {p.bullets.map((b, i) => {
            // parse ` ` for code
            const parts = b.split(/(`[^`]+`)/g);
            return (
              <li key={i}>
                {parts.map((part, j) =>
                part.startsWith('`') && part.endsWith('`') ?
                <code key={j}>{part.slice(1, -1)}</code> :
                <React.Fragment key={j}>{part}</React.Fragment>
                )}
              </li>);

          })}
        </ul>
        <div className="stack">
          {p.stack.map((s) => <span key={s} className="tag">{s}</span>)}
        </div>
      </div>
    </div>);

}

function MinorItem({ p }) {
  return (
    <div className="minor reveal">
      <div className="head">
        <span className="num">{p.no}</span>
        <span className="period">{p.period}</span>
      </div>
      <h4>{p.title}</h4>
      <p>{p.desc}</p>
      <div className="stack">
        {p.stack.map((s) => <span key={s} className="tag">{s}</span>)}
      </div>
    </div>);

}

function Experience() {
  const { STARRED, MINOR } = window.PORTFOLIO_DATA;
  return (
    <section id="experience" className="experience" data-screen-label={screenLabel('experience')}>
      <div className="container">
        <SectionHeader slug="experience" title="EXPERIENCE" meta={secNo('experience')} />

        <div className="exp-company reveal">
          <div className="exp-company-meta">
            <div className="period">2026.10 ~</div>
            <h3>(주)아이피씨엑스 ·
IPCX</h3>
            <div className="rel">이든앤앨리스마케팅 관계사</div>
            <div className="role-line">
              <b>풀스택 개발자</b>
              <span className="promo">재직 중</span>
            </div>
          </div>
          <div className="exp-company-desc">
            <p>글로벌 D2C 화장품 브랜드의 <strong>Shopify 스토어 개발 · 운영</strong>을 맡고 있습니다. 서드파티 앱 대신 자체 모듈(주문 취소 · 모니터링)을 개발해 AWS 환경에 배포하고 스토어와 연동하는 일, 해외 결제 대행(MoR) · 물류사(3PL)와의 주문 · 결제 · 출고 상태 연동을 담당합니다.</p>
            <p>입사 첫 주에는 코드부터 고치지 않고 <strong>에이전트 하네스부터 구성</strong>했습니다. 기존 시스템을 분석하고, 실주문이 나갈 수 없는 로컬 검증 환경을 세운 뒤 재설계안을 실험 브랜치에서 검증했습니다. 구성과 원칙은 06 AI HARNESS에 정리했습니다.</p>
          </div>
        </div>

        <div className="exp-company reveal">
          <div className="exp-company-meta">
            <div className="period">2023.02 ~ 2026.05</div>
            <h3>(주)아키아카 ·
Akiaka</h3>
            <div className="role-line">
              <b>백엔드 개발자 → 리더</b>
              <span className="promo">2026 승격</span>
            </div>
          </div>
          <div className="exp-company-desc">
            <p>교육·행정·에너지·연구·국토 등 <strong>5개 이상 공공 도메인의 업무시스템</strong>(영구기록물·평가 플랫폼)을 맡아왔습니다. 사업에 따라 신규 구축을 하기도 했고, 기능개선이나 장기 유지보수를 맡기도 했습니다.</p>
            <p>원래 난이도 때문에 PL이 맡기로 돼 있던 <strong>중앙영구기록관리시스템 다중화 과제를 넘겨받아, 분산 처리를 직접 공부해 혼자 설계하고 구현</strong>했습니다. 부서 연차사업 제안서 작성에도 참여했고, 리더로 승격했습니다.</p>
          </div>
        </div>

        <div className="exp-section-label">
          <span>★ Featured Projects</span>
          <span className="count">{String(STARRED.length).padStart(2, '0')}</span>
        </div>
        <div className="starred-list">
          {STARRED.map((p, i) => <StarredItem key={p.no} p={p} idx={i} />)}
        </div>

        <div className="exp-section-label">
          <span>Other Projects</span>
          <span className="count">{String(MINOR.length).padStart(2, '0')}</span>
        </div>
        <div className="minor-list">
          {MINOR.map((p) => <MinorItem key={p.no} p={p} />)}
        </div>

        <div className="exp-extra reveal">
          <div className="label">추가 활동</div>
          <ul>
            <li>부서 연차사업 제안서 작성 참여<span className="yr">2024 ~ 2026</span></li>
            <li>공공 입찰 제안서 작성 경험<span className="yr">다수</span></li>
          </ul>
        </div>
      </div>
    </section>);}

// ============ PROJECTS ============
function renderRichText(text) {
  // **bold** + `code`
  const tokens = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) tokens.push({ t: 'text', v: text.slice(last, m.index) });
    if (m[0].startsWith('**')) tokens.push({ t: 'b', v: m[0].slice(2, -2) });else
    tokens.push({ t: 'c', v: m[0].slice(1, -1) });
    last = m.index + m[0].length;
  }
  if (last < text.length) tokens.push({ t: 'text', v: text.slice(last) });
  return tokens.map((tok, i) => {
    if (tok.t === 'b') return <strong key={i} style={{ color: '#111', fontWeight: 600 }}>{tok.v}</strong>;
    if (tok.t === 'c') return <code key={i}>{tok.v}</code>;
    return <React.Fragment key={i}>{tok.v}</React.Fragment>;
  });
}

function ProjectCard({ p }) {
  return (
    <div className="proj-card reveal">
      <div className="cat">
        <span>{p.cat}</span>
        <span className="pno">PROJECT · {p.no}</span>
      </div>
      <h3>{p.headline.split('\n').map((s, i, arr) => (
        <React.Fragment key={i}>
          {arr.length > 1 && i === 0 ? <span className="biz">{s}</span> : s}
          {i < arr.length - 1 ? <br /> : null}
        </React.Fragment>
      ))}</h3>

      {p.overview ?
      <React.Fragment>
      <div className="proj-block">
        <div className="blabel">Overview</div>
        <p>{renderRichText(p.overview)}</p>
      </div>

      {p.features &&
      <div className="proj-block">
        <div className="blabel">주요 기능</div>
        <ul>
          {p.features.map((s, i) => <li key={i}>{renderRichText(s)}</li>)}
        </ul>
      </div>
      }

      {p.approach &&
      <div className="proj-block">
        <div className="blabel">설계 · 접근</div>
        <p>{renderRichText(p.approach)}</p>
      </div>
      }
      </React.Fragment> :
      <React.Fragment>
      <div className="proj-block">
        <div className="blabel">Problem</div>
        <p>{renderRichText(p.problem)}</p>
      </div>

      <div className="proj-block">
        <div className="blabel">Solution</div>
        <p>{renderRichText(p.solutionLead)}</p>
        {p.solutionList &&
        <ul>
            {p.solutionList.map((s, i) => <li key={i}>{renderRichText(s)}</li>)}
          </ul>
        }
      </div>

      {p.alternatives &&
      <div className="proj-block alt">
        <div className="blabel">Trade-off · 대안 검토</div>
        <ul>
          {p.alternatives.map((s, i) => <li key={i}>{renderRichText(s)}</li>)}
        </ul>
      </div>
      }

      <div className="proj-block">
        <div className="blabel">Result</div>
        {p.resultList.length > 1 ?
        <ul>
            {p.resultList.map((s, i) => <li key={i}>{renderRichText(s)}</li>)}
          </ul> :

        <p>{renderRichText(p.resultList[0])}</p>
        }
      </div>
      </React.Fragment>
      }

      {p.more &&
      <div className="proj-more">
        <a href={p.more.href}>{p.more.label} <span className="arr">→</span></a>
      </div>
      }

      <div className="stack">
        {p.stack.map((s) => <span key={s} className="tag">{s}</span>)}
      </div>
    </div>);

}

function Projects() {
  return (
    <section id="projects" className="projects" data-screen-label={screenLabel('projects')}>
      <div className="container">
        <SectionHeader slug="projects" title="PROJECTS" meta={secNo('projects')} />
        <div className="proj-grid">
          {window.PORTFOLIO_DATA.FEATURED_PROJECTS.map((p) => <ProjectCard key={p.no} p={p} />)}
        </div>
      </div>
    </section>);

}

// ============ CASE STUDY ============
const CASE_TRACE = [
  {
    n: '01', t: '담당 배경 · 주어진 조건',
    body: [
      '난이도가 높아 원래 **PL이 담당**하기로 분장됐던 다중화 task. PL이 프로젝트 중반 중도 하차하면서 PM이 재할당했고, 다중화를 직접 학습해 단독으로 맡음.',
      '**서버 8대는 이 사업에서 정한 수가 아님.** 다른 인프라 사업으로 이미 들어와 있던 서버 8대를 쓰는 것이 요구사항. 그래서 풀어야 할 문제는 몇 대가 필요하냐가 아니라, **있는 8대를 어떻게 나눠 쓰느냐**였음.',
    ],
  },
  {
    n: '02', t: '착수 후 드러난 제약',
    body: [
      '사전 인터뷰 답변대로 **L4 스위치 도입을 전제**로 제안서·계획을 작성했으나, 착수 후 L4 도입 불가가 판명됨.',
      '파일을 받는 **다중화 송수신 솔루션이 단일 서버에 종속**돼 있고 유지보수 인력도 없어 복제 불가. → 8대 서버 중 1대를 **단일 수신 게이트웨이(처리 겸)**로 두고 나머지로 처리를 다중화하는 구조가 강제됨.',
    ],
  },
  {
    n: '03', t: '설계 선택 ①: 공유 디렉토리 대신 DB 작업 큐',
    body: [
      '모든 서버가 공유 디렉토리를 폴링하며 파일을 집어가는 방식을 검토했으나 기각. ① 수신이 1서버 종속이라 대칭 수신+처리가 불가, ② **파일시스템엔 원자적 claim 수단이 없어** 파일이 몰리면 여러 워커가 같은 파일을 동시에 집는 것을 막기 어려움.',
      '반면 메타데이터는 DB에 있어 **트랜잭션 락으로 원자적 claim이 가능**. 어쩔 수 없이가 아니라 더 우월한 claim 수단을 보고 **DB 작업 큐를 능동적으로 선택함**.',
    ],
  },
  {
    n: '04', t: '설계 선택 ②: 중앙 분배(push)에서 자율 선점(pull)으로',
    body: [
      '처음엔 중앙 분배자가 작업을 나눠주는 방식을 구상. 그러나 단순 시퀀셜(round-robin) 분배는 **파일 크기 편차로 일부 서버만 혹사**되는 부하 불균형(makespan 악화)이 걸림돌. 가용성이 아니라 부하분산 문제임.',
      '다만 결정적이었던 건 부하가 아니라 **역할 고정**. 고객은 **인수:품질 서버 비율을 3:5 / 2:6 등으로 바꿔 쓰길** 원했는데, 분배자가 역할을 고정하는 구조로는 이 요구를 받을 수가 없었음. → 분배자를 두지 않고 **워커가 직접 선점하는 자율 할당(경쟁 소비자)**으로 전환함.',
      '단, 각 서버의 인수/품질 역할은 **서버 설정값**이라 비율을 바꾸려면 그 서버 재기동 필요.',
    ],
  },
  {
    n: '05', t: '동시성 이슈: 데드락, 그리고 SKIP LOCKED',
    body: [
      '대상을 **10건씩 묶어 claim**하자 워커들이 경합하며 **데드락 발생**. 여러 행을 한 트랜잭션에서 잠글 때 일관된 `ORDER BY`가 없으면 락 획득 순서가 비결정적이 되어 **순환 대기**에 빠짐.',
      '`ORDER BY` 통일로 순환 대기는 해소. 대신 8대가 전부 같은 앞쪽 행들에 줄을 서서 **락 대기로 한 줄이 됨**. **배치=1**은 순환 대기를 아예 없앤 대신 DB 왕복이 급증해 **처리량을 대가로 내줬음**.',
      '최종 해법은 `SELECT … FOR UPDATE SKIP LOCKED`. **잠긴 행은 건너뛰므로 정렬을 그대로 두고 배치를 키워도 기다릴 일이 생기지 않음.** SKIP LOCKED가 푼 건 데드락이 아니라, 데드락을 없앤 뒤에도 남는 대기임.',
    ],
  },
  {
    n: '06', t: '리소스 이슈: 커넥션 풀 사이징',
    body: [
      '8서버 × 멀티스레드 워커의 동시 사용 주체 수가 풀 크기를 초과해 **커넥션 획득 실패 발생**. claim 트랜잭션은 이미 짧아 점유 시간이 아니라 **순수 동시성 사이징** 문제였음.',
      '인프라팀과 조율해 워커 동시성에 맞춰 풀을 증설함. **claim 트랜잭션이 짧아 커넥션을 오래 쥐고 있을 수가 없다는 것**이 진단 근거였고, 늘린 건 동시에 쓰는 주체 수에 맞춘 풀 크기임.',
    ],
  },
  {
    n: '07', t: '실패 모드: soft / hard 구분',
    body: [
      '**Soft failure**(IO·변환·비즈니스 예외): `try-catch`로 상태를 `오류`로 마킹 + 로그 → 유지보수 조직 확인. 자동으로 동작함.',
      '**Hard crash**(`kill -9`·OOM·전원·네트워크 단절): catch가 실행되지 않아 task가 `작업중`에 고착됨. claim 시 `worker_id`(서버 식별자)를 행에 기록해 두므로, 실시간 모니터링이 죽은 서버를 감지하면 그 식별자의 stuck 행을 **역추적해 수동 회수함**.',
      '**리퍼(reaper)·lease 타임아웃은 의도적으로 미도입**. 무중단 자동복구가 불필요한 업무 특성임. 그 덕에 **멱등성도 현재는 비필수**. (자동 회수를 넣으면 "완료 후 마킹 전 크래시 → 이중 처리" 위험이 생겨, 그때는 처리-마킹 원자화나 멱등 처리가 필수가 됨.)',
    ],
  },
  {
    n: '08', t: '결과와 수용한 대가',
    body: [
      '**택한 것**: 새로 들인 인프라 0대로 처리 계층 8대를 나눔. 나눠주는 서버가 없어 워커를 늘려도 조정 로직 수정 불필요, 인수:품질 비율은 서버 설정값으로 바꿀 수 있음.',
      '**포기한 것**: 수신 게이트웨이는 솔루션 제약 때문에 끝까지 1대. 역할 pin은 설정값이라 바꾸려면 그 서버 재기동 필요. hard crash로 멈춘 작업은 `worker_id`를 역추적해 **수동으로 회수**. 자동 리퍼·lease 타임아웃과 멱등성은 미도입 : 무중단 자동복구가 불필요한 업무 특성이라 복잡도를 안 늘리는 쪽을 택함.',
    ],
  },
];

const CASE_QA = [
  { q: '같은 작업을 두 워커가 동시에 잡지 않나?', a: '`SELECT … FOR UPDATE SKIP LOCKED`로 행을 잠근 뒤, 같은 트랜잭션에서 상태를 `작업중`으로 바꾸고 커밋하는 **원자적 claim**임. 커밋 전까지 다른 트랜잭션은 그 행을 잠글 수 없고, 이미 잠긴 행은 **건너뛰므로** 두 워커가 같은 작업을 잡는 경우가 생길 수 없음. 통합 테스트에서도 재현되지 않았음.' },
  { q: '부하는 어떻게 고르게 분산되나?', a: '분배자가 미리 나눠주는 push가 아니라 **워커가 끝나는 대로 다음 작업을 가져가는 pull(경쟁 소비자)**이라, 파일 크기 편차가 있어도 빠른 워커가 더 처리함. **미리 나눠놓고 한쪽만 밀리는 makespan 문제가 생기지 않음.**' },
  { q: '워커가 처리 도중 죽으면 그 작업은?', a: 'hard crash는 `catch`가 돌지 않아 행이 `작업중`에 고착됨. 모니터링이 서버 다운을 감지하면, claim 시 기록한 `worker_id`로 그 서버의 stuck 행을 **역추적**해 **수동 회수함**. 자동 리퍼는 무중단 복구가 불필요해 미도입.' },
  { q: 'DB·수신이 단일인데 완전한 HA인가?', a: '아님. **처리 계층은 8서버로 나눴지만** 수신 게이트웨이는 솔루션 제약상 **단일(SPOF)**이고 작업 큐 DB도 공유 자원임. 주어진 제약 안에서 **한 대가 멈춰도 나머지가 계속 작업을 집어가고, 워커를 늘릴 수 있게** 만든 것까지가 이 설계의 범위.' },
  { q: '배치를 줄였다 다시 키운 이유는?', a: '배치 10 → **데드락**(락 순서 비결정) → 배치 1 → 데드락은 풀렸으나 **DB 왕복↑로 처리량↓** → `SKIP LOCKED`로 **배치 복원**해 처리량까지 회복함. 줄인 게 해법이 아니라 SKIP LOCKED가 최종 해법임.' },
  { q: '멱등성은 보장하나?', a: '자동 재처리가 없어 **현재는 비필수**. 자동 회수를 도입하면 "완료 후 마킹 전 크래시 → 이중 처리" 위험이 생기므로, 그때는 **처리-마킹 원자화 또는 멱등 처리**가 필수로 전환됨.' },
];

const CASE_SQL = `<!-- JobQueueMapper.xml · Oracle · MyBatis -->
<!-- 설명용으로 다시 쓴 코드 (실제 납품 소스 아님) -->

<!-- ① 선점: 잠긴 행은 건너뛰고 대기 상태인 작업만 잡는다 -->
<select id="selectClaimable" resultType="Job">
  SELECT job_id, file_path, job_type
    FROM tb_job_queue
   WHERE status   = #{statusReady}      <!-- '대기' (상태는 코드값) -->
     AND job_type = #{jobType}          <!-- 인수/품질: 서버 설정값으로 주입 -->
   ORDER BY priority                    <!-- 업무 중요도 순 -->
   FOR UPDATE SKIP LOCKED               <!-- 잠긴 행은 건너뜀 → 순환 대기·락 대기 없이 병렬 선점 -->
</select>

<!-- ② 같은 트랜잭션에서 바로 선점 표시. 커밋되면 다른 워커의 조회 대상에서 빠진다 -->
<update id="markProcessing">
  UPDATE tb_job_queue
     SET status    = #{statusProcessing},   <!-- '작업중' : 선점 표시 -->
         worker_id = #{workerId}             <!-- 누가 잡았는지 기록 → 죽은 서버 stuck 회수 추적 -->
   WHERE job_id IN
   <foreach collection="ids" item="id" open="(" separator="," close=")">#{id}</foreach>
</update>`;

const CASE_JAVA = `// JobWorker · 설명용으로 다시 쓴 코드 (실제 납품 소스 아님)
// 폴링은 기존 단일서버 방식 유지 (무한 루프 + sleep)
while (running) {
    try {
        List<Job> jobs = jobClaimer.claim();   // ① 짧은 선점 트랜잭션
        for (Job job : jobs) process(job);     // ② 무거운 처리는 락 밖에서
    } catch (Exception e) {
        log.error("worker loop error", e);
    }
    Thread.sleep(pollIntervalMs);
}

// 선점만 맡는 별도 빈. 같은 클래스에서 자기 자신을 호출하면 프록시를 안 거쳐 @Transactional 이 안 먹는다
@Transactional   // 선점 → 상태 전이 → 즉시 commit (행 락을 짧게 끊는다)
public List<Job> claim() {
    List<Job> jobs = mapper.selectClaimable(statusReady, jobType);    // SELECT … FOR UPDATE SKIP LOCKED
    if (!jobs.isEmpty())
        mapper.markProcessing(idsOf(jobs), statusProcessing, workerId);   // 같은 트랜잭션에서 UPDATE
    return jobs;   // 반환 시 commit → 락 해제, 상태는 '작업중'으로 고정
}

void process(Job job) {
    try {
        fileProcessor.handle(job.getFilePath());      // 스토리지에서 경로로 읽어 처리
        mapper.markStatus(job.getId(), statusDone);   // '완료'
    } catch (Exception e) {                            // soft failure → 자동 '오류' 마킹
        mapper.markStatus(job.getId(), statusError);
        log.error("job {} failed", job.getId(), e);
    }
    // hard crash(kill -9 / OOM / 전원·네트워크)는 catch 미실행 → '작업중' stuck
    //   → worker_id 로 역추적해 모니터링 발견 후 수동 회수
}`;

function CaseDiagram() {
  return (
    <svg viewBox="0 0 960 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="8서버 자율 분산 처리 아키텍처">
      <defs>
        <marker id="ah" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#777" />
        </marker>
        <marker id="aha" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#d94f1f" />
        </marker>
      </defs>

      {/* upstream */}
      <rect x="30" y="34" width="150" height="44" rx="4" fill="#161616" stroke="#3a3a3a" />
      <text x="105" y="54" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="12" fill="#cfcfcf">업스트림</text>
      <text x="105" y="70" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fill="#777">연계 시스템 · 사용자</text>
      <line x1="180" y1="56" x2="217" y2="56" stroke="#777" strokeWidth="1.2" markerEnd="url(#ah)" />

      {/* gateway */}
      <rect x="220" y="26" width="200" height="58" rx="4" fill="#161616" stroke="#d94f1f" />
      <text x="320" y="50" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="12" fill="#e6e6e6">수신 게이트웨이 (1 / 8)</text>
      <text x="320" y="68" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10" fill="#d94f1f">· 처리 겸함</text>
      <line x1="360" y1="84" x2="468" y2="118" stroke="#777" strokeWidth="1.2" markerEnd="url(#ah)" />

      {/* queue */}
      <rect x="300" y="120" width="360" height="64" rx="4" fill="#161616" stroke="#5a5a5a" />
      <text x="480" y="146" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="12.5" fill="#e6e6e6">Oracle 작업 큐 · tb_job_queue</text>
      <text x="480" y="167" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9.5" fill="#9a9a9a">대기 → 작업중 → 완료 / 오류 · worker_id 기록</text>
      <line x1="660" y1="150" x2="697" y2="150" stroke="#777" strokeWidth="1.2" markerEnd="url(#ah)" />

      {/* storage */}
      <rect x="700" y="124" width="236" height="56" rx="4" fill="#161616" stroke="#3a3a3a" />
      <text x="818" y="148" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="12" fill="#cfcfcf">스토리지</text>
      <text x="818" y="166" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fill="#777">원본 파일 바이트 (경로 접근)</text>

      {/* claim fan */}
      <line x1="480" y1="186" x2="82" y2="298" stroke="#d94f1f" strokeWidth="1.1" markerEnd="url(#aha)" opacity="0.65" />
      <line x1="480" y1="186" x2="421" y2="298" stroke="#d94f1f" strokeWidth="1.1" markerEnd="url(#aha)" opacity="0.65" />
      <line x1="480" y1="186" x2="878" y2="298" stroke="#d94f1f" strokeWidth="1.1" markerEnd="url(#aha)" opacity="0.65" />
      <rect x="292" y="232" width="376" height="22" rx="3" fill="#0e0e0e" />
      <text x="480" y="247" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="11.5" fill="#d94f1f">self-claim · SELECT … FOR UPDATE SKIP LOCKED</text>

      {/* group labels */}
      <text x="189" y="290" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10" fill="#d94f1f">인수 × 3</text>
      <text x="653" y="290" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10" fill="#9a9a9a">품질 × 5</text>

      {/* workers */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const x = 24 + i * 116;
        const acc = i < 3;
        return (
          <g key={i}>
            <rect x={x} y="300" width="98" height="58" rx="4" fill="#161616" stroke={acc ? '#d94f1f' : '#3a3a3a'} />
            <text x={x + 49} y="326" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="12" fill="#cfcfcf">서버 {String(i + 1).padStart(2, '0')}</text>
            <text x={x + 49} y="344" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fill="#777">멀티스레드</text>
          </g>);
      })}
      <text x="480" y="386" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10.5" fill="#888">8 워커 서버 · 분배자 없음 (경쟁 소비자 / self-claiming)</text>
    </svg>);
}

function CaseStudy() {
  return (
    <section id="case-study" className="case" data-screen-label={screenLabel('case-study')}>
      <div className="container">
        <SectionHeader slug="case-study" title="CASE STUDY" meta={secNo('case-study')} />

        <div className="case-intro reveal">
          <div className="case-cat">Distributed System · Deep Dive</div>
          <h3>중앙영구기록관리시스템 다중화</h3>
          <p className="case-lead">
            행정안전부 사업(2024). 서버 8대와 L4 없는 환경은 주어진 조건. 여기에 인수:품질 비율을 바꿔 쓰려는 요구가 더해져 역할을 고정하는 구조는 쓸 수 없었음. 그래서 중앙 분배자 없이 각 워커가 작업을 직접 집어가는 <strong>경쟁 소비자(self-claiming)</strong> 구조를 택함. 나눈 것은 <strong>처리 계층</strong>이고, 파일을 받는 수신 게이트웨이는 끝까지 1대. 제약이 설계를 바꾸고 한 해결책이 다음 문제를 부른 과정을 순서대로 정리.
          </p>
          <div className="case-meta">
            <div><span className="k">Role</span><span className="v">다중화 과제 단독 담당 : 작업 큐 스키마 · claim 쿼리 · 워커 루프 · 실패 모드 정책</span></div>
            <div><span className="k">Scale</span><span className="v">8서버 · 새 인프라 0대</span></div>
            <div><span className="k">Core</span><span className="v">SELECT … FOR UPDATE SKIP LOCKED</span></div>
            <div><span className="k">Stack</span><span className="v">Java · Spring · eGovFrame · Oracle · MyBatis</span></div>
          </div>
        </div>

        <div className="case-section-label"><span>01. 문제 해결 과정</span></div>
        <div className="case-trace">
          {CASE_TRACE.map((b, i) =>
          <div className="case-beat reveal" key={i}>
            <div className="bn">{b.n}</div>
            <div className="bbody">
              <h4>{b.t}</h4>
              {b.body.map((p, j) => <p key={j}>{renderRichText(p)}</p>)}
            </div>
          </div>
          )}
        </div>

        <div className="case-section-label"><span>02. 아키텍처</span></div>
        <div className="case-diagram reveal"><CaseDiagram /></div>
        <div className="case-fig">수신 게이트웨이 1대(처리 겸)가 메타데이터를 큐에 적재 → 8개 워커가 <code>SKIP LOCKED</code>로 직접 선점. 분배자(dispatcher) 없음.</div>

        <div className="case-section-label"><span>03. 핵심 구현</span></div>
        <div className="case-code reveal">
          <div className="cbar">JobQueueMapper.xml · Oracle · MyBatis · 설명용으로 다시 쓴 코드</div>
          <pre>{CASE_SQL}</pre>
        </div>
        <div className="case-code reveal">
          <div className="cbar">JobWorker.java · 짧은 claim 트랜잭션 · 설명용으로 다시 쓴 코드</div>
          <pre>{CASE_JAVA}</pre>
        </div>
        <p className="case-note-inline">* 위 두 스니펫은 실제 납품 소스가 아니라 핵심 흐름(선점 → 상태 전이 → 커밋)을 보이려고 다시 쓴 코드. 상태는 코드값으로 운영되며 named 파라미터로 주입함. 한 번에 몇 건을 집을지 제한하는 구문은 흐름을 가리지 않도록 뺐음.</p>

        <div className="case-section-label"><span>04. 설계 노트 · 실패 모드</span></div>
        <div className="case-qa-grid">
          {CASE_QA.map((q, i) =>
          <div className="case-qa reveal" key={i}>
            <div className="q"><span className="qm">Q</span><span>{q.q}</span></div>
            <p className="a">{renderRichText(q.a)}</p>
          </div>
          )}
        </div>
      </div>
    </section>);
}

// ============ AI HARNESS ============
const HXM = "'Geist Mono', 'JetBrains Mono', ui-monospace, monospace";

/* 색 6값 · 텍스트는 잉크/뮤트 2단, 3차 위계는 크기와 자간이 진다 */
const HX_INK = '#111';               // 17.32:1
const HX_MUTE = '#6a6a6a';           //  4.96:1  사이트 --mute와 동일
const HX_AC = '#d94f1f';             //  3.79:1  강조 활자 · 강조 선
const HX_LINE = '#8a8a8a';           //  3.17:1  중립 연결선 · 마커 · 보조 stroke
const HX_RULE = 'rgba(0,0,0,0.12)';  //          프레임 룰 전용
const HX_ACS = '#f5dccf';            //          도형 채움

/* 활자 4단 · 비율 1.30 / 2.00 / 1.69 (max-width 1104px 기준 11.5 / 15 / 30 / 51px) */
const HX_FS_MICRO = 10;
const HX_FS_LABEL = 13;
const HX_FS_NUM = 26;
const HX_FS_HERO = 44;

function HxArrows({ id }) {
  return (
    <defs>
      <marker id={id + 'g'} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={HX_LINE} /></marker>
      <marker id={id + 'a'} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={HX_AC} /></marker>
    </defs>);
}

/* 게이트: 판정 원장 32건이 좌에서 우로 기준 5종의 문을 지나 1건만 통과 */
function HxGateDiagram() {
  const CRIT = [
    ['① 표본 100건', '검증 구간 20건 이상'],
    ['② 기대값 > 비용 컷', '레그별 실차감 × 2'],
    ['③ 켈리 > 0 · 샤프 하한', '검증 구간 · 연환산'],
    ['④ 다국면', '추세 · 횡보 · 고변동'],
    ['⑤ 모집단 대비 초과분', '절대수익으로 판정하지 않음'],
  ];
  const GATE_X = [542, 598, 654, 710, 766];
  return (
    <svg viewBox="0 46 960 266" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="판정 원장 32건이 통과 기준 5종을 지나 1건만 통과하고 31건은 미통과한 구조">
      <HxArrows id="hxg" />

      <text x="24" y="64" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE} letterSpacing="0.1em">판정 원장 32건</text>
      <text x="654" y="64" textAnchor="middle" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE} letterSpacing="0.1em">GATE · 통과 기준 5종</text>
      <text x="936" y="64" textAnchor="end" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE} letterSpacing="0.1em">결과</text>

      {/* 한 칸 = 한 건. 16열 × 2행 = 32 */}
      {Array.from({ length: 32 }, (_, i) =>
      <rect key={i} x={24 + (i % 16) * 26} y={97 + Math.floor(i / 16) * 26} width="18" height="18" rx="2" fill={HX_ACS} />
      )}
      <text x="24" y="180" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE}>상향식 가설 20건은 게이트 전 필터 · 적대적 검증에서 탈락</text>

      <line x1="478" y1="119" x2="526" y2="119" stroke={HX_LINE} strokeWidth="1.2" markerEnd="url(#hxgg)" />

      {GATE_X.map((x, i) =>
      <g key={i}>
        <line x1={x} y1="78" x2={x} y2="160" stroke={HX_LINE} strokeWidth="1.5" />
        <text x={x} y="180" textAnchor="middle" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE}>{'①②③④⑤'[i]}</text>
      </g>
      )}

      <line x1="790" y1="119" x2="838" y2="119" stroke={HX_AC} strokeWidth="1.4" markerEnd="url(#hxga)" />

      <text x="936" y="96" textAnchor="end" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE}>통과</text>
      <rect x="880" y="121" width="18" height="18" rx="2" fill={HX_AC} />
      <text x="936" y="152" textAnchor="end" fontFamily={HXM} fontSize={HX_FS_HERO} fill={HX_AC}>1</text>

      <text x="936" y="190" textAnchor="end" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE}>미통과</text>
      <text x="936" y="220" textAnchor="end" fontFamily={HXM} fontSize={HX_FS_NUM} fill={HX_MUTE}>31</text>

      <line x1="24" y1="250" x2="936" y2="250" stroke={HX_RULE} strokeWidth="1" />
      {CRIT.map((c, i) =>
      <g key={i}>
        <text x={24 + i * 185} y="280" fontFamily={HXM} fontSize={HX_FS_LABEL} fill={i === 4 ? HX_AC : HX_INK}>{c[0]}</text>
        <text x={24 + i * 185} y="300" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE}>{c[1]}</text>
      </g>
      )}
    </svg>);
}

/* 신뢰 경계(discovery 경로): Fable 부재 세션의 대리 손절이 LLM 띠를 비껴 규칙 띠로 직행 */
function HxTrustDiagram() {
  const GUARD = ['선기록 검증', '비중 재캡', '수량 산출', '총노출 · 진입 상한', '저널 선기록'];
  return (
    <svg viewBox="0 23 960 315" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="LLM 계층은 제안까지, 규칙 계층이 집행을 단독으로 맡는 2계층 구조. Fable 부재 세션의 대리 손절은 LLM을 거치지 않음">
      <HxArrows id="hxt" />

      <text x="24" y="44" fontFamily={HXM} fontSize={HX_FS_LABEL} fill={HX_AC}>대리 손절</text>
      <text x="24" y="60" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE}>Fable 부재 세션</text>
      <text x="24" y="74" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE}>선기록 기준</text>
      <path d="M72,84 L72,196 L112,196" fill="none" stroke={HX_AC} strokeWidth="1.3" markerEnd="url(#hxta)" />

      <rect x="120" y="48" width="816" height="92" rx="6" fill="#ffffff" stroke={HX_RULE} strokeWidth="1" strokeDasharray="5 4" />
      <text x="136" y="70" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE} letterSpacing="0.1em">LLM 계층 · 제안까지</text>
      {[['DART · 뉴스 · 수급', 136, 230, false], ['Sonnet 정제', 400, 190, false], ['Fable 판단', 622, 190, true]].map((c, i) =>
      <g key={i}>
        <rect x={c[1]} y="88" width={c[2]} height="34" rx="3" fill={c[3] ? HX_ACS : '#f7f6f3'} stroke={c[3] ? HX_AC : HX_LINE} strokeWidth="1" />
        <text x={c[1] + c[2] / 2} y="110" textAnchor="middle" fontFamily={HXM} fontSize={HX_FS_LABEL} fill={HX_INK}>{c[0]}</text>
      </g>
      )}
      <line x1="370" y1="105" x2="394" y2="105" stroke={HX_LINE} strokeWidth="1.2" markerEnd="url(#hxtg)" />
      <line x1="594" y1="105" x2="618" y2="105" stroke={HX_LINE} strokeWidth="1.2" markerEnd="url(#hxtg)" />
      <text x="822" y="110" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE}>스키마 위반 → 관망</text>

      <line x1="717" y1="140" x2="717" y2="180" stroke={HX_AC} strokeWidth="1.3" markerEnd="url(#hxta)" />
      <text x="730" y="166" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_AC}>제안: 매수 · 매도 · 비중 · 손절 기준</text>

      <rect x="120" y="184" width="816" height="96" rx="6" fill={HX_ACS} fillOpacity="0.4" stroke={HX_AC} strokeWidth="1" />
      <text x="136" y="206" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_AC} letterSpacing="0.1em">규칙 계층 (risk guard) · 집행 단독</text>
      {GUARD.map((g, i) =>
      <g key={i}>
        <rect x={136 + i * 159} width="149" y="222" height="34" rx="3" fill="#ffffff" stroke={HX_LINE} strokeWidth="1" />
        <text x={136 + i * 159 + 74} y="244" textAnchor="middle" fontFamily={HXM} fontSize={HX_FS_LABEL} fill={HX_INK}>{g}</text>
      </g>
      )}

      <line x1="528" y1="280" x2="528" y2="304" stroke={HX_LINE} strokeWidth="1.2" markerEnd="url(#hxtg)" />
      <text x="528" y="326" textAnchor="middle" fontFamily={HXM} fontSize={HX_FS_LABEL} fill={HX_MUTE}>주문 실행 (KIS OpenAPI)</text>
      <text x="936" y="326" textAnchor="end" fontFamily={HXM} fontSize={HX_FS_LABEL} fill={HX_AC}>우회 경로 자체가 없는 구조</text>
    </svg>);
}

/* 03 · 에이전트 교차 감사: 53 도트 + 7 윤곽원, 브래킷으로 수렴 */
function HxAgentFanDiagram() {
  return (
    <svg viewBox="0 26 960 393" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="판정 1건에 검증 에이전트 53개와 독립 감사 7개를 투입해 치명 결함 0으로 수렴">
      <HxArrows id="hxf" />
      <text x="24" y="44" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE} letterSpacing="0.1em">판정 1건 (셋업 승격) · 사람은 기준만 정하고 판정은 위임</text>

      <text x="24" y="112" fontFamily={HXM} fontSize={HX_FS_HERO} fill={HX_INK}>53</text>
      <text x="24" y="140" fontFamily={HXM} fontSize={HX_FS_LABEL} fill={HX_MUTE}>검증 에이전트 · 병렬 스폰</text>
      {Array.from({ length: 53 }, (_, i) => {
        const row = i < 18 ? 0 : i < 36 ? 1 : 2;
        const col = i < 18 ? i : i < 36 ? i - 18 : i - 36;
        return <circle key={i} cx={32 + col * 26} cy={172 + row * 26} r="6" fill={HX_AC} fillOpacity="0.72" />;
      })}

      <text x="600" y="112" fontFamily={HXM} fontSize={HX_FS_HERO} fill={HX_AC}>7</text>
      <text x="600" y="140" fontFamily={HXM} fontSize={HX_FS_LABEL} fill={HX_MUTE}>독립 감사 · 검증과 분리 스폰</text>
      {Array.from({ length: 7 }, (_, i) =>
      <circle key={i} cx={610 + i * 34} cy="176" r="10" fill="none" stroke={HX_AC} strokeWidth="1.6" />
      )}

      <line x1="253" y1="244" x2="253" y2="288" stroke={HX_LINE} strokeWidth="1" />
      <line x1="712" y1="244" x2="712" y2="288" stroke={HX_LINE} strokeWidth="1" />
      <line x1="253" y1="288" x2="712" y2="288" stroke={HX_LINE} strokeWidth="1" />
      <line x1="482" y1="288" x2="482" y2="308" stroke={HX_AC} strokeWidth="1.3" markerEnd="url(#hxfa)" />

      <text x="482" y="330" textAnchor="middle" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE} letterSpacing="0.1em">치명 결함</text>
      <text x="482" y="364" textAnchor="middle" fontFamily={HXM} fontSize={HX_FS_NUM} fill={HX_AC}>0</text>

      <line x1="24" y1="386" x2="936" y2="386" stroke={HX_RULE} strokeWidth="1" />
      <text x="936" y="408" textAnchor="end" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE}>통과 선언이 아니라 반증 시도의 결과</text>
    </svg>);
}

/* 04 · 병목 이동: 서수 삭제, 위계 역전 해소 */
function HxBottleneckDiagram() {
  const S = [
    { at: '코드', sym: '처리량 · 결함', fix: 'hook 게이트', how: '편집마다 ruff + pytest' },
    { at: '사람', sym: '세부 판단 승인', fix: '에이전트 교차 검증 위임', how: '검증 53 + 독립 감사 7' },
    { at: '토큰', sym: '주간 예산 소진', fix: 'Skill화', how: '반복 기준 패키징' },
    { at: '인지', sym: '세션 분산', fix: '모니터링 2화면', how: '작업판 · 운영판' },
  ];
  return (
    <svg viewBox="0 54 960 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="병목이 코드 사람 토큰 인지로 옮겨간 4단계와 각 단계의 해법">
      <HxArrows id="hxb" />
      {S.map((s, i) => {
        const x = 24 + i * 238;
        return (
          <g key={i}>
            <text x={x} y="88" fontFamily={HXM} fontSize={HX_FS_NUM} fill={HX_INK}>{s.at}</text>
            <text x={x} y="110" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE}>{s.sym}</text>
            <line x1={x} y1="132" x2={x + 200} y2="132" stroke={HX_RULE} strokeWidth="1" />
            <text x={x} y="160" fontFamily={HXM} fontSize={HX_FS_LABEL} fill={HX_AC}>{s.fix}</text>
            <text x={x} y="180" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE}>{s.how}</text>
            {i < 3 && <line x1={x + 208} y1="80" x2={x + 230} y2="80" stroke={HX_AC} strokeWidth="1.3" markerEnd="url(#hxba)" />}
          </g>);
      })}
      <line x1="24" y1="220" x2="936" y2="220" stroke={HX_RULE} strokeWidth="1" />
      <text x="24" y="252" fontFamily={HXM} fontSize={HX_FS_LABEL} fill={HX_MUTE}>해법은 더 빨리 만드는 것이 아니라 문제를 다시 정의하고 층위를 다시 긋는 것</text>
      <text x="936" y="252" textAnchor="end" fontFamily={HXM} fontSize={HX_FS_LABEL} fill={HX_AC}>구현 → 문제 정의 · 설계</text>
    </svg>);
}

/* 05 · 3팀 16역할: 팀명·수·단위를 한 락업으로 묶고 룰을 팀 규모 비례 막대로 */
function HxAgentTeamDiagram() {
  const T = [{ x: 24, name: '기획팀', n: 5 }, { x: 340, name: '개발팀', n: 6 }, { x: 656, name: 'QA팀', n: 5 }];
  return (
    <svg viewBox="0 32 960 272" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="기획 개발 QA 3팀 16역할 에이전트 팀과 파일 기반 핸드오프">
      <HxArrows id="hxk" />
      {T.map((t, ti) =>
      <g key={ti}>
        <text x={t.x} y="66" fontFamily={HXM} fontSize={HX_FS_LABEL} fill={HX_INK}>
          {t.name}
          <tspan dx="10" fontSize={HX_FS_NUM} fill={HX_AC}>{t.n}</tspan>
          <tspan dx="4" fontSize={HX_FS_MICRO} fill={HX_MUTE}>역할</tspan>
        </text>
        {Array.from({ length: t.n }, (_, i) =>
        <rect key={i} x={t.x + i * 34} y="96" width="26" height="26" rx="3" fill="#f7f6f3" stroke={HX_LINE} strokeWidth="1" />
        )}
        <line x1={t.x} y1="140" x2={t.x + t.n * 34 - 8} y2="140" stroke={HX_RULE} strokeWidth="1" />
      </g>
      )}
      <line x1="308" y1="108" x2="334" y2="108" stroke={HX_AC} strokeWidth="1.3" markerEnd="url(#hxka)" />
      <text x="321" y="98" textAnchor="middle" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_AC}>PLAN</text>
      <line x1="624" y1="108" x2="650" y2="108" stroke={HX_AC} strokeWidth="1.3" markerEnd="url(#hxka)" />
      <text x="637" y="98" textAnchor="middle" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_AC}>코드</text>

      <path d="M796,148 L796,186 L480,186 L480,150" fill="none" stroke={HX_LINE} strokeWidth="1.2" markerEnd="url(#hxkg)" />
      <text x="638" y="206" textAnchor="middle" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE}>QA-REPORT · ISSUES → FIX-REPORT</text>

      <line x1="24" y1="236" x2="936" y2="236" stroke={HX_RULE} strokeWidth="1" />
      <text x="24" y="264" fontFamily={HXM} fontSize={HX_FS_LABEL} fill={HX_MUTE}>팀 간 인계는 전부 파일. 세션이 끊겨도 다음 팀이 같은 입력에서 다시 시작</text>
      <text x="24" y="292" fontFamily={HXM} fontSize={HX_FS_LABEL} fill={HX_AC}>커스텀 스킬 9종 · 훅 3종 · MCP 4종 · 최대 105 에이전트 적대적 검증</text>
    </svg>);
}

/* 07 · 커머스 경계: 위는 실제 운영 경로, 아래는 에이전트가 도는 로컬 검증 경로. 두 줄 사이 화살표 0개가 메시지 */
function HxBiArrows({ id }) {
  return (
    <defs>
      <marker id={id + 'g'} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto-start-reverse"><path d="M0,0 L6,3 L0,6 Z" fill={HX_LINE} /></marker>
      <marker id={id + 'a'} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto-start-reverse"><path d="M0,0 L6,3 L0,6 Z" fill={HX_AC} /></marker>
    </defs>);
}

function HxBox({ x, y, w, h, lines, ac, dash, sub }) {
  const cy = y + h / 2 + 4.5 - (lines.length - 1) * 8 - (sub ? 6 : 0);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="3" fill={ac ? HX_ACS : dash ? '#ffffff' : '#f7f6f3'} stroke={ac ? HX_AC : HX_LINE} strokeWidth="1" strokeDasharray={dash ? '5 4' : undefined} />
      {lines.map((l, i) => <text key={i} x={x + w / 2} y={cy + i * 16} textAnchor="middle" fontFamily={HXM} fontSize={HX_FS_LABEL} fill={HX_INK}>{l}</text>)}
      {sub && <text x={x + w / 2} y={cy + lines.length * 16 - 2} textAnchor="middle" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE}>{sub}</text>}
    </g>);
}

const HX_COMMERCE_ARIA = '운영 중인 커머스의 실제 경로(고객, 테마, 고객 계정 확장 앱, 주문 취소 백엔드, Shopify, 결제 대행, 3PL)와 에이전트가 도는 로컬 검증 경로(쓰기 차단 브라우저, 개발 테마, 계약 대조, 로컬 백엔드, Shopify 스텁) 사이를 쓰기 차단, 스텁 인증서, 카나리로 끊은 구조';
const HX_COMMERCE_MARKS = [
  ['ⓐ', '쓰기 차단: 결제 경로 · 결제 도메인 · 장바구니 외 쓰기 거부'],
  ['ⓑ', '계약 양쪽 대조 · 변이 트리로 검사기 확인'],
  ['ⓒ', '스텁 인증서만 신뢰 · 스텁 기록 없으면 요청 미발신'],
];

function HxCommerceWide() {
  const g = 'url(#hxcg)', a = 'url(#hxca)';
  return (
    <svg className="hx-wide" viewBox="0 20 960 326" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={HX_COMMERCE_ARIA}>
      <HxBiArrows id="hxc" />

      {/* 운영 경로 */}
      <rect x="24" y="30" width="680" height="118" rx="6" fill="#ffffff" stroke={HX_RULE} strokeWidth="1" />
      <text x="40" y="48" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE} letterSpacing="0.1em">운영 경로 · 실제</text>
      <HxBox x={40} y={70} w={56} h={60} lines={['고객']} />
      <HxBox x={126} y={60} w={150} h={30} lines={['스토어프론트 테마']} />
      <HxBox x={126} y={100} w={150} h={40} lines={['고객 계정 확장 앱']} sub="'주문 취소' 메뉴" />
      <HxBox x={336} y={103} w={140} h={34} lines={['주문 취소 백엔드']} />
      <HxBox x={566} y={60} w={120} h={80} lines={['Shopify']} />
      <line x1="96" y1="90" x2="122" y2="77" stroke={HX_LINE} strokeWidth="1.2" markerEnd={g} />
      <line x1="96" y1="110" x2="122" y2="118" stroke={HX_LINE} strokeWidth="1.2" markerEnd={g} />
      <line x1="276" y1="120" x2="332" y2="120" stroke={HX_LINE} strokeWidth="1.2" markerEnd={g} />
      <text x="305" y="112" textAnchor="middle" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE}>취소 요청</text>
      <line x1="476" y1="120" x2="562" y2="120" stroke={HX_LINE} strokeWidth="1.2" markerEnd={g} />
      <text x="521" y="112" textAnchor="middle" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE}>주문 조회 · 취소</text>

      {/* 외부: 진실을 쥔 쪽 */}
      <rect x="716" y="30" width="220" height="118" rx="6" fill="#ffffff" stroke={HX_RULE} strokeWidth="1" />
      <text x="732" y="48" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE} letterSpacing="0.1em">외부 · 진실을 쥔 쪽</text>
      <rect x="732" y="58" width="188" height="28" rx="3" fill="#ffffff" stroke={HX_LINE} strokeDasharray="5 4" />
      <text x="744" y="77" fontFamily={HXM} fontSize={HX_FS_LABEL} fill={HX_INK}>결제 대행 (MoR)</text>
      <text x="910" y="76" textAnchor="end" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE}>결제 상태</text>
      <rect x="732" y="96" width="188" height="28" rx="3" fill="#ffffff" stroke={HX_LINE} strokeDasharray="5 4" />
      <text x="744" y="115" fontFamily={HXM} fontSize={HX_FS_LABEL} fill={HX_INK}>3PL</text>
      <text x="910" y="114" textAnchor="end" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE}>주문 수집</text>
      <line x1="690" y1="72" x2="728" y2="72" stroke={HX_LINE} strokeWidth="1.2" markerStart={g} markerEnd={g} />
      <line x1="688" y1="110" x2="728" y2="110" stroke={HX_LINE} strokeWidth="1.2" markerEnd={g} />
      <text x="732" y="140" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE}>우리 시스템은 Shopify에 비친 상태만 봄</text>

      {/* 경계: 자동화는 이 선을 넘지 못함 */}
      <text x="936" y="163" textAnchor="end" fontFamily={HXM} fontSize={HX_FS_LABEL} fill={HX_AC}>자동화는 이 선을 넘지 못함</text>
      <line x1="24" y1="170" x2="936" y2="170" stroke={HX_AC} strokeWidth="2" />
      {[201, 306, 626].map((x, i) =>
      <g key={i}>
        <circle cx={x} cy="170" r="9" fill="#ffffff" stroke={HX_AC} strokeWidth="1.5" />
        <text x={x} y="174" textAnchor="middle" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_AC}>{'abc'[i]}</text>
      </g>
      )}
      {HX_COMMERCE_MARKS.map((m, i) =>
      <text key={i} x={[40, 384, 660][i]} y="194" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE}><tspan fill={HX_AC}>{m[0]}</tspan> {m[1]}</text>
      )}

      {/* 검증 경로 · 로컬 (에이전트) */}
      <rect x="24" y="206" width="912" height="104" rx="6" fill={HX_ACS} fillOpacity="0.4" stroke={HX_AC} strokeWidth="1" />
      <text x="40" y="226" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_AC} letterSpacing="0.1em">검증 경로 · 로컬 (에이전트)</text>
      <HxBox x={40} y={240} w={96} h={42} lines={['쓰기 차단', '브라우저']} ac />
      <HxBox x={176} y={240} w={84} h={42} lines={['개발 테마']} dash />
      <HxBox x={330} y={240} w={128} h={42} lines={['오프라인', '컴포넌트 테스트']} dash />
      <HxBox x={506} y={240} w={84} h={42} lines={['계약 대조']} ac />
      <HxBox x={646} y={240} w={96} h={42} lines={['로컬 백엔드']} dash />
      <HxBox x={798} y={240} w={122} h={42} lines={['Shopify 스텁']} ac />
      <line x1="136" y1="261" x2="172" y2="261" stroke={HX_AC} strokeWidth="1.3" markerEnd={a} />
      <line x1="462" y1="261" x2="502" y2="261" stroke={HX_AC} strokeWidth="1.3" markerStart={a} markerEnd={a} />
      <line x1="594" y1="261" x2="642" y2="261" stroke={HX_AC} strokeWidth="1.3" markerStart={a} markerEnd={a} />
      <line x1="742" y1="261" x2="794" y2="261" stroke={HX_AC} strokeWidth="1.3" markerEnd={a} />
      <line x1="859" y1="304" x2="859" y2="286" stroke={HX_AC} strokeWidth="1.3" markerEnd={a} />
      <text x="850" y="302" textAnchor="end" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_AC}>카나리 먼저</text>

      <text x="936" y="336" textAnchor="end" fontFamily={HXM} fontSize={HX_FS_LABEL} fill={HX_AC}>지시문이 아니라 구조로 끊은 경계</text>
    </svg>);
}

/* 좁은 화면: 같은 구조를 세로로 쌓음 (가로판을 축소하면 글자가 읽히지 않음) */
function HxCommerceNarrow() {
  const g = 'url(#hxcng)', a = 'url(#hxcna)';
  const down = (x, y1, y2, ac, bi) => <line x1={x} y1={y1} x2={x} y2={y2} stroke={ac ? HX_AC : HX_LINE} strokeWidth="1.2" markerStart={bi ? (ac ? a : g) : undefined} markerEnd={ac ? a : g} />;
  return (
    <svg className="hx-narrow" viewBox="0 0 360 640" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={HX_COMMERCE_ARIA}>
      <HxBiArrows id="hxcn" />
      <rect x="4" y="4" width="352" height="268" rx="6" fill="#ffffff" stroke={HX_RULE} strokeWidth="1" />
      <text x="16" y="22" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE} letterSpacing="0.1em">운영 경로 · 실제</text>
      <HxBox x={130} y={32} w={100} h={28} lines={['고객']} />
      {down(150, 60, 76)}{down(210, 60, 76)}
      <HxBox x={16} y={80} w={158} h={30} lines={['스토어프론트 테마']} />
      <HxBox x={186} y={80} w={158} h={40} lines={['고객 계정 확장 앱']} sub="'주문 취소' 메뉴" />
      {down(265, 120, 140)}
      <text x="275" y="134" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE}>취소 요청</text>
      <HxBox x={186} y={144} w={158} h={30} lines={['주문 취소 백엔드']} />
      {down(265, 174, 192)}
      <text x="275" y="187" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE}>주문 조회 · 취소</text>
      <HxBox x={186} y={196} w={158} h={30} lines={['Shopify']} />
      <line x1="184" y1="211" x2="146" y2="211" stroke={HX_LINE} strokeWidth="1.2" markerStart={g} markerEnd={g} />
      <rect x="16" y="196" width="126" height="30" rx="3" fill="#ffffff" stroke={HX_LINE} strokeDasharray="5 4" />
      <text x="79" y="215" textAnchor="middle" fontFamily={HXM} fontSize={HX_FS_LABEL} fill={HX_INK}>결제 대행 · 3PL</text>
      <text x="16" y="246" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE}>외부가 결제 · 출고의 진실을 쥠.</text>
      <text x="16" y="261" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE}>우리 시스템은 Shopify에 비친 상태만 봄</text>

      <text x="356" y="294" textAnchor="end" fontFamily={HXM} fontSize={HX_FS_LABEL} fill={HX_AC}>자동화는 이 선을 넘지 못함</text>
      <line x1="4" y1="302" x2="356" y2="302" stroke={HX_AC} strokeWidth="2" />
      {HX_COMMERCE_MARKS.map((m, i) =>
      <text key={i} x="4" y={322 + i * 16} fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE}><tspan fill={HX_AC}>{m[0]}</tspan> {m[1]}</text>
      )}

      <rect x="4" y="368" width="352" height="234" rx="6" fill={HX_ACS} fillOpacity="0.4" stroke={HX_AC} strokeWidth="1" />
      <text x="16" y="388" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_AC} letterSpacing="0.1em">검증 경로 · 로컬 (에이전트)</text>
      <HxBox x={16} y={398} w={150} h={30} lines={['쓰기 차단 브라우저']} ac />
      <line x1="166" y1="413" x2="190" y2="413" stroke={HX_AC} strokeWidth="1.3" markerEnd={a} />
      <HxBox x={194} y={398} w={150} h={30} lines={['개발 테마']} dash />
      <HxBox x={16} y={446} w={150} h={42} lines={['오프라인', '컴포넌트 테스트']} dash />
      <line x1="166" y1="467" x2="190" y2="467" stroke={HX_AC} strokeWidth="1.3" markerStart={a} markerEnd={a} />
      <HxBox x={194} y={452} w={150} h={30} lines={['계약 대조']} ac />
      {down(269, 484, 500, true, true)}
      <HxBox x={194} y={504} w={150} h={30} lines={['로컬 백엔드']} dash />
      {down(269, 534, 552, true)}
      <HxBox x={194} y={556} w={150} h={30} lines={['Shopify 스텁']} ac />
      <line x1="150" y1="571" x2="190" y2="571" stroke={HX_AC} strokeWidth="1.3" markerEnd={a} />
      <text x="140" y="575" textAnchor="end" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_AC}>카나리 먼저</text>

      <text x="356" y="626" textAnchor="end" fontFamily={HXM} fontSize={HX_FS_LABEL} fill={HX_AC}>지시문이 아니라 구조로 끊은 경계</text>
    </svg>);
}

/* 07 · 9단계 흐름: 위 띠는 에이전트가 넓히고, 아래 띠는 사람이 좁힘. 8 · 9는 게이트 준비까지라 흐리게 */
const HX_FLOW9 = [
  { n: '01', name: ['분석'], ag: ['레포별 구조', '결함 후보'], hu: ['아직', '고치지 않음'] },
  { n: '02', name: ['역방향', 'SDD'], ag: ['코드에서', '스펙 추출'], hu: ['형식 · 빈틈', '판단'] },
  { n: '03', name: ['질문', '분류'], ag: ['문서 · 코드로', '재판정'], hu: ['관리 화면', '확인 · 결정'] },
  { n: '04', name: ['계약 우선', '루프'], ag: ['스텁 · 계약', '변이 트리'], hu: ['스텁만', '실취소 금지'], hot: true },
  { n: '05', name: ['독립', '시나리오'], ag: ['입력 조사', '판정기'], hu: ['범위 축소', '정책'], hot: true },
  { n: '06', name: ['설계 검증', '1회'], ag: ['관점별 판정', '다른 모델 반증'], hu: ['추천안 결정', '재검증 안 함'], hot: true },
  { n: '07', name: ['실험', '구현'], ag: ['단계별 구현', '테스트'], hu: ['브랜치 · 조건', '승인'] },
  { n: '08', name: ['PR 전', '검증'], ag: ['게이트 준비'], hu: ['실행 시점'], dim: true },
  { n: '09', name: ['승인', 'PR'], ag: ['브랜치 · PR', '준비'], hu: ['push · merge', '승인'], dim: true },
];
const HX_FLOW9_ARIA = '분석부터 승인 PR까지 9단계에서 에이전트가 한 일과 사람이 정한 일을 나눈 흐름. 4 · 5단계는 6 · 7단계와 겹쳐 돌고, 8 · 9단계는 게이트 준비까지';

function HxLines({ x, y, lines, size, fill, gap = 14 }) {
  return lines.map((l, i) => <text key={i} x={x} y={y + i * gap} textAnchor="middle" fontFamily={HXM} fontSize={size} fill={fill}>{l}</text>);
}

function HxFlow9Wide() {
  const X0 = 132, ST = 89.5, W = 78;
  const cx = (i) => X0 + i * ST + W / 2;
  return (
    <svg className="hx-wide" viewBox="0 14 960 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={HX_FLOW9_ARIA}>
      <HxArrows id="hxf9" />
      <rect x="16" y="100" width="920" height="46" rx="6" fill="#ffffff" stroke={HX_RULE} strokeWidth="1" strokeDasharray="5 4" />
      <text x="24" y="120" fontFamily={HXM} fontSize={HX_FS_LABEL} fill={HX_INK}>에이전트</text>
      <text x="24" y="136" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE}>넓힘</text>
      <rect x="16" y="166" width="920" height="46" rx="6" fill={HX_ACS} fillOpacity="0.4" stroke={HX_AC} strokeWidth="1" />
      <text x="24" y="186" fontFamily={HXM} fontSize={HX_FS_LABEL} fill={HX_AC}>사람</text>
      <text x="24" y="202" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_AC}>좁힘</text>
      <path d={`M${cx(4)},40 C${cx(4)},22 ${cx(3)},22 ${cx(3)},38`} fill="none" stroke={HX_AC} strokeWidth="1" markerEnd="url(#hxf9a)" />
      {HX_FLOW9.map((s, i) => {
        const x = X0 + i * ST, mute = s.dim ? HX_MUTE : HX_INK;
        return (
          <g key={i} opacity={s.dim ? 0.55 : 1}>
            <rect x={x} y="42" width={W} height="46" rx="3" fill={s.hot ? HX_ACS : '#f7f6f3'} stroke={s.hot ? HX_AC : HX_LINE} strokeWidth="1" strokeDasharray={s.dim ? '4 3' : undefined} />
            <text x={x + 6} y="54" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_AC}>{s.n}</text>
            <HxLines x={x + W / 2} y={s.name.length > 1 ? 66 : 72} lines={s.name} size={HX_FS_LABEL} fill={mute} gap={15} />
            <HxLines x={x + W / 2} y={s.ag.length > 1 ? 120 : 127} lines={s.ag} size={HX_FS_MICRO} fill={HX_MUTE} />
            <HxLines x={x + W / 2} y={s.hu.length > 1 ? 188 : 195} lines={s.hu} size={HX_FS_MICRO} fill={s.dim ? HX_MUTE : HX_INK} />
            {i < 8 && <line x1={x + W + 1} y1="65" x2={x + ST - 3} y2="65" stroke={HX_LINE} strokeWidth="1.2" markerEnd="url(#hxf9g)" />}
          </g>);
      })}


      <text x={(cx(7) + cx(8)) / 2} y="230" textAnchor="middle" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE}>준비까지 · 팀 반영 전</text>
      <text x={(cx(3) + cx(4)) / 2} y="230" textAnchor="middle" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_AC}>4 · 5는 6 · 7과 겹쳐 돎</text>
      <text x="936" y="256" textAnchor="end" fontFamily={HXM} fontSize={HX_FS_LABEL} fill={HX_AC}>사람은 메인 세션 하나와만 대화</text>
    </svg>);
}

function HxFlow9Narrow() {
  const Y0 = 52, ST = 50;
  return (
    <svg className="hx-narrow" viewBox="0 0 360 540" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={HX_FLOW9_ARIA}>
      <HxArrows id="hxf9n" />
      <text x="170" y="34" textAnchor="middle" fontFamily={HXM} fontSize={HX_FS_LABEL} fill={HX_INK}>에이전트 · 넓힘</text>
      <text x="296" y="34" textAnchor="middle" fontFamily={HXM} fontSize={HX_FS_LABEL} fill={HX_AC}>사람 · 좁힘</text>
      <rect x="236" y="42" width="120" height={9 * ST + 4} rx="6" fill={HX_ACS} fillOpacity="0.4" stroke={HX_AC} strokeWidth="1" />
      {HX_FLOW9.map((s, i) => {
        const y = Y0 + i * ST;
        return (
          <g key={i} opacity={s.dim ? 0.55 : 1}>
            <rect x="4" y={y} width="98" height="42" rx="3" fill={s.hot ? HX_ACS : '#f7f6f3'} stroke={s.hot ? HX_AC : HX_LINE} strokeWidth="1" strokeDasharray={s.dim ? '4 3' : undefined} />
            <text x="10" y={y + 14} fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_AC}>{s.n}</text>
            <HxLines x={60} y={s.name.length > 1 ? y + 18 : y + 26} lines={s.name} size={12} fill={s.dim ? HX_MUTE : HX_INK} gap={15} />
            <HxLines x={170} y={s.ag.length > 1 ? y + 17 : y + 25} lines={s.ag} size={HX_FS_MICRO} fill={HX_MUTE} />
            <HxLines x={296} y={s.hu.length > 1 ? y + 17 : y + 25} lines={s.hu} size={HX_FS_MICRO} fill={s.dim ? HX_MUTE : HX_INK} />
            {i < 8 && <line x1="53" y1={y + 43} x2="53" y2={y + ST - 2} stroke={HX_LINE} strokeWidth="1.2" markerEnd="url(#hxf9ng)" />}
          </g>);
      })}
      <text x="4" y="518" fontFamily={HXM} fontSize={HX_FS_MICRO} fill={HX_MUTE}>4 · 5는 6 · 7과 겹쳐 돎 · 8 · 9는 준비까지</text>
      <text x="356" y="536" textAnchor="end" fontFamily={HXM} fontSize={HX_FS_LABEL} fill={HX_AC}>사람은 메인 세션 하나와만 대화</text>
    </svg>);
}

function HxFlow9Diagram() {
  return <React.Fragment><HxFlow9Wide /><HxFlow9Narrow /></React.Fragment>;
}

function HxCommerceDiagram() {
  return <React.Fragment><HxCommerceWide /><HxCommerceNarrow /></React.Fragment>;
}

const HARNESS_FIGS = { trust: HxTrustDiagram, gate: HxGateDiagram, bottleneck: HxBottleneckDiagram, agentfan: HxAgentFanDiagram, agentteam: HxAgentTeamDiagram, commerce: HxCommerceDiagram, flow9: HxFlow9Diagram };

/* 06 AI HARNESS · 07 AI PROJECTS 공용 딥다이브 본문: projects[] + note */
function HarnessDeepDive({ data: H }) {
  return (
    <React.Fragment>
      {H.intro && <p className="case-lead hx-page-lead reveal">{renderRichText(H.intro)}</p>}
      {H.projects.map((p, pi) =>
      <div key={pi} className={pi > 0 ? 'harness-project sep' : 'harness-project'}>
        <div className="case-intro reveal">
          <div className="case-cat">{p.cat}</div>
          <h3>{p.headline.split('\n').map((l, i) =>
            <React.Fragment key={i}>{i > 0 && <br />}{l}</React.Fragment>)}</h3>
          <p className="case-lead">{renderRichText(p.lead)}</p>
          <div className="case-meta">
            {p.meta.map((m, i) =>
            <div key={i}><span className="k">{m.k}</span><span className="v">{m.v}</span></div>
            )}
          </div>
        </div>

        {p.blocks.map((b, bi) =>
        <React.Fragment key={bi}>
          <div className="case-section-label"><span>{b.label}</span></div>
          {b.diagram && HARNESS_FIGS[b.diagram] &&
          <React.Fragment>
            <div className="hx-fig reveal">{React.createElement(HARNESS_FIGS[b.diagram])}</div>
            {b.fig && <div className="case-fig">{renderRichText(b.fig)}</div>}
          </React.Fragment>
          }
          {b.type === 'beats' &&
          <div className="case-trace">
            {b.items.map((x, i) =>
            <div className="case-beat reveal" key={i}>
              <div className="bn">{x.n}</div>
              <div className="bbody">
                <h4>{x.t}</h4>
                {x.body.map((t, j) => <p key={j}>{renderRichText(t)}</p>)}
              </div>
            </div>
            )}
          </div>
          }
          {b.type === 'axes' &&
          <div className={`harness-axes n${b.items.length}`}>
            {b.items.map((a, i) =>
            <div className="harness-axis reveal" key={i}>
              <div className="hx-head">
                <span className="hx-name">{a.name}</span>
                <span className="hx-no">{a.no}</span>
              </div>
              <h4>{a.title}</h4>
              <div className="hx-label">구성</div>
              <ul>{a.build.map((x, j) => <li key={j}>{renderRichText(x)}</li>)}</ul>
              {a.result &&
              <React.Fragment>
                <div className="hx-label">여기서 나온 것</div>
                <ul>{a.result.map((x, j) => <li key={j}>{renderRichText(x)}</li>)}</ul>
              </React.Fragment>
              }
              {a.edge &&
              <React.Fragment>
                <div className="hx-label">경계</div>
                <p className="hx-edge">{renderRichText(a.edge)}</p>
              </React.Fragment>
              }
              <div className="hx-stack">{a.tags.map((t, j) => <span className="tag" key={j}>{t}</span>)}</div>
            </div>
            )}
          </div>
          }
        </React.Fragment>
        )}
      </div>
      )}

      {H.note && <p className="case-note-inline">{renderRichText(H.note)}</p>}
    </React.Fragment>);
}

/* 06 AI HARNESS: 월 마커(왼쪽 레일) + 기술 카드. 적용처는 태그로만.
   카드를 누르면 그 줄 바로 아래 전폭 행으로 상세가 펼쳐짐(grid dense라 같은 줄 다른 카드는 자리 유지) */
const TL_WHERE = { '회사': 'co', '자동매매': 'tr', 'KVTO': 'kv' };

function TLDetail({ id, x, caret }) {
  const D = x.detail;
  // 적용처는 카드 태그 순서대로
  const cases = x.where.map((w) => (D.cases || []).find((c) => c.where === w)).filter(Boolean);
  return (
    <div id={id} className="tl-detail" role="region" aria-label={x.name + ' 상세'}
    style={caret != null ? { '--caret-x': caret + 'px' } : undefined}>
      <div className="tl-d-title" aria-hidden="true">{x.name}</div>
      <div className="tl-d-cols">
        {D.why && <div className="tl-d-col"><div className="tl-d-k">도입 이유</div><p>{renderRichText(D.why)}</p></div>}
        {D.how && <div className="tl-d-col"><div className="tl-d-k">동작 구조</div><p>{renderRichText(D.how)}</p></div>}
        {cases.length > 0 &&
        <div className="tl-d-col">
          <div className="tl-d-k">적용처별</div>
          <ul className="tl-d-cases">
            {cases.map((c) =>
            <li key={c.where}><span className={'tl-tag ' + (TL_WHERE[c.where] || '')}>{c.where}</span><span>{renderRichText(c.text)}</span></li>
            )}
          </ul>
        </div>
        }
      </div>
      {D.note && <p className="tl-d-note"><span className="tl-d-k">비고</span>{renderRichText(D.note)}</p>}
    </div>);
}

function AITimeline({ data: T }) {
  const [open, setOpen] = useState(() => new Set());
  const [carets, setCarets] = useState({});
  const cardRefs = useRef({});
  const keys = [];
  T.months.forEach((M, mi) => M.items.forEach((x, i) => {if (x.detail) keys.push(mi + '-' + i);}));
  const allOpen = keys.length > 0 && keys.every((k) => open.has(k));
  const toggle = (k) => setOpen((s) => {
    const n = new Set(s);
    if (n.has(k)) n.delete(k);else n.add(k);
    return n;
  });

  // 상세 위 꼭지(caret)를 펼친 카드 가운데에 맞춤. 열 수가 폭마다 달라 렌더 후 측정
  useLayoutEffect(() => {
    const measure = () => {
      const next = {};
      open.forEach((k) => {
        const el = cardRefs.current[k];
        if (el) next[k] = Math.round(el.offsetLeft + el.offsetWidth / 2);
      });
      setCarets(next);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [open]);

  return (
    <React.Fragment>
      {T.head &&
      <div className="case-intro tl-intro reveal">
        <div className="case-cat">{T.head.cat}</div>
        <h3>{T.head.headline.split('\n').map((l, i) =>
          <React.Fragment key={i}>{i > 0 && <br />}{l}</React.Fragment>)}</h3>
        <p className="case-lead">{renderRichText(T.head.lead)}</p>
        {T.head.meta &&
        <div className="case-meta">
          {T.head.meta.map((m, i) =>
          <div key={i}><span className="k">{m.k}</span><span className="v">{m.v}</span></div>
          )}
        </div>
        }
      </div>
      }
      {T.layers &&
      <div className="tl-layers reveal">
        {T.layers.map((L) =>
        <div key={L.k} className="tl-layer-def"><span className="tl-layer">{L.k}</span><span>{L.def}</span></div>
        )}
        <div className="tl-where-key">
          {Object.keys(TL_WHERE).map((w) => <span key={w} className={'tl-tag ' + TL_WHERE[w]}>{w}</span>)}
          <span>적용처</span>
        </div>
      </div>
      }
      {keys.length > 0 &&
      <div className="tl-tools">
        <span>{T.hint}</span>
        <button type="button" className="tl-all" aria-pressed={allOpen}
        onClick={() => setOpen(allOpen ? new Set() : new Set(keys))}>{allOpen ? '상세 모두 접기' : '상세 모두 펼치기'}</button>
      </div>
      }
      <ol className="tl">
        {T.months.map((M, mi) =>
        <li key={M.m} className="tl-month">
          <div className="tl-mark"><span className="tl-dot" /><span className="tl-m">{M.m}</span><span className="tl-cnt">{pad2(M.items.length)}</span></div>
          <div className="tl-cards">
            {M.items.map((x, i) => {
              const k = mi + '-' + i;
              const id = 'tl-d-' + k;
              const isOpen = !!x.detail && open.has(k);
              return (
                <React.Fragment key={i}>
                  {/* 펼침 상태는 data-open으로. className을 바꾸면 useReveal이 붙인 .in이 지워져 카드가 사라짐 */}
                  <article ref={(el) => {cardRefs.current[k] = el;}} data-open={isOpen ? '' : undefined}
                  className={'tl-card reveal' + (x.detail ? ' has-detail' : '')}>
                    <div className="tl-head">
                      <h4>{x.detail ?
                        <button type="button" className="tl-toggle" aria-expanded={isOpen} aria-controls={id} onClick={() => toggle(k)}>{x.name}</button> :
                        x.name}</h4>
                      <span className="tl-layer">{x.layer}</span>
                    </div>
                    <p className="tl-what">{renderRichText(x.what)}</p>
                    {x.how && <p className="tl-how"><span className="k">적용</span>{renderRichText(x.how)}</p>}
                    <div className="tl-where">
                      {x.where.map((w) => <span key={w} className={'tl-tag ' + (TL_WHERE[w] || '')}>{w}</span>)}
                      {x.detail && <span className="tl-more" aria-hidden="true">{isOpen ? '접기 −' : '상세 +'}</span>}
                    </div>
                  </article>
                  {isOpen && <TLDetail id={id} x={x} caret={carets[k]} />}
                </React.Fragment>);
            })}
          </div>
        </li>
        )}
      </ol>
      {T.principles &&
      <div className="tl-principles reveal">
        <div className="label">원칙</div>
        <ol>{T.principles.map((p, i) => <li key={i}>{renderRichText(p)}</li>)}</ol>
      </div>
      }
      {T.note && <p className="case-note-inline">{renderRichText(T.note)}</p>}
    </React.Fragment>);
}

function AIHarness() {
  return (
    <section id="ai-harness" className="case harness" data-screen-label={screenLabel('ai-harness')}>
      <div className="container">
        <SectionHeader slug="ai-harness" title="AI HARNESS" meta={secNo('ai-harness')} />
        <AITimeline data={window.PORTFOLIO_DATA.AI_TIMELINE} />
      </div>
    </section>);
}

function AIProjects() {
  return (
    <section id="ai-projects" className="case harness" data-screen-label={screenLabel('ai-projects')}>
      <div className="container">
        <SectionHeader slug="ai-projects" title="AI PROJECTS" meta={secNo('ai-projects')} />
        <HarnessDeepDive data={window.PORTFOLIO_DATA.AI_PROJECTS} />
      </div>
    </section>);
}

// ============ SKILLS ============
function SkillDots({ lv }) {
  const L = window.PORTFOLIO_DATA.SKILL_LEVELS.find((x) => x.lv === lv);
  return (
    <span className="sk-dots" role="img" aria-label={`${lv} / 3 · ${L.name}`} title={`${L.name} · ${L.def}`}>
      {[1, 2, 3].map((i) => <i key={i} className={i <= lv ? 'on' : ''} />)}
    </span>);
}

function SkillRows({ items }) {
  const LV = window.PORTFOLIO_DATA.SKILL_LEVELS;
  return (
    <ul className="sk-list">
      {items.map((s) =>
      <li key={s.n} className="sk-row">
          <span className="sk-name">{s.n}</span>
          <SkillDots lv={s.lv} />
          <span className="sk-why"><b>{LV.find((x) => x.lv === s.lv).name}</b> · {s.why}</span>
        </li>
      )}
    </ul>);
}

function Skills() {
  const { SKILLS, AI_SKILL, SKILL_LEVELS, SKILLS_DRAFT } = window.PORTFOLIO_DATA;
  return (
    <section id="skills" className="skills" data-screen-label={screenLabel('skills')}>
      <div className="container">
        <SectionHeader slug="skills" title="SKILLS" meta={`${pad2(SKILLS.length)} categories`} />
        <div className="sk-legend reveal">
          {SKILL_LEVELS.map((L) =>
          <div key={L.lv} className="sk-legend-item">
              <SkillDots lv={L.lv} />
              <b>{L.name}</b>
              <span>{L.def}</span>
            </div>
          )}
          {SKILLS_DRAFT && <span className="sk-draft">DRAFT · 배정 확인 중</span>}
        </div>
        <div className="skills-grid">
          {SKILLS.map((g) =>
          <div key={g.cat} className="skill-group reveal">
              <div className="gh">
                <h4>{g.cat}</h4>
                <span className="cnt">{pad2(g.items.length)}</span>
              </div>
              <SkillRows items={g.items} />
            </div>
          )}
          <div className="skill-group ai reveal">
            <div className="gh">
              <div>
                <h4>{AI_SKILL.cat}</h4>
                <div className="star-row">AUGMENTED WORKFLOW · 사후 검증 중심</div>
              </div>
              <span className="cnt">{pad2(AI_SKILL.items.length)}</span>
            </div>
            <div className="ai-h">
              Claude Code 기반 <em>에이전틱 워크플로우</em>를 직접 설계해 작업 규칙과 검증을 코드로 만들어 두고, 결과물이 매번 달라지지 않게 합니다.
            </div>
            <SkillRows items={AI_SKILL.items} />
          </div>
        </div>
      </div>
    </section>);

}

// ============ EDUCATION ============
function Education() {
  return (
    <section id="education" className="education" data-screen-label={screenLabel('education')}>
      <div className="container">
        <SectionHeader slug="education" title="EDUCATION" meta={secNo('education')} />
        <div className="edu-grid">
          <div className="edu-school reveal">
            <div className="period">2026.03 ~ <b>재학 중</b></div>
            <h3>서강대학교 AI·SW융합대학원</h3>
            <div className="dept">데이터사이언스학과<span className="deg">· Master's Course</span></div>
          </div>
          <div className="edu-certs reveal d1">
            <div className="label">Certifications</div>
            <div className="list">
              {['정보처리기사', '빅데이터분석기사', 'SQLD', 'ADsP'].map((c) =>
              <span key={c} className="tag">{c}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>);

}

// ============ CONTACT ============
function Contact() {
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(null);
  useEffect(() => () => clearTimeout(copyTimer.current), []);
  const onCopy = (e) => {
    e.preventDefault();
    const email = 'richdream703@gmail.com';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1800);
    }
    window.location.href = `mailto:${email}`;
  };
  return (
    <section id="contact" className="contact" data-screen-label={screenLabel('contact')}>
      <div className="container">
        <SectionHeader slug="contact" title="CONTACT" meta={secNo('contact')} />
        <div className="contact-prompt">Let's build something that holds up.</div>

        <a href="mailto:richdream703@gmail.com" className="contact-email-wrap" onClick={onCopy}>
          <div className={'contact-copy-tip' + (copied ? ' ok' : '')}>
            {copied ? '✓ copied to clipboard' : 'click to copy · opens mail'}
          </div>
          <div className="contact-email">
            <span>richdream703<span style={{ color: '#d94f1f' }}>@</span>gmail.com</span>
            <span className="arr">→</span>
          </div>
        </a>

        <div className="contact-meta">
          <div><span>BASED IN</span><b>Seoul, KR</b></div>
          <div><span>AVAILABILITY</span><b>Open to opportunities</b></div>
          <div><span>FOCUS</span><b>Backend · AI Harness · AX / FDE</b></div>
          <div><span>RESPONSE</span><b>~ 24h</b></div>
        </div>
      </div>
    </section>);

}

// ============ PAGER ============
function Pager({ page, total, onGo }) {
  const nav = window.PORTFOLIO_DATA.NAV;
  return (
    <nav className="pager" aria-label="페이지 이동">
      <button className="pager-btn prev" onClick={() => onGo(page - 1)} disabled={page === 0}>
        <span className="arr" aria-hidden="true">←</span> Prev
      </button>
      <div className="pager-center">
        <div className="pager-ticks">
          {nav.map((n, i) =>
          <button key={n.id} className={'pager-tick' + (i === page ? ' on' : '')} onClick={() => onGo(i)} aria-label={n.label} aria-current={i === page ? 'page' : undefined}>
            {String(i + 1).padStart(2, '0')}
          </button>
          )}
        </div>
        <div className="pager-info">
          <b>{String(page + 1).padStart(2, '0')}</b> / {String(total).padStart(2, '0')} · {nav[page].label}
        </div>
      </div>
      <button className="pager-btn next" onClick={() => onGo(page + 1)} disabled={page === total - 1}>
        Next <span className="arr" aria-hidden="true">→</span>
      </button>
    </nav>);

}

// ============ APP ============
const SECTIONS = [Hero, About, Experience, Projects, CaseStudy, AIHarness, AIProjects, Skills, Education, Contact];
const PAGE_IDS = window.PORTFOLIO_DATA.NAV.map((n) => n.id);

function pageFromHash() {
  const i = PAGE_IDS.indexOf(window.location.hash.replace('#', ''));
  return i >= 0 ? i : 0;
}

// 뷰포트를 넘치는 페이지는 zoom으로 축소해 한 화면에 맞춘다.
// FIT_MIN 밑으로 줄여야 맞는 긴 페이지(경력·케이스 스터디)는 원배율 + 스크롤 유지.
const FIT_MIN = 0.68;

function App() {
  const [page, setPage] = useState(pageFromHash);
  const [hint, setHint] = useState(false);
  const total = SECTIONS.length;
  const ref = useReveal(page);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !('zoom' in el.style)) return;
    const inner = el.firstElementChild;
    if (!inner) return;
    let raf = null;
    const fit = () => {
      raf = null;
      inner.style.zoom = '';
      let z = 1;
      // zoom이 줄면 유효 폭이 넓어져 줄바꿈이 달라지므로 수렴할 때까지 재측정
      for (let i = 0; i < 5 && el.scrollHeight > el.clientHeight + 1; i++) {
        z *= el.clientHeight / el.scrollHeight;
        if (z < FIT_MIN) { z = 1; break; }
        inner.style.zoom = z;
      }
      if (z === 1) inner.style.zoom = '';
    };
    const schedule = () => { if (raf === null) raf = requestAnimationFrame(fit); };
    fit();
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    ro.observe(inner); // 폰트 스왑 등 콘텐츠 높이 변화 대응
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('resize', schedule);
      ro.disconnect();
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [page]);

  // 페이지가 뷰포트보다 길고 아직 바닥 근처가 아니면 스크롤 힌트 표시
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      setHint(el.scrollHeight - el.clientHeight > 24 &&
      el.scrollTop + el.clientHeight < el.scrollHeight - 32);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      ro.disconnect();
    };
  }, [page]);

  useEffect(() => {
    const onHash = () => setPage(pageFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const go = (i) => {
    const next = Math.max(0, Math.min(total - 1, i));
    if (next === page) return;
    window.location.hash = PAGE_IDS[next];
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      // 브라우저 뒤로가기(Alt/Cmd+←)·텍스트 선택(Shift+→)은 그대로 통과
      if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;
      // 포커스된 가로 스크롤러(코드블록·다이어그램)의 스크롤을 뺏지 않음
      if (e.target instanceof Element && e.target.closest('pre, .case-diagram, input, textarea, select, [contenteditable="true"]')) return;
      e.preventDefault();
      go(e.key === 'ArrowRight' ? page + 1 : page - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [page]);

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {firstRender.current = false;return;}
    if (ref.current) ref.current.focus({ preventScroll: true });
  }, [page]);

  const Section = SECTIONS[page];
  return (
    <div>
      <Nav page={page} total={total} />
      <main className="page-viewport">
        <div
          className={'page-scroll' + (page === total - 1 ? ' page-scroll--dark' : '')}
          key={page} ref={ref} tabIndex={-1} role="region"
          aria-label={`${page + 1} / ${total} · ${window.PORTFOLIO_DATA.NAV[page].label}`}>
          <Section />
          {page === total - 1 &&
          <footer className="footer">
            <div>© 2026 Kim Minjune · Built with React, Vanilla CSS, and a lot of espresso.</div>
            <div>v.3.4.0 · last updated 2026.10.18</div>
          </footer>
          }
        </div>
      </main>
      <div className={'scroll-hint' + (hint ? ' show' : '')} aria-hidden="true">
        <span className="sh-arr">↓</span> Scroll
      </div>
      <Pager page={page} total={total} onGo={go} />
    </div>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);