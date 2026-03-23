# Pastor Hero Responsive Image Guide

## 목적

이 문서는 `src/app/about/pastor/page.tsx`의 섹션 1 히어로 이미지 반응형 처리 기준을 정리합니다.

나중에 이 섹션을 수정할 때 다음 목표를 유지하기 위해 사용합니다.

- 섹션 1의 왼쪽 텍스트 위치를 흔들지 않기
- 섹션 1의 전체 높이와 기본 레이아웃 크기를 바꾸지 않기
- 모바일과 `md` 이상에서 서로 다른 이미지 전략을 유지하기
- 모바일에서 이미지가 우하단에 붙은 상태로 자연스럽게 스케일되도록 유지하기

## 적용 파일

- `src/app/about/pastor/page.tsx`

## 고정 제약

이 섹션을 다시 수정할 때 아래 항목은 기본적으로 유지합니다.

- 섹션 1의 왼쪽 글 위치는 바꾸지 않습니다.
- 섹션 1의 높이 값은 바꾸지 않습니다.
- 모바일 이미지는 텍스트 레이아웃을 밀지 않고 배경 레이어처럼 동작해야 합니다.
- `md` 이상에서는 좌우 2컬럼을 유지합니다.

## 현재 구조

### 모바일 (`md` 미만)

- 모바일 이미지는 `pastor_sm.png`를 사용합니다.
- 이미지 레이어는 내부 `px-2 pb-8` 박스가 아니라 바깥 `section-shell` 기준으로 절대 배치합니다.
- 이유:
  내부 박스에 두면 패딩 때문에 이미지가 하단/우측에 붙어 보여야 하는 의도와 다르게 떠 보입니다.

현재 핵심 클래스:

```tsx
<div className="section-shell section-shell--narrow relative py-8 md:py-0 lg:py-0">
  <div className="pointer-events-none absolute bottom-0 -right-4 z-0 aspect-[553/738] w-[42%] min-w-[165px] md:hidden">
    <Image
      src="/images/about/pastor_sm.png"
      fill
      sizes="(max-width: 767px) 42vw, 240px"
      className="origin-[110%_100%] object-contain object-bottom-right scale-[1.4]"
    />
  </div>
</div>
```

의도:

- `bottom-0`: 모바일에서 섹션 하단에 붙입니다.
- `-right-4`: `section-shell`의 모바일 가로 패딩 `1rem` 보정용입니다.
- `w-[42%]`: 화면이 넓어질수록 이미지도 일정 비율로 커지게 합니다.
- `min-w-[165px]`: 너무 작은 모바일에서 이미지가 지나치게 작아지는 것을 막습니다.
- `aspect-[553/738]`: 원본 이미지 비율을 유지해 특정 구간에서 하단이 떠 보이는 현상을 막습니다.
- `origin-[110%_100%]`: 스케일될 때 좌상단 방향으로 커지는 느낌을 강화합니다.
- `scale-[1.4]`: 모바일에서 확보된 기준 확대값입니다.

### `md` 이상

- `md` 이상에서는 `pastor.png`를 사용합니다.
- 히어로 내부는 2컬럼이며, 현재 좌우를 반반으로 사용합니다.
- 이미지 컬럼은 오른쪽에 두고, 이미지 자체는 우하단 정렬을 유지합니다.

현재 핵심 클래스:

```tsx
<div className="relative min-h-[420px] px-2 pb-8 pt-8 md:grid md:min-h-[460px] md:grid-cols-2 md:items-end md:gap-6 md:px-2 md:pb-0 md:pt-8 lg:min-h-[440px] lg:grid-cols-2 lg:gap-10 lg:px-0 lg:pt-5">
  ...
  <div className="relative hidden h-full min-h-[340px] md:block lg:min-h-[405px]">
    <Image
      src="/images/about/pastor.png"
      fill
      sizes="(min-width: 1280px) 490px, (min-width: 768px) calc(50vw - 32px), 100vw"
      className="origin-[110%_100%] object-contain object-bottom-right scale-[1.3]"
    />
  </div>
</div>
```

의도:

- `md:grid-cols-2`: 태블릿부터 좌우 반반 비율을 유지합니다.
- `object-bottom-right`: 오른쪽 이미지 기준점을 유지합니다.
- `origin-[110%_100%]`: 확대 시 좌상단 방향으로 커지는 인상을 유지합니다.
- `scale-[1.3]`: 현재 `md` 이상 확대 기준값입니다.

## 수정 원칙

### 모바일에서 이미지가 너무 작아 보일 때

- `min-w-[165px]`를 먼저 조정합니다.
- 기본 권장 범위는 `165px ~ 185px`입니다.

### 모바일에서 이미지와 텍스트 사이 간격이 너무 벌어질 때

- `w-[42%]` 같은 비율 값을 조정합니다.
- `clamp()`보다 비율 기반이 현재 의도에 더 잘 맞습니다.

### 모바일에서 우측에 덜 붙어 보일 때

- 먼저 `section-shell`의 모바일 패딩 영향을 확인합니다.
- 현재는 `-right-4`로 그 패딩을 보정합니다.

### 모바일에서 하단에서 떠 보일 때

- `height`를 따로 주지 말고 `aspect-*` 기반으로 유지합니다.
- 여전히 뜨면 원본 PNG의 투명 여백 여부를 먼저 확인합니다.

### 이미지가 더 크게 커질 때 좌상단으로 확장되는 느낌을 유지하려면

- `origin-[110%_100%]`을 유지합니다.
- 필요하면 `origin-[115%_100%]`처럼 더 바깥으로 미세조정할 수 있습니다.

## 하지 말아야 할 수정

- 모바일 이미지를 다시 내부 `px-2 pb-8` 래퍼 안으로 옮기는 것
- 섹션 1의 왼쪽 글 위치를 이미지 맞추려고 변경하는 것
- 섹션 1 높이를 이미지 때문에 늘리거나 줄이는 것
- 모바일 이미지 폭/높이를 서로 독립적으로 과하게 조정해 비율이 깨지는 것

## 관련 에셋

- `public/images/about/pastor.png`
- `public/images/about/pastor_sm.png`
