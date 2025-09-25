import { eq, and } from 'drizzle-orm';
import { db, users } from '~/lib/database';
import type { 
  User, 
  NewUser, 
  UserRole 
} from '~/lib/database/types';

export const useDatabase = () => {
  // User operations
  const createUser = async (userData: NewUser): Promise<User> => {
    try {
      const [user] = await db.insert(users).values(userData).returning();
      if (!user) {
        throw new Error('Failed to create user');
      }
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const getUserById = async (userId: string): Promise<User | null> => {
    try {
      const result = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });

      return result || null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  };

  const getUserByEmail = async (email: string): Promise<User | null> => {
    try {
      const result = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      return result || null;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw error;
    }
  };

  const updateUser = async (userId: string, updates: Partial<User>): Promise<User> => {
    try {
      const [user] = await db
        .update(users)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(users.id, userId))
        .returning();
      
      if (!user) {
        throw new Error('User not found or update failed');
      }
      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const updateUserRole = async (userId: string, role: UserRole): Promise<User> => {
    try {
      const [user] = await db
        .update(users)
        .set({ role, updatedAt: new Date() })
        .where(eq(users.id, userId))
        .returning();
      
      if (!user) {
        throw new Error('User not found or role update failed');
      }
      return user;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  };

  // User setup (for new users from OAuth)
  const setupNewUser = async (authUser: any, role: UserRole = 'teacher'): Promise<User> => {
    try {
      // Create main user record
      const newUser = await createUser({
        id: authUser.id,
        email: authUser.email,
        fullName: authUser.user_metadata?.full_name || authUser.email.split('@')[0],
        avatarUrl: authUser.user_metadata?.avatar_url || null,
        role,
      });

      return newUser;
    } catch (error) {
      console.error('Error setting up new user:', error);
      throw error;
    }
  };

  // Check if user exists
  const userExists = async (userId: string): Promise<boolean> => {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });
      
      return !!user;
    } catch (error) {
      console.error('Error checking user existence:', error);
      return false;
    }
  };

  // Get users by role
  const getUsersByRole = async (role: UserRole): Promise<User[]> => {
    try {
      const result = await db.query.users.findMany({
        where: eq(users.role, role),
      });

      return result;
    } catch (error) {
      console.error('Error fetching users by role:', error);
      throw error;
    }
  };

  return {
    // User operations
    createUser,
    getUserById,
    getUserByEmail,
    updateUser,
    updateUserRole,
    userExists,
    getUsersByRole,
    
    // Setup operations
    setupNewUser,
  };
};