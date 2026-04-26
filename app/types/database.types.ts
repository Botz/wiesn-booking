export type Json
  = | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1'
  }
  public: {
    Tables: {
      access_codes: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          cancellation_token: string
          created_at: string | null
          guest_contact: string | null
          guest_name: string
          id: string
          invite_code_id: string | null
          payment_note: string | null
          payment_status: string
          plus_one_name: string | null
          reservation_id: string
          seat_count: number
          status: string
          updated_at: string | null
        }
        Insert: {
          cancellation_token?: string
          created_at?: string | null
          guest_contact?: string | null
          guest_name: string
          id?: string
          invite_code_id?: string | null
          payment_note?: string | null
          payment_status?: string
          plus_one_name?: string | null
          reservation_id: string
          seat_count?: number
          status?: string
          updated_at?: string | null
        }
        Update: {
          cancellation_token?: string
          created_at?: string | null
          guest_contact?: string | null
          guest_name?: string
          id?: string
          invite_code_id?: string | null
          payment_note?: string | null
          payment_status?: string
          plus_one_name?: string | null
          reservation_id?: string
          seat_count?: number
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'bookings_invite_code_id_fkey'
            columns: ['invite_code_id']
            isOneToOne: false
            referencedRelation: 'invite_codes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'bookings_reservation_id_fkey'
            columns: ['reservation_id']
            isOneToOne: false
            referencedRelation: 'reservations'
            referencedColumns: ['id']
          }
        ]
      }
      event_access_codes: {
        Row: {
          access_code_id: string
          created_at: string
          event_id: string
          id: string
        }
        Insert: {
          access_code_id: string
          created_at?: string
          event_id: string
          id?: string
        }
        Update: {
          access_code_id?: string
          created_at?: string
          event_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'event_access_codes_access_code_id_fkey'
            columns: ['access_code_id']
            isOneToOne: false
            referencedRelation: 'access_codes'
            referencedColumns: ['id']
          }
        ]
      }
      invite_code_reservations: {
        Row: {
          invite_code_id: string
          reservation_id: string
        }
        Insert: {
          invite_code_id: string
          reservation_id: string
        }
        Update: {
          invite_code_id?: string
          reservation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'invite_code_reservations_invite_code_id_fkey'
            columns: ['invite_code_id']
            isOneToOne: false
            referencedRelation: 'invite_codes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'invite_code_reservations_reservation_id_fkey'
            columns: ['reservation_id']
            isOneToOne: false
            referencedRelation: 'reservations'
            referencedColumns: ['id']
          }
        ]
      }
      invite_codes: {
        Row: {
          code: string
          created_at: string | null
          id: string
          is_active: boolean | null
          label: string | null
          max_guests_per_booking: number
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          label?: string | null
          max_guests_per_booking?: number
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          label?: string | null
          max_guests_per_booking?: number
        }
        Relationships: []
      }
      reservations: {
        Row: {
          created_at: string | null
          date: string
          id: string
          name: string
          notes: string | null
          tent: string | null
          total_cost: number | null
          total_seats: number
          updated_at: string | null
          whatsapp_link: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          name: string
          notes?: string | null
          tent?: string | null
          total_cost?: number | null
          total_seats: number
          updated_at?: string | null
          whatsapp_link?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          name?: string
          notes?: string | null
          tent?: string | null
          total_cost?: number | null
          total_seats?: number
          updated_at?: string | null
          whatsapp_link?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
