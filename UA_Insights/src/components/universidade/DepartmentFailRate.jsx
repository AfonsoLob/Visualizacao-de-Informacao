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
      .sort((a, b) => b.failRate - a.failRate) // Sort by fail rate descending
      .slice(0, 18); // Take top 10

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
    "#1f77b4", // Blue
    "#ff7f0e", // Orange
    "#2ca02c", // Green
    "#d62728", // Red
    "#9467bd", // Purple
    "#8c564b", // Brown
    "#e377c2", // Pink
    "#7f7f7f", // Gray
    "#bcbd22", // Lime
    "#17becf", // Cyan
    "#f7b6d2", // Light Pink
    "#c7c7c7", // Light Gray
    "#9edae5", // Light Cyan
    "#ffbb78", // Light Orange
    "#98df8a", // Light Green
    "#ff9896", // Light Red
    "#c5b0d5", // Light Purple
    "#c49c94"  // Light Brown
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

  const resetDepartments = () => {
    setVisibleDepartments(new Set());
  };

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
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
                itemSorter={(a) => -parseFloat(a.value)} // Sort in descending order
              />
              <Legend 
                onClick={(e) => handleLegendClick(e.value)}
                wrapperStyle={{ cursor: 'pointer' }} // Change cursor to pointer
              />
              {departments.map((dept, index) => (
                visibleDepartments.has(dept) ? null : (
                  <Line
                    key={dept}
                    type="monotone"
                    dataKey={dept}
                    stroke={colors[index % colors.length]}
                    name={dept}
                    strokeWidth={2}
                  />
                )
              ))}
            </LineChart>
          </ResponsiveContainer>
          <button 
            onClick={resetDepartments}
            className="my-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 text-sm"
          >
            Reset Departments
          </button>
        </div>
      )}
    </>
  );
};

export default DepartmentFailRate;