import { z } from 'zod';

export const id = z.uuid();
export const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(100);
export const level = z.enum(['Beginner', 'Intermediate', 'Advanced']);
export const name = z.string().trim().min(2).max(50);
export const email = z.email().max(254);
export const password = z.string().min(12).max(128);
export const httpsUrl = z.url().refine((value) => {
  const url = new URL(value);
  return url.protocol === 'https:' && !url.username && !url.password;
}, 'Use a public HTTPS link without credentials.');
export const postInput = z.object({
  title: z.string().trim().min(8).max(160),
  body: z.string().trim().min(20).max(10000),
  category_id: slug,
  tags: z.array(z.string().trim().min(2).max(30)).max(5),
  media_url: httpsUrl.nullable(),
});
export const commentInput = z.object({
  post_id: id,
  parent_id: id.nullable(),
  body: z.string().trim().min(2).max(4000),
});
export const practiceInput = z.object({
  title: z.string().trim().min(3).max(200),
  kind: z.enum(['goal', 'checklist']),
});
export function safeNext(value: unknown, fallback = '/dashboard') {
  return typeof value === 'string' &&
    value.startsWith('/') &&
    !value.startsWith('//') &&
    !value.includes('\\') &&
    !/[\r\n]/.test(value)
    ? value
    : fallback;
}
export function formText(form: FormData, key: string) {
  return String(form.get(key) ?? '');
}
