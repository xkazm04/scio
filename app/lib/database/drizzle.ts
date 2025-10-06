import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { eq, and, desc } from 'drizzle-orm'

// Re-export schema for convenience
export * from './schema'

// Database connection configuration
const getDatabaseConfig = () => {
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL environment variable is required.\n' +
      'Please add it to your .env file.\n' +
      'Format: postgresql://username:password@host:port/database'
    )
  }

  // Validate URL format
  try {
    const url = new URL(databaseUrl)
    if (!url.username || !url.password) {
      throw new Error('DATABASE_URL must include username and password')
    }
  } catch (parseError) {
    throw new Error(`Invalid DATABASE_URL format: ${parseError}`)
  }

  return databaseUrl
}

// Create connection
let connectionString: string
let client: postgres.Sql<{}>
let db: ReturnType<typeof drizzle<typeof schema>>

try {
  connectionString = getDatabaseConfig()
  
  // Create postgres client with Supabase-optimized settings
  client = postgres(connectionString, {
    max: 1, // Use single connection for serverless
    idle_timeout: 20,
    connect_timeout: 30, // Increase timeout for better reliability
    ssl: 'prefer', // Use SSL when available
    transform: {
      undefined: null, // Transform undefined to null for Postgres compatibility
    },
    onnotice: () => {}, // Suppress notices for cleaner logs
  })
  
  // Create Drizzle instance with schema and relations
  db = drizzle(client, { 
    schema,
    logger: process.env.NODE_ENV === 'development'
  })
  
  console.log('✅ Database connection initialized successfully')
  
} catch (error) {
  console.error('❌ Failed to initialize database connection:', error)
  throw error
}

// Helper to ensure connection is available
const ensureConnection = () => {
  if (!db) {
    throw new Error('Database connection not available')
  }
  return db
}

