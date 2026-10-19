# 대천침례교회 웹사이트

`tdch_web`은 대천침례교회 공개 사이트와 관리자 CMS를 제공하는 Next.js 15 프로젝트입니다.

## 개요

- 공개 사이트: 정적 페이지, 게시판, 영상 플레이리스트, 오시는 길
- 관리자: 게시판 관리, 메뉴 관리, 업로드 토큰 기반 자산 업로드
- 배포 구조: 프론트는 Vercel, API는 `tdch_api`

## 기술 스택

- Next.js 15
- React 19
- TypeScript 5
- Tailwind CSS 3
- Tiptap 3
- Auth.js / next-auth

## 시작하기

```bash
npm install
cp .env.example .env.local
npm run dev
```

- 개발 서버: `http://localhost:3000`

## 주요 스크립트

```bash
npm run dev
npm run build
npm run start
npm run test:contract
npm run test
```

- `npm run test:contract`: 계약 테스트 실행
- `npm run test`: 계약 테스트 + 타입체크 실행

## 환경 변수

로컬 개발은 `.env.local`, 운영 배포는 Vercel Environment Variables를 사용합니다.

핵심 계약:

- `API_BASE_URL`: 서버 컴포넌트, route handler, rewrite가 사용하는 백엔드 주소
- `NEXT_PUBLIC_API_BASE_URL`: 브라우저에서 직접 접근해야 하는 공개 API 주소
- `AUTH_SECRET`: 관리자 세션 서명 키
- `ADMIN_SYNC_KEY`: 관리자 API 연동 키
- `NEXT_PUBLIC_SITE_URL`: 공개 사이트 canonical 기준 주소

현재 프로젝트는 서버/브라우저 API base URL 계약을 분리했습니다.

- 서버 전용 로직은 `API_BASE_URL`만 사용
- 브라우저 전용 로직은 `NEXT_PUBLIC_API_BASE_URL`만 사용
- `production`에서는 필수 값 누락 시 fail-fast로 동작

샘플 파일:

- [`.env.example`](/Users/hanwool/ground/Palm%20Lab/TDCH/tdch_web/.env.example)
- [`.env.production.example`](/Users/hanwool/ground/Palm%20Lab/TDCH/tdch_web/.env.production.example)

## 현재 구조

주요 디렉터리:

- [`src/app`](/Users/hanwool/ground/Palm%20Lab/TDCH/tdch_web/src/app): App Router 엔트리
- [`src/components`](/Users/hanwool/ground/Palm%20Lab/TDCH/tdch_web/src/components): 공용 UI, 공개/관리자 컴포넌트
- [`src/lib`](/Users/hanwool/ground/Palm%20Lab/TDCH/tdch_web/src/lib): API 연동, 캐시 정책, 설정, 에디터 유틸
- [`docs`](/Users/hanwool/ground/Palm%20Lab/TDCH/tdch_web/docs): 웹 프로젝트 내부 문서

주요 공개 흐름:

- 공개 catch-all 라우트: [`src/app/(site)/[...segments]/page.tsx`](/Users/hanwool/ground/Palm%20Lab/TDCH/tdch_web/src/app/%28site%29/%5B...segments%5D/page.tsx)
- 메뉴 path 해석: [`src/lib/public-menu-api.ts`](/Users/hanwool/ground/Palm%20Lab/TDCH/tdch_web/src/lib/public-menu-api.ts)
- 게시판 API: [`src/lib/public-board-api.ts`](/Users/hanwool/ground/Palm%20Lab/TDCH/tdch_web/src/lib/public-board-api.ts)
- 영상 API: [`src/lib/videos-api.ts`](/Users/hanwool/ground/Palm%20Lab/TDCH/tdch_web/src/lib/videos-api.ts)
- 공개 캐시 정책: [`src/lib/public-cache-policy.ts`](/Users/hanwool/ground/Palm%20Lab/TDCH/tdch_web/src/lib/public-cache-policy.ts)

주요 관리자 흐름:

