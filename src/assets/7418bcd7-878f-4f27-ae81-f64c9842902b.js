// ============ DATA ============
const STARRED = [
  {
    no: 'PRJ.04',
    title: '대구광역시교육청 AI 평가 플랫폼 구축 사업',
    period: '2026',
    status: '진행 중',
    role: '서버·백엔드 담당, 아키텍처 설계 참여',
    bullets: [
      '12개 마이크로서비스 전반 설계 (UMS·FDS·TRS·COS·APS·TDS·QGS·AIS·AMS·AES·SMS·INS)',
      'K-PaaS (Kubernetes 기반) 컨테이너 환경 구축 및 전반 설계',
      'SMS 모듈 직접 개발, 별도 발주 첨삭도구 개발',
      '3계층 하이브리드 클라우드(내부망 + DMZ + 외부) 환경 설계',
    ],
    stack: ['Java 17', 'Spring Boot', 'eGovFrame 4.3', 'PostgreSQL 16', 'Kubernetes (K-PaaS)', 'Jenkins', 'GitLab', 'Istio', 'Keycloak'],
  },
  {
    no: 'PRJ.03',
    title: '행정안전부 전자기록 기술정보관리시스템(DFR) 기능개선',
    period: '2025',
    role: '데이터 분석 및 검증 소프트웨어 개선',
    bullets: [
      '10년간 기계검수 vs 육안검수 데이터 분석 (Python 활용)',
      'Confusion Matrix 기반 5개 지표 검증: Accuracy · Precision · Recall · F1-Score · Specificity',
      '기계검수 시스템 내 검증 소프트웨어 버전 업그레이드',
      '분석 결과를 바탕으로 기계검수 정확도 개선 방향 도출',
    ],
    stack: ['Python', 'pandas', 'scikit-learn', 'Java', 'Spring', 'eGovFrame', 'Oracle'],
  },
  {
    no: 'PRJ.02',
    title: '행정안전부 중앙영구기록관리시스템 기능개선',
    period: '2024',
    role: '다중 서버 분산 아키텍처 설계 / 동시성 제어 / SQL 성능 튜닝',
    bullets: [
      '8서버 HA 구성을 L4 스위치 없이 소프트웨어 분산 처리로 설계',
      '`SELECT FOR UPDATE SKIP LOCKED` 기반 자율 할당 아키텍처: Master 없이 수평 확장 가능',
      '트랜잭션 레벨 락으로 중복 처리 원천 차단',
      '인수 3:품질 5 → 5:3 등 유동적 작업 분배 구조 구현',
      '실행계획 분석 기반 SQL 성능 튜닝',
    ],
    stack: ['Java', 'Spring', 'Oracle', 'eGovFrame', 'Multi-threading'],
  },
  {
    no: 'PRJ.01',
    title: '한국동서발전 기록관리시스템 유지보수',
    period: '2024 ~ 2026',
    role: '단독 유지보수 담당',
    bullets: [
      '2017년도 누락 데이터 복원',
      'Tibero5 → Tibero6 DB 업그레이드 (대규모 마이그레이션)',
      '운영 중 발생한 장애 기능 정상 복구',
    ],
    stack: ['Java', 'Spring', 'eGovFrame', 'Tibero5 → Tibero6'],
  },
];

const MINOR = [
  {
    no: '05',
    title: '과학기술정책연구원(STEPI) SSO 연계 하자보수',
    period: '2025',
    desc: 'SSO 인터페이스 비정상 동작 구간 로직 수정 → 정상 기동 복구',
    stack: ['Java', 'Spring Security', 'SSO'],
  },
  {
    no: '06',
    title: '국립중앙과학관 포털시스템 · NARIS 하자보수',
    period: '2025',
    desc: '타 부서 사업의 하자보수 수행. 고객사와의 관계 개선을 통해 후속 별도 프로젝트로 연계 수주.',
    stack: ['Java', 'Spring', 'Oracle'],
  },
  {
    no: '07',
    title: '국토정보공사(LX) 기록관리시스템 유지보수',
    period: '2023',
    desc: '입사 후 첫 유지보수 프로젝트. 비정상 동작 기능 수정.',
    stack: ['Java', 'Spring', 'eGovFrame', 'Oracle'],
  },
  {
    no: '08',
    title: '행정안전부 행정정보 데이터세트 종합관리시스템 구축',
    period: '2023',
    desc: '신규 구축. 타 시스템 인터페이스 및 통계 모듈 담당.',
    stack: ['Java', 'Spring Boot', 'eGovFrame', 'Oracle'],
  },
];

