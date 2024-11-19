import React, { useState } from 'react';
import { Filter } from './Filter';
import { Navbar } from './Navbar';

const Base = ({ children }) => {

  return (
    <>
      <div className="flex h-screen">
        <Filter />
        <div className="flex-1 p-4">
          <Navbar/>
          {children}
        </div>
      </div>
    </>
  );
};

export default Base;