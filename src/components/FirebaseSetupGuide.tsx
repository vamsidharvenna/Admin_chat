import React from 'react';
import { AlertTriangle, ExternalLink, Copy } from 'lucide-react';

export const FirebaseSetupGuide: React.FC = () => {
  const [copiedStep, setCopiedStep] = React.useState<number | null>(null);

  const copyToClipboard = (text: string, stepNumber: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepNumber);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const configTemplate = `import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
            <div>
              <h2 className="text-lg font-semibold text-yellow-800">Firebase Configuration Required</h2>
              <p className="text-yellow-700 mt-1">
                Please set up Firebase to enable real-time chat functionality.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Firebase Setup Guide</h1>
            <p className="text-gray-600 mt-2">Follow these steps to configure Firebase for your admin dashboard</p>
          </div>

          <div className="p-6 space-y-8">
            {/* Step 1 */}
            <div className="flex">
              <div className="shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Firebase Project</h3>
                <p className="text-gray-600 mb-3">
                  Go to the Firebase Console and create a new project.
                </p>
                <a 
                  href="https://console.firebase.google.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700"
                >
                  Open Firebase Console <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex">
              <div className="shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Enable Firestore Database</h3>
                <p className="text-gray-600 mb-3">
                  In your Firebase project, go to "Firestore Database" and click "Create database". 
                  Choose "Start in test mode" for development.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex">
              <div className="shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Firebase Configuration</h3>
                <p className="text-gray-600 mb-3">
                  Go to Project Settings → General → Your apps → Add app (Web). 
                  Copy the Firebase configuration object.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex">
              <div className="shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Update Firebase Configuration</h3>
                <p className="text-gray-600 mb-3">
                  Replace the configuration in <code className="bg-gray-100 px-2 py-1 rounded">src/services/firebase.ts</code>:
                </p>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    {configTemplate}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(configTemplate, 4)}
                    className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded"
                    title="Copy code"
                  >
                    {copiedStep === 4 ? '✓' : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex">
              <div className="shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                5
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Set Up Firestore Security Rules</h3>
                <p className="text-gray-600 mb-3">
                  For development, you can use these basic rules (update for production):
                </p>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // For development only
    }
  }
}`}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // For development only
    }
  }
}`, 5)}
                    className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded"
                    title="Copy code"
                  >
                    {copiedStep === 5 ? '✓' : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              ⚠️ <strong>Important:</strong> The security rules above are for development only. 
              For production, implement proper authentication and authorization rules.
            </p>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">What's Next?</h3>
          <ul className="text-blue-800 space-y-1">
            <li>• Once configured, this setup screen will disappear</li>
            <li>• You'll see the admin dashboard with real-time chat functionality</li>
            <li>• Integrate with your website's chat widget or Dialogflow</li>
            <li>• Start receiving and responding to customer messages</li>
          </ul>
        </div>
      </div>
    </div>
  );
};