import {
  OFFICE_LABEL,
  STAGE_META,
  STATUS_META,
  type FaithStage,
  type MemberStatus,
  type Office,
} from "./types";

export function StatusBadge({ status }: { status: MemberStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${meta.badge}`}
    >
      {meta.label}
    </span>
  );
}

export function StageBadge({ stage }: { stage: FaithStage }) {
  const meta = STAGE_META[stage];
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${meta.badge}`}
    >
      {`Lv${meta.lv} ${meta.label}`}
    </span>
  );
}

export function OfficeBadge({ office }: { office: Office }) {
  if (office === "LAY") return null;
  return (
    <span className="inline-flex rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700">
      {OFFICE_LABEL[office]}
    </span>
  );
}

export function CellBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-md bg-[#edf4ff] px-2 py-0.5 text-[11px] font-semibold text-[#2d5da8]">
      {label}
    </span>
  );
}

export function Avatar({
  initial,
  grad,
  size = "md",
}: {
  initial: string;
  grad: number;
  size?: "sm" | "md" | "lg";
}) {
  const gradients: Record<number, string> = {
    1: "linear-gradient(135deg, #ffd4a3 0%, #ff9a6c 100%)",
    2: "linear-gradient(135deg, #a5d4ff 0%, #6ca6f0 100%)",
    3: "linear-gradient(135deg, #d4b3ff 0%, #9d7aff 100%)",
    4: "linear-gradient(135deg, #b3f0d4 0%, #6ec79a 100%)",
    5: "linear-gradient(135deg, #ffb3b3 0%, #ff7a7a 100%)",
    6: "linear-gradient(135deg, #ffe4a3 0%, #ffbb5b 100%)",
    7: "linear-gradient(135deg, #c4e0ff 0%, #7ab8ff 100%)",
    8: "linear-gradient(135deg, #e2b3ff 0%, #b07aff 100%)",
  };
  const dims = size === "sm" ? "h-7 w-6 text-[10px]" : size === "lg" ? "h-20 w-16 text-xl" : "h-12 w-9 text-sm";
  return (
    <div
      className={`${dims} flex shrink-0 items-center justify-center rounded-md font-bold text-white shadow-sm`}
      style={{ background: gradients[grad] ?? gradients[1] }}
    >
      {initial}
    </div>
  );
}
