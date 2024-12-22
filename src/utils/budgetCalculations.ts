export interface BudgetItem {
  reference: string;
  description: string;
  unit: string;
  quantity: number;
  cost_price: number;
  selling_price: number;
  total_cost: number;
  total_selling: number;
  profit_margin: number;
  profit_percentage: number;
}

export const calculateItemTotals = (item: Partial<BudgetItem>): BudgetItem => {
  const quantity = Number(item.quantity) || 0;
  const costPrice = Number(item.cost_price) || 0;
  const sellingPrice = Number(item.selling_price) || 0;

  const totalCost = quantity * costPrice;
  const totalSelling = quantity * sellingPrice;
  const profitMargin = totalSelling - totalCost;
  const profitPercentage = totalCost > 0 ? ((profitMargin / totalCost) * 100) : 0;

  return {
    reference: item.reference || '',
    description: item.description || '',
    unit: item.unit || 'un',
    quantity,
    cost_price: costPrice,
    selling_price: sellingPrice,
    total_cost: totalCost,
    total_selling: totalSelling,
    profit_margin: profitMargin,
    profit_percentage: profitPercentage
  };
};

export const calculateBudgetTotals = (items: BudgetItem[]) => {
  const totalCost = items.reduce((sum, item) => sum + item.total_cost, 0);
  const totalSelling = items.reduce((sum, item) => sum + item.total_selling, 0);
  const profitMargin = totalSelling - totalCost;
  const profitPercentage = totalCost > 0 ? ((profitMargin / totalCost) * 100) : 0;

  return {
    totalCost,
    totalSelling,
    profitMargin,
    profitPercentage,
    itemCount: items.length
  };
};

export const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const formatPercentage = (value: number) => {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + '%';
};

export const suggestSellingPrice = (costPrice: number, targetMargin: number = 30) => {
  // Add the target margin to the cost price
  return costPrice * (1 + targetMargin / 100);
};

export const validateBudgetItem = (item: BudgetItem) => {
  const errors: string[] = [];

  if (!item.reference.trim()) {
    errors.push('Referência é obrigatória');
  }

  if (!item.description.trim()) {
    errors.push('Descrição é obrigatória');
  }

  if (item.quantity <= 0) {
    errors.push('Quantidade deve ser maior que zero');
  }

  if (item.cost_price < 0) {
    errors.push('Preço de custo não pode ser negativo');
  }

  if (item.selling_price < 0) {
    errors.push('Preço de venda não pode ser negativo');
  }

  if (item.selling_price < item.cost_price) {
    errors.push('Preço de venda está abaixo do preço de custo');
  }

  return errors;
};

export const getMarginColor = (percentage: number): string => {
  if (percentage < 0) return 'text-red-600';
  if (percentage < 15) return 'text-yellow-600';
  if (percentage < 30) return 'text-blue-600';
  return 'text-green-600';
};

export const getMarginBackgroundColor = (percentage: number): string => {
  if (percentage < 0) return 'bg-red-100';
  if (percentage < 15) return 'bg-yellow-100';
  if (percentage < 30) return 'bg-blue-100';
  return 'bg-green-100';
};

export const getMarginProgressColor = (percentage: number): string => {
  if (percentage < 0) return 'bg-red-500';
  if (percentage < 15) return 'bg-yellow-500';
  if (percentage < 30) return 'bg-blue-500';
  return 'bg-green-500';
};
