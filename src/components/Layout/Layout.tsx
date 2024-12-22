import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  // Initialize state from localStorage or default to false
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  // Save to localStorage whenever the state changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />

      {/* Main Content */}
      <main 
        className={`
          flex-1 
          relative
          min-h-screen
          transition-all 
          duration-300 
          ease-in-out
          ${isSidebarCollapsed ? 'lg:ml-[4.5rem]' : 'lg:ml-72'}
          ml-0
        `}
      >
        {/* Content wrapper with responsive padding */}
        <div className="
          h-full
          p-4 
          sm:p-6 
          lg:p-8 
          transition-all 
          duration-300
          ease-in-out
        ">
          {/* Page content */}
          <div className="
            max-w-[2000px] 
            mx-auto 
            transition-all 
            duration-300
            animate-slideIn
          ">
            <Outlet />
          </div>
        </div>

        {/* Background overlay for mobile menu */}
        <div 
          className={`
            fixed 
            inset-0 
            bg-gray-900/20 
            backdrop-blur-sm 
            lg:hidden
            transition-opacity 
            duration-300
            ${isSidebarCollapsed ? 'opacity-0 pointer-events-none' : ''}
          `}
          onClick={() => setIsSidebarCollapsed(true)}
        />
      </main>
    </div>
  );
};

export default Layout;
