import React, { useState, useEffect} from "react";
import Slider from "@mui/material/Slider";
import { useLocation } from "react-router-dom";
import { useFilterConfig } from '../hook/useFilterConfig';
import { useFilters } from '../context/FilterContext';
import * as d3 from "d3";
import Select from 'react-select'; // Util porque deixa dar seach e escolher varias cadeiras ao mesmo tempo (se for preciso)

export const Filter = () => {

  const { filters, updateFilter } = useFilters();
  const filterConfig = useFilterConfig();
  const [yearRange, setYearRange] = useState([2012, 2022]);
  const [dynamicOptions, setDynamicOptions] = useState([]); // Holds dynamic options for the current filter
  const minYear = 2012;
  const maxYear = 2022;

  const [selectedOption, setSelectedOption] = useState("");
  const location = useLocation();
  const csvFile = "/notas-alunos-2012-2022-corrigido.csv";

  

  // // Mocked filter configurations
  // const filterConfig = {
  //   "/universidade": [
  //     {
  //       label: "Regime",
  //       type: "select",
  //       options: ["Todos", "Ordinário", "Trabalhador-Estudante"],
  //     },
  //     {
  //       label: "Tipo de Acesso",
  //       type: "select",
  //       options: ["Todos", "Regime Geral", "Transferência"],
  //     },
  //   ],
  //   "/departamento": [
  //     {
  //       label: "Departamento",
  //       type: "select",
  //       options: ["DETI", "DBIO", "DMAT"],
  //     },
  //     {
  //       label: "Taxa de Aprovação",
  //       type: "select",
  //       options: ["Todas", ">50%", ">75%"],
  //     },
  //   ],
  //   "/curso": [
  //     {
  //       label: "Curso",
  //       type: "dynamic-select",
  //       code: "icursocod",
  //     },
  //     {
  //       label: "Semestre",
  //       type: "select",
  //       options: ["Todos", "1º", "2º"],
  //     },
  //   ],
  //   "/cadeira": [
  //     {
  //       label: "Disciplina",
  //       type: "dynamic-select",
  //       code: "idisciplinaid",
  //     },
  //     {
  //       label: "Época",
  //       type: "select",
  //       options: ["Todas", "Normal", "Recurso"],
  //     },
  //   ],
  // };

  // Custom styles for react-select to match dark theme
  const customStyles = {
    control: (base) => ({
      ...base,
      background: '#374151',
      borderColor: '#4B5563',
      '&:hover': {
        borderColor: '#6B7280',
      },
    }),
    menu: (base) => ({
      ...base,
      background: '#374151',
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      background: isSelected
        ? '#68E713'
        : isFocused
          ? '#4B5563'
          : '#374151',
      color: isSelected ? 'black' : 'white',
      '&:hover': {
        background: '#4B5563',
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: 'white',
    }),
    input: (base) => ({
      ...base,
      color: 'white',
    }),
  };
  const marks = Array.from({ length: maxYear - minYear + 1 }, (_, i) => ({
    value: minYear + i,
    label:
      minYear + i === minYear || minYear + i === maxYear ? `${minYear + i}` : "|",
  }));
  const handleYearRangeChange = (_, newValue) => {
    setYearRange(newValue);
  };
  // End custom 

  // Updated handleOptionChange for React Select
  // const handleOptionChange = (selectedValue) => {
  //   setSelectedOption(selectedValue);
  //   // If you need to notify parent component
  //   // if (props.onFilterChange) {
  //   //   props.onFilterChange(selectedValue);
  //   // }
  // };

  // General function to load unique options dynamically
  // codigo esta uma confusao
  // const loadDynamicOptions = async (field) => {
  //   try {
  //     const data = await d3.csv('/notas-alunos-2012-2022-corrigido.csv');
  //     return Array.from(new Set(data.map(d => d[field]))).sort();
  //   } catch (error) {
  //     console.error(`Erro ao carregar opções para ${field}:`, error);
  //     return [];
  //   }
  // };

  useEffect(() => {
    const loadOptions = async () => {
      const dynamicFilters = filterConfig.filter(f => f.isDynamic);
      
      for (const filter of dynamicFilters) {
        try {
          const data = await d3.csv('/notas-alunos-2012-2022-corrigido.csv');
          const options = Array.from(new Set(data.map(d => d[filter.field])))
            .sort()
            .map(value => ({ value, label: value }));
          
          setDynamicOptions(prev => ({
            ...prev,
            [filter.field]: options
          }));
        } catch (error) {
          console.error(`Error loading options for ${filter.field}:`, error);
        }
      }
    };

    loadOptions();
  }, [filterConfig]);

  const renderFilter = (filter) => {
    switch (filter.type) {
      case 'select':
        return (
          <Select
            styles={customStyles}
            options={filter.isDynamic ? 
              dynamicOptions[filter.field] || [] : 
              filter.options.map(opt => ({ value: opt, label: opt }))}
            onChange={(value) => updateFilter(filter.field, value)}
            value={filters[filter.field]}
            placeholder={`Select ${filter.label}...`}
          />
        );
      default:
        return null;
    }
  };

  // UseEffect to handle dynamic field loading based on the current path
  // useEffect(() => {
  //   const currentFilters = filterConfig[location.pathname];
  //   const dynamicFilter = currentFilters?.find(
  //     (filter) => filter.type === "dynamic-select"
  //   );

  //   if (dynamicFilter) {
  //     loadDynamicOptions(dynamicFilter.code); // Load options for the specified field
  //   } else {
  //     setDynamicOptions([]); // Clear options if no dynamic filter is active
  //   }
  // }, [location.pathname]);

  // const currentFilters =
  //   filterConfig[location.pathname] || filterConfig["/universidade"];

  // const renderFilter = (filter) => {
  //   // x\ options outside switch to avoid scoping issues
  //   const staticOptions = filter.options?.map(opt => ({
  //     value: opt,
  //     label: opt
  //   })) || [];

  //   const mappedDynamicOptions = dynamicOptions.map(opt => ({
  //     value: opt,
  //     label: opt
  //   }));


  //   switch (filter.type) {
  //     case "select":
  //       return (
  //         <Select
  //           options={staticOptions}
  //           styles={customStyles}
  //           placeholder={`Select ${filter.label}...`}
  //           onChange={(selectedOption) => handleOptionChange(selectedOption?.value)}
  //         />
  //       );

  //     case "dynamic-select":
  //       return (
  //         <Select
  //           options={mappedDynamicOptions}
  //           styles={customStyles}
  //           placeholder={`Select ${filter.label}...`}
  //           value={selectedOption ? { value: selectedOption, label: selectedOption } : null}
  //           onChange={(newValue) => handleOptionChange(newValue?.value)}
  //         />
  //       );
  //     default:
  //       return null;
  //   }
  // };

  return (
    <div className="w-1/4 bg-gray-800 text-white p-4">
      <img src="/UA_logo.png" alt="UA Logo" className="w-72 mb-8 mx-auto" />
      <div className="mb-6 text-xl text-left">
        <label className="block mb-2">
          Anos: De {yearRange[0]} a {yearRange[1]}
        </label>
        <div className="px-4 pt-1 mb-6">
          <Slider
            value={yearRange}
            onChange={handleYearRangeChange}
            valueLabelDisplay="auto"
            min={minYear}
            max={maxYear}
            marks={marks}
            sx={{
              color: "#68E713", // primary color
              "& .MuiSlider-thumb": {
                backgroundColor: "#ffffff",
              },
              "& .MuiSlider-track": {
                border: "none",
              },
              "& .MuiSlider-valueLabel": {
                backgroundColor: "#68E713",
              },
              "& .MuiSlider-mark": {
                backgroundColor: "#ffffff",
              },
              "& .MuiSlider-markLabel": {
                color: "#ffffff",
              },
              "& .MuiSlider-markLabelActive": {
                color: "#68E713",
              },
            }}
          />
        </div>
      </div>
      {filterConfig.map((filter, index) => (
        <div key={index} className="mb-6">
          <label className="block mb-2">{filter.label}</label>
          {renderFilter(filter)}
        </div>
      ))}
    </div>
  );
};
