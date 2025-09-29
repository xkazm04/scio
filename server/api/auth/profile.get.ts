// Simple in-memory cache for profile data (5 minute TTL)
const profileCache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Rate limiting per user (prevent spam)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 10000; // 10 seconds
const MAX_REQUESTS_PER_WINDOW = 3;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userRequests = rateLimitMap.get(userId) || [];
  
  // Filter out old requests outside the window
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    console.warn(`⚠️ Rate limit exceeded for user: ${userId}`);
    return false;
  }
  
  // Add current request
  recentRequests.push(now);
  rateLimitMap.set(userId, recentRequests);
  
  return true;
}

export default defineEventHandler(async (event) => {
  try {
    // Get authorization header
    const authHeader = getHeader(event, 'authorization');
    
    if (!authHeader) {
      return {
        exists: false,
        user: null,
        requiresRegistration: true
      };
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token || token.length < 10) {
      return {
        exists: false,
        user: null,
        error: 'Invalid token format'
      };
    }

    // Verify token and get user
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = process.env.SUPABASE_URL!;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
      
      const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
      
      const { data: { user: authUser }, error: authError } = await supabaseClient.auth.getUser(token);
      
      if (authError || !authUser) {
        console.warn('Token validation failed:', authError);
        return {
          exists: false,
          user: null,
          error: 'Invalid or expired token'
        };
      }
      
      const userId = authUser.id;
      
      // Check rate limit
      if (!checkRateLimit(userId)) {
        // Return cached data if available during rate limit
        const cached = profileCache.get(userId);
        if (cached) {
          console.log('⚡ Rate limited - returning cached profile for:', userId);
          return cached.data;
        }
        
        return {
          exists: false,
          user: null,
          error: 'Too many requests, please wait'
        };
      }
      
      // Check cache first
      const cached = profileCache.get(userId);
      const now = Date.now();
      
      if (cached && (now - cached.timestamp) < CACHE_TTL) {
        console.log('⚡ Serving cached profile for user:', userId);
        return cached.data;
      }
      
      console.log('🔍 Profile check API called for user:', userId);
      
      // Fetch from database
      const { db } = await import('~/lib/database/connection');
      
      if (db) {
        const { data: user, error } = await db.users.findById(userId);
        
        if (error) {
          console.warn('❌ Database query error:', error);
          const response = {
            exists: false,
            user: null,
            requiresRegistration: true,
            authUser: {
              id: authUser.id,
              email: authUser.email,
              avatar_url: authUser.user_metadata?.avatar_url
            }
          };
          
          // Cache error response for a short time
          profileCache.set(userId, { data: response, timestamp: now });
          return response;
        } else if (user) {
          console.log('✅ User profile found:', userId);
          console.log('🔑 User role:', user.role);
          
          const response = {
            exists: true,
            user: user,
          };
          
          // Cache successful response
          profileCache.set(userId, { data: response, timestamp: now });
          return response;
        } else {
          console.log('⚠️ User profile not found (new user)');
          const response = {
            exists: false,
            user: null,
            requiresRegistration: true,
            authUser: {
              id: authUser.id,
              email: authUser.email,
              avatar_url: authUser.user_metadata?.avatar_url
            }
          };
          
          // Cache not-found response
          profileCache.set(userId, { data: response, timestamp: now });
          return response;
        }
      }
    } catch (dbError) {
      console.warn('Database check failed:', dbError);
      return {
        exists: false,
        user: null,
        requiresRegistration: true
      };
    }
    
    // Fallback
    return {
      exists: false,
      user: null,
      requiresRegistration: true
    };

  } catch (error: any) {
    console.error('Profile check error:', error);
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Chyba při kontrole profilu',
    });
  }
});

// Clean up old cache entries periodically (every 10 minutes)
if (process.server) {
  setInterval(() => {
    const now = Date.now();
    for (const [userId, cache] of profileCache.entries()) {
      if (now - cache.timestamp > CACHE_TTL) {
        profileCache.delete(userId);
      }
    }
    
    // Clean up rate limit map
    for (const [userId, requests] of rateLimitMap.entries()) {
      const recentRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
      if (recentRequests.length === 0) {
        rateLimitMap.delete(userId);
      } else {
        rateLimitMap.set(userId, recentRequests);
      }
    }
  }, 10 * 60 * 1000);
}