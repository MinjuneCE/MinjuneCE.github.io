const { useState, useEffect, useRef } = React;

// ============ UTILITIES ============
function useReveal() {
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
  }, []);
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

// ============ NAV ============
function Nav() {
  const [active, setActive] = useState('hero');
  const [time, setTime] = useState('');

  useEffect(() => {
    const ids = window.PORTFOLIO_DATA.NAV.map((n) => n.id);
    const onScroll = () => {
      let cur = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= window.innerHeight * 0.35) cur = id;
      }
      setActive(cur);
      const p = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
      const bar = document.getElementById('scroll-progress');
      if (bar) bar.style.width = p * 100 + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
      <div id="scroll-progress" className="scroll-progress" />
      <nav className="nav">
        <a href="#hero" className="nav-brand">
          <span className="mark" />
          <span>Kim Minjune</span>
          <span className="sep">/</span>
          <span className="role">Backend</span>
        </a>
        <div className="nav-links">
          {window.PORTFOLIO_DATA.NAV.map((n) =>
          <a key={n.id} href={`#${n.id}`} className={active === n.id ? 'active' : ''}>{n.label}</a>
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
    <section id="hero" className="hero" data-screen-label="01 Hero">
      <div className="container hero-content">
        <div className="hero-top">
          <div>Kim Minjune ®</div>
          <div>Java Backend Engineer, Seoul, Republic of Korea</div>
          <div>Portfolio · 2026.06</div>
        </div>

        <div className="hero-main">
          <div className="hero-num">
            <div className="cur"><b>01</b> · Hero</div>
            <div>02 · About</div>
            <div>03 · Experience</div>
            <div>04 · Projects</div>
            <div>05 · Case Study</div>
            <div>06 · Skills</div>
            <div>07 · Education</div>
            <div>08 · Contact</div>
          </div>
          <div className="hero-headline-wrap">
            <h1 className="hero-headline">
              <span className="line"><span>Backend</span></span>
              <span className="line"><span>That Holds <span className="accent">Up.</span></span></span>
              <span className="line"><span className="sub">김민준 · Kim Minjune · Java Backend Engineer</span></span>
            </h1>
          </div>
        </div>

        <div className="hero-mid">
          <div className="hero-role">
            <span className="label">Role</span> <b>Java Backend · MSA · AI Harness</b>
          </div>
          <div className="hero-slogan">
            메시지 브로커 없이 DB 락(SKIP LOCKED)만으로 8서버 HA(고가용) 분산을 설계하는 백엔드 엔지니어. 미션 크리티컬 시스템의 동시성·가용성에 집중하고, AI 하네스로 개발 속도를 끌어올립니다.
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
            <div><Counter to={8} />Server HA</div>
            <div><Counter to={10} suffix="Y" />Data Analyzed</div>
          </div>
        </div>
      </div>
    </section>);

}

// ============ ABOUT ============
function Terminal() {
  const lines = [
  { type: 'cmd', text: 'whoami' },
  { type: 'out', text: 'kim_minjune · Java Backend Engineer' },
  { type: 'spacer' },
  { type: 'cmd', text: 'cat stack.txt' },
  { type: 'out', text: 'Java, Spring Boot, eGovFrame,' },
  { type: 'out', text: 'PostgreSQL, Elasticsearch,' },
  { type: 'out', text: 'Docker, Kubernetes, K-PaaS' },
  { type: 'spacer' },
  { type: 'cmd', text: 'echo $STATUS' },
  { type: 'out', text: 'shipping production code', color: 'green' }];

  const [shown, setShown] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          let i = 0;
          const id = setInterval(() => {
            i++;
            setShown(i);
            if (i >= lines.length) clearInterval(id);
          }, 240);
          obs.disconnect();
        }
      });
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
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
    <section id="about" className="about" data-screen-label="02 About">
      <div className="container">
        <SectionHeader slug="about" title="ABOUT" meta="02 / 08" />
        <div className="about-grid">
          <div className="about-headline reveal">
            <h2>Backend <span className="ink-em">That Holds Up.</span></h2>
          </div>

          <div className="about-cols" style={{ gridColumn: '1 / -1' }}>
            <div className="about-prose reveal d1">
              <p>3년간 공공·SI 도메인에서 백엔드 시스템을 설계하고 운영해왔습니다. <strong>
