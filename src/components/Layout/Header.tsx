import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { t } = useLanguage();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors tap-target"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
            {t('nav.workshop_system')}
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageSwitcher />
          
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative tap-target">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50">
            <User className="w-5 h-5 text-gray-600" />
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{t('header.workshop_manager')}</p>
              <p className="text-xs text-gray-600">{t('header.manager')}</p>
            </div>
          </div>
          
          {/* Mobile user icon */}
          <div className="sm:hidden">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors tap-target">
              <User className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;