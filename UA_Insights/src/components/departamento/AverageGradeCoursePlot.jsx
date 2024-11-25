import React, { useState, useMemo } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { useData } from "../../context/DataContext";
import { useFilters } from "../../context/FilterContext";
import { Oval } from 'react-loader-spinner';
import * as d3 from "d3";

const AverageGradeCoursePlot = () => {
  const { rawData, loading: dataLoading } = useData();
  const { filters } = useFilters();
  const selectedDepartment = filters.Departamento?.value;
  const [currentYear, setCurrentYear] = useState(null);

  const { data, years } = useMemo(() => {
    if (!rawData.length || !selectedDepartment) return { data: {}, years: [] };

    // Filter for department
    const deptData = rawData.filter(d => 
      d.dep_sigla_oficial === selectedDepartment
      //d.aprovado === "1" // Only approved grades
    );

    // Get unique years
    const uniqueYears = [...new Set(deptData.map(d => d.ianolectivo))].sort();

    // Group by year and course
    const yearData = d3.group(deptData, d => d.ianolectivo);

    // Calculate average grades for each course per year
    const processedData = {};
    yearData.forEach((records, year) => {
      const courseAverages = Array.from(
        d3.group(records, d => d.icursocod),
        ([course, grades]) => ({
          course,
          average: d3.mean(grades.map(g => +g.nota)).toFixed(2)
        })
      );
      processedData[year] = courseAverages;
    });

    return {
      data: processedData,
      years: uniqueYears
    };
  }, [rawData, selectedDepartment]);

  // Set initial year
  React.useEffect(() => {
    if (years.length > 0 && !currentYear) {
      setCurrentYear(years[0]);
    }
  }, [years]);

  const courseData = useMemo(() => {
    if (!currentYear || !data[currentYear]) return [];
    return data[currentYear];
  }, [data, currentYear]);

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
          <h2 className="text-xl font-bold mb-2">Média por Curso</h2>

          {currentYear && (
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={courseData}>
                <PolarGrid stroke="#ffffff" />
                <PolarAngleAxis
                  dataKey="course"
                  stroke="#ffffff"
                  tick={{ fill: '#ffffff' }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 20]}
                  stroke="#ffffff"
                  tick={{ fill: '#ffffff' }}
                  tickFormatter={(value) => value === 20 ? '' : value}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#2d3448' }}
                  formatter={(value) => [`${value}`, 'Média']}
                />
                <Radar
                  name="Média"
                  dataKey="average"
                  stroke="#68e713"
                  fill="#68e713"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
            
          )}
            {/* Year Pagination - Horizontal Scrollable */}
            <div className="w-full overflow-x-auto mb-4 pb-2">
            <div className="flex gap-1 min-w-max px-2">
                {years.map(year => (
                <button
                    key={year}
                    onClick={() => setCurrentYear(year)}
                    className={`px-3 py-1 rounded whitespace-nowrap ${
                    currentYear === year 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    {year}
                </button>
                ))}
            </div>
            </div>
        </div>
        )}
    </>
  );
};

export default AverageGradeCoursePlot;