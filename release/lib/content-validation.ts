import { z } from 'zod';
import { httpsUrl, level, slug } from './validation';
const text = z.string().trim().min(2).max(10000);
export const categorySchema = z.object({
  id: slug,
  name: text.max(100),
  position: z.number().int().min(0).max(10000).default(0),
});
export const forumCategorySchema = z.object({ id: slug, name: text.max(100) });
export const lessonSchema = z.object({
  id: slug,
  title: text.max(160),
  category_id: slug,
  level,
  summary: text.max(500),
  objective: text,
  introduction: text,
  principle: text,
  steps: z.array(text).min(2).max(20),
  mistakes: z.array(text).min(1).max(20),
  drill: z.object({ title: text, instructions: z.array(text).min(2).max(20), measure: text }),
  course: text,
  diagram: z.enum(['flight', 'target', 'practice', 'setup']),
  sources: z
    .array(z.object({ id: slug, supports: text }))
    .min(1)
    .max(10)
    .refine(
      (refs) => new Set(refs.map((ref) => ref.id)).size === refs.length,
      'Cited sources must have distinct identifiers.',
    ),
  related: z.array(slug).max(10),
  forum: slug,
  status: z.enum(['draft', 'review', 'published']),
  video: z
    .object({
      id: z.string().regex(/^[A-Za-z0-9_-]{11}$/),
      title: text,
      publisher: text,
      evidence: text,
    })
    .optional(),
});
export const sourceSchema = z.object({
  id: slug,
  title: text,
  publisher: text,
  url: httpsUrl,
  author: text.nullable().optional(),
  published_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional(),
  checked_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  evidence: text,
  status: z.enum(['verified', 'indexed', 'needs-review']),
});
export const coachSchema = z
  .object({
    id: z.uuid().optional(),
    name: text.max(100),
    location: text.max(150),
    specialties: z.array(text).min(1).max(10),
    bio: text,
    philosophy: text,
    years_experience: z.number().int().min(0).max(80),
    student_levels: z.array(level).min(1),
    photo_url: httpsUrl.nullable(),
    contact_url: httpsUrl.nullable(),
    availability: text,
    lesson_topics: z.array(text).max(20),
    recommended_lessons: z.array(slug).max(20),
    authorized: z.boolean(),
    authorization_reference: z.string().nullable(),
    status: z.enum(['draft', 'review', 'published']),
  })
  .refine(
    (c) =>
      c.status !== 'published' ||
      (c.authorized &&
        Boolean(c.authorization_reference && c.authorization_reference.length > 5) &&
        Boolean(c.contact_url)),
    'Published profiles need explicit permission evidence and a contact URL.',
  );
