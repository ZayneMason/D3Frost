import './SchemaList.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SchemaList = () => {
  const [setSchemaData] = useState([]);
  const [sortedSchemaData, setSortedSchemaData] = useState({});
  useEffect(() => {
    axios.post('http://localhost:5000/api/snowflake-schema', 
    {
      accountUrl: localStorage.getItem('accountUrl'),
      account: localStorage.getItem('account'),
      username: localStorage.getItem('username'),
      password: localStorage.getItem('password')
    },
    {
      headers: {
          'Content-Type': 'application/json'
      }
    })
      .then(response => response.data)
      .then(data => {
        setSchemaData.push(data);
        const sortedData = {};
        data.forEach(schema => {
          if (!sortedData[schema.database_name]) {
            sortedData[schema.database_name] = { database: schema.database_name, schemas: [] };
          }
          sortedData[schema.database_name].schemas.push(schema.name);
          localStorage.schema = sortedData;
        });
        setSortedSchemaData(sortedData);
      })
      .catch(error => console.log(error));
  }, [setSchemaData, setSortedSchemaData]);


  

  return (
    <div>
      <h2>Schema List</h2>
      <hr />
        <div className='list'>
          {Object.values(sortedSchemaData).map((database, index) => (
            <div key={index}>
              <ul>
                <h3>{database.database}</h3>
                <ul>
                  {database.schemas.map((schema, index) => (
                   <a href={'/data/' + database.database + '/' + schema}><li key={index}>{schema}</li></a>
                  ))}
                </ul>
              </ul>
            </div>
          ))}
        </div>
    </div>
  );
};

export default SchemaList;