국가기록원 데이터세트 관리체계</strong>, <strong>대구형 평가 플랫폼</strong> 등 안정성과 정합성이 중요한 프로젝트에 참여하며, eGovFrame부터 Spring Boot 기반 MSA·K-PaaS 환경까지 폭넓게 다뤄왔습니다.</p>
              <p>단순히 동작하는 코드보다 <span className="kw">변경에 강한 구조</span>를 만드는 데 관심이 많습니다. DDD와 헥사고날 아키텍처로 도메인을 분리하고, TDD로 안정성을 확보합니다. 또한 <span className="kw">Claude Code 기반 에이전틱 워크플로우</span>를 실무에 적용해 개발 생산성과 아키텍처 일관성을 함께 끌어올리고 있습니다.</p>
            </div>
            <div className="about-terminal reveal d2">
              <Terminal />
            </div>
          </div>

          <div className="about-stats">
            <div className="about-stat reveal"><div className="n"><Counter to={3} suffix="+" /></div><div className="l">Years Experience</div></div>
            <div className="about-stat reveal d1"><div className="n"><Counter to={8} /></div><div className="l">Projects Shipped</div></div>
            <div className="about-stat reveal d2"><div className="n"><Counter to={5} suffix="+" /></div><div className="l">Public Domains</div></div>
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
    <section id="experience" className="experience" data-screen-label="03 Experience">
      <div className="container">
        <SectionHeader slug="experience" title="EXPERIENCE" meta="03 / 08" />

        <div className="exp-company reveal">
          <div className="exp-company-meta">
            <div className="period">2023.02 ~ 2026.04</div>
            <h3>(주)아키아카 ·
Akiaka</h3>
            <div className="role-line">
              <b>백엔드 개발자 → 개발 리더</b>
              <span className="promo">2026 승격</span>
            </div>
          </div>
          <div className="exp-company-desc">
            <p>교육·행정·에너지·연구·국토 등 <strong>5개 이상 공공 도메인의 미션 크리티컬 시스템</strong>(영구기록물·평가 플랫폼)을 신규 구축부터 기능개선·장기 유지보수까지 생명주기 전반에 걸쳐 담당했습니다.</p>
            <p>단순 투입에 그치지 않고 <strong>SKIP LOCKED 자율 분산·MSA 전환 등 요구되지 않은 개선을 주도</strong>했고, 부서 연차사업 제안서 작성에 참여하며 개발 리더로 승격했습니다.</p>
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
        <React.Fragment key={i}>{s}{i < arr.length - 1 ? <br /> : null}</React.Fragment>
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

      <div className="stack">
        {p.stack.map((s) => <span key={s} className="tag">{s}</span>)}
      </div>
    </div>);

}

function Projects() {
  return (
    <section id="projects" className="projects" data-screen-label="04 Projects">
      <div className="container">
        <SectionHeader slug="projects" title="PROJECTS" meta="04 / 08" />
        <div className="proj-grid">
          {window.PORTFOLIO_DATA.FEATURED_PROJECTS.map((p) => <ProjectCard key={p.no} p={p} />)}
        </div>
      </div>
    </section>);

}

