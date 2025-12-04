export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      chat_sessions: {
        Row: {
          id: string;
          visitor_id: string | null;
          status: 'active' | 'closed' | 'converted';
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          visitor_id?: string | null;
          status?: 'active' | 'closed' | 'converted';
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          visitor_id?: string | null;
          status?: 'active' | 'closed' | 'converted';
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          session_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          role?: 'user' | 'assistant' | 'system';
          content?: string;
          metadata?: Json | null;
          created_at?: string;
        };
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          subject: string;
          message: string;
          type: 'contact' | 'complaint' | 'support';
          status: 'new' | 'read' | 'replied' | 'resolved';
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          subject: string;
          message: string;
          type: 'contact' | 'complaint' | 'support';
          status?: 'new' | 'read' | 'replied' | 'resolved';
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          subject?: string;
          message?: string;
          type?: 'contact' | 'complaint' | 'support';
          status?: 'new' | 'read' | 'replied' | 'resolved';
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      restaurant_registrations: {
        Row: {
          id: string;
          restaurant_name: string;
          contact_name: string;
          email: string;
          phone: string;
          website: string | null;
          address: string;
          city: string;
          postal_code: string;
          restaurant_type: string;
          current_system: string | null;
          menu_description: string;
          menu_items_count: number | null;
          has_delivery: boolean;
          has_pickup: boolean;
          has_dine_in: boolean;
          opening_hours: string | null;
          special_requirements: string | null;
          preferred_colors: string | null;
          logo_url: string | null;
          budget_range: string | null;
          timeline: string | null;
          source: string | null;
          status: 'new' | 'reviewing' | 'approved' | 'rejected' | 'completed';
          admin_notes: string | null;
          claude_md: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_name: string;
          contact_name: string;
          email: string;
          phone: string;
          website?: string | null;
          address: string;
          city: string;
          postal_code: string;
          restaurant_type: string;
          current_system?: string | null;
          menu_description: string;
          menu_items_count?: number | null;
          has_delivery: boolean;
          has_pickup: boolean;
          has_dine_in: boolean;
          opening_hours?: string | null;
          special_requirements?: string | null;
          preferred_colors?: string | null;
          logo_url?: string | null;
          budget_range?: string | null;
          timeline?: string | null;
          source?: string | null;
          status?: 'new' | 'reviewing' | 'approved' | 'rejected' | 'completed';
          admin_notes?: string | null;
          claude_md?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_name?: string;
          contact_name?: string;
          email?: string;
          phone?: string;
          website?: string | null;
          address?: string;
          city?: string;
          postal_code?: string;
          restaurant_type?: string;
          current_system?: string | null;
          menu_description?: string;
          menu_items_count?: number | null;
          has_delivery?: boolean;
          has_pickup?: boolean;
          has_dine_in?: boolean;
          opening_hours?: string | null;
          special_requirements?: string | null;
          preferred_colors?: string | null;
          logo_url?: string | null;
          budget_range?: string | null;
          timeline?: string | null;
          source?: string | null;
          status?: 'new' | 'reviewing' | 'approved' | 'rejected' | 'completed';
          admin_notes?: string | null;
          claude_md?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      admin_credentials: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          full_name: string;
          role: string;
          is_active: boolean;
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password_hash: string;
          full_name: string;
          role?: string;
          is_active?: boolean;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password_hash?: string;
          full_name?: string;
          role?: string;
          is_active?: boolean;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
