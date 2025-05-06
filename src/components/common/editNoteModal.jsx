import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaSave, FaHeading, FaAlignLeft, FaHashtag } from 'react-icons/fa';

export default function EditNoteModal({ show, onClose, note, onSubmit }) {
  const [form, setForm] = useState({
    title: '',
    content: '',
    tags: '',
  });

  useEffect(() => {
    if (note) {
      setForm({
        title: note.title,
        content: note.content,
        tags: note.tags.join(', '),
      });
    }
  }, [note]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit({
        ...form,
        tags: form.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      });
      onClose();
    } catch (err) {
      console.error('Error updating note:', err);
    }
  };

  if (!show) return null;

  return (
    <>
      <div className='modal fade show' style={{ display: 'block' }} tabIndex='-1' role='dialog'>
        <div className='modal-dialog modal-lg modal-dialog-centered'>
          <div className='modal-content border-0 shadow'>
            <div className='modal-header bg-primary text-white'>
              <h5 className='modal-title d-flex align-items-center'>
                <FaHeading className='me-2' /> Chỉnh sửa ghi chú
              </h5>
              <button type='button' className='btn-close btn-close-white' onClick={onClose}></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className='modal-body bg-light p-4'>
                <div className='mb-4'>
                  <label className='form-label d-flex align-items-center'>
                    <FaHeading className='me-2 text-primary' />
                    <span>Tiêu đề</span>
                  </label>
                  <input
                    type='text'
                    className='form-control form-control-lg shadow-sm'
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                <div className='mb-4'>
                  <label className='form-label d-flex align-items-center'>
                    <FaAlignLeft className='me-2 text-primary' />
                    <span>Nội dung</span>
                  </label>
                  <textarea
                    className='form-control shadow-sm'
                    rows='6'
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    required
                  ></textarea>
                </div>

                <div className='mb-3'>
                  <label className='form-label d-flex align-items-center'>
                    <FaHashtag className='me-2 text-primary' />
                    <span>Tags</span>
                  </label>
                  <input
                    type='text'
                    className='form-control shadow-sm'
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder='Nhập tags, phân cách bằng dấu phẩy'
                  />
                  <small className='text-muted mt-1 d-block'>Ví dụ: công việc, cá nhân, quan trọng</small>
                </div>
              </div>

              <div className='modal-footer bg-light'>
                <button type='button' className='btn btn-outline-secondary' onClick={onClose}>
                  Hủy
                </button>
                <button type='submit' className='btn btn-primary d-flex align-items-center gap-2'>
                  <FaSave /> Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className='modal-backdrop fade show'></div>
    </>
  );
}

EditNoteModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  note: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
  onSubmit: PropTypes.func.isRequired,
};
