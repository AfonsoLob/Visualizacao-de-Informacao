import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import * as d3 from "d3";
import { useFilters } from "../../context/FilterContext";


const ErasmusApprovalPercentage = () => {
    const [data, setData] = useState([]);
    const { filters } = useFilters();
  const selectedCurso = filters.Curso?.value;
    
    

    useEffect(() => {
        const processChartData = async () => {
            try {
                const rawData = await d3.csv("/notas-alunos-2012-2022-corrigido.csv"); // Substituir pelo caminho correto

                // Filtrar para a curso selecionada
                const filteredData = rawData.filter((d) => d.icursocod === selectedCurso);

                // Agrupar os dados por ano letivo e calcular a percentagem de aprovados
                const groupedData = d3.group(filteredData, (d) => d.ianolectivo);
                const formattedData = Array.from(groupedData, ([year, records]) => {
                    const totalMobilidade = records.filter((d) => d.mobilidade === "Sim").length;
                    const approvedMobilidade = records.filter((d) => d.mobilidade === "Sim" && +d.aprovado === 1).length;
                    const totalNaoMobilidade = records.filter((d) => d.mobilidade === "Não").length;
                    const approvedNaoMobilidade = records.filter((d) => d.mobilidade === "Não" && +d.aprovado === 1).length;
                    return {
                        year,
                        percentageMobilidade: ((approvedMobilidade / totalMobilidade) * 100).toFixed(2), // Percentagem com 2 casas decimais
                        percentageNaoMobilidade: ((approvedNaoMobilidade / totalNaoMobilidade) * 100).toFixed(2), // Percentagem com 2 casas decimais
                    };
                });
                console.log(groupedData)
                console.log(formattedData)
                setData(formattedData);
            } catch (error) {
                console.error("Erro ao processar os dados:", error);
            }
        };

        if (selectedCurso) {
            processChartData();
        }
    }, [selectedCurso]);

return (
        <div>
                <h2>Internos VS Erasmus</h2>

                {/* Gráfico */}
                <BarChart
                        width={700}
                        height={250}
                        data={data}
                        margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
                >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" stroke="#ffffff" />
                        <YAxis stroke="#ffffff" />
                        <Tooltip contentStyle={{ backgroundColor: '#2d3448' }} />
                        <Legend />
                        <Bar dataKey="percentageNaoMobilidade" fill="#68e713" name="Internos" />
                        <Bar dataKey="percentageMobilidade" fill="#8884d8" name="Erasmus" />
                </BarChart>
        </div>
);
};

export default ErasmusApprovalPercentage;
