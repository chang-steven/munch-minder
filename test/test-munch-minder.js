const chai = require('chai');
const chaiHttp = require('chai-http');
const should = require('chai').should();
// const mongoose = require('mongoose');

const {app} = require('../server')

chai.use(chaiHttp);

describe('GET "/" endpoint', function() {
  it('Should return html from public folder', function() {
    return chai.request(app)
    .get('/')
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.html;
    });
  });
});
