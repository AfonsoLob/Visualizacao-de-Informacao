import React, { useState } from "react";
import ErasmusApprovalPercentage from "../components/curso/ErasmusApprovalPercentage"; 
import AverageGrade from "../components/curso/AverageGrade";
import WorstSubjects from "../components/curso/WorstSubjects";
import { useFilters } from "../context/FilterContext";
import { FaMaximize } from "react-icons/fa6";
import { FaMinimize } from "react-icons/fa6";
import RegimeSpiderPlot from "../components/curso/RegimeSpiderPlot";

const ChartContainer = ({ children, title, id, activeChart, setActiveChart }) => {
  const toggleMaximize = (e) => {
    e.stopPropagation();
    setActiveChart(activeChart === id ? null : id);
  };

  // Only render if no chart is active or this is the active chart
  if (activeChart !== null && activeChart !== id) {
    return null;
  }

  return (
    <div 
  className={`
    border border-lightgray rounded-lg p-1.5 
    transition-all duration-300 ease-in-out
    ${activeChart === id ? 'col-span-2 h-[calc(100vh-120px)]' : 'w-full h-[400px]'}
    bg-[#2d3748] flex flex-col items-center justify-center text-white
    relative
  `}
>
  <button
    onClick={toggleMaximize}
    className="absolute bottom-2 right-2 p-2 rounded-full hover:bg-gray-600 transition-colors duration-200"
  >
    {activeChart === id ? (
      <FaMinimize className="w-5 h-5" />
    ) : (
      <FaMaximize className="w-5 h-5" />
    )}
  </button>
  {children}
</div>
  );
};

const Curso = () => {
  const { filters } = useFilters();
  const selectedCurso = filters.Curso?.value;
  const [activeChart, setActiveChart] = useState(null);

  return (
    <>
      {!selectedCurso ? ( 
        <div className="flex items-center justify-center flex-1">
          <h2 className="text-gray-500 font-bold">Selecione um curso para visualizar os dados!</h2>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 justify-evenly items-center h-auto mt-5">
          <ChartContainer 
            title="Erasmus Approval" 
            id="erasmus" 
            activeChart={activeChart} 
            setActiveChart={setActiveChart}
          >
            <ErasmusApprovalPercentage/>
          </ChartContainer>
          
          <ChartContainer 
            title="Average Grade" 
            id="average" 
            activeChart={activeChart} 
            setActiveChart={setActiveChart}
          >
            <AverageGrade/>
          </ChartContainer>
          
          <ChartContainer 
            title="Worst Subjects" 
            id="worst" 
            activeChart={activeChart} 
            setActiveChart={setActiveChart}
          >
            <WorstSubjects/>
          </ChartContainer>
          
          <ChartContainer 
            title="To Do" 
            id="todo" 
            activeChart={activeChart} 
            setActiveChart={setActiveChart}
          >
            <RegimeSpiderPlot/>
          </ChartContainer>
        </div>
      )}
    </>
  );
};

export default Curso;