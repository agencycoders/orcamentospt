import React, { useState } from 'react';
import { Trash2, Plus, Calculator, AlertTriangle } from 'lucide-react';
import { 
  BudgetItem,
  calculateItemTotals,
  validateBudgetItem,
  getMarginColor,
  getMarginBackgroundColor,
  suggestSellingPrice
} from '../../utils/budgetCalculations';
import { formatCurrency, formatPercentage, parseLocalizedNumber } from '../../utils/formatters';

interface BudgetItemFormProps {
  items: BudgetItem[];
  onChange: (items: BudgetItem[]) => void;
}

const BudgetItemForm: React.FC<BudgetItemFormProps> = ({ items, onChange }) => {
  const [targetMargin, setTargetMargin] = useState(30); // Default 30% margin

  const addItem = () => {
    const newItem = calculateItemTotals({
      reference: '',
      description: '',
      unit: 'un',
      quantity: 1,
      cost_price: 0,
      selling_price: 0
    });
    onChange([...items, newItem]);
  };

  const updateItem = (index: number, updates: Partial<BudgetItem>) => {
    const updatedItems = items.map((item, i) => {
      if (i === index) {
        // If the update includes cost_price or selling_price, parse them as localized numbers
        const parsedUpdates = {
          ...updates,
          cost_price: updates.cost_price !== undefined 
            ? parseLocalizedNumber(updates.cost_price.toString())
            : item.cost_price,
          selling_price: updates.selling_price !== undefined
            ? parseLocalizedNumber(updates.selling_price.toString())
            : item.selling_price
        };
        return calculateItemTotals({ ...item, ...parsedUpdates });
      }
      return item;
    });
    onChange(updatedItems);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const autoCalculatePrice = (index: number) => {
    const item = items[index];
    const suggestedPrice = suggestSellingPrice(item.cost_price, targetMargin);
    updateItem(index, { selling_price: suggestedPrice });
  };

  return (
    <div className="space-y-6">
      {items.map((item, index) => {
        const errors = validateBudgetItem(item);
        const hasErrors = errors.length > 0;

        return (
          <div 
            key={index}
            className={`
              bg-white 
              rounded-xl 
              shadow-sm 
              border 
              ${hasErrors ? 'border-red-200' : 'border-gray-200'} 
              p-6 
              relative 
              group
              transition-all
              duration-200
              hover:shadow-md
            `}
          >
            {/* Remove button */}
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="absolute -top-3 -right-3 p-1.5 bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
              title="Remover item"
            >
              <Trash2 className="h-4 w-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Referência
                  </label>
                  <input
                    type="text"
                    value={item.reference}
                    onChange={(e) => updateItem(index, { reference: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Ex: SKU123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Descrição
                  </label>
                  <textarea
                    value={item.description}
                    onChange={(e) => updateItem(index, { description: e.target.value })}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Descrição detalhada do item"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Unidade
                    </label>
                    <select
                      value={item.unit}
                      onChange={(e) => updateItem(index, { unit: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="un">Unidade</option>
                      <option value="m">Metro</option>
                      <option value="m2">Metro²</option>
                      <option value="m3">Metro³</option>
                      <option value="kg">Quilograma</option>
                      <option value="l">Litro</option>
                      <option value="h">Hora</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Quantidade
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, { quantity: Number(e.target.value) })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Preço de Custo
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">€</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.cost_price}
                        onChange={(e) => updateItem(index, { cost_price: Number(e.target.value) })}
                        className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Preço de Venda
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">€</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.selling_price}
                        onChange={(e) => updateItem(index, { selling_price: Number(e.target.value) })}
                        className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => autoCalculatePrice(index)}
                        className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 hover:text-blue-600"
                        title={`Calcular preço com margem de ${targetMargin}%`}
                      >
                        <Calculator className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Totals */}
                <div className={`
                  rounded-lg 
                  p-4 
                  space-y-3
                  ${getMarginBackgroundColor(item.profit_percentage)}
                  transition-colors
                  duration-200
                `}>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Total de Custo:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(item.total_cost)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Total de Venda:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(item.total_selling)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Margem de Lucro:</span>
                    <span className={`font-medium ${getMarginColor(item.profit_percentage)}`}>
                      {formatCurrency(item.profit_margin)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Percentual de Lucro:</span>
                    <span className={`font-medium ${getMarginColor(item.profit_percentage)}`}>
                      {formatPercentage(item.profit_percentage)}
                    </span>
                  </div>
                </div>

                {/* Validation Errors */}
                {hasErrors && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-red-800 text-sm font-medium mb-1">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Atenção</span>
                    </div>
                    <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                      {errors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Add Item Button */}
      <button
        type="button"
        onClick={addItem}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors flex items-center justify-center gap-2 hover:bg-gray-50"
      >
        <Plus className="h-5 w-5" />
        Adicionar Item
      </button>

      {/* Target Margin Setting */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            Margem de Lucro Alvo
          </label>
          <span className="text-sm text-gray-500">
            {targetMargin}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={targetMargin}
          onChange={(e) => setTargetMargin(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <p className="mt-2 text-xs text-gray-500">
          Esta margem será usada ao calcular automaticamente os preços de venda.
        </p>
      </div>
    </div>
  );
};

export default BudgetItemForm;
