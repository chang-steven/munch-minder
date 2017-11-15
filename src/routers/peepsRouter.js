const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/main');
const peepsRouter = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
peepsRouter.use(bodyParser.urlencoded({extended: false}));

peepsRouter.use(passport.initialize());
require('../config/passport')(passport);

mongoose.Promise = global.Promise;
const {User} = require('../models/user');
const {Munch} = require('../models/munch');
const {Group} = require('../models/group')

//Create a new group
peepsRouter.post('/groups', jsonParser, passport.authenticate('jwt', { session: false }), (req, res) => {
  Group.create({groupName: req.body.groupname})
  .then(() => {
    const message = `Successfully created group ${req.body.groupname}`;
    return res.send(message).status(200)
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Something went wrong'});
  })
})

peepsRouter.get('/groups', jsonParser, passport.authenticate('jwt', { session: false }), (req, res) => {
  Group.find()
  .then(results => {
    res.json(results)
  })
  .catch(err => {
  console.error(err);
  res.status(500).json({error: 'Something went wrong'});
  })
});

module.exports = {peepsRouter};
