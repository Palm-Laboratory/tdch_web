# YouTube 콘텐츠 연동 아키텍처 초안

## 목적

교회 유튜브 채널의 재생목록을 기준으로 사이트의 `예배 영상` 하위 메뉴를 자동 운영한다.

- `말씀/설교` = 일반 영상 재생목록
- `더 좋은 묵상` = 일반 영상 재생목록
- `그래도 괜찮아` = 쇼츠 전용 재생목록

운영 목표는 다음과 같다.

- 운영자는 유튜브 업로드와 재생목록 편성만 하면 된다.
- 사이트는 백엔드가 유튜브 데이터를 동기화한 결과만 조회한다.
- 사이트 전용 정보만 별도로 편집할 수 있다.
- 유튜브 제목, 썸네일, 순서가 바뀌어도 서비스 운영이 깨지지 않는다.

## 권장 원칙

- 유튜브는 원본 콘텐츠 저장소로 사용한다.
- 서비스 DB는 유튜브 데이터를 동기화한 읽기 모델 + 사이트 전용 메타데이터를 저장한다.
- 프론트엔드는 유튜브 API를 직접 호출하지 않는다.
- 메뉴와 URL slug는 서비스에서 고정하고, 유튜브 재생목록 제목과 분리한다.
- 사이트 기준 식별자는 `playlistId`, `videoId`를 사용한다. 재생목록명이나 영상 제목은 식별자로 사용하지 않는다.

## 도메인 모델

### 메뉴와 재생목록 매핑

하나의 사이트 메뉴는 하나의 유튜브 재생목록에 매핑된다.

| site_key | menu_name | content_kind | youtube_playlist_id |
| --- | --- | --- | --- |
| `messages` | 말씀/설교 | `LONG_FORM` | 실제 playlist id |
| `better-devotion` | 더 좋은 묵상 | `LONG_FORM` | 실제 playlist id |
| `its-okay` | 그래도 괜찮아 | `SHORT` | 실제 playlist id |

### 엔티티 개요

- `content_menu`
  - 사이트 하위 메뉴 정의
- `youtube_playlist`
  - 유튜브 재생목록 원본 정보
- `youtube_video`
  - 유튜브 영상 원본 정보
- `playlist_video`
  - 특정 재생목록에 포함된 영상과 순서
- `video_metadata`
  - 사이트 전용 편집 정보

## 테이블 스키마 초안

### 1. content_menu

```sql
create table content_menu (
    id bigserial primary key,
    site_key varchar(64) not null unique,
    menu_name varchar(100) not null,
    slug varchar(120) not null unique,
    content_kind varchar(20) not null,
    active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint chk_content_menu_kind
        check (content_kind in ('LONG_FORM', 'SHORT'))
);
```

### 2. youtube_playlist

```sql
create table youtube_playlist (
    id bigserial primary key,
    content_menu_id bigint not null references content_menu(id),
    youtube_playlist_id varchar(64) not null unique,
    title varchar(255) not null,
    description text,
    channel_id varchar(64),
    channel_title varchar(255),
    thumbnail_url text,
    item_count integer,
    sync_enabled boolean not null default true,
    last_synced_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
```

### 3. youtube_video

```sql
create table youtube_video (
    id bigserial primary key,
    youtube_video_id varchar(32) not null unique,
    title varchar(255) not null,
    description text,
    published_at timestamptz not null,
    channel_id varchar(64),
    channel_title varchar(255),
    thumbnail_url text,
    duration_seconds integer,
    privacy_status varchar(20),
    upload_status varchar(20),
    embeddable boolean not null default true,
    made_for_kids boolean,
    detected_kind varchar(20) not null,
    youtube_watch_url text not null,
    youtube_embed_url text not null,
    raw_payload jsonb,
    last_synced_at timestamptz not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint chk_youtube_video_kind
        check (detected_kind in ('LONG_FORM', 'SHORT'))
);
```

### 4. playlist_video

```sql
create table playlist_video (
    id bigserial primary key,
    youtube_playlist_id bigint not null references youtube_playlist(id),
    youtube_video_id bigint not null references youtube_video(id),
    position integer not null,
    added_to_playlist_at timestamptz,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (youtube_playlist_id, youtube_video_id),
    unique (youtube_playlist_id, position)
);
```

### 5. video_metadata

```sql
create table video_metadata (
    id bigserial primary key,
    youtube_video_id bigint not null unique references youtube_video(id),
    preacher varchar(120),
    scripture varchar(255),
    service_type varchar(100),
    summary text,
    tags text[] not null default '{}',
    visible boolean not null default true,
    featured boolean not null default false,
    pinned_rank integer,
    manual_title varchar(255),
    manual_thumbnail_url text,
    manual_published_date date,
    manual_kind varchar(20),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint chk_video_metadata_manual_kind
        check (manual_kind is null or manual_kind in ('LONG_FORM', 'SHORT'))
);
```

## 왜 이렇게 나누는가

