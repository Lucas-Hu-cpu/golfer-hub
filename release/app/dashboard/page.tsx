import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Archive, RotateCcw, Check } from 'lucide-react';
import { authenticated, currentUser } from '../../lib/supabase';
import { catalog, coaches, voteStates, type Post } from '../../lib/queries';
import { learningPath } from '../../content/catalog';
import { weekStart } from '../../lib/practice';
import { Heading, ArticleCard, CoachCard, ForumPostCard } from '../../components/ui';
import { ActionForm } from '../../components/forms';
import { addPractice, togglePractice, editPractice, archivePractice } from '../actions';
export const metadata = { title: 'Your Dashboard' };

type PracticeItem = {
  id: string;
  title: string;
  completed: boolean;
  kind: string;
  week: string | null;
  archived: boolean;
};
export default async function Dashboard() {
  if (!(await currentUser())) redirect('/login?next=/dashboard');
  const { db, user } = await authenticated();
  const [
    content,
    teachers,
    profile,
    saved,
    goals,
    progress,
    posts,
    comments,
    savedCoaches,
    enquiries,
  ] = await Promise.all([
    catalog(),
    coaches(),
    db.from('profiles').select('*').eq('id', user.id).single(),
    db.from('saved_lessons').select('lesson_id').eq('user_id', user.id),
    db
      .from('practice_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    db.from('lesson_progress').select('lesson_id').eq('user_id', user.id),
    db
      .from('post_feed')
      .select('*')
      .eq('user_id', user.id)
      .eq('hidden', false)
      .order('created_at', { ascending: false }),
    db
      .from('comments')
      .select('*,posts!inner(hidden)')
      .eq('user_id', user.id)
      .eq('hidden', false)
      .eq('posts.hidden', false)
      .order('created_at', { ascending: false }),
    db.from('saved_coaches').select('coach_id').eq('user_id', user.id),
    db.from('enquiries').select('id,coach_id,message,state,created_at').eq('user_id', user.id),
  ]);
  for (const result of [
    profile,
    saved,
    goals,
    progress,
    posts,
    comments,
    savedCoaches,
    enquiries,
  ]) {
    if (result.error) throw new Error('Your dashboard could not be loaded.');
  }
  const done = new Set(progress.data!.map((r) => r.lesson_id));
  const votes = await voteStates(
    user.id,
    posts.data!.map((post) => post.id),
  );
  const next = learningPath.find((id) => !done.has(id));
  const items = goals.data as PracticeItem[];
  const thisWeek = weekStart();
  const active = items.filter((item) => !item.archived);
  const currentChecklist = active.filter(
    (item) => item.kind === 'checklist' && item.week && weekStart(new Date(item.week)) === thisWeek,
  );
  const previousChecklist = active.filter(
    (item) => item.kind === 'checklist' && !currentChecklist.includes(item),
  );
  const completedGuides = content.lessons.filter((lesson) => done.has(lesson.id)).length;
  return (
    <div className="container">
      <Heading
        eyebrow="Your game, your pace"
        title={`Welcome back, ${profile.data!.display_name}.`}
        description="Turn what you are learning into a purposeful practice session."
      />
      <section className="learning-path">
        <div>
          <span className="eyebrow">Current path · Beginner Ball Striking</span>
          <h2>
            {next
              ? content.lessons.find((l) => l.id === next)?.title
              : 'Your learning path is complete.'}
          </h2>
          <p>{`${completedGuides} ${completedGuides === 1 ? 'guide' : 'guides'} completed`}</p>
          {next && (
            <Link className="button" href={`/learn/${next}`}>
              Continue learning
            </Link>
          )}
        </div>
        <progress
          value={learningPath.filter((id) => done.has(id)).length}
          max={learningPath.length}
          aria-label="Learning path progress"
        />
      </section>
      <div className="dashboard-grid">
        <section>
          <h2>Practice goals</h2>
          <PracticeList items={active.filter((r) => r.kind === 'goal')} />
          <PracticeForm kind="goal" />
        </section>
        <section>
          <h2>Weekly practice checklist</h2>
          <p className="small-note">Week of {thisWeek} (UTC)</p>
          <PracticeList items={currentChecklist} />
          <PracticeForm kind="checklist" />
          {previousChecklist.length > 0 && (
            <details>
              <summary>Previous weeks</summary>
              <PracticeList items={previousChecklist} />
            </details>
          )}
        </section>
      </div>
      {items.some((item) => item.archived) && (
        <section>
          <details>
            <summary>Archived practice items</summary>
            <PracticeList items={items.filter((item) => item.archived)} />
          </details>
        </section>
      )}
      <section>
        <h2>Saved learning guides</h2>
        {saved.data!.length ? (
          <div className="card-grid">
            {content.lessons
              .filter((l) => saved.data!.some((s) => s.lesson_id === l.id))
              .map((l) => (
                <ArticleCard key={l.id} lesson={l} sources={content.sources} />
              ))}
          </div>
        ) : (
          <p>
            No saved guides yet. <Link href="/learn">Explore the learning library.</Link>
          </p>
        )}
      </section>
      <section>
        <h2>My discussions</h2>
        {posts.data!.length ? (
          posts.data!.map((p) => (
            <ForumPostCard key={p.id} post={p as Post} signedIn myVote={votes.get(p.id)} />
          ))
        ) : (
          <p>
            No posts yet. <Link href="/forum/new">Ask your first question.</Link>
          </p>
        )}
      </section>
      <section>
        <h2>My comments</h2>
        {comments.data!.length ? (
          comments.data!.map((c) => (
            <div className="comment" key={c.id}>
              <p>{c.body}</p>
              <Link href={`/forum/${c.post_id}`}>View discussion</Link>
            </div>
          ))
        ) : (
          <p>You have not commented yet.</p>
        )}
      </section>
      <section>
        <h2>Saved coaches</h2>
        {savedCoaches.data!.length ? (
          <div className="card-grid">
            {teachers
              .filter((c) => savedCoaches.data!.some((s) => s.coach_id === c.id))
              .map((c) => (
                <CoachCard key={c.id} coach={c} />
              ))}
          </div>
        ) : (
          <p>
            No saved coaches yet. <Link href="/coaches">Browse the directory.</Link>
          </p>
        )}
      </section>
      <section>
        <h2>Session enquiries</h2>
        {enquiries.data!.map((e) => (
          <div key={e.id} className="comment">
            <p>{e.message}</p>
            <span className="tag">{e.state}</span>
          </div>
        ))}
        {!enquiries.data!.length && <p>No session requests yet.</p>}
      </section>
    </div>
  );
}
function PracticeList({ items }: { items: PracticeItem[] }) {
  return items.length ? (
    <ul className="practice-list">
      {items.map((item) => (
        <li key={item.id}>
          {!item.archived && (
            <form action={togglePractice}>
              <input type="hidden" name="id" value={item.id} />
              <button
                role="checkbox"
                aria-checked={item.completed}
                className={item.completed ? 'check done' : 'check'}
                aria-label={`Mark ${item.title} ${item.completed ? 'incomplete' : 'complete'}`}
              >
                {item.completed && <Check size={15} />}
              </button>
            </form>
          )}
          <div className="practice-item-body">
            <span className={item.completed ? 'completed' : ''}>{item.title}</span>
            {!item.archived && (
              <details>
                <summary>Edit</summary>
                <ActionForm action={editPractice} label="Save changes">
                  <input type="hidden" name="id" value={item.id} />
                  <label>
                    Practice item
                    <input
                      name="title"
                      defaultValue={item.title}
                      required
                      minLength={3}
                      maxLength={200}
                    />
                  </label>
                </ActionForm>
              </details>
            )}
          </div>
          <form action={archivePractice}>
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="archived" value={String(!item.archived)} />
            <button
              className="icon"
              aria-label={`${item.archived ? 'Restore' : 'Archive'} ${item.title}`}
              title={item.archived ? 'Restore item' : 'Archive item'}
            >
              {item.archived ? <RotateCcw size={17} /> : <Archive size={17} />}
            </button>
          </form>
        </li>
      ))}
    </ul>
  ) : (
    <p className="small-note">No practice items yet.</p>
  );
}
function PracticeForm({ kind }: { kind: 'goal' | 'checklist' }) {
  return (
    <ActionForm action={addPractice} label="Add item">
      <input type="hidden" name="kind" value={kind} />
      <label className="sr-only" htmlFor={kind}>
        New {kind}
      </label>
      <input
        id={kind}
        name="title"
        required
        minLength={3}
        maxLength={200}
        placeholder={
          kind === 'goal'
            ? 'e.g. Record ten iron strikes'
            : 'e.g. Practise putting distance control'
        }
      />
    </ActionForm>
  );
}
