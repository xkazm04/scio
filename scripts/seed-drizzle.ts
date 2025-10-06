import 'dotenv/config'
import { db } from '../app/lib/database/drizzle'
import {
  users,
  groups,
  goals,
  groupParticipants,
  goalProgress,
  messages,
  helpRequests
} from '../app/lib/database/schema'
import { sql } from 'drizzle-orm'
import { randomUUID } from 'crypto'

async function seed() {
  try {
    console.log('🌱 Starting database seeding with Drizzle ORM...')
    
    // Clear existing seed data to avoid conflicts (in reverse dependency order)
    console.log('🧹 Cleaning up existing seed data...')
    try {
      // Delete in reverse dependency order to handle foreign keys
      await db.delete(goalProgress).where(sql`true`)
      console.log('  - Cleared goal progress')
      await db.delete(messages).where(sql`true`)  
      console.log('  - Cleared messages')
      await db.delete(helpRequests).where(sql`true`)
      console.log('  - Cleared help requests')
      await db.delete(goals).where(sql`true`)
      console.log('  - Cleared goals')
      await db.delete(groupParticipants).where(sql`true`)
      console.log('  - Cleared participants')
      await db.delete(groups).where(sql`true`)
      console.log('  - Cleared groups')
      // Note: We keep users as they might be from actual auth
      console.log('✅ Cleanup completed')
    } catch (cleanupError) {
      console.log('⚠️  Cleanup had some issues:', (cleanupError as any)?.message || 'Unknown error')
      console.log('   This is normal for first run or if tables are empty')
    }

    // For seeding, we'll first check if there are existing users or create one for testing
    console.log('🔍 Checking for existing users...')
    
    // Try to find an existing user first
    const existingUsers = await db.select().from(users).limit(1)
    let teacherId: string
    
    if (existingUsers.length > 0) {
      teacherId = existingUsers[0].id
      console.log(`✅ Using existing user: ${existingUsers[0].fullName} (${teacherId})`)
    } else {
      // Create a test teacher - Note: In production this would come from Supabase Auth
      teacherId = randomUUID()
      console.log('�‍🏫 Creating sample teacher with ID:', teacherId)
      
      try {
        const teacherData = await db.insert(users).values({
          id: teacherId,
          email: 'teacher@example.com',
          fullName: 'Učitel Novák',
          role: 'teacher',
        }).returning();
        console.log(`✅ Created teacher user: ${teacherData[0]?.fullName}`)
      } catch (userError: any) {
        if (userError.message?.includes('foreign key constraint')) {
          console.log('⚠️  Cannot create user due to foreign key constraint (likely references auth.users)')
          console.log('ℹ️  Please create a user through the app first, then use their ID')
          console.log('💡 For now, using a placeholder UUID for groups (they won\'t be fully functional)')
          teacherId = randomUUID() // Use placeholder for demo purposes
        } else {
          throw userError
        }
      }
    }

    // Create sample groups
    const group1Id = randomUUID()
    const group2Id = randomUUID()
    const group3Id = randomUUID()

    const sampleGroups = [
      {
        id: group1Id,
        name: 'Matematika - Kvadratické rovnice',
        description: 'Procvičujeme řešení kvadratických rovnic a jejich praktické aplikace',
        teacherId: teacherId,
        qrCodeToken: `qr_${randomUUID()}`,
        isActive: true,
      },
      {
        id: group2Id,
        name: 'Fyzika - Mechanika',
        description: 'Základy mechaniky a pohybu těles',
        teacherId: teacherId,
        qrCodeToken: `qr_${randomUUID()}`,
        isActive: true,
      },
      {
        id: group3Id,
        name: 'Chemie - Organické sloučeniny',
        description: 'Studium organických sloučenin a jejich vlastností',
        teacherId: teacherId,
        qrCodeToken: `qr_${randomUUID()}`,
        isActive: true,
      }
    ]

    console.log('📁 Creating sample groups...')
    const groupResults = await db.insert(groups).values(sampleGroups).returning()
    console.log(`✅ Created ${groupResults.length} groups`)

    // Create sample goals
    const goal1Id = randomUUID()
    const goal2Id = randomUUID()
    const goal3Id = randomUUID()
    const goal4Id = randomUUID()
    const goal5Id = randomUUID()
    const goal6Id = randomUUID()

    const sampleGoals = [
      // Math group goals
      {
        id: goal1Id,
        groupId: group1Id,
        title: 'Vysvětlí rozdíl mezi lineární a kvadratickou rovnicí',
        description: 'Popište základní rozdíly a charakteristiky obou typů rovnic',
        goalType: 'boolean' as const,
        targetValue: 1,
        orderIndex: 1,
      },
      {
        id: goal2Id,
        groupId: group1Id,
        title: 'Vyřeší kvadratické rovnice pomocí diskriminantu',
        description: 'Dokončete 3 různé příklady používající diskriminant',
        goalType: 'percentage' as const,
        targetValue: 3,
        orderIndex: 2,
      },
      {
        id: goal3Id,
        groupId: group1Id,
        title: 'Aplikuje kvadratické rovnice v praktických příkladech',
        description: 'Vyřešte alespoň 2 slovní úlohy',
        goalType: 'percentage' as const,
        targetValue: 2,
        orderIndex: 3,
      },
      // Physics group goals
      {
        id: goal4Id,
        groupId: group2Id,
        title: 'Definuje základní fyzikální veličiny',
        description: 'Vysvětlete rychlost, zrychlení, sílu a energii',
        goalType: 'boolean' as const,
        targetValue: 1,
        orderIndex: 1,
      },
      {
        id: goal5Id,
        groupId: group2Id,
        title: 'Vyřeší úlohy na rovnoměrný pohyb',
        description: 'Dokončete 5 příkladů na rovnoměrný pohyb',
        goalType: 'percentage' as const,
        targetValue: 5,
        orderIndex: 2,
      },
      // Chemistry group goal
      {
        id: goal6Id,
        groupId: group3Id,
        title: 'Klasifikuje organické sloučeniny',
        description: 'Rozpoznejte a pojmenujte základní funkční skupiny',
        goalType: 'boolean' as const,
        targetValue: 1,
        orderIndex: 1,
      },
    ]

    console.log('🎯 Creating sample goals...')
    const goalResults = await db.insert(goals).values(sampleGoals).returning()
    console.log(`✅ Created ${goalResults.length} goals`)

    // Create sample participants (students)
    const participant1Id = randomUUID()
    const participant2Id = randomUUID()
    const participant3Id = randomUUID()
    const participant4Id = randomUUID()
    const participant5Id = randomUUID()
    const participant6Id = randomUUID()

    const sampleParticipants = [
      // Math group participants
      {
        id: participant1Id,
        groupId: group1Id,
        deviceId: `device_${randomUUID().substring(0, 12).toLowerCase()}`,
        nickname: 'Jan Novák',
      },
      {
        id: participant2Id,
        groupId: group1Id,
        deviceId: `device_${randomUUID().substring(0, 12).toLowerCase()}`,
        nickname: 'Marie Svobodová',
      },
      {
        id: participant3Id,
        groupId: group1Id,
        deviceId: `device_${randomUUID().substring(0, 12).toLowerCase()}`,
        nickname: 'Petr Dvořák',
      },
      // Physics group participants
      {
        id: participant4Id,
        groupId: group2Id,
        deviceId: `device_${randomUUID().substring(0, 12).toLowerCase()}`,
        nickname: 'Anna Nováková',
      },
      {
        id: participant5Id,
        groupId: group2Id,
        deviceId: `device_${randomUUID().substring(0, 12).toLowerCase()}`,
        nickname: 'Tomáš Černý',
      },
      // Chemistry group participant
      {
        id: participant6Id,
        groupId: group3Id,
        deviceId: `device_${randomUUID().substring(0, 12).toLowerCase()}`,
        nickname: 'Kateřina Holubová',
      },
    ]

    console.log('👥 Creating sample participants...')
    const participantResults = await db.insert(groupParticipants).values(sampleParticipants).returning()
    console.log(`✅ Created ${participantResults.length} participants`)

    // Use the actual created IDs from the database
    const actualParticipants = participantResults
    const actualGoals = goalResults

    // Create sample goal progress using actual database IDs
    const sampleProgress = [
      // First participant (Jan Novák) - Math group goals
      { id: randomUUID(), participantId: actualParticipants[0].id, goalId: actualGoals[0].id, currentValue: 1, isCompleted: true },
      { id: randomUUID(), participantId: actualParticipants[0].id, goalId: actualGoals[1].id, currentValue: 2, isCompleted: false },
      { id: randomUUID(), participantId: actualParticipants[0].id, goalId: actualGoals[2].id, currentValue: 1, isCompleted: false },
      
      // Second participant (Marie) - Math group goals  
      { id: randomUUID(), participantId: actualParticipants[1].id, goalId: actualGoals[0].id, currentValue: 0, isCompleted: false },
      { id: randomUUID(), participantId: actualParticipants[1].id, goalId: actualGoals[1].id, currentValue: 1, isCompleted: false },
      { id: randomUUID(), participantId: actualParticipants[1].id, goalId: actualGoals[2].id, currentValue: 0, isCompleted: false },
      
      // Third participant (Petr) - Math group goals
      { id: randomUUID(), participantId: actualParticipants[2].id, goalId: actualGoals[0].id, currentValue: 1, isCompleted: true },
      { id: randomUUID(), participantId: actualParticipants[2].id, goalId: actualGoals[1].id, currentValue: 3, isCompleted: true },
      { id: randomUUID(), participantId: actualParticipants[2].id, goalId: actualGoals[2].id, currentValue: 2, isCompleted: true },
      
      // Fourth participant (Anna) - Physics group goals
      { id: randomUUID(), participantId: actualParticipants[3].id, goalId: actualGoals[3].id, currentValue: 1, isCompleted: true },
      { id: randomUUID(), participantId: actualParticipants[3].id, goalId: actualGoals[4].id, currentValue: 3, isCompleted: false },
      
      // Fifth participant (Tomáš) - Physics group goals
      { id: randomUUID(), participantId: actualParticipants[4].id, goalId: actualGoals[3].id, currentValue: 0, isCompleted: false },
      { id: randomUUID(), participantId: actualParticipants[4].id, goalId: actualGoals[4].id, currentValue: 1, isCompleted: false },
      
      // Sixth participant (Kateřina) - Chemistry group goal
      { id: randomUUID(), participantId: actualParticipants[5].id, goalId: actualGoals[5].id, currentValue: 1, isCompleted: true },
    ]

    console.log('📊 Creating sample goal progress...')
    console.log(`   Attempting to create ${sampleProgress.length} progress records...`)
    
    // Debug: Check if there are any existing progress records
    const existingProgress = await db.select().from(goalProgress).limit(5)
    if (existingProgress.length > 0) {
      console.log(`⚠️  Found ${existingProgress.length} existing progress records - this might cause conflicts`)
      // Try to clear again with more force
      await db.delete(goalProgress)
      console.log('   Cleared progress records again')
    }
    
    const progressResults = await db.insert(goalProgress).values(sampleProgress).returning()
    console.log(`✅ Created ${progressResults.length} progress records`)

    // Create sample messages using actual IDs
    const sampleMessages = [
      {
        id: randomUUID(),
        groupId: groupResults[0].id, // Math group
        participantId: actualParticipants[0].id, // Jan
        content: 'Potřebuji pomoci s diskriminantem, nechápu jak postupovat.',
        isSystemMessage: false,
        isGoalRelevant: true,
      },
      {
        id: randomUUID(),
        groupId: groupResults[0].id, // Math group
        participantId: null, // System message
        content: 'Vítejte v matematické skupině! Dnes se budeme věnovat kvadratickým rovnicím.',
        isSystemMessage: true,
        isGoalRelevant: false,
      },
      {
        id: randomUUID(),
        groupId: groupResults[1].id, // Physics group
        participantId: actualParticipants[3].id, // Anna
        content: 'Mohl by někdo vysvětlit rozdíl mezi rychlostí a zrychlením?',
        isSystemMessage: false,
        isGoalRelevant: true,
      },
    ]

    console.log('💬 Creating sample messages...')
    const messageResults = await db.insert(messages).values(sampleMessages).returning()
    console.log(`✅ Created ${messageResults.length} messages`)

    // Create sample help requests using actual IDs
    const sampleHelpRequests = [
      {
        id: randomUUID(),
        participantId: actualParticipants[1].id, // Marie
        groupId: groupResults[0].id, // Math group
        reason: 'inactive',
        status: 'pending' as const,
      },
      {
        id: randomUUID(),
        participantId: actualParticipants[4].id, // Tomáš
        groupId: groupResults[1].id, // Physics group
        reason: 'confused',
        status: 'pending' as const,
      },
    ]

    console.log('🆘 Creating sample help requests...')
    const helpResults = await db.insert(helpRequests).values(sampleHelpRequests).returning()
    console.log(`✅ Created ${helpResults.length} help requests`)

    console.log('\n✅ Database seeding completed!')
    
    console.log('\n📊 Sample data overview:')
    console.log('- 3 groups with different subjects')
    console.log('- 6 goals total (3 for Math, 2 for Physics, 1 for Chemistry)')
    console.log('- 6 student participants across all groups')
    console.log('- Various progress levels to test teacher dashboard')
    
    console.log('\n🔧 To activate the seed data:')
    console.log('1. Create a teacher account via Google OAuth in your app')
    console.log('2. Get the user ID from Supabase Auth dashboard')
    console.log('3. Update the teacherId variable in this script')
    console.log('4. Uncomment the database insert statements')
    console.log('5. Run the seed script again: npm run seed')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run the seed function
seed()
  .then(() => {
    console.log('🎉 Seeding process completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Seeding process failed:', error)
    process.exit(1)
  })