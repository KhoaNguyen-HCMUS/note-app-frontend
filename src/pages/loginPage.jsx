import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      console.error('Login error:', error.response.data.message);
    }
  };

  return (
    <div className='container mt-5'>
      <h2>Đăng nhập</h2>
      {error && <div className='alert alert-danger'>{error}</div>}
      <form onSubmit={handleLogin}>
        <input
          className='form-control mb-2'
          placeholder='Email'
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className='form-control mb-2'
          placeholder='Password'
          type='password'
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className='btn btn-primary'>Đăng nhập</button>
      </form>
    </div>
  );
}
