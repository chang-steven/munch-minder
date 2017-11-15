const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const {User} = require('../models/user');
const {Munch} = require('../models/munch');
const munchesRouter = express.Router();

munchesRouter.use(passport.initialize());
munchesRouter.use(bodyParser.urlencoded({extended: false}));

munchesRouter.get('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({message:`It worked!  User ID authenticated.  User id is ${req.user._id}`});
});


// //GET request to return all munches from /api/munches
// munchesRouter.get('/', (req, res) => {
//    Munch.find()
//   .then(result => {
//     console.log('Found a munch');
//     res.json(result)
//   })
//   .catch(err => {
//     console.error(err);
//     res.status(500).json({error: 'Something went wrong'});
//   })
// });

//GET request for a specified munch based on ID
// munchesRouter.get('/:id', (req, res) => {
//   Munch.findById(req.params.id)
//   .then((result) => {
//     console.log('Found munch by ID');
//     res.json(result);
//   })
//   .catch(err => {
//     console.error(err);
//     res.status(500).json({error: 'Something went wrong'});
//   })
// })

// passport.authenticate('jwt', { session: false }),

//POST request to /api/user for creating new munch
munchesRouter.post('/', jsonParser, (req, res) => {
  const requiredKeys = ["date", "title", "description"];
  requiredKeys.forEach( key => {
    if(!(key in req.body)) {
      const message = {message:`Please fill out all required fields.  Missing ${key} in request body, please try again.`};
      return res.status(400).json(message);
    }
  });
  Munch
  .create({
    //Will need to eventually implement req.user._id
    // postedBy: req.user._id,
    title: req.body.title,
    date: req.body.date,
    description: req.body.description
  })
  .then(() => {
    const message = {message:`Successfully added ${req.body.type}`};
    return res.status(200).json(message);
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({message: 'Something went wrong'});
  })
});

munchesRouter.get('/:id', (req, res) => {
    User.findById(req.params.id)
    .populate('munches')
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Something went wrong'});
    });
});

//PUT request to update a specified munch based on id
munchesRouter.put('/:id', jsonParser, (req, res) => {
  let updatedMunch = {};
  const updateFields = ['date', 'title', 'description'];
  updateFields.forEach( key => {
    if (key in req.body) {
      updatedMunch[key] = req.body[key];
    };
  });
  Munch.findByIdAndUpdate(req.params.id, {$set: updatedMunch})
  .then(result => {
    const message = 'Succesfully edited munch data';
    res.status(200).json(result);
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Something went wrong'});
  });
});

//Delete request to delete a specified munch
munchesRouter.delete('/:id', (req, res) => {
  Munch.findByIdAndRemove(req.params.id)
  .then(() => {
    console.log(`Deleted user with id: ${req.params.id}`);
    res.status(204).json({message: 'success'});
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Something went wrong'});
  });
});

module.exports = {munchesRouter};
