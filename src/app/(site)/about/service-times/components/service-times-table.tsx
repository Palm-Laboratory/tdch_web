interface ServiceTimeRow {
  title: string;
  schedule: string;
}

interface ServiceTimesTableProps {
  rows: ServiceTimeRow[];
}

export default function ServiceTimesTable({ rows }: ServiceTimesTableProps) {
  return (
    <div className="hidden overflow-x-auto border-x border-b border-t-[3px] border-cedar/15 border-t-ink/90 bg-white md:block">
      <table className="w-full min-w-[560px] table-fixed border-collapse text-left">
        <thead>
          <tr className="border-b border-cedar/15 bg-[#fafcff]">
            <th className="type-label w-1/2 border-r border-cedar/15 px-4 py-4 text-center font-semibold tracking-[0.08em] text-ink/72 lg:px-6 lg:py-5">
              예배
            </th>
            <th className="type-label w-1/2 px-4 py-4 text-center font-semibold tracking-[0.08em] text-ink/72 lg:px-6 lg:py-5">
              시간
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.title} className="border-b border-cedar/15 last:border-b-0">
              <td className="type-body-strong border-r border-cedar/15 px-4 py-5 text-center font-bold text-ink lg:px-6 lg:py-6">
                {row.title}
              </td>
              <td className="type-body px-4 py-5 text-center font-medium text-ink/80 lg:px-6 lg:py-6">
                {row.schedule}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
