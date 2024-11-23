import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import * as d3 from "d3";
import { useFilters } from "../../context/FilterContext";

const CompletionYearsDistribution = () => {
  const [data, setData] = useState([]);
  const { filters } = useFilters();
  const selectedCurso = filters.Curso?.value;

  useEffect(() => {
    const processChartData = async () => {
      try {
        const rawData = await d3.csv("/notas-alunos-2012-2022-corrigido.csv");

        // Filter data by selected course and first semester
        const filteredData = rawData.filter(
          (d) =>
            d.icursocod === selectedCurso && d.nvcepocaexame === "1º SEMESTRE"
        );

        // Group by student ID
        const studentGroups = d3.group(filteredData, (d) => d.id_estudante);
        // Count the distinct years for each student
        const completionYears = Array.from(studentGroups.values()).map((records) => {
          const years = Array.from(new Set(records.map((d) => d.ianolectivo))).sort();

          // Check if the student is absent in the next year
          let lastYear = Math.max(...years.map((y) => parseInt(y)));
          const appearsInNextYear = rawData.some(
            (d) => d.id_estudante === records[0].id_estudante && parseInt(d.ianolectivo) > lastYear
          );

          return appearsInNextYear ? years.length + 1 : years.length;
        });

        // Categorize students
        console.log(completionYears);
        const categories = { "3 Years": 0, "4 Years": 0, "5+ Years": 0 };
        completionYears.forEach((years) => {
          if (years === 3) categories["3 Years"] += 1;
          else if (years === 4) categories["4 Years"] += 1;
          else if (years >= 5) categories["5+ Years"] += 1;
        });

        // Format data for chart
        const chartData = Object.keys(categories).map((key) => ({
          category: key,
          count: categories[key],
        }));

        setData(chartData);
      } catch (error) {
        console.error("Error processing data:", error);
      }
    };

    if (selectedCurso) {
      processChartData();
    }
  }, [selectedCurso]);

  return (
    <div>
      {!selectedCurso ? (
        <div>
          <h2 className="text-gray-500 font-bold">Selecione um curso para visualizar os dados!</h2>
        </div>
      ) : (
        <div>
          <h2>Distribuição de Anos para Completar o Curso</h2>
          <BarChart
            width={700}
            height={250}
            data={data}
            margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <Tooltip contentStyle={{ backgroundColor: "#2d3448" }} />
            <Legend />
            <Bar dataKey="count" fill="#68e713" />
          </BarChart>
        </div>
      )}
    </div>
  );
};

export default CompletionYearsDistribution;
