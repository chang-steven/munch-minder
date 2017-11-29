const chai = require('chai');
const chaiHttp = require('chai-http');
const should = require('chai').should();

const {Munch} = require('../src/models/munch');
const {app, runServer, closeServer} = require('../src/server');
const {TEST_DATABASE_URL} = require('../src/config/main');

chai.use(chaiHttp);

describe('Munchy html pages', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });

  describe('Testing GET request of public static pages', function() {

    it('Should return index.html page', function() {
      return chai.request(app)
      .get('/')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.html;
      })
    });

    it('Should return dashboard.html page', function() {
      return chai.request(app)
      .get('/dashboard.html')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.html;
      })
    });

    it('Should return register.html page', function() {
      return chai.request(app)
      .get('/register.html')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.html;
      })
    });

    it('Should return munches.html page', function() {
      return chai.request(app)
      .get('/munches.html')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.html;
      })
    });

    it('Should return peeps.html page', function() {
      return chai.request(app)
      .get('/peeps.html')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.html;
      })
    });

    it('Should return settings.html page', function() {
      return chai.request(app)
      .get('/settings.html')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.html;
      })
    });
  });
});