- 게시판 관리 페이지: [`src/app/(admin)/admin/(cms)/boards/page.tsx`](/Users/hanwool/ground/Palm%20Lab/TDCH/tdch_web/src/app/%28admin%29/admin/%28cms%29/boards/page.tsx)
- 게시판 관리 클라이언트: [`src/app/(admin)/admin/(cms)/boards/_components/board-management-client.tsx`](/Users/hanwool/ground/Palm%20Lab/TDCH/tdch_web/src/app/%28admin%29/admin/%28cms%29/boards/_components/board-management-client.tsx)

## 최근 정리 사항

이번 기준으로 반영된 주요 리팩토링:

- 서버/브라우저 API base URL 계약 분리
- 공개 업로드 자산 경로를 same-origin `/upload/*` 기준으로 통일
- 공개 첨부 다운로드를 `storedPath` 직접 노출 방식에서 검증형 다운로드로 변경
- 미사용 `static-map` 프록시 제거
- 공개 catch-all 라우트의 canonical/metadata/route-state 해석 공통화
- 공개 캐시 정책 공통화 및 `force-dynamic` 제거
- `public-request-cache`를 request-local 스코프로 격리
- `package.json`에 `"type": "module"` 추가로 Node 테스트 경고 제거

## 디자인 기준

요약 원칙:

- 색상은 `src/app/globals.scss`와 `tailwind.config.ts`에 정의된 공용 팔레트를 사용
- 타이포는 임의 크기보다 `type-*` 토큰을 우선 사용
- 제목 계열은 `font-section-title`, 본문은 `font-sans` 기준 유지

팔레트 요약:

- `background`: `#ffffff`
- `surface`: `#e9f1ff`
- `surface-soft`: `#dbe8ff`
- `ink`: `#10213f`
- `cedar`: `#2a4f8f`
- `clay`: `#3f74c7`
- `gold`: `#6ca6f0`
- `moss`: `#2f6f9e`

타이포 요약:

- 페이지/섹션 제목: `.type-page-title`, `.type-section-title`
- 중간 제목: `.type-subsection-title`, `.type-card-title`
- 본문: `.type-body`, `.type-body-small`
- 라벨: `.type-label`

상세 문서:

- [Typography Policy](docs/typography-policy.md)
- [Typography Common Components PRD](docs/typography-common-components-prd.md)

## 업로드와 자산 처리 원칙

- 공개 본문 이미지 URL은 same-origin `/upload/*` 경로를 사용
- 게시글 첨부 다운로드는 공개 게시글 자산 검증 후 프록시
- 에디터 본문은 `publicUrl`이 아니라 asset metadata 중심으로 저장

관련 파일:

- [`src/lib/upload-path.ts`](/Users/hanwool/ground/Palm%20Lab/TDCH/tdch_web/src/lib/upload-path.ts)
- [`src/app/api/public/attachments/download/route.ts`](/Users/hanwool/ground/Palm%20Lab/TDCH/tdch_web/src/app/api/public/attachments/download/route.ts)
- [`src/lib/admin-board-editor-content.ts`](/Users/hanwool/ground/Palm%20Lab/TDCH/tdch_web/src/lib/admin-board-editor-content.ts)

## 관리자 로그인

관리자 로그인(`/admin/login`)은 계정 기반으로 동작합니다.

필수 값:

- `AUTH_SECRET`
- `API_BASE_URL`
- `ADMIN_SYNC_KEY`

운영 시에는 `tdch_api`와 동일한 인증/관리자 키 계약을 유지해야 합니다.

## 배포 메모

- 프론트 운영: Vercel
- 백엔드 운영: `tdch_api`
- 점검 모드: `MAINTENANCE_MODE=true`
- 점검 시 `/api/*`, `/_next/*`, 정적 파일은 우회 대상 제외

## 문서

- [Navigation+Video Integration](docs/navigation-video-integration.md)
- [Typography Policy](docs/typography-policy.md)
- [Typography Common Components PRD](docs/typography-common-components-prd.md)

외부 문서:

- 공개 사이트 리팩토링 결과: [`../docs/public-site-refactor-status-2026-04-27.md`](/Users/hanwool/ground/Palm%20Lab/TDCH/docs/public-site-refactor-status-2026-04-27.md)

## 테스트 상태

현재 기준:

- `npm run test:contract` 통과
- `npm run test` 통과 가능 상태
