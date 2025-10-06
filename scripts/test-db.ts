#!/usr/bin/env tsx

import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from the correct location
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

// Verify .env is loaded
console.log('🔍 Environment check:')
console.log('   Current working directory:', process.cwd())
console.log('   DATABASE_URL exists:', !!process.env.DATABASE_URL)
console.log('   DATABASE_URL preview:', process.env.DATABASE_URL?.substring(0, 30) + '...')

// Import after env is loaded
const { database } = await import('../app/lib/database/drizzle')

async function testDatabaseConnection() {
  console.log('🧪 Testing database connection...')
  console.log('📝 DATABASE_URL:', process.env.DATABASE_URL?.replace(/:([^:@]+)@/, ':****@'))
  
  try {
    // Test basic connection
    const connectionTest = await database.testConnection()
    
    if (connectionTest.success) {
      console.log('✅ Database connection successful!')
      
      // Try a simple query
      console.log('🔍 Testing user operations...')
      const usersResult = await database.users.findByEmail('test@example.com')
      console.log('📊 Users query result:', usersResult.error ? `Error: ${usersResult.error}` : 'Success (user not found is normal)')
      
    } else {
      console.error('❌ Database connection failed:', connectionTest.error)
      process.exit(1)
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error)
    process.exit(1)
  }
  
  console.log('🎉 Database test completed successfully!')
  process.exit(0)
}

// Run the test
testDatabaseConnection().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})