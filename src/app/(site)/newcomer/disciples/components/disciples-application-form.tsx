import TextField from "../../care/components/text-field";

export default function DisciplesApplicationForm() {
  return (
    <form className="mt-8 md:mt-0 md:w-[294px] md:rounded-[12px] md:bg-[#1e2d4f] md:p-[22px]">
      <div className="flex flex-col gap-4">
        <TextField label="이름" placeholder="이름을 입력하세요" />
        <TextField label="연락처" type="tel" placeholder="연락처를 입력하세요" />
        <TextField label="이메일" type="email" placeholder="이메일을 입력하세요" />
      </div>

      <button
        type="button"
        className="mt-10 flex h-10 w-full items-center justify-center rounded-[6px] bg-[#b8955a] text-[0.9375rem] font-bold leading-none tracking-[0.08em] text-white transition hover:bg-[#c9a84c]"
      >
        신청하기
      </button>
    </form>
  );
}
