import type { Metadata } from "next";
import SectionHeading from "@/components/section-heading";
import { GIVING_BANK, GIVING_OWNER } from "@/lib/site-config";
import CopyAccountButton from "./components/copy-account-button";

export const metadata: Metadata = {
  title: "헌금안내",
  description: "온라인 헌금 방법, 입금자명 작성 예시, 온라인 계좌 안내를 확인하실 수 있습니다.",
};

const senderNameExamples = {
  description: "예) 홍길동 성도가 헌금을 하는 경우",
  items: [
    { label: "주정헌금의 경우:", value: "홍길동주정" },
    { label: "십일조의 경우:", value: "홍길동십일" },
  ],
};

const offeringTypeExamples = [
  { korean: "주정헌금", code: "주정" },
  { korean: "십일조", code: "십일" },
  { korean: "감사헌금", code: "감사" },
  { korean: "선교헌금", code: "선교" },
  { korean: "절기헌금", code: "절기" },
];

function normalizeGivingAccount(raw: string, ownerFallback: string) {
  const normalized = raw.replace(/\s+/g, " ").trim();
  const accountNumberMatch = normalized.match(/\d[\d-]*/);
  const accountNumber = accountNumberMatch?.[0] ?? "";
  const bankName = normalized
    .replace(/\s*예금주:.*$/, "")
    .replace(accountNumber, "")
    .trim() || "계좌 정보 확인 필요";

  const ownerMatch = normalized.match(/예금주:\s*(.+)$/);
  const owner = ownerMatch?.[1]?.trim() || ownerFallback;

  return {
    bankName,
    accountNumber,
    owner,
    copyValue: accountNumber.replace(/-/g, ""),
  };
}

const givingAccount = normalizeGivingAccount(GIVING_BANK, GIVING_OWNER);

export default function GivingPage() {
  return (
    <div className="section-shell section-shell--narrow pt-10 pb-20 md:pt-16">
      <section className="mb-4 md:mb-8">
        <SectionHeading as="h1" label="Online Offering Guide" title="온라인 헌금방법" />
        <ul className="type-body mt-5 space-y-3 text-ink/78">
          <li className="flex items-start gap-4">
            <span className="list-bullet list-bullet--navy mt-2 shrink-0" />
            <span>
              온라인 입금 시 정확한 본인 확인을 위해 아래 방법으로 입금자명을
              기재해 주세요.
            </span>
          </li>
        </ul>
      </section>

      <section className="overflow-hidden border border-black/10 bg-white">
        <div className="px-6 py-7 md:px-10 md:py-9">
          <p className="type-label font-semibold uppercase tracking-[0.28em] text-ink/38">
            입금자명 기재 방법
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 md:gap-4">
            <span className="type-card-title inline-flex min-h-11 items-center rounded-[6px] bg-ink px-6 py-2 font-bold tracking-[-0.03em] text-white md:min-h-[54px] md:px-7">
              이름
            </span>
            <span className="type-card-title font-light leading-none">
              +
            </span>
            <span className="type-card-title inline-flex min-h-11 items-center rounded-[6px] bg-ink px-6 py-2 font-bold tracking-[-0.03em] text-white md:min-h-[54px] md:px-7">
              헌금종류 앞 두 글자
            </span>
          </div>

          <div className="mt-7 border-t border-black/10 pt-7 md:mt-8 md:pt-8">
            <p className="type-body-strong text-ink/65">
              {senderNameExamples.description}
            </p>

            <div className="mt-4 space-y-3 text-ink/72">
              {senderNameExamples.items.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    className="mt-1.5 h-5 w-5 shrink-0 text-ink"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="m13 6 6 6-6 6" />
                  </svg>
                  <p className="type-body leading-[1.7]">
                    <span className="font-semibold text-ink">{item.label}</span>
                    {" "}
                    <strong className="font-bold text-ink">{item.value}</strong>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 md:mt-8">
        <ul className="type-body space-y-3 text-ink/78">
          <li className="flex items-start gap-4">
            <span className="list-bullet list-bullet--navy mt-2 shrink-0" />
            <div>
              <span>헌금 종류 예시입니다.</span>
              <ul className="mt-3 space-y-2 text-ink/72">
                {offeringTypeExamples.map((item) => (
                  <li key={item.korean} className="flex items-start gap-3">
                    <span className="mt-[0.72rem] block h-1.5 w-1.5 shrink-0 rounded-full bg-themeBlue/70" />
                    <span>
                      {item.korean}
                      <span className="mx-2 text-ink/28">-</span>
                      <strong className="font-semibold text-ink">{item.code}</strong>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        </ul>
      </section>

      <section className="mt-8 border border-black/10 bg-white">
        <div className="flex flex-col gap-5 px-6 py-6 md:flex-row md:items-center md:justify-between md:gap-6 md:px-10 md:py-7">
          <div className="flex items-center gap-5 md:gap-7">
            <div className="shrink-0">
              <p className="type-label font-semibold uppercase tracking-[0.24em] text-ink/38">
                Bank Account
              </p>
              <p className="type-body mt-1 text-ink/68">온라인 계좌</p>
            </div>
            <div className="hidden h-14 w-px bg-black/10 md:block" />
            <div className="font-serif tracking-[-0.04em] text-ink">
              <p className="type-card-title leading-[1.2]">
                {givingAccount.bankName} {givingAccount.accountNumber}
              </p>
              <p className="type-body-small mt-1 leading-[1.3] text-ink/72">
                예금주:{givingAccount.owner}
              </p>
            </div>
          </div>

          <CopyAccountButton value={givingAccount.copyValue} />
        </div>
      </section>

      {/* <div className="mt-10 h-px w-full bg-black/10 md:mt-12" />

      <section className="px-4 py-8 text-center md:px-8 md:py-12">
        <p className="font-serif text-[1.5rem] leading-none text-ink/8 md:text-[1.5rem]">
          "
        </p>
        <div className="mt-4 space-y-5 font-serif text-[1.12rem] leading-[1.7] tracking-[-0.03em] text-[#253555] md:mt-5 md:text-[1.3rem]">
          <p>모든 것이 주께로 말미암았사오니</p>
          <p>우리가 주의 손에서 받은 것으로</p>
          <p>주께 드렸을 뿐이니이다</p>
        </div>
        <p className="mt-7 font-serif text-[0.8rem] tracking-[0.18em] text-ink/32 md:mt-9 md:text-[1rem]">
          역대상 29 : 14
        </p>
      </section> */}
    </div>
  );
}
