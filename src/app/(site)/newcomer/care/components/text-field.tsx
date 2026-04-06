interface TextFieldProps {
  label: string;
  type?: "text" | "tel" | "email";
  placeholder: string;
}

export default function TextField({
  label,
  type = "text",
  placeholder,
}: TextFieldProps) {
  return (
    <label className="flex w-full flex-col gap-[6px]">
      <span className="type-label font-medium tracking-[0.08em] text-white/50">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        className="h-9 rounded-[6px] border border-[#4f5a75] bg-[#2f3d5d] px-5 type-label text-white outline-none placeholder:text-[#757575] focus:border-[#b8955a]"
      />
    </label>
  );
}
