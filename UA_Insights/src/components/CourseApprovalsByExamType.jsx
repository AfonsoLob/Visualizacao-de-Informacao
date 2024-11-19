import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import * as d3 from "d3";

const CourseApprovalsByExamType = () => {
  const [data, setData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(""); // idisciplinaid selecionada

    useEffect(() => {
      const pollFilterDropdown = () => {
        const filterDropdown = Array.from(document.querySelectorAll("label.block.mb-2"))
          .find((label) => label.textContent === "Disciplina")?.nextElementSibling;

        if (filterDropdown?.value) {
          setSelectedSubject(filterDropdown.value);
          const updateSelectedDisciplina = () => setSelectedSubject(filterDropdown.value);
          filterDropdown.addEventListener("change", updateSelectedDisciplina);

          return () => filterDropdown.removeEventListener("change", updateSelectedDisciplina);
        } else {
          setTimeout(pollFilterDropdown, 100);
        }
      };

      pollFilterDropdown();
    }, []);

  useEffect(() => {
    const processChartData = async () => {
      try {
        const rawData = await d3.csv("/notas-alunos-2012-2022-corrigido.csv"); // Substituir pelo caminho correto

        // Filtrar para a idisciplinaid selecionada
        const filteredData = rawData.filter((d) => d.idisciplinaid === selectedSubject);

        // Filtrar aprovados e agrupar por tipo de exame
        const approvedData = filteredData.filter((d) => +d.aprovado === 1);
        const groupedData = d3.rollups(
          approvedData,
          (v) => v.length,
          (d) => d.nvctipoexame // Agrupar por tipo de exame
        )

        // Converter para o formato necessário
        const formattedData = groupedData.map(([type, count]) => ({
          name: type,
          value: count,
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Erro ao processar os dados:", error);
      }
    };

    if (selectedSubject) {
      processChartData();
    }
  }, [selectedSubject]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFE", "#FF6384"]; // Paleta de cores
  console.log(selectedSubject)
  return (
    <div>
      <h3>Percentagem de Aprovados por Tipo de Exame</h3>

      <PieChart width={600} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          label={(entry) => `${entry.name}: ${entry.value}`}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default CourseApprovalsByExamType;
