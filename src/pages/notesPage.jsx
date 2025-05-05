import { useEffect, useState } from 'react';
import axios from 'axios';
import NoteCard from '../components/common/noteCard.jsx';
import TagFilter from '../components/common/tagFilter.jsx';
import { useAuth } from '../context/authContext.jsx';

export default function NotesPage() {
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [tagFilter, setTagFilter] = useState('');

  useEffect(() => {
    axios
      .get('/api/notes', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNotes(res.data));
  }, [token]);

  const filteredNotes = tagFilter ? notes.filter((note) => note.tags.includes(tagFilter)) : notes;

  return (
    <div className='container mt-4'>
      <h2>All Notes</h2>
      <TagFilter notes={notes} onFilter={setTagFilter} />
      <div className='row'>
        {filteredNotes.map((note) => (
          <NoteCard key={note._id} note={note} />
        ))}
      </div>
    </div>
  );
}
