import React from 'react';
import { FaStickyNote } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const RecentNotes = ({ recentNotes }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className='bg-card-bg border border-border-light rounded-xl p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-xl font-semibold text-primary flex items-center'>
          <FaStickyNote className='mr-2 text-blue-600' />
          {t('dashboard.recentNotes')}
        </h2>
        <button
          onClick={() => navigate('/notes')}
          className='cursor-pointer text-button-bg hover:text-button-hover text-sm font-medium transition-colors'
        >
          {t('dashboard.viewAll')}
        </button>
      </div>
      <div className='space-y-3'>
        {recentNotes.length > 0 ? (
          recentNotes.map((note) => (
            <div
              key={note._id}
              className='p-3 bg-card-bg border border-border-light rounded-lg hover:shadow-md transition-all cursor-pointer'
            >
              <h3 className='font-medium text-primary truncate'>{note.title}</h3>
              <p className='text-sm text-text-body mt-1 line-clamp-2'>{note.content}</p>
              <div className='flex items-center justify-between mt-2'>
                <div className='flex flex-wrap gap-1'>
                  {note.tags?.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className='px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 text-xs rounded'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className='text-xs text-text-body'>{new Date(note.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        ) : (
          <p className='text-text-body text-center py-8'>{t('dashboard.noRecentNotes')}</p>
        )}
      </div>
    </div>
  );
};

export default RecentNotes;
