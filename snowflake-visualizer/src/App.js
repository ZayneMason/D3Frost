import { useEffect } from 'react';
import './App.css';
import SnowFlakeConnection from './components/SnowFlakeConnection';


function App() {
  useEffect(() => {
    if (localStorage.getItem('accountUrl') === null) {
      window.location.href = '/login';
    }
    else {
      window.location.href = '/dashboard';
    }
  }
  , []);

  return (
    <div className="App">
      <header className="App-header">
        <SnowFlakeConnection />
      </header>
    </div>
  );
}

export default App;
