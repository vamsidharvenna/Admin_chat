import React from 'react';

interface LoadingSpinnerProps
{
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ( {
    size = 'md',
    className = ''
} ) =>
{
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    return (
        <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${ sizeClasses[ size ] } ${ className }`} />
    );
};

interface LoadingStateProps
{
    message?: string;
    className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ( {
    message = 'Loading...',
    className = ''
} ) =>
{
    return (
        <div className={`flex flex-col items-center justify-center p-8 ${ className }`}>
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">{message}</p>
        </div>
    );
};