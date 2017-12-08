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

munchesRouter.use(passport.initialize());
require('../config/passport')(passport);

munchesRouter.use(bodyParser.urlencoded({extended: false}));

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: AWS_BUCKET,
        acl: 'public-read',
        metadata: function(req, file, cb) {
            cb(null, {
                fieldName: file.fieldname
            });
        },
        key: function(req, file, cb) {
            cb(null, file.originalname);
        }
    })
});

//POST request to /api/user for creating new munch
munchesRouter.post('/',
  passport.authenticate('jwt', { session: false }),
  jsonParser,
  upload.fields(
        [{
            name: 'imgFile',
            maxCount: 1
        }]
    ),
  (req, res) => {
  Munch
  .create({
    postedBy: req.user._id,
    userName: req.user.userName,
    date: req.body.date,
    title: req.body.title,
    userThumbsUp: req.body.thumb,
    description: req.body.description,
    image: (function() {
      if (req.files && req.files.imgFile) {
        return req.files.imgFile[0].location
      }
      else {
        return "/img/no-image.jpg"
      }
    })()
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
    res.status(204).json({message: 'Successfully Deleted Munch'});
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Unable to delete specified munch'});
  });
});

module.exports = {munchesRouter};
