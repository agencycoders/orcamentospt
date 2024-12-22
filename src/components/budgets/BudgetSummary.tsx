import React from 'react';
import { DollarSign, TrendingUp, Percent, AlertTriangle, Package, Calculator } from 'lucide-react';
import { 
  formatCurrency, 
  formatPercentage,
  getMarginColor,
  getMarginProgressColor,
  getMarginBackgroundColor
} from '../../utils/budgetCalculations';

interface BudgetSummaryProps {
  totalCost: number;
  totalSelling: number;
  items: Array<{
    cost_price: number;
    selling_price: number;
    quantity: number;
  }>;
}

const BudgetSummary: React.FC<BudgetSummaryProps> = ({ totalCost, totalSelling, items }) => {
  // Calculate totals
  const totalItems = items.length;
  const profitMargin = totalSelling - totalCost;
  const profitPercentage = totalCost > 0 ? ((profitMargin / totalCost) * 100) : 0;
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate average margins
  const itemMargins = items.map(item => ({
    margin: item.cost_price > 0 ? ((item.selling_price - item.cost_price) / item.cost_price * 100) : 0
  }));
  const averageMargin = itemMargins.length > 0
    ? itemMargins.reduce((sum, item) => sum + item.margin, 0) / itemMargins.length
    : 0;

  const marginColor = getMarginColor(profitPercentage);
  const progressColor = getMarginProgressColor(profitPercentage);
  const marginBgColor = getMarginBackgroundColor(profitPercentage);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4 transition-all duration-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center justify-between">
        <span>Resumo do Orçamento</span>
        <Calculator className="h-5 w-5 text-gray-400" />
      </h3>

      <div className="space-y-6">
        {/* Items Summary */}
        <div className="flex items-start justify-between pb-6 border-b border-gray-100">
          <div>
            <div className="text-sm font-medium text-gray-500">Total de Itens</div>
            <div className="mt-1 flex items-baseline gap-2">
              <div className="text-2xl font-semibold text-gray-900">{totalItems}</div>
              <div className="text-sm text-gray-500">itens</div>
            </div>
            <div className="mt-1 text-sm text-gray-500">
              Quantidade total: {totalQuantity}
            </div>
          </div>
          <div className="p-2 bg-gray-100 rounded-lg">
            <Package className="h-5 w-5 text-gray-600" />
          </div>
        </div>

        {/* Cost Summary */}
        <div className="flex items-start justify-between pb-6 border-b border-gray-100">
          <div>
            <div className="text-sm font-medium text-gray-500">Custo Total</div>
            <div className="mt-1 flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">
                {formatCurrency(totalCost)}
              </div>
            </div>
            <div className="mt-1 text-sm text-gray-500">
              Média por item: {formatCurrency(totalItems > 0 ? totalCost / totalItems : 0)}
            </div>
          </div>
          <div className="p-2 bg-gray-100 rounded-lg">
            <DollarSign className="h-5 w-5 text-gray-600" />
          </div>
        </div>

        {/* Selling Summary */}
        <div className="flex items-start justify-between pb-6 border-b border-gray-100">
          <div>
            <div className="text-sm font-medium text-gray-500">Valor de Venda</div>
            <div className="mt-1 flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">
                {formatCurrency(totalSelling)}
              </div>
            </div>
            <div className="mt-1 text-sm text-gray-500">
              Média por item: {formatCurrency(totalItems > 0 ? totalSelling / totalItems : 0)}
            </div>
          </div>
          <div className="p-2 bg-blue-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
        </div>

        {/* Profit Margin */}
        <div className="flex items-start justify-between pb-6 border-b border-gray-100">
          <div>
            <div className="text-sm font-medium text-gray-500">Margem de Lucro</div>
            <div className="mt-1 space-y-1">
              <div className={`text-2xl font-semibold ${marginColor}`}>
                {formatCurrency(profitMargin)}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Margem sobre o custo:</span>
                <span className={`font-medium ${marginColor}`}>
                  {formatPercentage(profitPercentage)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Média por item:</span>
                <span className={`font-medium ${getMarginColor(averageMargin)}`}>
                  {formatPercentage(averageMargin)}
                </span>
              </div>
            </div>
          </div>
          <div className={`p-2 rounded-lg ${marginBgColor}`}>
            <Percent className={`h-5 w-5 ${marginColor}`} />
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-500">Margem de Lucro</span>
            <span className={`font-medium ${marginColor}`}>
              {formatPercentage(profitPercentage)}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
              style={{ width: `${Math.min(Math.max(profitPercentage, 0), 100)}%` }}
            />
          </div>
        </div>

        {/* Alerts */}
        {profitMargin < 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">
                Atenção: Margem Negativa
              </p>
              <p className="text-sm text-red-600 mt-1">
                O preço de venda total está abaixo do custo total. Considere ajustar os preços.
              </p>
            </div>
          </div>
        )}

        {profitPercentage < 15 && profitPercentage >= 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Margem Baixa
              </p>
              <p className="text-sm text-yellow-600 mt-1">
                A margem de lucro está abaixo de 15%. Verifique se os preços estão adequados.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetSummary;
