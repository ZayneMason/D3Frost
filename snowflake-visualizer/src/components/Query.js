import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom"
import { createTheme, ThemeProvider } from '@mui/material';
import MaterialTable from 'material-table';
import './Query.css';


const Query = () => {
  const [queryResult, setQueryResult] = useState([]);
  const location = useLocation();
  const { state } = location;
  const theme = createTheme();
  
  console.log(Object.entries(state));
  useEffect(() => {
    axios.post('http://localhost:5000/api/snowflake-tables',
    {
      accoutUrl: localStorage.getItem('accountUrl'),
      account: localStorage.getItem('account'),
      username: localStorage.getItem('username'),
      password: localStorage.getItem('password'),
      database: Object.entries(state)[0][1],
      schema: Object.entries(state)[1][1]
    },
    {
      headers: {'Content-Type': 'application/json'}
    })
      .catch(error => console.error(error))
      .then(response => response.data)
      .then(data => setQueryResult(data));
      
  }, [setQueryResult, state]);
  
  console.log(queryResult[0] || 'No data');
  console.log(Object.values(queryResult))

  let columns = Object.keys(queryResult[0] || {}).map((key) => {
    return {
      title: key,
      field: key
    }
  });
  console.log(columns);

  return(
    <div>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
      <div className='container'>
        <div className='scroll_container' style={{maxWidth: '60%'}}>
        <ThemeProvider theme={theme}>
          <MaterialTable
            title="Query Results"
            columns={columns}
            data={queryResult || [{}]}
            options={{
              isLoading: true
            }}
          />
        </ThemeProvider>
        </div>
      </div>
    </div>
  );
};

export default Query;
