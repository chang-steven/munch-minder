const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const should = require('chai').should();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


const {User} = require('../src/models/user');
const {Munch} = require('../src/models/munch');
const {app, runServer, closeServer} = require('../src/server');
const {TEST_DATABASE_URL, JWT_SECRET} = require('../src/config/main');
const {seedMunchMinderDatabase, generateUserData, generateMunchData, createTestUser, teardownDatabase} = require('./test-functions');

chai.use(chaiHttp);

describe('User Router to /api/user', function() {
  let testUser, testUserData;

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function(done) {
    testUserData = generateUserData();
    User.create(testUserData)
    .then(user => {
      testUser = user;
      seedMunchMinderDatabase()
      .then(() => done());
    })
    .catch(err => console.log(err))
  });

  afterEach(function() {
    return teardownDatabase();
  });

  after(function() {
    return closeServer();
  });

  describe('POST request to /api/user', function() {
    it('Should create a new user in the database', function() {
      let newUser = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password()
      };
      return chai.request(app)
      .post('/api/user')
      .send(newUser)
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.include.keys('message');
      });
    });
  });

  describe('GET request to /api/findbyemail', function() {
    it('Should return a user by email query parameter', function() {
      return User.findOne()
      .then(result => {
        return chai.request(app)
        .get(`/api/findbyemail?email=${result.userEmail}`);
      })
      .then(res => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.include.keys('message');
      });
    });
  });

  describe('PUT request to /api/user/:id', function() {
    let updatedUser;
    it('Should update a specified user based on ID', function() {
      updatedUser = {
        userName: faker.internet.userName(),
        currentPassword: testUserData.password
      }
      const token = jwt.sign({userId: testUser._id}, JWT_SECRET, { expiresIn: 10000 });
      return chai.request(app)
      .put(`/api/user/${testUser._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedUser)

      .then(res => {
        res.should.have.status(200);
        res.should.be.an('object');
        return User.findById(testUser._id);
      })
      .then(user => {
        user.userName.should.equal(updatedUser.userName);
      });
    });
  });

describe('DELETE request to /api/user/:id', function() {
  it('Should delete a specified user based on ID', function() {
    const token = jwt.sign({userId: testUser._id}, JWT_SECRET, { expiresIn: 10000 });
    return chai.request(app)
    .delete(`/api/user/${testUser._id}`)
    .set('Authorization', `Bearer ${token}`)
    .then(res => {
      res.should.have.status(204);
      return User.findById(testUser._id)
    })
    .then(user => {
      should.not.exist(user);
    });
  });
});

describe('POST request to /login', function() {
  it('Should login a user', function() {
    let loginUser = {
      username: testUserData.userName,
      password: testUserData.password
    }
    return chai.request(app)
    .post('/api/login')
    .send(loginUser)
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.include.keys('message', 'success', 'token');
    });
  });
});


});
