import Link from 'next/link';
import { notFound } from 'next/navigation';
import { catalog, feed, coaches, taxonomy, voteStates } from '../../../lib/queries';
import { database, currentUser } from '../../../lib/supabase';
import { readingMinutes } from '../../../content/catalog';
import { ArticleCard, Save, ForumPostCard } from '../../../components/ui';
import { LessonMedia } from '../../../components/lesson-media';
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { lessons } = await catalog();
  const lesson = lessons.find((item) => item.id === id);
  return lesson
    ? { title: lesson.title, description: lesson.summary }
    : { title: 'Guide not found' };
}
export default async function Article({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const content = await catalog();
  const lesson = content.lessons.find((l) => l.id === id);
  if (!lesson) notFound();
  const [user, db, discussions, teachers] = await Promise.all([
    currentUser(),
    database(),
    feed({ category: lesson.forum }),
    coaches(),
  ]);
  const votes = await voteStates(
    user?.id,
    discussions.posts.slice(0, 2).map((post) => post.id),
  );
  const saves =
    user && db
      ? await db
          .from('saved_lessons')
          .select('lesson_id')
          .eq('user_id', user.id)
          .eq('lesson_id', id)
          .maybeSingle()
      : null;
  const progress =
    user && db
      ? await db
          .from('lesson_progress')
          .select('lesson_id')
          .eq('user_id', user.id)
          .eq('lesson_id', id)
          .maybeSingle()
      : null;
  if (saves?.error || progress?.error)
    throw new Error('Your saved learning state is temporarily unavailable.');
  const { categories } = await taxonomy();
  return (
    <div className="container">
      <div className="breadcrumb">
        <Link href="/learn">Learning Library</Link> /{' '}
        {categories.find((c) => c.id === lesson.category_id)?.name}
      </div>
      <header className="article-heading">
        <div className="meta">
          {lesson.level} · {readingMinutes(lesson)} min read
        </div>
        <h1>{lesson.title}</h1>
        <p>{lesson.summary}</p>
        <div className="actions">
          <Save kind="lesson" target={id} saved={Boolean(saves?.data)} signedIn={Boolean(user)} />
          <Save
            kind="progress"
            target={id}
            saved={Boolean(progress?.data)}
            signedIn={Boolean(user)}
          />
        </div>
      </header>
      <div className="article-layout">
        <article className="prose">
          <section className="objective">
            <span className="eyebrow">Your lesson objective</span>
            <p>{lesson.objective}</p>
          </section>
          <p>{lesson.introduction}</p>
          <LessonMedia lesson={lesson} />
          <h2>The principle</h2>
          <p>{lesson.principle}</p>
          <h2>Step by step</h2>
          <ol>
            {lesson.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <h2>Common mistakes</h2>
          <ul>
            {lesson.mistakes.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <section className="drill">
            <span className="eyebrow">Take it to practice</span>
            <h2>{lesson.drill.title}</h2>
            <ol>
              {lesson.drill.instructions.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <p>
              <strong>Your checkpoint:</strong> {lesson.drill.measure}
            </p>
          </section>
          <h2>On the course</h2>
          <p>{lesson.course}</p>
          <h2 id="sources">Source basis and further reading</h2>
          <p>
            Original educational synthesis by Golfer Hub. These sources support the principles
            identified below; our drills are adaptations, not quoted or certified instruction.
          </p>
          {lesson.sources.map((ref) => {
            const s = content.sources.find((x) => x.id === ref.id);
            return s ? (
              <div className="citation" key={s.id}>
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.title}
                </a>
                <p>
                  {s.publisher}
                  {s.author ? ` · ${s.author}` : ''}
                  {s.published_date ? ` · ${s.published_date}` : ''}
                </p>
                <p>{ref.supports}</p>
                <small>
                  {s.status === 'indexed'
                    ? 'Search-index text checked; direct automated access restricted.'
                    : 'Official page text checked.'}{' '}
                  Checked {s.checked_on}.
                </small>
              </div>
            ) : null;
          })}
          <p className="small-note">
            Instruction is general, not individual swing diagnosis. Stop if an exercise causes pain,
            and seek qualified help. No publisher endorses Golfer Hub.
          </p>
        </article>
        <aside className="article-aside">
          <h3>Put the lesson to work.</h3>
          <p>Take one observation to your next practice session.</p>
          <Link className="button secondary" href="/dashboard">
            Your practice dashboard
          </Link>
          <h3>Ask the community</h3>
          <Link href={`/forum?category=${lesson.forum}`}>{lesson.forum.replaceAll('-', ' ')}</Link>
          <h3>Coaching perspective</h3>
          {teachers
            .filter((c) => c.recommended_lessons.includes(id))
            .map((c) => (
              <Link key={c.id} href={`/coaches/${c.id}`}>
                {c.name}
              </Link>
            ))}
          <Link href="/coaches">Explore authorized coaches</Link>
        </aside>
      </div>
      <section>
        <h2>Related guides</h2>
        <div className="card-grid">
          {content.lessons
            .filter((l) => lesson.related.includes(l.id))
            .map((l) => (
              <ArticleCard key={l.id} lesson={l} sources={content.sources} />
            ))}
        </div>
      </section>
      <section>
        <h2>Related discussions</h2>
        {discussions.posts.length ? (
          discussions.posts
            .slice(0, 2)
            .map((p) => (
              <ForumPostCard
                key={p.id}
                post={p}
                signedIn={Boolean(user)}
                myVote={votes.get(p.id)}
              />
            ))
        ) : (
          <p>
            No published discussions in this topic yet.{' '}
            <Link href="/forum/new">Start a conversation.</Link>
          </p>
        )}
      </section>
    </div>
  );
}
