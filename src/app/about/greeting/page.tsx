import { Gowun_Batang } from "next/font/google";

const gowunBatang = Gowun_Batang({ subsets: ["latin"], weight: ["400", "700"] });

export default function GreetingPage() {
  return (
    <div className="mx-auto max-w-4xl text-center py-8">
      <h2 className="mb-4 text-3xl font-bold text-ink sm:text-4xl md:mb-6">환영합니다</h2>
      <div className={`${gowunBatang.className} space-y-6 text-lg leading-relaxed text-ink/80 md:text-xl`}>
        <p>
          The 제자교회는 예수님의 지상명령(마태복음 28:18-20)을 따라 세워진 선교적 교회입니다.<br className="hidden md:block"/>
          우리는 모든 성도가 참된 예배자로 세워지고, 예수 그리스도의 제자가 되어 세상을 변화시키는 작은 예수가 되기를 소망합니다.
        </p>
        <p>
          성령의 인도하심 아래 뜨거운 예배와 깊이 있는 말씀 양육,<br className="hidden md:block"/>
          그리고 사랑이 넘치는 교제를 통해 상처 입은 영혼들이 회복되고 치유받는 안식처가 되고자 합니다.
        </p>
        <p>
          여러분을 그리스도의 사랑으로 환영하고 축복합니다.
        </p>
      </div>
      <div className="mt-12 md:mt-16">
        <p className="text-sm font-semibold tracking-widest text-themeBlue uppercase">담임목사</p>
        <p className="mt-2 text-2xl font-bold text-ink">이 진 욱</p>
      </div>
    </div>
  );
}
