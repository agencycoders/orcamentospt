export type CustomerType = 'individual' | 'company';

export interface Customer {
  id: string;
  created_at: string;
  updated_at: string;
  type: CustomerType;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  tax_id: string | null;
  company_name: string | null;
  trading_name: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  website: string | null;
  notes: string | null;
  is_active: boolean;
}

export interface CustomerFormData extends Omit<Customer, 'id' | 'created_at' | 'updated_at'> {
  id?: string;
}

export interface CustomerStats {
  total_budgets: number;
  approved_budgets: number;
  total_value: number;
  average_margin: number;
  last_budget_date: string | null;
  first_budget_date: string | null;
}
