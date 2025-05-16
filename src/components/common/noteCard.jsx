import { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function NoteCard({ note, onUpdate, onEdit }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xoá ghi chú này?');
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await axiosClient.delete(`/notes/${note._id}`);
      await onUpdate(); // Wait for the update to complete
    } catch (err) {
      console.error('Lỗi xoá ghi chú:', err);
      alert('Không thể xoá ghi chú. Vui lòng thử lại.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='w-full bg-card-bg dark:bg-card-bg-dark rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'>
      <div className='p-6 flex flex-col h-full'>
        <h5 className='text-xl font-semibold text-primary dark:text-primary-dark mb-3'>{note.title}</h5>
        <div className='text-text-body dark:text-text-body-dark flex-grow mb-4 whitespace-pre-wrap break-words'>
          {note.content}
        </div>
        <div className='space-x-2 mb-4'>
          {note.tags.map((tag) => (
            <span
              key={tag}
              className='inline-block px-2 py-1 text-sm text-text-body bg-gray-300 dark:bg-gray-700 dark:text-text-body-dark rounded-full'
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className='flex justify-between items-center pt-4 '>
          <button
            className='cursor-pointer flex items-center px-3 py-1.5 text-button-bg dark:text-button-bg-dark border border-button-bg dark:border-button-bg-dark rounded hover:bg-button-hover-light dark:hover:bg-button-hover-dark/30 transition-colors disabled:opacity-50'
            onClick={() => onEdit(note)}
            disabled={isDeleting}
          >
            <FaEdit className='mr-1' />
            Edit
          </button>
          <button
            className='cursor-pointer flex items-center px-3 py-1.5 text-button-red-bg dark:text-button-red-bg-dark border border-button-red-bg dark:border-button-red-bg-dark rounded hover:bg-button-red-hover-light dark:hover:bg-button-red-hover-dark/30 transition-colors disabled:opacity-50'
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <FaTrash className='mr-1' />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
