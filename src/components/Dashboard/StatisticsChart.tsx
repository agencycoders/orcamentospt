import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface DataPoint {
  month: string;
  value: number;
  margin: number;
}

interface StatisticsChartProps {
  data: DataPoint[];
  type?: 'value' | 'margin';
}

const StatisticsChart: React.FC<StatisticsChartProps> = ({ data, type = 'value' }) => {
  const formatYAxis = (value: number) => {
    if (type === 'value') {
      return `R$ ${(value / 1000).toLocaleString('pt-BR')}k`;
    }
    return `${value.toLocaleString('pt-BR')}%`;
  };

  const formatTooltip = (value: number) => {
    if (type === 'value') {
      return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }
    return `${value.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}%`;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6B7280' }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6B7280' }}
          tickFormatter={formatYAxis}
        />
        <Tooltip
          formatter={formatTooltip}
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
          labelStyle={{
            color: '#374151',
            fontWeight: 500,
            marginBottom: '4px'
          }}
        />
        <Line
          type="monotone"
          dataKey={type === 'value' ? 'value' : 'margin'}
          stroke="#2563EB"
          strokeWidth={2}
          dot={{ fill: '#2563EB', strokeWidth: 2 }}
          activeDot={{ r: 6, fill: '#2563EB' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default StatisticsChart;
