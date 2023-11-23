import React, { useState } from 'react';
import axios from 'axios';

const SnowFlakeConnection = () => {
  const [formData, setFormData] = useState({
    accountUrl: '',
    account: '',
    username: '',
    password: ''
  });

  const { accountUrl, account, username, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await axios.post('http://localhost:5000/api/snowflake-connect',
      formData, 
      {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function (response) {
      alert(response.data);
      console.log(response.data);
    })
    .catch(function(error) {
      console.error(error);
    })
  };

  return (
    <form className='Snowflake-Connection-Form' onSubmit={handleSubmit} >
      <h1>Snowflake Credentials</h1>
      <input
        type="text"
        name="accountUrl"
        value={accountUrl}
        onChange={handleChange}
        placeholder="Account URL"
      />
      <input
        type="text"
        name="account"
        value={account}
        onChange={handleChange}
        placeholder="Account"
      />
      <input
        type="text"
        name="username"
        value={username}
        onChange={handleChange}
        placeholder="Username"
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={handleChange}
        placeholder="********"
      />
      <button type="submit">Submit</button>
      <body>{}</body>
    </form>
  );
};

export default SnowFlakeConnection;