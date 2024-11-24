import React, { useEffect, useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import * as d3 from "d3";
import { useFilters } from "../../context/FilterContext";
import { useData } from "../../context/DataContext";

const DepartmentAverageGrade = () => {
  const { rawData, loading: dataLoading } = useData();
  const [filteredData, setFilteredData] = useState([]);
  const { filters } = useFilters();
  const selectedDepartment = filters.Departamento?.value;
  const yearRange = filters.years;

  // Fetch department data
  useEffect(() => {
    if (!selectedDepartment || dataLoading) return;
    const deptData = rawData.filter((d) => d.dep_sigla_oficial === selectedDepartment);
    setFilteredData(deptData);
  }, [selectedDepartment, rawData, dataLoading]);

  // Process data with year range using useMemo
  const data = useMemo(() => {
    if (!filteredData.length) return [];

    // Filter by year range
    const yearFilteredData = filteredData.filter(d => {
      const year = parseInt(d.ianolectivo);
      return year >= yearRange[0] && year <= yearRange[1];
    });

    // Group by year and calculate average grade
    const groupedData = d3.group(yearFilteredData, (d) => d.ianolectivo);
    return Array.from(groupedData, ([year, records]) => {
      const grades = records
        .filter((record) => record.avaliado === "1")
        .map((record) => +record.nota);
      const averageGrade = grades.length ? d3.mean(grades) : null;
      return { 
        year, 
        averageGrade: averageGrade?.toFixed(2) 
      };
    })
    .filter((d) => d.averageGrade !== null)
    .sort((a, b) => a.year - b.year);
  }, [filteredData, yearRange]);

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
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
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
