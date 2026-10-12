import Link from 'next/link';
import { notFound } from 'next/navigation';
import { database, currentUser } from '../../../lib/supabase';
import { catalog, type Post, type Comment } from '../../../lib/queries';
import { Vote, ArticleCard } from '../../../components/ui';
import { ActionForm } from '../../../components/forms';
import { commentAction, reportAction } from '../../actions';
export default async function Discussion({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [db, user, content] = await Promise.all([database(), currentUser(), catalog()]);
  if (!db) notFound();
  const result = await db
    .from('post_feed')
    .select('*')
    .eq('id', id)
    .eq('hidden', false)
    .maybeSingle();
  if (result.error) throw new Error('Discussion unavailable.');
  if (!result.data) notFound();
  const post = result.data as Post;
  const replyResult = await db
    .from('comments')
    .select('*,profiles(display_name)')
    .eq('post_id', id)
    .eq('hidden', false)
    .order('created_at');
  if (replyResult.error) throw new Error('Comments unavailable.');
  const comments = replyResult.data as Comment[];
  const myVote = user
    ? await db.from('votes').select('value').eq('user_id', user.id).eq('post_id', id).maybeSingle()
    : null;
  if (myVote?.error) throw new Error('Your voting state is temporarily unavailable.');
  return (
    <div className="container">
      <div className="breadcrumb">
        <Link href="/forum">Forum</Link> / {post.category_id.replaceAll('-', ' ')}
      </div>
      <div className="article-layout">
        <article>
          <header className="discussion-heading">
            <Vote post={post} signedIn={Boolean(user)} myVote={myVote?.data?.value} />
            <div>
              <div className="meta">
                {post.display_name} · {new Date(post.created_at).toLocaleDateString('en-GB')}
              </div>
              <h1>{post.title}</h1>
            </div>
          </header>
          <div className="plain-content">{post.body}</div>
          {post.media_url && (
            <a href={post.media_url} target="_blank" rel="noreferrer">
              View attached external media
            </a>
          )}
          <div className="tags">
            {post.tags.map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
          </div>
          <h2>{`${comments.length} ${comments.length === 1 ? 'comment' : 'comments'}`}</h2>
          {comments.map((c) => (
            <article key={c.id} className={c.parent_id ? 'comment reply' : 'comment'}>
              <div className="meta">
                {c.profiles?.display_name || 'Golfer'} ·{' '}
                {new Date(c.created_at).toLocaleDateString('en-GB')}
                {c.parent_id && <span>Reply</span>}
              </div>
              <p className="plain-content">{c.body}</p>
              {user && (
                <details>
                  <summary>Reply</summary>
                  <CommentForm postId={id} parentId={c.id} />
                </details>
              )}
              {user && (
                <details className="report">
                  <summary>Report this comment</summary>
                  <ActionForm action={reportAction} label="Send report">
                    <input type="hidden" name="target" value={c.id} />
                    <input type="hidden" name="kind" value="comment" />
                    <label>
                      Reason
                      <textarea name="reason" required minLength={10} maxLength={1000} />
                    </label>
                  </ActionForm>
                </details>
              )}
            </article>
          ))}
          {user ? (
            <CommentForm postId={id} />
          ) : (
            <p>
              <Link href={`/login?next=/forum/${id}`}>Sign in to comment</Link>
            </p>
          )}
          {user && (
            <details className="report">
              <summary>Report this discussion</summary>
              <ActionForm action={reportAction} label="Send report">
                <input type="hidden" name="target" value={id} />
                <input type="hidden" name="kind" value="post" />
                <label>
                  Reason
                  <textarea name="reason" required minLength={10} maxLength={1000} />
                </label>
              </ActionForm>
            </details>
          )}
        </article>
        <aside className="article-aside">
          <h3>Explore the fundamentals</h3>
          <p>Community replies are personal experience, not verified coaching.</p>
          {content.lessons
            .filter((l) => l.forum === post.category_id)
            .slice(0, 2)
            .map((l) => (
              <ArticleCard key={l.id} lesson={l} sources={content.sources} />
            ))}
          <Link href="/coaches">Explore authorized coaches</Link>
        </aside>
      </div>
    </div>
  );
}
function CommentForm({ postId, parentId }: { postId: string; parentId?: string }) {
  return (
    <ActionForm action={commentAction} label="Post comment">
      <input type="hidden" name="post_id" value={postId} />
      <input type="hidden" name="parent_id" value={parentId || ''} />
      <label>
        {parentId ? 'Your reply' : 'Add your perspective'}
        <textarea name="body" required minLength={2} maxLength={4000} rows={4} />
      </label>
    </ActionForm>
  );
}
