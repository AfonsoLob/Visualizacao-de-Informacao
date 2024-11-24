import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import * as d3 from "d3";
import { useData } from "../../context/DataContext";
import { useFilters } from "../../context/FilterContext";

const ApprovalPerYearChart = () => {
  const { rawData, loading: dataLoading } = useData();
  const { filters } = useFilters();
  const yearRange = filters.years;

  const data = useMemo(() => {
    if (!rawData.length) return [];

    // Filter by year range
    const filteredData = rawData.filter(d => {
      const year = parseInt(d.ianolectivo);
      return year >= yearRange[0] && year <= yearRange[1];
    });

    // Process the data: Group by 'ianolectivo' and calculate the approval percentage
    const approvalData = d3.group(filteredData, (d) => +d.ianolectivo);
    
    return Array.from(approvalData, ([year, records]) => {
      const total = records.length;
      const approved = records.filter((d) => +d.aprovado === 1).length;
      return {
        year,
        percentage: ((approved / total) * 100).toFixed(2)
      };
    }).sort((a, b) => a.year - b.year);
  }, [rawData, yearRange]);

  return (
    <div className="w-full">
      <h3>Taxa de Aprovados / Ano</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" stroke="#ffffff" />
          <YAxis stroke="#ffffff" />
          <Tooltip contentStyle={{ backgroundColor: '#2d3448' }} />
          <Line
            type="monotone"
            dataKey="percentage"
            stroke="#68e713"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ApprovalPerYearChart;