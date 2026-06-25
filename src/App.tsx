import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/ui/Layout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Finance from './pages/Finance';
import Calculator from './pages/Calculator';
import Reports from './pages/Reports';
import Goals from './pages/Goals';
import Profile from './pages/Profile';
import { BrickProvider } from './context/BrickContext';

function App() {
  return (
    <BrickProvider>
      <Router>
        <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </Router>
  </BrickProvider>
  );
}

export default App;
