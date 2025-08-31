import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaHome, FaStickyNote, FaTasks, FaComments } from 'react-icons/fa';

const Navigation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      path: '/dashboard',
      icon: FaHome,
      label: t('nav.dashboard'),
      translationKey: 'nav.dashboard'
    },
    {
      path: '/notes',
      icon: FaStickyNote,
      label: t('nav.notes'),
      translationKey: 'nav.notes'
    },
    {
      path: '/tasks',
      icon: FaTasks,
      label: t('nav.tasks'),
      translationKey: 'nav.tasks'
    },
    {
      path: '/chat',
      icon: FaComments,
      label: t('nav.chat'),
      translationKey: 'nav.chat'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-card-bg border-b border-border-light shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`cursor-pointer flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  isActive(item.path)
                    ? 'text-blue-600 border-blue-600'
                    : 'text-text-body border-transparent hover:text-primary hover:border-gray-300'
                }`}
              >
                <Icon className="text-lg" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
