const express = require('express');
const userRouter = express.Router();
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
userRouter.use(bodyParser.urlencoded({extended: false}));

const {User} = require('./models/user');


//POST request for new registration of a new user to /api/user
userRouter.post('/', jsonParser, (req, res) => {
  console.log('New registration request made');
  const requiredKeys = ["username", "email", "password"];
  requiredKeys.forEach( key => {
    if(!(key in req.body)) {
      const message = `Please fill out all required fields.  Missing ${key} in request body, please try again.`;
      return res.send(message).status(400);
    }
  });
  User
  .create({
    userName: req.body.username,
    userEmail: req.body.email,
    password: req.body.password,
    joinDate: Date.now()
  })
  .then(() => {
    const message = `Successfully created user ${req.body.username}`;
    return res.send(message).status(200)
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Something went wrong'});
  })
});

//GET request if client forgot username or password, can find by email query
userRouter.get('/findbyemail', (req, res) => {
  User.findOne({userEmail: `${req.query.email}`})
  .then((result) => {
    res.json(result);
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Something went wrong'});
  });
});

//PUT Request to update user data or user settings
userRouter.put('/:id', jsonParser, (req, res) => {
  let updatedUser = {};
  const updateFields = ['userName', 'userEmail', 'password'];
  updateFields.forEach( key => {
    if (key in req.body) {
      updatedUser[key] = req.body[key];
    };
  });
  User.findByIdAndUpdate(req.params.id, {$set: updatedUser})
  .then(result => {
    const message = 'Succesfully edited user data';
    res.status(200).json(result);
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Something went wrong'});
  });
});

//Delete Request to delete a specified user
userRouter.delete('/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id)
  .then(() => {
    console.log(`Deleted user with id: ${req.params.id}`);
    res.status(204).json({message: 'success'});
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Something went wrong'});
  });
})

module.exports = {userRouter};
