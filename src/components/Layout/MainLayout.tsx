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

  // Determine main content margin based on language
  const mainMargin = language === 'ar' ? 'lg:mr-64' : 'lg:ml-64';

  return (
    <div className={`min-h-screen bg-gray-50 flex ${mainMargin}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} language={language} />
      
      <div className="flex-1">
        <Header onMenuToggle={toggleSidebar} />
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;