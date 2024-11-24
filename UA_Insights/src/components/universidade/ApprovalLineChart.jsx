import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import * as d3 from "d3";
import { useData } from "../../context/DataContext";

const ApprovalPerYearChart = () => {
  const [data, setData] = useState([]);
  const {rawData, loading: dataLoading} = useData();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Process the data: Group by 'ianolectivo' and calculate the approval percentage
        const approvalData = d3.group(rawData, (d) => +d.ianolectivo); // Ensure year is numeric
        const approvalPercentage = Array.from(approvalData, ([year, records]) => {
          const total = records.length;
          const approved = records.filter((d) => +d.aprovado === 1).length;
          return { year, percentage: (approved / total) * 100 };
        });

        setData(approvalPercentage);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

return (
    <div className="w-full">
        <h3>Taxa de Aprovados / Ano</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 0, bottom: 0 }}
          >
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="year" tickFormatter={(tick) => d3.format("d")(tick)} stroke="#ffffff"/>
              <Tooltip contentStyle={{ backgroundColor: '#2d3448' }} formatter={(value) => `${value.toFixed(2)}%`} />
              <Legend />
              <YAxis domain={[0, 100]} stroke="#ffffff"/>
              <Line type="monotone" dataKey="percentage" stroke="#68e713" />
          </LineChart>
        </ResponsiveContainer>
    </div>
);
};

export default ApprovalPerYearChart;
