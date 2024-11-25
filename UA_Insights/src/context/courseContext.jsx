import React, { createContext, useContext, useEffect, useState } from "react";
import * as d3 from "d3";

// Create the context
const CourseContext = createContext();

// Create a provider component
export const CourseProvider = ({ children }) => {
  const [courseMapping, setCourseMapping] = useState({});

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const data = await d3.csv("/cursocod-nome-grau.csv"); // Replace with the correct CSV path
        const mapping = {};

        // Build the mapping object
        data.forEach((row) => {
          mapping[row.codigo] = {
            nome: row.curso,
            grau: row.grau, // Assuming the CSV has `grau`
          };
        });
        console.log("Course data loaded:", mapping);
        setCourseMapping(mapping);
      } catch (error) {
        console.error("Error loading course data:", error);
      }
    };

    fetchCourseData();
  }, []);

  return (
    <CourseContext.Provider value={courseMapping}>
      {children}
    </CourseContext.Provider>
  );
};

// Create a hook for easier access
export const useCourseMapping = () => {
  return useContext(CourseContext);
};