// ============ CASE STUDY ============
const CASE_TRACE = [
  {
    n: '01', t: '담당 배경',
    body: ['난이도가 높아 원래 **PL이 담당**하기로 분장됐던 다중화 task. PL이 프로젝트 중반 중도 하차하면서 PM이 재할당했고, 다중화를 직접 학습해 단독으로 맡음.'],
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
      '모든 서버가 공유 디렉토리를 폴링하며 파일을 집어가는 방식을 검토했으나 기각. ① 수신이 1서버 종속이라 대칭 수신+처리가 불가, ② **파일시스템엔 원자적 claim 수단이 없어** 1천만 건에서 여러 워커가 같은 파일을 동시에 집는 것을 막기 어려움.',
      '반면 메타데이터는 DB에 있어 **트랜잭션 락으로 원자적 claim이 가능**. 어쩔 수 없이가 아니라 더 우월한 claim 수단을 보고 **DB 작업 큐를 능동적으로 선택함**.',
    ],
  },
  {
    n: '04', t: '설계 선택 ②: 중앙 분배(push)에서 자율 선점(pull)으로',
    body: [
      '처음엔 master가 작업을 나눠주는 방식을 구상. 그러나 단순 시퀀셜(round-robin) 분배는 **파일 크기 편차로 일부 서버만 혹사**되는 부하 불균형(makespan 악화)이 문제였음. 가용성이 아니라 부하분산 문제임.',
      '여기에 고객이 **인수:품질 서버 비율을 3:5 / 2:6 등으로 유동 운영**하려는 요구를 추가. → 분배자를 두지 않고 **워커가 직접 선점하는 자율 할당(경쟁 소비자 / work-stealing)**으로 전환함.',
    ],
  },
  {
    n: '05', t: '동시성 이슈: 데드락, 그리고 SKIP LOCKED',
    body: [
      '대상을 **10건씩 묶어 claim**하자 워커들이 경합하며 **데드락 발생**. 여러 행을 한 트랜잭션에서 잠글 때 일관된 `ORDER BY`가 없으면 락 획득 순서가 비결정적이 되어 **순환 대기**에 빠짐.',
      '**배치=1**로 줄이자 단일 락이라 순환 대기가 불가능해 데드락은 사라졌으나, DB 왕복이 급증해 **처리량이 저하됨**.',
      '최종 해법은 `SELECT … FOR UPDATE SKIP LOCKED`. 잠긴 행을 건너뛰므로 배치를 다시 키워도 락 대기·순환 대기 없이 **처리량을 회복함**.',
    ],
  },
  {
    n: '06', t: '리소스 이슈: 커넥션 풀 사이징',
    body: [
      '8서버 × 멀티스레드 워커의 동시 사용 주체가 풀 크기를 초과해 **커넥션 획득 실패 발생**. claim 트랜잭션은 이미 짧아 점유 시간이 아니라 **순수 동시성 사이징** 문제였음.',
      '인프라팀과 조율해 워커 동시성에 맞춰 풀을 증설함. 이 경우의 증설은 임시방편(band-aid)이 아니라 **정당한 리소스 사이징**.',
    ],
  },
  {
    n: '07', t: '실패 모드: soft / hard 구분',
    body: [
      '**Soft failure**(IO·변환·비즈니스 예외): `try-catch`로 상태를 `오류`로 마킹 + 로그 → 유지보수 조직 확인. 자동으로 동작함.',
      '**Hard crash**(`kill -9`·OOM·전원·네트워크 단절): catch가 실행되지 않아 task가 `작업중`에 stuck됨. claim 시 `worker_id`(서버 식별자)를 행에 기록해 두므로, 실시간 모니터링이 죽은 서버를 감지하면 그 식별자의 stuck 행을 **역추적해 수동 회수함**.',
      '**리퍼(reaper)·lease 타임아웃은 의도적으로 미도입**. 무중단 자동복구가 불필요한 업무 특성임. 그 덕에 **멱등성도 현재는 비필수**. (자동 회수를 넣으면 "완료 후 마킹 전 크래시 → 이중 처리" 위험이 생겨, 그때는 처리-마킹 원자화나 멱등 처리가 필수가 됨.)',
    ],
  },
  {
    n: '08', t: '설계 정리: 의도적으로 낮춘 복잡도',
    body: [
      '수신 SPOF, 역할 pin, 설정 변경 시 재기동, 수동 회수. 이들은 약점이 아니라 **요구와 제약을 읽고 복잡도를 의도적으로 낮춘 결정**. 무중단 자동복구 불필요 → 수동 회수로 충분 → 멱등성 불필요 → **단순성 확보**로 이어지는 일관된 흐름임.',
    ],
  },
];