const FEATURED_PROJECTS = [
  {
    no: '01',
    cat: 'Distributed System',
    headline: `L4 스위치 없이, DB 락(SKIP LOCKED)만으로
8서버 HA 자율 분산 처리`,
    problem: '중앙영구기록관리시스템은 8서버 HA 구성이 필요했으나 L4 도입이 불가했고, Master-Slave 구조는 역할이 고정되어 인수 3:품질 5 ↔ 5:3 같은 유동적 작업 배분 요구를 충족시킬 수 없었음.',
    solutionLead: '각 서버가 스케줄링 테이블에서 `SELECT FOR UPDATE SKIP LOCKED`로 작업을 직접 선점하는 자율 할당 구조를 설계. Master 없이 수평 확장하며, 트랜잭션 레벨 락으로 중복 처리를 원천 차단.',
    alternatives: [
      '**Redis 분산락(Redlock)**: 별도 인프라 추가·SPOF·락 만료 타이밍 리스크 → 운영 부담으로 제외',
      '**메시지 브로커(Kafka/MQ)**: 순서·재처리 보장은 강하나 신규 컴포넌트 도입·운영비용 과다, 단일 DB 환경엔 과설계 → 제외',
      '**DB 락(`SKIP LOCKED`)**: 추가 인프라 0, 트랜잭션으로 정합성 보장, 기존 스택 안에서 해결 → **채택**',
    ],
    resultList: [
      '추가 인프라 0대로 8서버 HA 달성 (L4·브로커·코디네이터 없음)',
      '트랜잭션 레벨 락으로 중복 처리 0건 보장',
      '워커 증설 시 처리량 선형 확장, 워커 다운 시 잔여 작업 자동 흡수(무중단)',
      '인수:품질 작업 비율을 운영 중 실시간 조정 가능',
    ],
    stack: ['Java', 'Spring', 'Oracle', 'eGovFrame', 'SELECT FOR UPDATE', 'Multi-threading', 'HA Architecture'],
  },
  {
    no: '02',
    cat: 'Architecture & MSA',
    headline: `대구 교육청 AI 평가 플랫폼
12개 MSA를 K-PaaS·3계층 클라우드에 안정 배포`,
    problem: '대규모 AI 채점 시스템은 서비스별 부하·릴리스 주기·보안 등급이 모두 달라 단일 모놀리식으로 운영하기 어려웠음. 특히 내부망/DMZ/외부 보안 등급이 혼재.',
    solutionLead: '도메인을 12개 마이크로서비스(UMS·FDS·TRS·COS·APS·TDS·QGS·AIS·AMS·AES·SMS·INS)로 분할하고, K-PaaS(K8s) 컨테이너 + 3계층 하이브리드 클라우드(내부망/DMZ/외부)에 배포. SMS·첨삭도구는 직접 개발.',
    alternatives: [
      '**모놀리식**: 단순하나 보안 등급 혼재·릴리스 결합으로 공공 보안 요건 불충족 → 제외',
      '**도메인 단위 MSA + K-PaaS**: 보안 등급별 망분리 배포·독립 릴리스 가능 → **채택**. 분산 트랜잭션은 도메인 경계를 보상 트랜잭션/이벤트로 최소화',
    ],
    resultList: [
      '서비스별 독립 배포로 릴리스 결합 제거, 장애 격리',
      '보안 등급(내부망·DMZ·외부)별 분리 운영: 공공 보안 요건 충족',
      '12개 서비스를 K-PaaS 컨테이너로 표준화 배포',
    ],
    stack: ['Java 17', 'Spring Boot', 'eGovFrame 4.3', 'PostgreSQL 16', 'Kubernetes', 'K-PaaS', 'Istio', 'Keycloak', 'Jenkins', 'GitLab'],
  },
  {
    no: '03',
    cat: 'Data × Backend',
    headline: `DFR 기계검수 정확도 분석
10년치 기계 vs 육안 검수를 Confusion Matrix로 정량 검증`,
    problem: '기계검수 시스템이 10년간 운영됐으나, 육안검수 대비 실제 정확도가 객관적으로 검증된 적이 없었음.',
    solutionLead: '10년치 검수 로그를 Python(pandas)으로 정제한 뒤 scikit-learn 기반 Confusion Matrix로 Accuracy·Precision·Recall·F1·Specificity 5개 지표를 산출하고, 분석 결과로 검증 소프트웨어 버전을 업그레이드.',
    alternatives: [
      '**단순 정확도(Accuracy)만 평가**: 클래스 불균형에 왜곡되어 신뢰 불가 → 제외',
      '**정밀도/재현율 분리 평가**: 기록물 검수는 미탐(FN, 오류를 놓침)의 비용이 오탐(FP)보다 큼 → **재현율 우선** 관점으로 지표를 해석',
    ],
    resultList: [
      '10년치 검수 결과를 5개 지표로 정량화: 최초의 객관적 정확도 기준 확보',
      '오탐/미탐 비용 차이를 반영한 개선 방향 도출, 검증 SW 버전 업그레이드에 반영',
    ],
    stack: ['Python', 'pandas', 'scikit-learn', 'Java', 'Spring', 'Oracle'],
  },
  {
    no: '04',
    cat: 'AI Harness Engineering',
    headline: `Claude Code 위에 직접 설계한
재현 가능한 1인 에이전틱 개발 환경`,
    problem: '단순 LLM 프롬프트 사용만으로는 아키텍처 일관성·코드 품질·방법론(DDD·TDD) 준수를 안정적으로 유지하기 어려움. 1인 작업에서 산출물 편차가 큰 것이 구조적 문제였음.',
    solutionLead: 'Claude Code CLI를 코어로, AI 작업 규칙과 검증을 코드화한 "하네스(Harness)"를 직접 설계.',
    solutionList: [
      '**MCP 서버** 직접 구축·연동: 외부 도구·문서·시스템 컨텍스트 통합',
      '**Skills · Hooks**: DDD·헥사고날·TDD 작업 규칙을 재사용 모듈로 코드화, 커밋·빌드·검증 시점 자동 트리거',
      '**Agent Teams · Sub-agents**: 설계자·구현자·검수자 역할 분할과 병렬 처리',
    ],
    alternatives: [
      '**단순 LLM 프롬프트 반복**: 빠르나 규칙·검증이 매번 휘발, 산출물 편차 큼 → 한계',
      '**도구·규칙·검증을 코드화한 하네스**: 작업 재현성·일관성 확보 → **채택** (도입 전후 정량 eval 측정 체계는 구축 중)',
    ],
    resultList: [
      '작업 규칙(DDD·TDD)을 Skills/Hooks로 코드화 → 1인 작업에서도 산출물 편차 감소',
      '설계·구현 반복 속도 향상, 회사 업무·개인 프로젝트 전반에 적용 중',
    ],
    stack: ['Claude Code', 'MCP', 'Skills', 'Hooks', 'Agent Teams', 'Sub-agents', 'DDD', 'Hexagonal', 'TDD'],
  },
];

