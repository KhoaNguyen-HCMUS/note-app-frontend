import { FaStickyNote, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';

export default function Header() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('username') || 'User';
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <header className='bg-white dark:bg-gray-900 shadow-sm'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center py-3'>
          <div className='flex items-center bg-linear-(--gradient-text) bg-clip-text text-transparent'>
            <FaStickyNote className='text-blue-600 mr-2' size={24} />
            <h1 className='text-xl font-semibold'>Lument Note App</h1>
          </div>

          <div className='flex items-center space-x-4'>
            <ThemeToggle />

            <div className='flex items-center gap-2 text-primary dark:text-primary-dark'>
              <FaUser size={20} />
              <span>{userName}</span>
            </div>
            <button
              className='cursor-pointer flex items-center gap-2 px-4 py-2 border border-button-red-bg  dark:border-button-red-bg-dark text-button-red-bg dark:text-button-red-bg-dark hover:bg-button-red-hover-light dark:hover:bg-button-red-hover-dark/30 rounded-lg transition-colors'
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
