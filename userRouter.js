const express = require('express');
const userRouter = express.Router();
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
userRouter.use(bodyParser.urlencoded({extended: false}));


const {User} = require('./models/user');


userRouter.post('/', jsonParser, (req, res) => {
  console.log(req.body);
  console.log('New registration request made');
  const requiredKeys = ["userName", "email", "password"];
  requiredKeys.forEach( key => {
    if(!(key in req.body)) {
      const message = `Please fill out all required fields.  Missing ${key} in request body, please try again.`;
      return res.send(message).status(400);
    }
  });
  User
  .create({
    userName: req.body.userName,
    userEmail: req.body.email,
    password: req.body.password,
    joinDate: Date.now()
  })
  .then(() => {
    const message = `Successfully created user ${req.body.userName}`;
    return res.send(message).status(200)
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Something went wrong'});
  })
});

module.exports = {userRouter};
