export default function ServiceNotice({ items }: { items: string[] }) {
  return (
    <ul className="type-body space-y-3 text-ink/75">
      {items.map((text) => (
        <li key={text} className="flex gap-3">
          <span className="mt-[11px] h-2 w-2 shrink-0 rounded-full bg-themeBlue" />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}
