import type { ReactNode } from "react";
import CommissionPathBar from "./_components/commission-path-bar";
import CommissionSubnav from "./_components/commission-subnav";

export default function CommissionLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full flex-col bg-white">
      <section className="relative overflow-hidden bg-[#1a2744]">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,0.12)_0.9px,transparent_0.9px)] [background-position:0_0] [background-size:16px_16px]" />
        <div className="relative flex min-h-[180px] flex-col items-center justify-center px-6 py-14 text-center md:min-h-[220px] md:py-16">
          <h1 className="font-[var(--font-serif)] text-[30px] font-bold tracking-[0.04em] text-white md:text-[38px]">
            지상명령
          </h1>
          <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.36em] text-white/65 md:text-[11px]">
            The Great Commission
          </p>
        </div>
      </section>

      <CommissionPathBar />
      <CommissionSubnav />
      {children}
    </div>
  );
}
