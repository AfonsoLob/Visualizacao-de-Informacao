import React, { useEffect, useRef } from "react";
import { loadAndProcessData } from "../d3/universidade_Script";
import StudentsAreaChart from "../components/StudentsAreaChart";
import ApprovalLineChart from "../components/ApprovalLineChart";

const Universidade = () => {
    const csvFile = "/notas-alunos-2012-2022-corrigido.csv";

    // References to graph containers
    const approvedPerYearRef = useRef(null);
    const regimeRef = useRef(null);
    const studentsPerYearRef = useRef(null);
    const studentsPerDeptRef = useRef(null);

    useEffect(() => {
        const containerRefs = [
            approvedPerYearRef.current,
            regimeRef.current,
            studentsPerYearRef.current,
            studentsPerDeptRef.current,
        ];
        loadAndProcessData(csvFile, containerRefs);
    }, [csvFile]);

    return (
      <div className="graphGroup">
        <div className="graph" style={{ backgroundColor: '#2d3748' }}>
          <ApprovalLineChart/>
        </div>
        <div className="graph" ref={regimeRef} style={{ backgroundColor: '#2d3748' }}>
          <h2>Regime</h2>
        </div>
        <div className="graph" style={{ backgroundColor: '#2d3748' }}>
          <StudentsAreaChart/>
        </div>
        <div id="heatmap" className="graph" ref={studentsPerDeptRef} style={{ backgroundColor: '#2d3748' }}>
          <h2>Estudantes / Departamento</h2>
        </div>
      </div>
    );
};

export default Universidade;
