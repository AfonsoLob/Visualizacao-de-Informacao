import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const GradeViolinPlot = () => {
  const svgRef = useRef();
  const [data, setData] = useState([]);
  const [selectedDisciplina, setSelectedDisciplina] = useState(""); // Fetch selected disciplina from filter context

  useEffect(() => {
    const pollFilterDropdown = () => {
      const filterDropdown = Array.from(document.querySelectorAll("label.block.mb-2"))
        .find((label) => label.textContent === "Disciplina")?.nextElementSibling;

      if (filterDropdown?.value) {
        setSelectedDisciplina(filterDropdown.value);
        const updateSelectedDisciplina = () => setSelectedDisciplina(filterDropdown.value);
        filterDropdown.addEventListener("change", updateSelectedDisciplina);

        return () => filterDropdown.removeEventListener("change", updateSelectedDisciplina);
      } else {
        setTimeout(pollFilterDropdown, 100);
      }
    };

    pollFilterDropdown();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawData = await d3.csv("/notas-alunos-2012-2022-corrigido.csv");

        // Filter data by selected disciplina
        const filteredData = rawData.filter((d) => d.idisciplinaid === selectedDisciplina);

        // Process data for violin plot: Group by year and get grades
        const groupedData = d3.group(filteredData, (d) => d.ianolectivo);
        const processedData = Array.from(groupedData, ([year, records]) => ({
          year,
          grades: records.filter((record) => record.avaliado === "1").map((record) => +record.nota),
        }));
        console.log("Violin Plot Data:", processedData);
        setData(processedData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    if (selectedDisciplina) {
      fetchData();
    }
  }, [selectedDisciplina]);

  useEffect(() => {
    if (!data.length) return;

    // Set dimensions
    const margin = { top: 10, right: 30, bottom: 30, left: 40 };
    const width = 700 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Append SVG
    const svg = d3
      .select(svgRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Y scale: Grades
    const y = d3
      .scaleLinear()
      .domain([0, 20]) // Assuming grade range is 0-20
      .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // X scale: Years
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(data.map((d) => d.year))
      .padding(0.05);
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Histogram function for binning grades
    const histogram = d3
      .histogram()
      .domain(y.domain())
      .thresholds(y.ticks(20))
      .value((d) => d);

    // Compute binning for each year
    const violinData = data.map(({ year, grades }) => {
      const bins = histogram(grades);
      return { year, bins };
    });

    // Find max bin length for scaling
    const maxNum = d3.max(violinData, (d) => d3.max(d.bins, (b) => b.length));
    const xNum = d3
      .scaleLinear()
      .range([0, x.bandwidth()])
      .domain([-maxNum, maxNum]);

    // Add violins
    svg
      .selectAll(".violin")
      .data(violinData)
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${x(d.year)},0)`)
      .append("path")
      .datum((d) => d.bins)
      .style("fill", "#69b3a2")
      .style("stroke", "none")
      .attr(
        "d",
        d3
          .area()
          .x0((d) => xNum(-d.length))
          .x1((d) => xNum(d.length))
          .y((d) => y(d.x0))
          .curve(d3.curveCatmullRom)
      );
  }, [data]);

  return (
    <div>
      <h2>Distribuição das notas por ano</h2>
      <div ref={svgRef}></div>
    </div>
  );
};

export default GradeViolinPlot;
