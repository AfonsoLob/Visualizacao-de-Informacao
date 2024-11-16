import * as d3 from 'd3';

export const loadAndProcessData = (callback) => {
  d3.csv("notas-alunos-2012-2022-corrigido.csv").then(function(data) {
    console.log("Loaded Data:", data);
    let x, y;

    data.forEach(d => {
      d.ianolectivo = +d.ianolectivo;
      d.aprovado = d.aprovado === "1" ? 1 : 0;
    });

    // Line Chart for Approval Percentage per Year
    const approvalData = d3.group(data, d => d.ianolectivo);
    const approvalPercentage = Array.from(approvalData, ([year, records]) => {
      const total = records.length;
      const approved = records.filter(d => d.aprovado === 1).length;
      return { year, percentage: (approved / total) * 100 };
    });

    const svgLine = d3.select("#approvedPerYearChart").append("svg")
      .attr("width", 400)
      .attr("height", 300);

    x = d3.scaleLinear().domain(d3.extent(approvalPercentage, d => d.year)).range([20, 380]);
    y = d3.scaleLinear().domain([0, 100]).range([280, 20]);

    svgLine.append("g")
      .attr("transform", "translate(0,280)")
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format("d")));

    svgLine.append("g")
      .attr("transform", "translate(20,0)")
      .call(d3.axisLeft(y));

    svgLine.append("path")
      .datum(approvalPercentage)
      .attr("fill", "none")
      .attr("stroke", "purple")
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(d => x(d.year))
        .y(d => y(d.percentage))
      );

    // Pie Chart for Regime Distribution
    const regimeData = d3.rollups(data, v => v.length, d => d.nome_regime);
    const pie = d3.pie().value(d => d[1]);
    const arc = d3.arc().innerRadius(0).outerRadius(150);
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const svgPie = d3.select("#regimeChart").append("svg")
      .attr("width", 400)
      .attr("height", 300)
      .append("g")
      .attr("transform", "translate(250,150)");

    svgPie.selectAll("path")
      .data(pie(regimeData))
      .enter().append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data[0]));

    const legend = svgPie.selectAll(".legend")
      .data(regimeData)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(-550, ${i * 20 - 10})`);

    legend.append("rect")
      .attr("x", 300)
      .attr("y", 10)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", d => color(d[0]));

    legend.append("text")
      .attr("x", 320)
      .attr("y", 22)
      .attr("dy", "0.35em")
      .text(d => d[0]);

    // Area Chart for students per year
    const studentsPerYear = d3.rollups(data, v => v.length, d => d.ianolectivo);

    x = d3.scaleLinear().domain(d3.extent(studentsPerYear, d => d[0])).range([60, 380]);
    y = d3.scaleLinear().domain([0, d3.max(studentsPerYear, d => d[1])]).range([260, 40]);

    const area = d3.area()
      .x(d => x(d[0]))
      .y0(260)
      .y1(d => y(d[1]));

    const svgArea = d3.select("#studentsPerYearChart").append("svg")
      .attr("width", 400)
      .attr("height", 300);

    svgArea.append("path")
      .datum(studentsPerYear)
      .attr("fill", "steelblue")
      .attr("opacity", 0.6)
      .attr("d", area);

    svgArea.append("g")
      .attr("transform", "translate(0,260)")
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svgArea.append("g")
      .attr("transform", "translate(60,0)")
      .call(d3.axisLeft(y));

    svgArea.append("text")
      .attr("class", "axis-label")
      .attr("x", 200)
      .attr("y", 295)
      .style("text-anchor", "middle")
      .text("Ano");

    svgArea.append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -150)
      .attr("y", 10)
      .style("text-anchor", "middle")
      .text("Número de Alunos");

    // Heatmap for students per department
    const deptData = d3.rollups(data, v => v.length, d => d.ianolectivo, d => d.dep_sigla_oficial.toUpperCase());

    const svgHeatmap = d3.select("#studentsPerDeptChart").append("svg")
      .attr("width", 800)
      .attr("height", 500);

    const colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
      .domain([0, d3.max(deptData, d => d3.max(d[1], dd => dd[1]))]);

    const flattenedData = deptData.flatMap((yearData, yearIndex) =>
      yearData[1].map((deptData, deptIndex) => ({
        year: yearData[0],
        department: deptData[0],
        count: deptData[1],
        x: yearIndex,
        y: deptIndex
      }))
    );

    const xScale = d3.scaleBand()
      .domain(deptData.map(d => d[0]))
      .range([100, 700])
      .padding(0.05);

    const yScale = d3.scaleBand()
      .domain(flattenedData.map(d => d.department))
      .range([50, 450])
      .padding(0.05);

    svgHeatmap.selectAll("rect")
      .data(flattenedData)
      .enter().append("rect")
      .attr("x", d => xScale(d.year))
      .attr("y", d => yScale(d.department))
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("fill", d => colorScale(d.count));

    svgHeatmap.append("g")
      .attr("transform", `translate(0, ${450})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svgHeatmap.append("g")
      .attr("transform", `translate(100, 0)`)
      .call(d3.axisLeft(yScale));

    if (callback) callback();
  }).catch(function(error) {
    console.error("Error loading the CSV file:", error);
  });
};