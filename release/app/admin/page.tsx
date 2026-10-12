import { notFound } from 'next/navigation';
import Link from 'next/link';
import { currentUser } from '../../lib/supabase';
import { administrator, saveContent, moderate, reviewReport } from './actions';
import { ActionForm } from '../../components/forms';
import { Heading } from '../../components/ui';
export default async function Admin() {
  if (!(await currentUser())) notFound();
  let context;
  try {
    context = await administrator();
  } catch {
    notFound();
  }
  const { db } = context;
  const [
    lessons,
    sources,
    coaches,
    posts,
    comments,
    reports,
    enquiries,
    categories,
    forumCategories,
  ] = await Promise.all([
    db.from('lessons').select('*').order('title'),
    db.from('sources').select('*').order('title'),
    db.rpc('admin_coaches'),
    db.from('posts').select('*').order('created_at', { ascending: false }).limit(100),
    db.from('comments').select('*').order('created_at', { ascending: false }).limit(100),
    db.from('reports').select('*').order('created_at', { ascending: false }).limit(100),
    db.from('enquiries').select('*').order('created_at', { ascending: false }).limit(100),
    db.from('categories').select('*').order('position'),
    db.from('forum_categories').select('*').order('name'),
  ]);
  for (const r of [
    lessons,
    sources,
    coaches,
    posts,
    comments,
    reports,
    enquiries,
    categories,
    forumCategories,
  ])
    if (r.error) throw new Error('Administration data unavailable.');
  return (
    <div className="container">
      <Heading eyebrow="Administrator workspace" title="Keep the learning trustworthy." />
      <section>
        <h2>Learning categories</h2>
        {categories.data!.map((c) => (
          <details className="citation" key={c.id}>
            <summary>{c.name}</summary>
            <ContentEditor kind="category" value={c} />
          </details>
        ))}
        <details className="citation">
          <summary>Add a learning category</summary>
          <ContentEditor kind="category" value={{ id: '', name: '', position: 14 }} />
        </details>
      </section>
      <section>
        <h2>Forum categories</h2>
        {forumCategories.data!.map((c) => (
          <details className="citation" key={c.id}>
            <summary>{c.name}</summary>
            <ContentEditor kind="forum-category" value={c} />
          </details>
        ))}
        <details className="citation">
          <summary>Add a forum category</summary>
          <ContentEditor kind="forum-category" value={{ id: '', name: '' }} />
        </details>
      </section>
      <section>
        <h2>Learning content</h2>
        {lessons.data!.map((l) => (
          <details className="citation" key={l.id}>
            <summary>
              {l.title} · {l.status}
            </summary>
            <ContentEditor kind="lesson" value={l.data} />
            <Link href={`/learn/${l.id}`}>View published guide</Link>
          </details>
        ))}
        <details className="citation">
          <summary>Add a guide</summary>
          <ContentEditor kind="lesson" value={{}} />
        </details>
      </section>
      <section>
        <h2>Source records</h2>
        {sources.data!.map((s) => (
          <details className="citation" key={s.id}>
            <summary>
              {s.title} · {s.status}
            </summary>
            <ContentEditor kind="source" value={s} />
          </details>
        ))}
        <details className="citation">
          <summary>Add a source</summary>
          <ContentEditor kind="source" value={{}} />
        </details>
      </section>
      <section>
        <h2>Coach permissions</h2>
        {(coaches.data as { id: string; name: string; status: string }[]).map((c) => (
          <details key={c.id} className="citation">
            <summary>
              {c.name} · {c.status}
            </summary>
            <ContentEditor kind="coach" value={c} />
          </details>
        ))}
        <details className="citation">
          <summary>Add an authorized coach record</summary>
          <ContentEditor
            kind="coach"
            value={{
              name: '',
              location: '',
              specialties: [],
              bio: '',
              philosophy: '',
              years_experience: 0,
              student_levels: ['Beginner'],
              photo_url: null,
              contact_url: null,
              availability: '',
              lesson_topics: [],
              recommended_lessons: [],
              authorized: false,
              authorization_reference: null,
              status: 'draft',
            }}
          />
        </details>
      </section>
      <section>
        <h2>Reports</h2>
        {reports.data!.map((r) => (
          <div className="comment" key={r.id}>
            <p>{r.reason}</p>
            <div className="meta">
              {r.state} · {r.post_id || r.comment_id}
            </div>
            <form action={reviewReport}>
              <input type="hidden" name="target" value={r.id} />
              <select name="state" aria-label="Report decision">
                <option value="reviewed">Reviewed</option>
                <option value="dismissed">Dismissed</option>
              </select>
              <button className="button small">Save decision</button>
            </form>
          </div>
        ))}
        {!reports.data!.length && <p>No reports.</p>}
      </section>
      <section>
        <h2>Discussion moderation</h2>
        {posts.data!.map((p) => (
          <div className="comment" key={p.id}>
            <strong>{p.title}</strong>
            <p>{p.body}</p>
            <ModerationForm table="posts" target={p.id} hidden={p.hidden} />
          </div>
        ))}
      </section>
      <section>
        <h2>Comment moderation</h2>
        {comments.data!.map((c) => (
          <div className="comment" key={c.id}>
            <p>{c.body}</p>
            <ModerationForm table="comments" target={c.id} hidden={c.hidden} />
          </div>
        ))}
      </section>
      <section>
        <h2>Private session enquiries</h2>
        {enquiries.data!.map((e) => (
          <div className="comment" key={e.id}>
            <div className="meta">
              {e.state} · Coach {e.coach_id}
            </div>
            <p>{e.message}</p>
          </div>
        ))}
        {!enquiries.data!.length && (
          <p>No enquiries yet. Requests are not automatically forwarded.</p>
        )}
      </section>
    </div>
  );
}
function ContentEditor({ kind, value }: { kind: string; value: unknown }) {
  return (
    <ActionForm action={saveContent} label="Save record">
      <input type="hidden" name="kind" value={kind} />
      <label>
        Structured editorial record
        <textarea
          name="record"
          defaultValue={JSON.stringify(value, null, 2)}
          rows={18}
          required
          maxLength={100000}
          spellCheck={false}
        />
      </label>
    </ActionForm>
  );
}
function ModerationForm({
  table,
  target,
  hidden,
}: {
  table: string;
  target: string;
  hidden: boolean;
}) {
  return (
    <form action={moderate}>
      <input type="hidden" name="table" value={table} />
      <input type="hidden" name="target" value={target} />
      <input type="hidden" name="hidden" value={String(!hidden)} />
      <button className="button secondary small">{hidden ? 'Restore' : 'Hide'} content</button>
    </form>
  );
}
