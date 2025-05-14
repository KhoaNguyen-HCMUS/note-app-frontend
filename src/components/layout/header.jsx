import { FaStickyNote, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('username') || 'User';
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <header className='bg-white shadow-sm'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center py-3'>
          <div className='flex items-center'>
            <FaStickyNote className='text-blue-600 mr-2' size={24} />
            <h1 className='text-xl font-semibold'>Note App</h1>
          </div>

          <div className='flex items-center space-x-4'>
            <div className='flex items-center gap-2'>
              <FaUser className='text-gray-600' size={20} />
              <span className='text-gray-600'>{userName}</span>
            </div>
            <button
              className='cursor-pointer flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 rounded-lg transition-colors'
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
