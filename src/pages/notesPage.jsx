import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';

import NoteCard from '../components/common/noteCard.jsx';
import TagFilter from '../components/common/tagFilter.jsx';
import axiosClient from '../api/axiosClient';
import EmptyNotes from '../components/common/emptyNotes';
import AddNoteModal from '../components/common/addNoteModal';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [tagFilter, setTagFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const filteredNotes = tagFilter ? (notes || []).filter((note) => note.tags.includes(tagFilter)) : notes || [];

  if (loading) return <div className='container mt-4'>Loading...</div>;
  if (error) return <div className='container mt-4 text-danger'>{error}</div>;

  const allTags = notes.reduce((tags, note) => {
    return tags.concat(note.tags || []);
  }, []);
  return (
    <div className='container mt-4'>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h2>All Notes</h2>
        <button className='btn btn-primary d-flex align-items-center gap-2' onClick={() => setShowModal(true)}>
          <FaPlus /> Add Note
        </button>
      </div>
      <AddNoteModal show={showModal} onClose={() => setShowModal(false)} onSubmit={handleAddNote} />
      <TagFilter tags={allTags} selectedTag={tagFilter} onSelectTag={setTagFilter} />{' '}
      <div className='row'>
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => <NoteCard key={note._id} note={note} onUpdate={fetchNotes} />)
        ) : (
          <EmptyNotes />
        )}
      </div>
    </div>
  );
}
