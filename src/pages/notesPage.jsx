import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';

import NoteCard from '../components/common/noteCard.jsx';
import TagFilter from '../components/common/tagFilter.jsx';
import axiosClient from '../api/axiosClient';
import EmptyNotes from '../components/common/emptyNotes';
import AddNoteModal from '../components/common/addNoteModal';
import EditNoteModal from '../components/common/editNoteModal';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [tagFilter, setTagFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [selectedNote, setSelectedNote] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/notes');
      const notesData = res.data?.data || res.data;
      if (Array.isArray(notesData)) {
        setNotes(notesData);
      } else {
        setNotes([]);
        setError('Invalid data format received');
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to load notes');
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAddNote = async (noteData) => {
    try {
      const response = await axiosClient.post('/notes', noteData);
      setNotes([...notes, response.data]);
      setShowModal(false);
      await fetchNotes();
    } catch (err) {
      console.error('Error adding note:', err);
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
      console.error('Error updating note:', err);
    }
  };

  const filteredNotes = tagFilter ? (notes || []).filter((note) => note.tags.includes(tagFilter)) : notes || [];

  if (loading) return <div className='container mt-4'>Loading...</div>;
  if (error) return <div className='container mt-4 text-danger'>{error}</div>;

  const allTags = notes.reduce((tags, note) => {
    return tags.concat(note.tags || []);
  }, []);
  return (
    <div className='w-full min-h-screen bg-linear-(--gradient-primary) '>
      <div className='container mx-auto px-4 py-8 '>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-primary '>All Notes</h2>
          <button
            className='cursor-pointer flex items-center gap-2 px-4 py-2 bg-button-bg  text-button-text  rounded-lg hover:bg-button-hover transition-colors'
            onClick={() => setShowModal(true)}
          >
            <FaPlus className='text-sm' /> Add Note
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
