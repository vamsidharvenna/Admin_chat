import { Clock, Mail, MoreHorizontal, User } from 'lucide-react';
import React from 'react';
import { useTypingIndicators } from '../hooks';
import type { ChatSession } from '../types';
import { formatTime, truncateText } from '../utils/helpers';

interface ChatSessionsListProps
{
    sessions: ChatSession[];
    selectedSession: ChatSession | null;
    onSessionSelect: ( session: ChatSession ) => void;
    onStatusChange: ( sessionId: string, status: 'active' | 'waiting' | 'closed' ) => void;
    loading: boolean;
}

export const ChatSessionsList: React.FC<ChatSessionsListProps> = ( {
    sessions,
    selectedSession,
    onSessionSelect,
    onStatusChange,
    loading
} ) =>
{
    console.log( "📋 Rendering ChatSessionsList with sessions:", sessions );
    const { isUserTyping } = useTypingIndicators();
    const getStatusColor = ( status: string ) =>
    {
        switch ( status )
        {
            case 'active': return 'bg-green-100 text-green-800';
            case 'waiting': return 'bg-yellow-100 text-yellow-800';
            case 'closed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusDot = ( status: string ) =>
    {
        switch ( status )
        {
            case 'active': return 'bg-green-500';
            case 'waiting': return 'bg-yellow-500';
            case 'closed': return 'bg-gray-500';
            default: return 'bg-gray-500';
        }
    };

    if ( loading )
    {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if ( sessions.length === 0 )
    {
        return (
            <div className="h-full flex items-center justify-center px-4">
                <div className="text-center">
                    <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Conversations</h3>
                    <p className="text-gray-500 text-sm">New chat sessions will appear here</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                    Conversations ({sessions.length})
                </h2>
            </div>

            <div className="divide-y divide-gray-100">
                {sessions.map( ( session ) => (
                    <div
                        key={session.id}
                        onClick={() => onSessionSelect( session )}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${ selectedSession?.id === session.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                            }`}
                    >
                        <div className="flex items-start space-x-3">
                            {/* Avatar */}
                            <div className="relative">
                                {session.userAvatar ? (
                                    <img
                                        src={session.userAvatar}
                                        alt={session.userName || 'User'}
                                        className="w-10 h-10 rounded-full"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                        <User className="w-5 h-5 text-gray-600" />
                                    </div>
                                )}

                                {/* Status indicator */}
                                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${ getStatusDot( session.status ) }`}></div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-sm font-medium text-gray-900 truncate">
                                        {session.userName || 'Anonymous User'}
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                        {session.unreadCount > 0 && (
                                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[18px] text-center">
                                                {session.unreadCount}
                                            </span>
                                        )}
                                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>

                                {session.userEmail && (
                                    <div className="flex items-center text-xs text-gray-500 mb-1">
                                        <Mail className="w-3 h-3 mr-1" />
                                        <span className="truncate">{session.userEmail}</span>
                                    </div>
                                )}

                                {/* Status badge */}
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${ getStatusColor( session.status ) }`}>
                                        {session.status.charAt( 0 ).toUpperCase() + session.status.slice( 1 )}
                                    </span>
                                    <span className="text-xs text-gray-500 flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {formatTime( session.lastActivity )}
                                    </span>
                                </div>

                                {/* Last message or typing indicator */}
                                {isUserTyping( session.id, session.userId ) ? (
                                    <div className="flex items-center text-sm text-blue-600">
                                        <div className="flex space-x-1 mr-2">
                                            <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"></div>
                                            <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                        <span>User is typing...</span>
                                    </div>
                                ) : session.lastMessage ? (
                                    <p className="text-sm text-gray-600">
                                        <span className={`font-medium ${ session.lastMessage.sender === 'admin' ? 'text-blue-600' :
                                            session.lastMessage.sender === 'bot' ? 'text-purple-600' : 'text-gray-900'
                                            }`}>
                                            {session.lastMessage.sender === 'admin' ? 'You: ' :
                                                session.lastMessage.sender === 'bot' ? 'Bot: ' : ''}
                                        </span>
                                        {truncateText( session.lastMessage.text, 40 )}
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">No messages yet</p>
                                )}
                            </div>
                        </div>

                        {/* Quick actions */}
                        {selectedSession?.id === session.id && (
                            <div className="mt-3 flex space-x-2">
                                {session.status !== 'active' && (
                                    <button
                                        onClick={( e ) =>
                                        {
                                            e.stopPropagation();
                                            onStatusChange( session.id, 'active' );
                                        }}
                                        className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                                    >
                                        Activate
                                    </button>
                                )}
                                {session.status !== 'closed' && (
                                    <button
                                        onClick={( e ) =>
                                        {
                                            e.stopPropagation();
                                            onStatusChange( session.id, 'closed' );
                                        }}
                                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                                    >
                                        Close
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ) )}
            </div>
        </div>
    );
};