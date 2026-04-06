# Navigation Admin API Spec

## 목적

관리자 CMS 내비게이션 기능 구현을 위한 1차 관리자 API 스펙이다.

대상 범위:

- 관리자 목록 조회
- 메뉴 생성/수정
- 숨김/표시
- 형제 정렬 변경
- 기본 진입 메뉴 지정
- `content_menu` 연결 조회

공개 API `GET /api/v1/navigation` 은 유지하고, 본 문서는 관리자 전용 API만 다룬다.

---

## 기본 전제

- 브라우저는 Spring 관리자 API를 직접 호출하지 않는다.
- 브라우저는 Next.js BFF (`/api/admin/navigation/*`) 만 호출한다.
- Next.js BFF 는 관리자 세션을 검증한 뒤 서버에서 `X-Admin-Key` 를 붙여 Spring API를 호출한다.
- 삭제는 1차 범위에서 지원하지 않고 `visible=false` 로 처리한다.
- 트리 구조는 `root -> child` 2단계만 허용한다.
- 기존 root 키 `about`, `sermons`, `newcomer` 는 예약값으로 간주한다.

---

## 공통 응답 모델

### 1. 관리자 트리 항목

```json
{
  "id": 1,
  "parentId": null,
  "menuKey": "about",
  "label": "교회 소개",
  "href": "/about",
  "matchPath": "/about",
  "linkType": "INTERNAL",
  "contentSiteKey": null,
  "visible": true,
  "headerVisible": true,
  "mobileVisible": true,
  "lnbVisible": true,
  "breadcrumbVisible": true,
  "defaultLanding": false,
  "sortOrder": 10,
  "updatedAt": "2026-04-06T18:30:00+09:00",
  "children": []
}
```

필드:

- `id`: PK
- `parentId`: root 이면 `null`
- `menuKey`: 생성 후 수정 불가
- `label`
- `href`
- `matchPath`
- `linkType`: `INTERNAL | ANCHOR | EXTERNAL | CONTENT_REF`
- `contentSiteKey`
- `visible`
- `headerVisible`
- `mobileVisible`
- `lnbVisible`
- `breadcrumbVisible`
- `defaultLanding`: child 만 의미 있음
- `sortOrder`
- `updatedAt`
- `children`: 관리자 목록 조회에서만 사용

### 2. 관리자 트리 응답

`GET /api/v1/admin/navigation/items`

```json
{
  "groups": [
    {
      "id": 1,
      "parentId": null,
      "menuKey": "about",
      "label": "교회 소개",
      "href": "/about",
      "matchPath": "/about",
      "linkType": "INTERNAL",
      "contentSiteKey": null,
      "visible": true,
      "headerVisible": true,
      "mobileVisible": true,
      "lnbVisible": true,
      "breadcrumbVisible": true,
      "defaultLanding": false,
      "sortOrder": 10,
      "updatedAt": "2026-04-06T18:30:00+09:00",
      "children": [
        {
          "id": 2,
          "parentId": 1,
          "menuKey": "about-greeting",
          "label": "인사말/비전",
          "href": "/about/greeting",
          "matchPath": "/about/greeting",
          "linkType": "INTERNAL",
          "contentSiteKey": null,
          "visible": true,
          "headerVisible": true,
          "mobileVisible": true,
          "lnbVisible": true,
          "breadcrumbVisible": true,
          "defaultLanding": true,
          "sortOrder": 10,
          "updatedAt": "2026-04-06T18:30:00+09:00",
          "children": []
        }
      ]
    }
  ]
}
```

### 3. 공통 오류 응답

Spring 은 기존 `ApiErrorResponse` 구조를 유지한다.

```json
{
  "code": "INVALID_REQUEST",
  "message": "기본 진입 메뉴는 같은 그룹에서 하나만 선택할 수 있습니다.",
  "timestamp": "2026-04-06T18:31:00+09:00"
}
```

주요 오류 코드:

- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `INVALID_REQUEST`
- `INTERNAL_SERVER_ERROR`

---

## 1. 목록 조회

`GET /api/v1/admin/navigation/items`

### 쿼리

- `includeHidden`: `true | false`, 기본 `true`

### 동작

- root 와 child 를 트리로 묶어 반환한다.
- `includeHidden=false` 면 `visible=true` 항목만 반환한다.
- 관리자 화면 초기 진입 시 사용하는 기본 API다.

### 응답

- `200 OK`
- 본문: `AdminNavigationTreeResponse`

---

## 2. 단건 조회

`GET /api/v1/admin/navigation/items/{id}`

### 동작

- 편집 패널 진입 시 사용한다.
- root/child 공통 폼 데이터를 반환한다.

### 응답

`200 OK`

```json
{
  "id": 12,
  "parentId": 1,
  "menuKey": "about-location",
  "label": "오시는 길",
  "href": "/about/location#map",
  "matchPath": "/about/location",
  "linkType": "ANCHOR",
  "contentSiteKey": null,
  "visible": true,
  "headerVisible": true,
  "mobileVisible": true,
  "lnbVisible": true,
  "breadcrumbVisible": true,
  "defaultLanding": false,
  "sortOrder": 40,
  "updatedAt": "2026-04-06T18:30:00+09:00"
}
```

에러:

- `404 NOT_FOUND`

---

## 3. 메뉴 생성

`POST /api/v1/admin/navigation/items`

### 요청 본문

```json
{
  "parentId": 1,
  "menuKey": "about-location-contact",
  "label": "오시는 길/문의",
  "href": "/about/location",
  "matchPath": "/about/location",
  "linkType": "INTERNAL",
  "contentSiteKey": null,
  "visible": true,
  "headerVisible": true,
  "mobileVisible": true,
  "lnbVisible": true,
  "breadcrumbVisible": true,
  "defaultLanding": false
}
```

### 규칙

- root 생성 시 `parentId=null`
- child 생성 시 부모는 root 여야 함
- `menuKey` 는 unique
- `defaultLanding=true` 는 child 에만 허용
- `linkType=CONTENT_REF` 이면 `contentSiteKey` 필수
- `linkType=EXTERNAL` 이면 `href` 는 `https://` 로 시작
- `linkType=INTERNAL` 또는 `ANCHOR` 이면 `href` 는 `/` 로 시작
- `linkType=ANCHOR` 이면 `matchPath` 는 hash 없는 경로 권장

### 응답

- `201 Created`
- 본문: 생성된 `AdminNavigationItem`

### 에러 예시

- `400 INVALID_REQUEST`: 잘못된 부모, 잘못된 링크 타입 조합, 기본 진입 메뉴 충돌
- `404 NOT_FOUND`: `parentId` 또는 `contentSiteKey` 대상 없음

---

## 4. 메뉴 수정

`PATCH /api/v1/admin/navigation/items/{id}`

### 요청 본문

모든 필드는 optional 이고, 전달된 필드만 수정한다.

```json
{
  "label": "인사말",
  "href": "/about/greeting",
  "matchPath": "/about/greeting",
  "linkType": "INTERNAL",
  "contentSiteKey": null,
  "headerVisible": true,
  "mobileVisible": true,
  "lnbVisible": true,
  "breadcrumbVisible": true,
  "defaultLanding": true
}
```

### 수정 가능 필드

- `label`
- `href`
- `matchPath`
- `linkType`
- `contentSiteKey`
- `visible`
- `headerVisible`
- `mobileVisible`
- `lnbVisible`
- `breadcrumbVisible`
- `defaultLanding`

### 수정 불가 필드

- `id`
- `menuKey`
- `parentId`

### 응답

- `200 OK`
- 본문: 수정된 `AdminNavigationItem`

---

## 5. 숨김/표시 토글

`PATCH /api/v1/admin/navigation/items/{id}/visibility`

### 요청 본문

```json
{
  "visible": false
}
```

