import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Get saved state from localStorage or default to false
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    // Collapse by default on mobile
    if (window.innerWidth < 768) {
      setIsCollapsed(true);
    }

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    if (!isMobile) {
      const newState = !isCollapsed;
      setIsCollapsed(newState);
      // Save state to localStorage
      localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
    }
  };

  return (
    <div className="flex">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} isMobile={isMobile} />
      
      <div 
        className={`flex-1 bg-gray-100 h-screen overflow-auto transition-all duration-300 ease-in-out ${
          isCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;