import { FaRegStickyNote } from 'react-icons/fa';

export default function EmptyNotes() {
  return (
    <div className='flex flex-col items-center justify-center py-12 text-text-header'>
      <FaRegStickyNote className='w-16 h-16 mb-4' />
      <h5 className='text-xl font-semibold mb-2'>No notes found</h5>
      <p className='text-text-body'>Get started by creating your first note!</p>
    </div>
  );
}
