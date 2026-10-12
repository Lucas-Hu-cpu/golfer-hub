import Link from 'next/link';
import { notFound } from 'next/navigation';
import { catalog, coaches } from '../../../lib/queries';
import { currentUser, database } from '../../../lib/supabase';
import { Heading, Save, ArticleCard } from '../../../components/ui';
import { ActionForm } from '../../../components/forms';
import { enquiryAction } from '../../actions';
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const coach = (await coaches()).find((c) => c.id === id);
  return coach
    ? {
        title: coach.name,
        description: coach.bio,
        alternates: { canonical: `/coaches/${encodeURIComponent(id)}` },
      }
    : { title: 'Coach not found', robots: { index: false, follow: false } };
}
export default async function Coach({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const coach = (await coaches()).find((c) => c.id === id);
  if (!coach) notFound();
  const [user, db, content] = await Promise.all([currentUser(), database(), catalog()]);
  const saved =
    user && db
      ? await db
          .from('saved_coaches')
          .select('coach_id')
          .eq('coach_id', id)
          .eq('user_id', user.id)
          .maybeSingle()
      : null;
  return (
    <div className="container">
      <div className="breadcrumb">
        <Link href="/coaches">Coaches</Link> / {coach.name}
      </div>
      <Heading eyebrow={coach.location} title={coach.name} description={coach.bio} />
      <div className="actions">
        <Save kind="coach" target={id} saved={Boolean(saved?.data)} signedIn={Boolean(user)} />
        <a href={coach.contact_url} className="button secondary" target="_blank" rel="noreferrer">
          Contact coach externally
        </a>
      </div>
      <div className="article-layout">
        <div className="prose">
          {coach.photo_url && (
            <img
              className="profile-photo"
              src={coach.photo_url}
              alt={coach.name}
              referrerPolicy="no-referrer"
            />
          )}
          <h2>Teaching philosophy</h2>
          <p>{coach.philosophy}</p>
          <h2>Specialties</h2>
          <div className="tags">
            {coach.specialties.map((s) => (
              <span className="tag" key={s}>
                {s}
              </span>
            ))}
          </div>
          <h2>Experience</h2>
          <p>
            {coach.years_experience} years of teaching experience. Student levels:{' '}
            {coach.student_levels.join(', ')}.
          </p>
          <h2>Lesson topics</h2>
          <ul>
            {coach.lesson_topics.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <h2>Student reviews</h2>
          <p>No verified student reviews have been published yet.</p>
          <h2>Recommended learning</h2>
          <div className="card-grid two">
            {content.lessons
              .filter((l) => coach.recommended_lessons.includes(l.id))
              .map((l) => (
                <ArticleCard key={l.id} lesson={l} sources={content.sources} />
              ))}
          </div>
        </div>
        <aside className="article-aside">
          <h3>Availability</h3>
          <p>{coach.availability}</p>
          <h3>Request a conversation</h3>
          {user ? (
            <ActionForm action={enquiryAction} label="Request session">
              <input type="hidden" name="coach_id" value={id} />
              <label>
                Your goals and preferred times
                <textarea name="message" minLength={20} maxLength={2000} required rows={5} />
              </label>
              <p className="small-note">
                Saved for Golfer Hub to review. No payment, automatic email or booking confirmation.
              </p>
            </ActionForm>
          ) : (
            <Link href={`/login?next=/coaches/${id}`}>Sign in to send a request</Link>
          )}
        </aside>
      </div>
    </div>
  );
}
