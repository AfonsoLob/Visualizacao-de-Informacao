import React, { useState, useEffect} from "react";
import Slider from "@mui/material/Slider";
// import { useLocation } from "react-router-dom";
import { useFilterConfig } from '../hook/useFilterConfig';
import { useFilters } from '../context/FilterContext';
import * as d3 from "d3";
import Select from 'react-select'; // Util porque deixa dar seach e escolher varias cadeiras ao mesmo tempo (se for preciso)
import { useCourseMapping } from "../context/courseContext";

export const Filter = () => {

  const { filters, updateFilter } = useFilters();
  const filterConfig = useFilterConfig();
  const [yearRange, setYearRange] = useState([2012, 2022]);
  const [dynamicOptions, setDynamicOptions] = useState([]); // Holds dynamic options for the current filter
  const minYear = 2012;
  const maxYear = 2022;
  const courseMapping = useCourseMapping();

  // const [selectedOption, setSelectedOption] = useState("");
  // const location = useLocation();  
  // const csvFile = "/notas-alunos-2012-2022-corrigido.csv";

  
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
    updateFilter('years', newValue);
  };
  // End custom 

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
        const currentValue = filters[filter.label] || null;
        return (
          <Select
            key={`${location.pathname}-${filter.label}`}
            styles={customStyles}
            options={filter.isDynamic ? 
              (filter.label === "Departamento" ? 
          (dynamicOptions[filter.field] || []).map(opt => ({ ...opt, label: opt.label.toUpperCase() })) : 
          filter.label === "Curso" ? 
            (dynamicOptions[filter.field] || []).map(opt => {
              const course = courseMapping[opt.value];
              const grauInitial = course ? `(${course.grau.charAt(0)}) ` : '';
              return { ...opt, label: `${grauInitial}${course ? course.nome : opt.label}` };
            }) : 
            dynamicOptions[filter.field] || []) : 
              filter.options.map(opt => ({ value: opt, label: filter.label === "Departamento" ? opt.toUpperCase() : opt }))}
            onChange={(value) => updateFilter(filter.label, value)}
            value={filters[filter.field]}
            placeholder={`Select ${filter.label}...`}
          />
        );
      default:
        return null;
    }
  };

  
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
            onChange={(_, newValue) => setYearRange(newValue)}
            onChangeCommitted={handleYearRangeChange}
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
