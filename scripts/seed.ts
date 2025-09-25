import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { 
  users, 
  groups, 
  goals, 
  groupParticipants, 
  goalProgress, 
  messages 
} from '../app/lib/database/schema';
import { createId } from '@paralleldrive/cuid2';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql);

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
    await db.insert(users).values({
      id: teacherId,
      email: 'teacher@example.com',
      fullName: 'Jan Novák',
      role: 'teacher',
    }).onConflictDoNothing();
    */

    // Create sample groups
    const group1Id = createId();
    const group2Id = createId();
    
    const sampleGroups = [
      {
        id: group1Id,
        name: 'Matematika 2A - Kvadratické rovnice',
        description: 'Student vyřeší samostatně 3 různé kvadratické rovnice typu ax² + bx + c pomocí diskriminantu',
        teacherId: teacherId,
        qrCodeToken: `group_${createId().substring(0, 8).toLowerCase()}`,
      },
      {
        id: group2Id,
        name: 'Fyzika 3B - Mechanika',
        description: 'Student aplikuje Newtonovy zákony na praktické úlohy s kinematickými a dynamickými problémy',
        teacherId: teacherId,
        qrCodeToken: `group_${createId().substring(0, 8).toLowerCase()}`,
      },
      {
        id: createId(),
        name: 'Chemie 1A - Anorganická chemie',
        description: 'Student rozpozná a pojmenuje základní anorganické sloučeniny podle jejich struktury a vlastností',
        teacherId: teacherId,
        qrCodeToken: `group_${createId().substring(0, 8).toLowerCase()}`,
      },
      {
        id: createId(),
        name: 'Matematika 3A - Integrály',
        description: 'Student spočítá základní integrály a aplikuje je na výpočet obsahu a objemu',
        teacherId: teacherId,
        qrCodeToken: `group_${createId().substring(0, 8).toLowerCase()}`,
      },
      {
        id: createId(),
        name: 'Fyzika 2B - Elektromagnetismus',
        description: 'Student analyzuje elektromagnetické jevy a aplikuje Maxwellovy rovnice',
        teacherId: teacherId,
        qrCodeToken: `group_${createId().substring(0, 8).toLowerCase()}`,
      },
    ];

    console.log('📁 Creating sample groups...');
    // Uncomment when you have a real teacher ID:
    /*
    await db.insert(groups).values(sampleGroups);
    */

    // Create sample goals for the first group
    const goalsGroup1 = [
      {
        id: createId(),
        groupId: group1Id,
        title: 'Vysvětlí rozdíl mezi lineární a kvadratickou rovnicí',
        description: 'Student dokáže vysvětlit hlavní rozdíly mezi lineární a kvadratickou rovnicí',
        goalType: 'boolean' as const,
        targetValue: 1,
        orderIndex: 1,
      },
      {
        id: createId(),
        groupId: group1Id,
        title: 'Vyřeší 3 kvadratické rovnice',
        description: 'Student samostatně vyřeší 3 kvadratické rovnice pomocí diskriminantu',
        goalType: 'percentage' as const,
        targetValue: 3,
        orderIndex: 2,
      },
      {
        id: createId(),
        groupId: group1Id,
        title: 'Určí počet řešení podle diskriminantu',
        description: 'Student dokáže na základě diskriminantu určit počet řešení rovnice',
        goalType: 'boolean' as const,
        targetValue: 1,
        orderIndex: 3,
      },
    ];

    // Create sample goals for the second group
    const goalsGroup2 = [
      {
        id: createId(),
        groupId: group2Id,
        title: 'Definuje lineární funkci',
        description: 'Student dokáže správně definovat lineární funkci',
        goalType: 'boolean' as const,
        targetValue: 1,
        orderIndex: 1,
      },
      {
        id: createId(),
        groupId: group2Id,
        title: 'Nakreslí 2 grafy lineárních funkcí',
        description: 'Student nakreslí grafy dvou různých lineárních funkcí',
        goalType: 'percentage' as const,
        targetValue: 2,
        orderIndex: 2,
      },
    ];

    console.log('🎯 Creating sample goals...');
    // Uncomment when you have real group IDs:
    /*
    await db.insert(goals).values([...goalsGroup1, ...goalsGroup2]);
    */

    // Create sample participants (simulate joined via QR code)
    const participant1Id = createId();
    const participant2Id = createId();
    
    const sampleParticipants = [
      {
        id: participant1Id,
        groupId: group1Id,
        deviceId: `device_${createId().substring(0, 12).toLowerCase()}`,
        nickname: 'Honza Novák',
      },
      {
        id: participant2Id,
        groupId: group1Id,
        deviceId: `device_${createId().substring(0, 12).toLowerCase()}`,
        nickname: 'Petra Svobodová',
      },
    ];

    console.log('👥 Creating sample participants...');
    // Uncomment when you have real group IDs:
    /*
    await db.insert(groupParticipants).values(sampleParticipants);
    */

    // Create sample system messages
    const sampleMessages = [
      {
        id: createId(),
        groupId: group1Id,
        participantId: null, // System message
        content: 'Vítejte ve skupině "A2 - kvadratické rovnice 1"! Student vyřeší samostatně 3 různé kvadratické rovnice typu ax² + bx + c pomocí diskriminantu',
        isSystemMessage: true,
        isGoalRelevant: false,
      },
      {
        id: createId(),
        groupId: group2Id,
        participantId: null, // System message
        content: 'Vítejte ve skupině "B1 - lineární funkce"! Student prokáže porozumění lineárním funkcím a jejich grafům',
        isSystemMessage: true,
        isGoalRelevant: false,
      },
      {
        id: createId(),
        groupId: group1Id,
        participantId: participant1Id,
        content: 'Ahoj, jsem tu nový. Můžu začít s těmi rovnicemi?',
        isSystemMessage: false,
        isGoalRelevant: false,
      },
      {
        id: createId(),
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
    console.log('🔧 To activate the seed data:');
    console.log('1. Create a teacher account via Google OAuth in your app');
    console.log('2. Get the user ID from Supabase Auth dashboard');
    console.log('3. Update the teacherId variable in this script');
    console.log('4. Uncomment the database insert statements');
    console.log('5. Run the seed script again: npm run db:seed');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

seed();