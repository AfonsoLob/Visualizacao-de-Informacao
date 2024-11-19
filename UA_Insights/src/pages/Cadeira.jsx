import React, { useState, useEffect, useRef } from "react";
import CourseApprovalsByExamType from "../components/CourseApprovalsByExamType";
import ApprovedPercentagePerYear from "../components/CourseApprovalPercentByYear";

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
            <h2>Nota Final / Cadeira</h2>
        </div>
        <div className="w-full h-[400px] border border-lightgray rounded-lg p-1.5 bg-[#f9f9f9] flex flex-col items-center justify-center text-white" style={{ backgroundColor: '#2d3748' }}>
          <h2>Nota Final / Cursos</h2>
        </div>
      </div>
    );
};

export default Cadeira;
