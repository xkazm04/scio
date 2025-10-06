# 🚀 Drizzle ORM with Supabase - Complete Setup Guide

This guide shows you how to use **Drizzle ORM** with **Supabase PostgreSQL** for better type safety and developer experience, while keeping Supabase for authentication.

---

## ✨ Why Drizzle + Supabase?

| Feature | Supabase Client | Drizzle ORM |
|---------|----------------|-------------|
| **Type Safety** | Basic runtime types | Full TypeScript inference |
| **Query Builder** | Limited methods | Full SQL power + relations |
| **Relations** | Manual joins | Automatic eager/lazy loading |
| **Migrations** | Manual SQL files | Auto-generated from schema |
| **Raw SQL** | Separate RPC calls | Seamlessly integrated |
| **IntelliSense** | Limited | Full autocomplete |

---

## 📋 Prerequisites

- ✅ Nuxt 3 project
- ✅ Supabase account & project
- ✅ Database tables created (via migrations or Supabase Studio)

---

## 🔧 Step 1: Get Your Database Credentials

### Option A: Connection Pooling (Recommended for Serverless)

1. Open your Supabase dashboard
2. Go to **Project Settings** (gear icon in left sidebar)
3. Click **Database** in the left menu
4. Scroll down to **Connection Pooling** section
5. Copy the **Connection string** in **Transaction mode**
6. Click "Use connection pooling" toggle ON

**Format**: 
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

### Option B: Direct Connection

1. Same steps, but scroll to **Connection string** section
2. Select **URI** tab
3. Copy the connection string

