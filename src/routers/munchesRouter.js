const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const {User} = require('../models/user');
const {Munch} = require('../models/munch');
const munchesRouter = express.Router();

const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const {AWS_BUCKET} = require('../config/main')


const s3 = new AWS.S3();
// {apiVersion: '2016-04-01'}

munchesRouter.use(passport.initialize());
require('../config/passport')(passport);

munchesRouter.use(bodyParser.urlencoded({extended: false}));

munchesRouter.get('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({message:`It worked!  User ID authenticated.  User id is ${req.user._id}`});
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: AWS_BUCKET,
        metadata: function(req, file, cb) {
            cb(null, {
                fieldName: file.fieldname
            });
        },
        key: function(req, file, cb) {
            cb(null, file.originalname + '-' + Date.now().toString());
        }
    })
});

//POST request to /api/user for creating new munch
munchesRouter.post('/',
  jsonParser,
  passport.authenticate('jwt', { session: false }),
  upload.fields(
        {
            name: 'imgFile',
            maxCount: 1
        }
    ),
  (req, res) => {
  const requiredKeys = ["date", "title", "description"];
  requiredKeys.forEach( key => {
    if(!(key in req.body)) {
      const message = {message:`Please fill out all required fields.  Missing ${key} in request body, please try again.`};
      return res.status(400).json(message);
    }
  });
  Munch
  .create({
    postedBy: req.user._id,
    userName: req.user.userName,
    date: req.body.date,
    title: req.body.title,
    userThumbsUp: req.body.userThumbsUp,
    description: req.body.description
  })
  .then(result => {
    return User.findByIdAndUpdate(req.user._id, { $push: { munches: result._id } }, { new: true });
  })
  .then((result) => {
    const message = {message:`Successfully added ${req.body.title}`};
    return res.status(200).json(message);
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({message: 'Something went wrong, unable to create munch'});
  })
});

//Get request for all munches for logged in user
munchesRouter.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findById(req.user._id)
  .populate({
    path: 'munches avatar',
    options: {sort: { 'date': -1}}
  })
  .then(result => {
    res.json(result)
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Unable to get all munches for user'});
  });
})

//GET request for specific munch by munch ID
munchesRouter.get('/:id', (req, res) => {
    Munch.findById(req.params.id)
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      res.status(500).json({error: 'Unable to get specified munch'});
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
  Munch.findByIdAndUpdate(req.params.id, {$set: updatedMunch}, {new: true})
  .then(result => {
    const message = 'Succesfully edited munch data';
    res.status(200).json(result);
  })
  .catch(err => {
    res.status(500).json({error: 'Unable to updated specified user'});
  });
});

//Delete request to delete a specified munch
munchesRouter.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Munch.findByIdAndRemove(req.params.id)
  .then(() => {
    // req.user._id
    console.log(`Deleted munch with id: ${req.params.id}`);
    res.status(204).json({message: 'success'});
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Unable to delete specified munch'});
  });
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


module.exports = {munchesRouter};
