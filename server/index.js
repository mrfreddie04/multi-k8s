const keys = require('./keys');

//Express App Setup
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

//Postgres Client Setup
const { Pool } = require('pg');
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});

pgClient.on('error', () => console.log('Lost PG connection'));

//create 'values' table
pgClient.on('connect', (client) => {
  console.log('Connected to PG');
  client
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch((err) => console.error(err));
});

//Redis Client Setup
const redis = require('redis');
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

//Express route handler
app.get('/', (req, res) => {
  res.send('Test 1,2,3')
});

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * FROM values');
  //query results also include query stats information, but we only want data
  res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
  //values - also include query stat information
  redisClient.hgetall('values', (err, values) => {
    if(err) return res.status(500).send({error: err.message})
    res.send(values);
  });
});

app.post('/values', async (req, res) => {
  const index = req.body.index;
  if(index > 40) {
    return res.status(422).send({error: 'Index too high'});
  }

  redisClient.hset('values', index, 'Nothing yet!');
  redisPublisher.publish('insert', index); //message=insert

  await pgClient.query('INSERT INTO values (number) VALUES ($1)', [index]); 	

  //query results also include query stats information, but we only want data
  res.send({working: true});
});

app.listen(5000, () => {
  console.log("Listening on port 5000");
});