**Format**:
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.com:5432/postgres
```

### Finding Your Database Password

⚠️ **Important**: The password shown is **not** your Supabase account password!

**If you don't have your database password**:
1. Go to **Project Settings → Database**
2. Scroll to **Database password** section
3. Click **Reset database password**
4. Copy and save it immediately (you won't see it again!)

---

## 🔑 Step 2: Configure Environment Variables

Add to your `.env` file:

```bash
# Option A: Use full connection string (easiest)
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[YOUR-DB-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# Option B: Or provide components separately
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_DB_PASSWORD=[YOUR-DB-PASSWORD]

# Keep these for Supabase Auth (required)
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

**Tips**:
- Replace `[PROJECT-REF]` with your actual project reference (e.g., `xyzabc123`)
- Replace `[YOUR-DB-PASSWORD]` with your database password
- Use **Connection Pooling** for better performance in serverless environments
- Keep your `.env` file in `.gitignore`!

---

## 📦 Step 3: Install Dependencies

Your `package.json` should already have:

```json
{
  "dependencies": {
    "drizzle-orm": "^0.44.5",
    "postgres": "^3.4.7"
  },
  "devDependencies": {
    "drizzle-kit": "^0.31.4"
  }
}
```

If not, install them:

```bash
npm install drizzle-orm postgres
npm install -D drizzle-kit
```

---

## 📁 Step 4: Project Structure (Already Set Up!)

Your database files are now ready:

```
app/lib/database/
├── drizzle.ts              # ✅ Drizzle connection + helpers
├── schema.ts               # ✅ Table definitions
├── types.ts                # ✅ TypeScript types
├── index.ts                # ✅ Main export
└── connection.legacy.ts    # 📦 Old approach (backup)
```

---

## 💻 Step 5: Usage Examples

### Basic Queries

```typescript
import { db } from '~/lib/database'

// Create a user
const { data: user, error } = await db.users.create({
  id: userId,
  email: 'user@example.com',
  fullName: 'John Doe',
  role: 'teacher'
})

// Find user by ID
const { data: user } = await db.users.findById(userId)

// Find user by email
const { data: user } = await db.users.findByEmail('user@example.com')

// Update user
const { data: updated } = await db.users.update(userId, {
  fullName: 'Jane Doe'
})
```

### Group Operations

```typescript
// Get all groups (with teacher relation)
const { data: groups } = await db.groups.findAll()
// Returns: Array<{ id, name, teacher: { id, email, fullName } }>

// Get groups by teacher
const { data: myGroups } = await db.groups.findByTeacher(teacherId)

// Get group by ID with relations
const { data: group } = await db.groups.findById(groupId)

// Create a group
const { data: newGroup } = await db.groups.create({
  name: 'Math Class 2024',
  description: 'Advanced mathematics',
  teacherId: userId,
  qrCodeToken: generateToken()
})
```

### Goals & Progress

```typescript
// Get all goals for a group
const { data: goals } = await db.goals.findByGroup(groupId)

// Create a goal
const { data: goal } = await db.goals.create({
  groupId,
  title: 'Complete Chapter 1',
  description: 'Finish all exercises',
  goalType: 'boolean',
  targetValue: 1,
  orderIndex: 1
})

// Track progress
const { data: progress } = await db.goalProgress.create({
  participantId,
  goalId,
  currentValue: 5,
  isCompleted: false
})

// Update progress
const { data: updated } = await db.goalProgress.update(
  participantId,
  goalId,
  { currentValue: 10, isCompleted: true }
)
```

### Participants

```typescript
// Add participant to group
const { data: participant } = await db.participants.create({
  groupId,
  deviceId: 'device_abc123',
  nickname: 'Student John'
})

// Find participant
const { data: participant } = await db.participants.findByGroupAndDevice(
  groupId,
  deviceId
)

// Get all participants in a group
const { data: participants } = await db.participants.findByGroup(groupId)
```

### Advanced Queries with Raw Drizzle

```typescript
import { drizzleDb, eq, and, desc, count } from '~/lib/database'

// Complex query with multiple joins
const groupsWithStats = await drizzleDb.query.groups.findMany({
  where: eq(groups.teacherId, teacherId),
  with: {
    teacher: true,
    goals: {
      with: {
        progress: true
      }
    },
    participants: {
      where: eq(groupParticipants.isActive, true),
      with: {
        progress: true
      }
    }
  }
})

// Custom aggregation query
import { sql } from 'drizzle-orm'

const stats = await drizzleDb
  .select({
    groupId: goalProgress.groupId,
    totalParticipants: sql<number>`count(distinct ${goalProgress.participantId})`,
    averageProgress: sql<number>`avg(${goalProgress.currentValue})`,
    completedCount: sql<number>`count(case when ${goalProgress.isCompleted} then 1 end)`
  })
  .from(goalProgress)
  .where(eq(goalProgress.groupId, groupId))
  .groupBy(goalProgress.groupId)
```

---

## 🛠️ Step 6: Database Migrations

### Generate Migration from Schema

```bash
npm run db:generate
```

This creates migration files in `drizzle/migrations/`

### Push Schema to Database

```bash
npm run db:push
```

This applies your schema directly to the database (good for development)

### Run Migrations (Production)

```bash
npm run db:migrate
```

This runs all pending migrations

---

## 🎨 Step 7: Drizzle Studio

Explore your database visually:

```bash
npm run db:studio
```

Opens at `https://local.drizzle.studio`

Features:
- View all tables and data
- Edit records
- Run custom queries
- See relationships

---

## 🔄 Migration from Old Code

### Before (Supabase Client)

```typescript
// ❌ Old approach
import { supabase } from '~/lib/database/connection'

const { data: user } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single()
```

### After (Drizzle ORM)

```typescript
// ✅ New approach
import { db } from '~/lib/database'

const { data: user } = await db.users.findById(userId)
```

**Benefits**:
- ✅ Full TypeScript inference
- ✅ Autocomplete for all fields
- ✅ Compile-time error checking
- ✅ Cleaner, more readable code

---

## 🎯 Architecture Overview

```
┌─────────────────────────────────────┐
│     Nuxt 3 Application              │
├─────────────────────────────────────┤
│                                     │
│  Components & Pages                 │
│         ↓                           │
│  Composables (useAuth, etc.)        │
│         ↓                           │
│  Server API Routes                  │
│         ↓                           │
├─────────────────────────────────────┤
│  Database Layer                     │
│                                     │
│  ┌──────────────┐  ┌─────────────┐│
│  │ Drizzle ORM  │  │  Supabase   ││
│  │ (Data Layer) │  │   (Auth)    ││
│  └──────────────┘  └─────────────┘│
│         ↓                  ↓       │
├─────────────────────────────────────┤
│     Supabase PostgreSQL             │
└─────────────────────────────────────┘
```

**Key Points**:
- 🔐 **Auth**: Still using Supabase Auth (excellent!)
- 💾 **Data**: Using Drizzle ORM for queries
- 🗄️ **Storage**: Same PostgreSQL database

---

## 🧪 Testing Your Setup

Create a test API route:

```typescript
// server/api/test-db.get.ts
import { db } from '~/lib/database'

export default defineEventHandler(async (event) => {
  try {
    // Test user query
    const { data: users } = await db.users.findByEmail('test@example.com')
    
    // Test groups query
    const { data: groups } = await db.groups.findAll()
    
    return {
      success: true,
      message: 'Drizzle ORM connected successfully!',
      data: {
        userCount: users ? 1 : 0,
        groupCount: groups?.length || 0
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
})
```

Visit: `http://localhost:3000/api/test-db`

---

## 🐛 Troubleshooting

### Error: "Database not available"

**Cause**: DATABASE_URL not set or connection failed

**Fix**:
1. Check your `.env` file exists
2. Verify `DATABASE_URL` is set correctly
3. Restart your dev server: `npm run dev`
4. Check database password is correct

### Error: "relation does not exist"

**Cause**: Tables haven't been created yet

**Fix**:
```bash
# Option 1: Push schema
npm run db:push

# Option 2: Run migrations
npm run db:generate
npm run db:migrate
```

### Error: "Cannot find module '~/lib/database'"

**Cause**: Import path issue

**Fix**: Use the full path:
```typescript
import { db } from '~/lib/database'
// or
import { db } from '@/lib/database'
```

### Connection Timeout

**Cause**: Firewall or wrong connection URL

**Fix**:
1. Use **Connection Pooling** URL (port 6543)
2. Check your IP is allowed in Supabase settings
3. Verify your region matches (e.g., `aws-0-us-east-1`)

---

## 📚 Best Practices

### 1. Use Transactions for Complex Operations

```typescript
import { drizzleDb } from '~/lib/database'

await drizzleDb.transaction(async (tx) => {
  // Create group
  const [group] = await tx.insert(groups).values({...}).returning()
  
  // Create goals for the group
  await tx.insert(goals).values([
    { groupId: group.id, title: 'Goal 1' },
    { groupId: group.id, title: 'Goal 2' }
  ])
  
  // All or nothing - automatic rollback on error
})
```

### 2. Add Indexes for Performance

Already done in `schema.ts`! But if you need more:

```typescript
index('idx_custom_field').on(table.customField)
```

### 3. Use Relations for Cleaner Queries

```typescript
// Instead of manual joins, use relations
const groupWithEverything = await drizzleDb.query.groups.findFirst({
  where: eq(groups.id, groupId),
  with: {
    teacher: true,  // Auto-joined!
    goals: {
      with: {
        progress: true  // Nested relations!
      }
    },
    participants: {
      with: {
        progress: true
      }
    }
  }
})
```

### 4. Type Safety Everywhere

```typescript
import type { User, Group, Goal } from '~/lib/database'

// Full IntelliSense and type checking
const user: User = await db.users.findById(id)
const groups: Group[] = await db.groups.findByTeacher(teacherId)
```

---

## 🚀 Performance Tips

1. **Use Connection Pooling**: URL with port `6543`
2. **Limit max connections**: Set `max: 1` for serverless (already done)
3. **Add indexes**: Critical for large datasets
4. **Use select specific fields**: Don't select `*` if you don't need all fields
5. **Batch operations**: Use `.values([])` for multiple inserts

---

## 📖 Additional Resources

- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Drizzle with Supabase](https://orm.drizzle.team/docs/get-started-postgresql#supabase)
- [Supabase Database Docs](https://supabase.com/docs/guides/database)
- [PostgreSQL Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)

---

## ✅ Summary

You now have:

- ✅ **Drizzle ORM** configured with Supabase PostgreSQL
- ✅ **Full TypeScript** type safety and inference
- ✅ **Helper functions** for common operations
- ✅ **Backward compatibility** with existing code
- ✅ **Migration tools** for schema management
- ✅ **Supabase Auth** still working perfectly

Your database layer is now **production-ready** and **developer-friendly**! 🎉

---

**Need Help?** Check the troubleshooting section or review the example queries above.