### 규칙

- root 숨김 시 공개 메뉴에서는 해당 root와 모든 child가 사라진다.
- 기본 진입 child 를 숨기는 경우 서버는 아래 중 하나를 수행해야 한다.
  - 같은 그룹의 다른 visible child 를 기본 진입으로 승격
  - 또는 저장을 거부하고 새 기본 진입 선택을 요구

1차 권장안:

- 자동 승격 없이 저장 거부

### 응답

- `200 OK`
- 본문: 수정된 `AdminNavigationItem`

---

## 6. 정렬 순서 변경

`PATCH /api/v1/admin/navigation/items/reorder`

### 요청 본문

```json
{
  "parentId": 1,
  "orderedItemIds": [11, 12, 13]
}
```

root 재정렬 예시:

```json
{
  "parentId": null,
  "orderedItemIds": [1, 4, 7]
}
```

### 규칙

- 요청에 포함된 항목은 모두 같은 `parentId` 를 가져야 한다.
- 서버는 전달된 순서대로 `sortOrder` 를 `10, 20, 30...` 식으로 재정규화한다.
- reorder 는 트랜잭션으로 처리한다.

### 응답

- `200 OK`

```json
{
  "parentId": 1,
  "orderedItemIds": [11, 12, 13]
}
```

---

## 7. 기본 진입 메뉴 지정

`PATCH /api/v1/admin/navigation/groups/{groupId}/default-landing`

### 요청 본문

```json
{
  "itemId": 12
}
```

### 규칙

- `groupId` 는 root 항목 ID
- `itemId` 는 해당 root 의 direct child 여야 함
- `itemId` 는 `visible=true` 여야 함
- 저장 시 같은 그룹 다른 child 의 `defaultLanding` 은 모두 `false` 로 정리

### 응답

- `200 OK`

```json
{
  "groupId": 1,
  "itemId": 12,
  "defaultLandingHref": "/about/location"
}
```

---

## 8. 콘텐츠 메뉴 목록 조회

`GET /api/v1/admin/navigation/content-menus`

### 용도

- `linkType=CONTENT_REF` 선택 시 드롭다운 옵션 로딩

### 응답

```json
{
  "items": [
    {
      "siteKey": "messages",
      "menuName": "말씀/설교",
      "slug": "messages",
      "contentKind": "LONG_FORM",
      "active": true
    },
    {
      "siteKey": "its-okay",
      "menuName": "그래도 괜찮아",
      "slug": "its-okay",
      "contentKind": "SHORT",
      "active": true
    }
  ]
}
```

규칙:

- 기본은 `active=true` 항목만 반환

---

## 9. Next.js BFF 매핑

브라우저는 아래 BFF 경로를 호출한다.

- `GET /api/admin/navigation/items`
- `GET /api/admin/navigation/items/:id`
- `POST /api/admin/navigation/items`
- `PATCH /api/admin/navigation/items/:id`
- `PATCH /api/admin/navigation/items/:id/visibility`
- `PATCH /api/admin/navigation/items/reorder`
- `PATCH /api/admin/navigation/groups/:groupId/default-landing`
- `GET /api/admin/navigation/content-menus`

공통 BFF 규칙:

- 관리자 세션 없으면 `401`
- Spring 오류 코드를 그대로 중계
- `X-Admin-Key` 는 서버에서만 추가

---

## 10. 구현 메모

- 공개 `GET /api/v1/navigation` DTO 는 유지한다.
- 관리자 API DTO 는 `id`, `parentId`, `sortOrder`, `updatedAt`, `children` 을 추가한다.
- `menuKey` 변경 불가 정책은 UI와 API 모두에서 막는다.
- `/about`, `/sermons`, `/newcomer` root 키는 코드 참조 중이므로 예약값으로 취급한다.
- 구조 변경 시 `src/lib/site-data.ts` fallback 과 괴리가 생길 수 있으므로 운영 문서에도 반영이 필요하다.