const CASE_QA = [
  { q: '같은 작업을 두 워커가 동시에 잡지 않나?', a: '`SELECT … FOR UPDATE SKIP LOCKED`로 행을 잠그고 즉시 `작업중`으로 바꿔 커밋하는 **원자적 claim**임. 이미 잠긴 행은 다른 워커가 **건너뛰므로** 중복 선점이 구조적으로 불가능함.' },
  { q: '부하는 어떻게 고르게 분산되나?', a: '분배자가 미리 나눠주는 push가 아니라 **워커가 끝나는 대로 다음 작업을 가져가는 pull(work-stealing)**이라, 파일 크기 편차가 있어도 빠른 워커가 더 처리해 **자연스럽게 부하가 평탄화됨**.' },
  { q: '워커가 처리 도중 죽으면 그 작업은?', a: 'hard crash는 `catch`가 돌지 않아 행이 `작업중`에 고착됨. claim 시 기록한 `worker_id`로 죽은 서버의 stuck 행을 **역추적**해, 모니터링이 서버 다운을 감지한 뒤 **수동 회수함**. 자동 리퍼는 무중단 복구가 불필요해 두지 않음.' },
  { q: 'DB·수신이 단일인데 완전한 HA인가?', a: '아님. **처리 계층은 8서버 HA·부하분산**이지만 수신 게이트웨이는 솔루션 제약상 **단일(SPOF)**이고 작업 큐 DB도 공유 자원임. 숨기지 않음. 주어진 제약 안에서 **처리 계층의 가용성과 확장성**을 확보한 것이 이 설계의 범위.' },
  { q: '배치를 줄였다 다시 키운 이유는?', a: '배치 10 → **데드락**(락 순서 비결정) → 배치 1 → 데드락은 풀렸으나 **DB 왕복↑로 처리량↓** → `SKIP LOCKED`로 **배치 복원**해 처리량까지 회복함. 줄인 게 해법이 아니라 SKIP LOCKED가 최종 해법임.' },
  { q: '멱등성은 보장하나?', a: '자동 재처리가 없어 **현재는 비필수**. 자동 회수를 도입하면 "완료 후 마킹 전 크래시 → 이중 처리" 위험이 생기므로, 그때는 **처리-마킹 원자화 또는 멱등 처리**가 필수로 전환됨.' },
];

const CASE_SQL = `<!-- JobQueueMapper.xml · Oracle -->
<select id="claimJobs" resultType="Job">
  SELECT job_id, file_path, job_type
    FROM tb_job_queue
   WHERE status   = #{statusReady}      <!-- '대기' (상태는 코드값) -->
     AND job_type = #{jobType}          <!-- 인수/품질: 서버 설정값으로 주입 -->
   ORDER BY priority                    <!-- 업무 중요도 순 -->
   FETCH FIRST #{batchSize} ROWS ONLY
   FOR UPDATE SKIP LOCKED               <!-- 잠긴 행은 건너뜀 → 데드락·대기 없이 병렬 선점 -->
</select>

<update id="markProcessing">
  UPDATE tb_job_queue
     SET status    = #{statusProcessing},   <!-- '작업중' -->
         worker_id = #{workerId}             <!-- 누가 잡았는지 기록 → 죽은 서버 stuck 회수 추적 -->
   WHERE job_id IN
   <foreach collection="ids" item="id" open="(" separator="," close=")">#{id}</foreach>
</update>`;

