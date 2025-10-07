
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { XIcon } from './icons/XIcon';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?u=default-user-avatar';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATAR);
  const [error, setError] = useState<string | null>(null);
  const { login, register } = useContext(AuthContext);

  const resetForm = () => {
    setName('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
    setSelectedAvatar(DEFAULT_AVATAR);
    setMode('login');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleModeSwitch = (newMode: 'login' | 'register') => {
    resetForm();
    setMode(newMode);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError("圖片檔案太大，請選擇小於 2MB 的圖片。");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedAvatar(event.target.result as string);
        }
      };
      reader.onerror = () => {
        setError("讀取圖片失敗，請再試一次。");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogin = async () => {
    setError(null);
    if (!name.trim() || !password.trim()) {
      setError("請輸入使用者名稱與密碼");
      return;
    }
    try {
      await login(name.trim(), password);
      handleClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRegister = async () => {
    setError(null);
    if (!name.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("請填寫所有欄位");
      return;
    }
    if (password !== confirmPassword) {
      setError("兩次輸入的密碼不相符");
      return;
    }
    try {
      await register({ name: name.trim(), avatar: selectedAvatar, password });
      handleClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (mode === 'login') {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center backdrop-blur-sm" onClick={handleClose} role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md m-4 border border-gray-700 transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 id="auth-modal-title" className="text-2xl font-bold text-white">
            {mode === 'login' ? '登入' : '註冊新帳號'}
          </h2>
          <button onClick={handleClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition" aria-label="Close modal">
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">使用者名稱</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：熱心市民"
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              autoFocus
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">密碼</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              required
            />
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">確認密碼</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                  required
                />
              </div>

              <div>
                <p className="block text-sm font-medium text-gray-300 mb-2 text-center">您的頭像</p>
                <div className="mt-2 flex justify-center items-center flex-col">
                  <label htmlFor="avatar-upload" className="relative cursor-pointer group">
                    <img
                      src={selectedAvatar}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover ring-2 ring-offset-2 ring-offset-gray-800 ring-gray-500 group-hover:ring-cyan-500 transition-all"
                    />
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm font-semibold">更換</span>
                    </div>
                  </label>
                  <input
                    id="avatar-upload"
                    name="avatar-upload"
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleAvatarChange}
                  />
                  <p className="text-xs text-gray-400 mt-2">點擊圖片以上傳，最大 2MB</p>
                </div>
              </div>
            </>
          )}

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-md transition duration-300"
          >
            {mode === 'login' ? '登入' : '註冊'}
          </button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => handleModeSwitch(mode === 'login' ? 'register' : 'login')}
              className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline"
            >
              {mode === 'login' ? '還沒有帳號？點此註冊' : '已經有帳號？點此登入'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
