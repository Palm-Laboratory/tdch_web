type NewcomerRoadmapItem = {
  kind: "newcomer";
  label: string;
  duration: string;
  title: string;
  tags: readonly string[];
  activeTagIndex: number;
};

type StepRoadmapItem = {
  kind: "step";
  number: string;
  label: string;
  duration: string;
  title: string;
  details: readonly string[];
  badge?: string;
};

type GoalRoadmapItem = {
  kind: "goal";
  title: string;
};

type RoadmapItem = NewcomerRoadmapItem | StepRoadmapItem | GoalRoadmapItem;

interface DisciplesRoadmapProps {
  id?: string;
  items: readonly RoadmapItem[];
  numberClassName: string;
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 md:h-6 md:w-6" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M6.75 18.25a5.25 5.25 0 0 1 10.5 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 md:h-6 md:w-6" fill="none" aria-hidden="true">
      <path
        d="m12 3.5 2.55 5.17 5.7.83-4.13 4.03.98 5.67L12 16.5l-5.1 2.7.98-5.67L3.75 9.5l5.7-.83L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RoadmapIcon({
  item,
  numberClassName,
}: {
  item: RoadmapItem;
  numberClassName: string;
}) {
  const commonClassName =
    "relative z-10 flex h-[44px] w-[44px] items-center justify-center rounded-full md:h-[48px] md:w-[48px]";

  if (item.kind === "newcomer") {
    return (
      <span className={`${commonClassName} bg-[#d1ad45] text-white`}>
        <PersonIcon />
      </span>
    );
  }

  if (item.kind === "goal") {
    return (
      <span className={`${commonClassName} bg-[#d1ad45] text-white`}>
        <StarIcon />
      </span>
    );
  }

  return (
    <span
      className={`${commonClassName} border-[2px] border-[#d1ad45] bg-[#1a2744] text-[#d1ad45]`}
    >
      <span
        className={`${numberClassName} -translate-y-[0.1em] text-[1.5rem] font-bold leading-none tracking-[0.08em] md:text-[1.625rem]`}
      >
        {item.number}
      </span>
    </span>
  );
}

function NewcomerCard({ item }: { item: NewcomerRoadmapItem }) {
  return (
    <div>
      <p className="type-label uppercase tracking-[3px] text-[#888580] md:type-body-small">
        {item.label}
        <span className="mx-3 tracking-[0.12em]">·</span>
        {item.duration}
      </p>

      <article className="mt-3 rounded-[14px] border border-black/10 bg-white px-5 py-5 shadow-[0_2px_10px_rgba(16,33,63,0.03)] md:px-7 md:py-5">
        <h3 className="type-card-title font-bold leading-none tracking-[-0.02em] text-[#1a2744] md:text-[1.125rem]">
          {item.title}
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          {item.tags.map((tag, index) => (
            <div key={tag} className="flex items-center gap-3">
              <span
                className={`rounded-[6px] px-3 py-2 type-label font-bold leading-none tracking-[0.02em] md:px-4 md:py-[10px] md:type-body-small ${index === item.activeTagIndex
                  ? "bg-[#1a2744] text-white"
                  : "bg-[#f7f7f4] text-[#1a2744]"
                  }`}
              >
                {tag}
              </span>
              {index < item.tags.length - 1 ? (
                <span className="text-[1.5rem] leading-none text-[#d1ad45] md:text-[1.75rem]">→</span>
              ) : null}
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

function StepCard({ item }: { item: StepRoadmapItem }) {
  return (
    <div>
      <p className="type-label uppercase tracking-[3px] text-[#888580] md:type-body-small">
        {item.label}
        <span className="mx-3 tracking-[0.12em]">·</span>
        {item.duration}
      </p>

      <article className="relative mt-3 overflow-hidden rounded-[14px] border border-black/10 bg-white px-5 py-5 shadow-[0_2px_10px_rgba(16,33,63,0.03)] md:px-7 md:py-5">
        <span className="absolute inset-y-0 left-0 w-[3px] bg-[#1a2744]" />

        <div className="pl-3 md:pl-4">
          <h3 className="type-card-title font-bold leading-none tracking-[-0.02em] text-[#1a2744] md:text-[1.125rem]">
            {item.title}
          </h3>
          <p className="mt-3 type-body-small leading-[1.6] tracking-[0.02em] text-[#7a7060]">
            {item.details.join(" · ")}
          </p>

          {item.badge ? (
            <span className="mt-3 inline-flex rounded-[6px] bg-[#f7f7f4] px-3 py-2 type-label font-bold leading-none tracking-[0.02em] text-[#1a2744] md:px-4 md:py-[10px] md:type-body-small">
              {item.badge}
            </span>
          ) : null}
        </div>
      </article>
    </div>
  );
}

function GoalCard({ item }: { item: GoalRoadmapItem }) {
  return (
    <article className="rounded-[14px] bg-[#d1ad45] px-6 py-5 text-white shadow-[0_2px_10px_rgba(16,33,63,0.05)] md:px-8 md:py-5">
      <p className="type-body-small uppercase leading-none tracking-[3px] text-white/95">
        GOAL
      </p>
      <h3 className="mt-3 type-card-title font-bold leading-none tracking-[-0.02em] md:text-[1.125rem]">
        {item.title}
      </h3>
    </article>
  );
}

function RoadmapRow({
  item,
  numberClassName,
}: {
  item: RoadmapItem;
  numberClassName: string;
}) {
  return (
    <div className="relative flex gap-5 md:gap-7">
      <div className="relative z-10 flex w-[44px] shrink-0 justify-center md:w-[48px]">
        <RoadmapIcon item={item} numberClassName={numberClassName} />
      </div>

      <div className="min-w-0 flex-1 pt-3 md:pt-2">
        {item.kind === "newcomer" ? <NewcomerCard item={item} /> : null}
        {item.kind === "step" ? <StepCard item={item} /> : null}
        {item.kind === "goal" ? <GoalCard item={item} /> : null}
      </div>
    </div>
  );
}

export default function DisciplesRoadmap({
  id,
  items,
  numberClassName,
}: DisciplesRoadmapProps) {
  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="type-label font-semibold uppercase tracking-[0.28em] text-site-gold">
            Full Roadmap
          </p>
          <h2
            id={id}
            className="type-section-title font-section-title font-bold leading-none tracking-[-0.02em] text-[#1a2744]"
          >
            전체 로드맵
          </h2>
        </div>
        <div className="h-px w-9 bg-[#c9a84c]" />
      </div>

      <div className="relative mt-8">
        <span className="absolute left-[21px] top-[22px] bottom-[22px] w-px bg-[#d7d1c5] md:left-[23px] md:top-[24px] md:bottom-[24px]" />

        <div className="space-y-7 md:space-y-8">
          {items.map((item, index) => (
            <RoadmapRow
              key={`${item.kind}-${index}`}
              item={item}
              numberClassName={numberClassName}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-[16px] bg-[#f8f7f4] px-5 py-5 text-center md:px-5 md:py-5">
        <p className="type-body leading-[1.6] tracking-[0.02em] text-[#888580]">
          총 기간: 5주 + 36주 =
          <span className="font-bold text-[#1a2744]"> 41주</span>
          <span className="mx-3">·</span>
          목표: <span className="font-bold text-[#1a2744]">4세대 재생산 제자</span>
        </p>
      </div>
    </div>
  );
}
