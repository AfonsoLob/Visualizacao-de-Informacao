// FILE: universidade.jsx
// import React, { useEffect } from 'react';
// import { loadAndProcessData } from '../d3/universidade_Script';

// const Universidade = () => {
//   useEffect(() => {
//     loadAndProcessData();
//   }, []);

//   return (
//     <div className="grid grid-cols-4 gap-10 place-items-center">
//       {/* <h1>BOAS</h1> */}
//       <div id="approvedPerYearChart" className="col-span-2"></div>
//       <div id="regimeChart" className="col-span-2"></div>
//       <div id="studentsPerYearChart" className="col-span-2"></div>
//       <div id="studentsPerDeptChart" className="col-span-4"></div>
//     </div>
//   );
// };

// export default Universidade;
import React from 'react';
import ApprovedGradesChart from '../components/ApprovedGradesChart';

const Universidade = () => {
  return (
    <div className="p-4">
      <ApprovedGradesChart data={data} />
    </div>
  );
};

export default Universidade;