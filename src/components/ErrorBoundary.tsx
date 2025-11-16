import type { ReactNode } from 'react';
import React, { Component } from 'react';

interface Props
{
    children: ReactNode;
}

interface State
{
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State>
{
    constructor ( props: Props )
    {
        super( props );
        this.state = { hasError: false };
    }

    static getDerivedStateFromError ( error: Error ): State
    {
        return { hasError: true, error };
    }

    componentDidCatch ( error: Error, errorInfo: React.ErrorInfo )
    {
        console.error( 'Chat Dashboard Error:', error, errorInfo );
    }

    render ()
    {
        if ( this.state.hasError )
        {
            return (
                <div className="h-screen flex items-center justify-center bg-red-50">
                    <div className="text-center p-8">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.598 0L4.268 18.5c-.77.833-.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-red-900 mb-2">Something went wrong</h1>
                        <p className="text-red-700 mb-6">
                            The chat dashboard encountered an unexpected error.
                        </p>
                        <div className="space-x-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                Reload Page
                            </button>
                            <button
                                onClick={() => this.setState( { hasError: false, error: undefined } )}
                                className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                        {this.state.error && (
                            <details className="mt-6 text-left">
                                <summary className="text-sm text-red-600 cursor-pointer">Error Details</summary>
                                <pre className="mt-2 text-xs bg-red-100 p-4 rounded border overflow-auto max-h-40">
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}