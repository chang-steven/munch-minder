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
const {Avatar} = require('../models/avatar');


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
  User.create({
    userName: req.body.username,
    userEmail: req.body.email,
    password: req.body.password,
    joinDate: Date.now(),
    avatar: req.body.avatar
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
  let data = req.body;
  let userData = {};
  let keysArray = Object.keys(data)
  keysArray.forEach(key => {
    if (data[key] !== "") {
      userData[key] = data[key];
    }
  });
  if (!(req.user._id == req.params.id)) {
    return res.status(400).json({message: "Sorry, you do not have valid permission"})
  };
  User.findById(req.params.id)
  .then(result => {
    return result.validatePassword(req.body.currentPassword)
    .then(isPasswordCorrect => {
      if (!isPasswordCorrect) {
        throw new Error('Sorry, incorrect credentials.  Please try again.')
      }
      else {
        return User.findByIdAndUpdate(req.params.id, {$set: userData})
      }
    })
    .then(result => {
      const message = {message: `Succesfully edited user data, please log in.`};
      return res.status(200).json(message);
    })
  })
  .catch(err => {
    console.error(err);
    return res.status(500).json({message: 'Unable to update specified user'});
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
  .populate({
    path: 'avatar'
  })
  .then(foundUser => {
    return foundUser.validatePassword(req.body.password)
    .then((isPasswordCorrect) => {
      if(!isPasswordCorrect) {
        throw new Error('Sorry, incorrect credentials.  Please try again.');
      }
      else {
        const token = jwt.sign({userId: foundUser._id, avatarUrl: (foundUser.avatar ? foundUser.avatar.url : '/img/avatars/000-default.png')}, config.JWT_SECRET, {expiresIn: config.JWT_EXPIRY});
        res.json({message:`Succesfully logged in as ${req.body.username}`, success: true, token: 'Bearer ' + token});
      }
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
    let response = {message: `Username is ${result.userName}`,
    username: result.userName};
    res.json(response);
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({message: 'Unable to find user by email'});
  });
});

userRouter.get('/users/avatar', (req, res) => {
  Avatar.find()
  .then(result => {
    res.json(result);
  })
  .catch(err => {
    console.error('Unable to get avatars');
  })
})

//Updated a users avatar image
userRouter.patch('/user/:id', jsonParser, passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log(req.user._id);
  console.log(req.params.id);
  if (!(req.user._id == req.params.id)) {
    return res.status(400).json({message: "Sorry, you do not have valid permission"})
  };

  User.findByIdAndUpdate(req.user._id, {$set: {avatar: req.body.avatarId}}, {new: true})
  .then(updated => {
    res.json(updated);

  })
  .catch(err => {
    console.log('Error updating avatar')
    console.log(err);
  });
})


module.exports = {userRouter};
