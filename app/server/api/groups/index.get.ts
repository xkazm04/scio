import { eq, desc, and, count } from 'drizzle-orm';
import { groups, goals, groupParticipants, users } from '~/lib/database/schema';
import { db } from '~/lib/database/index';
import { 
  createPaginatedResponse, 
  handleApiError, 
  calculateOffset,
  getPaginationMeta,
} from '~/lib/api/utils';
import { 
  validateQuery,
  groupQuerySchema,
} from '~/lib/validation/schemas';

export default defineEventHandler(async (event) => {
  try {
    const query = validateQuery(groupQuerySchema, getQuery(event));
    const { page, limit, teacherId, isActive } = query;
    
    const offset = calculateOffset(page, limit);
    
    // Build where conditions
    const conditions = [];
    if (teacherId) {
      conditions.push(eq(groups.teacherId, teacherId));
    }
    if (isActive !== undefined) {
      conditions.push(eq(groups.isActive, isActive));
    }
    
    // Get groups with counts
    const [groupsData, totalResult] = await Promise.all([
      db
        .select({
          id: groups.id,
          name: groups.name,
          description: groups.description,
          teacherId: groups.teacherId,
          qrCodeToken: groups.qrCodeToken,
          isActive: groups.isActive,
          createdAt: groups.createdAt,
          updatedAt: groups.updatedAt,
          teacher: {
            id: users.id,
            email: users.email,
            fullName: users.fullName,
          },
        })
        .from(groups)
        .leftJoin(users, eq(groups.teacherId, users.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(groups.createdAt))
        .limit(limit)
        .offset(offset),
      
      db
        .select({ count: count() })
        .from(groups)
        .where(conditions.length > 0 ? and(...conditions) : undefined),
    ]);
    
    // Get additional stats for each group
    const groupsWithStats = await Promise.all(
      groupsData.map(async (group) => {
        const [participantCount, goalCount] = await Promise.all([
          db
            .select({ count: count() })
            .from(groupParticipants)
            .where(eq(groupParticipants.groupId, group.id)),
          db
            .select({ count: count() })
            .from(goals)
            .where(eq(goals.groupId, group.id)),
        ]);
        
        return {
          ...group,
          _count: {
            participants: participantCount[0]?.count || 0,
            goals: goalCount[0]?.count || 0,
          },
        };
      })
    );
    
    const total = totalResult[0]?.count || 0;
    const meta = getPaginationMeta(page, limit, total);
    
    return createPaginatedResponse(groupsWithStats, meta);
  } catch (error) {
    return handleApiError(error);
  }
});