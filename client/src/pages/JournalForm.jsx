import React, { useContext, useState } from 'react';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const moods = ['happy', 'sad', 'anxious', 'neutral', 'angry', 'excited', 'tired'];

const JournalForm = () => {
  const { backendUrl } = useContext(AppContent);
  const [mood, setMood] = useState('neutral');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/journal/new`, {
        mood,
        content,
      });

      if (data.success) {
        toast.success("Journal saved succesfully!")
        navigate('/'); // or to a page that lists journal entries
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        How are you feeling today?
      </h2>

      {error && (
        <p className="text-red-500 mb-4 text-sm">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Mood:</label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
          >
            {moods.map((m) => (
              <option key={m} value={m}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Journal:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full border px-3 py-2 rounded-md resize-none"
            placeholder="Write about your day, your feelings, anything on your mind..."
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          Save Entry
        </button>

        <button
          onClick={() => navigate('/')}
          className="bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default JournalForm;
