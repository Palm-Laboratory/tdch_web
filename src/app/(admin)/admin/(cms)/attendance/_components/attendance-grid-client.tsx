"use client";

import { useMemo, useState } from "react";
import { MOCK_CELLS, MOCK_MEMBERS } from "../../members/_components/mock-data";
import { StatusBadge } from "../../members/_components/badges";
import type { AttendanceStatus } from "../../members/_components/types";

const WEEK_LABELS = ["4/5", "4/12", "4/19", "4/26"];
const STATUS_SEQUENCE: Array<AttendanceStatus | null> = ["ATTEND", "ONLINE", "EXCUSED", "ABSENT", null];
const STATUS_META: Record<AttendanceStatus, { label: string; className: string; short: string }> = {
  ATTEND: { label: "출석", className: "bg-emerald-50 text-emerald-700", short: "O" },
  ONLINE: { label: "온라인", className: "bg-sky-50 text-sky-700", short: "△" },
  EXCUSED: { label: "사유", className: "bg-amber-50 text-amber-700", short: "E" },
  ABSENT: { label: "결석", className: "bg-rose-50 text-rose-700", short: "X" },
};

const INITIAL_GRID: Record<string, Array<AttendanceStatus | null>> = {
  "m-001": ["ATTEND", "ATTEND", "ONLINE", null],
  "m-004": ["ATTEND", "ATTEND", "ATTEND", "ATTEND"],
  "m-005": ["ABSENT", "ABSENT", "EXCUSED", "ABSENT"],
  "m-006": ["ATTEND", null, "ATTEND", "ONLINE"],
  "m-010": ["ATTEND", "ONLINE", "ATTEND", "ATTEND"],
};

export default function AttendanceGridClient() {
  const [selectedCellId, setSelectedCellId] = useState<string>("all");
  const [grid, setGrid] = useState<Record<string, Array<AttendanceStatus | null>>>(INITIAL_GRID);

  const members = useMemo(() => {
    const base = MOCK_MEMBERS.filter((member) =>
      selectedCellId === "all" ? true : member.cellId === selectedCellId,
    );

    return base.slice(0, 6);
  }, [selectedCellId]);

  const toggleCell = (memberId: string, index: number) => {
    setGrid((current) => {
      const row = current[memberId] ?? [null, null, null, null];
      const currentValue = row[index] ?? null;
      const nextValue = STATUS_SEQUENCE[(STATUS_SEQUENCE.indexOf(currentValue) + 1) % STATUS_SEQUENCE.length];
      const nextRow = row.map((value, valueIndex) => (valueIndex === index ? nextValue : value));
      return { ...current, [memberId]: nextRow };
    });
  };

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-[#dbe4f0] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-end gap-3">
          <label className="min-w-[220px] flex-1">
            <span className="mb-1.5 block text-[11px] font-semibold text-[#55697f]">구역 · 쉘</span>
            <select
              value={selectedCellId}
              onChange={(event) => setSelectedCellId(event.target.value)}
              className="h-10 w-full rounded-xl border border-[#d5deea] bg-white px-3 text-[13px] text-[#0f1c2e] outline-none focus:border-[#3f74c7]"
            >
              <option value="all">전체</option>
              {MOCK_CELLS.map((cell) => (
                <option key={cell.id} value={cell.id}>
                  {cell.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-1.5 block text-[11px] font-semibold text-[#55697f]">예배일</span>
            <input
              type="date"
              defaultValue="2026-04-26"
              className="h-10 rounded-xl border border-[#d5deea] px-3 text-[13px] text-[#0f1c2e] outline-none focus:border-[#3f74c7]"
            />
          </label>
          <label>
            <span className="mb-1.5 block text-[11px] font-semibold text-[#55697f]">예배 종류</span>
            <select className="h-10 rounded-xl border border-[#d5deea] bg-white px-3 text-[13px] text-[#0f1c2e] outline-none focus:border-[#3f74c7]">
              <option>주일 대예배</option>
              <option>주일 2부</option>
              <option>수요 예배</option>
            </select>
          </label>
          <button className="h-10 rounded-xl bg-[#3f74c7] px-5 text-[13px] font-semibold text-white">
            저장
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-[#6d7f95]">
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">O 출석</span>
          <span className="rounded-full bg-sky-50 px-2.5 py-1 text-sky-700">△ 온라인</span>
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">E 사유</span>
          <span className="rounded-full bg-rose-50 px-2.5 py-1 text-rose-700">X 결석</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">빈칸 미입력</span>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-[#dbe4f0] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#edf2f7] px-5 py-4">
          <div>
            <p className="text-[13px] font-semibold text-[#132033]">주간 출석 입력</p>
            <p className="mt-1 text-[11px] text-[#8fa3bb]">
              셀을 클릭하면 `출석 → 온라인 → 사유 → 결석 → 미입력` 순으로 전환됩니다.
            </p>
          </div>
          <button className="h-8 rounded-lg border border-[#bfd0ea] bg-[#edf4ff] px-3 text-[11px] font-semibold text-[#2d5da8]">
            엑셀 업로드
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] text-left">
                <th className="px-4 py-3 text-[11px] font-semibold text-[#55697f]">교인</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-[#55697f]">구역 · 쉘</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-[#55697f]">상태</th>
                {WEEK_LABELS.map((label) => (
                  <th key={label} className="px-4 py-3 text-center text-[11px] font-semibold text-[#55697f]">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((member) => {
                const row = grid[member.id] ?? [null, null, null, null];

                return (
                  <tr key={member.id} className="border-t border-[#edf2f7]">
                    <td className="px-4 py-3">
                      <div className="text-[13px] font-semibold text-[#132033]">{member.name}</div>
                      <div className="mt-1 text-[11px] text-[#8fa3bb]">{member.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#55697f]">{member.cellLabel}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={member.status} />
                    </td>
                    {row.map((value, index) => {
                      const meta = value ? STATUS_META[value] : null;
                      return (
                        <td key={`${member.id}-${WEEK_LABELS[index]}`} className="px-2 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => toggleCell(member.id, index)}
                            className={`h-10 w-10 rounded-lg border text-[12px] font-bold transition ${
                              meta
                                ? `${meta.className} border-transparent`
                                : "border-dashed border-[#d5deea] bg-white text-[#8fa3bb] hover:bg-[#f8fafc]"
                            }`}
                          >
                            {meta ? meta.short : "−"}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
