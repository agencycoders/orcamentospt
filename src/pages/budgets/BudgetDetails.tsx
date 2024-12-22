import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  FileText,
  User,
  DollarSign,
  CalendarDays,
  Edit,
  Trash2,
  Loader2,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Ban,
  Printer,
  Mail,
  Copy
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useBudgets } from '../../hooks/useBudgets';
import type { Budget } from '../../types/budget';

const STATUS_COLORS = {
  draft: { bg: 'bg-gray-100', text: 'text-gray-800', icon: Clock },
  sent: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Send },
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

const BudgetDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getBudgetById, deleteBudget } = useBudgets();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      loadBudget(id);
    }
  }, [id]);

  const loadBudget = async (budgetId: string) => {
    try {
      const data = await getBudgetById(budgetId);
      setBudget(data);
    } catch (error) {
      console.error('Error loading budget:', error);
      toast.error('Erro ao carregar orçamento');
      navigate('/budgets');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!budget) return;

    if (window.confirm(`Tem certeza que deseja excluir o orçamento #${budget.budget_number}?`)) {
      setDeleting(true);
      try {
        await deleteBudget(budget.id);
        toast.success('Orçamento excluído com sucesso!');
        navigate('/budgets');
      } catch (error) {
        console.error('Error deleting budget:', error);
        toast.error('Erro ao excluir orçamento');
      } finally {
        setDeleting(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">Orçamento não encontrado</p>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_COLORS[budget.status];
  const StatusIcon = statusConfig.icon;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="flex items-center">
                <h2 className="text-2xl font-bold text-gray-900 sm:truncate">
                  Orçamento #{budget.budget_number}
                </h2>
                {budget.revision > 1 && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Revisão {budget.revision}
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-center gap-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                  <StatusIcon className="h-4 w-4 mr-1" />
                  {STATUS_LABELS[budget.status]}
                </span>
                <span className="text-sm text-gray-500">
                  Criado em {formatDate(budget.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 gap-2">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <Printer className="-ml-1 mr-2 h-5 w-5" />
            Imprimir
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <Mail className="-ml-1 mr-2 h-5 w-5" />
            Enviar
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <Copy className="-ml-1 mr-2 h-5 w-5" />
            Duplicar
          </button>
          <Link
            to={`/budgets/${budget.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <Edit className="-ml-1 mr-2 h-5 w-5" />
            Editar
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none disabled:opacity-50"
          >
            {deleting ? (
              <Loader2 className="-ml-1 mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Trash2 className="-ml-1 mr-2 h-5 w-5" />
            )}
            Excluir
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
            <div className="px-4 py-6 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Itens do Orçamento
                </h3>
                <span className="text-sm text-gray-500">
                  {budget.items?.length || 0} itens
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Item
                      </th>
                      <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                        Qtd
                      </th>
                      <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                        Valor Unit.
                      </th>
                      <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {budget.items?.map((item) => (
                      <tr key={item.id}>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          <div className="font-medium">{item.description}</div>
                          <div className="text-gray-500">{item.reference}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                          {formatCurrency(item.selling_price)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-right">
                          {formatCurrency(item.total_selling)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th
                        scope="row"
                        colSpan={3}
                        className="pl-3 pr-3 py-4 text-right text-sm font-semibold text-gray-900"
                      >
                        Subtotal
                      </th>
                      <td className="pl-3 pr-3 py-4 text-right text-sm text-gray-900">
                        {formatCurrency(budget.total_selling)}
                      </td>
                    </tr>
                    {budget.discount_amount > 0 && (
                      <tr>
                        <th
                          scope="row"
                          colSpan={3}
                          className="pl-3 pr-3 py-4 text-right text-sm font-semibold text-gray-900"
                        >
                          Desconto ({budget.discount_percentage}%)
                        </th>
                        <td className="pl-3 pr-3 py-4 text-right text-sm text-red-600">
                          -{formatCurrency(budget.discount_amount)}
                        </td>
                      </tr>
                    )}
                    {budget.shipping_cost > 0 && (
                      <tr>
                        <th
                          scope="row"
                          colSpan={3}
                          className="pl-3 pr-3 py-4 text-right text-sm font-semibold text-gray-900"
                        >
                          Frete
                        </th>
                        <td className="pl-3 pr-3 py-4 text-right text-sm text-gray-900">
                          {formatCurrency(budget.shipping_cost)}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <th
                        scope="row"
                        colSpan={3}
                        className="pl-3 pr-3 py-4 text-right text-sm font-semibold text-gray-900"
                      >
                        Total
                      </th>
                      <td className="pl-3 pr-3 py-4 text-right text-sm font-semibold text-gray-900">
                        {formatCurrency(
                          budget.total_selling - budget.discount_amount + budget.shipping_cost
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Terms */}
          {(budget.terms_and_conditions ||
            budget.payment_conditions ||
            budget.warranty_terms) && (
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
              <div className="px-4 py-6 sm:p-6">
                <h3 className="text-base font-semibold leading-7 text-gray-900 mb-6">
                  Termos e Condições
                </h3>

                {budget.terms_and_conditions && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Termos Gerais
                    </h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {budget.terms_and_conditions}
                    </p>
                  </div>
                )}

                {budget.payment_conditions && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Condições de Pagamento
                    </h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {budget.payment_conditions}
                    </p>
                  </div>
                )}

                {budget.warranty_terms && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Termos de Garantia
                    </h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {budget.warranty_terms}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {(budget.notes || budget.internal_notes) && (
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
              <div className="px-4 py-6 sm:p-6">
                <h3 className="text-base font-semibold leading-7 text-gray-900 mb-6">
                  Observações
                </h3>

                {budget.notes && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Observações Gerais
                    </h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {budget.notes}
                    </p>
                  </div>
                )}

                {budget.internal_notes && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Observações Internas
                    </h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {budget.internal_notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
            <div className="px-4 py-6 sm:p-6">
              <h3 className="text-base font-semibold leading-7 text-gray-900 mb-6">
                Informações do Cliente
              </h3>

              <div className="space-y-6">
                <div>
                  <Link
                    to={`/clients/${budget.customer_id}`}
                    className="group flex items-center"
                  >
                    <div className="flex-shrink-0">
                      <User className="h-10 w-10 text-gray-300" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-medium text-gray-900 group-hover:text-blue-600">
                        {budget.customer?.name}
                      </div>
                      {budget.customer?.email && (
                        <div className="text-sm text-gray-500">
                          {budget.customer.email}
                        </div>
                      )}
                    </div>
                  </Link>
                </div>

                {budget.customer?.phone && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="h-5 w-5 text-gray-400 mr-2" />
                    {budget.customer.phone}
                  </div>
                )}

                {budget.customer?.address && (
                  <div className="flex items-start text-sm text-gray-500">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <div>{budget.customer.address}</div>
                      {(budget.customer.city || budget.customer.state) && (
                        <div>
                          {[budget.customer.city, budget.customer.state]
                            .filter(Boolean)
                            .join(' - ')}
                        </div>
                      )}
                      {budget.customer.postal_code && (
                        <div>CEP: {budget.customer.postal_code}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Budget Info */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
            <div className="px-4 py-6 sm:p-6">
              <h3 className="text-base font-semibold leading-7 text-gray-900 mb-6">
                Informações do Orçamento
              </h3>

              <dl className="space-y-6 divide-y divide-gray-100">
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    Validade
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">
                      {budget.validity_days} dias
                    </div>
                  </dd>
                </div>

                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    Prazo de Pagamento
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">
                      {budget.payment_term === 'custom'
                        ? budget.custom_payment_term
                        : {
                            immediate: 'À vista',
                            '15_days': '15 dias',
                            '30_days': '30 dias',
                            '45_days': '45 dias',
                            '60_days': '60 dias'
                          }[budget.payment_term]}
                    </div>
                  </dd>
                </div>

                {budget.delivery_time && (
                  <div className="pt-6 sm:flex">
                    <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                      Prazo de Entrega
                    </dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                      <div className="text-gray-900">{budget.delivery_time}</div>
                    </dd>
                  </div>
                )}

                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    Margem de Lucro
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">
                      {budget.profit_percentage.toFixed(2)}%
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetDetails;
