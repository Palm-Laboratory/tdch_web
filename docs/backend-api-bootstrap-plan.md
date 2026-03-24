# Kotlin Spring 백엔드 프로젝트 설계안

## 목표

`thejejachurch_web` 프론트엔드와 분리된 `Kotlin + Spring Boot + PostgreSQL` 백엔드 프로젝트를 새로 만든다.

초기 목표는 작게 잡는다.

- 유튜브 재생목록 동기화
- 예배 영상 목록/상세 조회 API
- 홈 화면용 요약 API
- 관리자 없이도 운영 가능한 기본 구조

즉, 첫 버전은 "콘텐츠 조회 API + 동기화 배치"에 집중하고, 인증/관리자 화면은 2차로 붙인다.

## 권장 저장소 구조

가장 권장하는 형태는 프론트와 백엔드를 별도 프로젝트로 두는 것이다.

```text
Palm Lab/
  thejejachurch_web/
  thejejachurch_api/
```

이유는 다음과 같다.

- 배포 단위가 분리된다.
- Next.js와 Spring Boot의 빌드/런타임이 섞이지 않는다.
- API 서버 확장이 쉬워진다.
- 추후 관리자 웹이나 모바일 앱이 붙어도 재사용이 쉽다.

## 권장 기술 스택

### 필수

- Kotlin 2.x
- Spring Boot 3.5.x 계열
- Java 21
- Gradle Kotlin DSL
- Spring Web
- Spring Data JPA
- Spring Validation
- PostgreSQL Driver
- Flyway
- Jackson Kotlin Module

### 곧 필요해질 것

- Spring Security
- OAuth2 Resource Server 또는 JWT 인증
- Actuator
- Testcontainers
- Spring Cache

### 초기에는 선택

- Querydsl
- Redis
- S3
- Kafka

지금 단계에서는 넣지 않는 편이 낫다. 먼저 단순한 CRUD/조회/배치를 안정적으로 만드는 것이 우선이다.

## 프로젝트 이름 제안

- 저장소: `thejejachurch_api`
- Gradle root project name: `thejejachurch-api`
- 패키지 base: `kr.or.thejejachurch.api`

예시:

```kotlin
group = "kr.or.thejejachurch"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_21
```

## 초기 기능 범위

### 포함

- 헬스체크 API
- 메뉴별 영상 목록 API
- 영상 상세 API
- 홈 화면 요약 API
- 유튜브 재생목록 동기화 스케줄러
- Postgres 저장
- Flyway 마이그레이션

### 제외

- 로그인/회원가입
- 관리자 화면
- 댓글
- 통계 대시보드
- 업로드 기능
- 파일 저장소

초기 범위를 억제해야 첫 배포가 빨라진다.

## 패키지 구조 제안

너무 무거운 멀티모듈보다, 우선은 단일 애플리케이션 안에서 계층을 분리하는 것이 적절하다.

```text
src/main/kotlin/kr/or/thejejachurch/api
  ├─ ApiApplication.kt
  ├─ common
  │   ├─ config
  │   ├─ error
  │   ├─ response
  │   ├─ time
  │   └─ util
  ├─ media
  │   ├─ domain
  │   │   ├─ ContentMenu.kt
  │   │   ├─ YoutubePlaylist.kt
  │   │   ├─ YoutubeVideo.kt
  │   │   ├─ PlaylistVideo.kt
  │   │   └─ VideoMetadata.kt
  │   ├─ repository
  │   ├─ application
  │   │   ├─ MediaQueryService.kt
  │   │   ├─ HomeMediaQueryService.kt
  │   │   └─ YoutubeSyncService.kt
  │   ├─ infrastructure
  │   │   ├─ youtube
  │   │   └─ scheduler
  │   └─ interfaces
  │       ├─ api
  │       └─ dto
  └─ health
      └─ HealthController.kt
```

핵심 원칙은 다음이다.

- `domain`: JPA 엔티티
- `repository`: DB 접근
- `application`: 유스케이스와 서비스 로직
- `infrastructure`: 외부 API, 스케줄러
- `interfaces`: REST 컨트롤러, 요청/응답 DTO

## Gradle 의존성 설계

