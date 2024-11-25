import React, { createContext, useContext, useState, useEffect } from "react";
import * as d3 from "d3";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCSV = async () => {
      setLoading(true);
      try {
        const data = await d3.csv("/notas-alunos-2012-2022-corrigido.csv"); // Replace with the correct path
        setRawData(data);
      } catch (error) {
        console.error("Error loading CSV data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCSV();
  }, []);

  return (
    <DataContext.Provider value={{ rawData, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
