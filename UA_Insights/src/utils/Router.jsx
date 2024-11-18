// FILE: src/utils/Router.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Base from '../layout/Base';
import Universidade from '../pages/Universidade';
//import GraphicScripts from '../components/GraphicScripts'; // Adjust the path as needed

const AppRouter = () => (
  <Router>
    <Base>
      <Routes>
        <Route path="/" element={<Universidade />} />
        {/* <Route path="/graphics" element={<GraphicScripts />} /> */}
        {/* Add other routes here */}
      </Routes>
    </Base>
  </Router>
);

export default AppRouter;