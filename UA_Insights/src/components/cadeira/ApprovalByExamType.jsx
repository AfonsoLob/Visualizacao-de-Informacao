import React, { useState, useEffect } from "react";
import { useFilters } from "../../context/FilterContext";
import { useData } from "../../context/DataContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Oval } from "react-loader-spinner";
import * as d3 from "d3";

const ApprovalByExamType = () => {
  const { rawData, loading: dataLoading } = useData();
  const { filters } = useFilters();
  const [chartData, setChartData] = useState([]);
  const selectedSubject = filters.Disciplina?.value;
  const yearRange = filters.years;

  useEffect(() => {
    if (!selectedSubject || dataLoading) return;

    const processChartData = () => {
      // Filter for the selected subject and year range
      const filteredData = rawData.filter((d) => {
        const year = parseInt(d.ianolectivo);
        return (
          d.idisciplinaid === selectedSubject &&
          year >= yearRange[0] &&
          year <= yearRange[1]
        );
      });

      // Filter approved records and group by year and exam type
      const approvedData = filteredData.filter((d) => +d.aprovado === 1);

      // Get all unique years and exam types in the data
      const allYears = d3.range(yearRange[0], yearRange[1] + 1);
      const allExamTypes = Array.from(new Set(approvedData.map((d) => d.nvctipoexame)));

      // Initialize data structure with 0 counts for all year-exam type combinations
      const groupedData = allYears.map((year) => {
        const yearData = { year };
        allExamTypes.forEach((type) => {
          yearData[type] = 0;
        });
        return yearData;
      });

      // Populate counts for existing data
      approvedData.forEach((d) => {
        const year = parseInt(d.ianolectivo);
        const type = d.nvctipoexame;
        const yearData = groupedData.find((entry) => entry.year === year);
        if (yearData) {
          yearData[type] = (yearData[type] || 0) + 1;
        }
      });

      setChartData(groupedData);
    };

    processChartData();
  }, [rawData, dataLoading, selectedSubject, yearRange]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFE", "#FF6384"]; // Color palette

  return (
    <>
      {dataLoading ? (
        <div className="flex flex-col items-center w-full h-full p-2">
          <div className="flex-1 w-full flex items-center justify-center">
            <Oval
              height={80}
              width={80}
              color="#4fa94d"
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="#4fa94d"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          </div>
        </div>
      ) : (
        <div className="w-full">
          <h3>Evolução de Aprovados por Tipo de Exame</h3>

          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" stroke="#ffffff" />
              <YAxis stroke="#ffffff" />
              <Tooltip />
              <Legend />
              {Object.keys(chartData[0] || {})
                .filter((key) => key !== "year")
                .map((type, index) => (
                  <Line
                    key={type}
                    type="monotone"
                    dataKey={type}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
};

export default ApprovalByExamType;
