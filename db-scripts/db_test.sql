-- Sample data for testing (run after setting up authentication)

-- Note: Replace the UUID values below with actual user IDs from your Supabase auth.users table
-- You can get these after creating users through Supabase Auth

-- Sample teacher user (insert after Google OAuth registration)
-- INSERT INTO public.users (id, email, full_name, role) 
-- VALUES ('your-teacher-uuid-here', 'teacher@example.com', 'Jan Novák', 'teacher');

-- Sample groups
INSERT INTO public.groups (id, name, description, teacher_id, qr_code_token) VALUES 
(
    uuid_generate_v4(),
    'A2 - kvadratické rovnice 1', 
    'Student vyřeší samostatně 3 různé kvadratické rovnice typu ax² + bx + c pomocí diskriminantu',
    'your-teacher-uuid-here', -- Replace with actual teacher UUID
    'group_' || lower(substring(uuid_generate_v4()::text from 1 for 8))
),
(
    uuid_generate_v4(),
    'B1 - lineární funkce', 
    'Student prokáže porozumění lineárním funkcím a jejich grafům',
    'your-teacher-uuid-here', -- Replace with actual teacher UUID
    'group_' || lower(substring(uuid_generate_v4()::text from 1 for 8))
);

-- Sample goals for the first group
INSERT INTO public.goals (group_id, title, description, goal_type, target_value, order_index) 
SELECT 
    g.id,
    'Vysvětlí rozdíl mezi lineární a kvadratickou rovnicí',
    'Student dokáže vysvětlit hlavní rozdíly mezi lineární a kvadratickou rovnicí',
    'boolean',
    1,
    1
FROM public.groups g 
WHERE g.name = 'A2 - kvadratické rovnice 1';

INSERT INTO public.goals (group_id, title, description, goal_type, target_value, order_index)
SELECT 
    g.id,
    'Vyřeší 3 kvadratické rovnice',
    'Student samostatně vyřeší 3 kvadratické rovnice pomocí diskriminantu',
    'percentage',
    3,
    2
FROM public.groups g 
WHERE g.name = 'A2 - kvadratické rovnice 1';

INSERT INTO public.goals (group_id, title, description, goal_type, target_value, order_index)
SELECT 
    g.id,
    'Určí počet řešení podle diskriminantu',
    'Student dokáže na základě diskriminantu určit počet řešení rovnice',
    'boolean',
    1,
    3
FROM public.groups g 
WHERE g.name = 'A2 - kvadratické rovnice 1';

-- Sample goals for the second group
INSERT INTO public.goals (group_id, title, description, goal_type, target_value, order_index)
SELECT 
    g.id,
    'Definuje lineární funkci',
    'Student dokáže správně definovat lineární funkci',
    'boolean',
    1,
    1
FROM public.groups g 
WHERE g.name = 'B1 - lineární funkce';

INSERT INTO public.goals (group_id, title, description, goal_type, target_value, order_index)
SELECT 
    g.id,
    'Nakreslí 2 grafy lineárních funkcí',
    'Student nakreslí grafy dvou různých lineárních funkcí',
    'percentage',
    2,
    2
FROM public.groups g 
WHERE g.name = 'B1 - lineární funkce';

-- Sample participants (simulate joined via QR code)
INSERT INTO public.group_participants (group_id, device_id, nickname)
SELECT 
    g.id,
    'device_' || lower(substring(uuid_generate_v4()::text from 1 for 12)),
    'Honza Novák'
FROM public.groups g 
WHERE g.name = 'A2 - kvadratické rovnice 1';

INSERT INTO public.group_participants (group_id, device_id, nickname)
SELECT 
    g.id,
    'device_' || lower(substring(uuid_generate_v4()::text from 1 for 12)),
    'Petra Svobodová'
FROM public.groups g 
WHERE g.name = 'A2 - kvadratické rovnice 1';

-- Sample system welcome messages
INSERT INTO public.messages (group_id, participant_id, content, is_system_message)
SELECT 
    g.id,
    NULL,
    'Vítejte ve skupině "' || g.name || '"! ' || g.description,
    true
FROM public.groups g;

-- Sample student messages
INSERT INTO public.messages (group_id, participant_id, content, is_goal_relevant)
SELECT 
    gp.group_id,
    gp.id,
    'Ahoj, jsem tu nový. Můžu začít s těmi rovnicemi?',
    false
FROM public.group_participants gp 
WHERE gp.nickname = 'Honza Novák';

INSERT INTO public.messages (group_id, participant_id, content, is_goal_relevant)
SELECT 
    gp.group_id,
    gp.id,
    'Lineární rovnice má tvar ax + b = 0, kvadratická má ax² + bx + c = 0. Hlavní rozdíl je v nejvyšší mocnině.',
    true
FROM public.group_participants gp 
WHERE gp.nickname = 'Honza Novák';

-- Update some goal progress based on the messages
UPDATE public.goal_progress 
SET current_value = 1 
WHERE participant_id IN (
    SELECT gp.id 
    FROM public.group_participants gp 
    WHERE gp.nickname = 'Honza Novák'
) AND goal_id IN (
    SELECT g.id 
    FROM public.goals g 
    WHERE g.title = 'Vysvětlí rozdíl mezi lineární a kvadratickou rovnicí'
);