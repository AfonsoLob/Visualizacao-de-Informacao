import * as d3 from "d3";

export function loadAndProcessData(csvFile, containerRefs) {
    d3.csv(csvFile).then(function (data) {
        // Check if data is loaded correctly
        console.log("Loaded Data:", data);

        // Parse necessary columns into correct data types
        data.forEach(d => {
            d.ianolectivo = +d.ianolectivo; // Convert year to integer
            d.aprovado = d.aprovado === "1" ? 1 : 0; // Convert approved flag to integer
        });

        // References to container elements for graphs
        const [approvedPerYearChart, regimeChart, studentsPerYearChart, studentsPerDeptChart] = containerRefs;

        //
        // 1. Line Chart for Approval Percentage per Year
        //
        const approvalData = d3.group(data, d => d.ianolectivo);
        const approvalPercentage = Array.from(approvalData, ([year, records]) => {
            const total = records.length;
            const approved = records.filter(d => d.aprovado === 1).length;
            return { year, percentage: (approved / total) * 100 };
        });

        const svgLine = d3.select(approvedPerYearChart).append("svg")
            .attr("width", 400)
            .attr("height", 300);

        const x = d3.scaleLinear().domain(d3.extent(approvalPercentage, d => d.year)).range([20, 380]);
        const y = d3.scaleLinear().domain([0, 100]).range([280, 20]);

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

        //
        // 2. Pie Chart for Regime Distribution
        //
        const regimeData = d3.rollups(data, v => v.length, d => d.nome_regime);
        const pie = d3.pie().value(d => d[1]);
        const arc = d3.arc().innerRadius(0).outerRadius(150);
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const svgPie = d3.select(regimeChart).append("svg")
            .attr("width", 400)
            .attr("height", 300)
            .append("g")
            .attr("transform", "translate(200,150)");

        svgPie.selectAll("path")
            .data(pie(regimeData))
            .enter().append("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data[0]));

        // Legend
        const legend = svgPie.selectAll(".legend")
            .data(regimeData)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(-50, ${i * 20})`);

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

        //
        // 3. Area Chart for Students per Year
        //
        const studentsPerYear = d3.rollups(data, v => v.length, d => d.ianolectivo);

        const xArea = d3.scaleLinear().domain(d3.extent(studentsPerYear, d => d[0])).range([60, 380]);
        const yArea = d3.scaleLinear().domain([0, d3.max(studentsPerYear, d => d[1])]).range([260, 40]);

        const area = d3.area()
            .x(d => xArea(d[0]))
            .y0(260)
            .y1(d => yArea(d[1]));

        const svgArea = d3.select(studentsPerYearChart).append("svg")
            .attr("width", 400)
            .attr("height", 300);

        svgArea.append("path")
            .datum(studentsPerYear)
            .attr("fill", "steelblue")
            .attr("opacity", 0.6)
            .attr("d", area);

        svgArea.append("g")
            .attr("transform", "translate(0,260)")
            .call(d3.axisBottom(xArea).tickFormat(d3.format("d")));

        svgArea.append("g")
            .attr("transform", "translate(60,0)")
            .call(d3.axisLeft(yArea));

        //
        // 4. Heatmap for Students per Department
        //
        const deptData = d3.rollups(data, v => v.length, d => d.ianolectivo, d => d.dep_sigla_oficial.toUpperCase());

        const svgHeatmap = d3.select(studentsPerDeptChart).append("svg")
            .attr("width", 700)
            .attr("height", 400);

        const flattenedData = deptData.flatMap((yearData, yearIndex) =>
            yearData[1].map((deptData, deptIndex) => ({
                year: yearData[0],
                department: deptData[0],
                count: deptData[1],
                x: yearIndex,
                y: deptIndex
            }))
        );

        const xHeatmap = d3.scaleBand().domain(deptData.map(d => d[0])).range([100, 600]).padding(0.05);
        const yHeatmap = d3.scaleBand().domain(flattenedData.map(d => d.department)).range([50, 350]).padding(0.05);
        const colorScale = d3.scaleSequential(d3.interpolateYlOrRd).domain([0, d3.max(flattenedData, d => d.count)]);

        svgHeatmap.selectAll("rect")
            .data(flattenedData)
            .enter().append("rect")
            .attr("x", d => xHeatmap(d.year))
            .attr("y", d => yHeatmap(d.department))
            .attr("width", xHeatmap.bandwidth())
            .attr("height", yHeatmap.bandwidth())
            .attr("fill", d => colorScale(d.count));

        svgHeatmap.append("g")
            .attr("transform", "translate(0, 450)")
            .call(d3.axisBottom(xHeatmap));

        svgHeatmap.append("g")
            .attr("transform", "translate(100, 0)")
            .call(d3.axisLeft(yHeatmap));
    }).catch(function (error) {
        console.error("Error loading the CSV file:", error);
    });
}