- `youtube_video`
  - 유튜브 원본을 저장한다.
- `video_metadata`
  - 사이트에서만 필요한 편집 값을 저장한다.
- `playlist_video`
  - 하나의 영상이 여러 재생목록에 들어갈 수 있으므로 N:M 관계를 관리한다.
- `content_menu`
  - 사이트 메뉴와 유튜브 재생목록 연결을 서비스 규칙으로 고정한다.

이 구조면 유튜브 제목이 바뀌어도 사이트 수동 제목을 유지할 수 있고, 영상이 재생목록에서 빠져도 바로 데이터 삭제를 하지 않아 운영 복구가 쉽다.

## Spring 패키지 구조 제안

```text
com.thejejachurch.media
  ├─ domain
  │   ├─ menu
  │   ├─ playlist
  │   ├─ video
  │   └─ metadata
  ├─ application
  │   ├─ sync
  │   ├─ query
  │   └─ admin
  ├─ infrastructure
  │   ├─ youtube
  │   ├─ persistence
  │   └─ scheduler
  └─ interfaces
      ├─ api
      └─ admin
```

## 동기화 배치 설계

### 핵심 전략

- 기준은 `채널 검색`이 아니라 `재생목록 조회`다.
- 조회 비용이 낮은 `playlistItems.list`와 `videos.list`를 사용한다.
- 전체 삭제 후 재삽입이 아니라 `upsert` 방식으로 반영한다.
- 재생목록에서 사라진 항목은 즉시 hard delete 하지 않는다.

### 동기화 흐름

1. `content_menu` 기준으로 활성화된 메뉴를 조회한다.
2. 각 메뉴에 연결된 `youtube_playlist`를 순회한다.
3. YouTube API `playlistItems.list`로 영상 ID와 재생목록 순서를 가져온다.
4. 영상 ID 묶음으로 `videos.list`를 호출해 상세 데이터를 가져온다.
5. `youtube_video`를 upsert 한다.
6. `playlist_video`를 upsert 하면서 순서와 활성 상태를 반영한다.
7. `video_metadata`가 없는 영상은 기본 row를 생성한다.
8. 이번 동기화에 없었던 기존 `playlist_video`는 `is_active=false`로 전환한다.
9. `youtube_playlist.last_synced_at`를 갱신한다.

### 스케줄링

- 기본: 30분 간격
- 관리자 수동 동기화 버튼 제공
- 장애 대비: 메뉴별 개별 동기화 가능

```kotlin
@Scheduled(cron = "0 */30 * * * *")
fun syncAllPlaylists() {
    syncService.syncActiveMenus()
}
```

### 트랜잭션 전략

- 메뉴 단위 트랜잭션
- 재생목록 하나 실패가 전체 실패로 번지지 않도록 분리
- 외부 API 호출 구간과 DB 반영 구간을 나누어 처리

## 쇼츠 판별 전략

`그래도 괜찮아`는 쇼츠 전용 재생목록이므로 메뉴 기준 `SHORT`로 고정하는 편이 가장 단순하다.

보조 판별 로직은 다음과 같이 둔다.

- 메뉴가 `SHORT`면 우선 `SHORT`
- 그 외에는 영상 길이와 유튜브 응답값으로 보조 판별
- 필요시 `video_metadata.manual_kind`로 운영자가 강제 보정

즉, 실무 기준 우선순위는 다음과 같다.

1. 메뉴 규칙
2. 수동 보정값
3. 자동 판별값

## API 스펙 초안

프론트는 모두 우리 백엔드 API만 본다.

### 1. 메뉴별 영상 목록

`GET /api/v1/media/menus/{siteKey}/videos?page=0&size=12`

응답 예시:

```json
{
  "menu": {
    "siteKey": "messages",
    "name": "말씀/설교",
    "slug": "messages",
    "contentKind": "LONG_FORM"
  },
  "page": 0,
  "size": 12,
  "totalElements": 134,
  "totalPages": 12,
  "items": [
    {
      "id": 1024,
      "youtubeVideoId": "abc123xyz",
      "title": "목마름을 채우시는 사랑",
      "displayTitle": "목마름을 채우시는 사랑",
      "description": "유튜브 설명 또는 사이트 요약",
      "thumbnailUrl": "https://i.ytimg.com/vi/abc123xyz/hqdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=abc123xyz",
      "embedUrl": "https://www.youtube.com/embed/abc123xyz",
      "publishedAt": "2026-03-02T02:00:00Z",
      "displayDate": "2026-03-02",
      "contentKind": "LONG_FORM",
      "preacher": "이진욱 목사",
      "scripture": "요한복음 4:1~42",
      "serviceType": "주일예배",
      "featured": true
    }
  ]
}
```

### 2. 홈용 요약 목록

`GET /api/v1/media/home`

응답 예시:

```json
{
  "featuredSermons": [],
  "latestMessages": [],
  "latestDevotions": [],
  "latestShorts": []
}
```

