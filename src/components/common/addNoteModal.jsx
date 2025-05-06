import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaSave, FaTimes, FaHashtag, FaHeading, FaAlignLeft } from 'react-icons/fa';

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
    <>
      <div
        className={`modal ${show ? 'show' : ''}`}
        style={{ display: show ? 'block' : 'none' }}
        tabIndex='-1'
        role='dialog'
      >
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content border-0 shadow'>
            <div className='modal-header bg-primary text-white'>
              <h5 className='modal-title d-flex align-items-center'>
                <FaHeading className='me-2' /> Add new note
              </h5>
              <button type='button' className='btn-close btn-close-white' onClick={onClose} aria-label='Close'></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className='modal-body bg-light'>
                <div className='mb-4'>
                  <label className='form-label d-flex align-items-center'>
                    <FaHeading className='me-2 text-primary' />
                    <span>Title</span>
                  </label>
                  <input
                    type='text'
                    className='form-control form-control-lg shadow-sm'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='Enter title...'
                    required
                  />
                </div>

                <div className='mb-4'>
                  <label className='form-label d-flex align-items-center'>
                    <FaAlignLeft className='me-2 text-primary' />
                    <span>Description</span>
                  </label>
                  <textarea
                    className='form-control shadow-sm'
                    rows='5'
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder='Enter description...'
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
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder='Enter Tags (Separation by commas)...'
                  />
                  <small className='text-muted mt-1 d-block'>Example: personal, important</small>
                </div>
              </div>

              <div className='modal-footer border-top bg-light'>
                <button type='button' className='btn btn-lg btn-secondary d-flex align-items-center' onClick={onClose}>
                  <FaTimes className='me-2' /> Cancel
                </button>
                <button type='submit' className='btn btn-lg btn-primary d-flex align-items-center'>
                  <FaSave className='me-2' /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {show && <div className='modal-backdrop fade show'></div>}
    </>
  );
}

AddNoteModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
