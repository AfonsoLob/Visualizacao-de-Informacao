import React, { useEffect, useRef } from "react";
import { loadAndProcessData } from "../d3/universidade_Script";

const Universidade = () => {
    const csvFile = "../../public/notas-alunos-2012-2022-corrigido.csv";

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
            <div className="graph" ref={approvedPerYearRef}>
                <h2>Taxa de Aprovados / Ano</h2>
            </div>
            <div className="graph" ref={regimeRef}>
                <h2>Regime</h2>
            </div>
            <div className="graph" ref={studentsPerYearRef}>
                <h2>Estudantes / Ano</h2>
            </div>
            <div id="heatmap" className="graph" ref={studentsPerDeptRef}>
                <h2>Estudantes / Departamento</h2>
            </div>
        </div>
    );
};

export default Universidade;
