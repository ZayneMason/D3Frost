// Express setup
let express = require('express');
var app = express();
var cors = require('cors');
app.use(cors({origin: '*'}))
let router = express.Router();
app.use(express.json());
app.use('/api/', router);

// Import Snowflake SDK and define functions for creating connections and connection pools
var snowflake = require('snowflake-sdk');

function createSnowflakeConnection(account, accessUrl, username, password) {
  return snowflake.createConnection({
    account: account,
    accessUrl: accessUrl,
    username: username,
    password: password,
  });
}

function createSnowflakeConnectionPool(account, accessUrl, username, password) {
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
        res.redirect('/dashboard');
    }
  });
});

// POST to test Snowflake connection
router.post('/snowflake-test', function(req, res, next) {
  const snowflakeConnection = createSnowflakeConnection(req.body.account, req.body.accessUrl, req.body.username, req.body.password);
  async function testConnection() { await snowflakeConnection.isValidAsync(); }
  if (testConnection()) {
    res.send('Connection is valid!');
  }
  else {
    res.send('Connection is not valid!');
  }
});

// POST to get list of databases/schemas in Snowflake
router.post('/snowflake-schema', function(req, res, next) {
  const snowflakeConnectionPool = createSnowflakeConnectionPool(req.body.account, req.body.accessUrl, req.body.username, req.body.password);
  snowflakeConnectionPool.use(async (clientConnection) =>
  {
    await clientConnection.execute({
        sqlText: 'show terse schemas;',
        complete: function (err, stmt, rows)
        {
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
  const snowflakeConnectionPool = createSnowflakeConnectionPool(req.body.account, req.body.accessUrl, req.body.username, req.body.password);
  snowflakeConnectionPool.use(async (clientConnection) =>
  {
    await clientConnection.execute({
        sqlText: 'select * from ' + req.body.database + '.' + req.body.schema + '.' + req.body.table + ';',
        complete: function (err, stmt, rows)
        {
            if (err)
            {
                res.send('Failed to execute statement due to the following error: ' + err.message);
            }
            res.send(rows);
        }
    });
  });
});

router.post('/snowflake-tables', function(req, res, next) {
  const snowflakeConnectionPool = createSnowflakeConnectionPool(req.body.account, req.body.accessUrl, req.body.username, req.body.password);
  snowflakeConnectionPool.use(async (clientConnection) =>
  {
    await clientConnection.execute({
      sqlText: 'USE ' + req.body.database + ';',
      complete: function (err, stmt, rows)
      {
          if (err)
          {
              res.send('Failed to execute statement due to the following error: ' + err.message);
          }
          else {
            clientConnection.execute({
            sqlText: 'SHOW TABLES IN ' + req.body.database + '.' + req.body.schema + ';',
            complete: function (err, stmt, rows)
            {
                if (err)
                {
                    res.send('Failed to execute statement due to the following error: ' + err.message);
                }
                res.send(rows);
            }
            });
          }
      }
    });
  });
});

app.listen(5000, function() {
  console.log('Node server is running on http://localhost:5000..');
});