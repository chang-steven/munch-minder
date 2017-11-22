const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/main');
const userRouter = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
userRouter.use(bodyParser.urlencoded({extended: false}));

userRouter.use(passport.initialize());
require('../config/passport')(passport);

mongoose.Promise = global.Promise;
const {User} = require('../models/user');
const {Munch} = require('../models/munch');


//POST request for new registration of a user to /api/user
userRouter.post('/user', jsonParser, (req, res) => {
  console.log('New registration request made');
  const requiredKeys = ["username", "email", "password"];
  requiredKeys.forEach( key => {
    if(!(key in req.body)) {
      const message = {message:`Please fill out all required fields.  Missing ${key} in request body, please try again.`};
      return res.status(400).json(message);
    }
  });
  User.find({username})
      .count()
      .then(count => {
        if (count > 0) {
          return Promise.reject({
            code: 422,
            reason: 'Validation Error',
            message: 'Username already taken'
          });
        }
      return User.create({
        userName: req.body.username,
        userEmail: req.body.email,
        password: req.body.password,
        joinDate: Date.now()
    })
  })
  .then(() => {
    const message = {message:`Successfully created user ${req.body.username}`};
    return res.status(200).json(message)
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({message: 'Sorry, something went wrong, please try again...'});
  })
});

//GET request for specific user and will return all munches
userRouter.get('/user/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findById(req.params.id)
    .populate('munches')
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      res.status(500).json({error: 'Unable to get specified user'});
    });
});

//PUT Request to update user data or user settings
userRouter.put('/user/:id', jsonParser, passport.authenticate('jwt', { session: false }), (req, res) => {
  let updatedUser = {};
  const updateFields = ['userName', 'userEmail', 'password'];
  updateFields.forEach( key => {
    if (key in req.body) {
      updatedUser[key] = req.body[key];
    };
  });
  if (!(req.user._id == req.params.id)) {
    return res.status(400).json({message: "Sorry, you do not have valid permission"})
  };
  User.findByIdAndUpdate(req.params.id, {$set: updatedUser})
  .then(result => {
    const message = {message: `Succesfully edited user data`};
    res.status(200).json(message);
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({message: 'Unable to update specified user'});
  });
});


//Delete Request to delete a specified user
userRouter.delete('/user/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (!(req.user._id == req.params.id)) {
    return res.status(400).json({message: "Sorry, you do not have valid permission"})
  };
  User.findByIdAndRemove(req.params.id)
  .then(() => {
    console.log(`Deleted user with id: ${req.params.id}`);
    res.status(204).json({message: 'success'});
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Unable to delete specified user'});
  });
});


//User login to create token
userRouter.post('/login', jsonParser, (req, res) => {
  User.findOne({userName: req.body.username})
  .then(foundUser => {
    foundUser.validatePassword(req.body.password)
    .then(() => {
      const token = jwt.sign({userId: foundUser._id}, config.JWT_SECRET, {expiresIn: config.JWT_EXPIRY});
      res.json({message:`Succesfully logged in as ${req.body.username}`, success: true, token: 'Bearer ' + token});
    })
    .catch(err => {
      console.error(err);
      res.json(err);
    })
  })
  .catch(err => {
    res.status(500).json({success:false, message: 'Authentication failed'});
    console.error('oops');
  });
});

//GET request if client forgot username or password, can find by email query
userRouter.get('/findbyemail', (req, res) => {
  User.findOne({userEmail: `${req.query.email}`})
  .then(result => {
    res.json(result);
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Unable to find user by email'});
  });
});



module.exports = {userRouter};
