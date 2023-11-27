import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom"

const Query = () => {
  const [queryResult, setQueryResult] = useState([]);
  const location = useLocation()
  
  useEffect(() => {
    axios.post('http://localhost:5000/api/snowflake-tables',
    {
      accoutUrl: localStorage.getItem('accountUrl'),
      account: localStorage.getItem('account'),
      username: localStorage.getItem('username'),
      password: localStorage.getItem('password'),
      database: 'SNOWFLAKE_SAMPLE_DATA',
      schema: 'TPCH_SF10',
      
    },
    {
      headers: {'Content-Type': 'application/json'}
    })
      .then(response => response.data)
      .then(data => setQueryResult(data))
      .catch(error => console.error(error));
  }, [setQueryResult, location]);
  
  console.log(queryResult);
  return (
    <div>
      <h1>Query Results</h1>
      <table>
        <thead>
          <tr>
            {Object.keys(queryResult).map((key, index) => (
              <th key={index}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(queryResult).map((result, index) => (
            <tr key={index}>
              {Object.values(result).map((value, index) => (
                Object.values(value).map((value, index) =>{
                <td key={index}>{value}</td>
                })
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Query;
