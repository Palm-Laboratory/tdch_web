import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const youtubeUrl =
    process.env.NEXT_PUBLIC_YOUTUBE_URL ??
    "https://www.youtube.com/@%EB%8D%94%EC%A0%9C%EC%9E%90%EA%B5%90%ED%9A%8C";

  return (
    <div className="section-shell flex w-full flex-col pb-16 pt-0 md:pb-20 md:pt-0">
      <section className="relative left-1/2 w-[min(2200px,122vw)] -translate-x-1/2 overflow-hidden rounded-b-[2rem] shadow-[0_20px_46px_rgba(16,33,63,0.2)]">
        <div className="relative min-h-[430px] md:min-h-[560px]">
          <Image
            src="/images/sample2.jpg"
            alt="더 제자교회 메인 히어로 이미지"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/78 via-ink/52 to-ink/18" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/38 via-transparent to-transparent" />

          <div className="relative z-10 flex min-h-[430px] items-end pb-8 pt-24 md:min-h-[560px] md:pb-10 md:pt-28">
            <div className="section-shell w-full">
              <div className="grid items-end gap-2 lg:grid-cols-[minmax(0,1fr),286px] lg:items-stretch lg:gap-2">
                <div className="w-full max-w-xl space-y-4 rounded-2xl bg-black/30 px-4 py-5 text-ivory backdrop-blur-[2px] md:space-y-5 md:max-w-[680px] md:px-5 md:py-6">
                  <p className="chip w-fit bg-gold/30 text-ivory">VISION</p>
                  <h1 className="font-serif text-4xl leading-[1.18] md:text-6xl">
                    성령으로
                    <br />
                    제자삼는 교회
                  </h1>
                  <p className="mt-2 text-base font-medium leading-relaxed text-ivory/90 md:mt-3 md:text-lg">
                    예수께서 나아와 말씀하여 이르시되 하늘과 땅의 모든 권세를 내게 주셨으니
                    <br />
                    너희는 가서 모든 민족을 제자로 삼아 아버지와 아들과 성령의 이름으로 세례를 베풀고
                    <br />
                    내가 너희에게 분부한 모든 것을 가르쳐 지키게 하라
                    <br />
                    볼지어다 내가 세상 끝날까지 너희와 항상 함께 있으리라
                  </p>
                  <p className="text-sm font-semibold tracking-wide text-white">마태복음 28:18-20</p>
                </div>

                <div className="grid gap-3 lg:h-full lg:grid-rows-2 lg:gap-4">
                  <Link
                    href="/about#location"
                    className="group flex h-[138px] flex-col items-center justify-center rounded-[2rem] border border-white/70 bg-[#f1f3f5] px-4 text-center text-ink shadow-[0_18px_26px_rgba(16,33,63,0.18)] transition duration-300 hover:-translate-y-1 lg:h-full"
                  >
                    <lord-icon
                      src="/images/wired-outline-18-location-pin-hover-jump.json"
                      trigger="hover"
                      style={{ width: "72px", height: "72px" }}
                    ></lord-icon>
                    <p className="mt-1 text-[1.72rem] font-bold leading-none tracking-[-0.01em]">오시는 길</p>
                    <p className="mt-1 text-[1.02rem] font-medium leading-none text-ink/65">Location</p>
                  </Link>

                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex h-[138px] flex-col items-center justify-center rounded-[2rem] border border-white/70 bg-[#f1f3f5] px-4 text-center text-ink shadow-[0_18px_26px_rgba(16,33,63,0.18)] transition duration-300 hover:-translate-y-1 lg:h-full"
                  >
                    <lord-icon
                      src="/images/wired-outline-2547-logo-youtube-hover-pinch.json"
                      trigger="hover"
                      style={{ width: "72px", height: "72px" }}
                    ></lord-icon>
                    <p className="mt-1 text-[1.48rem] font-bold leading-none tracking-[-0.01em]">설교 영상</p>
                    <p className="mt-1 text-[0.94rem] font-medium leading-none text-ink/65">Sermon Video</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
