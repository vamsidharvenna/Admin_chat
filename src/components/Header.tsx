import { CheckCircle, Clock, Filter, MessageSquare, Search, Users } from 'lucide-react';
import React from 'react';
import type { ChatFilter } from '../types';

interface HeaderProps
{
    stats: {
        total: number;
        active: number;
        waiting: number;
        closed: number;
    };
    filter: ChatFilter;
    onFilterChange: ( filter: ChatFilter ) => void;
}

export const Header: React.FC<HeaderProps> = ( { stats, filter, onFilterChange } ) =>
{
    const handleSearchChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
    {
        onFilterChange( {
            ...filter,
            searchTerm: e.target.value
        } );
    };

    const handleStatusFilter = ( status: 'all' | 'active' | 'waiting' | 'closed' ) =>
    {
        onFilterChange( {
            ...filter,
            status
        } );
    };

    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Chat Dashboard</h1>
                    <p className="text-sm text-gray-500">Manage customer conversations in real-time</p>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm text-green-700 font-medium">Live</span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center">
                        <Users className="w-8 h-8 text-blue-600" />
                        <div className="ml-3">
                            <p className="text-sm text-blue-600 font-medium">Total Chats</p>
                            <p className="text-xl font-bold text-blue-900">{stats.total}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center">
                        <MessageSquare className="w-8 h-8 text-green-600" />
                        <div className="ml-3">
                            <p className="text-sm text-green-600 font-medium">Active</p>
                            <p className="text-xl font-bold text-green-900">{stats.active}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-center">
                        <Clock className="w-8 h-8 text-yellow-600" />
                        <div className="ml-3">
                            <p className="text-sm text-yellow-600 font-medium">Waiting</p>
                            <p className="text-xl font-bold text-yellow-900">{stats.waiting}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                        <CheckCircle className="w-8 h-8 text-gray-600" />
                        <div className="ml-3">
                            <p className="text-sm text-gray-600 font-medium">Closed</p>
                            <p className="text-xl font-bold text-gray-900">{stats.closed}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={filter.searchTerm || ''}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                        value={filter.status || 'all'}
                        onChange={( e ) => handleStatusFilter( e.target.value as any )}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="waiting">Waiting</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
            </div>
        </div>
    );
};