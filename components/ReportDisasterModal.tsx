
import React, { useState } from 'react';
import { DisasterType, StoryPreview, Disaster } from '../types';
import { XIcon } from './icons/XIcon';
import { LocationMarkerIcon } from './icons/LocationMarkerIcon';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ReportDisasterModalProps {
  isOpen: boolean;
  isPickingLocation: boolean;
  pickedLocation: [number, number] | null;
  onClose: () => void;
  onPickLocation: () => void;
  onSubmit: (disasterData: Omit<Disaster, 'id'>) => void;
}

const ReportDisasterModal: React.FC<ReportDisasterModalProps> = ({
  isOpen,
  isPickingLocation,
  pickedLocation,
  onClose,
  onPickLocation,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<DisasterType>(DisasterType.Earthquake);
  const [description, setDescription] = useState('');
  const [casualties, setCasualties] = useState('');
  const [stories, setStories] = useState<StoryPreview[]>([]);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setName('');
    setDate('');
    setType(DisasterType.Earthquake);
    setDescription('');
    setCasualties('');
    setStories([]);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleStoryChange = (index: number, field: keyof StoryPreview, value: string) => {
    const newStories = [...stories];
    newStories[index][field] = value;
    setStories(newStories);
  };

  const addStoryField = () => {
    setStories([...stories, { title: '', url: '' }]);
  };

  const removeStoryField = (index: number) => {
    const newStories = stories.filter((_, i) => i !== index);
    setStories(newStories);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !date || !pickedLocation || !description.trim() || !casualties.trim()) {
      setError("請填寫所有必填欄位並選擇地點。");
      return;
    }

    const validStories = stories.filter(s => s.title.trim() && s.url.trim());

    const newDisasterData: Omit<Disaster, 'id'> = {
      name: name.trim(),
      date,
      type,
      location: pickedLocation,
      description: description.trim(),
      casualties: casualties.trim(),
      stories: validStories,
    };

    onSubmit(newDisasterData);
  };
  
  if (!isOpen) return null;

  // The modal is hidden completely when picking a location.
  // A banner will be shown from App.tsx to guide the user.
  if (isPickingLocation) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[9998] flex items-center justify-center backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div
        className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-2xl m-4 border border-gray-700 transform transition-all flex flex-col h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h2 id="report-modal-title" className="text-2xl font-bold text-white">回報新的災害事件</h2>
          <button onClick={handleClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition" aria-label="Close modal">
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">事件標題</label>
              <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full input-style" />
            </div>
             <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-2">災害類型</label>
              <select id="type" value={type} onChange={e => setType(e.target.value as DisasterType)} required className="w-full input-style">
                {Object.values(DisasterType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">發生日期</label>
              <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full input-style" />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">發生地點</label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white flex items-center space-x-2">
                  <LocationMarkerIcon className="h-5 w-5 text-cyan-400" />
                  <span className={pickedLocation ? '' : 'text-gray-400'}>
                    {pickedLocation ? `${pickedLocation[0].toFixed(4)}, ${pickedLocation[1].toFixed(4)}` : '尚未選擇'}
                  </span>
                </div>
                <button type="button" onClick={onPickLocation} className="font-bold py-2 px-4 rounded-md transition duration-300 bg-cyan-600 hover:bg-cyan-700 text-white">
                  選擇位置
                </button>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="casualties" className="block text-sm font-medium text-gray-300 mb-2">傷亡情況</label>
            <input id="casualties" type="text" value={casualties} onChange={e => setCasualties(e.target.value)} required className="w-full input-style" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">事件描述</label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} required className="w-full input-style"></textarea>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-cyan-300 mb-3">相關報導與視角 (選填)</h3>
            <div className="space-y-3">
              {stories.map((story, index) => (
                <div key={index} className="flex items-center space-x-2 bg-gray-900/50 p-2 rounded-md">
                  <input type="text" placeholder="報導標題" value={story.title} onChange={e => handleStoryChange(index, 'title', e.target.value)} className="flex-1 input-style" />
                  <input type="url" placeholder="https://example.com" value={story.url} onChange={e => handleStoryChange(index, 'url', e.target.value)} className="flex-1 input-style" />
                  <button type="button" onClick={() => removeStoryField(index)} className="p-2 text-red-400 hover:text-red-300 transition">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={addStoryField} className="flex items-center space-x-2 text-sm text-cyan-400 hover:text-cyan-300 transition">
                <PlusIcon className="h-5 w-5" />
                <span>新增一則報導</span>
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6 flex-shrink-0">
          {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
          <button type="submit" onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition duration-300">送出回報</button>
        </div>
      </div>
    </div>
  );
};

export default ReportDisasterModal;