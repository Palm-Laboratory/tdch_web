# 타이포그래피 정책 적용 — 공통 컴포넌트 수정 PRD

> 범위: `src/components/` 하위 사이트 공통 컴포넌트 (관리자 페이지 제외)  
> 기준 정책: `src/app/globals.css` `/* 타이포 정책 */` 섹션 및 `tailwind.config.ts`

---

## 배경

`globals.css`에 `type-*` 클래스 체계가 정의되어 있으나, 공통 컴포넌트들이 이를 따르지 않고 임의의 `text-[px]`, `font-serif`, `font-[var(...)]` 등을 직접 사용하고 있다. 공통 컴포넌트는 전 페이지에 영향을 주는 만큼 이곳부터 정책을 정착시켜야 개별 페이지 수정이 일관성 있게 이어질 수 있다.

## 로고 폰트 기준

교회명 로고 텍스트는 브랜드 워드마크로 간주하며, 페이지/섹션 제목 체계와 분리한다. 따라서 헤더/모바일/푸터 로고는 모두 `font-serif`를 사용하고, `font-section-title`은 페이지/섹션 제목에만 사용한다.

---

## 수정 대상 파일

| 파일 | 주요 문제 | 우선순위 |
|---|---|---|
| `site-header.tsx` | 로고 텍스트에 `text-[px]` 직접 사용, nav `text-[20px]` | 1 |
| `site-footer.tsx` | 교회명에 `font-serif text-2xl` 직접 사용 | 2 |
| `mobile-nav.tsx` | 로고 `text-[24px]`, 메뉴 항목 `text-3xl` 임의 사용 | 3 |
| `section-heading.tsx` | 현재 정책 준수 상태 (수정 불필요) | — |
| `page-header.tsx` | 현재 정책 준수 상태 (수정 불필요) | — |

---

## 파일별 수정 명세

### 1. `site-header.tsx`

#### 1-1. 로고 텍스트 — 모바일/태블릿

**현재**
```tsx
<p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-themeBlue/70">
  The Disciples Church
</p>
<p className="font-serif font-bold text-[20px] text-ink leading-tight">
  The 제자교회
</p>
```

**수정 후**
```tsx
<p className="type-label font-semibold uppercase tracking-[0.18em] text-themeBlue/70">
  The Disciples Church
</p>
<p className="font-serif text-[1.25rem] font-bold leading-tight text-ink">
  The 제자교회
</p>
```

> **NOTE:** 모바일/태블릿 로고도 브랜드 워드마크이므로 제목 토큰으로 승격하지 않고 `font-serif` + rem 단위로 유지한다.

#### 1-2. 로고 텍스트 — 데스크탑 (condensed 상태 포함)

**현재**
```tsx
<p className={`hidden font-semibold uppercase tracking-[0.18em] text-themeBlue/70 lg:block
  ${isCondensed ? "text-[9px] opacity-80" : "text-[10px]"}`}>
  The Disciples Church
</p>
<p className={`truncate font-serif font-bold text-ink transition-[font-size] duration-300
  ${isCondensed ? "text-[18px] md:text-[21px]" : "text-[20px] md:text-[24px]"}`}>
  The 제자교회
</p>
```

**수정 후**
```tsx
<p className={`hidden font-semibold uppercase tracking-[0.18em] text-themeBlue/70 lg:block
  ${isCondensed ? "text-[0.5625rem] opacity-80" : "type-label"}`}>
  The Disciples Church
</p>
<p className={`truncate font-serif font-bold text-ink transition-[font-size] duration-300
  ${isCondensed ? "text-[1.125rem] md:text-[1.3125rem]" : "text-[1.25rem] md:text-[1.5rem]"}`}>
  The 제자교회
</p>
```

> **NOTE:** 헤더 로고는 브랜드 워드마크이며, condensed 상태에서 크기가 JS로 동적 전환된다. 따라서 로고 영역은 `type-*` 토큰을 직접 적용하지 않고 `font-serif` + rem 단위로만 관리한다. 기본 상태와 condensed 상태 모두 px → rem 전환만 적용한다.

#### 1-3. 데스크탑 nav 폰트 크기

**현재**
```tsx
className={`... text-ink/85 ... ${isCondensed ? "gap-5 text-[18px]" : "gap-6 text-[20px]"}`}
```

**수정 후**
```tsx
className={`... text-ink/85 ... ${isCondensed ? "gap-5 text-[1.125rem]" : "gap-6 text-[1.25rem]"}`}
```

