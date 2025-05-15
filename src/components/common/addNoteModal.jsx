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
      <div className='text-black fixed inset-0 z-50 flex items-center justify-center p-4'>
        <div className='fixed inset-0 bg-gray-700/50' onClick={onClose}></div>

        <div className='relative w-full max-w-lg bg-white rounded-lg shadow-xl'>
          {/* Header */}
          <div className='flex items-center justify-between px-6 py-4 bg-blue-600 rounded-t-lg'>
            <h5 className='flex items-center text-xl font-semibold text-white'>
              <FaHeading className='mr-2' /> Add new note
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='Enter title...'
                  required
                />
              </div>

              {/* Content Textarea */}
              <div>
                <label className='flex items-center text-gray-700 mb-2'>
                  <FaAlignLeft className='mr-2 text-blue-600' />
                  <span>Description</span>
                </label>
                <textarea
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  rows='5'
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder='Enter description...'
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
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder='Enter Tags (Separation by commas)...'
                />
                <small className='text-gray-500 mt-1 block'>Example: personal, important</small>
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

AddNoteModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
