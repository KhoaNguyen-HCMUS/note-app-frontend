import { FaRegStickyNote } from 'react-icons/fa';

export default function EmptyNotes() {
  return (
    <div className='flex flex-col items-center justify-center py-12 text-primary dark:text-primary-dark'>
      <FaRegStickyNote className='w-16 h-16 mb-4' />
      <h5 className='text-xl font-semibold mb-2'>No notes found</h5>
      <p className='text-text-body dark:text-text-body-dark'>Get started by creating your first note!</p>
    </div>
  );
}