const SKILLS = [
  { cat: 'Languages', tags: ['Java 17'] },
  { cat: 'Backend & Frameworks', tags: ['Spring Boot', 'Spring Framework', 'eGovFrame 4.3', 'Spring Security'] },
  { cat: 'Frontend (Learning)', tags: ['React', 'Next.js'] },
  { cat: 'Database', tags: ['Oracle', 'PostgreSQL 16', 'Tibero 5/6'] },
  { cat: 'Infrastructure & Cloud', tags: ['Kubernetes (K-PaaS)', 'Docker', 'Tomcat', 'GCP'] },
  { cat: 'DevOps & Observability', tags: ['Jenkins', 'GitLab CI/CD', 'Git', 'Prometheus', 'Grafana', 'Loki'] },
  { cat: 'Architecture & Methodology', tags: ['DDD', 'Hexagonal Architecture', 'TDD', 'MSA', 'HA Design', 'Distributed Systems', 'SOLID'] },
];
const AI_SKILL = { cat: 'AI Engineering (Harness)', tags: ['Claude Code', 'MCP', 'Skills', 'Hooks', 'Agent Teams', 'Sub-agents', 'Harness Engineering'] };

const NAV = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'case-study', label: 'Case Study' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

window.PORTFOLIO_DATA = { STARRED, MINOR, FEATURED_PROJECTS, SKILLS, AI_SKILL, NAV };
