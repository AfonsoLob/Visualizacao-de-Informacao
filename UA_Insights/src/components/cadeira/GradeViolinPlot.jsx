import React, { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import { useFilters } from "../../context/FilterContext";
import { useData } from "../../context/DataContext";
import { Oval } from 'react-loader-spinner';

const GradeViolinPlot = () => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const { rawData, loading: dataLoading } = useData();
  const [rawSubjectData, setRawSubjectData] = useState([]);  
  const { filters } = useFilters();
  const selectedSubject = filters.Disciplina?.value;
  const [containerWidth, setContainerWidth] = useState(700); // Initial width
  const yearRange = filters.years;

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

  // Fetch raw data only when subject changes
  useEffect(() => {
    if (!selectedSubject || dataLoading) return;

    const fetchData = async () => {
      try {
        const subjectData = rawData.filter(d => 
          d.idisciplinaid === selectedSubject
        );
        setRawSubjectData(subjectData);
      } catch (error) {
        console.error("Error loading data:", error);
      } 
    };

    if (selectedSubject) {
      fetchData();
    }
  }, [selectedSubject]);

  // Process data based on year range using useMemo
  const processedData = useMemo(() => {
    if (!rawSubjectData.length) return [];

    // Filter by year range
    const filteredData = rawSubjectData.filter(d => {
      const year = parseInt(d.ianolectivo);
      return year >= yearRange[0] && year <= yearRange[1];
    });

    const groupedData = d3.group(filteredData, d => d.ianolectivo);
    return Array.from(groupedData, ([year, records]) => {
      const grades = records
        .filter(record => record.avaliado === "1")
        .map(record => +record.nota);
      
      return {
        year,
        grades,
        mean: d3.mean(grades)?.toFixed(2),
        median: d3.median(grades)?.toFixed(2),
        q1: d3.quantile(grades, 0.25)?.toFixed(2),
        q3: d3.quantile(grades, 0.75)?.toFixed(2),
        min: d3.min(grades)?.toFixed(2),
        max: d3.max(grades)?.toFixed(2),
        count: grades.length,
        distributions: {
          excellent: grades.filter(g => g >= 16).length / grades.length * 100,
          good: grades.filter(g => g >= 14 && g < 16).length / grades.length * 100,
          average: grades.filter(g => g >= 10 && g < 14).length / grades.length * 100,
          fail: grades.filter(g => g < 10).length / grades.length * 100
        }
      };
    }).sort((a, b) => a.year - b.year);
  }, [rawSubjectData, yearRange]);

  useEffect(() => {
    if (!processedData.length) return;

    // Clear previous SVG content and tooltip
    d3.select(svgRef.current).selectAll("*").remove();
    d3.selectAll(".violin-tooltip").remove();

    const margin = { top: 10, right: 30, bottom: 50, left: 40 };
    const width = containerWidth - margin.left - margin.right;
    const height = 300;

    // Create tooltip
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "violin-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "#2d3748")
      .style("color", "white")
      .style("padding", "10px")
      .style("border-radius", "5px")
      .style("font-size", "12px")
      .style("box-shadow", "0 2px 4px rgba(0,0,0,0.2)")
      .style("max-width", "300px")
      .style("z-index", "10");

    // Create main SVG
    const svg = d3
      .select(svgRef.current)
      .append("svg")
      .attr("width", containerWidth)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const y = d3.scaleLinear().domain([0, 20]).range([height, 0]);
    svg
      .append("g")
      .attr("color", "white")
      .call(d3.axisLeft(y));

    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(processedData.map((d) => d.year))
      .padding(0.05);
    
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .attr("color", "white")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    const histogram = d3
      .histogram()
      .domain(y.domain())
      .thresholds(y.ticks(20))
      .value((d) => d);

    const violinData = processedData.map((yearData) => ({
      ...yearData,
      bins: histogram(yearData.grades)
    }));

    const maxNum = d3.max(violinData, (d) => d3.max(d.bins, (b) => b.length));
    const xNum = d3
      .scaleLinear()
      .range([0, x.bandwidth()])
      .domain([-maxNum, maxNum]);

    // Function to format the tooltip content
    const formatTooltip = (d) => {
      return `
        <div class="text-sm">
          <strong>Ano : ${d.year}</strong><br/>
          <strong>Estatísticas:</strong><br/>
          • Estudantes: ${d.count}<br/>
          • Média: ${d.mean}<br/>
          • Mediana: ${d.median}<br/>
          • Q1: ${d.q1} | Q3: ${d.q3}<br/>
          • Mínimo: ${d.min} | Máximo: ${d.max}<br/>
          <br/>
          <strong>Distribuição de Notas:</strong><br/>
          • Excelente (≥16): ${d.distributions.excellent.toFixed(1)}%<br/>
          • Bom (14-15): ${d.distributions.good.toFixed(1)}%<br/>
          • Suficiente (10-13): ${d.distributions.average.toFixed(1)}%<br/>
          • Fraco (<10): ${d.distributions.fail.toFixed(1)}%
        </div>
      `;
    };

    // Add violin plots with interactivity
    svg
      .selectAll(".violin")
      .data(violinData)
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${x(d.year)},0)`)
      .each(function(d) {
        const violinGroup = d3.select(this);
        
        // Add the violin path
        violinGroup
          .append("path")
          .datum(d.bins)
          .style("fill", "#69b3a2")
          .style("opacity", 0.7)
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

        // Add invisible rectangle for better hover detection
        violinGroup
          .append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", x.bandwidth())
          .attr("height", height)
          .style("fill", "transparent")
          .on("mouseover", (event) => {
            // Highlight the violin plot
            violinGroup.select("path")
              .style("opacity", 1)
              .style("stroke", "white")
              .style("stroke-width", 1);

            // Show tooltip
            tooltip
              .style("visibility", "visible")
              .html(formatTooltip(d));
          })
          .on("mousemove", (event) => {
            tooltip
              .style("top", (event.pageY - 10) + "px")
              .style("left", (event.pageX + 10) + "px");
          })
          .on("mouseout", () => {
            // Reset violin plot style
            violinGroup.select("path")
              .style("opacity", 0.7)
              .style("stroke", "none");

            // Hide tooltip
            tooltip.style("visibility", "hidden");
          });
      });

  }, [processedData, containerWidth]);

  return (
    <>
      {dataLoading ? (
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
        <div ref={wrapperRef} style={{ width: "100%" }}>
          <h2 className="text-lg mt-2 font-bold">Distribuição das notas por ano</h2>
          <div ref={svgRef}></div>
        </div>
      )}
    </>
  );
};

export default GradeViolinPlot;
