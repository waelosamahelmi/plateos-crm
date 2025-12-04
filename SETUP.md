# PlateOS Setup Guide

## Overview
This guide will help you set up the PlateOS CRM system with all its features including AI chat, contact forms, registration system, and admin portal.

## Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier works)
- OpenRouter API key (free tier available)

## Step 1: Install Dependencies

```bash
cd plateos-demo
npm install
```

## Step 2: Configure Supabase

1. Create a free account at [Supabase](https://supabase.com)
2. Create a new project
3. Go to Settings → API to get your:
   - Project URL (VITE_SUPABASE_URL)
   - Anon/Public key (VITE_SUPABASE_ANON_KEY)

4. Run the database migration:
   - Go to SQL Editor in Supabase
   - Copy the contents of `/migrations/plateos_crm_schema.sql`
   - Paste and run the SQL

This creates the following tables:
- `chat_sessions` - Stores AI chat conversations
- `chat_messages` - Individual messages in chats
- `contact_submissions` - Contact form submissions
- `restaurant_registrations` - Restaurant onboarding data

## Step 3: Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update `.env` with your credentials:

```env
# OpenRouter API (for AI chat)
VITE_OPENROUTER_API_KEY=sk-or-v1-your-key-here

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Email (Hostinger SMTP)
VITE_EMAIL_PASSWORD=Weezy@1996
```

## Step 4: Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Features & Routes

### Public Pages
- `/` - Landing page with restaurant logos and AI chat widget
- `/contact` - Contact form (general inquiries, support, complaints)
- `/register` - Restaurant registration form (4-step process)
- `/demo` - Interactive demo of the restaurant system

### Admin Portal
- `/portal` - Admin dashboard (password: PlateOS2024!)
  - View all chat sessions and messages
  - Manage contact form submissions
  - Review restaurant registrations
  - Generate CLAUDE.md migration files with AI

## Key Features Implemented

### 1. AI Chat Widget
- Floating chat bubble on all pages
- Saves conversations to Supabase
- Can collect registration information during conversation
- Uses OpenRouter with Llama 3.3 70B model

### 2. Contact System
- Three types: Contact, Support, Complaint
- Saves to database
- Email configured for info@plateos.fi

### 3. Registration System
- 4-step form for restaurant onboarding
- Collects: business info, contact details, location, menu description
- AI can also collect this data via chat

### 4. Admin Portal
Features:
- Real-time dashboard with statistics
- View and manage all chat sessions
- Review contact submissions
- Process restaurant registrations
- AI-powered CLAUDE.md generator for migrations
- Change registration status (new → reviewing → approved → completed)

### 5. Restaurant Client Logos
The landing page now displays real client restaurants:
- **Ravintola Babylon** (ravintolababylon.fi)
- **Pizzeria Antonio** (pizzeriaantonio.fi)
- **Tirvan Kahvila** (tirvankahvila.fi)

## Database Schema

### chat_sessions
- Tracks each visitor's chat session
- Links to chat_messages
- Status: active, closed, converted

### chat_messages
- Individual messages in conversations
- Role: user, assistant, system
- Linked to session

### contact_submissions
- Form submissions from /contact page
- Type: contact, complaint, support
- Status tracking for follow-up

### restaurant_registrations
- Complete restaurant onboarding data
- Status workflow: new → reviewing → approved → completed
- Stores AI-generated CLAUDE.md for migration

## AI CLAUDE.md Generator

The admin portal includes an AI-powered migration guide generator:

1. Open a registration in the portal
2. Click "Generoi" (Generate) in the CLAUDE.md section
3. AI analyzes the restaurant data and creates a comprehensive migration guide
4. The guide includes:
   - Project overview
   - Branding guidelines
   - Database schema changes
   - Menu structure
   - Feature toggles
   - Styling modifications
   - Testing checklist

This CLAUDE.md file can be used as context for migrating babylon-web and babylon-app to create a custom restaurant system.

## Email Configuration

Email is configured to use Hostinger SMTP:
- **Host**: smtp.hostinger.com
- **Port**: 465 (SSL)
- **From**: noreply@plateos.fi
- **Reply-To**: info@plateos.fi
- **Password**: Stored in VITE_EMAIL_PASSWORD env variable

Note: For production, implement proper email sending via Supabase Edge Functions or a backend service.

## Admin Portal Access

Default password: `PlateOS2024!`

For production, implement proper authentication using Supabase Auth.

## Building for Production

```bash
npm run build
```

The build output will be in the `dist` folder, ready for deployment.

## Deployment Checklist

- [ ] Set up production Supabase project
- [ ] Run database migrations
- [ ] Configure environment variables on hosting platform
- [ ] Set up proper authentication for admin portal
- [ ] Configure email service (recommended: Supabase Edge Functions)
- [ ] Update CORS settings for OpenRouter API
- [ ] Add SSL certificate
- [ ] Set up monitoring and error tracking

## Support

For issues or questions:
- Email: info@plateos.fi
- Check the admin portal at `/portal` for all submissions

## Next Steps

The system is now ready to:
1. Collect leads via AI chat
2. Accept restaurant registrations
3. Manage customer inquiries
4. Generate migration guides for new clients
5. Track conversion funnel

All data is stored in Supabase and accessible via the admin portal.
