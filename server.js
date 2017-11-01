const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

app.use(morgan('common'));
app.use(express.static('public'));

// app.get('/', (req, res) => {
//   res.send('This is dashboard');
// });

app.get('/dashboard', (req, res) => {
  res.send('This is dashboard');
});

app.get('/munches', (req, res) => {
  res.send('This is munches');
});

app.get('/peeps', (req, res) => {
  res.send('This is peeps');
});

app.get('/settings', (req, res) => {
  res.send('This is settings');
});


app.listen(process.env.PORT || 8080);
console.log(`App is listening on port ${process.env.PORT || 8080}`);


module.exports = {app};
