export default function ServiceNotice({ items }: { items: string[] }) {
  return (
    <ul className="type-body space-y-3 text-black/88">
      {items.map((text) => (
        <li key={text} className="flex items-center gap-3">
          <span className="list-bullet list-bullet--navy shrink-0" />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}
