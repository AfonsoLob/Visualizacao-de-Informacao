import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import * as d3 from "d3";

const ApprovedByExamTypeChart = () => {
  const [data, setData] = useState([]);
  const [subjects, setSubjects] = useState([]); // Lista de idisciplinaids disponíveis
  const [selectedSubject, setSelectedSubject] = useState(""); // idisciplinaid selecionada

  useEffect(() => {
    const loadData = async () => {
      try {
        // Carregar os dados do CSV
        const rawData = await d3.csv("/notas-alunos-2012-2022-corrigido.csv"); // Substituir pelo caminho correto

        // Obter a lista única de idisciplinaids
        const subjectList = Array.from(new Set(rawData.map((d) => d.idisciplinaid))).sort();
        setSubjects(subjectList);

        // Definir uma idisciplinaid padrão (primeira na lista)
        if (subjectList.length > 0) {
          setSelectedSubject(subjectList[0]);
        }
      } catch (error) {
        console.error("Erro ao carregar os dados:", error);
      }
    };

    loadData();
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

      {/* Selector para a idisciplinaid */}
      <label>
        Selecione o código da disciplina:{" "}
        <select
          style={{backgroundColor: "#ffffff", color: "#2d3448"}}
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </label>

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

export default ApprovedByExamTypeChart;