### 3. 영상 상세

`GET /api/v1/media/videos/{youtubeVideoId}`

응답 예시:

```json
{
  "youtubeVideoId": "abc123xyz",
  "title": "목마름을 채우시는 사랑",
  "displayTitle": "목마름을 채우시는 사랑",
  "description": "상세 설명",
  "thumbnailUrl": "https://i.ytimg.com/vi/abc123xyz/hqdefault.jpg",
  "youtubeUrl": "https://www.youtube.com/watch?v=abc123xyz",
  "embedUrl": "https://www.youtube.com/embed/abc123xyz",
  "contentKind": "LONG_FORM",
  "publishedAt": "2026-03-02T02:00:00Z",
  "preacher": "이진욱 목사",
  "scripture": "요한복음 4:1~42",
  "serviceType": "주일예배",
  "summary": "사이트 전용 요약",
  "tags": ["주일예배", "요한복음"]
}
```

## 관리자 기능 최소안

초기 버전은 아래 정도면 충분하다.

- 메뉴별 재생목록 연결 설정
- 메뉴별 마지막 동기화 시각 확인
- 수동 동기화 실행
- 영상 visible on/off
- 설교자 입력
- 성경 본문 입력
- 예배 유형 입력
- 대표 영상 featured 지정
- 수동 제목 override
- 수동 썸네일 override

### 관리자 화면 흐름

1. `말씀/설교` 메뉴 진입
2. 동기화된 영상 목록 확인
3. 영상 하나 선택
4. 설교자, 본문, 예배 유형만 입력
5. 필요시 비노출 또는 대표 지정

운영자 입장에서 "새 영상 등록" 화면이 없어도 되는 것이 핵심이다.

## 제목/썸네일 표시 우선순위

프론트 표시값은 다음 우선순위로 결정한다.

### 제목

1. `video_metadata.manual_title`
2. `youtube_video.title`

### 썸네일

1. `video_metadata.manual_thumbnail_url`
2. `youtube_video.thumbnail_url`

### 콘텐츠 유형

1. `video_metadata.manual_kind`
2. `content_menu.content_kind`
3. `youtube_video.detected_kind`

## 삭제와 비노출 정책

하드 삭제는 최대한 늦춘다.

- 유튜브에서 재생목록 제외됨
  - `playlist_video.is_active = false`
- 사이트에서 숨기고 싶음
  - `video_metadata.visible = false`
- 영상을 완전히 제거하고 싶음
  - 관리자에서 명시적으로 삭제

이렇게 나누면 운영 실수가 복구 가능하다.

## 캐싱과 성능

- 사용자 API는 DB 조회만 사용한다.
- YouTube API는 배치 동기화에서만 사용한다.
- 인기 메뉴 목록 API는 Redis 또는 Caffeine 캐시를 붙일 수 있다.
- 정렬은 기본적으로 `pinned_rank asc nulls last`, `position asc`, `published_at desc` 조합이 안정적이다.

## 권한과 보안

- YouTube API 키는 서버 환경변수로만 관리한다.
- 관리자 API는 인증이 필요하다.
- 외부 원본 payload는 `raw_payload`에 저장하되, 프론트 응답에는 필요한 필드만 노출한다.

권장 환경변수 예시:

```text
YOUTUBE_API_KEY=...
YOUTUBE_MESSAGES_PLAYLIST_ID=...
YOUTUBE_BETTER_DEVOTION_PLAYLIST_ID=...
YOUTUBE_ITS_OKAY_PLAYLIST_ID=...
```

## 예시 JPA 엔티티 방향

```kotlin
enum class ContentKind {
    LONG_FORM,
    SHORT
}

@Entity
class ContentMenu(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    @Column(unique = true, nullable = false)
    val siteKey: String,
    @Column(unique = true, nullable = false)
    val slug: String,
    @Enumerated(EnumType.STRING)
    val contentKind: ContentKind,
    var active: Boolean = true
)
```

## 구현 순서 제안

1. `content_menu`, `youtube_playlist`, `youtube_video`, `playlist_video`, `video_metadata` 마이그레이션 작성
2. 재생목록 설정 seed 데이터 삽입
3. YouTube API 클라이언트 구현
4. 메뉴별 동기화 배치 구현
5. 목록/상세 조회 API 구현
6. 관리자 편집 API 구현
7. 프론트에서 기존 더미 데이터를 백엔드 API 호출로 교체

## 추천 결론

이 서비스는 CMS를 별도로 크게 만들 필요가 없다.

- 유튜브가 업로드 도구
- 재생목록이 정보 구조
- Spring 서버가 동기화 엔진
- Postgres가 사이트용 읽기 모델과 편집 메타데이터 저장소

이 구조가 가장 편한 이유는 운영자가 "영상 업로드 + 재생목록 분류"만 하면 되기 때문이다. 사이트 관리자는 필요한 경우에만 본문, 설교자, 노출 여부 같은 값만 보정하면 된다.
