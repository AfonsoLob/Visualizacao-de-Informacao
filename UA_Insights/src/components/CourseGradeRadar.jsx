// FILE: src/components/AverageGradeRadar.jsx
import React, { useState, useEffect } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";
import * as d3 from "d3";

const AverageGradeRadar = () => {
  const [data, setData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(""); // Get selected discipline from global state

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
        const rawData = await d3.csv("/notas-alunos-2012-2022-corrigido.csv");

        // Filter data by the selected discipline
        const filteredData = rawData.filter((d) => d.idisciplinaid === selectedSubject);
        console.log(filteredData)
        // Group data by course name and calculate the average grade
        const groupedData = d3.group(filteredData, (d) => d.icursocod); // Código do curso
        const formattedData = Array.from(groupedData, ([subject, records]) => {
          if (records.length > 10) {
            const totalGrades = records.reduce((sum, d) => sum + +d.nota, 0); // Adjust "grade" to your actual field name
            const avgGrade = totalGrades / records.length;

            return { subject, avgGrade: +avgGrade.toFixed(2) };
          }
          return null;
        }).filter(d => d !== null).slice(0, 8); // Limit to the top 8 courses
        console.log(groupedData)
        console.log(formattedData);
        setData(formattedData);
      } catch (error) {
        console.error("Error processing data:", error);
      }
    };

    if (selectedSubject) {
      processChartData();
    }
  }, [selectedSubject]);

  return (
    <div>
      <h2>Average Grade by Course</h2>
      <RadarChart outerRadius={90} width={730} height={250} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 20]} /> {/* Adjust domain based on your grade scale */}
        <Radar
          name="Average Grade"
          dataKey="avgGrade"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
        <Legend />
      </RadarChart>
    </div>
  );
};

export default AverageGradeRadar;
