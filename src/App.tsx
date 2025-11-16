import './App.css';
import { Dashboard, ErrorBoundary } from './components';

function App ()
{
  return (
    <ErrorBoundary>
      <Dashboard />
    </ErrorBoundary>
  );
}

export default App
