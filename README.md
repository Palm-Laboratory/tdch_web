# The 제자교회 웹사이트 (MVP)

소규모 개척교회 운영에 맞춘 웹사이트 기본 템플릿입니다.

## 단계 1) 프로젝트 세팅

```bash
npm install
cp .env.example .env.local
npm run dev
```

개발 서버: `http://localhost:3000`

## 단계 2) 현재 페이지 구조

- `/` 홈
- `/about` 교회소개 진입 경로 (`/about/greeting` 으로 리다이렉트)
- `/about/greeting` 인사말/비전
- `/about/pastor` 담임목사 소개
- `/about/service-times` 예배 시간 안내
- `/about/location` 오시는 길/문의
- `/about/history` 교회 연혁
- `/about/giving` 헌금 안내
- `/newcomer` 새가족 안내
- `/newcomer/care` 새가족 양육
- `/newcomer/disciples` 제자훈련/교육 과정

## 단계 3) 배포 구성 (Vercel + Oracle VM)

- 프론트엔드: Vercel
- 백엔드 API / DB: Oracle VM
- GitHub Actions: PR/메인 브랜치에서 lint + build 검증
- 프론트 배포: `main` 브랜치 푸시 후 Vercel이 자동 배포

운영 환경변수 설정 위치:

- 로컬 개발: `.env.local`
- 프론트 운영: Vercel Project Settings > Environment Variables
- 백엔드 운영: Oracle VM `/opt/tdch/.env`

점검 모드 운영:

- `MAINTENANCE_MODE=true` 로 배포하면 일반 페이지 요청은 `/maintenance.html` 로 우회됩니다.
- `/api/*`, `/_next/*`, 정적 파일 요청은 우회 대상에서 제외됩니다.
- 점검 해제 시 `MAINTENANCE_MODE=false` 로 되돌리고 다시 배포합니다.
- 점검 페이지 파일 위치: `public/maintenance.html`

## 관리자 로그인 설정

관리자 로그인(`/admin/login`)은 아이디/비밀번호 기반 계정으로만 동작합니다.

필수 값:

- `AUTH_SECRET`: Auth.js 세션 서명 키
- `ADMIN_SESSION_MAX_AGE_SECONDS`: 관리자 세션 유지 시간. 기본값 `28800`(8시간)
- `ADMIN_SYNC_KEY`: 관리자 API 호출용 서버 키. `tdch_api`와 동일해야 함
- `API_BASE_URL`: 관리자 인증/계정 API가 연결될 백엔드 주소

확인 순서:

1. `cp .env.example .env.local`
2. `.env.local`의 관리자 로그인 관련 값을 실제 값으로 교체
3. `tdch_api` DB에 초기 관리자 계정을 직접 생성
4. `npm run dev` 후 `/admin/login`에서 로그인 확인

운영 배포 체크:

- Vercel `Environment Variables`에 [`tdch_web/.env.production.example`](/Users/hanwool/ground/Palm%20Lab/TDCH/tdch_web/.env.production.example) 기준으로 입력
- `NEXTAUTH_URL=https://www.tdch.co.kr`
- `NEXT_PUBLIC_SITE_URL=https://www.tdch.co.kr`
- `API_BASE_URL=https://api.tdch.co.kr`
- `NEXT_PUBLIC_API_BASE_URL=https://api.tdch.co.kr`
- `ADMIN_SYNC_KEY`는 `tdch_api` 운영값과 동일하게 유지

운영에서 관리자 계정을 바꾸는 방법:

- `tdch_api`의 관리자 계정 데이터를 수정
- 변경 후 관리자 로그인 재검증

## 단계 4) 운영 데이터 수정 위치

- 연락처/계좌/링크: `.env.local` (로컬) / Vercel Environment Variables (운영)
- 예배시간/공지 기본 데이터: `src/lib/site-data.ts`
- 사이트 메뉴 원본: 백엔드 `site_navigation` + `GET /api/v1/public/menu`
- 설교/영상 데이터: `API_BASE_URL` 로 연결된 백엔드 API

지도/연락처 관련 주요 환경변수:

