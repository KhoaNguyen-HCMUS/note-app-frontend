import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';
import { FaSave, FaTimes, FaHashtag, FaHeading, FaAlignLeft } from 'react-icons/fa';

export default function AddNoteModal({ show, onClose, onSubmit }) {
  const { t } = useTranslation();

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
      <div className='text-primary fixed inset-0 z-50 flex items-center justify-center p-4'>
        <div className='fixed inset-0 bg-gray-700/50' onClick={onClose}></div>

        <div className='relative w-full max-w-2xl bg-card-bg rounded-lg shadow-xl'>
          {/* Header */}
          <div className='flex items-center justify-between px-6 py-4 bg-linear-(--gradient-text) rounded-t-lg'>
            <h5 className='flex items-center text-xl font-semibold text-white'>
              <FaHeading className='mr-2' /> {t('addNoteModal.title')}
            </h5>
            <button
              onClick={onClose}
              className='cursor-pointer text-white hover:text-gray-200 transition-colors'
              aria-label={t('addNoteModal.buttons.close')}
            >
              <FaTimes className='text-xl' />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='bg-card-bg  rounded-b-lg'>
            <div className='p-6 space-y-6'>
              {/* Title Input */}
              <div className=' text-primary'>
                <label className='flex items-center  mb-2'>
                  <FaHeading className='mr-2 ' />
                  <span>{t('addNoteModal.form.title.label')}</span>
                </label>
                <input
                  type='text'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('addNoteModal.form.title.placeholder')}
                  required
                />
              </div>

              {/* Content Textarea */}
              <div className=' text-primary'>
                <label className='flex items-center  mb-2'>
                  <FaAlignLeft className='mr-2 ' />
                  <span>{t('addNoteModal.form.description.label')}</span>
                </label>
                <textarea
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg'
                  rows='5'
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t('addNoteModal.form.description.placeholder')}
                  required
                ></textarea>
              </div>

              {/* Tags Input */}
              <div className=' text-primary'>
                <label className='flex items-center  mb-2'>
                  <FaHashtag className='mr-2 ' />
                  <span>{t('addNoteModal.form.tags.label')}</span>
                </label>
                <input
                  type='text'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg '
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder={t('addNoteModal.form.tags.placeholder')}
                />
                <small className='text-primary mt-1 block'> {t('addNoteModal.form.tags.example')}</small>
              </div>
            </div>

            {/* Footer */}
            <div className='flex items-center justify-end px-6 py-4  border-t rounded-b-lg space-x-4'>
              <button
                type='button'
                className='cursor-pointer flex items-center px-4 py-2 text-primary bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-border-light transition-colors'
                onClick={onClose}
              >
                <FaTimes className='mr-2' /> {t('addNoteModal.buttons.cancel')}
              </button>
              <button
                type='submit'
                className='cursor-pointer flex items-center px-4 py-2 text-button-text bg-button-bg dark:bg-button-bg-dark rounded-lg hover:bg-button-hover transition-colors'
              >
                <FaSave className='mr-2' /> {t('addNoteModal.buttons.save')}
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
