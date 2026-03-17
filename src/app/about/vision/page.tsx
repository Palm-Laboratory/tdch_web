export default function VisionPage() {
  return (
    <div className="section-shell max-w-5xl pt-10 md:pt-16 pb-20">
      <div className="text-center mb-16">
         <p className="mb-2 text-xs font-bold tracking-widest text-themeBlue uppercase">Our Vision</p>
         <h2 className="text-3xl font-bold text-ink sm:text-4xl">핵심 가치 및 비전</h2>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
         <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-cedar/10 shadow-sm">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-themeBlue/10 text-themeBlue">
               <svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </div>
            <h3 className="mb-4 text-xl font-bold text-ink">참된 예배</h3>
            <p className="text-sm leading-relaxed text-ink/70">신령과 진정으로 드리는 감격적인 예배를 통해 하나님의 임재를 경험합니다.</p>
         </div>
         <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-cedar/10 shadow-sm">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-themeBlue/10 text-themeBlue">
               <svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72l5 2.73 5-2.73v3.72z"/></svg>
            </div>
            <h3 className="mb-4 text-xl font-bold text-ink">제자 훈련</h3>
            <p className="text-sm leading-relaxed text-ink/70">말씀의 반석 위에 굳게 서서 그리스도의 장성한 분량에 이르기까지 훈련받습니다.</p>
         </div>
         <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-cedar/10 shadow-sm">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-themeBlue/10 text-themeBlue">
               <svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
            </div>
            <h3 className="mb-4 text-xl font-bold text-ink">선교와 나눔</h3>
            <p className="text-sm leading-relaxed text-ink/70">받은 은혜를 지역 사회와 열방에 흘려보내는 선교적 사명을 다합니다.</p>
         </div>
      </div>
    </div>
  );
}
