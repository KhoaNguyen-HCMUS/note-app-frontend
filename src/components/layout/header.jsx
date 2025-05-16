import { useState } from 'react';
import { FaStickyNote, FaSignOutAlt, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../common/themeToggle.jsx';

export default function Header() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('username') || 'User';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <header className='bg-white dark:bg-gray-900 shadow-sm'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center py-3'>
          {/* Logo and App Name */}
          <div className='flex items-center bg-linear-(--gradient-text) dark:bg-linear-(--gradient-text-dark) bg-clip-text text-transparent'>
            <FaStickyNote className='text-blue-600 mr-2' size={24} />
            <h1 className='text-xl font-semibold'>Lument Note App</h1>
          </div>

          {/* Mobile Menu Button */}
          <button
            className='md:hidden p-2 text-primary dark:text-primary-dark'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Desktop and Mobile Menu */}
          <div
            className={`
            ${isMenuOpen ? 'flex' : 'hidden'} 
            md:flex 
            flex-col md:flex-row 
            items-center 
            space-y-4 md:space-y-0 
            md:space-x-4
            absolute md:relative 
            top-16 md:top-0 
            left-0 md:left-auto 
            right-0 md:right-auto 
            bg-white dark:bg-gray-900 
            md:bg-transparent 
            p-4 md:p-0 
            shadow-lg md:shadow-none
            z-50
          `}
          >
            <ThemeToggle />

            <div className='flex items-center gap-2 text-primary dark:text-primary-dark'>
              <FaUser size={20} />
              <span>{userName}</span>
            </div>

            <button
              className='cursor-pointer flex items-center gap-2 px-4 py-2 border border-button-red-bg dark:border-button-red-bg-dark text-button-red-bg dark:text-button-red-bg-dark hover:bg-button-red-hover-light dark:hover:bg-button-red-hover-dark/30 rounded-lg transition-colors w-full md:w-auto justify-center'
              onClick={handleLogout}
            >
              <FaSignOutAlt /> Log out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
