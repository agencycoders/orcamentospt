import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false); // Estado para controlar a visibilidade do Sidebar

    const handleToggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="flex">
            {/* Renderiza o Sidebar apenas se não estiver na página de Login ou Forgot Password */}
            {location.pathname !== '/login' && location.pathname !== '/forgot-password' && (
                <Sidebar isCollapsed={isCollapsed} onToggleCollapse={handleToggleCollapse} />
            )}
<main className={`flex-1 p-4 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-72'}`}>
                <Outlet /> {/* Renderiza o conteúdo da rota */}
            </main>
        </div>
    );
};

export default Layout;
