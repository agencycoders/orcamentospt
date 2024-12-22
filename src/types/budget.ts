export type BudgetStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'cancelled';
export type PaymentTerm = 'immediate' | '15_days' | '30_days' | '45_days' | '60_days' | 'custom';

export interface Budget {
  id: string;
  created_at: string;
  updated_at: string;
  customer_id: string;
  budget_number: number;
  revision: number;
  status: BudgetStatus;
  validity_days: number;
  payment_term: PaymentTerm;
  custom_payment_term: string | null;
  delivery_time: string | null;
  shipping_cost: number;
  discount_percentage: number;
  discount_amount: number;
  total_cost: number;
  total_selling: number;
  profit_margin: number;
  profit_percentage: number;
  notes: string | null;
  internal_notes: string | null;
  terms_and_conditions: string | null;
  payment_conditions: string | null;
  warranty_terms: string | null;
  technical_details: string | null;
  sent_at: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  approved_by: string | null;
  created_by: string | null;
  last_updated_by: string | null;
}

export interface BudgetItem {
  id: string;
  created_at: string;
  updated_at: string;
  budget_id: string;
  sequence: number;
  reference: string;
  description: string;
  detailed_description: string | null;
  technical_details: string | null;
  unit: string;
  quantity: number;
  cost_price: number;
  selling_price: number;
  discount_percentage: number;
  total_cost: number;
  total_selling: number;
  profit_margin: number;
  profit_percentage: number;
  delivery_time: string | null;
  warranty_terms: string | null;
  notes: string | null;
  supplier_info: string | null;
  manufacturer: string | null;
  brand: string | null;
  model: string | null;
}

export interface BudgetHistory {
  id: string;
  created_at: string;
  budget_id: string;
  action: string;
  status: BudgetStatus | null;
  user_id: string | null;
  notes: string | null;
  changes: Record<string, any> | null;
}

export interface BudgetFile {
  id: string;
  created_at: string;
  budget_id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  storage_path: string;
  description: string | null;
  category: string | null;
  uploaded_by: string | null;
  is_public: boolean;
}

export interface BudgetFormData extends Omit<Budget, 'id' | 'created_at' | 'updated_at' | 'budget_number'> {
  id?: string;
  items: Omit<BudgetItem, 'id' | 'created_at' | 'updated_at' | 'budget_id'>[];
}

export interface BudgetStats {
  total_budgets: number;
  approved_count: number;
  sent_count: number;
  pending_count: number;
  rejected_count: number;
  total_value: number;
  average_margin: number;
  approved_value: number;
  approved_margin: number;
  first_budget_date: string | null;
  last_budget_date: string | null;
  total_profit_approved: number;
  total_customers: number;
}

export interface MonthlyBudgetStats {
  month: string;
  total_budgets: number;
  approved_count: number;
  total_value: number;
  total_profit: number;
  average_margin: number;
  unique_customers: number;
}
