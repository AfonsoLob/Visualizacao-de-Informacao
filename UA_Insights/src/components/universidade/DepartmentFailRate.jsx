import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useData } from '../../context/DataContext';
import { useFilters } from '../../context/FilterContext';
import { Oval } from 'react-loader-spinner';
import * as d3 from 'd3';

const DepartmentFailRate = () => {
  const { rawData, loading: dataLoading } = useData();
  const { filters } = useFilters();
  const yearRange = filters.years;
  const [visibleDepartments, setVisibleDepartments] = useState(new Set());

  const data = useMemo(() => {
    if (!rawData.length) return [];

    // Filter by year range
    const filteredData = rawData.filter(d => {
      const year = parseInt(d.ianolectivo);
      return year >= yearRange[0] && year <= yearRange[1];
    });

    // Group by year and department
    const yearDeptGroups = d3.group(filteredData, 
      d => d.ianolectivo,
      d => d.dep_sigla_oficial
    );

    // Calculate fail rates and limit to top 10 departments
    const processedData = Array.from(yearDeptGroups, ([year, depts]) => {
      const deptRates = Array.from(depts, ([dept, records]) => {
        const total = records.length;
        const failed = records.filter(d => d.aprovado === "0").length;
        return {
          dept,
          failRate: ((failed / total) * 100).toFixed(2)
        };
      })
      .sort((a, b) => b.failRate - a.failRate)
      .slice(0, 18);

      const result = { year };
      deptRates.forEach(({ dept, failRate }) => {
        result[dept] = failRate;
      });
      return result;
    }).sort((a, b) => a.year - b.year);

    return processedData;
  }, [rawData, yearRange]);

  // Get unique departments for lines
  const departments = useMemo(() => {
    if (!data.length) return [];
    return Object.keys(data[0]).filter(key => key !== 'year');
  }, [data]);

  // Generate colors for departments
  const colors = [
    "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", 
    "#8c564b", "#e377c2", "#ff7f7f", "#bcbd22", "#17becf", 
    "#f7b6d2", "#c7c7c7", "#9edae5", "#ffbb78", "#98df8a", 
    "#ff9896", "#c5b0d5", "#c49c94"
  ];

  const handleLegendClick = (dept) => {
    setVisibleDepartments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dept)) {
        newSet.delete(dept);
      } else {
        newSet.add(dept);
      }
      return newSet;
    });
  };

  const isLineVisible = (dept) => visibleDepartments.has(dept);

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
          <h2 className="text-xl font-bold mt-3 mb-2">Taxa de Reprovação por Departamento</h2>
          <button
            className="mb-4 px-2 py-1 bg-blue-500 text-white rounded"
            onClick={() => {
              if (visibleDepartments.size === departments.length) {
                setVisibleDepartments(new Set());
              } else {
                setVisibleDepartments(new Set(departments));
              }
            }}
          >
            {visibleDepartments.size === departments.length ? 'Ocultar Todos' : 'Mostrar Todos'}
          </button>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" stroke="#ffffff" />
              <YAxis 
                domain={[0, 100]} 
                stroke="#ffffff"
                label={{ 
                  value: 'Taxa de Reprovação (%)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fill: '#ffffff' }
                }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#2d3448' }}
                formatter={(value, name) => [`${value}%`, name]}
                itemSorter={(a) => -parseFloat(a.value)}
              />
              <Legend 
                onClick={(e) => handleLegendClick(e.value)}
                wrapperStyle={{ cursor: 'pointer' }}
                payload={departments.map((dept, index) => ({
                  value: dept,
                  type: 'line',
                  color: colors[index % colors.length],
                  inactive: !isLineVisible(dept)
                }))}
              />
              {departments.map((dept, index) => (
                <Line
                  key={dept}
                  type="monotone"
                  dataKey={dept}
                  stroke={colors[index % colors.length]}
                  name={dept}
                  strokeWidth={2}
                  hide={!isLineVisible(dept)}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
};

export default DepartmentFailRate;