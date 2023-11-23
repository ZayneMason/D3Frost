import axios from 'axios';
import './App.css';
import SnowFlakeConnection from './components/SnowFlakeConnection';


function App() {

  return (
    <div className="App">
      <header className="App-header">
        <SnowFlakeConnection />
      </header>
    </div>
  );
}

export default App;
