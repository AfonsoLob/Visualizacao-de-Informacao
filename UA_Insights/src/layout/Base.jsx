import React from 'react';
import { Filter } from './Filter';
import { Navbar } from './Navbar';
import { FilterProvider } from '../context/FilterContext';
import { CourseProvider } from '../context/courseContext';
const Base = ({ children }) => {
  return (
    <FilterProvider>
      <CourseProvider>
        <div className="flex min-h-screen">
          <Filter />
          <div className="flex-1 p-4">
            <Navbar />
            {children}
          </div>
        </div>
      </CourseProvider>
    </FilterProvider>
  );
};

export default Base;