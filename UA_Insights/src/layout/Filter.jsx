import React, { useState } from 'react';

export const Filter = () => {
    const [selectedYear, setSelectedYear] = useState(2012);
    const startYear = 2012;
    const endYear = 2022;
    const years = Array.from(
        { length: endYear - startYear + 1 },
        (_, i) => startYear + i
    );

    const handleYearChange = (e) => {
        setSelectedYear(Number(e.target.value));
    };

    return (
        <div className="flex h-screen">
            <div className="w-1/4 bg-gray-800 text-white p-4">
                <h2 className="text-xl font-bold mb-4">Filters</h2>
                <div className="mb-6">
                    <label className="block mb-2">Year: {selectedYear}</label>
                    <div className="relative pt-1">
                        <input
                            type="range"
                            min={startYear}
                            max={endYear}
                            value={selectedYear}
                            onChange={handleYearChange}
                            className="
            w-full h-2 
            bg-gray-700 
            rounded-lg 
            appearance-none 
            cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-blue-400
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:bg-blue-400
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:hover:bg-blue-500
          "
                        />
                        <div className="flex w-full justify-between px-1 mt-2">
                            {years.map(year => (
                                <span
                                    key={year}
                                    className={`text-xs ${selectedYear === year
                                        ? 'text-blue-400 font-medium'
                                        : 'text-gray-400'
                                        }`}
                                >
                                    {year === startYear || year === endYear ? year : '|'}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Filter 2</label>
                    <input type="text" className="w-full p-2 rounded bg-gray-700 border border-gray-600" />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Filter 3</label>
                    <input type="text" className="w-full p-2 rounded bg-gray-700 border border-gray-600" />
                </div>
                {/* Add more filters as needed */}
            </div>
        </div>
    );
};

// export default Filter;