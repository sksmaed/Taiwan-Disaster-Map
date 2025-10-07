

import React, { useContext } from 'react';
import { DisasterType } from '../types';
import { XIcon } from './icons/XIcon';
import { PlusIcon } from './icons/PlusIcon';
import { AuthContext } from '../contexts/AuthContext';

interface FilterPanelProps {
  filters: { type: DisasterType | 'all'; decade: number | 'all' };
  setFilters: React.Dispatch<React.SetStateAction<{ type: DisasterType | 'all'; decade: number | 'all' }>>;
  decades: number[];
  onOpenReportModal: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, setFilters, decades, onOpenReportModal }) => {
  const { user } = useContext(AuthContext);
  const disasterTypes: (DisasterType | 'all')[] = ['all', ...Object.values(DisasterType)];

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, type: e.target.value as DisasterType | 'all' }));
  };

  const handleDecadeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, decade: e.target.value === 'all' ? 'all' : Number(e.target.value) }));
  };

  const hasActiveFilters = filters.type !== 'all' || filters.decade !== 'all';
  
  return (
    <aside className="w-64 bg-gray-800 p-4 z-10 flex flex-col space-y-6 shadow-2xl border-r border-gray-700">
      <div>
        <h2 className="text-lg font-semibold text-cyan-300 mb-3">篩選事件</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-300 mb-1">災害類型</label>
            <select
              id="type-filter"
              value={filters.type}
              onChange={handleTypeChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            >
              {disasterTypes.map(type => (
                <option key={type} value={type}>{type === 'all' ? '所有類型' : type}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="decade-filter" className="block text-sm font-medium text-gray-300 mb-1">年代</label>
            <select
              id="decade-filter"
              value={filters.decade}
              onChange={handleDecadeChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            >
              <option value="all">所有年代</option>
              {decades.map(decade => (
                <option key={decade} value={decade}>{`${decade}年代`}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {hasActiveFilters && (
        <div className="border-t border-gray-700 pt-4 space-y-2">
          <h3 className="text-sm font-semibold text-gray-400">已套用篩選</h3>
          <div className="flex flex-wrap gap-2">
            {filters.type !== 'all' && (
              <span className="bg-cyan-900 text-cyan-200 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                {filters.type}
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, type: 'all' }))} 
                  className="ml-1.5 -mr-1 p-0.5 rounded-full text-cyan-300 hover:text-white hover:bg-cyan-700 transition-colors"
                  aria-label={`移除類型篩選：${filters.type}`}
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.decade !== 'all' && (
              <span className="bg-cyan-900 text-cyan-200 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                {`${filters.decade}年代`}
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, decade: 'all' }))} 
                  className="ml-1.5 -mr-1 p-0.5 rounded-full text-cyan-300 hover:text-white hover:bg-cyan-700 transition-colors"
                  aria-label={`移除年代篩選：${filters.decade}年代`}
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex-grow"></div>

      <div className="border-t border-gray-700 pt-4">
        {user ? (
            <button
                onClick={onOpenReportModal}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 flex items-center justify-center space-x-2"
            >
                <PlusIcon className="h-5 w-5" />
                <span>回報新災害</span>
            </button>
        ) : (
            <p className="text-xs text-center text-gray-400">登入後即可回報新災害事件。</p>
        )}
      </div>

       <div className="text-xs text-gray-500 mt-4">
        <p>資料來源為公開歷史紀錄，僅供教育與研究用途。</p>
      </div>
    </aside>
  );
};

export default FilterPanel;
