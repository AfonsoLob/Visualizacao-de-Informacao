import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { useFilters } from "../../context/FilterContext";
import { useCourseMapping } from "../../context/courseContext";
import { useData } from "../../context/DataContext";
import * as d3 from "d3";

const DepartmentStudents = () => {
  const { rawData, loading: dataLoading } = useData();
  const [licenciaturaData, setLicenciaturaData] = useState([]);
  const [mestradoData, setMestradoData] = useState([]);
  const [integradoData, setIntegradoData] = useState([]);
  const [activeChart, setActiveChart] = useState("Licenciaturas"); // Controls which chart is shown
  const { filters } = useFilters();
  const selectedDepartment = filters.Departamento?.value;
  const courseMapping = useCourseMapping();

  useEffect(() => {
    if (!selectedDepartment || dataLoading) return;

    const fetchData = async () => {
      try {
        // Filter by selected department
        const departmentData = rawData.filter((d) => d.dep_sigla_oficial === selectedDepartment);

        // Separate courses by "sigla_grau"
        const licenciaturaCourses = departmentData.filter((d) => d.sigla_grau === "L1");
        const mestradoCourses = departmentData.filter((d) => d.sigla_grau === "M2");
        const mestradoIntegrado = departmentData.filter((d) => d.sigla_grau === "MI");

        // Process data for stacked bar chart
        const groupByYear = (data) => {
          const groupedByYear = d3.group(data, (d) => d.ianolectivo);
          return Array.from(groupedByYear, ([year, records]) => {
            const courseCounts = d3.rollup(
              records,
              (v) => new Set(v.map((d) => d.id_estudante)).size,
              (d) => d.icursocod
            );

            return {
              year,
              ...Object.fromEntries(courseCounts),
            };
          });
        };

        setLicenciaturaData(groupByYear(licenciaturaCourses));
        setMestradoData(groupByYear(mestradoCourses));
        setIntegradoData(groupByYear(mestradoIntegrado));
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    if (selectedDepartment) {
      fetchData();
    }
  }, [rawData, dataLoading, selectedDepartment]);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h2>Número de Alunos no Departamento</h2>

      {/* Buttons for toggling */}
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => setActiveChart("Licenciaturas")}
          style={{
            padding: "5px 10px",
            margin: "0 10px",
            backgroundColor: activeChart === "Licenciaturas" ? "#4CAF50" : "#ccc",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Licenciaturas
        </button>
        <button
          onClick={() => setActiveChart("Mestrados")}
          style={{
            padding: "5px 10px",
            margin: "0 10px",
            backgroundColor: activeChart === "Mestrados" ? "#4CAF50" : "#ccc",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Mestrados
        </button>
        <button
          onClick={() => setActiveChart("Integrados")}
          style={{
            padding: "5px 10px",
            margin: "0 10px",
            backgroundColor: activeChart === "Integrados" ? "#4CAF50" : "#ccc",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          M. Integrados
        </button>
      </div>

      {/* Conditionally render the active chart */}
      {activeChart === "Licenciaturas" && (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={licenciaturaData}
            margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <Tooltip contentStyle={{ backgroundColor: "#2d3448", color: "#fff" }} />
            <Legend />
            {Array.from(new Set(licenciaturaData.flatMap(Object.keys)))
              .filter((key) => key !== "year")
              .map((course, index) => {
                const courseDetails = courseMapping[course];
                const words = courseDetails ? courseDetails.nome.split(' ') : [];
                const label = words.length > 1
                  ? words.map(word => word.length > 3 ? word.charAt(0) : '').join('')
                  : courseDetails ? courseDetails.nome : course;

                return (
                  <Bar
                    key={course}
                    dataKey={course}
                    name={label} // Custom label for the legend
                    stackId="1"
                    fill={`hsl(${index * 40}, 70%, 50%)`}
                  />
                );
              })}
          </BarChart>
        </ResponsiveContainer>
      )}

      {activeChart === "Mestrados" && (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={mestradoData}
            margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <Tooltip contentStyle={{ backgroundColor: "#2d3448", color: "#fff" }} />
            <Legend />
            {Array.from(new Set(mestradoData.flatMap(Object.keys)))
              .filter((key) => key !== "year")
              .map((course, index) => {
                const courseDetails = courseMapping[course];
                const words = courseDetails ? courseDetails.nome.split(' ') : [];
                const label = words.length > 1
                  ? words.map(word => word.length > 3 ? word.charAt(0) : '').join('')
                  : courseDetails ? courseDetails.nome : course;

                return (
                  <Bar
                    key={course}
                    dataKey={course}
                    name={label} // Custom label for the legend
                    stackId="1"
                    fill={`hsl(${index * 40}, 70%, 50%)`}
                  />
                );
              })}
          </BarChart>
        </ResponsiveContainer>
      )}

      {activeChart === "Integrados" && (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={integradoData}
            margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <Tooltip contentStyle={{ backgroundColor: "#2d3448", color: "#fff" }} />
            <Legend />
            {Array.from(new Set(integradoData.flatMap(Object.keys)))
              .filter((key) => key !== "year")
              .map((course, index) => {
                const courseDetails = courseMapping[course];
                const words = courseDetails ? courseDetails.nome.split(' ') : [];
                const label = words.length > 1
                  ? words.map(word => word.length > 3 ? word.charAt(0) : '').join('')
                  : courseDetails ? courseDetails.nome : course;

                return (
                  <Bar
                    key={course}
                    dataKey={course}
                    name={label} // Custom label for the legend
                    stackId="1"
                    fill={`hsl(${index * 40}, 70%, 50%)`}
                  />
                );
              })}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default DepartmentStudents;
