import { useState } from 'react';
import PropTypes from 'prop-types';

export default function AddNoteModal({ show, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    });
    setTitle('');
    setContent('');
    setTags('');
  };

  if (!show) return null;

  return (
    <div className='modal-backdrop'>
      <div className='modal-content'>
        <div className='modal-header'>
          <h5 className='modal-title'>Thêm ghi chú mới</h5>
          <button type='button' className='btn-close' onClick={onClose}></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='modal-body'>
            <div className='mb-3'>
              <label className='form-label'>Tiêu đề</label>
              <input
                type='text'
                className='form-control'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Nội dung</label>
              <textarea
                className='form-control'
                rows='3'
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></textarea>
            </div>
            <div className='mb-3'>
              <label className='form-label'>Tags (phân cách bằng dấu phẩy)</label>
              <input
                type='text'
                className='form-control'
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder='tag1, tag2, tag3'
              />
            </div>
          </div>
          <div className='modal-footer'>
            <button type='button' className='btn btn-secondary' onClick={onClose}>
              Hủy
            </button>
            <button type='submit' className='btn btn-primary'>
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

AddNoteModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
