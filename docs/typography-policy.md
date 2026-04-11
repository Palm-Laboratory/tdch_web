# Typography Policy

## 목적

이 문서는 The 제자교회 웹사이트의 타이포 기준을 정리합니다.

- 페이지마다 임의의 폰트 크기를 새로 만들지 않기 위해 사용합니다.
- 제목, 본문, 라벨의 역할을 일관되게 유지하기 위해 사용합니다.
- `src/app/globals.css`에 정의된 전역 타입 토큰의 기준 문서입니다.

## 루트 기준

- `html` 루트 `font-size`는 기본값 `100%`를 유지합니다.
- 현재 기준은 `1rem = 16px`입니다.
- 이 프로젝트에서는 `html { font-size: 62.5%; }`를 사용하지 않습니다.

이유:

- Tailwind 기본 spacing, gap, radius, width, text scale이 전부 `rem` 축을 공유합니다.
- 루트만 `62.5%`로 바꾸면 타이포뿐 아니라 전체 UI 크기가 예상과 다르게 축소됩니다.

## 운영 원칙

- 타이포는 숫자값보다 역할 기준으로 사용합니다.
- 새 화면에서는 가능하면 전역 타입 토큰을 우선 사용합니다.
- 본문은 과도하게 흔들리지 않도록 고정 `rem` 값을 사용합니다.
- 제목은 `base`, `md`, 필요 시 `lg`에서만 단계적으로 키웁니다.
- 같은 역할의 텍스트는 가능한 한 같은 토큰을 사용합니다.
- 페이지별 특수 타이포는 기본 토큰 위에 최소한으로 덧씌웁니다.

## 폰트 사용 규칙

- 기본 본문은 `font-sans`를 사용합니다.
- 일반 serif 계열은 `font-serif`를 사용합니다.
- 페이지/섹션 제목용 serif 계열은 `font-section-title`을 사용합니다.

지양:

- `font-[var(--font-sans)]`
- `font-[var(--font-serif)]`
- CSS variable을 Tailwind arbitrary value로 직접 참조하는 패턴

## 폰트 추가 및 등록 방법

새 폰트는 CSS variable을 직접 참조해서 쓰지 말고, 아래 순서로 등록합니다.

### 1. `src/app/layout.tsx`에 폰트 variable 추가

Google Font 예시:

```tsx
import { Noto_Sans_KR } from "next/font/google";

const sans = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "700"],
});
```

Local Font 예시:

```tsx
import localFont from "next/font/local";

const yeongwol = localFont({
  src: "./fonts/YeongwolTTF.ttf",
  variable: "--font-yeongwol",
  display: "swap",
});
```

### 2. `body` 또는 루트에 variable class를 연결

```tsx
<body className={`${sans.variable} ${yeongwol.variable} font-sans antialiased`}>
```

- variable class는 루트에서 한 번만 주입합니다.
- 기본 본문 폰트는 `font-sans`처럼 Tailwind 클래스로 선택합니다.

### 3. `tailwind.config.ts`에 `fontFamily` 등록

```ts
fontFamily: {
  sans: ["var(--font-sans)", "sans-serif"],
  serif: ["var(--font-serif)", "serif"],
  "section-title": ["var(--font-section-title)", "serif"],
  yeongwol: ["var(--font-yeongwol)", "sans-serif"],
}
```

등록 후 사용 클래스:

- `font-sans`
- `font-serif`
- `font-section-title`
- `font-yeongwol`

### 4. 컴포넌트에서는 Tailwind 폰트 클래스만 사용

권장:

```tsx
<h2 className="type-section-title font-section-title font-bold">
  새가족 안내
</h2>
```

지양:

```tsx
<h2 className="type-section-title font-[var(--font-section-title)] font-bold">
  새가족 안내
</h2>
```

### 5. 새 폰트가 반복 사용되면 역할까지 같이 정의

- 단순 장식용 1회성 폰트면 로컬 예외로 끝낼 수 있습니다.
- 페이지/섹션/카드처럼 반복되는 역할이면 `fontFamily`와 `type-*` 조합까지 같이 정리합니다.
- 같은 역할에서 새 폰트가 반복되면 문서와 공용 컴포넌트도 함께 갱신합니다.

### 체크리스트

