import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Building2, Mail } from 'lucide-react';

const SettingsLayout = () => {
  const location = useLocation();

  const navigation = [
    {
      name: 'Perfil da Empresa',
      href: '/settings/company',
      icon: Building2,
      current: location.pathname === '/settings/company'
    },
    {
      name: 'Configurações de Email',
      href: '/settings/smtp',
      icon: Mail,
      current: location.pathname === '/settings/smtp'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          </div>

          <div className="mt-6 grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <aside className="col-span-12 sm:col-span-3">
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        item.current
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-3 py-2 text-sm font-medium border-l-4`}
                    >
                      <Icon
                        className={`${
                          item.current
                            ? 'text-blue-500'
                            : 'text-gray-400 group-hover:text-gray-500'
                        } flex-shrink-0 -ml-1 mr-3 h-6 w-6`}
                      />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </aside>

            {/* Content */}
            <main className="col-span-12 sm:col-span-9">
              <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
