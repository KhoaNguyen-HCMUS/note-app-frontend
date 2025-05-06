import Header from './header.jsx';
import Footer from './footer.jsx';

export default function Layout({ children }) {
  return (
    <div className='d-flex flex-column min-vh-100'>
      <Header />
      <main className='flex-grow-1'>{children}</main>
      <Footer />
    </div>
  );
}
