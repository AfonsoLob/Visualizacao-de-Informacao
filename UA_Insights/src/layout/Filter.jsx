import React, { useState } from 'react';
import Slider from '@mui/material/Slider';

export const Filter = () => {
    const [yearRange, setYearRange] = useState([2012, 2022]);
    const minYear = 2012;
    const maxYear = 2022;

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
                            }
                        }}
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-2">Filter 2</label>
                    <input type="text" className="w-full p-2 rounded bg-gray-700 border border-gray-600" />
                </div>
                <div className="mb-6">
                    <label className="block mb-2">Filter 3</label>
                    <input type="text" className="w-full p-2 rounded bg-gray-700 border border-gray-600" />
                </div>
            </div>
        </div>
    );
};