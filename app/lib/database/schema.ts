import { pgTable, text, timestamp, pgEnum, uuid, boolean, integer, jsonb, unique, index } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

// Define enums
export const userRoleEnum = pgEnum('user_role', ['student', 'teacher', 'admin']);
export const goalTypeEnum = pgEnum('goal_type', ['boolean', 'percentage']);
export const helpRequestStatusEnum = pgEnum('help_request_status', ['pending', 'resolved']);

// Users table (extends Supabase auth.users)
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull(),
  fullName: text('full_name'),
  role: userRoleEnum('role').notNull().default('student'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Groups table
export const groups = pgTable('groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  teacherId: uuid('teacher_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  qrCodeToken: text('qr_code_token').notNull().unique(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  teacherIdx: index('idx_groups_teacher_id').on(table.teacherId),
  qrTokenIdx: index('idx_groups_qr_token').on(table.qrCodeToken),
}));

// Goals table - defines what students need to achieve
export const goals = pgTable('goals', {
  id: uuid('id').primaryKey().defaultRandom(),
  groupId: uuid('group_id').notNull().references(() => groups.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  goalType: goalTypeEnum('goal_type').notNull(),
  targetValue: integer('target_value').default(1),
  orderIndex: integer('order_index').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  groupIdx: index('idx_goals_group_id').on(table.groupId),
}));

// Group participants - tracks who joined which group
export const groupParticipants = pgTable('group_participants', {
  id: uuid('id').primaryKey().defaultRandom(),
  groupId: uuid('group_id').notNull().references(() => groups.id, { onDelete: 'cascade' }),
  deviceId: text('device_id').notNull(),
  nickname: text('nickname').notNull(),
  joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
  lastActivity: timestamp('last_activity', { withTimezone: true }).defaultNow().notNull(),
  isActive: boolean('is_active').default(true),
}, (table) => ({
  groupDeviceUnique: unique().on(table.groupId, table.deviceId),
  groupIdx: index('idx_group_participants_group_id').on(table.groupId),
  deviceIdx: index('idx_group_participants_device_id').on(table.deviceId),
}));

// Goal progress - tracks individual participant progress
export const goalProgress = pgTable('goal_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  participantId: uuid('participant_id').notNull().references(() => groupParticipants.id, { onDelete: 'cascade' }),
  goalId: uuid('goal_id').notNull().references(() => goals.id, { onDelete: 'cascade' }),
  currentValue: integer('current_value').default(0),
  isCompleted: boolean('is_completed').$defaultFn(() => false),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  participantGoalUnique: unique().on(table.participantId, table.goalId),
  participantIdx: index('idx_goal_progress_participant_id').on(table.participantId),
  goalIdx: index('idx_goal_progress_goal_id').on(table.goalId),
}));

// Messages table - chat messages
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  groupId: uuid('group_id').notNull().references(() => groups.id, { onDelete: 'cascade' }),
  participantId: uuid('participant_id').references(() => groupParticipants.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  isSystemMessage: boolean('is_system_message').default(false),
  isGoalRelevant: boolean('is_goal_relevant').default(false),
  aiAnalysis: jsonb('ai_analysis'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  groupIdx: index('idx_messages_group_id').on(table.groupId),
  participantIdx: index('idx_messages_participant_id').on(table.participantId),
  createdAtIdx: index('idx_messages_created_at').on(table.createdAt),
}));

// Help requests - when students need teacher assistance
export const helpRequests = pgTable('help_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  participantId: uuid('participant_id').notNull().references(() => groupParticipants.id, { onDelete: 'cascade' }),
  groupId: uuid('group_id').notNull().references(() => groups.id, { onDelete: 'cascade' }),
  reason: text('reason').default('inactive'),
  status: helpRequestStatusEnum('status').default('pending'),
  resolvedBy: uuid('resolved_by').references(() => users.id),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  groupIdx: index('idx_help_requests_group_id').on(table.groupId),
  statusIdx: index('idx_help_requests_status').on(table.status),
}));

// Activity warnings - track when students receive warnings
export const activityWarnings = pgTable('activity_warnings', {
  id: uuid('id').primaryKey().defaultRandom(),
  participantId: uuid('participant_id').notNull().references(() => groupParticipants.id, { onDelete: 'cascade' }),
  warningType: text('warning_type').notNull(),
  messageId: uuid('message_id').references(() => messages.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
  groups: many(groups),
  resolvedRequests: many(helpRequests, { relationName: "resolvedBy" }),
}));

export const groupsRelations = relations(groups, ({ one, many }) => ({
  teacher: one(users, {
    fields: [groups.teacherId],
    references: [users.id],
  }),
  goals: many(goals),
  participants: many(groupParticipants),
  messages: many(messages),
  helpRequests: many(helpRequests),
}));

export const goalsRelations = relations(goals, ({ one, many }) => ({
  group: one(groups, {
    fields: [goals.groupId],
    references: [groups.id],
  }),
  progress: many(goalProgress),
}));

export const groupParticipantsRelations = relations(groupParticipants, ({ one, many }) => ({
  group: one(groups, {
    fields: [groupParticipants.groupId],
    references: [groups.id],
  }),
  progress: many(goalProgress),
  messages: many(messages),
  helpRequests: many(helpRequests),
  warnings: many(activityWarnings),
}));

export const goalProgressRelations = relations(goalProgress, ({ one }) => ({
  participant: one(groupParticipants, {
    fields: [goalProgress.participantId],
    references: [groupParticipants.id],
  }),
  goal: one(goals, {
    fields: [goalProgress.goalId],
    references: [goals.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one, many }) => ({
  group: one(groups, {
    fields: [messages.groupId],
    references: [groups.id],
  }),
  participant: one(groupParticipants, {
    fields: [messages.participantId],
    references: [groupParticipants.id],
  }),
  warnings: many(activityWarnings),
}));

export const helpRequestsRelations = relations(helpRequests, ({ one }) => ({
  participant: one(groupParticipants, {
    fields: [helpRequests.participantId],
    references: [groupParticipants.id],
  }),
  group: one(groups, {
    fields: [helpRequests.groupId],
    references: [groups.id],
  }),
  resolver: one(users, {
    fields: [helpRequests.resolvedBy],
    references: [users.id],
    relationName: "resolvedBy",
  }),
}));

export const activityWarningsRelations = relations(activityWarnings, ({ one }) => ({
  participant: one(groupParticipants, {
    fields: [activityWarnings.participantId],
    references: [groupParticipants.id],
  }),
  message: one(messages, {
    fields: [activityWarnings.messageId],
    references: [messages.id],
  }),
}));