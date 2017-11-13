const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('./config/main');
const userRouter = express.Router();


const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
userRouter.use(bodyParser.urlencoded({extended: false}));

userRouter.use(passport.initialize());
require('./config/passport')(passport);

mongoose.Promise = global.Promise;
const {User} = require('./models/user');
const {Munch} = require('./models/munch');



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
  User.create({
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
  .then(result => {
    res.json(result);
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Something went wrong'});
  });
});

userRouter.get('/:id', (req, res) => {
  User.findById(req.params.id)
  .then(result => {
    res.json(result);
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Something went wrong'});
  });
})

// GET request for all meals for specified User
userRouter.get('/:id', (req, res) => {
  User.findById(req.params.id)
  .aggregate([{
    $lookup: {
        from: 'Munches',
        localField: '_id',
        foreignField: 'userId',
        as: 'munches'
      }
    }])
  .then((result) => {
    console.log(result);
    res.json(result);
  })
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
});

userRouter.post('/authenticate', jsonParser, (req, res) => {
  User.findOne({userName: req.body.username})
  .then(foundUser => {
    foundUser.validatePassword(req.body.password)
    .then(() => {
      const token = jwt.sign({userId: foundUser._id}, config.JWT_SECRET, {expiresIn: config.JWT_EXPIRY});
      res.json({success: true, token: 'Bearer ' + token});
    })
    .catch(err => {
      console.error(err);
      res.send(err);
    })
  })
  .catch(err => {
    res.status(500).send({success:false, message: 'Authentication failed'});
    console.error('oops');
  });
});

// userRouter.get('/test/', passport.authenticate('jwt', { session: false }), (req, res) => {
//   res.send(`It worked!  User ID authenticated.  User id is ${req.user._id}`);
// });
//
// userRouter.get('/:id',passport.authenticate('jwt', { session: false }), (req, res) => {
//     User.findById(req.params.id)
//     .populate('friends', 'userName')
//     .then(result => {
//       res.json(result)
//     })
// })


module.exports = {userRouter};
