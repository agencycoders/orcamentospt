import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  FileText,
  User,
  DollarSign,
  CalendarDays,
  Eye,
  Edit,
  Trash2,
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  Ban
} from 'lucide-react';
import { useBudgets } from '../../hooks/useBudgets';
import type { Budget } from '../../types/budget';

const STATUS_COLORS = {
  draft: { bg: 'bg-gray-100', text: 'text-gray-800', icon: Clock },
  sent: { bg: 'bg-blue-100', text: 'text-blue-800', icon: FileText },
  approved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
  rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
  cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', icon: Ban }
};

const STATUS_LABELS = {
  draft: 'Rascunho',
  sent: 'Enviado',
  approved: 'Aprovado',
  rejected: 'Recusado',
  cancelled: 'Cancelado'
};

const BudgetsList = () => {
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get('customer');
  const { budgets, loading, error, deleteBudget } = useBudgets();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch = 
      budget.budget_number.toString().includes(searchTerm) ||
      budget.customer?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || budget.status === statusFilter;
    const matchesCustomer = !customerId || budget.customer_id === customerId;
    
    return matchesSearch && matchesStatus && matchesCustomer;
  });

  const handleDelete = async (budget: Budget) => {
    if (window.confirm(`Tem certeza que deseja excluir o orçamento #${budget.budget_number}?`)) {
      try {
        await deleteBudget(budget.id);
      } catch (error) {
        console.error('Error deleting budget:', error);
      }
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">Erro ao carregar orçamentos: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Orçamentos</h1>
          <Link
            to="/budgets/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Novo Orçamento
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar orçamentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full py-2 pl-3 pr-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos os status</option>
                <option value="draft">Rascunho</option>
                <option value="sent">Enviado</option>
                <option value="approved">Aprovado</option>
                <option value="rejected">Recusado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orçamento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBudgets.map((budget) => {
                    const statusConfig = STATUS_COLORS[budget.status];
                    const StatusIcon = statusConfig.icon;

                    return (
                    <tr key={budget.id} className="hover:bg-gray-50 transition-all duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <FileText className="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">
                                #{budget.budget_number}
                              </div>
                              {budget.revision > 1 && (
                                <div className="text-sm text-gray-500">
                                  Revisão {budget.revision}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <User className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-gray-900">
                              {budget.customer?.name || '-'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                            <StatusIcon className="h-4 w-4 mr-1" />
                            {STATUS_LABELS[budget.status]}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-gray-900">
                            <DollarSign className="h-5 w-5 text-gray-400 mr-1" />
                            {formatCurrency(budget.total_selling)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-gray-900">
                            <CalendarDays className="h-5 w-5 text-gray-400 mr-1" />
                            {formatDate(budget.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/budgets/${budget.id}`}
                              className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              <Eye className="h-5 w-5" />
                            </Link>
                            <Link
                              to={`/budgets/${budget.id}/edit`}
                              className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                            >
                              <Edit className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => handleDelete(budget)}
                              className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredBudgets.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Nenhum orçamento encontrado
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Tente ajustar os filtros para encontrar o que está procurando.'
                    : 'Comece criando um novo orçamento.'}
                </p>
                <div className="mt-6">
                  <Link
                    to="/budgets/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Novo Orçamento
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetsList;
