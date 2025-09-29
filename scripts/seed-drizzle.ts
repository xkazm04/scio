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
import { randomUUID } from 'crypto'

async function seed() {
  try {
    console.log('🌱 Starting database seeding with Drizzle ORM...')

    // WARNING: Update this with a real user ID from your Supabase Auth
    const teacherId = 'replace-with-real-uuid-from-supabase-auth'
    console.log('ℹ️  Make sure you have created users via Supabase Auth first')
    console.log('⚠️  Please update the teacherId variable with a real UUID from your Supabase auth.users table')

    /* Uncomment this section once you have a real teacher user ID
    
    // Create sample teacher user in our users table (extends Supabase auth)
    const { data: userData, error: userError } = await db.insert(users).values({
      id: teacherId,
      email: 'teacher@example.com',
      fullName: 'Učitel Novák',
      role: 'teacher',
    }).returning();
    if (userError) console.warn('User insert error:', userError);
    */

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

    // Create sample goal progress
    const sampleProgress = [
      // Jan Novák's progress (Math group)
      { id: randomUUID(), participantId: participant1Id, goalId: goal1Id, currentValue: 1, isCompleted: true },
      { id: randomUUID(), participantId: participant1Id, goalId: goal2Id, currentValue: 2, isCompleted: false },
      { id: randomUUID(), participantId: participant1Id, goalId: goal3Id, currentValue: 1, isCompleted: false },
      
      // Marie Svobodová's progress (Math group)
      { id: randomUUID(), participantId: participant2Id, goalId: goal1Id, currentValue: 0, isCompleted: false },
      { id: randomUUID(), participantId: participant2Id, goalId: goal2Id, currentValue: 1, isCompleted: false },
      { id: randomUUID(), participantId: participant2Id, goalId: goal3Id, currentValue: 0, isCompleted: false },
      
      // Petr Dvořák's progress (Math group)
      { id: randomUUID(), participantId: participant3Id, goalId: goal1Id, currentValue: 1, isCompleted: true },
      { id: randomUUID(), participantId: participant3Id, goalId: goal2Id, currentValue: 3, isCompleted: true },
      { id: randomUUID(), participantId: participant3Id, goalId: goal3Id, currentValue: 2, isCompleted: true },
      
      // Anna Nováková's progress (Physics group)
      { id: randomUUID(), participantId: participant4Id, goalId: goal4Id, currentValue: 1, isCompleted: true },
      { id: randomUUID(), participantId: participant4Id, goalId: goal5Id, currentValue: 3, isCompleted: false },
      
      // Tomáš Černý's progress (Physics group)
      { id: randomUUID(), participantId: participant5Id, goalId: goal4Id, currentValue: 0, isCompleted: false },
      { id: randomUUID(), participantId: participant5Id, goalId: goal5Id, currentValue: 1, isCompleted: false },
      
      // Kateřina Holubová's progress (Chemistry group)
      { id: randomUUID(), participantId: participant6Id, goalId: goal6Id, currentValue: 1, isCompleted: true },
    ]

    console.log('📊 Creating sample goal progress...')
    const progressResults = await db.insert(goalProgress).values(sampleProgress).returning()
    console.log(`✅ Created ${progressResults.length} progress records`)

    // Create sample messages
    const sampleMessages = [
      {
        id: randomUUID(),
        groupId: group1Id,
        participantId: participant1Id,
        content: 'Potřebuji pomoci s diskriminantem, nechápu jak postupovat.',
        isSystemMessage: false,
        isGoalRelevant: true,
      },
      {
        id: randomUUID(),
        groupId: group1Id,
        participantId: null, // System message
        content: 'Vítejte v matematické skupině! Dnes se budeme věnovat kvadratickým rovnicím.',
        isSystemMessage: true,
        isGoalRelevant: false,
      },
      {
        id: randomUUID(),
        groupId: group2Id,
        participantId: participant4Id,
        content: 'Mohl by někdo vysvětlit rozdíl mezi rychlostí a zrychlením?',
        isSystemMessage: false,
        isGoalRelevant: true,
      },
    ]

    console.log('💬 Creating sample messages...')
    const messageResults = await db.insert(messages).values(sampleMessages).returning()
    console.log(`✅ Created ${messageResults.length} messages`)

    // Create sample help requests
    const sampleHelpRequests = [
      {
        id: randomUUID(),
        participantId: participant2Id,
        groupId: group1Id,
        reason: 'inactive',
        status: 'pending' as const,
      },
      {
        id: randomUUID(),
        participantId: participant5Id,
        groupId: group2Id,
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