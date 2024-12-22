import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Calculator, Loader2, Save } from 'lucide-react';
import { useCustomers } from '../../hooks/useCustomers';
import { useBudgets } from '../../hooks/useBudgets';
import type { BudgetItem } from '../../types/budget';

interface FormCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const CreateBudget = () => {
  const navigate = useNavigate();
  const { customers, loading: customersLoading } = useCustomers();
  const { createBudget, loading: budgetLoading } = useBudgets();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customer, setCustomer] = useState<FormCustomer>({
    id: '',
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const [items, setItems] = useState<BudgetItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const selected = customers.find(c => c.id === selectedCustomerId);
    if (selected) {
      setCustomer({
        id: selected.id,
        name: selected.name,
        email: selected.email || '',
        phone: selected.phone || '',
        address: selected.address || ''
      });
    }
  }, [selectedCustomerId, customers]);

  const createNewBudgetItem = (): BudgetItem => ({
    id: Date.now().toString(),
    reference: '',
    description: '',
    quantity: 1,
    cost_price: 0,
    selling_price: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    budget_id: '',
    sequence: items.length + 1,
    discount_percentage: 0,
    total_cost: 0,
    total_selling: 0,
    profit_margin: 0,
    profit_percentage: 0,
    unit: 'un',
    detailed_description: '',
    technical_details: '',
    delivery_time: '',
    warranty_terms: '',
    notes: '',
    supplier_info: '',
    manufacturer: '',
    brand: '',
    model: ''
  });

  const addItem = () => {
    setItems([...items, createNewBudgetItem()]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof BudgetItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotals = () => {
    const totalCost = items.reduce((sum, item) => sum + (item.cost_price * item.quantity), 0);
    const totalSelling = items.reduce((sum, item) => sum + (item.selling_price * item.quantity), 0);
    const profitMargin = totalSelling - totalCost;
    const profitPercentage = totalCost > 0 ? ((profitMargin / totalCost) * 100) : 0;

    return {
      totalCost,
      totalSelling,
      profitMargin,
      profitPercentage
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || items.length === 0) {
      alert('Por favor, selecione um cliente e adicione pelo menos um item ao orçamento.');
      return;
    }

    try {
      setSubmitting(true);
      const budgetItems = items.map(({ id, ...item }) => ({
        ...item,
        budget_id: '', // Placeholder, will be set on submit
      }));

      await createBudget(selectedCustomerId, budgetItems);
      navigate('/budgets');
    } catch (error) {
      alert('Erro ao criar orçamento. Por favor, tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const totals = calculateTotals();

  if (customersLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Criar Orçamento</h1>
        <button
          type="submit"
          form="budget-form"
          disabled={submitting}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save size={20} />
          )}
          Finalizar Orçamento
        </button>
      </div>

      <form id="budget-form" onSubmit={handleSubmit} className="space-y-8">
        {/* Customer Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Dados do Cliente</h2>
            <p className="mt-1 text-sm text-gray-500">Selecione o cliente para este orçamento</p>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Selecione um cliente</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {selectedCustomerId && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={customer.email}
                    disabled
                    className="w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input
                    type="tel"
                    value={customer.phone}
                    disabled
                    className="w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                  <input
                    type="text"
                    value={customer.address}
                    disabled
                    className="w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Budget Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Itens do Orçamento</h2>
              <p className="mt-1 text-sm text-gray-500">Adicione os itens que compõem este orçamento</p>
            </div>
            <button
              type="button"
              onClick={addItem}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Adicionar Item
            </button>
          </div>
          <div className="p-6 space-y-6">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-6 gap-4 items-end p-4 rounded-lg bg-gray-50 border border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Referência</label>
                  <input
                    type="text"
                    value={item.reference}
                    onChange={(e) => updateItem(item.id, 'reference', e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value))}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço Custo</label>
                  <input
                    type="number"
                    value={item.cost_price}
                    onChange={(e) => updateItem(item.id, 'cost_price', parseFloat(e.target.value))}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço Venda</label>
                  <input
                    type="number"
                    value={item.selling_price}
                    onChange={(e) => updateItem(item.id, 'selling_price', parseFloat(e.target.value))}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>Nenhum item adicionado ao orçamento</p>
                <button
                  type="button"
                  onClick={addItem}
                  className="mt-2 text-blue-600 hover:text-blue-700"
                >
                  Adicionar primeiro item
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Save size={20} />
            )}
            Criar Orçamento
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBudget;
