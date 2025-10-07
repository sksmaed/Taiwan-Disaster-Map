import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Disaster, Comment, CommentTag, StoryPreview } from '../types';
import { DISASTER_TYPE_DETAILS } from '../data/disasters';
import CommentSection from './CommentSection';
import { AuthContext } from '../contexts/AuthContext';
import { XIcon } from './icons/XIcon';
import { ClockIcon } from './icons/ClockIcon';
import { LocationMarkerIcon } from './icons/LocationMarkerIcon';
import { ExclamationIcon } from './icons/ExclamationIcon';
import { ArrowsExpandIcon } from './icons/ArrowsExpandIcon';
import { MinimizeIcon } from './icons/MinimizeIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';
import { PlusIcon } from './icons/PlusIcon';


interface DisasterDetailPanelProps {
  disaster: Disaster | null;
  onClose: () => void;
  allComments: { [key: number]: Comment[] };
  setAllComments: React.Dispatch<React.SetStateAction<{ [key: number]: Comment[] }>>;
  onLikeComment: (disasterId: number, commentId: number) => void;
  onAddStory: (disasterId: number, newStory: StoryPreview) => void;
}

const DisasterDetailPanel: React.FC<DisasterDetailPanelProps> = ({ disaster, onClose, allComments, setAllComments, onLikeComment, onAddStory }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<StoryPreview | null>(null);
  const [isIframeLoading, setIsIframeLoading] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const { user } = useContext(AuthContext);

  // State for the add story form
  const [showAddStoryForm, setShowAddStoryForm] = useState(false);
  const [newStoryTitle, setNewStoryTitle] = useState('');
  const [newStoryUrl, setNewStoryUrl] = useState('');
  const [storyError, setStoryError] = useState('');

  useEffect(() => {
    if (disaster && disaster.stories.length > 0) {
      // Automatically select the newest story when the disaster changes or stories are added
      setSelectedStory(disaster.stories[disaster.stories.length - 1]);
    } else {
      setSelectedStory(null);
    }
     // Reset add story form when disaster changes
    setShowAddStoryForm(false);
    setNewStoryTitle('');
    setNewStoryUrl('');
    setStoryError('');
  }, [disaster]);

  // Handle loading state when the story URL changes
  useEffect(() => {
    if (selectedStory) {
      setIsIframeLoading(true);
      setIframeError(false);
    }
  }, [selectedStory]);

  const disasterComments = useMemo(() => disaster ? allComments[disaster.id] || [] : [], [disaster, allComments]);

  const handlePostComment = (text: string, tag: CommentTag, parentId?: number) => {
    if (!user || !disaster) return;

    const newComment: Comment = {
      id: Date.now(),
      author: user.name,
      avatar: user.avatar,
      timestamp: '剛剛',
      text,
      likedBy: [],
      tag: tag,
      replies: [],
    };

    if (!parentId) {
       // Add as a top-level comment
      setAllComments(prev => ({
        ...prev,
        [disaster.id]: [...(prev[disaster.id] || []), newComment],
      }));
    } else {
      // Add as a reply to a nested comment
      const addReplyRecursively = (comments: Comment[]): Comment[] => {
        return comments.map(c => {
          if (c.id === parentId) {
            const replies = c.replies ? [...c.replies, newComment] : [newComment];
            return { ...c, replies };
          }
          if (c.replies && c.replies.length > 0) {
            return { ...c, replies: addReplyRecursively(c.replies) };
          }
          return c;
        });
      };
      
      setAllComments(prevAllComments => {
          const disasterComments = prevAllComments[disaster.id] || [];
          const updatedDisasterComments = addReplyRecursively(disasterComments);
          return {
            ...prevAllComments,
            [disaster.id]: updatedDisasterComments,
          };
      });
    }
  };

  const handleAddStorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStoryError('');
    if (!newStoryTitle.trim() || !newStoryUrl.trim()) {
        setStoryError('標題和網址不能為空。');
        return;
    }
    try {
        new URL(newStoryUrl);
    } catch (_) {
        setStoryError('請輸入有效的網址。');
        return;
    }

    if (disaster) {
        onAddStory(disaster.id, { title: newStoryTitle.trim(), url: newStoryUrl.trim() });
        setNewStoryTitle('');
        setNewStoryUrl('');
        setShowAddStoryForm(false);
    }
  };

  const handleClose = () => {
    setIsFullScreen(false); // Reset on close
    onClose();
  };

  const panelBaseClasses = "bg-gray-800/80 backdrop-blur-md shadow-2xl transition-all duration-500 ease-in-out flex flex-col transform";
  const panelVisibilityClass = disaster ? 'translate-x-0' : 'translate-x-full';
  const panelLayoutClasses = isFullScreen
    ? 'fixed top-0 left-0 h-screen w-screen z-[5000]'
    : 'absolute top-0 right-0 h-full w-full md:w-1/2 lg:w-1/3 z-[1000]';

  return (
    <div className={`${panelBaseClasses} ${panelVisibilityClass} ${panelLayoutClasses}`}>
      {disaster && (
        <>
          <div className="p-4 bg-gray-900/50 flex justify-between items-center border-b border-gray-700">
            <div className="flex items-center space-x-3 min-w-0">
                <span className={`p-2 rounded-full ${DISASTER_TYPE_DETAILS[disaster.type].color}`}><img src={DISASTER_TYPE_DETAILS[disaster.type].iconUrl} alt={disaster.type} className="h-6 w-6 opacity-80" /></span>
                <h2 className="text-2xl font-bold text-white truncate">{disaster.name}</h2>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition" aria-label={isFullScreen ? 'Exit full screen' : 'Enter full screen'}>
                {isFullScreen ? <MinimizeIcon className="h-6 w-6" /> : <ArrowsExpandIcon className="h-6 w-6" />}
              </button>
              <button onClick={handleClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition" aria-label="Close panel">
                <XIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Basic Info */}
            <div className="space-y-3 bg-gray-900/30 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-gray-300">
                <ClockIcon className="h-5 w-5 text-cyan-400"/>
                <span>{new Date(disaster.date).toLocaleString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <LocationMarkerIcon className="h-5 w-5 text-cyan-400"/>
                <span>{disaster.location.join(', ')}</span>
              </div>
              <div className="flex items-start space-x-2 text-gray-300">
                <ExclamationIcon className="h-5 w-5 text-red-400 mt-1 flex-shrink-0"/>
                <div>
                    <p className="font-semibold text-red-400">傷亡情況</p>
                    <p>{disaster.casualties}</p>
                </div>
              </div>
              <p className="text-gray-300 pt-2">{disaster.description}</p>
            </div>

            {/* Web Page Preview */}
            <div className="bg-gray-900/30 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-cyan-300">相關報導與視角</h3>
              
              {disaster.stories.length > 0 ? (
                <>
                  <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-700 pb-4">
                    {disaster.stories.map((story, index) => (
                      <button 
                        key={index}
                        onClick={() => setSelectedStory(story)}
                        className={`px-3 py-1.5 text-sm rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 ${
                          selectedStory?.url === story.url
                            ? 'bg-cyan-600 text-white font-semibold shadow-lg'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600/70'
                        }`}
                      >
                        {story.title}
                      </button>
                    ))}
                  </div>

                  {selectedStory && (
                    <div className="mb-4">
                      <a
                        href={selectedStory.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full space-x-2 bg-gray-700 hover:bg-gray-600 text-cyan-300 font-medium py-2 px-4 rounded-md transition duration-300"
                      >
                        <ExternalLinkIcon className="h-5 w-5" />
                        <span>閱讀原文</span>
                      </a>
                    </div>
                  )}

                  <div className="w-full aspect-[4/5] bg-gray-900/50 rounded-lg overflow-hidden border border-gray-700 relative">
                    {isIframeLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/70 z-10">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
                          <p className="text-sm text-gray-400">載入預覽中...</p>
                        </div>
                      </div>
                    )}
                    {iframeError && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/70 text-red-400 p-4 z-10 text-center">
                        <ExclamationIcon className="h-10 w-10 mb-2" />
                        <p className="font-semibold">無法載入預覽</p>
                        <p className="text-sm text-gray-400 mt-1">此頁面可能不支援嵌入顯示。請嘗試使用「閱讀原文」按鈕開啟。</p>
                      </div>
                    )}
                    {selectedStory && (
                      <iframe
                        key={selectedStory.url}
                        src={selectedStory.url}
                        title={`${disaster.name} - ${selectedStory.title}`}
                        className="w-full h-full"
                        style={{ visibility: isIframeLoading || iframeError ? 'hidden' : 'visible' }}
                        sandbox="allow-scripts allow-same-origin"
                        onLoad={() => setIsIframeLoading(false)}
                        onError={() => {
                          setIsIframeLoading(false);
                          setIframeError(true);
                        }}
                      ></iframe>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 bg-gray-900/50 rounded-lg border border-dashed border-gray-700 text-gray-400">
                  <p>此災害暫無相關報導連結。</p>
                  {user && <p className="text-sm mt-1">您可以新增第一則！</p>}
                </div>
              )}

              {user && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  {!showAddStoryForm ? (
                    <button
                      onClick={() => setShowAddStoryForm(true)}
                      className="w-full flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-cyan-300 font-medium py-2 px-4 rounded-md transition duration-300"
                    >
                      <PlusIcon className="h-5 w-5" />
                      <span>新增相關報導</span>
                    </button>
                  ) : (
                    <form onSubmit={handleAddStorySubmit} className="space-y-3">
                      <h4 className="text-md font-semibold text-gray-200">新增相關報導</h4>
                      <div>
                        <label htmlFor="story-title" className="sr-only">報導標題</label>
                        <input
                          id="story-title"
                          type="text"
                          placeholder="報導標題"
                          value={newStoryTitle}
                          onChange={(e) => setNewStoryTitle(e.target.value)}
                          className="w-full input-style"
                          required
                          autoFocus
                        />
                      </div>
                      <div>
                        <label htmlFor="story-url" className="sr-only">報導網址</label>
                        <input
                          id="story-url"
                          type="url"
                          placeholder="https://example.com"
                          value={newStoryUrl}
                          onChange={(e) => setNewStoryUrl(e.target.value)}
                          className="w-full input-style"
                          required
                        />
                      </div>
                      {storyError && <p className="text-red-400 text-sm">{storyError}</p>}
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddStoryForm(false);
                            setStoryError('');
                            setNewStoryTitle('');
                            setNewStoryUrl('');
                          }}
                          className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                        >
                          取消
                        </button>
                        <button
                          type="submit"
                          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                        >
                          新增
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Community Discussion */}
            <CommentSection
              comments={disasterComments}
              onPostComment={handlePostComment}
              onLikeComment={(commentId) => onLikeComment(disaster.id, commentId)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DisasterDetailPanel;