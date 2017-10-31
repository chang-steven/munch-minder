const express = require('express');
const app = express();

app.use(express.static('public'));
app.listen(process.env.PORT || 8080);
console.log(`App is listening on port ${process.env.PORT || 8080}`);
