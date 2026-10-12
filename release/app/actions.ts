'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { ZodError } from 'zod';
import { authenticated, database } from '../lib/supabase';
import { weekStart } from '../lib/practice';
import { siteOrigin } from '../lib/site-origin';
import {
  commentInput,
  email,
  formText,
  id,
  level,
  name,
  password,
  postInput,
  practiceInput,
  safeNext,
  slug,
} from '../lib/validation';

export type ActionState = { error?: string; message?: string };
function failure(error: unknown): ActionState {
  if (error instanceof ZodError)
    return {
      error: error.issues
        .map((issue) => `${issue.path.join('.') || 'Input'}: ${issue.message}`)
        .join(' '),
    };
  return {
    error: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
  };
}
function check(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}
function siteUrl() {
  return siteOrigin();
}
export async function authAction(_: ActionState, form: FormData): Promise<ActionState> {
  const mode = formText(form, 'mode');
  try {
    if (!['signup', 'login', 'recover'].includes(mode)) throw new Error('Invalid account action.');
    const db = await database();
    if (!db) throw new Error('Accounts are not connected in this preview yet.');
    const address = email.parse(formText(form, 'email'));
    if (mode === 'recover') {
      const { error } = await db.auth.resetPasswordForEmail(address, {
        redirectTo: `${siteUrl()}/auth/callback`,
      });
      check(error);
      (await cookies()).set('golfer-hub-auth-intent', 'recovery', {
        httpOnly: true,
        sameSite: 'lax',
        secure: siteUrl().startsWith('https:'),
        path: '/auth/callback',
        maxAge: 3600,
      });
      return {
        message:
          'If an account exists for this email, a recovery link will arrive shortly. Open it in this browser.',
      };
    }
    (await cookies()).set('golfer-hub-auth-intent', '', { path: '/auth/callback', maxAge: 0 });
    const secret =
      mode === 'signup' ? password.parse(formText(form, 'password')) : formText(form, 'password');
    if (mode === 'signup') {
      const display_name = name.parse(formText(form, 'display_name'));
      if (formText(form, 'agreement') !== 'yes')
        throw new Error('Please agree to the community guidelines and privacy notice.');
      const { data, error } = await db.auth.signUp({
        email: address,
        password: secret,
        options: { data: { display_name }, emailRedirectTo: `${siteUrl()}/auth/callback` },
      });
      check(error);
      if (!data.session)
        return { message: 'Check your email to confirm your account before signing in.' };
    } else {
      const { error } = await db.auth.signInWithPassword({ email: address, password: secret });
      check(error);
    }
  } catch (error) {
    return failure(error);
  }
  redirect(safeNext(formText(form, 'next')));
}
export async function logout() {
  const db = await database();
  if (db) {
    const { error } = await db.auth.signOut();
    check(error);
  }
  (await cookies()).set('golfer-hub-auth-intent', '', { path: '/auth/callback', maxAge: 0 });
  redirect('/');
}
export async function createPost(_: ActionState, form: FormData): Promise<ActionState> {
  let postId: string;
  try {
    const { db, user } = await authenticated();
    const input = postInput.parse({
      title: formText(form, 'title'),
      body: formText(form, 'body'),
      category_id: formText(form, 'category_id'),
      tags: formText(form, 'tags')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      media_url: formText(form, 'media_url') || null,
    });
    const { data, error } = await db
      .from('posts')
      .insert({ ...input, user_id: user.id })
      .select('id')
      .single();
    check(error);
    postId = data!.id;
  } catch (error) {
    return failure(error);
  }
  revalidatePath('/forum');
  redirect(`/forum/${postId}`);
}
export async function commentAction(_: ActionState, form: FormData): Promise<ActionState> {
  try {
    const { db, user } = await authenticated();
    const input = commentInput.parse({
      post_id: formText(form, 'post_id'),
      parent_id: formText(form, 'parent_id') || null,
      body: formText(form, 'body'),
    });
    const { error } = await db.from('comments').insert({ ...input, user_id: user.id });
    check(error);
    revalidatePath(`/forum/${input.post_id}`);
    revalidatePath('/forum');
    return { message: 'Comment posted.' };
  } catch (error) {
    return failure(error);
  }
}
export async function toggleRecord(form: FormData) {
  const { db, user } = await authenticated();
  const kind = formText(form, 'kind');
  const mappings = {
    lesson: ['saved_lessons', 'lesson_id'],
    coach: ['saved_coaches', 'coach_id'],
    progress: ['lesson_progress', 'lesson_id'],
  } as const;
  if (!(kind in mappings)) throw new Error('Invalid record type.');
  const [table, column] = mappings[kind as keyof typeof mappings];
  const target =
    kind === 'coach' ? id.parse(formText(form, 'target')) : slug.parse(formText(form, 'target'));
  const current = await db
    .from(table)
    .select(column)
    .eq('user_id', user.id)
    .eq(column, target)
    .maybeSingle();
  check(current.error);
  const result = current.data
    ? await db.from(table).delete().eq('user_id', user.id).eq(column, target)
    : await db.from(table).insert({ user_id: user.id, [column]: target });
  check(result.error);
  revalidatePath('/dashboard');
  revalidatePath(`/learn/${target}`);
  revalidatePath('/coaches');
}
export async function vote(form: FormData) {
  const { db, user } = await authenticated();
  const post_id = id.parse(formText(form, 'post_id'));
  const value = Number(formText(form, 'value'));
  if (value !== 1 && value !== -1) throw new Error('Invalid vote.');
  const current = await db
    .from('votes')
    .select('value')
    .eq('user_id', user.id)
    .eq('post_id', post_id)
    .maybeSingle();
  check(current.error);
  const result =
    current.data?.value === value
      ? await db.from('votes').delete().eq('user_id', user.id).eq('post_id', post_id)
      : await db.from('votes').upsert({ user_id: user.id, post_id, value });
  check(result.error);
  revalidatePath('/forum');
  revalidatePath(`/forum/${post_id}`);
}
export async function addPractice(_: ActionState, form: FormData): Promise<ActionState> {
  try {
    const { db, user } = await authenticated();
    const input = practiceInput.parse({
      title: formText(form, 'title'),
      kind: formText(form, 'kind'),
    });
    const { error } = await db.from('practice_items').insert({
      ...input,
      user_id: user.id,
      week: input.kind === 'checklist' ? weekStart() : null,
    });
    check(error);
    revalidatePath('/dashboard');
    return { message: 'Practice item added.' };
  } catch (error) {
    return failure(error);
  }
}
export async function editPractice(_: ActionState, form: FormData): Promise<ActionState> {
  try {
    const { db, user } = await authenticated();
    const title = practiceInput.shape.title.parse(formText(form, 'title'));
    const { data, error } = await db
      .from('practice_items')
      .update({ title })
      .eq('id', id.parse(formText(form, 'id')))
      .eq('user_id', user.id)
      .select('id')
      .single();
    check(error);
    if (!data) throw new Error('Practice item not found.');
    revalidatePath('/dashboard');
    return { message: 'Practice item updated.' };
  } catch (error) {
    return failure(error);
  }
}
export async function archivePractice(form: FormData) {
  const { db, user } = await authenticated();
  const { error } = await db
    .from('practice_items')
    .update({ archived: formText(form, 'archived') === 'true' })
    .eq('id', id.parse(formText(form, 'id')))
    .eq('user_id', user.id);
  check(error);
  revalidatePath('/dashboard');
}
export async function togglePractice(form: FormData) {
  const { db, user } = await authenticated();
  const target = id.parse(formText(form, 'id'));
  const current = await db
    .from('practice_items')
    .select('completed')
    .eq('id', target)
    .eq('user_id', user.id)
    .single();
  check(current.error);
  const { error } = await db
    .from('practice_items')
    .update({ completed: !current.data!.completed })
    .eq('id', target)
    .eq('user_id', user.id);
  check(error);
  revalidatePath('/dashboard');
}
export async function profileAction(_: ActionState, form: FormData): Promise<ActionState> {
  try {
    const { db, user } = await authenticated();
    const { error } = await db
      .from('profiles')
      .update({
        display_name: name.parse(formText(form, 'display_name')),
        skill_level: level.parse(formText(form, 'skill_level')),
      })
      .eq('id', user.id);
    check(error);
    revalidatePath('/account');
    return { message: 'Profile updated.' };
  } catch (error) {
    return failure(error);
  }
}
export async function resetAction(_: ActionState, form: FormData): Promise<ActionState> {
  try {
    const { db } = await authenticated();
    const secret = password.parse(formText(form, 'password'));
    if (secret !== formText(form, 'confirm')) throw new Error('Passwords do not match.');
    const { error } = await db.auth.updateUser({ password: secret });
    check(error);
    return { message: 'Password updated. You can now return to your dashboard.' };
  } catch (error) {
    return failure(error);
  }
}
export async function enquiryAction(_: ActionState, form: FormData): Promise<ActionState> {
  try {
    const { db, user } = await authenticated();
    const message = formText(form, 'message').trim();
    if (message.length < 20 || message.length > 2000)
      throw new Error('Use between 20 and 2,000 characters.');
    const { error } = await db
      .from('enquiries')
      .insert({ user_id: user.id, coach_id: id.parse(formText(form, 'coach_id')), message });
    check(error);
    return {
      message:
        'Request received by Golfer Hub. It is not a confirmed booking; no email has been sent automatically.',
    };
  } catch (error) {
    return failure(error);
  }
}
export async function reportAction(_: ActionState, form: FormData): Promise<ActionState> {
  try {
    const { db, user } = await authenticated();
    const reason = formText(form, 'reason').trim();
    if (reason.length < 10 || reason.length > 1000)
      throw new Error('Describe the issue in 10 to 1,000 characters.');
    const kind = formText(form, 'kind');
    if (kind !== 'post' && kind !== 'comment') throw new Error('Invalid report.');
    const { error } = await db
      .from('reports')
      .insert({ user_id: user.id, [kind + '_id']: id.parse(formText(form, 'target')), reason });
    check(error);
    return { message: 'Report saved for moderator review.' };
  } catch (error) {
    return failure(error);
  }
}
