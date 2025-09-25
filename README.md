# EduPlatform - Google OAuth Authentication System

A comprehensive Nuxt.js application with Google OAuth authentication, role-based access control (RBAC), and PostgreSQL database integration using Supabase and Drizzle ORM.

## Features

- ✅ Google OAuth Authentication via Supabase
- ✅ Role-based Access Control (Student, Teacher, Admin)
- ✅ PostgreSQL Database with Drizzle ORM
- ✅ User Profile Management
- ✅ Route Protection Middleware
- ✅ Responsive UI with Tailwind CSS
- ✅ Modern Vue 3 Composition API
- ✅ TypeScript Support

## Tech Stack

- **Frontend**: Nuxt 4, Vue 3, TypeScript, Tailwind CSS
- **Authentication**: Supabase Auth (Google OAuth)
- **Database**: PostgreSQL, Supabase, Drizzle ORM
- **Styling**: Tailwind CSS v4
- **Icons**: Heroicons

## Setup Instructions

### 1. Environment Configuration

Update your `.env` file with Supabase credentials:

```env
# Database URL for Drizzle ORM
DATABASE_URL="postgres://username:password@ip:port/postgres"

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and API keys from the project settings
3. Enable Google OAuth in Authentication > Providers
4. Add your domain to the authorized redirect URLs

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)
6. Copy the Client ID and Client Secret to Supabase

### 4. Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Available Pages

- `/` - Landing page with feature overview
- `/auth/login` - Login page with Google OAuth
- `/dashboard` - User dashboard (protected)
- `/profile` - User profile management (protected)
- `/teacher/classes` - Teacher class management (teacher only)
- `/student/groups` - Student groups view (student only)

## Authentication Flow

1. User clicks "Continue with Google" on the login page
2. Redirected to Google OAuth consent screen  
3. After approval, redirected to `/auth/callback`
4. User profile is created/updated in the database
5. User is redirected to the dashboard

## Role-Based Access Control

The application supports three roles:

- **Student**: Can view groups, submit assignments, track progress
- **Teacher**: Can create classes, manage students, grade assignments  
- **Admin**: Full system access, user management

Routes are protected using Nuxt middleware based on user roles.

## Project Structure

```
app/
├── components/          # Vue components
│   ├── auth/           # Authentication components  
│   └── layout/         # Layout components
├── composables/        # Vue composables
├── lib/database/       # Database schema and types
├── middleware/         # Route protection middleware
├── pages/             # Application pages
└── app.vue           # Root component
```

## Next Steps

1. Set up your Supabase project and Google OAuth
2. Update the environment variables
3. Run the development server
4. Customize the UI and add your business logic
5. Deploy to production

This foundation provides a complete authentication system with role-based access control that you can build upon for your educational platform.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
