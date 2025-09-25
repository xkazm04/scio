import { validateBody } from '~/lib/validation/schemas';
import { joinGroupSchema } from '~/lib/validation/schemas';
import { db } from '~/lib/database/connection';
import { groups, groupParticipants } from '~/lib/database/schema';
import { eq, and } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    // Validate request body
    const validatedData = validateBody(joinGroupSchema, body);

    // Find the group by QR token
    const group = await db
      .select()
      .from(groups)
      .where(eq(groups.qrCodeToken, validatedData.qrToken))
      .limit(1);

    if (group.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Skupina nenalezena. Zkontrolujte QR kód.',
      });
    }

    const foundGroup = group[0];

    if (!foundGroup?.isActive) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tato skupina již není aktivní.',
      });
    }

    // Check if device is already in this group
    const existingParticipant = await db
      .select()
      .from(groupParticipants)
      .where(
        and(
          eq(groupParticipants.groupId, foundGroup.id),
          eq(groupParticipants.deviceId, validatedData.deviceId)
        )
      )
      .limit(1);

    if (existingParticipant.length > 0) {
      // Return existing participant info instead of error
      return {
        success: true,
        participant: existingParticipant[0],
        group: foundGroup,
        message: 'Již jste členem této skupiny',
        isExisting: true,
      };
    }

    // Create new participant
    const newParticipant = await db
      .insert(groupParticipants)
      .values({
        groupId: foundGroup.id,
        deviceId: validatedData.deviceId,
        nickname: validatedData.nickname,
      })
      .returning();

    return {
      success: true,
      participant: newParticipant[0],
      group: foundGroup,
      message: 'Úspěšně jste se připojili ke skupině',
      isExisting: false,
    };

  } catch (error: any) {
    console.error('Group join error:', error);
    
    if (error?.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Chyba při připojování ke skupině',
    });
  }
});