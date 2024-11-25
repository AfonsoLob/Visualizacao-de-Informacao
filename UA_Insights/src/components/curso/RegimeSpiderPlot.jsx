import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from "../../context/DataContext";
import { useFilters } from "../../context/FilterContext";
import { Oval } from 'react-loader-spinner';
import * as d3 from "d3";

const RegimeSpiderPlot = () => {
  const { rawData, loading: dataLoading } = useData();
  const { filters } = useFilters();
  const selectedCourse = filters.Curso?.value;
  const yearRange = filters.years;

  const data = useMemo(() => {
    if (!rawData.length || !selectedCourse) return [];

    // Filter for selected course, exclude "Ordinário" and respect year range
    const courseData = rawData.filter(d => {
      const year = parseInt(d.ianolectivo);
      return d.icursocod === selectedCourse && 
             d.nome_regime !== "Ordinário" &&
             year >= yearRange[0] && 
             year <= yearRange[1];
    });
    
    // Group by year and regime
    const yearData = d3.group(courseData, d => d.ianolectivo);
    
    // Process data for stacked bar chart
    return Array.from(yearData, ([year, records]) => {
      const regimeCounts = d3.rollup(
        records,
        v => new Set(v.map(d => d.id_estudante)).size,
        d => d.nome_regime
      );
      
      return {
        year,
        ...Object.fromEntries(regimeCounts)
      };
    }).sort((a, b) => a.year - b.year);
  }, [rawData, selectedCourse, yearRange]);

  // Get unique regimes for creating Bars
  const regimes = useMemo(() => {
    if (!data.length) return [];
    return Object.keys(data[0]).filter(key => key !== 'year');
  }, [data]);

  // Generate colors
  const colors = ['#68e713', '#ff7300', '#8884d8', '#82ca9d', '#ffc658'];

  return (
    <>
      {dataLoading ? (
        <div className="flex items-center justify-center h-full">
          <Oval
            height={80}
            width={80}
            color="#68e713"
            secondaryColor="#4fa94d"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      ) : (
        <div className="w-full">
          <h2 className="text-xl font-bold mb-4">Regimes por Ano</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" stroke="#ffffff" />
              <YAxis stroke="#ffffff" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#2d3448' }}
                formatter={(value, name) => [value, name]}
              />
              {regimes.map((regime, index) => (
                <Bar
                  key={regime}
                  dataKey={regime}
                  stackId="a"
                  fill={colors[index % colors.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
};

export default RegimeSpiderPlot;