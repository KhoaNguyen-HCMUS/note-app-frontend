// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/loginPage';
// import RegisterPage from './pages/RegisterPage';
import NotesPage from './pages/notesPage';
// import EditNotePage from './pages/EditNotePage';
import { AuthProvider } from './context/authContext';
import Layout from './components/layout/layout';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path='/' element={<LoginPage />} />
            {/* <Route path='/register' element={<RegisterPage />} /> */}
            <Route path='/notes' element={<NotesPage />} />
            {/* <Route path='/notes/edit/:id?' element={<EditNotePage />} /> */}
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
