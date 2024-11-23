import React from 'react';
import { Filter } from './Filter';
import { Navbar } from './Navbar';
import { FilterProvider } from '../context/FilterContext';

const Base = ({ children }) => {
  return (
    <FilterProvider>
      <div className="flex h-screen">
        <Filter />
        <div className="flex-1 p-4">
          <Navbar />
          {children}
        </div>
      </div>
    </FilterProvider>
  );
};

export default Base;