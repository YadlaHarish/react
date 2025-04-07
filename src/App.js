import React from 'react';
import { Route, Routes } from 'react-router-dom'; // Removed BrowserRouter as it's now in index.js
import { AuthProvider } from './auth/AuthContext';
import { PrivateRoute } from './auth/PrivateRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import LearningDashboard from './pages/LearningDashboard';
import AdminPanel from './pages/AdminPanel';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/LearningDashboard" element={<LearningDashboard />} />
          <Route path="/AdminPanel" element={<AdminPanel />} />
          <Route path="/mymcq" element={<mymcq />} /> {/* Ensure mymcq is defined */}
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;

