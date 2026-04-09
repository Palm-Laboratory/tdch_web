import TextField from "./text-field";
import TimeOption from "./time-option";

interface TimeOptionItem {
  id: string;
  label: string;
  defaultChecked?: boolean;
}

interface ApplicationFormProps {
  timeOptions: readonly TimeOptionItem[];
}

export default function ApplicationForm({ timeOptions }: ApplicationFormProps) {
  return (
    <form className="mt-8 rounded-[12px] bg-[#1e2d4f] p-[22px] md:mt-0 md:w-[294px]">
      <div className="flex flex-col gap-4">
        <TextField label="이름" placeholder="이름을 입력하세요" />
        <TextField label="연락처" type="tel" placeholder="연락처를 입력하세요" />
        <TextField label="이메일" type="email" placeholder="이메일을 입력하세요" />

        <fieldset className="border-0 p-0">
          <legend className="type-label font-medium tracking-[0.08em] text-white/50">
            희망 요일
          </legend>
          <div className="mt-[10px] flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
            {timeOptions.map((option) => (
              <TimeOption
                key={option.id}
                id={option.id}
                label={option.label}
                defaultChecked={option.defaultChecked}
              />
            ))}
          </div>
        </fieldset>
      </div>

      <button
        type="button"
        className="mt-4 flex h-10 w-full items-center justify-center rounded-[6px] bg-[#b8955a] type-label font-black tracking-[0.08em] text-white transition hover:bg-[#c9a84c]"
      >
        신청하기
      </button>
    </form>
  );
}
