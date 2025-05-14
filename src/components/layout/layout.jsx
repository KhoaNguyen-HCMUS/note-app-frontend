import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from './header.jsx';
import Footer from './footer.jsx';

export default function Layout({ children }) {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <div className='flex flex-col min-h-screen'>
      {!isAuthPage && <Header />}
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
