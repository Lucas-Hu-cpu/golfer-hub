import Link from 'next/link';
import { coaches } from '../../lib/queries';
import { Heading, SearchBar, CoachCard, Empty } from '../../components/ui';
export const metadata = { title: 'Discover Coaches', alternates: { canonical: '/coaches' } };
const specialties = [
  'Swing Coach',
  'Short Game',
  'Putting',
  'Course Strategy',
  'Junior Golf',
  'Tournament Preparation',
  'Beginner Friendly',
];
export default async function Coaches({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const list = (await coaches()).filter(
    (c) =>
      (!params.q ||
        `${c.name} ${c.location} ${c.bio}`.toLowerCase().includes(params.q.toLowerCase())) &&
      (!params.specialty || c.specialties.includes(params.specialty)),
  );
  return (
    <div className="container">
      <Heading
        eyebrow="Coaching connections"
        title="Find a perspective that fits your game."
        description="Teaching philosophy, experience, and a conversation before any commitment."
      />
      <form className="filter-bar">
        <SearchBar placeholder="Search coaches or location" value={params.q} />
        <select
          name="specialty"
          aria-label="Coaching specialty"
          defaultValue={params.specialty || ''}
        >
          <option value="">All specialties</option>
          {specialties.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <button className="button small">Search</button>
      </form>
      <p className="results-count">
        {list.length} authorized coach {list.length === 1 ? 'profile' : 'profiles'}
      </p>
      {list.length ? (
        <div className="card-grid">
          {list.map((c) => (
            <CoachCard key={c.id} coach={c} />
          ))}
        </div>
      ) : (
        <Empty title="Our directory is taking shape.">
          <p>
            We publish coach profiles only with permission and verified contact information. No
            coaches currently match these filters.
          </p>
          <a
            className="button secondary"
            href="https://www.pga.com/coach"
            rel="noreferrer"
            target="_blank"
          >
            Explore PGA Coach independently
          </a>
          <Link href="/learn">Keep learning at Golfer Hub</Link>
        </Empty>
      )}
      <p className="small-note">
        Golfer Hub is not affiliated with PGA of America. A request is an enquiry, not a paid or
        confirmed booking. Ratings appear only when genuine review data is available.
      </p>
    </div>
  );
}
