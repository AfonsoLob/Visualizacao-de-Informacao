import { useFilters } from "../context/FilterContext";
import DepartmentAverageGrade from "../components/departamento/DepartmentAverageGrade";
import DepartmentStudents from "../components/departamento/DepartmentStudents";

const Curso = () => {
  
  const { filters } = useFilters();
  const selectedDepartamento = filters.Departamento?.value;

    return (
      <>
      {!selectedDepartamento ? ( 
        <div className="flex items-center justify-center h-full">
          <h2 className="text-gray-500 font-bold">Selecione um departamento para visualizar os dados!</h2>
        </div>
      ) : (
      <div className="grid grid-cols-2 gap-5 justify-evenly items-center h-auto mt-5">
        <div className="w-full h-[400px] border border-lightgray rounded-lg p-1.5 bg-[#f9f9f9] flex flex-col items-center justify-center text-white" style={{ backgroundColor: '#2d3748' }}>
            <DepartmentAverageGrade/>
        </div>
        <div className="w-full h-[400px] border border-lightgray rounded-lg p-1.5 bg-[#f9f9f9] flex flex-col items-center justify-center text-white" style={{ backgroundColor: '#2d3748' }}>
            <DepartmentStudents/>
        </div>
        <div className="w-full h-[400px] border border-lightgray rounded-lg p-1.5 bg-[#f9f9f9] flex flex-col items-center justify-center text-white" style={{ backgroundColor: '#2d3748' }}>
            <h2>TO DO</h2>
        </div>
        <div className="w-full h-[400px] border border-lightgray rounded-lg p-1.5 bg-[#f9f9f9] flex flex-col items-center justify-center text-white" style={{ backgroundColor: '#2d3748' }}>
            <h2>TO DO</h2>
        </div>
      </div>
      )}
      </>
    );
};

export default Curso;
