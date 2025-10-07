import React, { useState, useContext, useMemo } from 'react';
import { Comment, CommentTag } from '../types';
import { AuthContext } from '../contexts/AuthContext';
import { ChatAlt2Icon } from './icons/ChatAlt2Icon';
import { ThumbUpIcon } from './icons/ThumbUpIcon';

const TAG_COLORS: { [key in CommentTag]: string } = {
  [CommentTag.Reflection]: 'border-purple-400 text-purple-300',
  [CommentTag.Experience]: 'border-blue-400 text-blue-300',
  [CommentTag.Suggestion]: 'border-green-400 text-green-300',
};

const ReplyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
    </svg>
);


interface CommentCardProps {
    comment: Comment;
    onLike: (commentId: number) => void;
    onPostComment: (text: string, tag: CommentTag, parentId?: number) => void;
    isReply?: boolean;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment, onLike, onPostComment, isReply = false }) => {
    const { user } = useContext(AuthContext);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [replyTag, setReplyTag] = useState<CommentTag>(CommentTag.Reflection);

    const isLiked = user ? (comment.likedBy || []).includes(user.name) : false;
    const likeCount = (comment.likedBy || []).length;

    const handlePostReply = () => {
        if (replyText.trim() && user) {
            onPostComment(replyText, replyTag, comment.id);
            setReplyText('');
            setReplyTag(CommentTag.Reflection);
            setIsReplying(false);
        }
    };

    return (
        <div className={`flex space-x-3 ${isReply ? 'mt-4 pl-4 border-l-2 border-gray-700' : ''}`}>
            <img src={comment.avatar} alt={comment.author} className="h-10 w-10 rounded-full bg-gray-600" />
            <div className="flex-1">
                <div className="bg-gray-700 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                        <p className="font-semibold text-white">{comment.author}</p>
                        <p className="text-xs text-gray-400">{comment.timestamp}</p>
                    </div>
                    <p className="text-sm text-gray-300 my-2">{comment.text}</p>
                </div>
                <div className="flex items-center space-x-4 mt-1 px-2 text-xs">
                    <button
                        onClick={() => onLike(comment.id)}
                        disabled={!user}
                        className={`flex items-center space-x-1 transition duration-200 disabled:cursor-not-allowed ${
                            isLiked
                                ? 'text-cyan-400 hover:text-cyan-300'
                                : 'text-gray-400 hover:text-white'
                        }`}
                        aria-label={isLiked ? 'Unlike comment' : 'Like comment'}
                    >
                        <ThumbUpIcon className={`h-4 w-4 ${isLiked ? 'fill-cyan-400' : ''}`} />
                        <span>{likeCount}</span>
                    </button>
                    {user && (
                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className="flex items-center space-x-1 text-gray-400 hover:text-white transition"
                        >
                            <ReplyIcon className="h-4 w-4 transform -scale-x-100" />
                            <span>回覆</span>
                        </button>
                    )}
                    <span className={`px-2 py-0.5 text-xs rounded-full border ${TAG_COLORS[comment.tag]}`}>
                        {comment.tag}
                    </span>
                </div>
                {isReplying && (
                    <div className="mt-3 flex flex-col space-y-2">
                        <textarea
                            className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition text-sm"
                            rows={2}
                            placeholder={`回覆 ${comment.author}...`}
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            autoFocus
                        />
                        <div className="flex items-center justify-between">
                             <div className="flex items-center justify-start space-x-1">
                                {Object.values(CommentTag).map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => setReplyTag(tag)}
                                        className={`px-2 py-0.5 text-xs rounded-full border transition-colors duration-200 ${
                                            replyTag === tag
                                                ? `text-white ${TAG_COLORS[tag].replace('border-', 'bg-').replace('-400', '-500')} border-transparent`
                                                : `${TAG_COLORS[tag]} bg-transparent hover:bg-gray-700/50`
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handlePostReply}
                                disabled={!replyText.trim()}
                                className="bg-cyan-700 hover:bg-cyan-600 text-white font-bold py-1 px-3 rounded-md transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed text-sm"
                            >
                                送出回覆
                            </button>
                        </div>
                    </div>
                )}

                {comment.replies && comment.replies.map(reply => (
                    <CommentCard key={reply.id} comment={reply} onLike={onLike} onPostComment={onPostComment} isReply={true} />
                ))}
            </div>
        </div>
    );
};

interface CommentSectionProps {
  comments: Comment[];
  onPostComment: (text: string, tag: CommentTag, parentId?: number) => void;
  onLikeComment: (commentId: number) => void;
}

type SortOrder = 'likes' | 'newest';

const CommentSection: React.FC<CommentSectionProps> = ({ comments, onPostComment, onLikeComment }) => {
  const { user } = useContext(AuthContext);
  const [commentText, setCommentText] = useState('');
  const [selectedTag, setSelectedTag] = useState<CommentTag>(CommentTag.Experience);
  const [sortOrder, setSortOrder] = useState<SortOrder>('likes');

  const sortedComments = useMemo(() => {
    return [...comments].sort((a, b) => {
      if (sortOrder === 'likes') {
        const likesA = a.likedBy?.length || 0;
        const likesB = b.likedBy?.length || 0;
        if (likesB !== likesA) {
          return likesB - likesA; // Sort by most likes
        }
      }
      // Fallback for 'likes' tie, or primary sort for 'newest'
      return b.id - a.id;
    });
  }, [comments, sortOrder]);

  const handlePost = () => {
    if (commentText.trim()) {
      onPostComment(commentText.trim(), selectedTag);
      setCommentText('');
      setSelectedTag(CommentTag.Experience);
    }
  };

  return (
    <div className="bg-gray-900/30 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-cyan-300 flex items-center">
          <ChatAlt2Icon className="h-6 w-6 mr-2"/>
          社群討論區
        </h3>
        <div className="relative">
          <select
            id="comment-sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            aria-label="Sort comments"
            className="bg-gray-700 border border-gray-600 rounded-md py-1 pl-3 pr-8 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition appearance-none"
          >
            <option value="likes">依熱門排序</option>
            <option value="newest">依最新排序</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {sortedComments.length > 0 ? sortedComments.map(comment => (
          <CommentCard key={comment.id} comment={comment} onLike={onLikeComment} onPostComment={onPostComment} />
        )) : (
            <p className="text-gray-400 text-center py-4">還沒有任何討論，分享你的看法吧！</p>
        )}
      </div>
      <div className="mt-6">
        {user ? (
          <div className="flex flex-col space-y-3">
            <textarea 
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                rows={3}
                placeholder={`以 ${user.name} 的身份留言...`}
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
            />
            <div className="flex items-center justify-start space-x-2">
                <span className="text-sm text-gray-400">選擇標籤:</span>
                {Object.values(CommentTag).map((tag) => (
                    <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`px-3 py-1 text-xs rounded-full border transition-colors duration-200 ${
                            selectedTag === tag
                                ? `text-white ${TAG_COLORS[tag].replace('border-', 'bg-').replace('-400', '-500')} border-transparent`
                                : `${TAG_COLORS[tag]} bg-transparent hover:bg-gray-700`
                        }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>
            <button 
                onClick={handlePost}
                disabled={!commentText.trim()}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
                發表留言
            </button>
          </div>
        ) : (
          <div className="text-center p-4 bg-gray-700/50 rounded-lg border border-gray-600">
            <p className="text-gray-300">請登入以參與討論。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;