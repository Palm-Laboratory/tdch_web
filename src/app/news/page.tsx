import SectionTitle from "@/components/section-title";
import { newsPosts } from "@/lib/site-data";

export default function NewsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 pb-16 pt-10 md:space-y-10 md:px-6 md:pb-20 md:pt-12">
      <SectionTitle
        eyebrow="Church News"
        title="교회소식"
        description="주보, 공지, 행사 소식을 한 곳에서 확인하세요."
      />

      <div className="space-y-4 md:space-y-5">
        {newsPosts.map((post) => (
          <article key={post.title} className="rounded-2xl border border-cedar/10 bg-white/80 p-5 md:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-moss/10 px-3 py-1 text-xs font-semibold text-moss">
                {post.category}
              </span>
              <p className="text-xs text-ink/50">{post.date}</p>
            </div>
            <h3 className="mt-3 text-xl font-semibold text-ink">{post.title}</h3>
            <p className="mt-3 text-sm text-ink/75">{post.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
