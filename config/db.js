const config = require('config');
const mongoose = require('mongoose');
const db = config.get('mongoURI');

const conncetDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('MongoDB Connected.');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = conncetDB;
