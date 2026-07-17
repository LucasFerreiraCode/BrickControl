import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/ui/Layout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Finance from './pages/Finance';
import Calculator from './pages/Calculator';
import Reports from './pages/Reports';
import Goals from './pages/Goals';
import Profile from './pages/Profile';
import AIAdvisor from './pages/AIAdvisor';
import { BrickProvider } from './context/BrickContext';
import { motion } from 'framer-motion';
function App() {
  return (
    <BrickProvider>
      <div className="relative overflow-hidden">
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/ai-advisor" element={<AIAdvisor />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Layout>
        </Router>
      </div>
    </BrickProvider>
  );
}

export default App;
