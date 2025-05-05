// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/loginPage';
// import RegisterPage from './pages/RegisterPage';
import NotesPage from './pages/notesPage';
// import EditNotePage from './pages/EditNotePage';
import { AuthProvider } from './context/authContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          {/* <Route path='/register' element={<RegisterPage />} /> */}
          <Route path='/notes' element={<NotesPage />} />
          {/* <Route path='/notes/edit/:id?' element={<EditNotePage />} /> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
