import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Note: Users should be created via Supabase Auth first
    // This script assumes you have at least one teacher user in auth.users table
    console.log('ℹ️  Make sure you have created users via Supabase Auth first');

    // You'll need to replace 'your-teacher-uuid-here' with actual UUIDs from Supabase auth.users
    const teacherId = 'your-teacher-uuid-here';
    
    // Check if user exists (this would normally query your users table)
    console.log('⚠️  Please update the teacherId variable with a real UUID from your Supabase auth.users table');
    
    // Create sample users entry (linking to Supabase auth)
    // Uncomment and update when you have real user IDs:
    /*
    const { error: userError } = await supabase.from('users').upsert({
      id: teacherId,
      email: 'teacher@example.com',
      full_name: 'Jan Novák',
      role: 'teacher',
    });
    if (userError) console.warn('User insert error:', userError);
    */

    // Create sample groups
    const group1Id = randomUUID();
    const group2Id = randomUUID();
    const group3Id = randomUUID();
    
    const sampleGroups = [
      {
        name: 'Matematika 2A - Kvadratické rovnice',
        description: 'Student vyřeší samostatně 3 různé kvadratické rovnice typu ax² + bx + c pomocí diskriminantu',
        teacher_id: teacherId,
        qr_code_token: `group_math_${Math.random().toString(36).substr(2, 8).toLowerCase()}`,
      },
      {
        name: 'Fyzika 3B - Mechanika',
        description: 'Student aplikuje Newtonovy zákony na praktické úlohy s kinematickými a dynamickými problémy',
        teacher_id: teacherId,
        qr_code_token: `group_physics_${Math.random().toString(36).substr(2, 8).toLowerCase()}`,
      },
      {
        name: 'Chemie 1A - Anorganická chemie',
        description: 'Student rozpozná a pojmenuje základní anorganické sloučeniny podle jejich struktury a vlastností',
        teacher_id: teacherId,
        qr_code_token: `group_chemistry_${Math.random().toString(36).substr(2, 8).toLowerCase()}`,
      },
    ];

    console.log('📁 Creating sample groups...');
    // Uncomment when you have a real teacher ID:
    /*
    const { data: createdGroups, error: groupError } = await supabase.from('groups').insert(sampleGroups).select();
    if (groupError) {
      console.error('Group insert error:', groupError);
      return;
    }
    console.log('Created groups:', createdGroups?.map(g => g.id));
    
    const [group1, group2, group3] = createdGroups;
    */

    // Create sample goals for the groups
    const goal1Id = randomUUID();
    const goal2Id = randomUUID();
    const goal3Id = randomUUID();
    const goal4Id = randomUUID();
    const goal5Id = randomUUID();
    const goal6Id = randomUUID();

    const sampleGoals = [
      // Goals for Math group (3 goals)
      {
        group_id: 'group1.id', // Will be replaced with actual group ID
        title: 'Vysvětlí rozdíl mezi lineární a kvadratickou rovnicí',
        description: 'Student dokáže vysvětlit hlavní rozdíly mezi lineární a kvadratickou rovnicí',
        goal_type: 'boolean',
        target_value: 1,
        order_index: 1,
      },
      {
        group_id: 'group1.id',
        title: 'Vyřeší 3 kvadratické rovnice',
        description: 'Student samostatně vyřeší 3 kvadratické rovnice pomocí diskriminantu',
        goal_type: 'percentage',
        target_value: 3,
        order_index: 2,
      },
      {
        group_id: 'group1.id',
        title: 'Určí počet řešení podle diskriminantu',
        description: 'Student dokáže na základě diskriminantu určit počet řešení rovnice',
        goal_type: 'boolean',
        target_value: 1,
        order_index: 3,
      },
      // Goals for Physics group (2 goals)
      {
        group_id: 'group2.id',
        title: 'Popíše první Newtonův zákon',
        description: 'Student vysvětlí princip setrvačnosti a první Newtonův zákon pohybu',
        goal_type: 'boolean',
        target_value: 1,
        order_index: 1,
      },
      {
        group_id: 'group2.id',
        title: 'Vyřeší kinematické úlohy',
        description: 'Student vyřeší 2 úlohy s rovnoměrně zrychleným pohybem',
        goal_type: 'percentage',
        target_value: 2,
        order_index: 2,
      },
      // Goal for Chemistry group (1 goal)
      {
        group_id: 'group3.id',
        title: 'Rozpozná anorganické sloučeniny',
        description: 'Student pojmenuje 5 základních anorganických sloučenin podle vzorce',
        goal_type: 'percentage',
        target_value: 5,
        order_index: 1,
      },
    ];

    console.log('🎯 Creating sample goals...');
    // Uncomment when you have real group IDs:
    /*
    // Replace placeholder IDs with actual group IDs
    const goalsWithRealIds = [
      ...sampleGoals.slice(0, 3).map(goal => ({ ...goal, group_id: group1.id })),
      ...sampleGoals.slice(3, 5).map(goal => ({ ...goal, group_id: group2.id })),
      ...sampleGoals.slice(5, 6).map(goal => ({ ...goal, group_id: group3.id })),
    ];
    
    const { data: createdGoals, error: goalError } = await supabase.from('goals').insert(goalsWithRealIds).select();
    if (goalError) {
      console.error('Goal insert error:', goalError);
      return;
    }
    */

    // Create sample participants (simulate joined via QR code)
    const participant1Id = randomUUID();
    const participant2Id = randomUUID();
    const participant3Id = randomUUID();
    const participant4Id = randomUUID();
    const participant5Id = randomUUID();
    const participant6Id = randomUUID();
    
    const sampleParticipants = [
      // Math group participants
      {
        id: participant1Id,
        groupId: group1Id,
        deviceId: `device_${randomUUID().substring(0, 12).toLowerCase()}`,
        nickname: 'Honza Novák',
      },
      {
        id: participant2Id,
        groupId: group1Id,
        deviceId: `device_${randomUUID().substring(0, 12).toLowerCase()}`,
        nickname: 'Petra Svobodová',
      },
      {
        id: participant3Id,
        groupId: group1Id,
        deviceId: `device_${randomUUID().substring(0, 12).toLowerCase()}`,
        nickname: 'Martin Dvořák',
      },
      // Physics group participants
      {
        id: participant4Id,
        groupId: group2Id,
        deviceId: `device_${randomUUID().substring(0, 12).toLowerCase()}`,
        nickname: 'Anna Veselá',
      },
      {
        id: participant5Id,
        groupId: group2Id,
        deviceId: `device_${randomUUID().substring(0, 12).toLowerCase()}`,
        nickname: 'Tomáš Procházka',
      },
      // Chemistry group participants
      {
        id: participant6Id,
        groupId: group3Id,
        deviceId: `device_${randomUUID().substring(0, 12).toLowerCase()}`,
        nickname: 'Klára Horváthová',
      },
    ];

    console.log('👥 Creating sample participants...');
    // Uncomment when you have real group IDs:
    /*
    await db.insert(groupParticipants).values(sampleParticipants);
    */

    // Create sample goal progress (various completion levels)
    const sampleGoalProgress = [
      // Math group - Honza (completed 2/3 goals)
      { id: randomUUID(), participantId: participant1Id, goalId: goal1Id, currentValue: 1, isCompleted: true },
      { id: randomUUID(), participantId: participant1Id, goalId: goal2Id, currentValue: 2, isCompleted: false },
      { id: randomUUID(), participantId: participant1Id, goalId: goal3Id, currentValue: 1, isCompleted: true },
      
      // Math group - Petra (completed 1/3 goals)
      { id: randomUUID(), participantId: participant2Id, goalId: goal1Id, currentValue: 1, isCompleted: true },
      { id: randomUUID(), participantId: participant2Id, goalId: goal2Id, currentValue: 1, isCompleted: false },
      { id: randomUUID(), participantId: participant2Id, goalId: goal3Id, currentValue: 0, isCompleted: false },
      
      // Math group - Martin (just started)
      { id: randomUUID(), participantId: participant3Id, goalId: goal1Id, currentValue: 0, isCompleted: false },
      { id: randomUUID(), participantId: participant3Id, goalId: goal2Id, currentValue: 0, isCompleted: false },
      { id: randomUUID(), participantId: participant3Id, goalId: goal3Id, currentValue: 0, isCompleted: false },
      
      // Physics group - Anna (completed all goals)
      { id: randomUUID(), participantId: participant4Id, goalId: goal4Id, currentValue: 1, isCompleted: true },
      { id: randomUUID(), participantId: participant4Id, goalId: goal5Id, currentValue: 2, isCompleted: true },
      
      // Physics group - Tomáš (completed 1/2 goals)
      { id: randomUUID(), participantId: participant5Id, goalId: goal4Id, currentValue: 1, isCompleted: true },
      { id: randomUUID(), participantId: participant5Id, goalId: goal5Id, currentValue: 1, isCompleted: false },
      
      // Chemistry group - Klára (partially completed)
      { id: randomUUID(), participantId: participant6Id, goalId: goal6Id, currentValue: 3, isCompleted: false },
    ];

    console.log('📊 Creating sample goal progress...');
    // Uncomment when you have real participant and goal IDs:
    /*
    await db.insert(goalProgress).values(sampleGoalProgress);
    */

    // Create sample system messages
    const sampleMessages = [
      {
        id: randomUUID(),
        groupId: group1Id,
        participantId: null, // System message
        content: 'Vítejte ve skupině "Matematika 2A - Kvadratické rovnice"! Student vyřeší samostatně 3 různé kvadratické rovnice typu ax² + bx + c pomocí diskriminantu',
        isSystemMessage: true,
        isGoalRelevant: false,
      },
      {
        id: randomUUID(),
        groupId: group2Id,
        participantId: null, // System message
        content: 'Vítejte ve skupině "Fyzika 3B - Mechanika"! Student aplikuje Newtonovy zákony na praktické úlohy',
        isSystemMessage: true,
        isGoalRelevant: false,
      },
      {
        id: randomUUID(),
        groupId: group3Id,
        participantId: null, // System message
        content: 'Vítejte ve skupině "Chemie 1A - Anorganická chemie"! Student rozpozná základní anorganické sloučeniny',
        isSystemMessage: true,
        isGoalRelevant: false,
      },
      {
        id: randomUUID(),
        groupId: group1Id,
        participantId: participant1Id,
        content: 'Ahoj, jsem tu nový. Můžu začít s těmi rovnicemi?',
        isSystemMessage: false,
        isGoalRelevant: false,
      },
      {
        id: randomUUID(),
        groupId: group1Id,
        participantId: participant1Id,
        content: 'Lineární rovnice má tvar ax + b = 0, kvadratická má ax² + bx + c = 0. Hlavní rozdíl je v nejvyšší mocnině.',
        isSystemMessage: false,
        isGoalRelevant: true,
      },
    ];

    console.log('💬 Creating sample messages...');
    // Uncomment when you have real group and participant IDs:
    /*
    await db.insert(messages).values(sampleMessages);
    */

    console.log('✅ Database seeding completed!');
    console.log('');
    console.log('📊 Sample data overview:');
    console.log('- 3 groups with different subjects');
    console.log('- 6 goals total (3 for Math, 2 for Physics, 1 for Chemistry)');
    console.log('- 6 student participants across all groups');
    console.log('- Various progress levels to test teacher dashboard');
    console.log('');
    console.log('🔧 To activate the seed data:');
    console.log('1. Create a teacher account via Google OAuth in your app');
    console.log('2. Get the user ID from Supabase Auth dashboard');
    console.log('3. Update the teacherId variable in this script');
    console.log('4. Uncomment the database insert statements');
    console.log('5. Run the seed script again: npm run db:seed');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
