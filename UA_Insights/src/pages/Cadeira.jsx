import React, { useState, useEffect, useRef } from "react";
import ApprovedPercentagePerYear from "../components/cadeira/ApprovalPercentage";
import CourseApprovalsByExamType from "../components/cadeira/ApprovalByExamType";
// import AverageGradeRadar from "../components/CourseGradeRadar";
import GradeViolinPlot from "../components/cadeira/GradeViolinPlot";

const Cadeira = () => {
  
    return (
      <div className="grid grid-cols-2 gap-5 justify-evenly items-center h-auto mt-5">
        <div className="w-full h-[400px] border border-lightgray rounded-lg p-1.5 bg-[#f9f9f9] flex flex-col items-center justify-center text-white" style={{ backgroundColor: '#2d3748' }}>
            <ApprovedPercentagePerYear/>
        </div>
        <div className="w-full h-[400px] border border-lightgray rounded-lg p-1.5 bg-[#f9f9f9] flex flex-col items-center justify-center text-white" style={{ backgroundColor: '#2d3748' }}>
          <CourseApprovalsByExamType/>
        </div>
        <div className="w-full h-[400px] border border-lightgray rounded-lg p-1.5 bg-[#f9f9f9] flex flex-col items-center justify-center text-white" style={{ backgroundColor: '#2d3748' }}>
            <GradeViolinPlot/> 
        </div>
        <div className="w-full h-[400px] border border-lightgray rounded-lg p-1.5 bg-[#f9f9f9] flex flex-col items-center justify-center text-white" style={{ backgroundColor: '#2d3748' }}>
          <h2>Something</h2>
          {/* <AverageGradeRadar/> */}
        </div>
      </div>
    );
};

export default Cadeira;
