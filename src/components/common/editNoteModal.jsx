import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaSave, FaHeading, FaAlignLeft, FaHashtag, FaTimes } from 'react-icons/fa';

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
      <div className='text-primary fixed inset-0 z-50 flex items-center justify-center p-4'>
        <div className='fixed inset-0 bg-gray-700/50' onClick={onClose}></div>

        <div className='relative w-full max-w-2xl bg-card-bg rounded-lg shadow-xl'>
          {/* Header */}
          <div className='flex items-center justify-between px-6 py-4 bg-linear-(--gradient-text) rounded-t-lg'>
            <h5 className='flex items-center text-xl font-semibold text-white'>
              <FaHeading className='mr-2' /> Edit Note
            </h5>
            <button
              onClick={onClose}
              className='cursor-pointer text-white hover:text-gray-200 transition-colors'
              aria-label='Close'
            >
              <FaTimes className='text-xl' />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='bg-card-bg'>
            <div className='p-6 space-y-6'>
              {/* Title Input */}
              <div>
                <label className='flex items-center text-primary mb-2'>
                  <FaHeading className='mr-2 text-primary' />
                  <span>Title</span>
                </label>
                <input
                  type='text'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg'
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              {/* Content Textarea */}
              <div>
                <label className='flex items-center text-primary mb-2'>
                  <FaAlignLeft className='mr-2 text-primary' />
                  <span>Description</span>
                </label>
                <textarea
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg'
                  rows='6'
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  required
                ></textarea>
              </div>

              {/* Tags Input */}
              <div>
                <label className='flex items-center text-primary mb-2'>
                  <FaHashtag className='mr-2 text-primary' />
                  <span>Tags</span>
                </label>
                <input
                  type='text'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg '
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder='Enter tags, separate by commas'
                />
                <small className='text-primary mt-1 block'>For example: work, individual, important</small>
              </div>
            </div>

            {/* Footer */}
            <div className='flex items-center justify-end px-6 py-4 bg-gray-100 border-t rounded-b-lg space-x-4'>
              <button
                type='button'
                className='cursor-pointer flex items-center px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors'
                onClick={onClose}
              >
                <FaTimes className='mr-2' /> Cancel
              </button>
              <button
                type='submit'
                className='cursor-pointer flex items-center px-4 py-2 text-button-text bg-button-bg rounded-lg hover:bg-button-hover transition-colors'
              >
                <FaSave className='mr-2' /> Save
              </button>
            </div>
          </form>
        </div>
      </div>
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
