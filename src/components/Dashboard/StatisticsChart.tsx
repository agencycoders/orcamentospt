import React from 'react';
import {
  AreaChart,
  Area,
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
      return `€${(value / 1000).toLocaleString('pt-BR')}k`;
    }
    return `${value.toLocaleString('pt-BR')}%`;
  };

  const formatTooltip = (value: number) => {
    if (type === 'value') {
      return `€${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }
    return `${value.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}%`;
  };

  const getChartColors = () => {
    if (type === 'value') {
      return {
        stroke: '#4f46e5',
        fill: '#4f46e5',
        gradient: ['rgba(79, 70, 229, 0.1)', 'rgba(79, 70, 229, 0.05)', 'rgba(79, 70, 229, 0.02)']
      };
    }
    return {
      stroke: '#7c3aed',
      fill: '#7c3aed',
      gradient: ['rgba(124, 58, 237, 0.1)', 'rgba(124, 58, 237, 0.05)', 'rgba(124, 58, 237, 0.02)']
    };
  };

  const colors = getChartColors();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`colorGradient${type}`} x1="0" y1="0" x2="0" y2="1">
            {colors.gradient.map((color, index) => (
              <stop
                key={color}
                offset={`${index * 33}%`}
                stopColor={color}
                stopOpacity={1 - (index * 0.2)}
              />
            ))}
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} opacity={0.5} />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
          dy={10}
          padding={{ left: 10, right: 10 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
          tickFormatter={formatYAxis}
          dx={-10}
          width={80}
        />
        <Tooltip
          formatter={formatTooltip}
          cursor={{ stroke: colors.stroke, strokeWidth: 1, strokeDasharray: '4 4' }}
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            padding: '12px'
          }}
          labelStyle={{
            color: '#111827',
            fontWeight: 600,
            marginBottom: '8px'
          }}
          itemStyle={{
            color: colors.stroke,
            fontSize: '14px',
            fontWeight: 500
          }}
        />
        <Area
          type="monotone"
          dataKey={type === 'value' ? 'value' : 'margin'}
          stroke={colors.stroke}
          strokeWidth={2}
          fill={`url(#colorGradient${type})`}
          dot={{ 
            fill: '#fff', 
            stroke: colors.stroke,
            strokeWidth: 2,
            r: 4,
            strokeOpacity: 0.8
          }}
          activeDot={{ 
            r: 6, 
            fill: colors.fill,
            stroke: '#fff',
            strokeWidth: 3,
            boxShadow: '0 0 0 4px rgba(79, 70, 229, 0.2)'
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default StatisticsChart;
