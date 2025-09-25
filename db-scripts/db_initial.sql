-- ALTERNATIVE: Simplified version for maximum Supabase compatibility
-- This version removes some complex RLS policies and relies more on application logic

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('teacher', 'student');
CREATE TYPE goal_type AS ENUM ('boolean', 'percentage');
CREATE TYPE help_request_status AS ENUM ('pending', 'resolved');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role user_role NOT NULL DEFAULT 'teacher',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Groups table
CREATE TABLE public.groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    teacher_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    qr_code_token TEXT NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Goals table
CREATE TABLE public.goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    goal_type goal_type NOT NULL,
    target_value INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group participants
CREATE TABLE public.group_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    nickname TEXT NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    
    UNIQUE(group_id, device_id)
);

-- Goal progress
CREATE TABLE public.goal_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id UUID NOT NULL REFERENCES public.group_participants(id) ON DELETE CASCADE,
    goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
    current_value INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(participant_id, goal_id)
);

-- Messages table
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES public.group_participants(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_system_message BOOLEAN DEFAULT false,
    is_goal_relevant BOOLEAN DEFAULT false,
    ai_analysis JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Help requests
CREATE TABLE public.help_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id UUID NOT NULL REFERENCES public.group_participants(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    reason TEXT DEFAULT 'inactive',
    status help_request_status DEFAULT 'pending',
    resolved_by UUID REFERENCES public.users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity warnings
CREATE TABLE public.activity_warnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id UUID NOT NULL REFERENCES public.group_participants(id) ON DELETE CASCADE,
    warning_type TEXT NOT NULL,
    message_id UUID REFERENCES public.messages(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_groups_teacher_id ON public.groups(teacher_id);
CREATE INDEX idx_groups_qr_token ON public.groups(qr_code_token);
CREATE INDEX idx_goals_group_id ON public.goals(group_id);
CREATE INDEX idx_group_participants_group_id ON public.group_participants(group_id);
CREATE INDEX idx_group_participants_device_id ON public.group_participants(device_id);
CREATE INDEX idx_goal_progress_participant_id ON public.goal_progress(participant_id);
CREATE INDEX idx_goal_progress_goal_id ON public.goal_progress(goal_id);
CREATE INDEX idx_messages_group_id ON public.messages(group_id);
CREATE INDEX idx_messages_participant_id ON public.messages(participant_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);
CREATE INDEX idx_help_requests_group_id ON public.help_requests(group_id);
CREATE INDEX idx_help_requests_status ON public.help_requests(status);

-- Simple RLS policies (you can disable RLS entirely if you handle security in app)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.help_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_warnings ENABLE ROW LEVEL SECURITY;

-- Basic policies - handle complex logic in your Nuxt app
CREATE POLICY "Enable read access for authenticated users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Enable insert access for authenticated users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for users based on user_id" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable all access for authenticated users" ON public.groups FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.goals FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.group_participants FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.goal_progress FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.messages FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.help_requests FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.activity_warnings FOR ALL USING (true);

-- Functions and Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groups_updated_at 
    BEFORE UPDATE ON public.groups 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goal_progress_updated_at 
    BEFORE UPDATE ON public.goal_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to initialize goal progress for new participants
CREATE OR REPLACE FUNCTION initialize_goal_progress()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.goal_progress (participant_id, goal_id, current_value)
    SELECT NEW.id, goals.id, 0
    FROM public.goals
    WHERE goals.group_id = NEW.group_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_initialize_goal_progress
    AFTER INSERT ON public.group_participants
    FOR EACH ROW EXECUTE FUNCTION initialize_goal_progress();

-- Function to update goal completion
CREATE OR REPLACE FUNCTION update_goal_completion()
RETURNS TRIGGER AS $$
DECLARE
    goal_rec RECORD;
BEGIN
    SELECT goal_type, target_value INTO goal_rec
    FROM public.goals 
    WHERE id = NEW.goal_id;
    
    NEW.is_completed = CASE 
        WHEN goal_rec.goal_type = 'boolean' THEN NEW.current_value >= 1
        WHEN goal_rec.goal_type = 'percentage' THEN NEW.current_value >= goal_rec.target_value
        ELSE false
    END;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_goal_completion
    BEFORE INSERT OR UPDATE OF current_value ON public.goal_progress
    FOR EACH ROW EXECUTE FUNCTION update_goal_completion();

-- Function to update participant activity
CREATE OR REPLACE FUNCTION update_participant_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.participant_id IS NOT NULL THEN
        UPDATE public.group_participants 
        SET last_activity = NOW()
        WHERE id = NEW.participant_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_participant_activity
    AFTER INSERT ON public.messages
    FOR EACH ROW EXECUTE FUNCTION update_participant_activity();