import React, { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import { useData } from "../../context/DataContext";
import { useFilters } from "../../context/FilterContext";

const StudentsDepartmentHeatmap = () => {
  const { rawData, loading: dataLoading } = useData();
  const { filters } = useFilters();
  const yearRange = filters.years;
  const svgRef = useRef();
  const wrapperRef = useRef();
  const [containerWidth, setContainerWidth] = useState(700);

  // Resize handler
  const updateWidth = () => {
    if (wrapperRef.current) {
      setContainerWidth(wrapperRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", updateWidth);
    updateWidth();
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Process data with useMemo
  const processedData = useMemo(() => {
    if (!rawData.length || dataLoading) return [];
  
    const filteredData = rawData.filter(d => {
      const year = parseInt(d.ianolectivo);
      return year >= yearRange[0] && year <= yearRange[1];
    });
  
    // Get total students per year for percentage calculation
    const yearTotals = d3.rollup(
      filteredData,
      v => new Set(v.map(d => d.id_estudante)).size,
      d => d.ianolectivo
    );
  
    // Rollup data by year and department
    const deptData = d3.rollups(
      filteredData,
      v => new Set(v.map(d => d.id_estudante)).size,
      d => d.ianolectivo,
      d => d.dep_sigla_oficial.toUpperCase()
    );
  
    // Flatten and calculate percentages
    return deptData.flatMap(([year, depts]) =>
      depts.map(([dept, count]) => ({
        year,
        department: dept,
        count,
        percentage: ((count / yearTotals.get(year)) * 100).toFixed(2)
      }))
    );
  }, [rawData, yearRange, dataLoading]);

  // D3 visualization effect
  useEffect(() => {
    if (!processedData.length) return;

    const margin = { top: 20, right: 100, bottom: 30, left: 60 };
    const width = containerWidth - margin.left - margin.right;
    const height = 300;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Get unique years and departments
    const years = [...new Set(processedData.map(d => d.year))].sort();
    const departments = [...new Set(processedData.map(d => d.department))].sort();

    // Create scales
    const x = d3.scaleBand()
      .range([0, width])
      .domain(years)
      .padding(0.05);

    const y = d3.scaleBand()
      .range([height, 0])
      .domain(departments)
      .padding(0.05);

    const maxCount = d3.max(processedData, d => d.count);
    const color = d3.scaleSequential()
      .interpolator(d3.interpolateYlOrRd)
      .domain([0, maxCount]);

    // Add tooltip div after svg setup
    const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background-color", "#2d3748")
    .style("padding", "10px")
    .style("border-radius", "5px")
    .style("color", "white")
    .style("font-size", "12px")
    .style("opacity", 0);

    // Update rect selection with hover interactions
    svg.selectAll("rect")
    .data(processedData)
    .enter()
    .append("rect")
    .attr("x", d => x(d.year))
    .attr("y", d => y(d.department))
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .style("fill", d => color(d.count))
    .on("mouseover", (event, d) => {
      d3.select(event.currentTarget)
        .style("stroke", "#ffffff")
        .style("stroke-width", 2);
      
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);
      
        tooltip.html(
          `Departamento: ${d.department}<br/>
           Ano: ${d.year}<br/>
           Estudantes: ${d.count}<br/>
           Percentagem: ${d.percentage}%`
        )
        .style("left", (event.pageX - tooltip.node().offsetWidth - 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", (event) => {
      d3.select(event.currentTarget)
        .style("stroke", "none");
      
      tooltip.transition()
        .duration(200)
        .style("opacity", 0)
        .on("end", () => {
          tooltip.style("top", "-100px")
            .style("left", "-100px");
        });
    });

    // Add color legend
    const legendWidth = 20;
    const legendHeight = height;
    const legendSteps = 10;

    const maxPercentage = d3.max(processedData, d => parseFloat(d.percentage));
    const legendScale = d3.scaleLinear()
      .domain([0, Math.ceil(maxPercentage)])
      .range([legendHeight, 0]);
      const legendAxis = d3.axisRight(legendScale)
        .ticks(6)
        .tickFormat(d => `${d}%`);

    const legend = svg.append("g")
      .attr("transform", `translate(${width + 10}, 0)`);

    // Create color gradient
    const legendGradient = legend.append("defs")
      .append("linearGradient")
      .attr("id", "legend-gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "0%");

    legendGradient.selectAll("stop")
      .data(color.ticks(legendSteps).map((t, i, arr) => ({
      offset: `${(i / (arr.length - 1)) * 100}%`,
      color: color(t)
      })))
      .enter()
      .append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color);

    // Add color gradient rectangle
    legend.append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#legend-gradient)");

    // Add legend axis
    legend.append("g")
      .call(legendAxis)
      .attr("transform", `translate(${legendWidth}, 0)`);

    // Add axes
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

    svg.append("g")
      .call(d3.axisLeft(y));

    return () => {
      d3.selectAll(".tooltip").remove();
    };

  }, [processedData, containerWidth]);

  return (
    <div ref={wrapperRef} className="w-full">
      <h2 className="text-lg font-bold">Estudantes / Departamento</h2>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default StudentsDepartmentHeatmap;