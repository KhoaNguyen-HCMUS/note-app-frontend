import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import { ThemeProvider } from './context/themeContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { toast, ToastContainer } from 'react-toastify';

import LoginPage from './pages/loginPage';
import RegisterPage from './pages/registerPage';
import NotesPage from './pages/notesPage';
import TasksPage from './pages/tasksPage';
import Layout from './components/layout/layout';
import PrivateRoute from './components/privateRoute';

import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_GG_CLIENT_ID}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path='/login' element={<LoginPage />} />
                <Route path='/register' element={<RegisterPage />} />
                <Route
                  path='/notes'
                  element={
                    <PrivateRoute>
                      <NotesPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path='/tasks'
                  element={
                    <PrivateRoute>
                      <TasksPage />
                    </PrivateRoute>
                  }
                />
                <Route path='/' element={<Navigate to='/login' replace />} />
              </Routes>
              <ToastContainer
                position='top-right'
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='light'
                transition={toast.Bounce}
              />
              <ToastContainer />
            </Layout>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
