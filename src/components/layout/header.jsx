import { FaStickyNote, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className='bg-white shadow-sm'>
      <div className='container'>
        <div className='d-flex justify-content-between align-items-center py-3'>
          <div className='d-flex align-items-center'>
            <FaStickyNote className='text-primary me-2' size={24} />
            <h1 className='h4 mb-0'>Note App</h1>
          </div>

          <div className='d-flex align-items-center gap-3'>
            <button className='btn btn-light d-flex align-items-center gap-2' onClick={() => navigate('/profile')}>
              <FaUser /> Profile
            </button>
            <button className='btn btn-outline-danger d-flex align-items-center gap-2' onClick={handleLogout}>
              <FaSignOutAlt /> Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
