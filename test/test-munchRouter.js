const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const should = require('chai').should();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const {User} = require('../src/models/user');
const {Munch} = require('../src/models/munch');
const {app, runServer, closeServer} = require('../src/server');
const {TEST_DATABASE_URL, JWT_SECRET} = require('../src/config/main');
const {seedMunchMinderDatabase, generateUserData, generateMunchData, createTestUser, teardownDatabase} = require('./test-functions');

chai.use(chaiHttp);

describe('Munches Router to /api/munches', function() {
  let testUser;

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function(done) {
    createTestUser()
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


  describe('POST request to /api/munches', function() {
    it('Should create a new munch in the database', function() {
      const token = jwt.sign({userId: testUser._id}, JWT_SECRET, { expiresIn: 10000 });
      let newMunch = generateMunchData();
      return chai.request(app)
      .post('/api/munches')
      .set('Authorization', `Bearer ${token}`)
      .send(newMunch)
      .then(function(res) {
        res.should.have.status(200);
      });
    });
  });

  describe('GET request to /api/munches/', function() {
    it('Should return all munches from database for the logged in user', function() {
      const token = jwt.sign({userId: testUser._id}, JWT_SECRET, { expiresIn: 10000 });
      return chai.request(app)
      .get('/api/munches')
      .set('Authorization', `Bearer ${token}`)
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.an('object');
        res.body.munches.should.be.an('array');
      });
    });

    it('Should return a specific munch by ID', function() {
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
      })
    });
  });

  describe('PUT request to /api/munches/:id', function() {
    it('Should update a specified munch based on ID', function() {
      let testMunch = {
        title: faker.lorem.word(),
        description: faker.lorem.words(),
        date: faker.date.past()
      };
      return Munch.findOne()
      .then(result => {
        testMunch._id = result._id;
        return chai.request(app)
        .put(`/api/munches/${result._id}`)
        .send(testMunch)
      })
      .then(res => {
        res.should.have.status(200);
        res.should.be.an('object');
        return Munch.findById(testMunch._id);
      })
      .then(munch => {
        munch.title.should.equal(testMunch.title);
        munch.description.should.equal(testMunch.description);
      });
    });
  });

  describe('DELETE request to /api/munches/:id', function() {
    it('Should delete a specified munch based on ID', function() {
      let deletedMunch;
      const token = jwt.sign({userId: testUser._id}, JWT_SECRET, { expiresIn: 10000 });
      return Munch.findOne()
      .then(result => {
        deletedMunch = result._id;
        return chai.request(app)
        .delete(`/api/munches/${result._id}`)
        .set('Authorization', `Bearer ${token}`)
      })
      .then(res => {
        res.should.have.status(204);
        return Munch.findById(deletedMunch)
      })
      .then(munch => {
        should.not.exist(munch);
      });
    });
  });
});
