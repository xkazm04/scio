import { eq } from 'drizzle-orm';
import { groups, users, goals, groupParticipants } from '~/lib/database/schema';
import { db } from '~/lib/database/index';
import { 
  createApiResponse, 
  handleApiError, 
} from '~/lib/api/utils';

export default defineEventHandler(async (event) => {
  try {
    const groupId = getRouterParam(event, 'id');
    
    if (!groupId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Group ID is required',
      });
    }
    
    // Get group with detailed information
    const groupData = await db
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
      .where(eq(groups.id, groupId))
      .limit(1);
    
    if (!groupData.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Group not found',
      });
    }
    
    // Get goals for this group
    const groupGoals = await db
      .select()
      .from(goals)
      .where(eq(goals.groupId, groupId))
      .orderBy(goals.orderIndex);
    
    // Get participants for this group
    const participants = await db
      .select()
      .from(groupParticipants)
      .where(eq(groupParticipants.groupId, groupId))
      .orderBy(groupParticipants.joinedAt);
    
    const group = {
      ...groupData[0],
      goals: groupGoals,
      participants: participants,
      _count: {
        goals: groupGoals.length,
        participants: participants.length,
      },
    };
    
    return createApiResponse(group, 'Group retrieved successfully');
  } catch (error) {
    return handleApiError(error);
  }
});