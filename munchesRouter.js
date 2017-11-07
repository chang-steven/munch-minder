const express = require('express');
const munchesRouter = express.Router();
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
munchesRouter.use(bodyParser.urlencoded({extended: false}));


const {Munch} = require('./models/munch');

munchesRouter.get('/', (req, res) => {
  return Munch.find()
  .then(result => {
    console.log('Found a munch');
    res.json(result)
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Something went wrong'});
  })
});

munchesRouter.get('/:id', (req, res) => {
  Munch.findById(req.params.id)
  .then((result) => {
    console.log('Found munch by ID');
    res.json(result);
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Something went wrong'});
  })
})


munchesRouter.post('/', jsonParser, (req, res) => {
  const requiredKeys = ["date", "type", "description"];
  requiredKeys.forEach( key => {
    if(!(key in req.body)) {
      const message = `Please fill out all required fields.  Missing ${key} in request body, please try again.`;
      return res.send(message).status(400);
    }
  });
  Munch
  .create({
    date: req.body.date,
    type: req.body.type,
    description: req.body.description
  })
  .then(() => {
    const message = `Successfully added ${req.body.type}`;
    return res.send(message).status(200)
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Something went wrong'});
  })
});


module.exports = {munchesRouter};
