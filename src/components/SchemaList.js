import './SchemaList.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { List, ListSubheader,ListItemButton } from '@mui/material';
import axios from 'axios';

const SchemaList = () => {
  const [setSchemaData] = useState([]);
  const [sortedSchemaData, setSortedSchemaData] = useState({});
  const [expanded, setExpanded] = useState([]);

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

  const handleToggle = (databaseName) => {
    if (expanded.includes(databaseName)) {
      setExpanded(expanded.filter((name) => name !== databaseName));
    } else {
      setExpanded([...expanded, databaseName]);
    }
  }

  return (
    <div>
      <h2>Schema List</h2>
      <hr />
      <div className='list'>
        {Object.values(sortedSchemaData).map((database, index) => (
          <div key={index}>
            <List>
              <ListItemButton onClick={() => handleToggle(database.database)}><h3>{database.database}</h3></ListItemButton>
              {expanded.includes(database.database) && (
                <ul>
                  {database.schemas.map((schema, index) => (
                    <List key={index} >
                      <ListItemButton component="a">
                        <Link to={'/data/' + database.database + '/' + schema} state={{database: database.database, schema: schema, query_type: 'tables'}}>
                          {schema}
                        </Link>
                      </ListItemButton>
                    </List>
                  ))}
                </ul>
              )}
            </List>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchemaList;
