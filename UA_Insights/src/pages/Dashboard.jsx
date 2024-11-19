// src/pages/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="min-h-screen p-6">
      {/* Hero Section */}
      <div className="hero bg-gray-800 text-white rounded-xl mb-4">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <img src="/UA_logo.png" alt="UA Logo" className="w-48 mx-auto mb-4" />
            <h1 className="text-5xl font-bold">UA Insights</h1>
            <p className="py-6">Explore academic performance data across departments, courses, and subjects at the University of Aveiro.</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <div className="stat bg-gray-800 text-white rounded-xl">
          <div className="stat-title">Students</div>
          <div className="stat-value">10K+</div>
          <div className="stat-desc">2012-2022</div>
        </div>
        <div className="stat bg-gray-800 text-white rounded-xl">
          <div className="stat-title">Courses</div>
          <div className="stat-value">50+</div>
          <div className="stat-desc">Across departments</div>
        </div>
        <div className="stat bg-gray-800 text-white rounded-xl">
          <div className="stat-title">Departments</div>
          <div className="stat-value">15+</div>
          <div className="stat-desc">Academic units</div>
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
        <div className="card-body">
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