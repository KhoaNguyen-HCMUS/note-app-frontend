import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt, FaSpinner } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import ThemeToggle from '../components/common/themeToggle.jsx';
import { GoogleLogin } from '@react-oauth/google';
import { useTheme } from '../context/themeContext';
import LanguageSwitcher from '../components/common/languageSwitcher.jsx';

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

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
        toast.error(t('login.errors.invalidCredentials'));
      } else {
        toast.error(t('login.errors.serverError'));
      }
      console.error('Login error:', error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axiosClient.post('/auth/google', {
        credential: credentialResponse.credential,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.user.username);
      console.log('Google login response:', res);
      navigate('/notes');
    } catch (error) {
      toast.error('Google login failed');
      console.error('Google login error:', error);
    }
  };

  const handleGoogleError = () => {
    toast.error(t('login.errors.googleError'));
  };

  return (
    <div className='min-h-screen bg-linear-(--gradient-primary) flex items-center justify-center px-4'>
      <div className='absolute top-4 right-4  mb-4 flex items-center gap-4'>
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      <div className='max-w-md w-full '>
        <div className=' rounded-lg shadow-xl p-8 bg-card-bg '>
          <div className='mb-8 text-center'>
            <h2 className='flex items-center justify-center text-2xl font-bold text-primary '>
              <FaSignInAlt className='mr-2' />
              {t('login.title')}
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
                  placeholder={t('login.password')}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <p className='text-center text-text-body '>
                {t('login.noAccount')}{' '}
                <button
                  type='button'
                  onClick={() => navigate('/register')}
                  className='cursor-pointer text-link hover:text-link-hover disabled:text-text-body  disabled:cursor-not-allowed'
                  disabled={loading}
                >
                  {t('login.register')}
                </button>
              </p>
            </div>

            <div className='flex flex-col items-center justify-center w-full'>
              <span className='text-text-header text-sm tracking-wider mb-3'>{t('login.continueWith')}</span>

              <div className='flex justify-center w-full'>
                <div className='w-full max-w-xs transform transition-transform hover:scale-105'>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap
                    shape='pill'
                    theme={theme === 'dark' ? 'filled_black' : 'filled_white'}
                    size='large'
                    locale={i18n.language}
                    text={t('login.continueWith')}
                    containerProps={{
                      className: `
                w-full 
                rounded-full 
                overflow-hidden 
                shadow-md hover:shadow-lg 
                transition-shadow duration-300 
                border-none outline-none focus:ring-0 focus:outline-none
                            flex justify-center

              `,
                      style: {
                        border: 'none',
                        outline: 'none',
                        boxShadow: 'none',
                        margin: '0 auto', 
                        display: 'flex', 
                        justifyContent: 'center',
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='cursor-pointer w-full bg-button-bg  text-button-text  py-2 px-4 rounded-lg hover:bg-button-hover   flex items-center justify-center gap-2 transition-colors disabled:bg-text-body  disabled:cursor-not-allowed'
            >
              {loading ? <FaSpinner className='animate-spin' /> : <FaSignInAlt />}
              {loading ? t('login.loading') : t('login.loginButton')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
