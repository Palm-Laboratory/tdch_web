import { redirect } from "next/navigation";
import { getAdminSession, isAdminSession } from "@/auth";
import type { AdminMemberDetailResult, AdminMemberListResult } from "@/lib/admin-members-api";
import { getAdminMemberDetail, getAdminMembers, toFriendlyAdminMemberMessage } from "@/lib/admin-members-api";
import AdminBreadcrumb from "../components/admin-breadcrumb";
import MemberRegistryClient from "./_components/member-registry-client";
import { MOCK_CELLS } from "./_components/mock-data";
import type { FaithStage, MemberStatus } from "./_components/types";

interface AdminMembersPageProps {
  searchParams: Promise<{
    query?: string;
    status?: string;
    stage?: string;
    cellId?: string;
    id?: string;
    tab?: string;
  }>;
}

export default async function AdminMembersPage({ searchParams }: AdminMembersPageProps) {
  const session = await getAdminSession();

  if (!isAdminSession(session) || !session.user.id) {
    redirect("/admin/login?callbackUrl=/admin/members");
  }

  const params = await searchParams;
  let listResult: AdminMemberListResult = { members: [], totalElements: 0, hasNext: false };
  let selectedDetail: AdminMemberDetailResult | null = null;
  let loadError: string | null = null;

  try {
    [listResult, selectedDetail] = await Promise.all([
      getAdminMembers(session.user.id, {
        query: params.query ?? null,
        status: (params.status as MemberStatus | "ALL" | undefined) ?? null,
        stage: (params.stage as FaithStage | "ALL" | undefined) ?? null,
        cellId: params.cellId ?? null,
        page: 0,
        size: 100,
      }),
      params.id ? getAdminMemberDetail(session.user.id, params.id) : Promise.resolve(null),
    ]);
  } catch (error) {
    loadError = toFriendlyAdminMemberMessage(error, "교적부 데이터를 불러오지 못했습니다.");
  }

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: "교회 관리" }, { label: "교적부 관리" }]} />
      <div>
        <h1 className="text-xl font-bold text-[#0f1c2e]">교적부 관리</h1>
        <p className="mt-1 text-[12px] text-[#6d7f95]">
          교인 목록, 상태 제안, 가족관계, 봉사, 이력을 한 화면에서 관리합니다.
        </p>
      </div>
      <MemberRegistryClient
        initialMembers={listResult.members}
        initialTotal={listResult.totalElements}
        initialHasNext={listResult.hasNext}
        initialSelectedDetail={selectedDetail}
        availableCells={MOCK_CELLS}
        loadError={loadError}
        initialFilters={{
          query: params.query ?? "",
          status: params.status ?? "ALL",
          stage: params.stage ?? "ALL",
          cellId: params.cellId ?? "ALL",
        }}
      />
    </div>
  );
}
