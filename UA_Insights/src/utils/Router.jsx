// FILE: src/utils/Router.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Base from '../layout/Base';
import Universidade from '../pages/Universidade';
import Cadeira from '../pages/Cadeira';
import Curso from '../pages/Curso';
import Departamento from '../pages/Departamento';
import Dashboard from '../pages/Dashboard';
//import GraphicScripts from '../components/GraphicScripts'; // Adjust the path as needed

const AppRouter = () => (
  <Router>
    <Base>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/universidade" element={<Universidade />} />
        <Route path='/curso' element={<Curso />} />
        <Route path="/cadeira" element={<Cadeira />} />
        <Route path="/departamento" element={<Departamento />} />
        {/* <Route path="/graphics" element={<GraphicScripts />} /> */}
        {/* Add other routes here */}
      </Routes>
    </Base>
  </Router>
);

export default AppRouter;