const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const should = require('chai').should();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


const {User} = require('../src/models/user');
const {Munch} = require('../src/models/munch');
const {Group} = require('../src/models/group');
const {app, runServer, closeServer} = require('../src/server');
const {TEST_DATABASE_URL, JWT_SECRET} = require('../src/config/main');
const {seedMunchMinderDatabase, generateUserData, generateMunchData, createTestUser, teardownDatabase} = require('./test-functions');

chai.use(chaiHttp);

describe('Peeps Router to /api/peeps or /api/groups', function() {
  let testUser;

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function(done) {
    createTestUser()
    .then((user) => {
      testUser = user;
      return seedMunchMinderDatabase();
      done();
    })
  });

  afterEach(function() {
    return teardownDatabase();
  });

  after(function() {
    return closeServer();
  });

  describe('GET request to /api/peeps', function() {

  });
});
