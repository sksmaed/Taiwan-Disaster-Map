
import React, { useContext, useState } from 'react';
import { GlobeIcon } from './icons/GlobeIcon';
import { AuthContext } from '../contexts/AuthContext';
import { LogoutIcon } from './icons/LogoutIcon';

interface HeaderProps {
  onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative bg-gray-800/50 backdrop-blur-sm shadow-lg p-4 z-[1010] flex items-center justify-between border-b border-gray-700">
      <div className="flex items-center space-x-3">
        <GlobeIcon className="h-8 w-8 text-cyan-400" />
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-wider">
          台灣災害地圖
          <span className="text-sm text-gray-400 ml-2 font-normal hidden md:inline">A Past to Remember</span>
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <p className="text-xs text-gray-500 hidden sm:block">以過去為鑑，守護我們的家園</p>
        {user ? (
          <div className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-700/50 transition">
              <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full ring-2 ring-offset-2 ring-offset-gray-800 ring-cyan-500" />
              <span className="text-white font-medium hidden md:inline">{user.name}</span>
            </button>
            {isMenuOpen && (
               <div
                  className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-50 border border-gray-600"
                  onMouseLeave={() => setIsMenuOpen(false)}
                >
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors flex items-center space-x-2"
                >
                  <LogoutIcon className="h-5 w-5"/>
                  <span>登出</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            登入 / 註冊
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
