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
      localStorage.setItem('token', res.data.token);
      navigate('/notes');
    } catch (error) {
      setError('Đăng nhập thất bại');
      console.error('Login error:', error.response?.data?.message);
    }
  };

  return (
    <div className='container-fluid bg-light min-vh-100 d-flex align-items-center'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-md-6 col-lg-4'>
            <div className='card shadow-lg border-0'>
              <div className='card-body p-5'>
                <h2 className='text-center mb-4 text-primary'>
                  <FaSignInAlt className='me-2' />
                  Đăng nhập
                </h2>

                {error && (
                  <div className='alert alert-danger d-flex align-items-center' role='alert'>
                    <FaLock className='me-2' /> {error}
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  <div className='mb-3'>
                    <div className='input-group'>
                      <span className='input-group-text bg-light'>
                        <FaEnvelope className='text-primary' />
                      </span>
                      <input
                        type='email'
                        className='form-control bg-light'
                        placeholder='Email'
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className='mb-4'>
                    <div className='input-group'>
                      <span className='input-group-text bg-light'>
                        <FaLock className='text-primary' />
                      </span>
                      <input
                        type='password'
                        className='form-control bg-light'
                        placeholder='Mật khẩu'
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type='submit'
                    className='btn btn-primary w-100 py-2 mb-3 d-flex align-items-center justify-content-center gap-2'
                  >
                    Đăng nhập
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
