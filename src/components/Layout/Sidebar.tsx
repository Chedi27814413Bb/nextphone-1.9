import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Wrench, 
  Settings,
  BarChart3,
  Archive,
  Smartphone
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'ar' | 'fr';
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, language }) => {
  const location = useLocation();
  const { t } = useLanguage();

  const menuItems = [
    { icon: Home, label: t('nav.dashboard'), path: '/dashboard' },
    { icon: Wrench, label: t('nav.repairs'), path: '/repairs' },
    { icon: Package, label: t('nav.inventory'), path: '/inventory' },
    { icon: Smartphone, label: t('nav.brands'), path: '/brands' },
    { icon: BarChart3, label: t('nav.reports'), path: '/reports' },
    { icon: Archive, label: t('nav.archive'), path: '/archive' },
    { icon: Settings, label: t('nav.settings'), path: '/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Determine positioning and text alignment based on language
  const sidebarPosition = language === 'ar' ? 'right-0' : 'left-0';
  const textAlignment = language === 'ar' ? 'text-right' : 'text-left';
  const translateClass = language === 'ar' ? 
    (isOpen ? 'translate-x-0' : 'translate-x-full') : 
    (isOpen ? 'translate-x-0' : '-translate-x-full');

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed ${sidebarPosition} top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
        ${translateClass}
        lg:translate-x-0 lg:static lg:shadow-none
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className={`text-xl font-bold text-gray-800 ${textAlignment}`}>
              {t('nav.workshop_name')}
            </h2>
            <p className={`text-sm text-gray-600 ${textAlignment} mt-1`}>
              {t('nav.comprehensive_system')}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
                      ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}
                      ${isActive(item.path)
                        ? `bg-blue-50 text-blue-600 ${language === 'ar' ? 'border-r-4' : 'border-l-4'} border-blue-600`
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;