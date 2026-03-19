# The 제자교회 웹사이트 (MVP)

소규모 개척교회 운영에 맞춘 웹사이트 기본 템플릿입니다.

## 단계 1) 프로젝트 세팅

```bash
npm install
cp .env.example .env
npm run dev
```

개발 서버: `http://localhost:3000`

## 단계 2) 페이지 구조 (IA)

- `/` 홈
- `/about` 교회소개
- `/sermons` 말씀/설교
- `/news` 교회소식
- `/newcomer` 새가족안내
- `/contact` 오시는 길/문의
- `/giving` 헌금안내

## 단계 3) 인프라 세팅 (Docker + Caddy)

```bash
cp .env.example .env
# 실제 도메인 입력
# DOMAIN=church.example.org
docker compose up -d --build
```

`infra/Caddyfile`은 `.env`의 `DOMAIN`을 읽어 라우팅합니다.
실배포 시 `DOMAIN`만 실제 도메인으로 바꾸면 Caddy가 HTTPS 인증서를 자동 발급합니다.

## 단계 4) 배포 자동화 (GitHub Actions)

- `CI`: PR/메인 브랜치에서 lint + build 검증
- `Deploy`: 메인 브랜치 푸시 시 배포 서버에서 `docker compose up -d --build`

필요한 GitHub Secrets:

- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_SSH_KEY`
- `DEPLOY_PORT`
- `DEPLOY_PATH`

## 단계 5) 운영 데이터 수정 위치

- 연락처/계좌/링크: `.env`
- 예배시간/설교/공지 기본 데이터: `src/lib/site-data.ts`

이후 단계로 CMS 도입(예: Sanity/Notion API) 또는 관리자 페이지를 연결할 수 있습니다.

## 디자인 팔레트

기본 팔레트는 `tailwind.config.ts`와 `src/app/globals.css`에서 함께 관리합니다.

- `Background`: `#f3f3f2`
- `Surface`: `#e9f1ff`
- `Surface Soft`: `#dbe8ff`
- `Ink` (기본 텍스트): `#10213f`
- `Cedar` (보조 텍스트/테두리): `#2a4f8f`
- `Clay` (포인트/CTA): `#3f74c7`
- `Gold` (하이라이트): `#6ca6f0`
- `Moss` (보조 강조): `#2f6f9e`

사용 원칙:

- 배경/카드 톤은 `globals.css`의 CSS 변수(`--color-*`, `--surface-*`)를 우선 사용
- 컴포넌트 색상 클래스는 Tailwind 팔레트(`ink`, `cedar`, `clay` 등) 사용
- 기존 클래스 호환을 위해 레거시 별칭(`ivory`, `ink`, `cedar`, `moss`, `clay`, `gold`) 유지

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
