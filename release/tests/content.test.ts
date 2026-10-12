import { test } from 'node:test';
import assert from 'node:assert/strict';
import { categories, forumCategories, lessons, sources } from '../content/catalog';
import {
  categorySchema,
  forumCategorySchema,
  lessonSchema,
  sourceSchema,
  coachSchema,
} from '../lib/content-validation';
import { weekStart } from '../lib/practice';

test('Every published guide has valid structured content and traceable references', () => {
  const categoryIds = new Set(categories.map((c) => c.id));
  const sourceIds = new Set(sources.map((s) => s.id));
  const lessonIds = new Set(lessons.map((l) => l.id));
  const forumIds = new Set(forumCategories.map((c) => c.id));
  assert.equal(lessonIds.size, lessons.length, 'guide identifiers are unique');
  assert.equal(sourceIds.size, sources.length, 'source identifiers are unique');
  assert.equal(categoryIds.size, 14);
  categories.forEach((c) => categorySchema.parse(c));
  forumCategories.forEach((c) => forumCategorySchema.parse(c));
  sources.forEach((s) => sourceSchema.parse(s));
  for (const lesson of lessons) {
    lessonSchema.parse(lesson);
    assert.ok(categoryIds.has(lesson.category_id), lesson.id);
    assert.ok(forumIds.has(lesson.forum), lesson.id);
    lesson.sources.forEach((ref) => assert.ok(sourceIds.has(ref.id), `${lesson.id}: ${ref.id}`));
    lesson.related.forEach((id) => assert.ok(lessonIds.has(id), `${lesson.id}: ${id}`));
  }
  categories.forEach((c) =>
    assert.ok(
      lessons.some((l) => l.category_id === c.id && l.status === 'published'),
      c.id,
    ),
  );
});

test('Weekly checklist dates use Monday UTC across week and year boundaries', () => {
  assert.equal(weekStart(new Date('2026-10-12T01:00:00Z')), '2026-10-12');
  assert.equal(weekStart(new Date('2026-10-18T23:59:59Z')), '2026-10-12');
  assert.equal(weekStart(new Date('2027-01-01T12:00:00Z')), '2026-12-28');
});

test('CMS records reject duplicate citations and accept absent source metadata', () => {
  const guide = lessons[0];
  assert.equal(
    lessonSchema.safeParse({ ...guide, sources: [guide.sources[0], guide.sources[0]] }).success,
    false,
  );
  assert.equal(
    sourceSchema.safeParse({ ...sources[0], author: null, published_date: null }).success,
    true,
  );
});

test('Coach publication cannot bypass permission evidence', () => {
  const coach = {
    name: 'Test coach',
    location: 'Test location',
    specialties: ['Putting'],
    bio: 'Test biography',
    philosophy: 'Test philosophy',
    years_experience: 5,
    student_levels: ['Beginner'],
    photo_url: null,
    contact_url: 'https://example.com/contact',
    availability: 'By request',
    lesson_topics: [],
    recommended_lessons: [],
    authorized: false,
    authorization_reference: null,
    status: 'published',
  };
  assert.equal(coachSchema.safeParse(coach).success, false);
  assert.equal(
    coachSchema.safeParse({
      ...coach,
      authorized: true,
      authorization_reference: 'Owner permission record',
    }).success,
    true,
  );
});
