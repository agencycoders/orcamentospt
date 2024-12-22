import { useState, useEffect } from 'react';
import { supabase, handleSupabaseError } from '../lib/supabase';
import type { Budget, BudgetItem } from '../types/budget';

interface BudgetWithItems extends Budget {
  items: BudgetItem[];
  customer: {
    name: string;
    email: string | null;
  };
}

export function useBudgets() {
  const [budgets, setBudgets] = useState<BudgetWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBudgets();
  }, []);

  async function fetchBudgets() {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('budgets')
        .select(`
          *,
          customer:customers(name, email),
          items:budget_items(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBudgets(data || []);
    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      console.error('Error fetching budgets:', err);
    } finally {
      setLoading(false);
    }
  }

  async function createBudget(customerId: string, items: Omit<BudgetItem, 'id' | 'created_at' | 'updated_at'>[]) {
    try {
      setLoading(true);
      setError(null);
      
      // Create the budget first
      const { data: budget, error: budgetError } = await supabase
        .from('budgets')
        .insert([{
          customer_id: customerId,
          status: 'draft',
          validity_days: 30,
          payment_term: 'immediate'
        }])
        .select()
        .single();

      if (budgetError) throw budgetError;

      // Then create all budget items
      const budgetItems = items.map((item, index) => ({
        ...item,
        budget_id: budget.id,
        sequence: index + 1
      }));

      const { error: itemsError } = await supabase
        .from('budget_items')
        .insert(budgetItems);

      if (itemsError) throw itemsError;

      // Fetch the complete budget with items
      const { data: newBudget, error: fetchError } = await supabase
        .from('budgets')
        .select(`
          *,
          customer:customers(name, email),
          items:budget_items(*)
        `)
        .eq('id', budget.id)
        .single();

      if (fetchError) throw fetchError;

      setBudgets(prev => [newBudget, ...prev]);
      return newBudget;
    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function updateBudget(
    id: string, 
    updates: Partial<Omit<Budget, 'id' | 'created_at' | 'updated_at'>>,
    items?: Omit<BudgetItem, 'id' | 'created_at' | 'updated_at'>[]
  ) {
    try {
      setLoading(true);
      setError(null);

      // Update budget
      const { error: budgetError } = await supabase
        .from('budgets')
        .update(updates)
        .eq('id', id);

      if (budgetError) throw budgetError;

      // Update items if provided
      if (items) {
        // Delete existing items
        const { error: deleteError } = await supabase
          .from('budget_items')
          .delete()
          .eq('budget_id', id);

        if (deleteError) throw deleteError;

        // Insert new items
        const budgetItems = items.map((item, index) => ({
          ...item,
          budget_id: id,
          sequence: index + 1
        }));

        const { error: itemsError } = await supabase
          .from('budget_items')
          .insert(budgetItems);

        if (itemsError) throw itemsError;
      }

      // Fetch updated budget
      const { data: updatedBudget, error: fetchError } = await supabase
        .from('budgets')
        .select(`
          *,
          customer:customers(name, email),
          items:budget_items(*)
        `)
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      setBudgets(prev => prev.map(b => b.id === id ? updatedBudget : b));
      return updatedBudget;
    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function deleteBudget(id: string) {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setBudgets(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function getBudgetById(id: string) {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('budgets')
        .select(`
          *,
          customer:customers(name, email),
          items:budget_items(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function getBudgetStats() {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('budget_statistics')
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      throw err;
    }
  }

  return {
    budgets,
    loading,
    error,
    fetchBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    getBudgetById,
    getBudgetStats
  };
}