- `layout.tsx`에 `variable` 등록 완료
- 루트에 `${font.variable}` 연결 완료
- `tailwind.config.ts`의 `fontFamily` 등록 완료
- 컴포넌트에서 `font-*` 클래스로만 사용 중
- `font-[var(--font-...)]` 패턴이 남아 있지 않음

## 전역 타입 토큰

정의 위치:

- `src/app/globals.css`

토큰 목록:

- `.type-page-title`
  - 페이지 대표 타이틀
  - `2.125rem / md: 3rem`

- `.type-section-title`
  - 섹션 타이틀
  - `1.5rem / md: 1.75rem / lg: 2.125rem`

- `.type-subsection-title`
  - 섹션 내 중간 제목
  - `1.3125rem / md: 1.4375rem / lg: 1.5625rem`

- `.type-block-title`
  - 블록/아코디언/단계 제목
  - `1.21875rem / md: 1.40625rem / lg: 1.5rem`

- `.type-card-title`
  - 카드/블록 제목
  - `1.125rem / md: 1.375rem`

- `.type-lead`
  - 강조 본문, 리드 문장
  - `1.125rem / md: 1.1875rem`

- `.type-body`
  - 기본 본문
  - `1rem`

- `.type-body-strong`
  - 기본 본문보다 약간 큰 본문
  - `1.0625rem`

- `.type-body-small`
  - 보조 본문, 메타 정보
  - `0.9375rem`

- `.type-label`
  - 작은 라벨, 상단 소제목
  - `0.75rem / md: 0.9375rem`

- `.type-eyebrow`
  - 큰 overline, 섹션 상단 영문 타이틀
  - `1.125rem / md: 1.25rem`

- `.type-display-number`
  - 배경용 큰 숫자
  - `7rem / md: 7.25rem`

## 권장 사용법

### 페이지 대표 타이틀

```tsx
<h1 className="type-page-title font-section-title font-extrabold text-white">
  당신이 여기 있어서,
  <br />
  정말 다행입니다.
</h1>
```

### 섹션 타이틀

```tsx
<h2 className="type-section-title font-section-title font-bold text-[#22345c]">
  산타로사에서의 17년
</h2>
```

### 카드 제목

```tsx
<h3 className="type-card-title font-section-title font-bold text-black">
  상처가 뭔지 압니다
</h3>
```

### 중간 제목

```tsx
<h3 className="type-subsection-title font-bold text-ink">
  5대 핵심가치
</h3>
```

### 블록 제목

```tsx
<h3 className="type-block-title font-bold text-ink">
  새가족 환영
</h3>
```

### 본문

```tsx
<p className="type-body text-black/88">
  The 제자교회는 바로 그 자리에서 시작된 교회입니다.
</p>
```

### 강조 본문

```tsx
<p className="type-lead text-white/92">
  거창하지 않아도 됩니다.
</p>
```

### 라벨

```tsx
<p className="type-label font-semibold uppercase tracking-[0.24em] text-[#caa643]">
  OUR MISSION
</p>
```

## 조합 원칙

타입 토큰은 기본적으로 크기와 줄간격을 담당합니다.

다음 속성은 상황에 따라 같이 조합합니다.

- `font-family class`
- `font-weight`
- `tracking`
- `color`
- `margin`, `gap`

예:

```tsx
<h2 className="type-section-title font-section-title font-bold tracking-[0.01em] text-[#1a2744]">
  예수님이 하신 세 가지
</h2>
```

## 지양 사항

- 같은 역할의 제목인데 페이지마다 다른 숫자값을 새로 만드는 패턴
- `text-[1.83rem]`, `text-[1.91rem]` 같은 임의 값의 과도한 누적
- 루트 `font-size`를 바꿔 전체 Tailwind scale을 흔드는 방식
- 본문에 과도한 fluid typography를 적용해 읽기 기준이 흔들리는 패턴
- `font-[var(--font-sans)]`, `font-[var(--font-serif)]`처럼 폰트를 직접 변수 참조로 쓰는 패턴

## 현재 적용 페이지

- `src/app/about/greeting/page.tsx`
- `src/app/about/pastor/page.tsx`

## 향후 원칙

- 새 페이지 작성 시 먼저 전역 토큰으로 시작합니다.
- 필요한 경우에만 로컬 페이지에서 예외 값을 추가합니다.
- 예외가 반복되면 전역 토큰으로 승격할지 검토합니다.