> **NOTE:** nav 항목은 `type-*` 클래스 체계에 직접 대응되는 클래스가 없으므로 rem 단위로만 전환한다.

---

### 2. `site-footer.tsx`

#### 2-1. 교회명

**현재**
```tsx
<p className="font-serif text-2xl font-semibold text-ivory">The 제자교회</p>
```

**수정 후**
```tsx
<p className="font-serif text-[1.5rem] font-semibold text-ivory">The 제자교회</p>
```

> **NOTE:** 푸터 교회명도 페이지 제목이 아니라 브랜드 워드마크이므로 `type-*` 대신 `font-serif` + rem 단위로 유지한다.

#### 2-2. 주소/연락처 블록

**현재**
```tsx
<div className="space-y-1 text-xs text-ivory/50">
```

**수정 후**
```tsx
<div className="space-y-1 type-body-small text-ivory/50">
```

> **NOTE:** 주소/연락처는 보조 정보이지만 읽어야 하는 본문 성격이 있으므로 `type-label`이 아니라 `type-body-small`을 사용한다.

#### 2-3. Threads 아이콘 내 `@` 텍스트

**현재**
```tsx
<span className="font-serif text-lg font-bold">@</span>
```

**수정 후**
```tsx
<span className="font-serif font-bold text-[1.125rem]">@</span>
```

> 장식용 문자이므로 `type-*` 클래스 적용 불필요. px → rem만 전환.

---

### 3. `mobile-nav.tsx`

#### 3-1. 로고 텍스트

**현재**
```tsx
<p className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-themeBlue/70 md:block">
  The Disciples Church
</p>
<p className="whitespace-nowrap font-serif text-[24px] font-bold text-ink hover:text-themeBlue transition">
  The 제자교회
</p>
```

**수정 후**
```tsx
<p className="hidden type-label font-semibold uppercase tracking-[0.18em] text-themeBlue/70 md:block">
  The Disciples Church
</p>
<p className="whitespace-nowrap font-serif text-[1.5rem] font-bold text-ink transition hover:text-themeBlue">
  The 제자교회
</p>
```

> **NOTE:** 모바일 메뉴 로고 역시 브랜드 워드마크이므로 `font-serif`를 유지하고, 크기만 rem 단위로 정리한다. `font-section-title`이나 제목 토큰으로 올리지 않는다.

#### 3-2. 메뉴 대분류 항목

**현재**
```tsx
className="text-3xl md:text-xl md:font-bold font-black tracking-tight text-ink/90 transition hover:text-themeBlue"
```

**수정 후**
```tsx
className="text-[1.875rem] md:text-[1.25rem] font-black tracking-tight text-ink/90 transition hover:text-themeBlue"
```

> **NOTE:** 내비게이션 대분류는 현재 `type-*` 체계에 직접 대응되는 토큰이 없다. 이번 PR에서는 신규 `type-nav`를 만들지 않고 px → rem 전환만 적용한다.

#### 3-3. 메뉴 소분류 항목

**현재**
```tsx
className="block text-xl font-semibold text-ink/65 transition hover:text-themeBlue hover:translate-x-1 duration-200"
```

**수정 후**
```tsx
className="block text-[1.25rem] font-semibold text-ink/65 transition hover:text-themeBlue hover:translate-x-1 duration-200"
```

> **NOTE:** 소분류 항목도 현재 공용 타입 토큰에 직접 대응하지 않으므로 rem 단위만 적용한다. `type-lead`는 성격이 달라 사용하지 않는다.

---

## 수정 원칙 요약

1. **`type-*` 클래스로 대응 가능한 경우** → 반드시 `type-*` 클래스 사용
2. **JS 동적 크기 전환이 필요한 경우** → `type-*` 클래스 적용이 어려우므로 px → rem 단위 전환만 적용
3. **장식용 텍스트/아이콘 내 문자** → px → rem 전환만 적용
4. **nav 항목처럼 `type-*` 체계에 없는 경우** → 이번 PR에서는 rem 단위만 사용, 신규 토큰은 도입하지 않음

---

## 수정 후 검증 포인트

- [ ] 모바일(375px) / 태블릿(768px) / 데스크탑(1280px) 세 breakpoint에서 로고 텍스트 크기 확인
- [ ] 헤더 condensed 상태(스크롤 후) 로고 전환 애니메이션 정상 동작 확인
- [ ] 모바일 메뉴 오버레이 열기/닫기 및 텍스트 크기 확인
- [ ] 푸터 교회명, 주소 블록 폰트 확인
