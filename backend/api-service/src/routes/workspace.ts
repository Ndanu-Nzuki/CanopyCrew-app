import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import type { HonoEnv } from '../env'
import { authMiddleware } from '../middleware/auth'
import { createDb, schema } from '../db/client'

export const workspaceRoutes = new Hono<HonoEnv>()

const empty = { site_id: null, plant_ids: [], completed_task_ids: [], plan_started_at: null }

function strings(v: unknown): string[] {
  if (!Array.isArray(v)) return []
  return v.filter((x): x is string => typeof x === 'string' && x.length < 200).slice(0, 2000)
}

workspaceRoutes.get('/workspace', authMiddleware, async (c) => {
  const db = createDb(c.env.DATABASE_URL)
  const rows = await db.select().from(schema.workspaces).where(eq(schema.workspaces.user_id, c.get('userId')))
  const row = rows[0]
  if (!row) return c.json(empty)
  return c.json({
    site_id: row.site_id,
    plant_ids: row.plant_ids,
    completed_task_ids: row.completed_task_ids,
    plan_started_at: row.plan_started_at,
  })
})

workspaceRoutes.put('/workspace', authMiddleware, async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>
  const values = {
    user_id: c.get('userId'),
    site_id: typeof body.site_id === 'string' ? body.site_id : null,
    plant_ids: strings(body.plant_ids),
    completed_task_ids: strings(body.completed_task_ids),
    plan_started_at: typeof body.plan_started_at === 'string' ? body.plan_started_at : null,
    updated_at: new Date(),
  }
  const db = createDb(c.env.DATABASE_URL)
  await db
    .insert(schema.workspaces)
    .values(values)
    .onConflictDoUpdate({ target: schema.workspaces.user_id, set: values })
  return c.json({ ok: true })
})

workspaceRoutes.get('/community', async (c) => {
  const db = createDb(c.env.DATABASE_URL)
  const rows = await db.select({ plant_ids: schema.workspaces.plant_ids }).from(schema.workspaces)
  const planted = rows.reduce((n, r) => n + (r.plant_ids?.length ?? 0), 0)
  return c.json({ members: rows.length, planted })
})

workspaceRoutes.post('/contact', async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 200) : ''
  const email = typeof body.email === 'string' ? body.email.trim().slice(0, 200) : ''
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 5000) : ''
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || !message) {
    return c.json({ error: 'invalid', message: 'Add your name, a valid email and a message.' }, 400)
  }
  const db = createDb(c.env.DATABASE_URL)
  await db.insert(schema.contactMessages).values({ name, email, message })
  return c.json({ ok: true })
})
