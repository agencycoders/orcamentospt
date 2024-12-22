import React from 'react';
import { X, Plus } from 'lucide-react';
import type { BudgetItem } from '../../types/budget';

interface BudgetItemFormProps {
  items: BudgetItem[];
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, field: keyof BudgetItem, value: string | number) => void;
}

const BudgetItemForm = ({ items, onAddItem, onRemoveItem, onUpdateItem }: BudgetItemFormProps) => {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="bg-gray-50 p-4 rounded-lg relative">
          <button
            type="button"
            onClick={() => onRemoveItem(item.id)}
            className="absolute right-2 top-2 text-gray-400 hover:text-red-600"
          >
            <X size={20} />
          </button>
          
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Referência</label>
              <input
                type="text"
                value={item.reference}
                onChange={(e) => onUpdateItem(item.id, 'reference', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="col-span-4">
              <label className="block text-sm font-medium text-gray-700">Descrição</label>
              <input
                type="text"
                value={item.description}
                onChange={(e) => onUpdateItem(item.id, 'description', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantidade</label>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => onUpdateItem(item.id, 'quantity', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Preço Custo</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">€</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={item.costPrice}
                  onChange={(e) => onUpdateItem(item.id, 'costPrice', parseFloat(e.target.value))}
                  className="block w-full pl-7 pr-3 py-2 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Preço Venda</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">€</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={item.sellingPrice}
                  onChange={(e) => onUpdateItem(item.id, 'sellingPrice', parseFloat(e.target.value))}
                  className="block w-full pl-7 pr-3 py-2 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Margem</label>
              <div className="mt-1 py-2 px-3 bg-gray-100 rounded-md text-gray-700">
                {((item.sellingPrice - item.costPrice) / item.costPrice * 100).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <button
        type="button"
        onClick={onAddItem}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Adicionar Item
      </button>
    </div>
  );
};

export default BudgetItemForm;