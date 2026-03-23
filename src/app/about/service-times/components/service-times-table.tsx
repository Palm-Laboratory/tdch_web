interface ServiceTimeRow {
  title: string;
  schedule: string;
  location: string;
}

interface ServiceTimesTableProps {
  mainLocationRows: ServiceTimeRow[];
  otherLocationRows: ServiceTimeRow[];
}

export default function ServiceTimesTable({
  mainLocationRows,
  otherLocationRows,
}: ServiceTimesTableProps) {
  return (
    <div className="hidden overflow-x-auto border-x border-b border-t-[3px] border-cedar/15 border-t-ink/90 bg-white md:block">
      <table className="w-full min-w-[680px] table-fixed border-collapse text-left lg:min-w-[760px]">
        <thead>
          <tr className="border-b border-cedar/15 bg-[#fafcff]">
            <th className="type-label w-[38%] border-r border-cedar/15 px-4 py-4 text-center font-semibold tracking-[0.08em] text-ink/72 lg:px-6 lg:py-5">
              구분
            </th>
            <th className="type-label w-[37%] border-r border-cedar/15 px-4 py-4 text-center font-semibold tracking-[0.08em] text-ink/72 lg:px-6 lg:py-5">
              시간
            </th>
            <th className="type-label w-[25%] px-4 py-4 text-center font-semibold tracking-[0.08em] text-ink/72 lg:px-6 lg:py-5">
              장소
            </th>
          </tr>
        </thead>
        <tbody>
          {mainLocationRows.map((row, index) => (
            <tr key={row.title} className="border-b border-cedar/15 last:border-b-0">
              <td className="type-body-strong border-r border-cedar/15 px-4 py-5 text-center font-bold text-ink lg:px-6 lg:py-6">
                {row.title}
              </td>
              <td className="type-body border-r border-cedar/15 px-4 py-5 text-center font-medium text-ink/80 lg:px-6 lg:py-6">
                {row.schedule}
              </td>
              {index === 0 ? (
                <td
                  rowSpan={mainLocationRows.length}
                  className="type-body px-4 py-5 text-center align-middle font-medium text-ink/80 lg:px-6 lg:py-6"
                >
                  나인아트홀(지하1층)
                </td>
              ) : null}
            </tr>
          ))}
          {otherLocationRows.map((row) => (
            <tr key={row.title} className="border-b border-cedar/15 last:border-b-0">
              <td className="type-body-strong border-r border-cedar/15 px-4 py-5 text-center font-bold text-ink lg:px-6 lg:py-6">
                {row.title}
              </td>
              <td className="type-body border-r border-cedar/15 px-4 py-5 text-center font-medium text-ink/80 lg:px-6 lg:py-6">
                {row.schedule}
              </td>
              <td className="type-body px-4 py-5 text-center align-middle font-medium text-ink/80 lg:px-6 lg:py-6">
                {row.location}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
