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

peepsRouter.get('/peeps/', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findById(req.user._id)
  // .populate('friends')
  // .populate('munches')

  .populate({
    path : 'friends',
  })
  .then(result => {
    res.json(result);
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Unable to get friends'});
  });
})


//GET request for 15 most recent updates from friends
peepsRouter.get('/peeps/munches', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findById(req.user._id)
  // .populate('friends')
  // .populate('munches')

  .populate({
    path : 'friends',
    select : 'userName',
    populate : {path : 'munches'}
  })
  // .populate('munches')
  .then(result => {
    // console.log(result);
    const allMunches = result.friends.map(a => a.munches)
                             .reduce((a, b) => (a.concat(b)), [])
                             .sort((a, b) => a.date < b.date);
    res.json(allMunches);
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Unable to get update from friends'});
  });
})


peepsRouter.get('/peeps', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findById(req.user._id)
  // .populate('friends')
  // .populate('munches')

  .populate({
    path : 'friends',
    select : 'userName',
    populate : {path : 'munches', options: {sort: { 'date': -1}}}
  })
  // .populate('munches')
  .then(result => {
    res.json(result)
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Unable to get update from friends'});
  });
})

peepsRouter.get('/peeps/findbyemail', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.find({userEmail: `${req.query.email}`})
  .then(result => {
    res.json(result);
  })
  .catch( err => {
    res.status(500).json({error: 'Unable to find any users by email'});
  });
});

peepsRouter.post('/peeps/add-friend', jsonParser, passport.authenticate('jwt', { session: false }), (req, res) => {
        User.findByIdAndUpdate(req.user._id, { $push: { friends: req.body.friendId } }, { new: true })
        .then(updated => res.json(updated));
    });

module.exports = {peepsRouter};
