import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';
import RequireAuth from './components/RequireAuth'; // Import RequireAuth component
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
import Login from './pages/Login'; // Import Login component
import ForgotPassword from './pages/ForgotPassword'; // Import ForgotPassword component

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthProvider><Layout /></AuthProvider>,
    children: [
      {
        path: 'login',
        element: <Login />, // Add the login route
      },
      {
        path: 'forgot-password', // Add the forgot password route
        element: <ForgotPassword />,
      },
      {
        path: 'dashboard', // New route for Dashboard
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
      },
      {
        index: true,
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
        errorElement: <div>Custom error message for Dashboard loading failure.</div>
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
