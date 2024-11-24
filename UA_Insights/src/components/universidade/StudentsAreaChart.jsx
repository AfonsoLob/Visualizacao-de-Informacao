import React, { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import * as d3 from "d3";
import { useData } from "../../context/DataContext";
import { useFilters } from "../../context/FilterContext";

const StudentsAreaChart = () => {
  const { rawData, loading: dataLoading } = useData();
  const { filters } = useFilters();
  const yearRange = filters.years;

  const data = useMemo(() => {
    if (!rawData.length) return [];

    // Filter data by year range
    const filteredData = rawData.filter(d => {
      const year = parseInt(d.ianolectivo);
      return year >= yearRange[0] && year <= yearRange[1];
    });

    // Process the data: Rollup to group by 'ianolectivo' and count unique 'id_estudantes'
    const studentsPerYear = d3.rollups(
      filteredData,
      (v) => new Set(v.map(d => d.id_estudante)).size,
      (d) => +d.ianolectivo
    );

    // Transform data into the format Recharts expects
    return studentsPerYear
      .map(([year, estudantes]) => ({
        name: year,
        estudantes,
      }))
      .sort((a, b) => a.name - b.name);
  }, [rawData, yearRange]);

  return (
    <div className="w-full">
      <h3>Estudantes / Ano</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#ffffff" />
          <YAxis stroke="#ffffff" />
          <Tooltip contentStyle={{ backgroundColor: '#2d3448' }} />
          <Area
            type="monotone"
            dataKey="estudantes"
            stroke="#68e713"
            fill="#68e713"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StudentsAreaChart;