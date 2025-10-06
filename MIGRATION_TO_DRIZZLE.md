# 🔄 Migration Guide: Supabase Client → Drizzle ORM

This guide helps you migrate existing API routes and code from the old Supabase client approach to the new Drizzle ORM.

---

## 📝 Quick Reference

### Import Changes

```typescript
// ❌ OLD
import { db } from '~/lib/database/connection'
import { supabase } from '~/lib/database/connection'

// ✅ NEW
import { db } from '~/lib/database'
```

---

## 🔍 Common Patterns

### 1. Finding Records

#### Old Approach
```typescript
// ❌ OLD: Supabase client
const { data: user, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .maybeSingle()
```

#### New Approach
```typescript
// ✅ NEW: Drizzle ORM
const { data: user, error } = await db.users.findById(userId)
```

---

### 2. Creating Records

#### Old Approach
```typescript
// ❌ OLD
const { data: user, error } = await supabase
  .from('users')
  .insert({
    id: userId,
    email: 'user@example.com',
    full_name: 'John Doe',
    role: 'teacher'
  })
  .select()
  .single()
```

#### New Approach
```typescript
// ✅ NEW
const { data: user, error } = await db.users.create({
  id: userId,
  email: 'user@example.com',
  fullName: 'John Doe',  // camelCase!
  role: 'teacher'
})
```

**Note**: Drizzle uses camelCase for field names (e.g., `fullName` instead of `full_name`)

---

### 3. Updating Records

#### Old Approach
```typescript
// ❌ OLD
const { data: user, error } = await supabase
  .from('users')
  .update({ full_name: 'Jane Doe' })
  .eq('id', userId)
  .select()
  .single()
```

#### New Approach
```typescript
// ✅ NEW
const { data: user, error } = await db.users.update(userId, {
  fullName: 'Jane Doe'
})
```

---

### 4. Queries with Relations

#### Old Approach
```typescript
// ❌ OLD
const { data: groups, error } = await supabase
  .from('groups')
  .select(`
    *,
    teacher:users(id, email, full_name)
  `)
  .eq('is_active', true)
```

#### New Approach
```typescript
// ✅ NEW
const { data: groups, error } = await db.groups.findAll()
// Automatically includes teacher relation!
// Result: Array<{ id, name, teacher: { id, email, fullName } }>
```

---

### 5. Complex Queries

#### Old Approach
```typescript
// ❌ OLD
const { data: groups, error } = await supabase
  .from('groups')
  .select('*')
  .eq('teacher_id', teacherId)
  .eq('is_active', true)
  .order('updated_at', { ascending: false })
```

#### New Approach
```typescript
// ✅ NEW
const { data: groups, error } = await db.groups.findByTeacher(teacherId)
// Filtering and sorting built-in!
```

---

## 📦 Field Name Mapping

Drizzle uses camelCase, while Supabase/PostgreSQL uses snake_case:

| Supabase (snake_case) | Drizzle (camelCase) |
|----------------------|---------------------|
| `full_name` | `fullName` |
| `avatar_url` | `avatarUrl` |
| `created_at` | `createdAt` |
| `updated_at` | `updatedAt` |
| `teacher_id` | `teacherId` |
| `group_id` | `groupId` |
| `qr_code_token` | `qrCodeToken` |
| `is_active` | `isActive` |
| `device_id` | `deviceId` |
| `goal_type` | `goalType` |
| `target_value` | `targetValue` |
| `order_index` | `orderIndex` |
| `participant_id` | `participantId` |
| `goal_id` | `goalId` |
| `current_value` | `currentValue` |
| `is_completed` | `isCompleted` |
| `is_system_message` | `isSystemMessage` |
| `is_goal_relevant` | `isGoalRelevant` |
| `ai_analysis` | `aiAnalysis` |
| `resolved_by` | `resolvedBy` |
| `resolved_at` | `resolvedAt` |
| `warning_type` | `warningType` |
| `message_id` | `messageId` |

---

## 🎯 Step-by-Step Migration

### Example: Migrating an API Endpoint

Let's migrate the profile API endpoint:

#### Before (Old Code)

```typescript
// server/api/auth/profile.get.ts
export default defineEventHandler(async (event) => {
  const userId = 'some-user-id'
  
  // ❌ OLD: Import from connection.ts
  const { db } = await import('~/lib/database/connection')
  
  // ❌ OLD: Supabase client query
  const { data: user, error } = await db.users.findById(userId)
  // This was a wrapper around supabase.from('users')...
  
  if (error) {
    return { exists: false, error: error.message }
  }
  
  return { exists: true, user }
})
```

#### After (New Code)

```typescript
// server/api/auth/profile.get.ts
export default defineEventHandler(async (event) => {
  const userId = 'some-user-id'
  
  // ✅ NEW: Import from index
  import { db } from '~/lib/database'
  
  // ✅ NEW: Drizzle ORM query
  const { data: user, error } = await db.users.findById(userId)
  // Same API, but now using Drizzle under the hood!
  
  if (error) {
    return { exists: false, error }
  }
  
  return { exists: true, user }
})
```

