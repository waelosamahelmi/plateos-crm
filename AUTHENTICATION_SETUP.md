# Authentication Setup Guide

## Overview
The PlateOS system now has proper authentication with credentials stored in Supabase.

## Changes Made

### 1. Database Schema Updates
Added `admin_credentials` table to store admin login information:
- Email (unique)
- Password hash (bcrypt)
- Full name
- Role (admin/superadmin)
- Active status
- Last login timestamp

### 2. Chat Message Saving Fixed
- Added proper error handling and logging for chat messages
- Ensures session is created before allowing messages to be sent
- Added console logging to debug message saving issues

### 3. Authentication Functions
Added to `src/lib/supabase.ts`:
- `loginAdmin(email, password)` - Authenticates admin users against database
- `createAdminUser(email, password, fullName)` - Creates new admin users with hashed passwords

### 4. Updated Login Page
- Now uses Supabase authentication instead of hardcoded credentials
- Stores user session in localStorage
- Proper error handling

## Setup Instructions

### Step 1: Run SQL Migration
Run the updated `migrations/plateos_crm_schema.sql` in your Supabase SQL editor. This will:
1. Create the `admin_credentials` table
2. Add necessary indexes and RLS policies
3. Insert default admin user

### Step 2: Default Admin Credentials
After running the migration, you can login with:
- **Email**: `admin@plateos.com`
- **Password**: `admin`

**IMPORTANT**: Change this password immediately after first login!

### Step 3: Test Chat Message Saving
1. Open the chat widget on the landing page
2. Send a message
3. Check browser console for "Message saved successfully" logs
4. Verify messages appear in Supabase `chat_messages` table

## Troubleshooting

### Chat Messages Not Saving
Check browser console for:
- "No session ID available" - Session creation failed
- "Cannot save message: No session ID" - Try refreshing the page
- "Error saving chat message" - Check Supabase RLS policies

### Login Issues
- Verify Supabase URL and anon key in `.env`
- Check that SQL migration ran successfully
- Ensure `bcryptjs` package is installed: `npm list bcryptjs`

## Security Notes

### Password Hashing
- Uses bcrypt with 10 salt rounds
- Passwords are never stored in plain text
- Password comparison happens securely with bcrypt.compare()

### Row Level Security (RLS)
- Admin credentials only accessible to authenticated users
- Chat messages can be inserted anonymously (public chat)
- Only authenticated admins can read chat history

### Session Management
- User session stored in localStorage
- Include session validation in protected routes
- Clear localStorage on logout

## Creating Additional Admin Users

Use the Supabase SQL editor:

```sql
-- Create new admin user
SELECT * FROM create_admin_user(
  'newemail@plateos.com',
  'secure_password_here',
  'Admin Full Name'
);
```

Or use the `createAdminUser()` function in your code:

```typescript
import { createAdminUser } from '@/lib/supabase';

await createAdminUser(
  'newemail@plateos.com',
  'secure_password',
  'Admin Name'
);
```

## Next Steps

1. ✅ Run SQL migration in Supabase
2. ✅ Test login with default credentials
3. ✅ Test chat widget message saving
4. 🔲 Change default admin password
5. 🔲 Create additional admin users as needed
6. 🔲 Implement password reset functionality (future)
7. 🔲 Add session expiry/refresh (future)

## Files Modified

- `migrations/plateos_crm_schema.sql` - Added admin_credentials table
- `src/lib/supabase.ts` - Added auth functions
- `src/pages/LoginPage.tsx` - Uses Supabase auth
- `src/components/ai-chat-widget.tsx` - Improved message saving with logging
- `package.json` - Added bcryptjs dependency
