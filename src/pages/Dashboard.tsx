import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, DollarSign, FileText, PieChart, Percent, Loader2, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import StatCard from '../components/Dashboard/StatCard';
import StatisticsChart from '../components/Dashboard/StatisticsChart';
import { useBudgets } from '../hooks/useBudgets';

interface BudgetStats {
  total_budgets: number | null;
  total_value: number | null;
  average_margin: number | null;
  approved_count: number | null;
  pending_count: number | null;
  rejected_count: number | null;
}

import { supabase } from '../lib/supabase';

const Dashboard = () => {
    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase.from('budgets').select('*');
            if (error) {
                console.error('Erro ao buscar dados do Supabase:', error);
            } else {
                console.log('Dados do Supabase:', data);
            }
        };
        fetchData();
    }, []);
  const { budgets, loading, error, getBudgetStats } = useBudgets();
  const [stats, setStats] = useState<BudgetStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getBudgetStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Prepare monthly data for charts
  const monthlyData = budgets.reduce((acc: any[], budget) => {
    const date = new Date(budget.created_at);
    const month = date.toLocaleString('pt-BR', { month: 'short' });
    
    const existingMonth = acc.find(item => item.month === month);
    if (existingMonth) {
      existingMonth.value += budget.total_selling;
      existingMonth.margin = (existingMonth.margin + budget.profit_margin) / 2;
    } else {
      acc.push({
        month,
        value: budget.total_selling,
        margin: budget.profit_margin
      });
    }
    return acc;
  }, []);

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">Erro ao carregar dados: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Visão geral dos seus orçamentos e métricas principais
              </p>
            </div>
            <Link
              to="/budgets/new"
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-sm font-medium hover:shadow-md w-full sm:w-auto justify-center"
            >
              <FileText className="h-4 w-4" />
              Novo Orçamento
            </Link>
          </div>
        </div>

        {loading || statsLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
          </div>
        ) : (
          <>
            {/* Main KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total de Orçamentos"
                value={stats?.total_budgets.toString() || '0'}
                subtitle={`${stats?.pending_count || 0} pendentes`}
                icon={<FileText />}
                color="indigo"
              />
              <StatCard
                title="Valor Total"
                value={new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'EUR'
                }).format(stats?.total_value || 0)}
                subtitle={`${stats?.approved_count || 0} aprovados`}
                icon={<DollarSign />}
                color="emerald"
              />
              <StatCard
                title="Margem Média"
                value={`${(stats?.average_margin || 0).toFixed(1)}%`}
                subtitle="Lucro médio"
                icon={<Percent />}
                color="violet"
              />
              <StatCard
                title="Taxa de Conversão"
                value={`${stats ? Math.round((stats.approved_count / stats.total_budgets) * 100) : 0}%`}
                subtitle={`${stats?.rejected_count || 0} recusados`}
                icon={<ArrowUpRight />}
                color="orange"
              />
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Aprovados</h3>
                      <p className="text-sm text-gray-600">Total de orçamentos aprovados</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-emerald-600">{stats?.approved_count || 0}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progresso</span>
                    <span className="font-medium text-emerald-600">
                      {stats ? Math.round((stats.approved_count / stats.total_budgets) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${stats ? (stats.approved_count / stats.total_budgets) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Clock className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Pendentes</h3>
                      <p className="text-sm text-gray-600">Aguardando aprovação</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-indigo-600">{stats?.pending_count || 0}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progresso</span>
                    <span className="font-medium text-indigo-600">
                      {stats ? Math.round((stats.pending_count / stats.total_budgets) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${stats ? (stats.pending_count / stats.total_budgets) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <XCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Recusados</h3>
                      <p className="text-sm text-gray-600">Orçamentos não aprovados</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-red-600">{stats?.rejected_count || 0}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progresso</span>
                    <span className="font-medium text-red-600">
                      {stats ? Math.round((stats.rejected_count / stats.total_budgets) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${stats ? (stats.rejected_count / stats.total_budgets) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Valor dos Orçamentos</h3>
                    <p className="text-sm text-gray-500 mt-1">Análise mensal dos valores</p>
                  </div>
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>
                <StatisticsChart data={monthlyData} type="value" />
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Margem de Lucro</h3>
                    <p className="text-sm text-gray-500 mt-1">Análise mensal das margens</p>
                  </div>
                  <div className="p-2 bg-violet-50 rounded-lg">
                    <PieChart className="h-5 w-5 text-violet-600" />
                  </div>
                </div>
                <StatisticsChart data={monthlyData} type="margin" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
