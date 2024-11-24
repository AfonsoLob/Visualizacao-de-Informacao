import React, { useState, useEffect, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import * as d3 from "d3";
import { useFilters } from "../../context/FilterContext";
import { useData } from "../../context/DataContext";
import { Oval } from 'react-loader-spinner';

const ApprovedPercentagePerYear = () => {
  const { rawData, loading: dataLoading } = useData();
  const [rawSubjectData, setRawSubjectData] = useState([]);
  const { filters } = useFilters();
  const selectedSubject = filters.Disciplina?.value;
  const yearRange = filters.years;

  
  // Fetch and process data only when subject changes
  useEffect(() => {
    if (!selectedSubject || dataLoading) return;

    const fetchSubjectData = async () => {
      try {
        const subjectData = rawData.filter((d) => 
          d.idisciplinaid === selectedSubject
        );
        setRawSubjectData(subjectData);
      } catch (error) {
        console.error("Error processing data:", error);
      } 
    };

    if (selectedSubject) {
      fetchSubjectData();
    }
  }, [selectedSubject]); // Only re-run when subject changes

  // Process data based on year range using useMemo
  const displayData = useMemo(() => {
    if (!rawSubjectData.length) return [];

    // Group and filter data by year
    const yearData = d3.group(
      rawSubjectData.filter(d => {
        const year = parseInt(d.ianolectivo);
        return year >= yearRange[0] && year <= yearRange[1];
      }), 
      d => d.ianolectivo
    );

    // Calculate percentages
    return Array.from(yearData, ([year, records]) => {
      const total = records.length;
      const approved = records.filter(d => d.aprovado === "1").length;
      return {
        year,
        percentage: ((approved / total) * 100).toFixed(2)
      };
    }).sort((a, b) => a.year - b.year);
  }, [rawSubjectData, yearRange]); // Recalculate only when raw data or year range changes


return (
  <>
      {dataLoading ? (
                <div className="flex flex-col items-center w-full h-full p-2">
                <div className="flex-1 w-full flex items-center justify-center">
                    <Oval
                        height={80}
                        width={80}
                        color="#4fa94d"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                        ariaLabel='oval-loading'
                        secondaryColor="#4fa94d"
                        strokeWidth={2}
                        strokeWidthSecondary={2}

                    />
                </div>
                </div>
      ) : (
        <div className="w-full">
          <h2>Percentagem de Aprovados por Ano</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={displayData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" stroke="#ffffff" />
              <YAxis stroke="#ffffff" />
              <Tooltip contentStyle={{ backgroundColor: '#2d3448' }} />
              <Legend />
              <Bar dataKey="percentage" fill="#68e713" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      )}
    </>
);
};

export default ApprovedPercentagePerYear;
