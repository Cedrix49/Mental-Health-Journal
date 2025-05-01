import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedIn } = useContext(AppContent);
  const [menuOpen, setMenuOpen] = useState(false);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp');
      if (data.success) {
        navigate('/email-verify');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/logout');
      if (data.success) {
        setIsLoggedIn(false);
        setUserData(false);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  return (
    <div className="w-full fixed top-0 left-0 z-50 px-4 sm:px-10 lg:px-24 py-4 bg-white shadow flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Mental Health Journal</h1>
      </div>

      {/* User avatar or login (Mobile and Desktop) */}
      {userData ? (
        <div className="relative flex items-center">
          <div
            className="w-9 h-9 flex justify-center items-center bg-black text-white rounded-full cursor-pointer"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {userData.name[0].toUpperCase()}
          </div>

          {menuOpen && (
            <ul className="absolute right-0 top-full mt-2 bg-white shadow rounded text-sm z-50 w-40">
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate('/journal')}
              >
                My Journal
              </li>
              {!userData.isAccountVerified && (
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    sendVerificationOtp();
                    setMenuOpen(false);
                  }}
                >
                  Verify Email
                </li>
              )}
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
              >
                Logout
              </li>
            </ul>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="hidden md:flex cursor-pointer items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
        >
          Login <img src={assets.arrow_icon} alt="arrow" className="w-4" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
