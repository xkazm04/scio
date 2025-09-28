import type { ApiResponse, PaginatedResponse } from '../database/types';

// API Response helpers
export const createApiResponse = <T = any>(
  data?: T,
  message?: string,
  error?: string
): ApiResponse<T> => {
  return {
    ...(data !== undefined && { data }),
    ...(message && { message }),
    ...(error && { error }),
  };
};

export const createPaginatedResponse = <T = any>(
  data: T[],
  meta: {
    page: number;
    limit: number;
    total: number;
  }
): PaginatedResponse<T> => {
  return {
    data,
    meta: {
      ...meta,
      totalPages: Math.ceil(meta.total / meta.limit),
    },
  };
};

// Error handling
export const handleApiError = (error: unknown): never => {
  console.error('API Error:', error);
  
  if (error instanceof Error) {
    if (error.message.includes('duplicate key')) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Conflict: Resource already exists',
      });
    }
    
    if (error.message.includes('foreign key')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request: Referenced resource does not exist',
      });
    }
    
    if (error.message.includes('not found')) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Resource not found',
      });
    }
  }
  
  throw createError({
    statusCode: 500,
    statusMessage: 'Internal Server Error',
    data: process.env.NODE_ENV === 'development' ? error : undefined,
  });
};


export const requireRole = (userRole: string, requiredRole: string | string[]) => {
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  
  if (!roles.includes(userRole)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Insufficient permissions',
    });
  }
};

// Group access control helpers
export const checkGroupAccess = async (
  groupId: string,
  userId: string,
  permission: 'read' | 'write' = 'read'
) => {
  // Import Supabase client dynamically to avoid build issues
  const { db } = await import('../database/connection');
  
  if (!db) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Database connection not available',
    });
  }
  
  const { data: group, error } = await db.groups.findById(groupId);
  
  if (error || !group) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Group not found',
    });
  }
  
  // Teachers have full access to their groups
  if (group.created_by === userId) {
    return { group, access: 'full' as const };
  }
  
  // For participants, check if they have joined the group
  if (permission === 'read') {
    const { data: participant } = await db.participants.findByGroupAndDevice(groupId, userId);
    
    if (participant) {
      return { group, access: 'participant' as const };
    }
  }
  
  throw createError({
    statusCode: 403,
    statusMessage: 'Forbidden: Access denied to this group',
  });
};

// Pagination helpers
export const calculateOffset = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

export const getPaginationMeta = (page: number, limit: number, total: number) => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

// Device ID helpers (for participant tracking)
export const generateDeviceId = (): string => {
  // Use crypto.randomUUID() if available, fall back to timestamp-based method
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `device_${crypto.randomUUID().replace(/-/g, '').substr(0, 12)}`;
  }
  return `device_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 8)}`;
};

// QR Token helpers
export const generateQRToken = (): string => {
  // Use crypto.randomUUID() if available, fall back to timestamp-based method
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `group_${crypto.randomUUID().replace(/-/g, '').substr(0, 8).toLowerCase()}`;
  }
  return `group_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6).toLowerCase()}`;
};

// Goal progress calculation helpers
export const calculateGoalCompletion = (
  currentValue: number,
  targetValue: number,
  goalType: 'boolean' | 'percentage'
): boolean => {
  if (goalType === 'boolean') {
    return currentValue >= 1;
  }
  return currentValue >= targetValue;
};

export const calculateProgressPercentage = (
  currentValue: number,
  targetValue: number,
  goalType: 'boolean' | 'percentage'
): number => {
  if (goalType === 'boolean') {
    return currentValue >= 1 ? 100 : 0;
  }
  return Math.min(100, Math.round((currentValue / targetValue) * 100));
};