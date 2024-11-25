import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import * as d3 from "d3";

const RegimeBarChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadAndProcessData = async () => {
      try {
        const rawData = await d3.csv("/notas-alunos-2012-2022-corrigido.csv");
        // Group and count occurrences by "Regime" column
        const processedData = d3.rollups(
          rawData,
          (v) => v.length, // Count number of occurrences
          (d) => d.nome_regime // Group by "nome_regime"
        ).map(([key, value]) => ({
          name: key, // Category label
          value,     // Count of occurrences
        }));

        setData(processedData);
      } catch (error) {
        console.error("Error loading or processing data:", error);
      }
    };

    loadAndProcessData();
  }, []);

  return (
    <div>
      <h3>Regime Distribution</h3>
      <BarChart width={730} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip contentStyle={{ backgroundColor: '#2d3448' }}/>
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default RegimeBarChart;
