import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth(); // Obtendo o usuário do contexto

    // Se o usuário não estiver autenticado, redireciona para a página de login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>; // Se o usuário estiver autenticado, renderiza os filhos
};

export default RequireAuth;
