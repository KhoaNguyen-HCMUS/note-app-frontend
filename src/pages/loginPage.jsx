import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import axiosClient from '../api/axiosClient';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosClient.post('/auth/login', form);
      console.log('Login response:', res);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.user.username);
      navigate('/notes');
    } catch (error) {
      setError('Đăng nhập thất bại');
      console.error('Login error:', error.response?.data?.message);
    }
  };

  return (
    <div className='min-h-screen bg-linear-(--gradient-primary) flex items-center justify-center px-4'>
      <div className='max-w-md w-full'>
        <div className='bg-white rounded-lg shadow-xl p-8'>
          <div className='mb-8 text-center'>
            <h2 className='flex items-center justify-center text-2xl font-bold text-primary'>
              <FaSignInAlt className='mr-2' />
              Log in
            </h2>
          </div>

          {error && (
            <div className='mb-4 flex items-center bg-red-100 text-red-700 p-4 rounded-lg'>
              <FaLock className='mr-2' /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className='space-y-6'>
            <div>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600'>
                  <FaEnvelope />
                </span>
                <input
                  type='email'
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  placeholder='Email'
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600'>
                  <FaLock />
                </span>
                <input
                  type='password'
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  placeholder='Password'
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <p className='text-center text-gray-600'>
                You don't have an account?{' '}
                <button
                  type='button'
                  onClick={() => navigate('/register')}
                  className='cursor-pointer text-blue-600 hover:text-blue-700'
                >
                  Register.
                </button>
              </p>
            </div>
            <button
              type='submit'
              className='cursor-pointer w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 transition-colors'
            >
              <FaSignInAlt />
              Log in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
