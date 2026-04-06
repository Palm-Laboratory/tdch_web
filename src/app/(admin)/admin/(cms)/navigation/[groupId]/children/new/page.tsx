import Link from "next/link";

interface AdminNavigationChildNewPageProps {
  params: Promise<{
    groupId: string;
  }>;
}

export default async function AdminNavigationChildNewPage({ params }: AdminNavigationChildNewPageProps) {
  const { groupId } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/admin/navigation/${groupId}`}
          className="inline-flex h-10 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm text-white/65 transition hover:bg-white/[0.06] hover:text-white"
        >
          상세로
        </Link>
      </div>

      <header className="rounded-[28px] border border-white/[0.08] bg-[linear-gradient(135deg,rgba(63,116,199,0.18),rgba(255,255,255,0.03))] px-6 py-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6ca6f0]/65">
          Create Submenu
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">
          2단계 메뉴 추가
        </h1>
        <p className="mt-2 text-sm leading-6 text-white/45">
          선택한 1단계 메뉴 아래에 들어갈 세부 메뉴를 등록하는 화면입니다. 저장 기능은 다음 단계에서 연결합니다.
        </p>
      </header>

      <section className="rounded-[28px] border border-white/[0.08] bg-white/[0.04] p-6">
        <h2 className="text-[14px] font-semibold text-white">준비 중인 입력 항목</h2>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-white/55">
          <li>메뉴 이름</li>
          <li>연결 주소</li>
          <li>현재 위치 기준 경로</li>
          <li>대표 메뉴 여부</li>
          <li>상단/모바일/왼쪽 메뉴/현재 위치 경로 노출 여부</li>
          <li>영상 메뉴 연결 여부</li>
        </ul>
      </section>
    </div>
  );
}
