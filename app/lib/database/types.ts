import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { 
  users, 
  groups,
  goals,
  groupParticipants,
  goalProgress,
  messages,
  helpRequests,
  activityWarnings
} from './schema';

// User types
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// Group types
export type Group = InferSelectModel<typeof groups>;
export type NewGroup = InferInsertModel<typeof groups>;

// Goal types
export type Goal = InferSelectModel<typeof goals>;
export type NewGoal = InferInsertModel<typeof goals>;

// Group participant types
export type GroupParticipant = InferSelectModel<typeof groupParticipants>;
export type NewGroupParticipant = InferInsertModel<typeof groupParticipants>;

// Goal progress types
export type GoalProgress = InferSelectModel<typeof goalProgress>;
export type NewGoalProgress = InferInsertModel<typeof goalProgress>;

// Message types
export type Message = InferSelectModel<typeof messages>;
export type NewMessage = InferInsertModel<typeof messages>;

// Help request types
export type HelpRequest = InferSelectModel<typeof helpRequests>;
export type NewHelpRequest = InferInsertModel<typeof helpRequests>;

// Activity warning types
export type ActivityWarning = InferSelectModel<typeof activityWarnings>;
export type NewActivityWarning = InferInsertModel<typeof activityWarnings>;

// Combined types with relations
export type GroupWithDetails = Group & {
  teacher: User;
  goals: Goal[];
  participants: GroupParticipant[];
  _count?: {
    participants: number;
    goals: number;
    messages: number;
  };
};

export type ParticipantWithProgress = GroupParticipant & {
  progress: (GoalProgress & { goal: Goal })[];
  group: Group;
};

export type GoalWithProgress = Goal & {
  progress: (GoalProgress & { participant: GroupParticipant })[];
};

export type MessageWithAuthor = Message & {
  participant?: GroupParticipant;
  group: Group;
};

// Auth user type (from Supabase)
export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

// Role-based types
export type UserRole = 'student' | 'teacher' | 'admin';
export type Role = UserRole; // Alias for backward compatibility
export type GoalType = 'boolean' | 'percentage';
export type HelpRequestStatus = 'pending' | 'resolved';

// Extended user type with relations for backward compatibility
export type UserWithProfile = User;

// Auth state
export interface AuthState {
  user: User | null;
  session: any | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// QR Code join data
export interface QRJoinData {
  groupId: string;
  qrToken: string;
  groupName: string;
  description: string;
}

// Group statistics
export interface GroupStats {
  totalParticipants: number;
  activeParticipants: number;
  completedGoals: number;
  totalGoals: number;
  averageProgress: number;
  totalMessages: number;
  pendingHelpRequests: number;
}

// Participant activity data
export interface ParticipantActivity {
  participant: GroupParticipant;
  lastMessage?: Date;
  messagesCount: number;
  goalsCompleted: number;
  totalGoals: number;
  progressPercentage: number;
  warningCount: number;
  needsHelp: boolean;
}