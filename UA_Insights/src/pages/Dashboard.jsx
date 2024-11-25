// src/pages/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaSmile } from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="m-6">
      {/* Hero Section */}
      <div className="hero bg-gray-800 text-white rounded-xl mb-4">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <img src="/UA_logo3.png" alt="UA Logo" className="w-16 mx-auto mb-4" />
            <h1 className="text-5xl font-bold">UA Insights</h1>
            <p className="py-6">Visualize a informação de performance académica dos alunos através dos departamentos, cursos e cadeiras da Universidade Aveiro.</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 place-items-center">
        <div className="stat bg-gray-800 text-white rounded-xl text-center w-full">
          <div className="stat-title">Alunos</div>
          <div className="stat-value">15mil+</div>
          <div className="stat-desc">2012-2022</div>
        </div>
        <div className="stat bg-gray-800 text-white rounded-xl text-center w-full">
          <div className="stat-title">Cursos</div>
          <div className="stat-value">50+</div>
          <div className="stat-desc">Em diversos departamentos</div>
        </div>
        <div className="stat bg-gray-800 text-white rounded-xl text-center w-full">
          <div className="stat-title">Departamentos</div>
          <div className="stat-value">18</div>
          <div className="stat-desc flex items-center justify-center gap-1">
            Deti é o melhor <FaSmile className="inline-block  size-4"  />
          </div>
        </div>
      </div>

      {/* Quick Navigation
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link to="/universidade" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
          <div className="card-body">
            <h2 className="card-title">University Overview</h2>
            <p>Global statistics and trends</p>
          </div>
        </Link>
        <Link to="/dept" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
          <div className="card-body">
            <h2 className="card-title">Departments</h2>
            <p>Department-wise analysis</p>
          </div>
        </Link>
        <Link to="/curso" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
          <div className="card-body">
            <h2 className="card-title">Courses</h2>
            <p>Course performance metrics</p>
          </div>
        </Link>
        <Link to="/cadeira" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
          <div className="card-body">
            <h2 className="card-title">Subjects</h2>
            <p>Subject-level insights</p>
          </div>
        </Link>
      </div> */}

      {/* Getting Started */}
      <div className="card bg-gray-800 shadow-xl text-white">
        <div className="card-body p-0">
          <h2 className="card-title">Getting Started</h2>
          <div className="steps steps-vertical">
            <div className="step step-success">Select view level (University/Department/Course/Subject)</div>
            <div className="step step-success">Use filters to narrow down data</div>
            <div className="step step-success">Explore interactive visualizations</div>
            <div className="step step-success">Export or share insights</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;