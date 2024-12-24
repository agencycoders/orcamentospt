import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Definindo o tipo do contexto
interface AuthContextType {
    login: (userData: any) => void;
    logout: () => void;
    user: { email: string } | null;
}

// Criando o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provedor do contexto
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<{ email: string } | null>(null);

    // Verifica se há um usuário armazenado no localStorage ao iniciar
    useEffect(() => {
    // Temporarily set a default user for testing
    const defaultUser = { email: 'test@example.com' };
    setUser(defaultUser); // Set default user for testing
    const storedUser = localStorage.getItem('user') || JSON.stringify(defaultUser);
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData: any) => {
        console.log("Login realizado com:", userData); // Log para verificar os dados do usuário
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); // Armazenando no localStorage
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user'); // Removendo do localStorage
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook para usar o contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('AuthContext não está disponível. Certifique-se de que o AuthProvider está sendo usado.');
    }
    return context;
};

export default AuthContext;
