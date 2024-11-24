import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as d3 from 'd3';
import { useFilters } from '../../context/FilterContext';
import { Oval } from 'react-loader-spinner';
import { useData } from "../../context/DataContext";


const WorstSubjects = () => {
  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);
  const [currentYear, setCurrentYear] = useState(null);
  const { rawData, loading: dataLoading } = useData();
  const { filters } = useFilters();
  const selectedCourse = filters.Curso?.value;

  useEffect(() => {
    if (!selectedCourse || dataLoading) return;

    const fetchData = async () => {
        // Filter for selected course
        const courseData = rawData.filter(d => d.icursocod === selectedCourse);
        
        // Get unique years
        const uniqueYears = [...new Set(courseData.map(d => d.ianolectivo))].sort();
        setYears(uniqueYears);
        setCurrentYear(uniqueYears[0]);

        // Process data for all years
        const processedData = uniqueYears.reduce((acc, year) => {
          const yearData = courseData.filter(d => d.ianolectivo === year);
          
          // Group by subject and calculate fail rate
          const subjectStats = d3.group(yearData, d => d.idisciplinaid);
          const subjectFailRates = Array.from(subjectStats, ([subject, records]) => {
            const total = records.length;
            const failed = records.filter(d => d.aprovado === "0").length;
            const failRate = (failed / total) * 100;
            
            return {
              subject,
              failRate: failRate.toFixed(2),
              name: records[0].idisciplinaid // You might want to map this to actual subject names
            };
          });

          // Sort by fail rate and get top 5
          const top5 = Array.from(subjectStats)
            .map(([subject, records]) => ({
                subject,
                failRate: (records.filter(d => d.aprovado === "0").length / records.length * 100).toFixed(2),
                name: records[0].idisciplinaid
            }))
            .sort((a, b) => b.failRate - a.failRate)
            .slice(0, 5);

          acc[year] = top5;
          return acc;
        }, {});

        setData(processedData);
    };

    if (selectedCourse) {
      fetchData();
    }
  }, [selectedCourse]);

  const handleYearChange = (year) => {
    setCurrentYear(year);
  };

  return (
    <div className="w-full h-[500px] p-4">
      {dataLoading ? (
        <div className="flex items-center justify-center h-full">
          <Oval
            height={80}
            width={80}
            color="#4fa94d"
            secondaryColor="#4fa94d"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Top 5 Cadeiras com Maior Taxa de Reprovação</h2>
            <div className="flex gap-1 overflow-x-auto">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearChange(year)}
                  className={`px-2 py-1 rounded text-sm ${
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

          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data[currentYear] || []}
                margin={{ top: 20, right: 30, left: 40, bottom: 40 }}
                barSize={40}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                  fontSize={12}
                />
                <YAxis 
                  stroke="#ffffff"
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#2d3448' }}
                  formatter={(value) => [`${value}%`, 'Taxa de Reprovação']}
                />
                <Bar 
                  dataKey="failRate" 
                  fill="#ff4d4d"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorstSubjects;