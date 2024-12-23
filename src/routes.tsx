import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import ClientsList from './pages/clients/ClientsList';
import ClientForm from './pages/clients/ClientForm';
import ClientDetails from './pages/clients/ClientDetails';
import BudgetsList from './pages/budgets/BudgetsList';
import CreateBudget from './pages/budgets/CreateBudget';
import BudgetDetails from './pages/budgets/BudgetDetails';
import SettingsLayout from './pages/settings/SettingsLayout';
import CompanyProfile from './pages/settings/CompanyProfile';
import SMTPSettings from './pages/settings/SMTPSettings';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import RequireAuth from './components/RequireAuth'; // Importando o componente de proteção

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace /> // Redireciona para o login se não houver um índice
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />
      },
      {
        path: 'dashboard',
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ) // Protegendo a rota do Dashboard
      },
      {
        path: 'clients',
        children: [
          {
            index: true,
            element: <ClientsList />
          },
          {
            path: 'new',
            element: <ClientForm />
          },
          {
            path: ':id',
            element: <ClientDetails />
          },
          {
            path: ':id/edit',
            element: <ClientForm />
          }
        ]
      },
      {
        path: 'budgets',
        children: [
          {
            index: true,
            element: <BudgetsList />
          },
          {
            path: 'new',
            element: <CreateBudget />
          },
          {
            path: ':id',
            element: <BudgetDetails />
          },
          {
            path: ':id/edit',
            element: <CreateBudget />
          }
        ]
      },
      {
        path: 'settings',
        element: <SettingsLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/settings/company" replace />
          },
          {
            path: 'company',
            element: <CompanyProfile />
          },
          {
            path: 'smtp',
            element: <SMTPSettings />
          }
        ]
      }
    ]
  }
]);
