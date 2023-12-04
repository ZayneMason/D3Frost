import React from 'react';
import TextField from '@material-ui/core/TextField';

const QueryBuilder = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TextField placeholder='Hi@@@'/>
      </form>
    </div>
  );
};

export default QueryBuilder;
