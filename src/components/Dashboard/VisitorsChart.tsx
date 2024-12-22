import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface VisitorsChartProps {
  data: {
    name: string;
    value: number;
    color: string;
    percentage: number;
  }[];
}

const VisitorsChart = ({ data }: VisitorsChartProps) => {
  return (
    <div className="bg-white p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Visitors</h3>
        <select className="px-3 py-1 border rounded-lg text-sm">
          <option>This Month</option>
          <option>Last Month</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="flex">
        <div className="w-1/2">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="w-1/2 space-y-4">
          {data.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">{item.name}</span>
                <span className="text-sm font-semibold">{item.value}k</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VisitorsChart;