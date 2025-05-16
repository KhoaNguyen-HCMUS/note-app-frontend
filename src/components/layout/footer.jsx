import { FaHeart } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className='bg-white border-t py-4 mt-auto'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col md:flex-row items-center justify-between'>
          <div className='text-center md:text-left mb-4 md:mb-0'>
            <p className='text-text-body'>&copy; {new Date().getFullYear()} Note App. All rights reserved.</p>
          </div>
          <div className='text-center md:text-right'>
            <p className='flex items-center justify-center md:justify-end gap-2 text-gray-600'>
              Made with <FaHeart className='text-red-500' /> by Khoa Nguyen
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