초기 `build.gradle.kts`는 이 정도가 적절하다.

```kotlin
plugins {
    kotlin("jvm") version "2.1.21"
    kotlin("plugin.spring") version "2.1.21"
    kotlin("plugin.jpa") version "2.1.21"
    id("org.springframework.boot") version "3.5.0"
    id("io.spring.dependency-management") version "1.1.7"
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")

    runtimeOnly("org.postgresql:postgresql")
    implementation("org.flywaydb:flyway-core")
    implementation("org.flywaydb:flyway-database-postgresql")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
}
```

초기에는 HTTP 클라이언트도 무겁게 가지 말고 `RestClient` 또는 `WebClient` 중 하나만 고른다. 지금 용도면 `RestClient`로 충분하다.

## 설정 파일 구조

### application.yml

```yaml
spring:
  application:
    name: thejejachurch-api
  datasource:
    url: ${DB_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        format_sql: true
    open-in-view: false
  flyway:
    enabled: true

management:
  endpoints:
    web:
      exposure:
        include: health,info,prometheus

youtube:
  api-key: ${YOUTUBE_API_KEY}
  playlists:
    messages: ${YOUTUBE_MESSAGES_PLAYLIST_ID}
    better-devotion: ${YOUTUBE_BETTER_DEVOTION_PLAYLIST_ID}
    its-okay: ${YOUTUBE_ITS_OKAY_PLAYLIST_ID}
```

### 프로필 제안

- `local`
- `dev`
- `prod`

로컬은 Docker Postgres 기준으로 맞추고, 운영은 환경변수 주입 기준으로 고정한다.

## DB 설계 방향

유튜브 관련 상세 스키마는 기존 문서 [`youtube-content-architecture.md`](./youtube-content-architecture.md)를 기준으로 한다.

초기에는 아래 5개 테이블만 만들면 충분하다.

- `content_menu`
- `youtube_playlist`
- `youtube_video`
- `playlist_video`
- `video_metadata`

### 추천 마이그레이션 순서

```text
V1__create_content_menu.sql
V2__create_youtube_playlist.sql
V3__create_youtube_video.sql
V4__create_playlist_video.sql
V5__create_video_metadata.sql
V6__seed_content_menus.sql
V7__seed_youtube_playlists.sql
```

## 유튜브 연동 설계

### API 호출 전략

- `playlistItems.list`
- `videos.list`

이 두 개를 조합해서 쓴다.

`search.list`는 quota cost가 높으므로 초기 설계에서 배제한다.

### 동기화 서비스 책임

- 재생목록별 최신 영상 목록 수집
- 영상 상세 upsert
- 재생목록 순서 반영
- 비활성 전환 처리
- 기본 메타데이터 row 생성

### 스케줄러

- 기본 주기: 30분
- 관리자 수동 실행 엔드포인트는 나중에 추가

예시:

```kotlin
@Component
class YoutubeSyncScheduler(
    private val youtubeSyncService: YoutubeSyncService,
) {
    @Scheduled(cron = "0 */30 * * * *")
    fun sync() {
        youtubeSyncService.syncAllMenus()
    }
}
```

## API 설계 초안

기본 prefix는 `/api/v1`로 고정한다.

### 1. 헬스체크

`GET /api/v1/health`

응답:

```json
{
  "status": "UP",
  "application": "thejejachurch-api"
}
```

### 2. 홈 미디어 요약

`GET /api/v1/media/home`

용도:

- 홈 화면에서 최신 설교
- 최신 묵상
- 최신 쇼츠
- 대표 영상

### 3. 메뉴별 영상 목록

`GET /api/v1/media/menus/{siteKey}/videos?page=0&size=12`

`siteKey` 예시:

- `messages`
- `better-devotion`
- `its-okay`

### 4. 영상 상세

`GET /api/v1/media/videos/{youtubeVideoId}`

### 5. 메뉴 목록

`GET /api/v1/media/menus`

프론트는 이 응답으로 탭이나 내비를 동적으로 그릴 수도 있고, 기존 하드코딩 유지도 가능하다.

## 응답 DTO 설계 원칙

