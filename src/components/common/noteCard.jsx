import { useState } from 'react';
import axiosClient from '../../api/axiosClient';

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
    <div className='col-md-4 mb-4'>
      <div className='card h-100 shadow-sm'>
        <div className='card-body d-flex flex-column'>
          <h5 className='card-title'>{note.title}</h5>
          <p className='card-text flex-grow-1'>{note.content}</p>

          <div className='mb-2'>
            {note.tags.map((tag) => (
              <span key={tag} className='badge bg-secondary me-1'>
                {tag}
              </span>
            ))}
          </div>

          <div className='d-flex justify-content-between'>
            <button className='btn btn-sm btn-outline-primary' onClick={() => onEdit(note)} disabled={isDeleting}>
              Edit
            </button>
            <button className='btn btn-sm btn-outline-danger' onClick={handleDelete} disabled={isDeleting}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
