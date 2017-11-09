const express = require('express');
const munchesRouter = express.Router();
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
munchesRouter.use(bodyParser.urlencoded({extended: false}));

const {Munch} = require('./models/munch');

//GET request to return all munches from /api/munches
munchesRouter.get('/', (req, res) => {
   Munch.find()
  .then(result => {
    console.log('Found a munch');
    res.json(result)
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Something went wrong'});
  })
});

//GET request for a specified munch based on ID
munchesRouter.get('/:id', (req, res) => {
  Munch.findById(req.params.id)
  .then((result) => {
    console.log('Found munch by ID');
    res.json(result);
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Something went wrong'});
  })
})

//GET request for all meals for specified User
// userRouter.get('/:id', (req, res) => {
//   User.findById(req.params.id)
//   .populate('')
// })


//POST request to /api/user for creating new munch
munchesRouter.post('/', jsonParser, (req, res) => {
  const requiredKeys = ["date", "type", "description"];
  requiredKeys.forEach( key => {
    if(!(key in req.body)) {
      const message = `Please fill out all required fields.  Missing ${key} in request body, please try again.`;
      return res.send(message).status(400);
    }
  });
  Munch
  .create({
    date: req.body.date,
    type: req.body.type,
    description: req.body.description
  })
  .then(() => {
    const message = `Successfully added ${req.body.type}`;
    return res.send(message).status(200)
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Something went wrong'});
  })
});

//PUT request to update a specified munch based on id
munchesRouter.put('/:id', jsonParser, (req, res) => {
  console.log('Put request made');
  console.log(req.body);
  let updatedMunch = {};
  const updateFields = ['date', 'type', 'description'];
  updateFields.forEach( key => {
    if (key in req.body) {
      updatedMunch[key] = req.body[key];
    };
  });
  console.log('Now finding by id and update');
  console.log(updatedMunch);
  console.log(req.params.id);
  Munch.findByIdAndUpdate(req.params.id, {$set: updatedMunch})
  .then(result => {
    console.log(result);
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
