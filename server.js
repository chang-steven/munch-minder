const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

app.use(morgan('dev'));
app.use(express.static('public'));

app.listen(process.env.PORT || 8080);
console.log(`App is listening on port ${process.env.PORT || 8080}`);

module.exports = {app};
