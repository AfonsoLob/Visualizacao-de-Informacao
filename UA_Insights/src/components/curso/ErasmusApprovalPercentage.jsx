import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import * as d3 from "d3";
import { useFilters } from "../../context/FilterContext";
import { Oval } from 'react-loader-spinner';


const ErasmusApprovalPercentage = () => {
    const [data, setData] = useState([]);
    const { filters } = useFilters();
    const selectedCurso = filters.Curso?.value;
    const yearRange = filters.years;
    const [loading, setLoading] = useState(false);


    

    useEffect(() => {
        const processChartData = async () => {
            setLoading(true);
            try {
                const rawData = await d3.csv("/notas-alunos-2012-2022-corrigido.csv"); // Substituir pelo caminho correto

                // Filtrar para a curso selecionada
                const filteredData = rawData.filter((d) => {
                    const year = parseInt(d.ianolectivo);
                    return (
                    d.icursocod === selectedCurso &&
                    year >= yearRange[0] &&
                    year <= yearRange[1]
                    );
                }); 
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
            } finally {
                setLoading(false);
            }
        };

        if (selectedCurso) {
            processChartData();
        }
    }, [selectedCurso, yearRange]);

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
                <h2 className="mb-4 text-xl font-semibold">Internos VS Erasmus</h2>
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
            )}
        </>
    );
};

export default ErasmusApprovalPercentage;
