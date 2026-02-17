const phone = process.env.NEXT_PUBLIC_CHURCH_PHONE ?? "010-0000-0000";
const email = process.env.NEXT_PUBLIC_CHURCH_EMAIL ?? "hello@deojeja.church";
const address =
  process.env.NEXT_PUBLIC_CHURCH_ADDRESS ?? "서울시 OO구 OO로 00, 더 제자교회";

export default function SiteFooter() {
  return (
    <footer className="border-t border-cedar/10 bg-ink py-8 text-ivory/80 md:py-10">
      <div className="mx-auto grid max-w-6xl gap-4 px-4 text-sm md:px-6 lg:grid-cols-2">
        <div className="space-y-2">
          <p className="font-serif text-xl text-ivory">더 제자교회</p>
          <p>복음으로 사람을 세우는 공동체</p>
        </div>
        <div className="space-y-1 text-left lg:text-right">
          <p>{address}</p>
          <p>{phone}</p>
          <p>{email}</p>
        </div>
      </div>
    </footer>
  );
}
