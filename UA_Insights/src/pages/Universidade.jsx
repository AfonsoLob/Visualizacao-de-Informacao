import React, { useEffect, useRef } from "react";
import StudentsAreaChart from "../components/universidade/StudentsAreaChart";
import ApprovalLineChart from "../components/universidade/ApprovalLineChart";
import StudentsDepartmentHeatmap from "../components/universidade/StudentsDepartmentHeatmap";

const Universidade = () => {
    const csvFile = "/notas-alunos-2012-2022-corrigido.csv";

    return (
      <div className="grid grid-cols-2 gap-5 justify-evenly items-center h-auto mt-5">
        <div className="w-full h-[400px] border border-lightgray rounded-lg p-1.5 bg-[#f9f9f9] flex flex-col items-center justify-center text-white" style={{ backgroundColor: '#2d3748' }}>
          <ApprovalLineChart/>
        </div>
        <div className="w-full h-[400px] border border-lightgray rounded-lg p-1.5 bg-[#f9f9f9] flex flex-col items-center justify-center text-white" style={{ backgroundColor: '#2d3748' }}>
          <h2>Regime</h2>
        </div>
        <div className="w-full h-[400px] border border-lightgray rounded-lg p-1.5 bg-[#f9f9f9] flex flex-col items-center justify-center text-white" style={{ backgroundColor: '#2d3748' }}>
          <StudentsAreaChart/>
        </div>
        <div className="w-full h-[400px] border border-lightgray rounded-lg p-1.5 bg-[#f9f9f9] flex flex-col items-center justify-center text-white" style={{ backgroundColor: '#2d3748' }}>
          <StudentsDepartmentHeatmap/>
        </div>
      </div>
    );
};

export default Universidade;
