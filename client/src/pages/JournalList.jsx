import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const JournalList = () => {
  const { backendUrl } = useContext(AppContent);
  const [entries, setEntries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 5; // how many entries per page

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        axios.defaults.withCredentials = true;
        const { data } = await axios.get(
          `${backendUrl}/api/journal?page=${page}&limit=${limit}`
        );
        if (data.success) {
          setEntries(data.entries);
          setTotalPages(data.totalPages);
        }
      } catch (err) {
        toast.error('Could not load your entries.');
      }
    };
    fetchEntries();
  }, [backendUrl, page]);

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/journal/${id}`
      );
      if (data.success) {
        setEntries(entries.filter((e) => e._id !== id));
        toast.success('Entry deleted.');
      }
    } catch (err) {
      toast.error('Error deleting entry.');
    }
  };

  const handleEdit = (entry) => {
    setEditingId(entry._id);
    setEditedContent(entry.content);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedContent('');
  };

  const handleSave = async (id) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/journal/${id}`,
        { content: editedContent }
      );

      if (data.success) {
        setEntries((prev) =>
          prev.map((e) =>
            e._id === id ? { ...e, content: editedContent } : e
          )
        );
        toast.success('Entry updated.');
        setEditingId(null);
        setEditedContent('');
      }
    } catch (err) {
      toast.error('Error updating entry.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-8">
        <div className="w-full max-w-3xl">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            My Journal Entries
          </h1>

          {entries.length === 0 ? (
            <p className="text-center text-gray-600">
              No entries yet. Start journaling!
            </p>
          ) : (
            <> 
              {entries.map((e) => (
                <div
                  key={e._id}
                  className="mb-4 p-4 bg-white rounded shadow break-words"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">
                      {new Date(
                        e.createdAt
                      ).toLocaleDateString()}
                    </span>
                    <span className="text-sm capitalize">
                      {e.mood}
                    </span>
                  </div>

                  {editingId === e._id ? (
                    <textarea
                      value={editedContent}
                      onChange={(ev) => setEditedContent(ev.target.value)}
                      className="w-full p-2 border rounded mb-2 break-words"
                      rows={4}
                    />
                  ) : (
                    <p className="text-gray-800 whitespace-pre-line break-words">
                      {e.content}
                    </p>
                  )}

                  <div className="flex gap-2 mt-2">
                    {editingId === e._id ? (
                      <>
                        <button
                          onClick={() => handleSave(e._id)}
                          className="cursor-pointer text-green-600 hover:text-green-800 font-semibold"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="cursor-pointer text-gray-500 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(e)}
                          className="cursor-pointer text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(e._id)}
                          className="cursor-pointer text-red-600 hover:text-red-800 font-semibold"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {/* Pagination Controls */}
              <div className="flex justify-center mt-6 gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="cursor-pointer px-4 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="self-center">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="cursor-pointer px-4 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
};

export default JournalList;
