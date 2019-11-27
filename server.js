const express = require('express');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
const app = express();

connectDB();

app.get('/', (req, res) => {
  res.send(`App is Running ya'll`);
});

app.listen(PORT, () => {
  console.log(`Running on port: ${PORT}`);
});
