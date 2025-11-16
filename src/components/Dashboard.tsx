import React, { useState } from 'react';
import { useChatSessions } from '../hooks';
import type { ChatFilter, ChatSession } from '../types';
import { ChatSessionsList } from './ChatSessionsList';
import { ChatWindow } from './ChatWindow';
import { FirestoreDebugger } from './FirestoreDebugger';
import { Header } from './Header';

export const Dashboard: React.FC = () =>
{
    const [ selectedSession, setSelectedSession ] = useState<ChatSession | null>( null );
    const [ filter, setFilter ] = useState<ChatFilter>( { status: 'all' } );
    const { sessions, loading, error, updateSessionStatus, markAsRead } = useChatSessions();

    const handleSessionSelect = async ( session: ChatSession ) =>
    {
        setSelectedSession( session );

        // Mark messages as read when session is selected
        if ( session.unreadCount > 0 )
        {
            await markAsRead( session.id );
        }
    };

    const handleStatusChange = async ( sessionId: string, status: 'active' | 'waiting' | 'closed' ) =>
    {
        await updateSessionStatus( sessionId, status );

        // If the session is closed and it's currently selected, clear selection
        if ( status === 'closed' && selectedSession?.id === sessionId )
        {
            setSelectedSession( null );
        }
    };

    // Filter sessions based on current filter
    const filteredSessions = sessions.filter( session =>
    {
        if ( filter.status && filter.status !== 'all' && session.status !== filter.status )
        {
            return false;
        }

        if ( filter.searchTerm )
        {
            const searchTerm = filter.searchTerm.toLowerCase();
            return (
                session.userName?.toLowerCase().includes( searchTerm ) ||
                session.userEmail?.toLowerCase().includes( searchTerm ) ||
                session.lastMessage?.text?.toLowerCase().includes( searchTerm )
            );
        }

        return true;
    } );

    // Get statistics
    const stats = {
        total: sessions.length,
        active: sessions.filter( s => s.status === 'active' ).length,
        waiting: sessions.filter( s => s.status === 'waiting' ).length,
        closed: sessions.filter( s => s.status === 'closed' ).length,
    };

    if ( error )
    {
        return (
            <div className="h-screen flex items-center justify-center bg-red-50">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-red-800 mb-2">Connection Error</h2>
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            <Header stats={stats} filter={filter} onFilterChange={setFilter} />

            <div className="flex-1 flex overflow-hidden">
                <div className="w-1/3 border-r border-gray-200 bg-white">
                    <ChatSessionsList
                        sessions={filteredSessions}
                        selectedSession={selectedSession}
                        onSessionSelect={handleSessionSelect}
                        onStatusChange={handleStatusChange}
                        loading={loading}
                    />
                </div>

                <div className="flex-1">
                    {selectedSession ? (
                        <ChatWindow
                            session={selectedSession}
                            onStatusChange={handleStatusChange}
                        />
                    ) : (
                        <div className="h-full flex items-center justify-center bg-gray-50">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Conversation</h3>
                                <p className="text-gray-500">Choose a chat from the sidebar to start responding to customers</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Debug component - remove in production */}
            <FirestoreDebugger />
        </div>
    );
};