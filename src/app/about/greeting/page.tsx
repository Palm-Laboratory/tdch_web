import Image from "next/image";
import { Nanum_Myeongjo, Original_Surfer } from "next/font/google";

const originalSurfer = Original_Surfer({
  subsets: ["latin"],
  weight: "400"
});

const nanumMyeongjo = Nanum_Myeongjo({
  subsets: ["latin"],
  weight: ["800"]
});

export default function GreetingPage() {
  return (
    <div className="w-full bg-white">
      <section
        className="relative h-[420px] w-full overflow-hidden md:h-[520px]"
        data-section="hero"
      >
        <div className="absolute inset-0">
          <Image
            src="/images/greeting/greeting_banner.png"
            alt="The 제자교회 인사말 배경 이미지"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/12 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        </div>

        <div className="relative z-10 flex h-full items-end px-5 py-8 md:px-0 md:py-[30px]">
          <div className="section-shell w-full">
            <div className="max-w-[417px] text-white">
              <p
                className={`${originalSurfer.className} text-[11px] uppercase tracking-[0.28em] text-white/80 md:text-[15px] md:tracking-[0.14em]`}
              >
                Pastor&apos;s Greeting
              </p>
              <h1
                className={`${nanumMyeongjo.className} mt-4 text-[34px] font-extrabold leading-[1.15] tracking-[0.02em] md:mt-[18px] md:text-[48px] md:leading-[1.16]`}
              >
                <span className="block">당신이 여기 있어서,</span>
                <span className="block">정말 다행입니다.</span>
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="min-h-[428px] w-full" data-section="welcome" />
      <section className="min-h-[586px] w-full" data-section="mission" />
      <section className="min-h-[482px] w-full" data-section="community" />
      <section className="min-h-[584px] w-full" data-section="open-door" />
    </div>
  );
}
