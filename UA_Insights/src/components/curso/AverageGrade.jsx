import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useFilters } from '../../context/FilterContext';
import { Oval } from 'react-loader-spinner';

const AverageGrade = () => {
    const [data, setData] = useState([]);
    const { filters } = useFilters();
    const selectedCurso = filters.Curso?.value;
    const yearRange = filters.years;
    const svgRef = useRef();
    const [loading, setLoading] = useState(false);

    // Data processing useEffect now depends on both selectedCurso and yearRange
    useEffect(() => {
        const processChartData = async () => {
            setLoading(true);
            try {
                const rawData = await d3.csv("/notas-alunos-2012-2022-corrigido.csv");
                const filteredData = rawData.filter((d) => {
                    const year = parseInt(d.ianolectivo);
                    return (
                        d.icursocod === selectedCurso &&
                        year >= yearRange[0] &&
                        year <= yearRange[1] &&
                        d.aprovado === "1"
                    );
                });

                const groupedData = d3.group(filteredData, (d) => d.ianolectivo);
                const formattedData = Array.from(groupedData, ([year, records]) => {
                    const grades = records.map(d => +d.nota).sort(d3.ascending);
                    return {
                        year,
                        q1: d3.quantile(grades, 0.25),
                        median: d3.quantile(grades, 0.5),
                        q3: d3.quantile(grades, 0.75),
                        min: d3.min(grades),
                        max: d3.max(grades)
                    };
                }).sort((a, b) => a.year - b.year);

                setData(formattedData);
            } catch (error) {
                console.error("Error processing data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (selectedCurso) {
            processChartData();
        }
    }, [selectedCurso, yearRange]); // Added yearRange to dependencies

    useEffect(() => {
        if (!data.length) return;

        const margin = { top: 20, right: 30, bottom: 50, left: 40 };
        const width = 600 - margin.left - margin.right;
        const height = 280 - margin.top - margin.bottom;

        d3.select(svgRef.current).selectAll("*").remove();
        d3.selectAll(".tooltip").remove();

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background-color", "#2d3748")
            .style("padding", "10px")
            .style("border-radius", "5px")
            .style("color", "white")
            .style("font-size", "12px")
            .style("opacity", 0);

        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .range([0, width])
            .domain(data.map(d => d.year))
            .padding(0.1);

        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([10, 20]);

        svg.selectAll("g.box")
            .data(data)
            .join("g")
            .attr("class", "box")
            .attr("transform", d => `translate(${x(d.year)},0)`)
            .each(function (d) {
                const g = d3.select(this);
                const boxWidth = x.bandwidth();

                g.append("rect")
                    .attr("x", 0)
                    .attr("y", y(d.q3))
                    .attr("width", boxWidth)
                    .attr("height", y(d.q1) - y(d.q3))
                    .attr("fill", "#68e713")
                    .attr("opacity", 0.7)
                    .on("mouseover", (event) => {
                        d3.select(event.currentTarget)
                            .attr("opacity", 1);

                        tooltip.transition()
                            .duration(200)
                            .style("opacity", .9);

                        tooltip.html(
                            `Year: ${d.year}<br/>   
                             Q3: ${d.q3}<br/>
                             Median: ${d.median}<br/>
                             Q1: ${d.q1}<br/>`
                        )
                            .style("left", (event.pageX + 10) + "px")
                            .style("top", (event.pageY - 28) + "px");
                    })
                    .on("mouseout", (event) => {
                        d3.select(event.currentTarget)
                            .attr("opacity", 0.7);

                        tooltip.transition()
                            .duration(200)
                            .style("opacity", 0)
                            .on("end", () => {
                                tooltip.style("top", "-100px")
                                    .style("left", "-100px");
                            });
                    });

                g.append("line")
                    .attr("x1", 0)
                    .attr("x2", boxWidth)
                    .attr("y1", y(d.median))
                    .attr("y2", y(d.median))
                    .attr("stroke", "white")
                    .attr("stroke-width", 2);

                g.append("line")
                    .attr("x1", boxWidth / 2)
                    .attr("x2", boxWidth / 2)
                    .attr("y1", y(d.min))
                    .attr("y2", y(d.q1))
                    .attr("stroke", "white");

                g.append("line")
                    .attr("x1", boxWidth / 2)
                    .attr("x2", boxWidth / 2)
                    .attr("y1", y(d.q3))
                    .attr("y2", y(d.max))
                    .attr("stroke", "white");
            });

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .attr("color", "white")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        svg.append("g")
            .attr("color", "white")
            .call(d3.axisLeft(y));

    }, [data]);

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
                <h2 className="mb-4 text-xl font-semibold">Média anual</h2>
                        <svg ref={svgRef}></svg>
                </div>
            )}
        </>
    );
};

export default AverageGrade;