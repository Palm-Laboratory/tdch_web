interface TimeOptionProps {
  id: string;
  label: string;
  defaultChecked?: boolean;
}

export default function TimeOption({
  id,
  label,
  defaultChecked = false,
}: TimeOptionProps) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-[6px]">
      <input
        id={id}
        name="preferred-time"
        type="radio"
        value={label}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="h-[14px] w-[14px] shrink-0 rounded-full border border-white/35 bg-transparent transition peer-checked:border-[#b8955a] peer-checked:bg-[#b8955a]"
      />
      <span className="type-label font-medium tracking-[0.02em] text-white/55 transition peer-checked:text-white">
        {label}
      </span>
    </label>
  );
}
