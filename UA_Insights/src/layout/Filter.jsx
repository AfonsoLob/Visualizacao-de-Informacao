import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import { useLocation } from 'react-router-dom';



export const Filter = () => {
    const [yearRange, setYearRange] = useState([2012, 2022]);
    const minYear = 2012;
    const maxYear = 2022;
    const location = useLocation();

    //mocked data
    const filterConfig = {
        '/universidade': [
            {
                label: "Regime",
                type: "select",
                options: ["Todos", "Ordinário", "Trabalhador-Estudante"]
            },
            {
                label: "Tipo de Acesso",
                type: "select",
                options: ["Todos", "Regime Geral", "Transferência"]
            }
        ],
        '/departamento': [
            {
                label: "Departamento",
                type: "select",
                options: ["DETI", "DBIO", "DMAT"]
            },
            {
                label: "Taxa de Aprovação",
                type: "select",
                options: ["Todas", ">50%", ">75%"]
            }
        ],
        '/curso': [
            {
                label: "Curso",
                type: "select",
                options: ["LEI", "LECI", "MIEET"]
            },
            {
                label: "Semestre",
                type: "select",
                options: ["Todos", "1º", "2º"]
            }
        ],
        '/cadeira': [
            {
                label: "Disciplina",
                type: "select",
                options: ["Todas", "Programação I", "Cálculo I"]
            },
            {
                label: "Época",
                type: "select",
                options: ["Todas", "Normal", "Recurso"]
            }
        ]
    };

    const marks = Array.from(
        { length: maxYear - minYear + 1 },
        (_, i) => ({
            value: minYear + i,
            label: minYear + i === minYear || minYear + i === maxYear ? `${minYear + i}` : '|'
        })
    );

    const handleYearRangeChange = (_, newValue) => {
        setYearRange(newValue);
    };


    const currentFilters = filterConfig[location.pathname] || filterConfig['/universidade'];

    const renderFilter = (filter) => {
        switch (filter.type) {
            // Add more filter types as needed
            case 'select':
                return (
                    <select className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white">
                        {filter.options.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
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
                        onChange={handleYearRangeChange}
                        valueLabelDisplay="auto"
                        min={minYear}
                        max={maxYear}
                        marks={marks}
                        sx={{
                            color: '#68E713', // primary color
                            '& .MuiSlider-thumb': {
                                backgroundColor: '#ffffff',
                            },
                            '& .MuiSlider-track': {
                                border: 'none',
                            },
                            '& .MuiSlider-valueLabel': {
                                backgroundColor: '#68E713',
                            },
                            '& .MuiSlider-mark': {
                                backgroundColor: '#ffffff',
                            },
                            '& .MuiSlider-markLabel': {
                                color: '#ffffff',
                            },
                            '& .MuiSlider-markLabelActive': {
                                color: '#68E713',
                            }
                        }}
                    />
                </div>
            </div>
            {currentFilters.map((filter, index) => (
                <div key={index} className="mb-6">
                    <label className="block mb-2">{filter.label}</label>
                    {renderFilter(filter)}
                </div>
            ))}

        </div>
    );
};