const express = require('express');

const PORT = process.env.PORT || 5000;

const app = express();

app.get('/', (req, res) => {
  res.send(`App is Running ya'll`);
});

app.listen(PORT, () => {
  console.log(`Running on port: ${PORT}`);
});
