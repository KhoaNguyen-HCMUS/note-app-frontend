import { useState } from 'react';
import { FaStickyNote, FaSignOutAlt, FaUser, FaBars, FaTimes, FaRobot } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../common/themeToggle.jsx';
import ChatbotModal from '../common/chatBotModal.jsx';

export default function Header() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('username') || 'User';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <header className='bg-card-bg shadow-sm'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center py-3'>
          {/* Logo and App Name */}
          <div className='flex items-center bg-linear-(--gradient-text) bg-clip-text text-transparent'>
            <FaStickyNote className='text-blue-600 mr-2' size={24} />
            <h1 className='text-xl font-semibold'>Lument Note App</h1>
          </div>

          {/* Mobile Menu Button */}
          <button className='md:hidden p-2 text-primary' onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
            bg-card-bg 
            md:bg-transparent 
            p-4 md:p-0 
            shadow-lg md:shadow-none
            z-50
          `}
          >
            <ThemeToggle />
            <button
              className='cursor-pointer flex items-center gap-2 px-4 py-2 bg-button-bg text-button-text rounded-lg hover:opacity-90 transition-colors'
              onClick={() => setShowChatbot(true)}
            >
              <FaRobot className='text-sm' /> AI Assistant
            </button>

            <ChatbotModal show={showChatbot} onClose={() => setShowChatbot(false)} />

            <div className='flex items-center gap-2 text-primary '>
              <FaUser size={20} />
              <span>{userName}</span>
            </div>

            <button
              className='cursor-pointer flex items-center gap-2 px-4 py-2 border border-button-red-bg  text-button-red-bg  hover:bg-button-red-hover-light  rounded-lg transition-colors w-full md:w-auto justify-center'
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
