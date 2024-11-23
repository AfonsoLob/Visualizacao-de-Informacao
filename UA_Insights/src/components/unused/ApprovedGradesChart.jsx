// src/components/ApprovedGradesChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ApprovedGradesChart = ({ data }) => {
  // Transform data for Recharts
  const transformedData = Array.from(
    d3.group(data, d => d.ianolectivo),
    ([year, records]) => ({
      year,
      approved: records.filter(d => d.aprovado === 1).length,
      total: records.length
    })
  ).sort((a, b) => a.year - b.year);

  return (
    <div className="w-full h-[400px] bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Approved Grades by Year</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={transformedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="year" 
            label={{ value: 'Year', position: 'bottom' }}
          />
          <YAxis 
            label={{ value: 'Number of Students', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="approved"
            stroke="#8884d8"
            name="Approved"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#82ca9d"
            name="Total"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ApprovedGradesChart;