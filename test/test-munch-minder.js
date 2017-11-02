const chai = require('chai');
const chaiHttp = require('chai-http');
const should = require('chai').should();
// const mongoose = require('mongoose');

const {app} = require('../server')

chai.use(chaiHttp);

describe('GET "/" endpoint', function() {
  it('Should return index.html from public folder', function() {
    return chai.request(app)
    .get('/')
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.html;
    })
  });
});

describe('GET "/dashboard.html" endpoint', function() {
  it('Should return html page', function() {
    return chai.request(app)
    .get('/dashboard.html')
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.html;
    })
  });
});

describe('GET "/register.html" endpoint', function() {
  it('Should return html page', function() {
    return chai.request(app)
    .get('/register.html')
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.html;
    })
  });
});

describe('GET "/munches.html" endpoint', function() {
  it('Should return html page', function() {
    return chai.request(app)
    .get('/munches.html')
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.html;
    })
  });
});

describe('GET "/peeps.html" endpoint', function() {
  it('Should return html page', function() {
    return chai.request(app)
    .get('/peeps.html')
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.html;
    })
  });
});

describe('GET "/settings" endpoint', function() {
  it('Should return html page', function() {
    return chai.request(app)
    .get('/settings.html')
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.html;
    })
  });
});
