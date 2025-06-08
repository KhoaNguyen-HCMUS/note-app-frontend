import { useEffect, useState } from 'react';
import { FaPlus, FaSearch, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';

import NoteCard from '../components/common/notes/noteCard.jsx';
import TagFilter from '../components/common/notes/tagFilter.jsx';
import axiosClient from '../api/axiosClient';
import EmptyNotes from '../components/common/notes/emptyNotes.jsx';
import AddNoteModal from '../components/common/notes/addNoteModal.jsx';
import EditNoteModal from '../components/common/notes/editNoteModal.jsx';
import LoadingSpinner from '../components/common/loadingSpinner.jsx';

export default function NotesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [searching, setSearching] = useState(false);

  const debouncedKeyword = useDebounce(keyword, 500);
  const [notes, setNotes] = useState([]);
  const [tagFilter, setTagFilter] = useState('');
  const [initialLoading, setInitialLoading] = useState(true); // khi vào trang
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [selectedNote, setSelectedNote] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchNotes = async () => {
    if (initialLoading || tagFilter) setInitialLoading(true);
    else setSearching(true);
    try {
      // Build query string
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (tagFilter) params.append('tag', tagFilter);

      const res = await axiosClient.get(`/notes?${params.toString()}`);
      const notesData = res.data?.data || res.data;
      if (Array.isArray(notesData)) {
        setNotes(notesData);
      } else {
        setNotes([]);
        setError(t('notes.errors.invalidFormat'));
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError(t('notes.errors.fetchError'));
      setNotes([]);
    } finally {
      setInitialLoading(false);
      setSearching(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedKeyword) {
      params.set('keyword', debouncedKeyword);
    } else {
      params.delete('keyword');
    }
    if (tagFilter) {
      params.set('tag', tagFilter);
    } else {
      params.delete('tag');
    }
    setSearchParams(params);
  }, [debouncedKeyword, tagFilter]);

  useEffect(() => {
    fetchNotes();
  }, [debouncedKeyword, tagFilter]);

  const handleAddNote = async (noteData) => {
    try {
      const response = await axiosClient.post('/notes', noteData);
      setNotes([...notes, response.data]);
      setShowModal(false);
      await fetchNotes();
    } catch (err) {
      console.error('Error adding note:', err);
      toast.error(t('notes.errors.addError'));
    }
  };

  const handleEditClick = (note) => {
    setSelectedNote(note);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (updatedNote) => {
    try {
      await axiosClient.put(`/notes/${selectedNote._id}`, updatedNote);
      await fetchNotes(); // Refresh notes list
      setShowEditModal(false);
      setSelectedNote(null);
    } catch (err) {
      toast.error(t('notes.errors.updateError'));
      console.error('Error updating note:', err);
    }
  };

  const filteredNotes = tagFilter ? (notes || []).filter((note) => note.tags.includes(tagFilter)) : notes || [];

  if (initialLoading) return <LoadingSpinner />;
  if (error) return <div className='container mt-4 text-danger'>{error}</div>;

  const allTags = notes.reduce((tags, note) => {
    return tags.concat(note.tags || []);
  }, []);
  return (
    <div className='w-full min-h-screen bg-linear-(--gradient-primary) '>
      <div className='container mx-auto px-4 py-8 '>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4'>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => navigate('/dashboard')}
              className='cursor-pointer flex items-center gap-2 px-3 py-2 text-text-body hover:text-primary transition-colors'
              title={t('nav.dashboard')}
            >
              <FaArrowLeft className='text-sm' />
              <span className='hidden sm:inline'>{t('nav.dashboard')}</span>
            </button>
          </div>

          <h2 className='text-2xl font-bold text-primary'>{t('notes.title')}</h2>
          <button
            className='cursor-pointer flex items-center gap-2 px-4 py-2 bg-button-bg text-button-text rounded-lg hover:bg-button-hover transition-colors'
            onClick={() => setShowModal(true)}
          >
            <FaPlus className='text-sm' /> {t('notes.addButton')}
          </button>
        </div>

        <AddNoteModal show={showModal} onClose={() => setShowModal(false)} onSubmit={handleAddNote} />

        <EditNoteModal
          show={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedNote(null);
          }}
          note={selectedNote}
          onSubmit={handleEditSubmit}
        />

        <div className='mb-6'>
          <div className='relative'>
            <input
              type='text'
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={t('notes.searchPlaceholder')}
              className='w-full px-4 py-2 pl-10 border border-border-light rounded-lg text-primary bg-card-bg'
            />
            {searching ? (
              <div className='absolute left-3 top-1/2 transform -translate-y-1/2 '>
                <FaSpinner className='text-text-body animate-spin' />
              </div>
            ) : (
              <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-text-body' />
            )}
          </div>
        </div>

        <div className='mb-6'>
          <TagFilter tags={allTags} selectedTag={tagFilter} onSelectTag={setTagFilter} />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <NoteCard key={note._id} note={note} onUpdate={fetchNotes} onEdit={() => handleEditClick(note)} />
            ))
          ) : (
            <EmptyNotes />
          )}
        </div>
      </div>
    </div>
  );
}
