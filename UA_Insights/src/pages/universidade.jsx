// FILE: universidade.jsx
import React, { useEffect } from 'react';
import { loadAndProcessData } from './d3/universidade_Script';

const GraphicScripts = () => {
  useEffect(() => {
    loadAndProcessData();
  }, []);

  return (
    <div className="grid grid-cols-4 gap-10 place-items-center">
      <div id="approvedPerYearChart" className="col-span-2"></div>
      <div id="regimeChart" className="col-span-2"></div>
      <div id="studentsPerYearChart" className="col-span-2"></div>
      <div id="studentsPerDeptChart" className="col-span-4"></div>
    </div>
  );
};

export default GraphicScripts;