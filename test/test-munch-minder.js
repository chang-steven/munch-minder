const chai = require('chai');
const chaiHttp = require('chai-http');
const should = require('chai').should();

const {Munch} = require('../models/munch')
const {app} = require('../server')

chai.use(chaiHttp);

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
