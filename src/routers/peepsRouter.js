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

//GET request for friends of logged in user
peepsRouter.get('/peeps/', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findById(req.user._id)
  .populate({
    path : 'friends',
    populate: {path: 'avatar'}
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
  .populate({
    path : 'friends',
    populate : {path : 'munches',
                populate : {path: 'postedBy',
                            select: "_id userName"}}
  })
  .then(result => {
    const allMunches = result.friends.map(a => a.munches)
                             .reduce((a, b) => (a.concat(b)), [])
                             .sort((a, b) => {
                               let c = new Date(a.date);
                               let d = new Date(b.date);
                               return c > d ? -1 : c < d ? 1 : 0;
                             });
    res.json(allMunches);
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Unable to get update from friends'});
  });
})

//GET a specific friend by ID and display their munches
peepsRouter.get('/peep/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findById(req.params.id)
  .populate({
    path : 'munches',
    options: {sort: { 'date': -1}},
    populate: {path: 'postedBy',
               select: '_id userName'}
  })
  .then(result => {
    res.json(result)
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Unable to get update from friends'});
  });
})

//GET and find a friend by email
peepsRouter.get('/peeps/findbyemail', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.find({userEmail: `${req.query.email}`})
  .populate({path: 'avatar'})
  .then(result => {
    res.json(result);
  })
  .catch( err => {
    res.status(500).json({error: 'Unable to find any users by email'});
  });
});

//Add friend to logged in user
peepsRouter.post('/peeps/add-friend', jsonParser, passport.authenticate('jwt', { session: false }), (req, res) => {
  let numFriends;
  if (req.user._id == req.body.friendId){
    return res.status(500).json({message: "Unable to add self."});
  }
      User.findById(req.user._id)
      .then(userData => {
        numFriends = userData.friends.length;
        return User.findByIdAndUpdate(req.user._id, { $addToSet: { friends: req.body.friendId } }, { new: true })
      })
        .then((updated) => {
          if (numFriends == updated.friends.length) {
             res.json({message: "Looks like you're already friends"});
           }
           else {
             res.json({message: 'Successfully added friend!'});
        }
        })
        .catch(err => {
          console.log('Caught an error adding friend')
          console.log(err);
        });
    });

module.exports = {peepsRouter};
