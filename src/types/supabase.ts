export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      budgets: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          customer_id: string
          budget_number: number
          revision: number
          status: 'draft' | 'sent' | 'approved' | 'rejected' | 'cancelled'
          validity_days: number
          payment_term: 'immediate' | '15_days' | '30_days' | '45_days' | '60_days' | 'custom'
          custom_payment_term: string | null
          delivery_time: string | null
          shipping_cost: number
          discount_percentage: number
          discount_amount: number
          total_cost: number
          total_selling: number
          profit_margin: number
          profit_percentage: number
          notes: string | null
          internal_notes: string | null
          terms_and_conditions: string | null
          payment_conditions: string | null
          warranty_terms: string | null
          technical_details: string | null
          sent_at: string | null
          approved_at: string | null
          rejected_at: string | null
          rejection_reason: string | null
          approved_by: string | null
          created_by: string | null
          last_updated_by: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          customer_id: string
          budget_number?: number
          revision?: number
          status?: 'draft' | 'sent' | 'approved' | 'rejected' | 'cancelled'
          validity_days?: number
          payment_term?: 'immediate' | '15_days' | '30_days' | '45_days' | '60_days' | 'custom'
          custom_payment_term?: string | null
          delivery_time?: string | null
          shipping_cost?: number
          discount_percentage?: number
          discount_amount?: number
          total_cost?: number
          total_selling?: number
          profit_margin?: number
          profit_percentage?: number
          notes?: string | null
          internal_notes?: string | null
          terms_and_conditions?: string | null
          payment_conditions?: string | null
          warranty_terms?: string | null
          technical_details?: string | null
          sent_at?: string | null
          approved_at?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          approved_by?: string | null
          created_by?: string | null
          last_updated_by?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          customer_id?: string
          budget_number?: number
          revision?: number
          status?: 'draft' | 'sent' | 'approved' | 'rejected' | 'cancelled'
          validity_days?: number
          payment_term?: 'immediate' | '15_days' | '30_days' | '45_days' | '60_days' | 'custom'
          custom_payment_term?: string | null
          delivery_time?: string | null
          shipping_cost?: number
          discount_percentage?: number
          discount_amount?: number
          total_cost?: number
          total_selling?: number
          profit_margin?: number
          profit_percentage?: number
          notes?: string | null
          internal_notes?: string | null
          terms_and_conditions?: string | null
          payment_conditions?: string | null
          warranty_terms?: string | null
          technical_details?: string | null
          sent_at?: string | null
          approved_at?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          approved_by?: string | null
          created_by?: string | null
          last_updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budgets_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          }
        ]
      }
      budget_files: {
        Row: {
          id: string
          created_at: string
          budget_id: string
          file_name: string
          file_size: number
          file_type: string
          storage_path: string
          description: string | null
          category: string | null
          uploaded_by: string | null
          is_public: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          budget_id: string
          file_name: string
          file_size: number
          file_type: string
          storage_path: string
          description?: string | null
          category?: string | null
          uploaded_by?: string | null
          is_public?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          budget_id?: string
          file_name?: string
          file_size?: number
          file_type?: string
          storage_path?: string
          description?: string | null
          category?: string | null
          uploaded_by?: string | null
          is_public?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "budget_files_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          }
        ]
      }
      budget_history: {
        Row: {
          id: string
          created_at: string
          budget_id: string
          action: string
          status: 'draft' | 'sent' | 'approved' | 'rejected' | 'cancelled' | null
          user_id: string | null
          notes: string | null
          changes: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          budget_id: string
          action: string
          status?: 'draft' | 'sent' | 'approved' | 'rejected' | 'cancelled' | null
          user_id?: string | null
          notes?: string | null
          changes?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          budget_id?: string
          action?: string
          status?: 'draft' | 'sent' | 'approved' | 'rejected' | 'cancelled' | null
          user_id?: string | null
          notes?: string | null
          changes?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_history_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          }
        ]
      }
      budget_items: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          budget_id: string
          sequence: number
          reference: string
          description: string
          detailed_description: string | null
          technical_details: string | null
          unit: string
          quantity: number
          cost_price: number
          selling_price: number
          discount_percentage: number
          total_cost: number
          total_selling: number
          profit_margin: number
          profit_percentage: number
          delivery_time: string | null
          warranty_terms: string | null
          notes: string | null
          supplier_info: string | null
          manufacturer: string | null
          brand: string | null
          model: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          budget_id: string
          sequence: number
          reference: string
          description: string
          detailed_description?: string | null
          technical_details?: string | null
          unit?: string
          quantity?: number
          cost_price?: number
          selling_price?: number
          discount_percentage?: number
          total_cost?: number
          total_selling?: number
          profit_margin?: number
          profit_percentage?: number
          delivery_time?: string | null
          warranty_terms?: string | null
          notes?: string | null
          supplier_info?: string | null
          manufacturer?: string | null
          brand?: string | null
          model?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          budget_id?: string
          sequence?: number
          reference?: string
          description?: string
          detailed_description?: string | null
          technical_details?: string | null
          unit?: string
          quantity?: number
          cost_price?: number
          selling_price?: number
          discount_percentage?: number
          total_cost?: number
          total_selling?: number
          profit_margin?: number
          profit_percentage?: number
          delivery_time?: string | null
          warranty_terms?: string | null
          notes?: string | null
          supplier_info?: string | null
          manufacturer?: string | null
          brand?: string | null
          model?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_items_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          }
        ]
      }
      customers: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          type: 'individual' | 'company'
          name: string
          email: string | null
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          postal_code: string | null
          tax_id: string | null
          company_name: string | null
          trading_name: string | null
          contact_name: string | null
          contact_phone: string | null
          contact_email: string | null
          website: string | null
          notes: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          type: 'individual' | 'company'
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          postal_code?: string | null
          tax_id?: string | null
          company_name?: string | null
          trading_name?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_email?: string | null
          website?: string | null
          notes?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          type?: 'individual' | 'company'
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          postal_code?: string | null
          tax_id?: string | null
          company_name?: string | null
          trading_name?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_email?: string | null
          website?: string | null
          notes?: string | null
          is_active?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      budget_statistics: {
        Row: {
          total_budgets: number | null
          approved_count: number | null
          sent_count: number | null
          pending_count: number | null
          rejected_count: number | null
          total_value: number | null
          average_margin: number | null
          approved_value: number | null
          approved_margin: number | null
          first_budget_date: string | null
          last_budget_date: string | null
          total_profit_approved: number | null
          total_customers: number | null
        }
        Relationships: []
      }
      monthly_budget_statistics: {
        Row: {
          month: string | null
          total_budgets: number | null
          approved_count: number | null
          total_value: number | null
          total_profit: number | null
          average_margin: number | null
          unique_customers: number | null
        }
        Relationships: []
      }
      customer_statistics: {
        Row: {
          customer_id: string | null
          customer_name: string | null
          customer_type: string | null
          total_budgets: number | null
          approved_budgets: number | null
          total_value: number | null
          average_margin: number | null
          last_budget_date: string | null
          first_budget_date: string | null
        }
        Relationships: []
      }
    }
    Functions: {}
    Enums: {}
  }
}
