import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';

export const FirestoreDebugger: React.FC = () =>
{
    const [ testResults, setTestResults ] = useState<any[]>( [] );
    const [ loading, setLoading ] = useState( false );

    const commonCollectionNames = [
        'conversations', // Your main collection
        'chatSessions',
        'chats',
        'sessions',
        'messages',
        'typingIndicators'
    ];

    const testCollection = async ( collectionName: string ) =>
    {
        try
        {
            const collectionRef = collection( db, collectionName );
            const snapshot = await getDocs( collectionRef );

            const result = {
                name: collectionName,
                exists: !snapshot.empty,
                size: snapshot.size,
                docs: snapshot.docs.map( doc => ( { id: doc.id, data: doc.data() } ) ),
                subcollections: [] as any[]
            };

            // For conversations collection, also check for messages subcollections
            if ( collectionName === 'conversations' && !snapshot.empty )
            {
                const firstDocId = snapshot.docs[ 0 ].id;
                try
                {
                    const messagesRef = collection( db, 'conversations', firstDocId, 'messages' );
                    const messagesSnapshot = await getDocs( messagesRef );
                    result.subcollections.push( {
                        name: `${ firstDocId }/messages`,
                        size: messagesSnapshot.size,
                        sample: messagesSnapshot.docs.slice( 0, 2 ).map( doc => ( { id: doc.id, data: doc.data() } ) )
                    } );
                } catch ( subError )
                {
                    console.log( 'No messages subcollection found for:', firstDocId );
                }
            }

            return result;
        } catch ( error: any )
        {
            return {
                name: collectionName,
                exists: false,
                error: error.message
            };
        }
    }; const testAllCollections = async () =>
    {
        setLoading( true );
        const results = await Promise.all(
            commonCollectionNames.map( testCollection )
        );
        setTestResults( results );
        setLoading( false );
    };

    useEffect( () =>
    {
        testAllCollections();
    }, [] );

    return (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">🔍 Firestore Debugger</h3>
                <button
                    onClick={testAllCollections}
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    disabled={loading}
                >
                    {loading ? '...' : 'Refresh'}
                </button>
            </div>

            <div className="space-y-2 text-xs">
                {testResults.map( ( result ) => (
                    <div key={result.name} className="border rounded p-2">
                        <div className="flex items-center justify-between">
                            <span className="font-mono font-medium">{result.name}</span>
                            <span className={`px-2 py-1 rounded text-xs ${ result.exists
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}>
                                {result.exists ? `${ result.size } docs` : 'Empty/Error'}
                            </span>
                        </div>

                        {result.error && (
                            <div className="mt-1 text-red-600 text-xs">
                                Error: {result.error}
                            </div>
                        )}

                        {result.exists && result.docs && result.docs.length > 0 && (
                            <div className="mt-2">
                                <details>
                                    <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                                        Show sample data
                                    </summary>
                                    <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                                        {JSON.stringify( result.docs[ 0 ], null, 2 )}
                                    </pre>
                                </details>

                                {result.subcollections && result.subcollections.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-xs font-medium text-purple-600">Subcollections:</p>
                                        {result.subcollections.map( ( sub: any, idx: number ) => (
                                            <div key={idx} className="ml-2 mt-1">
                                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                                    {sub.name} ({sub.size} docs)
                                                </span>
                                                {sub.sample && sub.sample.length > 0 && (
                                                    <details className="mt-1">
                                                        <summary className="text-xs cursor-pointer text-purple-600">
                                                            Sample message
                                                        </summary>
                                                        <pre className="text-xs bg-purple-50 p-2 rounded mt-1 overflow-x-auto">
                                                            {JSON.stringify( sub.sample[ 0 ], null, 2 )}
                                                        </pre>
                                                    </details>
                                                )}
                                            </div>
                                        ) )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) )}
            </div>

            <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
                <p className="font-medium">💡 Tips:</p>
                <ul className="mt-1 space-y-1">
                    <li>• Check which collections have data</li>
                    <li>• Verify collection names match your code</li>
                    <li>• Check Firestore security rules</li>
                    <li>• Ensure data structure matches expected format</li>
                </ul>
            </div>
        </div>
    );
};