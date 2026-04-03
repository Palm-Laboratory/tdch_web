import Link from "next/link";
import {
  CHURCH_EMAIL,
  CHURCH_PHONE,
  NEWCOMER_CONTACT_APPLY_TEXT,
  NEWCOMER_CONTACT_DEPARTMENT,
} from "@/lib/site-config";

export default function NewcomerContactSection() {
  return (
    <section className="mt-20 md:mt-[68px]" aria-labelledby="newcomer-contact-title">
      <div className="rounded-[16px] bg-[#1a2744] px-6 py-8 md:flex md:items-end md:justify-between md:px-9 md:py-9">
        <div>
          <p className="type-lead font-semibold uppercase tracking-[0.42em] text-[#c9a84c]">
            Contact
          </p>
          <h2
            id="newcomer-contact-title"
            className="mt-5 font-[var(--font-serif)] type-subsection-title font-bold leading-none tracking-[0.02em] text-white"
          >
            문의
          </h2>

          <div className="mt-6 space-y-2 type-body leading-[1.5] tracking-[0.02em]">
            <p><span className="font-bold text-[#c9a84c]">담당</span> <span className="ml-2 text-white">{NEWCOMER_CONTACT_DEPARTMENT}</span></p>
            <p><span className="font-bold text-[#c9a84c]">전화</span> <span className="ml-2 text-white">{CHURCH_PHONE}</span></p>
            <p><span className="font-bold text-[#c9a84c]">이메일</span> <span className="ml-2 text-white">{CHURCH_EMAIL}</span></p>
            <p><span className="font-bold text-[#c9a84c]">신청</span> <span className="ml-2 text-white">{NEWCOMER_CONTACT_APPLY_TEXT}</span></p>
          </div>
        </div>

        <Link
          href="/newcomer/care#apply"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-[6px] bg-[#c9a84c] px-[18px] type-body font-bold tracking-[0.05em] text-white transition hover:bg-[#d4b261] md:mt-0"
        >
          신청하기 →
        </Link>
      </div>
    </section>
  );
}
