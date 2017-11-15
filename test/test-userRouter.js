const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const should = require('chai').should();
const mongoose = require('mongoose');

const {User} = require('../src/models/user');
const {Munch} = require('../src/models/munch');
const {app, runServer, closeServer} = require('../src/server');
const {TEST_DATABASE_URL, JWT_SECRET} = require('../src/config/main');
const {seedMunchMinderDatabase, generateUserData, generateMunchData, createTestUser, teardownDatabase} = require('./test-functions');


chai.use(chaiHttp);

describe('User Router to /api/user', function() {
  let testUser;

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function(done) {
    createTestUser()
    .then((user) => {
      testUser = user;
      seedMunchMinderDatabase();
      done();
    })
  });

  afterEach(function() {
    return teardownDatabase();
  });

  after(function() {
    return closeServer();
  });

  describe('POST request to /api/user', function() {
    it('Should create a new user in the database', function() {
      return chai.request(app)
      .post('/api/user')
      .send(generateUserData())
      .then(function(res) {
        res.should.have.status(200);
      });
    });
  });

  describe('GET request to /api/findbyemail', function() {
    it('Should return a user by email query parameter', function() {
      return User.findOne()
      .then(result => {
        return chai.request(app)
        .get(`/api/findbyemail?userEmail=${result.userEmail}`);
      })
      .then(res => {
        res.should.be.json;
      });
    });
  });

  describe('PUT request to /api/user/:id', function() {
    it('Should update a specified user based on ID', function() {
      return User.findOne()
      .then(result => {
        testUser._id= result._id;
        return chai.request(app)
        .put(`/api/user/${result._id}`)
        .send(testUser)
      })
      .then(res => {
        res.should.have.status(200);
        res.should.be.an('object');
        return User.findById(testUser._id);
      })
      .then(user => {
        user.userEmail.should.equal(testUser.userEmail);
      });
    });
  });

  describe('DELETE request to /api/user/:id', function() {
    it('Should delete a specified user based on ID', function() {
      let deletedUser;
      User.findOne()
      .then(result => {
        deletedUser = result._id
        return chai.request(app)
        .delete(`/api/user/${result._id}`)
      })
      .then(res => {
        res.should.have.status(204);
        res.should.be.json;
        User.findById(deletedUser)
      })
      .then(user => {
        user.should.not.exist;
      });
    });
  });
});
