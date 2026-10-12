import Link from 'next/link';
import { catalog, taxonomy } from '../../lib/queries';
import { ArticleCard, Heading, SearchBar, Empty } from '../../components/ui';
export const metadata = { title: 'Learning Library', alternates: { canonical: '/learn' } };
export default async function Learn({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const { lessons, sources } = await catalog();
  const { categories } = await taxonomy();
  const selected = lessons.filter(
    (l) =>
      (!params.category || l.category_id === params.category) &&
      (!params.level || l.level === params.level) &&
      (!params.q || `${l.title} ${l.summary}`.toLowerCase().includes(params.q.toLowerCase())),
  );
  return (
    <div className="container">
      <Heading
        eyebrow="Learn with purpose"
        title="Your golf learning library."
        description="Clear fundamentals, practical drills, and a source trail you can follow."
      />
      <div className="hub-layout">
        <aside className="category-sidebar">
          <h2>Browse by topic</h2>
          <Link href="/learn" aria-current={!params.category ? 'page' : undefined}>
            All guides <span>{lessons.length}</span>
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/learn?category=${c.id}`}
              aria-current={params.category === c.id ? 'page' : undefined}
            >
              {c.name}
              <span>{lessons.filter((l) => l.category_id === c.id).length}</span>
            </Link>
          ))}
        </aside>
        <div>
          <form className="filter-bar">
            <SearchBar placeholder="Search learning guides" value={params.q} />
            <input type="hidden" name="category" value={params.category || ''} />
            <label>
              <span className="sr-only">Skill level</span>
              <select name="level" defaultValue={params.level || ''}>
                <option value="">All levels</option>
                {['Beginner', 'Intermediate', 'Advanced'].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </label>
            <button className="button small">Search</button>
          </form>
          <p className="results-count">
            {selected.length} {selected.length === 1 ? 'guide' : 'guides'}
            {params.category
              ? ` · ${categories.find((c) => c.id === params.category)?.name || 'Unknown category'}`
              : ''}
          </p>
          {selected.length ? (
            <div className="card-grid two">
              {selected.map((l) => (
                <ArticleCard key={l.id} lesson={l} sources={sources} />
              ))}
            </div>
          ) : (
            <Empty title="No guides match yet.">
              <p>Try another topic or a shorter search.</p>
              <Link href="/learn">Clear filters</Link>
            </Empty>
          )}
        </div>
      </div>
    </div>
  );
}
