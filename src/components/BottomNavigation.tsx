import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Activity, History, Settings } from 'lucide-react';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      path: '/',
      icon: Home,
      label: 'Accueil',
      active: isActive('/')
    },
    {
      path: '/diagnostic',
      icon: Activity,
      label: 'Diagnostic',
      active: isActive('/diagnostic')
    },
    {
      path: '/history',
      icon: History,
      label: 'Historique',
      active: isActive('/history')
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around py-2 px-4">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center py-3 px-4 rounded-2xl transition-all duration-200 ${
                item.active
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <item.icon className={`w-6 h-6 mb-1 transition-transform duration-200 ${
                item.active ? 'scale-110' : ''
              }`} />
              <span className={`text-xs font-medium transition-all duration-200 ${
                item.active ? 'font-semibold' : ''
              }`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