- `API_BASE_URL`: 백엔드 API 주소
- `NEXT_PUBLIC_API_BASE_URL`: 브라우저/클라이언트 컴포넌트용 API 주소
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SITE_NAME`
- `NEXT_PUBLIC_SITE_TAGLINE`
- `NEXT_PUBLIC_CHURCH_PHONE`
- `NEXT_PUBLIC_CHURCH_EMAIL`
- `NEXT_PUBLIC_CHURCH_ADDRESS`
- `NEXT_PUBLIC_CHURCH_ADDRESS_STREET`
- `NEXT_PUBLIC_CHURCH_ADDRESS_LOCALITY`
- `NEXT_PUBLIC_CHURCH_ADDRESS_REGION`
- `NEXT_PUBLIC_CHURCH_POSTAL_CODE`
- `NEXT_PUBLIC_CHURCH_COUNTRY`
- `NEXT_PUBLIC_NAVER_MAP_URL`
- `NEXT_PUBLIC_KAKAO_MAP_URL`
- `NEXT_PUBLIC_CHURCH_LAT`
- `NEXT_PUBLIC_CHURCH_LNG`
- `NEXT_PUBLIC_YOUTUBE_URL`
- `NEXT_PUBLIC_YOUTUBE_LABEL`
- `NEXT_PUBLIC_GIVING_BANK`
- `NEXT_PUBLIC_GIVING_OWNER`
- `NEXT_PUBLIC_NEWCOMER_CONTACT_DEPARTMENT`
- `NEXT_PUBLIC_NEWCOMER_CONTACT_APPLY_TEXT`
- `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`: 브라우저 동적 지도 SDK용 공개 키
- `NAVER_MAP_CLIENT_ID`
- `NAVER_MAP_CLIENT_SECRET`

운영 원칙:

- 브라우저에서 직접 쓰는 동적 지도 키는 `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` 를 사용합니다.
- 서버에서 정적 지도 이미지를 호출할 때만 `NAVER_MAP_CLIENT_ID`, `NAVER_MAP_CLIENT_SECRET` 를 사용합니다.

이후 단계로 CMS 도입(예: Sanity/Notion API) 또는 관리자 페이지를 연결할 수 있습니다.

## 메뉴 문서

- [Navigation+Video Integration](docs/navigation-video-integration.md)

## 디자인 팔레트

기본 팔레트는 `tailwind.config.ts`와 `src/app/globals.scss`에서 함께 관리합니다.

- `Background`: `#f3f3f2`
- `Surface`: `#e9f1ff`
- `Surface Soft`: `#dbe8ff`
- `Ink` (기본 텍스트): `#10213f`
- `Cedar` (보조 텍스트/테두리): `#2a4f8f`
- `Clay` (포인트/CTA): `#3f74c7`
- `Gold` (하이라이트): `#6ca6f0`
- `Moss` (보조 강조): `#2f6f9e`

사용 원칙:

- 배경/카드 톤은 `globals.scss`의 CSS 변수(`--color-*`, `--surface-*`)를 우선 사용
- 컴포넌트 색상 클래스는 Tailwind 팔레트(`ink`, `cedar`, `clay` 등) 사용
- 기존 클래스 호환을 위해 레거시 별칭(`ivory`, `ink`, `cedar`, `moss`, `clay`, `gold`) 유지

## 타이포 기준

이 프로젝트는 당분간 `clamp()` 기반 fluid typography 대신, 고정 `rem` + `md`/`lg` 브레이크포인트 조합을 사용합니다.

상세 문서:

- [Typography Policy](docs/typography-policy.md)

루트 기준:

- `html` 루트 `font-size`는 기본값 `100%`를 유지합니다.
- 별도 지정이 없으므로 현재 기준은 `1rem = 16px`입니다.
- `62.5%` 루트 스케일은 사용하지 않습니다.
- 이유: Tailwind 기본 spacing, gap, radius, text scale이 전부 `rem` 기반이라 루트만 `62.5%`로 바꾸면 사이트 전체 크기가 의도와 다르게 축소됩니다.

운영 원칙:

- 타이포는 의미 단위로 관리합니다. 숫자값을 페이지마다 임의로 새로 만들지 않습니다.
- 본문은 가능한 한 좁은 범위의 고정 `rem` 값을 사용합니다.
- 제목은 `base`, `md`, 필요 시 `lg`에서만 단계적으로 키웁니다.
- `clamp()`, `vw`, `zoom`, 브라우저 자동 스케일에 의존한 타이포는 새 코드에서 기본 전략으로 사용하지 않습니다.
- 한 페이지 안에서는 동일한 역할의 텍스트가 같은 축을 사용해야 합니다.
- 폰트는 Tailwind에 등록된 클래스만 사용합니다. `font-sans`, `font-serif`, `font-section-title`
- `font-[var(--font-sans)]`, `font-[var(--font-serif)]` 같은 arbitrary value 직접 참조는 새 코드에서 사용하지 않습니다.
- 새 폰트를 추가할 때는 `layout.tsx`의 `next/font` variable 선언 -> 루트 연결 -> `tailwind.config.ts`의 `fontFamily` 등록 순서를 따릅니다.
- 상세 절차와 예시는 [Typography Policy](docs/typography-policy.md)의 `폰트 추가 및 등록 방법`을 기준으로 합니다.

