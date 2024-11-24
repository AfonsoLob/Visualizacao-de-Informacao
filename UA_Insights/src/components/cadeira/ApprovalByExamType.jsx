import React, { useState, useEffect } from "react";
import { useFilters } from "../../context/FilterContext";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import * as d3 from "d3";
import { Oval } from 'react-loader-spinner';

const CourseApprovalsByExamType = () => {
  const [data, setData] = useState([]);
  const { filters } = useFilters();
  const selectedSubject = filters.Disciplina?.value;
  const yearRange = filters.years;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const processChartData = async () => {
      setLoading(true);
      try {
        const rawData = await d3.csv("/notas-alunos-2012-2022-corrigido.csv"); // Substituir pelo caminho correto

        // Filtrar para a idisciplinaid selecionada
        const filteredData = rawData.filter((d) => {
          const year = parseInt(d.ianolectivo);
          return (
            d.idisciplinaid === selectedSubject &&
            year >= yearRange[0] &&
            year <= yearRange[1]
          );
        }
        );

        // Filtrar aprovados e agrupar por tipo de exame
        const approvedData = filteredData.filter((d) => +d.aprovado === 1);
        const groupedData = d3.rollups(
          approvedData,
          (v) => v.length,
          (d) => d.nvctipoexame // Agrupar por tipo de exame
        )

        // Converter para o formato necessário
        const formattedData = groupedData.map(([type, count]) => ({
          name: type,
          value: count,
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Erro ao processar os dados:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedSubject) {
      processChartData();
    }
  }, [selectedSubject, yearRange]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFE", "#FF6384"]; // Paleta de cores

  return (
    <>
      {loading ? (
                <div className="flex flex-col items-center w-full h-full p-2">
                <div className="flex-1 w-full flex items-center justify-center">
                    <Oval
                        height={80}
                        width={80}
                        color="#4fa94d"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                        ariaLabel='oval-loading'
                        secondaryColor="#4fa94d"
                        strokeWidth={2}
                        strokeWidthSecondary={2}

                    />
                </div>
                </div>
      ) : (
        <div>
          <h3 className="w-full">Percentagem de Aprovados por Tipo de Exame</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
};

export default CourseApprovalsByExamType;
