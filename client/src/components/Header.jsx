import React, { useContext } from 'react';
import { assets } from '../assets/assets.js';
import { AppContent } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { userData, isLoggedIn } = useContext(AppContent);
  const navigate = useNavigate();

  // Time-based greeting
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    else if (hour < 18) return 'Good afternoon';
    else return 'Good evening';
  };

  // Random daily affirmation
  const affirmations = [
    "You are doing your best, and that is enough.",
    "It's okay to rest. You deserve peace.",
    "Today is a fresh start.",
    "You are not alone.",
    "Your feelings are valid.",
    "Progress, not perfection.",
  ];
  const randomAffirmation =
    affirmations[new Date().getDate() % affirmations.length];

  // Handler for protected navigation
  const handleNav = (path) => {
    if (isLoggedIn) navigate(path);
    else navigate('/login');
  };

  return (
    <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800">
      <h1 className="flex items-center gap-2 text-xl font-medium">
        {getTimeGreeting()}, {userData ? userData.name : 'Friend'}!
        <img
          src={assets.hand_wave}
          alt="hand_wave"
          className="w-7 aspect-square"
        />
      </h1>

      <h2 className="text-3xl sm:text-5xl font-semibold mb-4">
        Welcome to your Mental Health Journal
      </h2>

      {/* Daily affirmation */}
      <p className="italic text-sm text-gray-500 mb-2 max-w-md">
        “{randomAffirmation}”
      </p>

      {/* Show recent mood and last entry date only if user is logged in AND has a previous entry */}
      {userData?.lastEntryDate && (
        <>
          {userData.lastMood && (
            <p className="text-sm mt-1 text-gray-600">
              Recent mood: {userData.lastMood}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Last journal entry:{' '}
            {new Date(userData.lastEntryDate).toLocaleDateString()}
          </p>
        </>
      )}

      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          onClick={() => handleNav('/journal/new')}
          className={`cursor-pointer border rounded-full px-8 py-2.5 transition-all 
            ${isLoggedIn ? 'border-gray-800 hover:bg-gray-100 text-gray-800' : 'border-gray-400 text-gray-400 cursor-not-allowed'}`}
        >
          Write a New Entry
        </button>
        <button
          onClick={() => handleNav('/journal')}
          className={`cursor-pointer border rounded-full px-8 py-2.5 transition-all 
            ${isLoggedIn ? 'border-gray-400 text-gray-700 hover:bg-gray-100' : 'border-gray-200 text-gray-300 cursor-not-allowed'}`}
        >
          View Journal
        </button>
      </div>
    </div>
  );
};

export default Header;
