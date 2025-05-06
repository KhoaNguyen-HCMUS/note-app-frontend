import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/loginPage';
// import RegisterPage from './pages/RegisterPage';
import NotesPage from './pages/notesPage';
// import EditNotePage from './pages/EditNotePage';
import { AuthProvider } from './context/authContext';
import Layout from './components/layout/layout';
import PrivateRoute from './components/privateRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route
              path='/notes'
              element={
                <PrivateRoute>
                  <NotesPage />
                </PrivateRoute>
              }
            />
            <Route path='/' element={<Navigate to='/login' replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