// Database operations with proper error handling
export const database = {
  // Test connection
  async testConnection() {
    try {
      const dbInstance = ensureConnection()
      await client`SELECT 1 as test`
      return { success: true, error: null }
    } catch (error: any) {
      console.error('Database connection test failed:', error)
      return { success: false, error: error.message }
    }
  },

  // Users operations
  users: {
    async create(userData: typeof schema.users.$inferInsert) {
      try {
        const dbInstance = ensureConnection()
        const [user] = await dbInstance.insert(schema.users).values(userData).returning()
        return { data: user, error: null }
      } catch (error: any) {
        console.error('Error creating user:', error)
        return { data: null, error: error.message }
      }
    },
    
    async findById(id: string) {
      try {
        const dbInstance = ensureConnection()
        const user = await dbInstance.query.users.findFirst({
          where: eq(schema.users.id, id)
        })
        return { data: user || null, error: null }
      } catch (error: any) {
        console.error('Error finding user by ID:', error)
        return { data: null, error: error.message }
      }
    },
    
    async findByEmail(email: string) {
      try {
        const dbInstance = ensureConnection()
        const user = await dbInstance.query.users.findFirst({
          where: eq(schema.users.email, email)
        })
        return { data: user || null, error: null }
      } catch (error: any) {
        console.error('Error finding user by email:', error)
        return { data: null, error: error.message }
      }
    },
    
    async update(id: string, updates: Partial<typeof schema.users.$inferInsert>) {
      try {
        const dbInstance = ensureConnection()
        const [user] = await dbInstance
          .update(schema.users)
          .set({ ...updates, updatedAt: new Date() })
          .where(eq(schema.users.id, id))
          .returning()
        return { data: user, error: null }
      } catch (error: any) {
        console.error('Error updating user:', error)
        return { data: null, error: error.message }
      }
    }
  },

  // Groups operations
  groups: {
    async create(groupData: typeof schema.groups.$inferInsert) {
      try {
        const dbInstance = ensureConnection()
        const [group] = await dbInstance.insert(schema.groups).values(groupData).returning()
        return { data: group, error: null }
      } catch (error: any) {
        console.error('Error creating group:', error)
        return { data: null, error: error.message }
      }
    },
    
    async findAll() {
      try {
        const dbInstance = ensureConnection()
        const groups = await dbInstance.query.groups.findMany({
          where: eq(schema.groups.isActive, true),
          with: {
            teacher: {
              columns: {
                id: true,
                email: true,
                fullName: true,
              }
            }
          },
          orderBy: desc(schema.groups.updatedAt)
        })
        return { data: groups, error: null }
      } catch (error: any) {
        console.error('Error finding all groups:', error)
        return { data: [], error: error.message }
      }
    },
    
    async findById(id: string) {
      try {
        const dbInstance = ensureConnection()
        const group = await dbInstance.query.groups.findFirst({
          where: eq(schema.groups.id, id),
          with: {
            teacher: {
              columns: {
                id: true,
                email: true,
                fullName: true,
              }
            }
          }
        })
        return { data: group || null, error: null }
      } catch (error: any) {
        console.error('Error finding group by ID:', error)
        return { data: null, error: error.message }
      }
    },
    
    async findByTeacher(teacherId: string) {
      try {
        const dbInstance = ensureConnection()
        const groups = await dbInstance.query.groups.findMany({
          where: and(
            eq(schema.groups.teacherId, teacherId),
            eq(schema.groups.isActive, true)
          ),
          with: {
            teacher: {
              columns: {
                id: true,
                email: true,
                fullName: true,
              }
            }
          },
          orderBy: desc(schema.groups.updatedAt)
        })
        return { data: groups, error: null }
      } catch (error: any) {
        console.error('Error finding groups by teacher:', error)
        return { data: [], error: error.message }
      }
    },
    
    async findByQRToken(qrToken: string) {
      try {
        const dbInstance = ensureConnection()
        const group = await dbInstance.query.groups.findFirst({
          where: eq(schema.groups.qrCodeToken, qrToken),
          with: {
            teacher: {
              columns: {
                id: true,
                email: true,
                fullName: true,
              }
            }
          }
        })
        return { data: group || null, error: null }
      } catch (error: any) {
        console.error('Error finding group by QR token:', error)
        return { data: null, error: error.message }
      }
    },
    
    async delete(id: string) {
      try {
        const dbInstance = ensureConnection()
        await dbInstance.delete(schema.groups).where(eq(schema.groups.id, id))
        return { data: true, error: null }
      } catch (error: any) {
        console.error('Error deleting group:', error)
        return { data: false, error: error.message }
      }
    }
  },

  // Goals operations
  goals: {
    async findByGroup(groupId: string) {
      try {
        const dbInstance = ensureConnection()
        const goals = await dbInstance.query.goals.findMany({
          where: eq(schema.goals.groupId, groupId),
          orderBy: desc(schema.goals.createdAt)
        })
        return { data: goals, error: null }
      } catch (error: any) {
        console.error('Error finding goals by group:', error)
        return { data: [], error: error.message }
      }
    }
  },

  // Participants operations
  participants: {
    async findByGroup(groupId: string) {
      try {
        const dbInstance = ensureConnection()
        const participants = await dbInstance.query.groupParticipants.findMany({
          where: eq(schema.groupParticipants.groupId, groupId),
          orderBy: desc(schema.groupParticipants.joinedAt)
        })
        return { data: participants, error: null }
      } catch (error: any) {
        console.error('Error finding participants by group:', error)
        return { data: [], error: error.message }
      }
    }
  },

  // Help requests operations
  helpRequests: {
    async findUnresolvedByGroup(groupId: string) {
      try {
        const dbInstance = ensureConnection()
        const helpRequests = await dbInstance.query.helpRequests.findMany({
          where: and(
            eq(schema.helpRequests.groupId, groupId),
            eq(schema.helpRequests.status, 'pending')
          ),
          orderBy: desc(schema.helpRequests.createdAt)
        })
        return { data: helpRequests, error: null }
      } catch (error: any) {
        console.error('Error finding unresolved help requests:', error)
        return { data: [], error: error.message }
      }
    }
  },

  // Goal progress operations
  goalProgress: {
    async findByParticipantAndGoal(participantId: string, goalId: string) {
      try {
        const dbInstance = ensureConnection()
        const progress = await dbInstance.query.goalProgress.findFirst({
          where: and(
            eq(schema.goalProgress.participantId, participantId),
            eq(schema.goalProgress.goalId, goalId)
          )
        })
        return { data: progress || null, error: null }
      } catch (error: any) {
        console.error('Error finding goal progress:', error)
        return { data: null, error: error.message }
      }
    }
  }
}

// Export the instances for direct use if needed
export { db, client, connectionString }

// Default export for backwards compatibility
export default database