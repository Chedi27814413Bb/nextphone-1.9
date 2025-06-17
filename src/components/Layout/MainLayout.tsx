import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { language } = useLanguage();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={`min-h-screen bg-gray-50 flex ${language === 'ar' ? 'lg:mr-64' : 'lg:ml-64'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      <div className="flex-1">
        <Header onMenuToggle={toggleSidebar} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;