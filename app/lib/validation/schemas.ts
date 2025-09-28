import { z } from 'zod';

// User validation schemas
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  fullName: z.string().min(1).max(255).optional(),
  role: z.enum(['teacher', 'student']),
  avatarUrl: z.string().url().optional(),
});

export const createUserSchema = userSchema.omit({ id: true });
export const updateUserSchema = userSchema.partial().omit({ id: true });

// Group validation schemas
export const groupSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().min(1),
  teacherId: z.string().uuid(),
  qrCodeToken: z.string().min(1),
  isActive: z.boolean().optional(),
});

export const createGroupSchema = groupSchema.omit({ id: true, teacherId: true, qrCodeToken: true });
export const updateGroupSchema = groupSchema.partial().omit({ id: true, teacherId: true, qrCodeToken: true });

// Goal validation schemas
export const goalSchema = z.object({
  id: z.string().uuid(),
  groupId: z.string().uuid(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  goalType: z.enum(['boolean', 'percentage']),
  targetValue: z.number().int().min(1),
  orderIndex: z.number().int().min(0),
});

export const createGoalSchema = goalSchema.omit({ id: true });
export const updateGoalSchema = goalSchema.partial().omit({ id: true, groupId: true });

// Group participant validation schemas
export const groupParticipantSchema = z.object({
  id: z.string().uuid(),
  groupId: z.string().uuid(),
  deviceId: z.string().min(1),
  nickname: z.string().min(1).max(100),
});

export const joinGroupSchema = z.object({
  qrToken: z.string().min(1),
  deviceId: z.string().min(1),
  nickname: z.string().min(1).max(100),
});

export const createParticipantSchema = groupParticipantSchema.omit({ id: true });

// Goal progress validation schemas
export const goalProgressSchema = z.object({
  id: z.string().uuid(),
  participantId: z.string().uuid(),
  goalId: z.string().uuid(),
  currentValue: z.number().int().min(0),
});

export const updateProgressSchema = z.object({
  currentValue: z.number().int().min(0),
});

// Message validation schemas
export const messageSchema = z.object({
  id: z.string().uuid(),
  groupId: z.string().uuid(),
  participantId: z.string().uuid().optional(),
  content: z.string().min(1),
  isSystemMessage: z.boolean().optional(),
  isGoalRelevant: z.boolean().optional(),
  aiAnalysis: z.record(z.string(), z.any()).optional(),
});

export const createMessageSchema = messageSchema.omit({ id: true });

// Help request validation schemas
export const helpRequestSchema = z.object({
  id: z.string().uuid(),
  participantId: z.string().uuid(),
  groupId: z.string().uuid(),
  reason: z.string().optional(),
  status: z.enum(['pending', 'resolved']),
  resolvedBy: z.string().uuid().optional(),
});

export const createHelpRequestSchema = helpRequestSchema.omit({ id: true, status: true, resolvedBy: true });
export const updateHelpRequestSchema = z.object({
  status: z.enum(['pending', 'resolved']),
  resolvedBy: z.string().uuid().optional(),
});

// Pagination schemas
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Query parameter schemas
export const groupQuerySchema = z.object({
  teacherId: z.string().uuid().optional(),
  isActive: z.boolean().optional(),
}).merge(paginationSchema);

export const messageQuerySchema = z.object({
  groupId: z.string().uuid(),
  participantId: z.string().uuid().optional(),
  isSystemMessage: z.boolean().optional(),
  isGoalRelevant: z.boolean().optional(),
  since: z.string().datetime().optional(),
}).merge(paginationSchema);

export const progressQuerySchema = z.object({
  participantId: z.string().uuid().optional(),
  goalId: z.string().uuid().optional(),
  isCompleted: z.boolean().optional(),
});

// API Response schemas
export const apiResponseSchema = z.object({
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export const paginatedResponseSchema = z.object({
  data: z.array(z.any()),
  meta: z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  }),
});

// Validation helper functions
export const validateRequest = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation Error',
        data: {
          issues: error.issues.map(issue => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        },
      });
    }
    throw error;
  }
};

export const validateQuery = <T>(schema: z.ZodSchema<T>, query: unknown): T => {
  return validateRequest(schema, query);
};

export const validateBody = <T>(schema: z.ZodSchema<T>, body: unknown): T => {
  return validateRequest(schema, body);
};