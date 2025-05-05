import axiosClient from '../../api/axiosClient';
import { useNavigate } from 'react-router-dom';

export default function NoteCard({ note, onUpdate }) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xoá ghi chú này?');
    if (!confirmDelete) return;

    try {
      await axiosClient.delete(`/notes/${note._id}`);
      onUpdate();
    } catch (err) {
      console.error('Lỗi xoá ghi chú:', err);
      alert('Không thể xoá ghi chú. Vui lòng thử lại.');
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
            <button className='btn btn-sm btn-outline-primary' onClick={() => navigate(`/notes/edit/${note._id}`)}>
              Sửa
            </button>
            <button className='btn btn-sm btn-outline-danger' onClick={handleDelete}>
              Xoá
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
