import React, { useState, useEffect, useMemo } from 'react';
import * as d3 from "d3";
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFilters } from '../../context/FilterContext';
import { useData } from "../../context/DataContext";
import { Oval } from 'react-loader-spinner';

const GiveUp = () => {
    const [rawSubjectData, setRawSubjectData] = useState([]);
    const { rawData, loading: dataLoading } = useData();
    const { filters } = useFilters();
    const selectedSubject = filters.Disciplina?.value;
    const yearRange = filters.years;


  // Fetch raw data only when subject changes
  useEffect(() => {
    if (!selectedSubject || dataLoading) return;

    const fetchData = () => {
      const subjectData = rawData.filter(d => d.idisciplinaid === selectedSubject);
      setRawSubjectData(subjectData);
    };

    fetchData();
  }, [selectedSubject, rawData, dataLoading]);

  // Process data based on year range using useMemo
  const data = useMemo(() => {
    if (!rawSubjectData.length) return [];

    // Filter by year range
    const filteredData = rawSubjectData.filter(d => {
      const year = parseInt(d.ianolectivo);
      return year >= yearRange[0] && year <= yearRange[1];
    });

    const yearGroups = d3.group(filteredData, d => d.ianolectivo);
    
    return Array.from(yearGroups, ([year, records]) => {
      const total = records.length;
      const withdrawals = records.filter(d => d.avaliado === "0").length;
      return {
        year,
        withdrawals,
        percentage: ((withdrawals / total) * 100).toFixed(2)
      };
    }).sort((a, b) => a.year - b.year);
  }, [rawSubjectData, yearRange]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#2d3448] p-2 rounded">
          <p className="text-white">{`Ano: ${label}`}</p>
          {payload.map((pld) => (
            <p key={pld.dataKey} style={{ color: pld.color }}>
              {pld.dataKey === 'withdrawals' 
                ? `Nº Desistências: ${pld.value}`
                : `Percentagem: ${pld.value}%`
              }
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {dataLoading ? (
        <div className="flex items-center justify-center h-full">
          <Oval
            height={80}
            width={80}
            color="#68e713"
            secondaryColor="#4fa94d"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      ) : data.every(d => d.withdrawals === 0) ? (
        <div className="flex items-center justify-center h-full">
          <h2 className="text-gray-500 font-bold">Não existem desistências registadas</h2>
        </div>
      ) : (
        <div className="w-full h-full">
          <h2 className="text-xl font-bold mb-4">Desistências por Ano</h2>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" stroke="#ffffff" />
              <YAxis 
                yAxisId="left"
                stroke="#ffffff"
                label={{ value: 'Nº Desistências', angle: -90, position: 'insideLeft' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#ffffff"
                label={{ value: 'Percentagem (%)', angle: 90, position: 'insideRight' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                yAxisId="left"
                dataKey="withdrawals" 
                fill="#68e713" 
                name="Nº Desistências"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="percentage"
                stroke="#ff7300"
                name="Percentagem"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
};

export default GiveUp;