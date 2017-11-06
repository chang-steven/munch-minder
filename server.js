const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const {userRouter} = require('./userRouter');
const {munchesRouter} = require('./munchesRouter');

const {DATABASE_URL, PORT} = require('./config/main');
const app = express();

app.use(morgan('dev'));
app.use(express.static('public'));

mongoose.Promise = global.Promise;
mongoose.connect(DATABASE_URL, {useMongoClient: true})

app.use('/api/user', userRouter);
app.use('/api/munches', munchesRouter);


app.listen(process.env.PORT || 8080);
console.log(`App is listening on port ${process.env.PORT || 8080}`);

module.exports = {app};
