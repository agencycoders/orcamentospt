import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext'; // Importando o contexto

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const authContext = useContext(AuthContext); // Obtendo o contexto

    // Verificando se o contexto é válido
    if (!authContext) {
        throw new Error("AuthContext não está disponível. Certifique-se de que o AuthProvider está sendo usado.");
    }

    const { login } = authContext; // Agora é seguro acessar login
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await login({ email, password }); // Passando um objeto com email e password
            navigate('/dashboard'); // Redireciona para o Dashboard após login
        } catch (error) {
            console.error("Erro ao fazer login:", error);
        }
    };

    return (
<div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="bg-white p-6 md:p-8 rounded shadow-md w-full md:w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email:</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Senha:</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Entrar</button>
                </form>
                <p className="mt-4 text-center">
                    <a href="/forgot-password" className="text-blue-500 hover:underline">Esqueceu a senha?</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
