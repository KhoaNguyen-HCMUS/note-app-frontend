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
      <div className='text-black fixed inset-0 z-50 flex items-center justify-center p-4'>
        <div className='fixed inset-0 bg-gray-700/50' onClick={onClose}></div>

        <div className='relative w-full max-w-2xl bg-white rounded-lg shadow-xl'>
          {/* Header */}
          <div className='flex items-center justify-between px-6 py-4 bg-blue-600 rounded-t-lg'>
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
          <form onSubmit={handleSubmit} className='bg-gray-50'>
            <div className='p-6 space-y-6'>
              {/* Title Input */}
              <div>
                <label className='flex items-center text-gray-700 mb-2'>
                  <FaHeading className='mr-2 text-blue-600' />
                  <span>Title</span>
                </label>
                <input
                  type='text'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              {/* Content Textarea */}
              <div>
                <label className='flex items-center text-gray-700 mb-2'>
                  <FaAlignLeft className='mr-2 text-blue-600' />
                  <span>Content</span>
                </label>
                <textarea
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  rows='6'
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  required
                ></textarea>
              </div>

              {/* Tags Input */}
              <div>
                <label className='flex items-center text-gray-700 mb-2'>
                  <FaHashtag className='mr-2 text-blue-600' />
                  <span>Tags</span>
                </label>
                <input
                  type='text'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder='Enter tags, separate by commas'
                />
                <small className='text-gray-500 mt-1 block'>For example: work, individual, important</small>
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
                className='cursor-pointer flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors'
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
