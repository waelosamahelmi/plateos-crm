import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Email configuration
export const EMAIL_CONFIG = {
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: 'noreply@plateos.fi',
    pass: import.meta.env.VITE_EMAIL_PASSWORD || 'Weezy@1996',
  },
  from: 'noreply@plateos.fi',
  replyTo: 'info@plateos.fi',
};

// Database helper functions
export async function saveChatMessage(
  sessionId: string,
  role: 'user' | 'assistant' | 'system',
  content: string,
  metadata?: Record<string, unknown>
) {
  const { data, error } = await (supabase
    .from('chat_messages') as any)
    .insert({
      session_id: sessionId,
      role,
      content,
      metadata,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving chat message:', error);
    return null;
  }

  return data;
}

export async function createChatSession(
  visitorId?: string,
  metadata?: Record<string, unknown>
) {
  const { data, error } = await (supabase
    .from('chat_sessions') as any)
    .insert({
      visitor_id: visitorId,
      metadata,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating chat session:', error);
    return null;
  }

  return data;
}

export async function submitContactForm(formData: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type: 'contact' | 'complaint' | 'support';
}) {
  const { data, error } = await (supabase
    .from('contact_submissions') as any)
    .insert(formData)
    .select()
    .single();

  if (error) {
    console.error('Error submitting contact form:', error);
    return null;
  }

  return data;
}

export async function submitRegistration(formData: {
  restaurant_name: string;
  contact_name: string;
  email: string;
  phone: string;
  website?: string;
  address: string;
  city: string;
  postal_code: string;
  restaurant_type: string;
  current_system?: string;
  menu_description: string;
  menu_items_count?: number;
  has_delivery: boolean;
  has_pickup: boolean;
  has_dine_in: boolean;
  opening_hours?: string;
  special_requirements?: string;
  preferred_colors?: string;
  logo_url?: string;
  budget_range?: string;
  timeline?: string;
  source?: string;
}) {
  const { data, error } = await (supabase
    .from('restaurant_registrations') as any)
    .insert({
      ...formData,
      status: 'new',
    })
    .select()
    .single();

  if (error) {
    console.error('Error submitting registration:', error);
    return null;
  }

  return data;
}

export async function getChatSessions(options?: {
  limit?: number;
  offset?: number;
  status?: string;
}) {
  let query = supabase
    .from('chat_sessions')
    .select('*, chat_messages(count)')
    .order('created_at', { ascending: false });

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching chat sessions:', error);
    return [];
  }

  return data;
}

export async function getChatMessages(sessionId: string) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching chat messages:', error);
    return [];
  }

  return data;
}

export async function getContactSubmissions(options?: {
  limit?: number;
  offset?: number;
  type?: string;
  status?: string;
}) {
  let query = supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (options?.type) {
    query = query.eq('type', options.type);
  }

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching contact submissions:', error);
    return [];
  }

  return data;
}

export async function getRegistrations(options?: {
  limit?: number;
  offset?: number;
  status?: string;
}) {
  let query = supabase
    .from('restaurant_registrations')
    .select('*')
    .order('created_at', { ascending: false });

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching registrations:', error);
    return [];
  }

  return data;
}

export async function updateRegistrationStatus(
  id: string,
  status: 'new' | 'reviewing' | 'approved' | 'rejected' | 'completed',
  notes?: string
) {
  const { data, error } = await (supabase as any)
    .from('restaurant_registrations')
    .update({ status, admin_notes: notes, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating registration status:', error);
    return null;
  }

  return data;
}

// Authentication functions
export async function loginAdmin(email: string, password: string) {
  try {
    // Note: In production, password should be hashed before sending
    // For now, we'll verify against the bcrypt hash in the database
    const { data, error } = await (supabase as any)
      .from('admin_credentials')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      console.error('Login error:', error);
      return null;
    }

    // In a real app, you'd use bcrypt.compare(password, data.password_hash)
    // For simplicity in demo, we'll do a basic check
    // Install bcryptjs: npm install bcryptjs @types/bcryptjs
    const bcrypt = await import('bcryptjs');
    const isValid = await bcrypt.compare(password, (data as any).password_hash);

    if (!isValid) {
      return null;
    }

    // Update last login
    await (supabase as any)
      .from('admin_credentials')
      .update({ last_login: new Date().toISOString() })
      .eq('id', (data as any).id);

    // Return user data without password hash
    const { password_hash: _passwordHash, ...userWithoutPassword } = data as any;
    return userWithoutPassword;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

export async function createAdminUser(email: string, password: string, fullName: string) {
  try {
    const bcrypt = await import('bcryptjs');
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const { data, error } = await (supabase as any)
      .from('admin_credentials')
      .insert({
        email,
        password_hash: passwordHash,
        full_name: fullName,
        role: 'admin',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating admin user:', error);
      return null;
    }

    const { password_hash: _passwordHash, ...userWithoutPassword } = data as any;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error creating admin user:', error);
    return null;
  }
}