const CASE_JAVA = `// 폴링은 기존 단일서버 방식 유지 (무한 루프 + sleep)
while (running) {
    try {
        List<Job> jobs = claim();            // ① 짧은 선점 트랜잭션
        for (Job job : jobs) process(job);   // ② 무거운 처리는 락 밖에서
    } catch (Exception e) {
        log.error("worker loop error", e);
    }
    Thread.sleep(pollIntervalMs);
}

@Transactional   // 선점 → 상태 변경 → 즉시 commit (행 락을 짧게 끊는다)
List<Job> claim() {
    List<Job> jobs = mapper.claimJobs(statusReady, jobType, batchSize);
    if (!jobs.isEmpty())
        mapper.markProcessing(idsOf(jobs), statusProcessing, workerId);
    return jobs;   // commit 으로 락 해제, 상태는 '작업중'으로 고정
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
    <section id="case-study" className="case" data-screen-label="05 Case Study">
      <div className="container">
        <SectionHeader slug="case-study" title="CASE STUDY" meta="05 / 08" />

        <div className="case-intro reveal">
          <div className="case-cat">Distributed System · Deep Dive</div>
          <h3>L4 없이, DB 작업 큐로<br />8서버 자율 분산 처리</h3>
          <p className="case-lead">
            행정안전부 중앙영구기록관리시스템 다중화(2024). 약 <strong>1천만 건</strong>의 파일을 중앙 분배자 없이 워커가 직접 작업을 선점하는 <strong>경쟁 소비자(self-claiming)</strong> 구조로 처리함. 제약이 설계를 바꾸고 한 해결책이 다음 문제를 부른 과정을 순서대로 정리.
          </p>
          <div className="case-meta">
            <div><span className="k">Role</span><span className="v">다중화 설계·구현 (재할당받아 단독 학습·해결)</span></div>
            <div><span className="k">Scale</span><span className="v">약 1천만 건</span></div>
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
          <div className="cbar">JobQueueMapper.xml · Oracle · MyBatis</div>
          <pre>{CASE_SQL}</pre>
        </div>
        <div className="case-code reveal">
          <div className="cbar">JobWorker.java · 무한 루프 폴링 + 짧은 claim 트랜잭션</div>
          <pre>{CASE_JAVA}</pre>
        </div>
        <p className="case-note-inline">* 상태는 코드값으로 운영되며 named 파라미터로 주입한다. 위 스니펫은 핵심 패턴을 보이기 위한 대표 코드.</p>

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

// ============ SKILLS ============
function Skills() {
  const { SKILLS, AI_SKILL } = window.PORTFOLIO_DATA;
  return (
    <section id="skills" className="skills" data-screen-label="06 Skills">
      <div className="container">
        <SectionHeader slug="skills" title="SKILLS" meta="08 categories" />
        <div className="skills-grid">
          {SKILLS.map((g, i) =>
          <div key={g.cat} className="skill-group reveal">
              <div className="gh">
                <h4>{g.cat}</h4>
                <span className="cnt">{String(g.tags.length).padStart(2, '0')}</span>
              </div>
              <div className="tags">
                {g.tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          )}
          <div className="skill-group ai reveal">
            <div className="gh">
              <div>
                <h4>{AI_SKILL.cat}</h4>
                <div className="star-row">AUGMENTED WORKFLOW · 검증 체계 구축 중</div>
              </div>
              <span className="cnt">{String(AI_SKILL.tags.length).padStart(2, '0')}</span>
            </div>
            <div className="ai-h">
              Claude Code 기반 <em>에이전틱 워크플로우</em>를 직접 설계해 개발 속도와 아키텍처 일관성을 함께 끌어올립니다.
            </div>
            <div className="tags">
              {AI_SKILL.tags.map((t) => <span key={t} className="tag">{t}</span>)}
            </div>
          </div>
        </div>
      </div>
    </section>);

}

// ============ EDUCATION ============
function Education() {
  return (
    <section id="education" className="education" data-screen-label="07 Education">
      <div className="container">
        <SectionHeader slug="education" title="EDUCATION" meta="07 / 08" />
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
  const onCopy = (e) => {
    e.preventDefault();
    const email = 'richdream703@gmail.com';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
    window.location.href = `mailto:${email}`;
  };
  return (
    <section id="contact" className="contact" data-screen-label="08 Contact">
      <div className="container">
        <SectionHeader slug="contact" title="CONTACT" meta="08 / 08" />
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
          <div><span>FOCUS</span><b>Backend · MSA · AI Harness</b></div>
          <div><span>RESPONSE</span><b>~ 24h</b></div>
        </div>
      </div>
    </section>);

}

// ============ APP ============
function App() {
  const ref = useReveal();
  return (
    <div ref={ref}>
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <CaseStudy />
        <Skills />
        <Education />
        <Contact />
      </main>
      <footer className="footer">
        <div>© 2026 Kim Minjune · Built with React, Vanilla CSS, and a lot of espresso.</div>
        <div>v.3.2.0 · last updated 2026.06.30</div>
      </footer>
    </div>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);