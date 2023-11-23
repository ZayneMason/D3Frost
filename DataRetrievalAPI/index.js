// Express setup
let express = require('express');
let app = express();
let router = express.Router();
app.use('/api/', router);

// Import Snowflake SDK and create a connection object and connection pool object
var snowflake = require('snowflake-sdk');

function createSnowflakeConnection(account, accessUrl, username, password) {
  return snowflake.createConnection({
    account: account,
    accessUrl: accessUrl,
    username: username,
    password: password,
  });
}

function createSnowflakeConnectionPool(account, accessUrl, username, password, min, max) {
  return snowflake.createPool( 
    {
      account: account,
      accessUrl: accessUrl,
      username: username,
      password: password,
    }, 
    { 
      min: 1,
      max: 2,
    });
}

async function testConnection() { await snowflakeConnection.isValidAsync(); }

// POST to connect to Snowflake
router.post('/snowflake-connect', function(req, res, next) {
  const snowflakeConnection = createSnowflakeConnection(req.body.account, req.body.accessUrl, req.body.username, req.body.password);
  snowflakeConnection.connect(function(err, conn) {
    console.log('Connecting to Snowflake...')
    if (err) {
        res.send('Unable to connect: ' + err.message);
    } else {
        let connectionID = conn.getId();
        res.send('Successfully connected to Snowflake. Connection ID: ' + connectionID + '.');
    }
  });
});

// POST to test Snowflake connection
router.post('/snowflake-test', function(req, res, next) {
  if (testConnection()) {
    res.send('Connection is valid!');
  }
  else {
    res.send('Connection is not valid!');
  }
});

// POST to get list of databases
router.post('/snowflake-databases', function(req, res, next) {
  const snowflakeConnectionPool = createSnowflakeConnectionPool(req.body.account, req.body.accessUrl, req.body.username, req.body.password, req.body.min, req.body.max);
  snowflakeConnectionPool.use(async (clientConnection) =>
  {
    const statement = await clientConnection.execute({
        sqlText: 'show terse schemas;',
        complete: function (err, stmt, rows)
        {
            resultRows = '';
            if (err)
            {
                res.send('Failed to execute statement due to the following error: ' + err.message);
            }
            res.send(rows);
        }
    });
  });
  }
);

// POST to send a query to Snowflake
router.post('/snowflake-query', function(req, res, next) {
  const snowflakeConnectionPool = createSnowflakeConnectionPool(req.body.account, req.body.accessUrl, req.body.username, req.body.password, req.body.min, req.body.max);
  snowflakeConnectionPool.use(async (clientConnection) =>
{
    const statement = await clientConnection.execute({
        sqlText: 'select * from TPCDS_SF100TCL.CALL_CENTER ;',
        complete: function (err, stmt, rows)
        {
            resultRows = '';
            if (err)
            {
                res.send('Failed to execute statement due to the following error: ' + err.message);
            }
            res.send(rows);
        }
    });
  });
});

var server = app.listen(5000, function() {
  console.log('Node server is running on http://localhost:5000..');
});