import { Bot, Clock, Mail, MoreVertical, Send, User } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useMessages, useTypingIndicators } from '../hooks';
import type { ChatSession } from '../types';
import { formatDateTime } from '../utils/helpers';

interface ChatWindowProps
{
    session: ChatSession;
    onStatusChange: ( sessionId: string, status: 'active' | 'waiting' | 'closed' ) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ( { session, onStatusChange } ) =>
{
    const [ messageText, setMessageText ] = useState( '' );
    const [ isSending, setIsSending ] = useState( false );
    const messagesEndRef = useRef<HTMLDivElement>( null );
    const { messages, loading, error, sendMessage } = useMessages( session.id );
    const { isUserTyping } = useTypingIndicators();

    // Auto-scroll to bottom when new messages arrive
    useEffect( () =>
    {
        messagesEndRef.current?.scrollIntoView( { behavior: 'smooth' } );
    }, [ messages ] );

    const handleSendMessage = async ( e: React.FormEvent ) =>
    {
        e.preventDefault();

        if ( !messageText.trim() || isSending ) return;

        setIsSending( true );
        try
        {
            await sendMessage( messageText );
            setMessageText( '' );
        } catch ( error )
        {
            console.error( 'Failed to send message:', error );
        } finally
        {
            setIsSending( false );
        }
    };

    const getMessageSenderIcon = ( sender: 'user' | 'admin' | 'bot' ) =>
    {
        switch ( sender )
        {
            case 'admin':
                return <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">A</div>;
            case 'bot':
                return <Bot className="w-8 h-8 p-2 bg-purple-500 text-white rounded-full" />;
            case 'user':
            default:
                return <User className="w-8 h-8 p-2 bg-gray-500 text-white rounded-full" />;
        }
    };

    const getMessageAlignment = ( sender: 'user' | 'admin' | 'bot' ) =>
    {
        return sender === 'admin' ? 'justify-end' : 'justify-start';
    };

    const getMessageBubbleStyle = ( sender: 'user' | 'admin' | 'bot' ) =>
    {
        switch ( sender )
        {
            case 'admin':
                return 'bg-blue-500 text-white ml-auto';
            case 'bot':
                return 'bg-purple-100 text-purple-900 border border-purple-200';
            case 'user':
            default:
                return 'bg-gray-100 text-gray-900';
        }
    };

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            {session.userAvatar ? (
                                <img
                                    src={session.userAvatar}
                                    alt={session.userName || 'User'}
                                    className="w-10 h-10 rounded-full"
                                />
                            ) : (
                                <User className="w-10 h-10 p-2 bg-gray-500 text-white rounded-full" />
                            )}

                            {/* Online status indicator */}
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${ session.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                                }`}></div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {session.userName || 'Anonymous User'}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                {session.userEmail && (
                                    <div className="flex items-center">
                                        <Mail className="w-4 h-4 mr-1" />
                                        <span>{session.userEmail}</span>
                                    </div>
                                )}
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    <span>Last activity: {formatDateTime( session.lastActivity )}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        {/* Status badge */}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${ session.status === 'active' ? 'bg-green-100 text-green-800' :
                                session.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                            }`}>
                            {session.status.charAt( 0 ).toUpperCase() + session.status.slice( 1 )}
                        </span>

                        {/* Actions dropdown */}
                        <div className="relative">
                            <button className="p-2 rounded-md hover:bg-gray-100">
                                <MoreVertical className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading && messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bot className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Messages Yet</h3>
                            <p className="text-gray-500">Start the conversation by sending a message</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map( ( message ) => (
                            <div key={message.id} className={`flex ${ getMessageAlignment( message.sender ) }`}>
                                <div className="flex max-w-xs lg:max-w-md">
                                    {message.sender !== 'admin' && (
                                        <div className="shrink-0 mr-3">
                                            {getMessageSenderIcon( message.sender )}
                                        </div>
                                    )}

                                    <div className="flex flex-col">
                                        <div className={`rounded-lg px-4 py-2 ${ getMessageBubbleStyle( message.sender ) }`}>
                                            <p className="text-sm">{message.text}</p>
                                        </div>
                                        <span className="text-xs text-gray-500 mt-1">
                                            {formatDateTime( message.timestamp )}
                                        </span>
                                    </div>

                                    {message.sender === 'admin' && (
                                        <div className="shrink-0 ml-3">
                                            {getMessageSenderIcon( message.sender )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) )}

                        {/* Typing indicator */}
                        {isUserTyping( session.id, session.userId ) && (
                            <div className="flex justify-start">
                                <div className="flex max-w-xs lg:max-w-md">
                                    <div className="shrink-0 mr-3">
                                        {getMessageSenderIcon( 'user' )}
                                    </div>
                                    <div className="bg-gray-100 rounded-lg px-4 py-2">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            {session.status !== 'closed' && (
                <div className="border-t border-gray-200 p-4">
                    {error && (
                        <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded-md">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                        <input
                            type="text"
                            value={messageText}
                            onChange={( e ) => setMessageText( e.target.value )}
                            placeholder="Type your message..."
                            disabled={isSending}
                            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={!messageText.trim() || isSending}
                            className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {isSending ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </button>
                    </form>
                </div>
            )}

            {session.status === 'closed' && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">This conversation has been closed</p>
                        <button
                            onClick={() => onStatusChange( session.id, 'active' )}
                            className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition-colors"
                        >
                            Reopen
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};