- JPA 엔티티를 직접 응답으로 노출하지 않는다.
- 프론트가 바로 쓸 수 있는 가공된 필드를 준다.
- 제목/썸네일/날짜는 표시용 값과 원본 값을 분리할 수 있다.

예시 필드:

- `title`
- `displayTitle`
- `thumbnailUrl`
- `youtubeUrl`
- `embedUrl`
- `publishedAt`
- `displayDate`
- `preacher`
- `scripture`
- `serviceType`
- `contentKind`
- `featured`

## 예외 처리 설계

전역 예외 포맷은 처음부터 통일한다.

```json
{
  "code": "MEDIA_NOT_FOUND",
  "message": "요청한 영상을 찾을 수 없습니다.",
  "timestamp": "2026-03-24T12:00:00Z"
}
```

권장 예외 코드:

- `INVALID_REQUEST`
- `MENU_NOT_FOUND`
- `MEDIA_NOT_FOUND`
- `YOUTUBE_SYNC_FAILED`
- `INTERNAL_SERVER_ERROR`

## 테스트 전략

초기부터 최소한 이 정도는 둔다.

- 컨트롤러 슬라이스 테스트
- 서비스 단위 테스트
- 리포지토리 테스트

2차로 붙일 것:

- Testcontainers 기반 Postgres 통합 테스트
- 외부 유튜브 API mock 테스트

처음부터 E2E 전체를 욕심내기보다, 동기화 서비스와 조회 API를 먼저 단단하게 잡는 것이 낫다.

## 로컬 개발 환경

### 로컬 실행 방식

- API 서버: IntelliJ 또는 `./gradlew bootRun`
- DB: Docker Postgres

예시 `docker-compose.local.yml`

```yaml
services:
  postgres:
    image: postgres:16
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: thejejachurch
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 프론트 연동 방식

현재 Next.js 프론트는 그대로 유지한다.

- 프론트는 백엔드 API를 호출한다.
- 프론트 더미 데이터는 점진적으로 제거한다.
- SSR/ISR 여부는 프론트에서 선택한다.

추천 환경변수:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

프론트 연동 순서는 다음이 적절하다.

1. 홈 영상 섹션 API 연결
2. `/sermons/messages` 연결
3. `/sermons/better-devotion` 연결
4. `/sermons/its-okay` 연결

## 인증/관리자 확장 계획

이건 2차 범위로 둔다.

### 2차에서 추가할 것

- 관리자 로그인
- 수동 동기화 버튼
- 영상 visible on/off
- 설교자/본문/예배 유형 입력
- featured 지정
- manual title/thumbnail override

### 보안 방향

- 관리자 API는 Spring Security 보호
- 초기에는 세션 기반 또는 간단한 관리자 계정부터 시작 가능
- 추후 JWT/OAuth2로 확장 가능

## 배포 구조 제안

### 권장

- `www.example.com` -> Next.js
- `api.example.com` -> Spring Boot

또는 리버스 프록시 하나로:

- `/api/**` -> Spring Boot
- 나머지 -> Next.js

초기에는 백엔드도 Docker 컨테이너로 배포하는 것이 가장 단순하다.

## 첫 스프린트 작업 순서

### 1주차 목표

1. Spring Boot 프로젝트 생성
2. Postgres 연결
3. Flyway 마이그레이션 적용
4. 헬스체크 API 추가
5. 메뉴/영상 테이블 seed

### 2주차 목표

1. 유튜브 API 클라이언트 구현
2. 재생목록 동기화 서비스 구현
3. 메뉴별 영상 목록 API 구현
4. 영상 상세 API 구현

### 3주차 목표

1. 홈 요약 API 구현
2. 프론트 일부 연결
3. 캐시/예외 처리/테스트 보강

## 권장 결론

지금은 백엔드 프로젝트를 새로 만드는 것이 맞다.

가장 좋은 시작점은 다음 조합이다.

- 별도 저장소
- Kotlin + Spring Boot 3.5 + Java 21
- 단일 애플리케이션 구조
- Flyway + Postgres
- 유튜브 재생목록 동기화 배치
- 조회 API 먼저 구현

이렇게 시작하면 과하지 않고, 나중에 관리자 기능을 붙여도 구조를 버리지 않아도 된다.
