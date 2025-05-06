import { useLocation } from 'react-router-dom';
import Header from './header.jsx';
import Footer from './footer.jsx';

export default function Layout({ children }) {
  const location = useLocation();
  const isAuthPage = ['/', '/register'].includes(location.pathname);

  return (
    <div className='d-flex flex-column min-vh-100'>
      {!isAuthPage && <Header />}
      <main className='flex-grow-1'>{children}</main>
      <Footer />
    </div>
  );
}
