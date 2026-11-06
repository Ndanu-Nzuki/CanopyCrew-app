import { pgSchema, text, integer, timestamp, jsonb, index } from 'drizzle-orm/pg-core';

// api-service tables live in their own Postgres schema so the auth-service
// (which shares the tenant Neon DB) can migrate without touching api
// tables / sequences, and vice versa. The Worker connects
// with the default search_path; queries against these tables use the
// schema-qualified names emitted by drizzle.
export const apiSchema = pgSchema('api');

export const newlyMeta = apiSchema.table(
  '_newly_meta',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    project_id: text('project_id').notNull(),
    env: text('env').notNull(),
    template_version: text('template_version').notNull(),
  },
  (table) => ({
    projectIdIdx: index('_newly_meta_project_id_idx').on(table.project_id),
  }),
);

export type NewlyMetaRow = typeof newlyMeta.$inferSelect;
export type NewlyMetaInsert = typeof newlyMeta.$inferInsert;

export const kvEntries = apiSchema.table(
  'kv_entries',
  {
    key: text('key').primaryKey(),
    value: jsonb('value'),
    expires_at: timestamp('expires_at', { withTimezone: true }),
  },
  (table) => ({
    expiresAtIdx: index('kv_entries_expires_at_idx').on(table.expires_at),
  }),
);

export type KvEntriesRow = typeof kvEntries.$inferSelect;
export type KvEntriesInsert = typeof kvEntries.$inferInsert;

export const workspaces = apiSchema.table('workspaces', {
  user_id: text('user_id').primaryKey(),
  site_id: text('site_id'),
  plant_ids: jsonb('plant_ids').$type<string[]>().notNull().default([]),
  completed_task_ids: jsonb('completed_task_ids').$type<string[]>().notNull().default([]),
  plan_started_at: text('plan_started_at'),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const contactMessages = apiSchema.table('contact_messages', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
