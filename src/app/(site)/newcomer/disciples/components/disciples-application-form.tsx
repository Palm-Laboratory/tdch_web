import TextField from "../../care/components/text-field";

interface StageOption {
  id: string;
  label: string;
  defaultChecked?: boolean;
}

interface DisciplesApplicationFormProps {
  stageOptions: readonly StageOption[];
}

function StageRadioOption({
  id,
  label,
  defaultChecked = false,
}: StageOption) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-[6px]">
      <input
        id={id}
        name="disciples-stage"
        type="radio"
        value={label}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="h-[14px] w-[14px] shrink-0 rounded-full border border-white/35 bg-white transition peer-checked:border-[#b8955a] peer-checked:bg-[#b8955a]"
      />
      <span className="type-label font-medium tracking-[0.02em] text-white/70 transition peer-checked:text-white">
        {label}
      </span>
    </label>
  );
}

export default function DisciplesApplicationForm({
  stageOptions,
}: DisciplesApplicationFormProps) {
  return (
    <form className="mt-8 rounded-[12px] bg-[#1e2d4f] p-[22px] md:mt-0 md:w-[294px]">
      <div className="flex flex-col gap-4">
        <TextField label="이름" placeholder="이름을 입력하세요" />
        <TextField label="연락처" type="tel" placeholder="연락처를 입력하세요" />
        <TextField label="이메일" type="email" placeholder="이메일을 입력하세요" />

        <fieldset className="border-0 p-0">
          <legend className="type-label font-medium tracking-[0.08em] text-white/50">
            신청 과정
          </legend>
          <div className="mt-3 flex flex-col gap-[10px]">
            {stageOptions.map((option) => (
              <StageRadioOption key={option.id} {...option} />
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
