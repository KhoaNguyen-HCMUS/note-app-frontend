import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaSpinner } from 'react-icons/fa';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import ThemeToggle from '../components/common/themeToggle.jsx';
import LanguageSwitcher from '../components/common/languageSwitcher.jsx';

export default function RegisterPage() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      // eslint-disable-next-line no-unused-vars
      const res = await axiosClient.post('/auth/register', {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(t('register.errors.emailExists'));
      } else if (error.response?.status === 500) {
        toast.error(t('register.errors.serverError'));
      } else {
        toast.error(t('register.errors.unexpected'));
      }
      console.error('Register error:', error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-linear-(--gradient-primary)  flex items-center justify-center px-4'>
      <div className='absolute top-4 right-4'>
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      <div className='max-w-md w-full'>
        <div className='bg-card-bg rounded-lg shadow-xl p-8'>
          <div className='mb-8 text-center'>
            <h2 className='flex items-center justify-center text-2xl font-bold text-primary '>
              <FaUserPlus className='mr-2' />
              {t('register.title')}
            </h2>
          </div>

          <form onSubmit={handleRegister} className='space-y-6'>
            <div>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 transform -translate-y-1/2  text-primary '>
                  <FaUser />
                </span>
                <input
                  type='text'
                  className='w-full pl-10 pr-4 py-2 border border-border-light rounded-lg  text-primary  bg-card-bg '
                  placeholder={t('register.username')}
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 transform -translate-y-1/2  text-primary  '>
                  <FaEnvelope />
                </span>
                <input
                  type='email'
                  className='w-full pl-10 pr-4 py-2 border border-border-light rounded-lg  text-primary  bg-card-bg '
                  placeholder='Email'
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 transform -translate-y-1/2  text-primary '>
                  <FaLock />
                </span>
                <input
                  type='password'
                  className='w-full pl-10 pr-4 py-2 border border-border-light rounded-lg  text-primary  bg-card-bg  '
                  placeholder={t('register.password')}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 transform -translate-y-1/2  text-primary dark:text-primary-dark '>
                  <FaLock />
                </span>
                <input
                  type='password'
                  className='w-full pl-10 pr-4 py-2 border border-border-light rounded-lg  text-primary dark:text-primary-dark bg-card-bg dark:bg-card-bg-dark '
                  placeholder={t('register.confirmPassword')}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='cursor-pointer w-full bg-button-bg dark:bg-button-bg-dark text-button-text dark:text-button-text-dark py-2 px-4 rounded-lg hover:bg-button-hover dark:hover:bg-button-hover-dark  flex items-center justify-center gap-2 transition-colors disabled:bg-text-body dark:disabled:text-text-body-dark disabled:cursor-not-allowed'
            >
              {loading ? <FaSpinner className='animate-spin' /> : <FaUserPlus />}
              {loading ? t('register.registering') : t('register.registerButton')}
            </button>

            <p className='text-center text-text-body dark:text-text-body-dark'>
              {t('register.alreadyHaveAccount')}{' '}
              <button
                type='button'
                onClick={() => navigate('/login')}
                className='cursor-pointer text-link hover:text-link-hover disabled:text-text-body dark:disabled:text-text-body-dark disabled:cursor-not-allowed'
                disabled={loading}
              >
                {t('register.loginHere')}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
