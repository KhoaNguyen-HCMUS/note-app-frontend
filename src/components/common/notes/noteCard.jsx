import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';

import axiosClient from '../../../api/axiosClient';

export default function NoteCard({ note, onUpdate, onEdit }) {
  const { t } = useTranslation();

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
      toast.error(t('noteCard.deleteError'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='w-full bg-card-bg  rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'>
      <div className='p-6 flex flex-col h-full'>
        <h5 className='text-xl font-semibold text-primary  mb-3'>{note.title}</h5>
        <div className='text-text-body  flex-grow mb-4 whitespace-pre-wrap break-words'>{note.content}</div>
        <div className='space-x-2 mb-4'>
          {note.tags.map((tag) => (
            <span
              key={tag}
              className='inline-block px-2 py-1 text-sm text-text-body bg-gray-300 dark:bg-gray-700  rounded-full'
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className='flex justify-between items-center pt-4 '>
          <button
            className='cursor-pointer flex items-center px-3 py-1.5 text-button-bg border button-bg rounded hover:bg-button-hover-light transition-colors disabled:opacity-50'
            onClick={() => onEdit(note)}
            disabled={isDeleting}
          >
            <FaEdit className='mr-1' />
            {t('noteCard.edit')}
          </button>
          <button
            className='cursor-pointer flex items-center px-3 py-1.5 text-button-red-bg  border border-button-red-bg  rounded hover:bg-button-red-hover-light transition-colors disabled:opacity-50'
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <FaTrash className='mr-1' />
            {isDeleting ? t('noteCard.loading') : t('noteCard.delete')}
          </button>
        </div>
      </div>
    </div>
  );
}
