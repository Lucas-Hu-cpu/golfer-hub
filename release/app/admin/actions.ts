'use server';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';
import { authenticated } from '../../lib/supabase';
import { formText, id } from '../../lib/validation';
import {
  lessonSchema,
  sourceSchema,
  coachSchema,
  categorySchema,
  forumCategorySchema,
} from '../../lib/content-validation';
import type { ActionState } from '../actions';
export async function administrator() {
  const context = await authenticated();
  const { data, error } = await context.db.rpc('is_admin');
  if (error || !data) throw new Error('Administrator access required.');
  return context;
}
export async function saveContent(_: ActionState, form: FormData): Promise<ActionState> {
  try {
    const { db } = await administrator();
    const kind = formText(form, 'kind');
    const parsed = JSON.parse(formText(form, 'record'));
    if (kind === 'lesson') {
      const lesson = lessonSchema.parse(parsed);
      const result = await db.rpc('save_lesson', { record: lesson });
      if (result.error) throw new Error(result.error.message);
    } else if (kind === 'source') {
      const result = await db.from('sources').upsert(sourceSchema.parse(parsed));
      if (result.error) throw new Error(result.error.message);
    } else if (kind === 'coach') {
      const result = await db.from('coaches').upsert(coachSchema.parse(parsed));
      if (result.error) throw new Error(result.error.message);
    } else if (kind === 'category') {
      const result = await db.from('categories').upsert(categorySchema.parse(parsed));
      if (result.error) throw new Error(result.error.message);
    } else if (kind === 'forum-category') {
      const result = await db.from('forum_categories').upsert(forumCategorySchema.parse(parsed));
      if (result.error) throw new Error(result.error.message);
    } else throw new Error('Unknown content type.');
    revalidatePath('/', 'layout');
    return { message: 'Content saved. Publication status is applied exactly as specified.' };
  } catch (error) {
    return {
      error:
        error instanceof ZodError
          ? error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(' ')
          : error instanceof Error
            ? error.message
            : 'Could not save content.',
    };
  }
}
export async function moderate(form: FormData) {
  const { db } = await administrator();
  const table = formText(form, 'table');
  const target = id.parse(formText(form, 'target'));
  if (table !== 'posts' && table !== 'comments') throw new Error('Invalid moderation target.');
  const { error } = await db
    .from(table)
    .update({ hidden: formText(form, 'hidden') === 'true' })
    .eq('id', target);
  if (error) throw new Error(error.message);
  revalidatePath('/', 'layout');
}
export async function reviewReport(form: FormData) {
  const { db } = await administrator();
  const target = id.parse(formText(form, 'target'));
  const state = formText(form, 'state');
  if (state !== 'reviewed' && state !== 'dismissed') throw new Error('Invalid report status.');
  const { error } = await db.from('reports').update({ state }).eq('id', target);
  if (error) throw new Error(error.message);
  revalidatePath('/admin');
}
