import React, { useEffect, useState, useMemo } from "react";
import { ComposedChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend, Line } from "recharts";
import { useFilters } from "../../context/FilterContext";
import { useCourseMapping } from "../../context/courseContext";
import { useData } from "../../context/DataContext";
import * as d3 from "d3";

const DepartmentStudents = () => {
  const { rawData, loading: dataLoading } = useData();
  const [activeChart, setActiveChart] = useState("Licenciaturas");
  const { filters } = useFilters();
  const selectedDepartment = filters.Departamento?.value;
  const yearRange = filters.years;
  const courseMapping = useCourseMapping();

  const processedData = useMemo(() => {
    if (!selectedDepartment || dataLoading) return {
      licenciaturaData: [],
      mestradoData: [],
      integradoData: []
    };

    // Filter by selected department and year range
    const departmentData = rawData.filter((d) => 
      d.dep_sigla_oficial === selectedDepartment &&
      parseInt(d.ianolectivo) >= yearRange[0] &&
      parseInt(d.ianolectivo) <= yearRange[1]
    );

    // Separate courses by "sigla_grau"
    const licenciaturaCourses = departmentData.filter((d) => d.sigla_grau === "L1");
    const mestradoCourses = departmentData.filter((d) => d.sigla_grau === "M2");
    const mestradoIntegrado = departmentData.filter((d) => d.sigla_grau === "MI");

    // Process data for each type
    const groupByYear = (data) => {
      const groupedByYear = d3.group(data, (d) => d.ianolectivo);
      return Array.from(groupedByYear, ([year, records]) => {
        const courseCounts = d3.rollup(
          records,
          (v) => new Set(v.map((d) => d.id_estudante)).size,
          (d) => d.icursocod
        );

        const totalStudents = new Set(records.map((d) => d.id_estudante)).size;

        return {
          year,
          ...Object.fromEntries(courseCounts),
          total: totalStudents,
        };
      }).sort((a, b) => a.year - b.year);
    };

    return {
      licenciaturaData: groupByYear(licenciaturaCourses),
      mestradoData: groupByYear(mestradoCourses),
      integradoData: groupByYear(mestradoIntegrado)
    };
  }, [selectedDepartment, rawData, dataLoading, yearRange]);

  const { licenciaturaData, mestradoData, integradoData } = processedData;

  const renderChart = (data, courses) => (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" stroke="#ffffff" />
        <YAxis stroke="#ffffff" />
        <Tooltip 
          contentStyle={{ backgroundColor: "#2d3448", color: "#fff" }}
          formatter={(value, name) => {
            if (name === "Total") return [value, "Total"];
            return [value, name];
          }}
        />
        <Legend />
        {courses
          .filter((key) => key !== "year" && key !== "total")
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
                name={label}
                stackId="1"
                fill={`hsl(${index * 40}, 70%, 50%)`}
              />
            );
          })}
        <Line
          type="monotone"
          dataKey="total"
          name="Total"
          stroke="#ffffff"
          strokeWidth={2}
          dot={{ fill: '#000000', stroke: '#ffffff', r: 4 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h2 className="text-xl font-bold my-1">Número de Alunos no Departamento</h2>

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

      {activeChart === "Licenciaturas" && renderChart(
        licenciaturaData,
        Array.from(new Set(licenciaturaData.flatMap(Object.keys)))
      )}
      {activeChart === "Mestrados" && renderChart(
        mestradoData,
        Array.from(new Set(mestradoData.flatMap(Object.keys)))
      )}
      {activeChart === "Integrados" && renderChart(
        integradoData,
        Array.from(new Set(integradoData.flatMap(Object.keys)))
      )}
    </div>
  );
};

export default DepartmentStudents;