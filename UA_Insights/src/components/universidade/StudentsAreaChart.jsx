import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import * as d3 from "d3";

const StudentsAreaChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load the CSV data
        const rawData = await d3.csv("/notas-alunos-2012-2022-corrigido.csv"); // Replace with your CSV path

        // Process the data: Rollup to group by 'ianolectivo' and count unique 'id_estudantes'
        const studentsPerYear = d3.rollups(
          rawData,
          (v) => new Set(v.map(d => d.id_estudante)).size, // Count unique 'id_estudante'
          (d) => +d.ianolectivo // Ensure 'ianolectivo' is treated as a number
        );

        // Transform data into the format Recharts expects
        const formattedData = studentsPerYear.map(([year, estudantes]) => ({
          name: year,
          estudantes,
        }));
        console.log(formattedData);
        setData(formattedData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="w-full">
      <h3>Estudantes / Ano</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorestudantes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#68e713" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#68e713" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tickFormatter={(tick) => d3.format("d")(tick)} stroke="#ffffff" />
          <YAxis stroke="#ffffff"/>
          <Tooltip contentStyle={{ backgroundColor: '#2d3448' }}/>
          <Area
            type="monotone"
            dataKey="estudantes"
            stroke="#68e713"
            fillOpacity={1}
            fill="url(#colorestudantes)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StudentsAreaChart;
