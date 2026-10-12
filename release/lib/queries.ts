import 'server-only';
import { cache } from 'react';
import {
  lessons,
  sources,
  categories,
  forumCategories,
  type Lesson,
  type Source,
} from '../content/catalog';
import { database } from './supabase';

export const taxonomy = cache(async () => {
  const db = await database();
  if (!db) return { categories, forumCategories };
  const topics = await db
    .from('categories')
    .select('id,name,position')
    .order('position')
    .order('name');
  const discussions = await db.from('forum_categories').select('id,name').order('name');
  if (topics.error || discussions.error) throw new Error('Categories are temporarily unavailable.');
  return {
    categories: topics.data as typeof categories,
    forumCategories: discussions.data as typeof forumCategories,
  };
});

export type Post = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  category_id: string;
  tags: string[];
  media_url: string | null;
  created_at: string;
  display_name: string;
  score: number;
  comment_count: number;
};
export type Coach = {
  id: string;
  name: string;
  location: string;
  specialties: string[];
  bio: string;
  philosophy: string;
  years_experience: number;
  student_levels: string[];
  photo_url: string | null;
  contact_url: string;
  availability: string;
  lesson_topics: string[];
  recommended_lessons: string[];
};
export type Comment = {
  id: string;
  user_id: string;
  post_id: string;
  parent_id: string | null;
  body: string;
  created_at: string;
  profiles: { display_name: string } | null;
};
export async function voteStates(userId: string | undefined, postIds: string[]) {
  if (!userId || !postIds.length) return new Map<string, number>();
  const db = await database();
  if (!db) return new Map<string, number>();
  const result = await db
    .from('votes')
    .select('post_id,value')
    .eq('user_id', userId)
    .in('post_id', postIds);
  if (result.error) throw new Error('Your voting state is temporarily unavailable.');
  return new Map<string, number>(result.data.map((row) => [row.post_id, row.value]));
}
export const catalog = cache(async (): Promise<{ lessons: Lesson[]; sources: Source[] }> => {
  const db = await database();
  if (!db) return { lessons: lessons.filter((l) => l.status === 'published'), sources };
  const content = await db.from('lessons').select('data').eq('status', 'published');
  const citations = await db.from('sources').select('*');
  if (content.error || citations.error)
    throw new Error('The learning library is temporarily unavailable. Please try again.');
  return {
    lessons: content.data.map((row) => row.data as Lesson),
    sources: citations.data as Source[],
  };
});
export async function feed(
  options: { q?: string; category?: string; sort?: string; page?: number } = {},
) {
  const db = await database();
  if (!db) return { posts: [] as Post[], count: 0, available: false };
  let query = db.from('post_feed').select('*', { count: 'exact' }).eq('hidden', false);
  if (options.q) query = query.ilike('title', `%${options.q.replace(/[%_\\]/g, '')}%`);
  if (options.category) query = query.eq('category_id', options.category);
  if (options.sort === 'unanswered') query = query.eq('comment_count', 0);
  query = query
    .order(
      options.sort === 'top'
        ? 'score'
        : options.sort === 'hot' || !options.sort
          ? 'hot_score'
          : 'created_at',
      { ascending: false },
    )
    .order('id');
  const page = Math.max(1, Math.min(1000, Math.floor(options.page || 1)));
  const result = await query.range((page - 1) * 20, page * 20 - 1);
  if (result.error) throw new Error('Discussions are temporarily unavailable. Please try again.');
  return { posts: result.data as Post[], count: result.count || 0, available: true };
}
export async function coaches() {
  const db = await database();
  if (!db) return [] as Coach[];
  const { data, error } = await db
    .from('coaches')
    .select(
      'id,name,location,specialties,bio,philosophy,years_experience,student_levels,photo_url,contact_url,availability,lesson_topics,recommended_lessons',
    )
    .eq('status', 'published')
    .eq('authorized', true)
    .order('name');
  if (error) throw new Error('The coach directory is temporarily unavailable.');
  return data as Coach[];
}
