# Navigation + Video Integration

이 문서는 현재 `tdch_web`이 `tdch_api`의 공개 메뉴와 영상 API를 연결하는 기준을 정리한다.

## Current Contract

- 메뉴 원본은 `tdch_api`의 `site_navigation` 데이터와 `GET /api/v1/public/menu` 응답이다.
- 프론트 서버 컴포넌트와 Next Route Handler는 `API_BASE_URL`을 사용한다.
- 브라우저에서 직접 API 서버로 호출해야 하는 기능은 `NEXT_PUBLIC_API_BASE_URL`을 사용한다.
- 영상 목록과 상세는 `/videos/...` 공개 경로를 기준으로 렌더링한다.
- 업로드 정적 파일은 API 서버의 `/upload/...` 공개 경로를 기준으로 렌더링한다.

## Admin/Ops

- Vercel 운영 환경 변수에는 `API_BASE_URL=https://api.tdch.co.kr`와 `NEXT_PUBLIC_API_BASE_URL=https://api.tdch.co.kr`를 함께 등록한다.
- `ADMIN_SYNC_KEY`는 `tdch_api` 운영 `.env` 값과 동일해야 한다.
- 이전 `MEDIA_*` 계열 API base URL 이름은 사용하지 않는다.
- 운영 nginx 업로드 정적 서빙은 `tdch_api/deploy/nginx/tdch-upload-http-context.conf`와 `tdch_api/deploy/nginx/api.tdch.co.kr.conf` 조합을 따른다.

## Final Status

- 현재 기준 공개 메뉴 API는 `/api/v1/public/menu`다.
- 현재 기준 업로드 공개 경로는 `/upload`다.
- `/media` 공개 경로와 `MEDIA_*` API base URL 환경 변수는 사용하지 않는다.
