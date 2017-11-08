const chai = require('chai');
const chaiHttp = require('chai-http');
const should = require('chai').should();

const {Munch} = require('../models/munch')
const {app} = require('../server')

chai.use(chaiHttp);

describe('POST request to /api/munches', function() {
  it('Should create a new munch in the database', function() {
    const newMunch = {
      date: "10/25/17",
      type: "Munch",
      description: "In 'n Out cheeseburger meal'"
    };
    return chai.request(app)
    .post('/api/munches')
    .send(newMunch)
    .then(function(res) {
      res.should.have.status(200);
    });
  });
});

describe('GET request to /api/munches', function() {
  it('Should return all munches from database', function() {
    return chai.request(app)
    .get('/api/munches')
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.an('array');
    });
  });
  it('Should return munch by ID', function() {
    Munch.findOne()
    .then(search => {
      const searchId = search._id;
      return chai.request(app)
      .get(`/api/munches/${search._id}`)
    })
    .then(res => {
      res.should.have.status(200);
      res.should.be.json;
    });
  });
  it('Should throw an error inputting incorrect ID', function() {
    return chai.request(app)
    .get('/api/munches/xxx')
    .catch(error => {
      error.should.have.status(500);
      // error.should.be.an('object');
      // res.body.should.be.an('object');
    })
  });
});

describe('PUT request to /api/munches/:id', function() {
  it('Should update a specified munch based on ID', function() {
    let testMunch = {
      date: "10/25/17",
      type: "Meal",
      description: "McDonald's Happy Meal"
  };
    return Munch.findOne()
    .then(result => {
      testMunch.Id = result._id;
      return chai.request(app)
        .put(`/api/munches/${result._id}`)
        .send(testMunch)
      })
    .then(res => {
      res.should.have.status(200);
      res.should.be.an('object');
      return Munch.findById(testMunch.Id);
    })
    .then(munch => {
      console.log(munch);
      // munch.date.should.equal(testMunch.date);
      munch.type.should.equal(testMunch.type);
      munch.description.should.equal(testMunch.description);
    });
  });
});

describe('DELETE request to /api/munches/:id', function() {
  it('Should delete a specified munch based on ID', function() {
    let deletedMunch;
    Munch.findOne()
    .then(result => {
      deletedMunch = result._id
      return chai.request(app)
      .delete(`/api/munches/${result._id}`)
    })
    .then(res => {
      res.should.have.status(204);
      res.should.be.json;
      Munch.findById(deletedMunch)
    })
    .then(munch => {
      munch.should.not.exist;
    });
  });
});
