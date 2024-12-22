import React, { ReactNode } from 'react';

export interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon?: ReactNode;
  color?: 'indigo' | 'emerald' | 'violet' | 'orange';
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'indigo',
  trend
}) => {
  const colorClasses = {
    indigo: {
      gradient: 'from-indigo-500 to-indigo-600',
      iconBg: 'bg-white/10',
      text: 'text-white'
    },
    emerald: {
      gradient: 'from-emerald-500 to-emerald-600',
      iconBg: 'bg-white/10',
      text: 'text-white'
    },
    violet: {
      gradient: 'from-violet-500 to-violet-600',
      iconBg: 'bg-white/10',
      text: 'text-white'
    },
    orange: {
      gradient: 'from-orange-500 to-orange-600',
      iconBg: 'bg-white/10',
      text: 'text-white'
    }
  };

  const classes = colorClasses[color];

  return (
    <div className={`rounded-xl bg-white border border-gray-200 shadow-sm relative overflow-hidden group transition-all duration-300 hover:shadow-lg`}>
      {/* Header with colored background */}
      <div className={`p-4 bg-gradient-to-r ${classes.gradient}`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-sm font-medium ${classes.text}`}>{title}</h3>
          {icon && (
            <div className={`p-2 rounded-lg ${classes.iconBg}`}>
              {React.cloneElement(icon as React.ReactElement, { 
                className: `h-5 w-5 ${classes.text}`
              })}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">{subtitle}</p>
          {trend && (
            <div className={`flex items-center text-sm font-medium ${
              trend.isPositive ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              <span className="ml-1 text-gray-600">{trend.label}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom border with color */}
      <div className={`h-1 w-full bg-gradient-to-r ${classes.gradient} absolute bottom-0`}></div>
    </div>
  );
};

export default StatCard;