권장 타입 스케일:

- `display`: `2.125rem` / `md: 3rem`
- `h1`: `1.75rem` / `md: 1.875rem` / `lg: 2.5rem`
- `h2`: `1.5rem` / `md: 1.75rem` / `lg: 2.125rem`
- `subsection`: `1.3125rem` / `md: 1.4375rem` / `lg: 1.5625rem`
- `block-title`: `1.21875rem` / `md: 1.40625rem` / `lg: 1.5rem`
- `h3`: `1.125rem` / `md: 1.375rem`
- `lead`: `1.125rem` / `md: 1.1875rem`
- `body`: `1rem`
- `body-strong`: `1.0625rem`
- `body-small`: `0.9375rem`
- `label`: `0.75rem` / `md: 0.9375rem`
- `eyebrow`: `1.125rem` / `md: 1.25rem`

전역 타입 토큰:

- `.type-page-title`: 페이지 대표 타이틀
- `.type-section-title`: 섹션 타이틀
- `.type-subsection-title`: 섹션 내 중간 제목
- `.type-block-title`: 블록/아코디언/단계 제목
- `.type-card-title`: 카드/블록 제목
- `.type-lead`: 강조 본문
- `.type-body`: 기본 본문
- `.type-body-strong`: 조금 더 큰 본문
- `.type-body-small`: 보조 본문 / 메타 정보
- `.type-label`: 작은 라벨
- `.type-eyebrow`: 큰 섹션 overline
- `.type-display-number`: 큰 배경 숫자

권장 적용 예시:

- 페이지 대표 타이틀: `className="type-page-title font-section-title ..."`
- 섹션 타이틀: `className="type-section-title font-section-title ..."`
- 중간 제목: `className="type-subsection-title ..."`
- 블록 제목: `className="type-block-title ..."`
- 카드 제목: `className="type-card-title font-section-title ..."`
- 본문: `className="type-body font-sans ..."`
- 강조 본문: `className="type-lead ..."`
- 라벨: `className="type-label ..."`

지양 예시:

- 같은 역할의 제목인데 페이지마다 `1.68rem`, `1.82rem`, `1.91rem`처럼 제각각 쓰는 패턴
- 루트 `font-size`를 바꿔 Tailwind 전체 scale을 흔드는 방식
- 본문에 과도한 fluid typography를 넣어 읽기 기준이 흔들리는 패턴
- `font-[var(--font-sans)]`, `font-[var(--font-serif)]`처럼 폰트를 직접 변수 참조로 쓰는 패턴

## 반응형 기준

이 프로젝트는 Tailwind 기본 브레이크포인트를 사용하지만, 운영 원칙은 아래 3단계를 기준으로 맞춥니다.

- `base`: 모바일 기본 스타일
- `md (768px+)`: 태블릿 레이아웃 변경
- `lg (1024px+)`: 데스크톱 레이아웃 변경
- `xl (1280px+)`: 와이드 데스크톱 보정만 허용

운영 원칙:

- 기본 스타일은 모바일 기준으로 작성합니다.
- 레이아웃 변화는 가능하면 `md`, `lg`에서만 처리합니다.
- `sm`은 작은 모바일 미세 조정에만 제한적으로 사용합니다.
- `xl`은 컨테이너 폭, 간격, 타이포 같은 와이드 화면 보정에만 사용합니다.
- `2xl`은 새 코드에서 기본적으로 사용하지 않습니다. 정말 필요한 경우에만 예외로 둡니다.
- 같은 의미의 분기를 여러 컴포넌트에서 제각각 반복하지 않습니다.

권장 예시:

- 모바일 1열, 태블릿 2열, 데스크톱 3열: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- 모바일 기본 텍스트, 태블릿 확대, 데스크톱 확대: `text-base md:text-lg lg:text-xl`
- 와이드 화면 미세 보정: `lg:px-8 xl:px-10`

지양 예시:

- 작은 폭 변화마다 `sm/md/lg/xl/2xl`를 모두 섞어 쓰는 패턴
- 페이지마다 서로 다른 폭에서 같은 UI가 뒤바뀌는 패턴
- `xl`에서 레이아웃 구조 자체를 다시 바꾸는 패턴

