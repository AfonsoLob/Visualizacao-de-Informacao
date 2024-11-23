import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import * as d3 from "d3";
import { useFilters } from "../../context/FilterContext";

const ApprovedPercentagePerYear = () => {
  const [data, setData] = useState([]);
  const { filters } = useFilters();
  const selectedSubject = filters.subject?.value;
    
  // // Wait for the filter dropdown to be available and set its initial value
  // useEffect(() => {
  //     const pollFilterDropdown = () => {
  //         const filterDropdown = Array.from(document.querySelectorAll("label.block.mb-2"))
  //         .find((label) => label.textContent === "Disciplina")?.nextElementSibling;
  
  //         if (filterDropdown?.value) {
  //         setSelectedSubject(filterDropdown.value);
  //         const updateSelectedDisciplina = () => setSelectedSubject(filterDropdown.value);
  //         filterDropdown.addEventListener("change", updateSelectedDisciplina);
          
  
  //         return () => filterDropdown.removeEventListener("change", updateSelectedDisciplina);
  //         } else {
  //         setTimeout(pollFilterDropdown, 100);
  //         }
  //     };
  
  //     pollFilterDropdown();
  //     }, []);
  
  useEffect(() => {
    const processChartData = async () => {
      try {
        const rawData = await d3.csv("/notas-alunos-2012-2022-corrigido.csv");
        const filteredData = rawData.filter((d) => 
          d.idisciplinaid === selectedSubject && 
          d.ianolectivo >= filters.years[0] && 
          d.ianolectivo <= filters.years[1]
        );

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
  }, [selectedSubject, filters.years]);

return (
  <>
      {!selectedSubject ? (
        <div>
          <h2 className="text-gray-500 font-bold">Selecione uma disciplina para visualizar os dados!</h2>
        </div>
      ) : (
        <div>
          <h2>Percentagem de Aprovados por Ano</h2>
          <BarChart
            width={700}
            height={250}
            data={data}
            margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <Tooltip contentStyle={{ backgroundColor: '#2d3448' }} />
            <Legend />
            <Bar dataKey="percentage" fill="#68e713" />
          </BarChart>
        </div>
      )}
    </>
);
};

export default ApprovedPercentagePerYear;
