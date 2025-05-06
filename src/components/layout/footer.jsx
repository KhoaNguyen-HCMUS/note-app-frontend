import { FaHeart } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className='bg-light py-4 mt-auto border-top'>
      <div className='container'>
        <div className='row align-items-center'>
          <div className='col-md-6 text-center text-md-start'>
            <p className='mb-0'>&copy; {new Date().getFullYear()} Note App. All rights reserved.</p>
          </div>
          <div className='col-md-6 text-center text-md-end'>
            <p className='mb-0 d-flex align-items-center justify-content-center justify-content-md-end gap-2'>
              Made <FaHeart className='text-danger' /> by Khoa Nguyen
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
