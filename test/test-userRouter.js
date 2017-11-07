const chai = require('chai');
const chaiHttp = require('chai-http');
const should = require('chai').should();

const {User} = require('../models/user')
const {app} = require('../server')

chai.use(chaiHttp);

describe('POST request to /api/user', function() {
  it('Should create a new user in the database', function() {
    const newUser = {
      userName: "John316",
      userEmail: "john@doe.com",
      password: "test123"
    };
    return chai.request(app)
    .post('/api/user')
    .send(newUser)
    .then(function(res) {
      res.should.have.status(200);
    });
  });
});

describe('GET request to /api/user/:email', function() {
  it('Should return a user by email query', function() {
    return User.findOne()
    .then(result => {
      return chai.request(app)
      .get(`/api/user/${result.userEmail}`);
    })
    .then(res => {
      res.should.be.json;
    })
  })
})
