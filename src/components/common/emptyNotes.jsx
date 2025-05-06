import { FaRegStickyNote } from 'react-icons/fa';

export default function EmptyNotes() {
  return (
    <div className='text-center py-5'>
      <FaRegStickyNote className='text-muted mb-3' style={{ fontSize: '3rem' }} />
      <h5 className='text-muted'>No notes found</h5>
      <p className='text-muted'>Get started by creating your first note!</p>
    </div>
  );
}
