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
    <div className='w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'>
      <div className='p-6 flex flex-col h-full'>
        <h5 className='text-xl font-semibold text-gray-800 mb-3'>{note.title}</h5>
        <p className='text-gray-600 flex-grow mb-4'>{note.content}</p>

        <div className='space-x-2 mb-4'>
          {note.tags.map((tag) => (
            <span key={tag} className='inline-block px-2 py-1 text-sm text-gray-600 bg-gray-100 rounded-full'>
              #{tag}
            </span>
          ))}
        </div>

        <div className='flex justify-between items-center pt-4 border-t'>
          <button
            className='cursor-pointer flex items-center px-3 py-1.5 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors disabled:opacity-50'
            onClick={() => onEdit(note)}
            disabled={isDeleting}
          >
            <FaEdit className='mr-1' />
            Edit
          </button>
          <button
            className='cursor-pointer flex items-center px-3 py-1.5 text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors disabled:opacity-50'
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
