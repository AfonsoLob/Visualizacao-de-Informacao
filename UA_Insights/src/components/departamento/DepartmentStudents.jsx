import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import * as d3 from "d3";
import { useFilters } from "../../context/FilterContext";

const DepartmentStudents = () => {
  const [data, setData] = useState([]);
  const { filters } = useFilters();
  const selectedDepartment = filters.Departamento?.value;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawData = await d3.csv("/notas-alunos-2012-2022-corrigido.csv");

        // Filter data by selected department
        const filteredData = rawData.filter((d) => d.dep_sigla_oficial === selectedDepartment);

        // Group data by year and course, counting students
        const groupedData = d3.group(filteredData, (d) => d.ianolectivo);
        const processedData = Array.from(groupedData, ([year, records]) => {
          const courseCounts = d3.rollup(
            records,
            (v) => new Set(v.map(d => d.id_estudante)).size, // Count students
            (d) => d.icursocod // Group by course
          );

          // Transform course counts into a single object with dynamic keys
          const courseData = Array.from(courseCounts).reduce(
            (acc, [course, count]) => ({ ...acc, [course]: count }),
            {}
          );

          return { year, ...courseData }; // Include year and course counts
        });

        setData(processedData);
    } catch (error) {
        console.error("Error loading data:", error);
    }
    };
    
    if (selectedDepartment) {
        fetchData();
    }
  }, [selectedDepartment]);

return (
    <div style={{ width: "100%", height: 400 }}>
        <h2>Número de Alunos por Curso no Departamento</h2>
        <ResponsiveContainer>
            <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <Tooltip contentStyle={{ backgroundColor: "#2d3448", color: "#fff" }} />
                <Legend />
                {Array.from(new Set(data.flatMap(Object.keys)))
                    .filter((key) => key !== "year") // Exclude "year" from keys
                    .map((course, index) => (
                        <Bar
                            key={course}
                            dataKey={course}
                            stackId="1"
                            fill={`hsl(${index * 40}, 70%, 50%)`} // Assign dynamic colors
                        />
                    ))}
            </BarChart>
        </ResponsiveContainer>
    </div>
);
};

export default DepartmentStudents;
