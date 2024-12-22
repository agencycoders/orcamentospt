import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Building2
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [tooltipDelay, setTooltipDelay] = useState<NodeJS.Timeout | null>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Cleanup tooltip delay on unmount
  useEffect(() => {
    return () => {
      if (tooltipDelay) clearTimeout(tooltipDelay);
    };
  }, [tooltipDelay]);

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/', 
      icon: LayoutDashboard,
      description: 'Visão geral do sistema'
    },
    { 
      name: 'Orçamentos', 
      href: '/budgets', 
      icon: FileText,
      description: 'Gerenciar orçamentos'
    },
    { 
      name: 'Clientes', 
      href: '/clients', 
      icon: Users,
      description: 'Gerenciar clientes'
    },
    { 
      name: 'Configurações', 
      href: '/settings', 
      icon: Settings,
      description: 'Configurações do sistema'
    },
  ];

  const handleMouseEnter = (itemName: string) => {
    if (tooltipDelay) clearTimeout(tooltipDelay);
    const delay = setTimeout(() => {
      setHoveredItem(itemName);
    }, 200); // Show tooltip after 200ms
    setTooltipDelay(delay);
  };

  const handleMouseLeave = () => {
    if (tooltipDelay) clearTimeout(tooltipDelay);
    const delay = setTimeout(() => {
      setHoveredItem(null);
    }, 100); // Hide tooltip after 100ms
    setTooltipDelay(delay);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-50 rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed 
          inset-y-0 
          left-0 
          z-40 
          flex 
          flex-col 
          bg-white 
          border-r 
          border-gray-200 
          pt-5 
          pb-4 
          transition-all 
          duration-300 
          ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 
          ${isCollapsed ? 'lg:w-[4.5rem]' : 'lg:w-72'}
          w-72
          shadow-xl
        `}
      >
        {/* Logo */}
        <div className={`
          px-4 
          pb-4 
          mb-5 
          border-b 
          border-gray-200 
          transition-all 
          duration-300 
          ${isCollapsed ? 'lg:px-2' : 'lg:px-6'}
        `}>
          <Link 
            to="/" 
            className="flex items-center gap-3 transition-all duration-300 group"
            title={isCollapsed ? "Lopes Orçamentos" : undefined}
          >
            <Building2 className="h-8 w-8 text-blue-600 flex-shrink-0 transition-transform group-hover:scale-110" />
            <span className={`
              text-xl 
              font-semibold 
              text-gray-900
              transition-all 
              duration-300
              ${isCollapsed ? 'lg:opacity-0 lg:invisible lg:w-0' : 'opacity-100 visible w-auto'}
            `}>
              Lopes Orçamentos
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 relative">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const isHovered = hoveredItem === item.name;

            return (
              <div 
                key={item.name} 
                className="relative group"
                onMouseEnter={() => handleMouseEnter(item.name)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to={item.href}
                  className={`
                    flex 
                    items-center 
                    gap-x-3 
                    px-3 
                    py-2.5 
                    rounded-lg 
                    text-sm 
                    font-medium 
                    transition-all 
                    duration-200
                    ${active
                      ? 'bg-blue-50 text-blue-600 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                    ${isCollapsed ? 'lg:justify-center lg:px-2' : ''}
                    hover:shadow-md
                    group
                  `}
                >
                  <Icon className={`
                    h-5 
                    w-5 
                    flex-shrink-0 
                    transition-all 
                    duration-200
                    ${active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}
                    group-hover:scale-110
                  `} />
                  <span className={`
                    transition-all 
                    duration-300
                    ${isCollapsed ? 'lg:opacity-0 lg:invisible lg:w-0' : 'opacity-100 visible w-auto'}
                  `}>
                    {item.name}
                  </span>
                </Link>

                {/* Enhanced Tooltip */}
                {isCollapsed && isHovered && (
                  <div className="
                    absolute 
                    left-full 
                    top-1/2 
                    -translate-y-1/2 
                    ml-2 
                    px-4 
                    py-3 
                    bg-gray-900 
                    text-white 
                    rounded-lg 
                    whitespace-nowrap 
                    z-50
                    shadow-lg
                    pointer-events-none
                    animate-fadeIn
                    min-w-[160px]
                  ">
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                    <div className="relative">
                      <div className="font-medium mb-1">{item.name}</div>
                      <div className="text-xs text-gray-300 opacity-90">{item.description}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`
          px-4 
          mt-6 
          transition-all 
          duration-300
          ${isCollapsed ? 'lg:px-2' : 'lg:px-6'}
        `}>
          <div className="
            rounded-lg 
            bg-blue-50 
            p-4 
            transition-all 
            duration-300
            hover:bg-blue-100
            group
          ">
            <div className="flex items-center gap-3">
              <FileText className="
                h-6 
                w-6 
                text-blue-600 
                flex-shrink-0
                transition-transform
                group-hover:scale-110
              " />
              <div className={`
                transition-all 
                duration-300
                ${isCollapsed ? 'lg:opacity-0 lg:invisible lg:w-0' : 'opacity-100 visible w-auto'}
              `}>
                <h3 className="text-sm font-medium text-blue-900">
                  Lopes Orçamentos
                </h3>
                <p className="mt-1 text-xs text-blue-700">
                  v0.1.0
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Collapse button */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="
            hidden 
            lg:flex 
            absolute 
            -right-3 
            top-16 
            h-7 
            w-7
            items-center 
            justify-center 
            rounded-full 
            border 
            border-gray-200 
            bg-white 
            text-gray-400 
            hover:text-gray-600
            hover:bg-gray-50
            hover:border-gray-300
            focus:outline-none 
            focus:ring-2 
            focus:ring-blue-500 
            focus:ring-offset-2
            shadow-sm
            transition-all 
            duration-200
            hover:scale-110
            group
          "
          title={isCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          ) : (
            <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
          )}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
