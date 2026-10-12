import Link from 'next/link';
import { currentUser } from '../../../lib/supabase';
import { taxonomy } from '../../../lib/queries';
import { Heading } from '../../../components/ui';
import { ActionForm } from '../../../components/forms';
import { createPost } from '../../actions';
export default async function NewPost() {
  const user = await currentUser();
  const { forumCategories } = await taxonomy();
  return (
    <div className="container narrow">
      <Heading
        eyebrow="Start a conversation"
        title="What is on your mind?"
        description="Share the context, what you have tried, and the question you want to explore."
      />
      {user ? (
        <ActionForm action={createPost} label="Publish discussion">
          <label>
            Title
            <input name="title" required minLength={8} maxLength={160} />
          </label>
          <label>
            Category
            <select name="category_id">
              {forumCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Your discussion
            <textarea name="body" required minLength={20} maxLength={10000} rows={8} />
          </label>
          <label>
            Tags, separated by commas
            <input name="tags" maxLength={154} />
          </label>
          <label>
            Optional video or image link
            <input name="media_url" type="url" placeholder="https://" />
          </label>
          <p className="small-note">
            Posts are public. Do not share private information, copyrighted media without
            permission, or another person’s contact details.
          </p>
        </ActionForm>
      ) : (
        <p>
          <Link href="/login?next=/forum/new">Sign in</Link> or{' '}
          <Link href="/signup">create an account</Link> to join the conversation.
        </p>
      )}
    </div>
  );
}
