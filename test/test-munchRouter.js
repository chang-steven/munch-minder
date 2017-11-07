const chai = require('chai');
const chaiHttp = require('chai-http');
const should = require('chai').should();

const {app} = require('../server')

chai.use(chaiHttp);

describe('POST request to /api/user', function() {
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

describe('GET request to /api/user', function() {
  it('Should return all munches from database', function() {
    return chai.request(app)
    .get('/api/munches')
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.an('array');
    });

  it('Should return munch by ID', function() {
    return Munch.findOne()
    .then(search => {
      const searchId = search._id;
      return chai.request(app)
      .get(`/api/munches/${searchId}`)
    })
    .then(res => {
      res.should.have.status(200);
      res.should.be.json;
    });

  it('Should throw an error inputting incorrect ID', function() {
    return cha.request(app)
    .get('/api/munches/xxx')
    .catch(res => {
      res.should.have.status(500);
      res.should.be.json;
    })
  })
  })
  });
});
