import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom"
import { createTheme, ThemeProvider } from '@mui/material';
import MaterialTable from 'material-table';
import './Query.css';


const Schema = () => {
  const [queryResult, setQueryResult] = useState([]);
  const location = useLocation();
  const { state } = location;
  const theme = createTheme();
  
  console.log(Object.entries(state));
  useEffect(() => {
    axios.post('http://localhost:5000/api/snowflake-' + Object.entries(state)[2][1],
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
  
  let columns = Object.keys(queryResult[0] || {}).map((key) => {
    return {
      title: key,
      field: key
    }
  });

  let options = () => {
    if (Object.values(queryResult).length > 0) {
      return {
        isLoading: false,
        search: true,
        exportAllData: true,
        exportButton: true,
        exportFileName: 'query_results'
      }
    }
    else {
      return {
        isLoading: true,
        exportAllData: false,
        emptyDataSourceMessage: 'No data to display'
      }
    }
  }

  return(
    <div className='container'>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
      <div className='scroll_container' style={{maxWidth: '60%', minWidth: '60%'}}>
        <ThemeProvider theme={theme}>
          <MaterialTable
            title={Object.entries(state)[0][1]}
            columns={columns}
            data={queryResult || [{}]}
            options={options()}
          />
        </ThemeProvider>
      </div>
    </div>
  );
};

export default Schema;
