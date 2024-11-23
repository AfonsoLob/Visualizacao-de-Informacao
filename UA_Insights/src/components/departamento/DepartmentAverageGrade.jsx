import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import * as d3 from "d3";
import { useFilters } from "../../context/FilterContext";

const DepartmentAverageGrade = () => {
  const [data, setData] = useState([]);
  const { filters } = useFilters();
  const selectedDepartment = filters.Departamento?.value;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawData = await d3.csv("/notas-alunos-2012-2022-corrigido.csv");

        // Filter data by selected department
        const filteredData = rawData.filter((d) => d.dep_sigla_oficial === selectedDepartment);

        // Group by year and calculate average grade
        const groupedData = d3.group(filteredData, (d) => d.ianolectivo);
        const processedData = Array.from(groupedData, ([year, records]) => {
          const grades = records
            .filter((record) => record.avaliado === "1")
            .map((record) => +record.nota);
          const averageGrade = grades.length ? d3.mean(grades) : null;
          return { year, averageGrade: averageGrade?.toFixed(2) }; // Fix to 2 decimal places
        }).filter((d) => d.averageGrade !== null); // Remove years with no grades

        console.log("Recharts Data:", processedData);
        setData(processedData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    if (selectedDepartment) {
      fetchData();
    }
  }, [selectedDepartment]);

const [strokeWidth, setStrokeWidth] = useState(2);
const [dotSize, setDotSize] = useState(5);

useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth < 1100) {
            setStrokeWidth(2);
            setDotSize(3.5);
        } else {
            setStrokeWidth(2);
            setDotSize(5);
        }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call initially to set the correct values

    return () => window.removeEventListener("resize", handleResize);
}, []);

return (
    <div className="w-full">
        <h2>Média das Notas por Ano</h2>
        <ResponsiveContainer width="100%" height={350}>
            <LineChart
                data={data}
                margin={{ top: 20, right: 30, left: 0, bottom: 30 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" stroke="#ffffff" tick={{ fontSize: 12 }} interval={1} />
                <YAxis
                    stroke="#ffffff"
                    domain={[0, 20]} // Assuming grade range is 0-20
                />
                <Tooltip contentStyle={{ backgroundColor: "#2d3448", color: "#fff" }} />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="averageGrade"
                    stroke="#68e713"
                    strokeWidth={strokeWidth}
                    dot={{ fill: "#ffffff", strokeWidth: strokeWidth, r: dotSize }}
                />
            </LineChart>
        </ResponsiveContainer>
    </div>
);
};

export default DepartmentAverageGrade;
