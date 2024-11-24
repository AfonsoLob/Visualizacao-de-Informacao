import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useData } from "../../context/DataContext";

const StudentsDepartmentHeatmap = ({ data }) => {
  const { rawData, loading: dataLoading } = useData();
  const svgRef = useRef();
  const wrapperRef = useRef();
  const [containerWidth, setContainerWidth] = useState(700); // Initial width

  // Function to handle window resizing
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

  useEffect(() => {
    if (!rawData || dataLoading) return;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom:30, left: 60 };
    const width = containerWidth - margin.left - margin.right;
    const height = 300;

    // Rollup and flatten data
    const deptData = d3.rollups(
      rawData,
      (v) => v.length,
      (d) => d.ianolectivo,
      (d) => d.dep_sigla_oficial.toUpperCase()
    );

    const flattenedData = deptData.flatMap((yearData, yearIndex) =>
      yearData[1].map((deptData, deptIndex) => ({
        year: yearData[0],
        department: deptData[0],
        count: deptData[1],
        x: yearIndex,
        y: deptIndex,
      }))
    );

    const svg = d3
      .select(svgRef.current)
      .append("svg")
      .attr("width", containerWidth)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xHeatmap = d3
      .scaleBand()
      .domain(deptData.map((d) => d[0]))
      .range([0, width])
      .padding(0.05);

    const yHeatmap = d3
      .scaleBand()
      .domain(flattenedData.map((d) => d.department))
      .range([0, height])
      .padding(0.05);

    const colorScale = d3
      .scaleSequential(d3.interpolateYlOrRd)
      .domain([0, d3.max(flattenedData, (d) => d.count)]);

    svg
      .selectAll("rect")
      .data(flattenedData)
      .enter()
      .append("rect")
      .attr("x", (d) => xHeatmap(d.year))
      .attr("y", (d) => yHeatmap(d.department))
      .attr("width", xHeatmap.bandwidth())
      .attr("height", yHeatmap.bandwidth())
      .attr("fill", (d) => colorScale(d.count));

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xHeatmap));

    svg.append("g").call(d3.axisLeft(yHeatmap));
  }, [data, containerWidth]);

  return (
    <div ref={wrapperRef} style={{ width: "100%" }}>
      <h2>Heatmap</h2>
      <div ref={svgRef}></div>
    </div>
  );
};

export default StudentsDepartmentHeatmap;
