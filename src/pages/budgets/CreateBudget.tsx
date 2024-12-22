import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Loader2, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import BudgetItemForm from '../../components/budgets/BudgetItemForm';
import BudgetSummary from '../../components/budgets/BudgetSummary';
import { useBudgets } from '../../hooks/useBudgets';
import { useCustomers } from '../../hooks/useCustomers';
import type { BudgetItem } from '../../utils/budgetCalculations';

const CreateBudget = () => {
  const navigate = useNavigate();
  const { createBudget } = useBudgets();
  const { customers } = useCustomers();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [customerId, setCustomerId] = useState('');

  // Calculate totals
  const totalCost = items.reduce((sum, item) => sum + item.total_cost, 0);
  const totalSelling = items.reduce((sum, item) => sum + item.total_selling, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) {
      toast.error('Selecione um cliente');
      return;
    }
    if (items.length === 0) {
      toast.error('Adicione pelo menos um item ao orçamento');
      return;
    }

    setLoading(true);
    try {
      await createBudget({
        customer_id: customerId,
        items: items.map(item => ({
          reference: item.reference,
          description: item.description,
          unit: item.unit,
          quantity: item.quantity,
          cost_price: item.cost_price,
          selling_price: item.selling_price,
          total_cost: item.total_cost,
          total_selling: item.total_selling,
          profit_margin: item.profit_margin,
          profit_percentage: item.profit_percentage
        })),
        total_cost: totalCost,
        total_selling: totalSelling,
        profit_margin: totalSelling - totalCost,
        profit_percentage: totalCost > 0 ? ((totalSelling - totalCost) / totalCost * 100) : 0
      });
      toast.success('Orçamento criado com sucesso!');
      navigate('/budgets');
    } catch (error) {
      console.error('Error creating budget:', error);
      toast.error('Erro ao criar orçamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Novo Orçamento</h1>
          <p className="mt-1 text-sm text-gray-500">
            Crie um novo orçamento preenchendo as informações abaixo.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Cliente
              </h2>
              <User className="h-5 w-5 text-gray-400" />
            </div>
            
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Selecione um cliente</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} {customer.tax_id ? `(${customer.tax_id})` : ''}
                </option>
              ))}
            </select>

            {!customerId && (
              <p className="mt-2 text-sm text-gray-500">
                Selecione um cliente para continuar
              </p>
            )}
          </div>

          {/* Budget Items */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Itens do Orçamento
              </h2>
              <span className="text-sm text-gray-500">
                {items.length} {items.length === 1 ? 'item' : 'itens'}
              </span>
            </div>

            <BudgetItemForm 
              items={items} 
              onChange={setItems} 
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <BudgetSummary 
            totalCost={totalCost}
            totalSelling={totalSelling}
            items={items}
          />

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <button
              type="submit"
              disabled={loading || items.length === 0 || !customerId}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Salvar Orçamento
                </>
              )}
            </button>

            {/* Validation Messages */}
            {!customerId && (
              <p className="mt-2 text-sm text-red-600">
                Selecione um cliente para continuar
              </p>
            )}
            {items.length === 0 && (
              <p className="mt-2 text-sm text-red-600">
                Adicione pelo menos um item ao orçamento
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateBudget;
