import '../App.css'
import SchemaList from './SchemaList';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  if (localStorage.getItem('accountUrl') === null) {
    return (
      <div className='App'>
        <h1>Welcome to your Dashboard</h1>
        <h2>Please connect to your Snowflake account</h2>
        <Link to="/">
          <button>Back to login</button>
        </Link>
      </div>
    );
  }
  else {
    return (
      <div className='App'>
        <h1>Welcome to your Dashboard</h1>
        <hr />
        <SchemaList />
      </div>
    );
  }
};
export default Dashboard;