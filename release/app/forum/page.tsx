import Link from 'next/link';
import { feed, taxonomy, voteStates } from '../../lib/queries';
import { currentUser } from '../../lib/supabase';
import { Heading, SearchBar, ForumPostCard, Empty } from '../../components/ui';
export const metadata = { title: 'Community Forum' };
export default async function Forum({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const [result, user] = await Promise.all([feed({ ...params, page }), currentUser()]);
  const { forumCategories } = await taxonomy();
  const votes = await voteStates(
    user?.id,
    result.posts.map((post) => post.id),
  );
  return (
    <div className="container">
      <div className="section-head">
        <Heading
          eyebrow="The clubhouse"
          title="Talk golf. Get a fresh perspective."
          description="Specific questions, shared experience, and room to learn."
        />
        <Link href="/forum/new" className="button">
          Create post
        </Link>
      </div>
      <div className="hub-layout">
        <aside className="category-sidebar">
          <h2>Conversations</h2>
          <Link href="/forum" aria-current={!params.category ? 'page' : undefined}>
            All discussions
          </Link>
          {forumCategories.map((c) => (
            <Link
              key={c.id}
              href={`/forum?category=${c.id}`}
              aria-current={params.category === c.id ? 'page' : undefined}
            >
              {c.name}
            </Link>
          ))}
          <Link href="/guidelines">Community guidelines</Link>
        </aside>
        <div>
          <form className="filter-bar">
            <SearchBar placeholder="Search discussion titles" value={params.q} />
            <input type="hidden" name="category" value={params.category || ''} />
            <select aria-label="Sort discussions" name="sort" defaultValue={params.sort || 'hot'}>
              <option value="hot">Hot</option>
              <option value="new">New</option>
              <option value="top">Top</option>
              <option value="unanswered">Unanswered</option>
            </select>
            <button className="button small">Search</button>
          </form>
          <details className="sort-note">
            <summary>How sorting works</summary>
            <p>
              Hot combines votes and comments with a time-decay score. Top sorts by all-time net
              votes. New sorts by publication time. Unanswered shows discussions with no visible
              comments, newest first.
            </p>
          </details>
          {result.posts.length ? (
            result.posts.map((p) => (
              <ForumPostCard
                key={p.id}
                post={p}
                signedIn={Boolean(user)}
                myVote={votes.get(p.id)}
              />
            ))
          ) : (
            <Empty
              title={
                result.available
                  ? 'No discussions here yet.'
                  : 'Community connection is being prepared.'
              }
            >
              <p>
                {result.available
                  ? 'Ask a question about your game, or try a different category.'
                  : 'Public posts will appear here when the test database is connected.'}
              </p>
              <Link href="/forum/new" className="button secondary">
                Start a discussion
              </Link>
            </Empty>
          )}
          <div className="pagination">
            {page > 1 && (
              <Link
                href={`/forum?${new URLSearchParams({ ...(Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined)) as Record<string, string>), page: String(page - 1) })}`}
              >
                Previous
              </Link>
            )}
            {result.count > page * 20 && (
              <Link
                href={`/forum?${new URLSearchParams({ ...(Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined)) as Record<string, string>), page: String(page + 1) })}`}
              >
                Next
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
