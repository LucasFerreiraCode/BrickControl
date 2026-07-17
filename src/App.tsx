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
import { motion, useSpring, useMotionValue } from 'framer-motion';

function App() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 250);
      mouseY.set(e.clientY - 250);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <BrickProvider>
      <div className="relative overflow-hidden">
        {/* Interactive Mouse Glow */}
        <motion.div 
          className="pointer-events-none fixed z-0 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]"
          style={{ x: springX, y: springY }}
        />
        
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