## 반응형 예외 현황

현재 `src` 기준으로 `sm`, `2xl` 사용은 정리되어 있습니다. 남아 있는 예외는 와이드 화면 보정용 `xl`만 있습니다.

`xl` 사용:

- 홈 히어로 타이포 확대: `src/app/page.tsx`
- 데스크톱 내비 간격 보정: `src/components/site-header.tsx`
- 데스크톱 사이드바 폭 보정: `src/components/side-nav.tsx`

`2xl` 사용:

- 현재 `src`에는 없음

## 컨테이너 폭 기준

본문 레이아웃의 기본 컨테이너는 `section-shell`입니다. 새 페이지를 만들 때는 페이지마다 임의의 `max-width` 값을 직접 만들기보다, 아래 폭 티어를 조합해서 사용합니다.

- 기본 본문: `section-shell`
- 좁은 본문: `section-shell section-shell--narrow`
- 넓은 본문: `section-shell section-shell--wide`
- 거의 풀폭: `section-shell section-shell--full`

정의 값:

- `section-shell`
  - `base`: `max-width: 1120px`, `padding-inline: 1rem`
  - `md (768px+)`: `padding-inline: 2rem`
  - `xl (1280px+)`: `max-width: 1200px`
  - `2xl (1536px+)`: `max-width: 1400px`
  - 사용 예시: 일반 소개 페이지, 기본 2단 이하 정보 섹션, 공통 본문 레이아웃
- `section-shell--narrow`
  - `base`: `max-width: 920px`
  - `xl (1280px+)`: `max-width: 980px`
  - `2xl (1536px+)`: `max-width: 1040px`
  - 사용 예시: 텍스트 중심 페이지, 방문 안내/소개문, 단일 컬럼 위주의 콘텐츠, 집중해서 읽게 해야 하는 페이지
- `section-shell--wide`
  - `base`: `max-width: 1280px`
  - `xl (1280px+)`: `max-width: 1360px`
  - `2xl (1536px+)`: `max-width: 1480px`
  - 사용 예시: 표, 지도, 카드 그리드, 설교 목록, 가로 사용량이 큰 정보형 화면
- `section-shell--full`
  - 전 구간: `max-width: none`
  - 사용 예시: 히어로 배경 연출, 대형 이미지/미디어 섹션, 화면 폭 자체가 디자인 요소인 랜딩 블록

운영 원칙:

- 공통 기준 폭은 `src/app/globals.scss`의 `section-shell` 계열 클래스에서만 관리합니다.
- 페이지 컴포넌트 안에서 `max-w-[...]`를 새로 추가하는 방식은 예외적인 시각 연출이 아니면 지양합니다.
- 텍스트 중심 페이지, 안내성 단일 컬럼 페이지는 `narrow`를 우선 검토합니다.
- 표, 지도, 카드 그리드, 설교 목록처럼 가로 사용량이 큰 화면은 `wide`를 우선 검토합니다.
- 히어로, 배경 연출, 미디어 중심 섹션처럼 의도적으로 화면을 넓게 써야 하는 경우에만 `full` 또는 별도 레이아웃을 사용합니다.
- 헤더, 푸터, 브레드크럼과 본문 축이 크게 어긋나지 않도록 유지합니다.

현재 적용 예시:

- `narrow`: `src/app/newcomer/page.tsx`, `src/app/about/giving/page.tsx`

## 새 화면 체크리스트

새 페이지나 새 섹션을 만들 때는 아래 순서로 반응형을 맞춥니다.

- 모바일 단일 컬럼 기준으로 먼저 완성합니다.
- 태블릿 구조 변경은 `md`에서만 넣습니다.
- 데스크톱 구조 변경은 `lg`에서만 넣습니다.
- `xl`은 와이드 화면에서의 폭, 간격, 타이포 보정에만 사용합니다.
- 새 코드에서는 `sm`, `2xl`를 기본적으로 사용하지 않습니다.
- 반복되는 패턴은 기존 화면의 브레이크포인트 기준과 맞춥니다.
- 카드, 리스트, 표, 내비게이션은 `768px`, `1024px`, `1280px` 근처에서 직접 확인합니다.

권장 패턴:

- 컬럼 수 변화: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- 방향 전환: `flex-col md:flex-row`
- 간격 확대: `px-4 md:px-8 lg:px-10`
- 제목 확대: `text-2xl md:text-4xl lg:text-5xl`
- 데스크톱 전용 요소: `hidden lg:block`
- 모바일/태블릿 전용 요소: `lg:hidden`
