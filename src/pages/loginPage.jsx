import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt, FaSpinner } from 'react-icons/fa';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import ThemeToggle from '../components/common/themeToggle.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosClient.post('/auth/login', form);
      console.log('Login response:', res);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.user.username);
      navigate('/notes');
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error('Invalid email or password.');
      } else {
        toast.error('Server connection error.');
      }
      console.error('Login error:', error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-linear-(--gradient-primary) flex items-center justify-center px-4'>
      <div className='absolute top-4 right-4'>
        <ThemeToggle />
      </div>
      <div className='max-w-md w-full '>
        <div className=' rounded-lg shadow-xl p-8 bg-card-bg '>
          <div className='mb-8 text-center'>
            <h2 className='flex items-center justify-center text-2xl font-bold text-primary '>
              <FaSignInAlt className='mr-2' />
              Log in
            </h2>
          </div>

          <form onSubmit={handleLogin} className='space-y-6'>
            <div>
              <div className='relative '>
                <span className='absolute left-3 top-1/2 transform -translate-y-1/2  text-primary '>
                  <FaEnvelope />
                </span>
                <input
                  type='email'
                  className='w-full pl-10 pr-4 py-2 border border-border-light rounded-lg  text-primary  bg-card-bg  '
                  placeholder='Email'
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 transform -translate-y-1/2  text-primary  '>
                  <FaLock />
                </span>
                <input
                  type='password'
                  className='w-full pl-10 pr-4 py-2 border border-border-light rounded-lg  text-primary  bg-card-bg  '
                  placeholder='Password'
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <p className='text-center text-text-body '>
                You don't have an account?{' '}
                <button
                  type='button'
                  onClick={() => navigate('/register')}
                  className='cursor-pointer text-link hover:text-link-hover disabled:text-text-body  disabled:cursor-not-allowed'
                  disabled={loading}
                >
                  Register.
                </button>
              </p>
            </div>
            <button
              type='submit'
              disabled={loading}
              className='cursor-pointer w-full bg-button-bg  text-button-text  py-2 px-4 rounded-lg hover:bg-button-hover   flex items-center justify-center gap-2 transition-colors disabled:bg-text-body  disabled:cursor-not-allowed'
            >
              {loading ? <FaSpinner className='animate-spin' /> : <FaSignInAlt />}
              {loading ? 'Loading...' : 'Log in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