**Key Changes**:
1. Import path changed
2. Same API surface (backward compatible!)
3. Better TypeScript inference
4. Faster queries with Drizzle

---

## 🔧 Available Helper Functions

### Users
```typescript
db.users.create(userData)
db.users.findById(id)
db.users.findByEmail(email)
db.users.update(id, updates)
```

### Groups
```typescript
db.groups.create(groupData)
db.groups.findAll()
db.groups.findById(id)
db.groups.findByTeacher(teacherId)
db.groups.findByQRToken(token)
db.groups.delete(id)
```

### Goals
```typescript
db.goals.findByGroup(groupId)
db.goals.create(goalData)
```

### Participants
```typescript
db.participants.create(participantData)
db.participants.findByGroup(groupId)
db.participants.findByGroupAndDevice(groupId, deviceId)
```

### Goal Progress
```typescript
db.goalProgress.create(progressData)
db.goalProgress.findByParticipantAndGoal(participantId, goalId)
db.goalProgress.update(participantId, goalId, updates)
```

### Help Requests
```typescript
db.helpRequests.findUnresolvedByGroup(groupId)
db.helpRequests.create(requestData)
```

### Messages
```typescript
db.messages.create(messageData)
db.messages.findByGroup(groupId, limit?)
```

---

## 🚀 Advanced Usage

### When You Need Custom Queries

If the helper functions don't cover your use case, use the raw Drizzle instance:

```typescript
import { drizzleDb, eq, and, desc } from '~/lib/database'
import { users, groups } from '~/lib/database/schema'

// Custom query
const result = await drizzleDb
  .select()
  .from(groups)
  .innerJoin(users, eq(groups.teacherId, users.id))
  .where(and(
    eq(groups.isActive, true),
    eq(users.role, 'teacher')
  ))
  .orderBy(desc(groups.createdAt))
```

---

## ✅ Migration Checklist

Use this checklist to migrate your codebase:

- [ ] Set `DATABASE_URL` or `SUPABASE_DB_PASSWORD` in `.env`
- [ ] Test database connection: `npm run dev` (check logs)
- [ ] Update imports from `~/lib/database/connection` → `~/lib/database`
- [ ] Convert snake_case field names to camelCase
- [ ] Replace direct Supabase client calls with helper functions
- [ ] Test each API endpoint after migration
- [ ] Update any custom queries to use Drizzle syntax
- [ ] Remove old imports from `connection.ts`
- [ ] Run `npm run db:studio` to verify data

---

## 🧪 Testing Your Migration

### 1. Create a Test Route

```typescript
// server/api/test-migration.get.ts
import { db } from '~/lib/database'

export default defineEventHandler(async (event) => {
  try {
    // Test all operations
    const tests = {
      users: await db.users.findByEmail('test@example.com'),
      groups: await db.groups.findAll(),
      goals: await db.goals.findByGroup('some-group-id')
    }
    
    return {
      success: true,
      message: 'All database operations working!',
      tests
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
})
```

### 2. Compare Results

Run the same query with both approaches and verify results match:

```typescript
// Old approach
const oldResult = await supabase.from('users').select('*').eq('id', id)

// New approach
const newResult = await db.users.findById(id)

// Compare
console.log('Match:', JSON.stringify(oldResult.data) === JSON.stringify(newResult.data))
```

---

## 🐛 Common Issues

### Issue 1: Field Names Don't Match

**Problem**: Using snake_case instead of camelCase

```typescript
// ❌ Wrong
await db.users.create({ full_name: 'John' })

// ✅ Correct
await db.users.create({ fullName: 'John' })
```

### Issue 2: Import Path Errors

**Problem**: Still importing from old location

```typescript
// ❌ Wrong
import { db } from '~/lib/database/connection'

// ✅ Correct
import { db } from '~/lib/database'
```

### Issue 3: Response Format Changed

**Problem**: Expecting different response structure

```typescript
// OLD: data might be null or array
const { data, error } = await supabase.from('users')...

// NEW: data is always defined, check error
const { data, error } = await db.users.findById(id)
if (error) {
  // Handle error
}
// data is either the user or null
```

---

## 📚 Need Help?

- Check `DRIZZLE_SETUP.md` for setup instructions
- See `app/lib/database/drizzle.ts` for available functions
- Review `app/lib/database/schema.ts` for table definitions
- Use `npm run db:studio` to explore your database visually

---

## ✨ Benefits After Migration

- ✅ **Full TypeScript inference** - No more `any` types!
- ✅ **Autocomplete everywhere** - IntelliSense for all fields
- ✅ **Compile-time errors** - Catch bugs before runtime
- ✅ **Better performance** - Optimized queries
- ✅ **Cleaner code** - Less boilerplate
- ✅ **Easier maintenance** - Schema-driven development

Happy migrating! 🚀
