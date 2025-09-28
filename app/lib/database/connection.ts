import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get Supabase configuration from environment
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase: SupabaseClient | null = null;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY environment variables are not set. Database features will be disabled.');
  console.warn('Available Supabase environment variables:', Object.keys(process.env).filter(key => key.startsWith('SUPABASE')));
} else {
  try {
    console.log('Initializing Supabase client...');
    
    // Create Supabase client with service role key
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('✅ Supabase client initialized successfully');
    
    // Test the connection by trying to query the users table
    supabase
      .from('users')
      .select('count')
      .limit(0)
      .then(({ error }) => {
        if (error) {
          console.error('❌ Supabase connection test failed:', error.message);
          console.error('This could mean:');
          console.error('1. Tables don\'t exist yet - you may need to run migrations');
          console.error('2. Service role key lacks permissions');
          console.error('3. RLS policies are blocking access');
        } else {
          console.log('✅ Supabase database connection test successful');
        }
      });

  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', error);
    console.error('Make sure your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are correct');
    supabase = null;
  }
}

// Helper functions for database operations
export const db = {
  // Users operations
  users: {
    async create(userData: any) {
      if (!supabase) throw new Error('Database not available');
      return supabase.from('users').insert(userData).select().single();
    },
    async findById(id: string) {
      if (!supabase) throw new Error('Database not available');
      return supabase.from('users').select('*').eq('id', id).maybeSingle();
    },
    async findByEmail(email: string) {
      if (!supabase) throw new Error('Database not available');
      return supabase.from('users').select('*').eq('email', email).maybeSingle();
    },
    async update(id: string, updates: any) {
      if (!supabase) throw new Error('Database not available');
      return supabase.from('users').update(updates).eq('id', id).select().single();
    }
  },

  // Groups operations
  groups: {
    async create(groupData: any) {
      if (!supabase) throw new Error('Database not available');
      const { id, created_by, ...dataToInsert } = groupData;
      // Map created_by to teacher_id to match schema
      const insertData = {
        ...dataToInsert,
        teacher_id: created_by
      };
      return supabase.from('groups').insert(insertData).select().single();
    },
    async findAll() {
      if (!supabase) throw new Error('Database not available');
      return supabase
        .from('groups')
        .select(`
          *,
          teacher:users(id, email, full_name)
        `)
        .eq('is_active', true)
        .order('updated_at', { ascending: false });
    },
    async findById(id: string) {
      if (!supabase) throw new Error('Database not available');
      return supabase
        .from('groups')
        .select(`
          *,
          teacher:users(id, email, full_name)
        `)
        .eq('id', id)
        .maybeSingle();
    },
    async findByTeacher(teacherId: string) {
      if (!supabase) throw new Error('Database not available');
      return supabase
        .from('groups')
        .select(`
          *,
          teacher:users(id, email, full_name)
        `)
        .eq('teacher_id', teacherId)
        .eq('is_active', true)
        .order('updated_at', { ascending: false });
    },
    async delete(id: string) {
      if (!supabase) throw new Error('Database not available');
      return supabase
        .from('groups')
        .delete()
        .eq('id', id);
    }
  },

  // Group participants operations
  participants: {
    async create(participantData: any) {
      if (!supabase) throw new Error('Database not available');
      return supabase.from('group_participants').insert(participantData).select().single();
    },
    async findByGroupAndDevice(groupId: string, deviceId: string) {
      if (!supabase) throw new Error('Database not available');
      return supabase
        .from('group_participants')
        .select('*')
        .eq('group_id', groupId)
        .eq('device_id', deviceId)
        .maybeSingle();
    }
  }
};

export { supabase };
export const sql = null; // Not needed with Supabase client