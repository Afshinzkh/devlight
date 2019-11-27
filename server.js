const express = require('express');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
const app = express();

connectDB();

app.get('/', (req, res) => {
  res.send(`App is Running ya'll`);
});

// use express json parser
app.use(express.json());

// API Routes
app.use('/auth', require('./routes/api/auth'));
app.use('/profiles', require('./routes/api/profiles'));
app.use('/posts', require('./routes/api/posts'));
app.use('/users', require('./routes/api/users'));

app.listen(PORT, () => {
  console.log(`Running on port: ${PORT}`);
});
