import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, DollarSign, FileText, PieChart, Percent, Loader2, AlertCircle } from 'lucide-react';
import StatCard from '../components/Dashboard/StatCard';
import StatisticsChart from '../components/Dashboard/StatisticsChart';
import { useBudgets } from '../hooks/useBudgets';

interface BudgetStats {
  total_budgets: number;
  total_value: number;
  average_margin: number;
  approved_count: number;
  pending_count: number;
  rejected_count: number;
}

const Dashboard = () => {
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

  if (error?.includes('Erro de configuração')) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <h2 className="text-lg font-semibold text-red-900">Erro de Configuração</h2>
          </div>
          <p className="text-red-700 mb-4">
            O sistema não está configurado corretamente. Por favor, siga os passos abaixo:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-red-700">
            <li>Crie um projeto no Supabase (https://supabase.com)</li>
            <li>Copie as credenciais do projeto em Project Settings &rarr; API</li>
            <li>Crie um arquivo .env na raiz do projeto</li>
            <li>Adicione as seguintes variáveis:
              <pre className="mt-2 p-3 bg-red-100 rounded-lg text-sm">
                VITE_SUPABASE_URL=sua-url-do-projeto<br/>
                VITE_SUPABASE_ANON_KEY=sua-chave-anon
              </pre>
            </li>
            <li>Reinicie o servidor de desenvolvimento</li>
          </ol>
        </div>
      </div>
    );
  }

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
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <Link
            to="/budgets/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Novo Orçamento
          </Link>
        </div>

        {loading || statsLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <>
            {/* Main KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total de Orçamentos"
                value={stats?.total_budgets.toString() || '0'}
                icon={<FileText className="h-6 w-6 text-blue-600" />}
                subtitle="Total acumulado"
                className="bg-blue-50 border-blue-200"
              />
              <StatCard
                title="Valor Total"
                value={`R$ ${(stats?.total_value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                icon={<DollarSign className="h-6 w-6 text-green-600" />}
                subtitle="Em orçamentos"
                className="bg-green-50 border-green-200"
              />
              <StatCard
                title="Margem Média"
                value={`${(stats?.average_margin || 0).toFixed(1)}%`}
                icon={<Percent className="h-6 w-6 text-purple-600" />}
                subtitle="De lucro"
                className="bg-purple-50 border-purple-200"
              />
              <StatCard
                title="Taxa de Aprovação"
                value={`${stats ? Math.round((stats.approved_count / stats.total_budgets) * 100) : 0}%`}
                icon={<ArrowUpRight className="h-6 w-6 text-orange-600" />}
                subtitle="Dos orçamentos"
                className="bg-orange-50 border-orange-200"
              />
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-green-600">Aprovados</h3>
                  <span className="text-2xl font-bold text-green-600">{stats?.approved_count || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{
                      width: `${stats ? (stats.approved_count / stats.total_budgets) * 100 : 0}%`
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-yellow-600">Pendentes</h3>
                  <span className="text-2xl font-bold text-yellow-600">{stats?.pending_count || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-yellow-600 h-2.5 rounded-full"
                    style={{
                      width: `${stats ? (stats.pending_count / stats.total_budgets) * 100 : 0}%`
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-red-600">Recusados</h3>
                  <span className="text-2xl font-bold text-red-600">{stats?.rejected_count || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-red-600 h-2.5 rounded-full"
                    style={{
                      width: `${stats ? (stats.rejected_count / stats.total_budgets) * 100 : 0}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-6">Valor dos Orçamentos</h3>
                <StatisticsChart data={monthlyData} type="value" />
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-6">Margem de Lucro</h3>
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
