import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import * as d3 from "d3";
import { useFilters } from "../../context/FilterContext";

const ApprovedPercentagePerYear = () => {
  const [data, setData] = useState([]);
  const { filters } = useFilters();
  const selectedSubject = filters.Disciplina?.value;
  const yearRange = filters.years;
  
  
  useEffect(() => {
    const processChartData = async () => {
      try {
        const rawData = await d3.csv("/notas-alunos-2012-2022-corrigido.csv");
        const filteredData = rawData.filter((d) => {
          const year = parseInt(d.ianolectivo);
          return (
            d.idisciplinaid === selectedSubject &&
            year >= yearRange[0] &&
            year <= yearRange[1]
          );
        });
  
        const yearData = d3.group(filteredData, d => d.ianolectivo);

        const formattedData = Array.from(yearData, ([year, records]) => {
          const total = records.length;
          const approved = records.filter(d => d.aprovado === "1").length;
          return {
            year,
            percentage: ((approved / total) * 100).toFixed(2)
          };
        }).sort((a, b) => a.year - b.year);
  
        setData(formattedData);
      } catch (error) {
        console.error("Error processing data:", error);
      }
    };
  
    if (selectedSubject) {
      processChartData();
    }
  }, [selectedSubject, yearRange]); 


  // useEffect(() => {
  //   const logSubjectChange = () => {
  //     console.group('Subject Selection Update');
  //     console.log('Current Subject:', selectedSubject);
  //     console.log('Time:', new Date().toLocaleTimeString());
  //     console.groupEnd();
  //   };
  
  //   logSubjectChange();
  // }, [selectedSubject]);

return (
  <>
      {!selectedSubject ? (
        <div>
          <h2 className="text-gray-500 font-bold">Selecione uma disciplina para visualizar os dados!</h2>
        </div>
      ) : (
        <div className="w-full">
          <h2>Percentagem de Aprovados por Ano</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
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
