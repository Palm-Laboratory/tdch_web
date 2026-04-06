import Link from "next/link";

export default function AdminNavigationNewPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/navigation"
          className="inline-flex h-10 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm text-white/65 transition hover:bg-white/[0.06] hover:text-white"
        >
          목록으로
        </Link>
      </div>

      <header className="rounded-[28px] border border-white/[0.08] bg-[linear-gradient(135deg,rgba(63,116,199,0.18),rgba(255,255,255,0.03))] px-6 py-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6ca6f0]/65">
          Create Menu
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">
          1단계 메뉴 추가
        </h1>
        <p className="mt-2 text-sm leading-6 text-white/45">
          홈페이지 첫 줄에 보이는 새 메뉴를 등록하는 화면입니다. 저장 기능은 다음 단계에서 연결합니다.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.04] p-6">
          <h2 className="text-lg font-semibold text-white">작성 예정 항목</h2>
          <div className="mt-5 grid gap-4">
            {[
              ["메뉴 이름", "예: 교회 소개"],
              ["연결 주소", "예: /about"],
              ["현재 위치 기준", "예: /about"],
              ["노출 여부", "상단 메뉴, 모바일 메뉴 등"],
            ].map(([label, placeholder]) => (
              <div key={label}>
                <p className="mb-2 text-sm font-medium text-white">{label}</p>
                <div className="rounded-2xl border border-white/[0.06] bg-[#0c1622] px-4 py-3 text-sm text-white/28">
                  {placeholder}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <section className="rounded-[28px] border border-white/[0.08] bg-white/[0.04] p-6">
            <h2 className="text-[14px] font-semibold text-white">추가 전에 확인해 주세요</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-white/55">
              <li>1단계 메뉴는 홈페이지 상단에 보이는 큰 메뉴입니다.</li>
              <li>메뉴를 만든 뒤에는 그 안의 2단계 메뉴도 이어서 등록해야 합니다.</li>
              <li>이미 사용 중인 메뉴 코드와 같은 값은 사용할 수 없습니다.</li>
            </ul>
          </section>

          <section className="rounded-[28px] border border-amber-500/12 bg-amber-500/[0.06] p-6">
            <p className="text-sm leading-6 text-amber-50/80">
              이 화면은 먼저 흐름을 맞춘 상태입니다. 다음 단계에서 실제 저장 폼과 검증 메시지를 연결합니다.
            </p>
          </section>
        </aside>
      </section>
    </div>
  );
}
