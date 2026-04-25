import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CarnetGlygemie from './pages/CarnetGlygemie';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/patient/:patientId" element={<PrivateRoute><CarnetGlygemie /></PrivateRoute>} />
        <Route path="/mon-carnet" element={<PrivateRoute><CarnetGlygemie /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;