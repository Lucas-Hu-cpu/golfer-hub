import Link from 'next/link';
import {
  ArrowRight,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Clock,
  Bookmark,
  MapPin,
} from 'lucide-react';
import { readingMinutes, type Lesson, type Source } from '../content/catalog';
import { taxonomy, type Post, type Coach } from '../lib/queries';
import { toggleRecord, vote } from '../app/actions';
import { Submit } from './forms';

export function Heading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="page-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}
export function Empty({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="empty">
      <FlagMark />
      <h2>{title}</h2>
      {children}
    </div>
  );
}
function FlagMark() {
  return <span className="empty-mark">GH</span>;
}
export function SourceBadge({ lesson, sources }: { lesson: Lesson; sources: Source[] }) {
  const unique = [
    ...new Set(
      lesson.sources.map((s) => sources.find((x) => x.id === s.id)?.publisher).filter(Boolean),
    ),
  ];
  return (
    <div className="source-badge">
      Source basis: {unique.join(' · ') || 'Editorial review required'}
    </div>
  );
}
export async function ArticleCard({ lesson, sources }: { lesson: Lesson; sources: Source[] }) {
  const { categories } = await taxonomy();
  return (
    <article className="article-card">
      <div className={`article-art art-${lesson.diagram}`}>
        <span>{categories.find((c) => c.id === lesson.category_id)?.name}</span>
        <span className="art-number">
          {lesson.diagram === 'flight'
            ? '01'
            : lesson.diagram === 'setup'
              ? '02'
              : lesson.diagram === 'target'
                ? '03'
                : '04'}
        </span>
      </div>
      <div className="card-body">
        <div className="meta">
          <span>{lesson.level}</span>
          <span>
            <Clock size={13} />
            {readingMinutes(lesson)} min read
          </span>
        </div>
        <h3>
          <Link href={`/learn/${lesson.id}`}>{lesson.title}</Link>
        </h3>
        <p>{lesson.summary}</p>
        <SourceBadge lesson={lesson} sources={sources} />
        <Link className="arrow-link" href={`/learn/${lesson.id}`}>
          Read guide
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
export function Save({
  kind,
  target,
  saved,
  signedIn,
}: {
  kind: 'lesson' | 'coach' | 'progress';
  target: string;
  saved: boolean;
  signedIn: boolean;
}) {
  return signedIn ? (
    <form action={toggleRecord}>
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="target" value={target} />
      <Submit className={`button secondary ${saved ? 'selected' : ''}`}>
        <Bookmark size={16} />
        {kind === 'progress' ? (saved ? 'Completed' : 'Mark complete') : saved ? 'Saved' : 'Save'}
      </Submit>
    </form>
  ) : (
    <Link href="/login" className="button secondary">
      <Bookmark size={16} />
      {kind === 'progress' ? 'Sign in to track' : 'Sign in to save'}
    </Link>
  );
}
export function Vote({
  post,
  signedIn,
  myVote = 0,
}: {
  post: Post;
  signedIn: boolean;
  myVote?: number;
}) {
  return (
    <div className="vote">
      {[1, -1].map((value) =>
        signedIn ? (
          <form action={vote} key={value}>
            <input type="hidden" name="post_id" value={post.id} />
            <input type="hidden" name="value" value={value} />
            <button
              className={`icon ${myVote === value ? 'selected' : ''}`}
              aria-label={value === 1 ? 'Upvote' : 'Downvote'}
              aria-pressed={myVote === value}
            >
              {value === 1 ? <ArrowUp size={19} /> : <ArrowDown size={19} />}
            </button>
            {value === 1 && <strong>{post.score}</strong>}
          </form>
        ) : (
          <div key={value}>
            <Link
              href="/login"
              className="icon"
              aria-label={value === 1 ? 'Sign in to upvote' : 'Sign in to downvote'}
            >
              {value === 1 ? <ArrowUp size={19} /> : <ArrowDown size={19} />}
            </Link>
            {value === 1 && <strong>{post.score}</strong>}
          </div>
        ),
      )}
    </div>
  );
}
export function ForumPostCard({
  post,
  signedIn,
  myVote = 0,
}: {
  post: Post;
  signedIn: boolean;
  myVote?: number;
}) {
  return (
    <article className="post-card">
      <Vote post={post} signedIn={signedIn} myVote={myVote} />
      <div>
        <div className="meta">
          <span className="avatar">{post.display_name.slice(0, 1)}</span>
          <span>{post.display_name}</span>
          <time dateTime={post.created_at}>
            {new Date(post.created_at).toLocaleDateString('en-GB')}
          </time>
        </div>
        <h3>
          <Link href={`/forum/${post.id}`}>{post.title}</Link>
        </h3>
        <p className="clamp">{post.body}</p>
        <div className="post-bottom">
          <Link href={`/forum?category=${post.category_id}`} className="tag">
            {post.category_id.replaceAll('-', ' ')}
          </Link>
          {post.tags.map((tag) => (
            <span className="tag subtle" key={tag}>
              {tag}
            </span>
          ))}
          <Link className="comment-count" href={`/forum/${post.id}`}>
            <MessageSquare size={15} />
            {`${post.comment_count} ${post.comment_count === 1 ? 'comment' : 'comments'}`}
          </Link>
        </div>
      </div>
    </article>
  );
}
export function CoachCard({ coach }: { coach: Coach }) {
  return (
    <article className="coach-card">
      {coach.photo_url ? (
        <img
          src={coach.photo_url}
          alt={coach.name}
          width="360"
          height="240"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="coach-avatar">{coach.name.slice(0, 1)}</div>
      )}
      <div className="card-body">
        <div className="meta">
          <MapPin size={13} />
          {coach.location}
        </div>
        <h3>
          <Link href={`/coaches/${coach.id}`}>{coach.name}</Link>
        </h3>
        <p>{coach.bio}</p>
        <p className="meta">
          {coach.years_experience} years teaching · {coach.student_levels.join(', ')}
        </p>
        <div className="tags">
          {coach.specialties.map((s) => (
            <span className="tag" key={s}>
              {s}
            </span>
          ))}
        </div>
        <Link href={`/coaches/${coach.id}`} className="arrow-link">
          View profile
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
export function SearchBar({
  placeholder,
  value = '',
  name = 'q',
}: {
  placeholder: string;
  value?: string;
  name?: string;
}) {
  return (
    <label className="search-label">
      <span className="sr-only">{placeholder}</span>
      <input
        name={name}
        defaultValue={value}
        placeholder={placeholder}
        type="search"
        maxLength={120}
      />
    </label>
  );
}
