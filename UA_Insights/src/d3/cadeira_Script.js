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

    }).catch(function (error) {
        console.error("Error loading the CSV file:", error);
    });
}
