import React, { useState, useEffect, useRef } from "react";
import ErasmusApprovalPercentage from "../components/curso/ErasmusApprovalPercentage"; 
import AverageGrade from "../components/curso/AverageGrade";
import { useFilters } from "../context/FilterContext";
// import CompletionYearsDistribution from "../components/curso/CompletionsYearsDistribution";


const Curso = () => {
  
  const { filters } = useFilters();
  const selectedCurso = filters.Curso?.value;

    return (
      <>
      {!selectedCurso ? ( 
        <div className="flex items-center justify-center flex-1">
          <h2 className="text-gray-500 font-bold">Selecione um curso para visualizar os dados!</h2>
        </div>
      ) : (
      <div className="grid grid-cols-2 gap-5 justify-evenly items-center h-auto mt-5">
        <div className="w-full h-[400px] border border-lightgray rounded-lg p-1.5 bg-[#f9f9f9] flex flex-col items-center justify-center text-white" style={{ backgroundColor: '#2d3748' }}>
            <ErasmusApprovalPercentage/>
        </div>
        <div className="w-full h-[400px] border border-lightgray rounded-lg p-1.5 bg-[#f9f9f9] flex flex-col items-center justify-center text-white" style={{ backgroundColor: '#2d3748' }}>
            <AverageGrade/>
        </div>
        <div className="w-full h-[400px] border border-lightgray rounded-lg p-1.5 bg-[#f9f9f9] flex flex-col items-center justify-center text-white" style={{ backgroundColor: '#2d3748' }}>
            <h2>TO DO</h2>
            {/* <CompletionYearsDistribution/> */}
        </div>
        <div className="w-full h-[400px] border border-lightgray rounded-lg p-1.5 bg-[#f9f9f9] flex flex-col items-center justify-center text-white" style={{ backgroundColor: '#2d3748' }}>
          <h2>TO DO</h2>
          {/* <AverageGradeRadar/> */}
        </div>
      </div>
      )}
      </>
    );
};

export default Curso;
