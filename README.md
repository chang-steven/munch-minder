# Munch Minder  [![Build Status](https://travis-ci.org/chang-steven/munch-minder.svg?branch=master)](https://travis-ci.org/chang-steven/munch-minder)

### introduction: 
Munch Minder is a versatile photo blog and personal space for detailing your most recent culinary escapades, bragging to your friends about homemade creations, or simply logging what you ate or drank in an intuitive and easy to use way.  

Follow the tutorial to create an account and post your first munch.  Then, simply add friends to share and show what you've been enjoying!


### technologies: 
<strong>Front End Client:</strong>  / HTML5 / CSS3 / JavaScript / <a href="https://jquery.com/">jQuery</a> /

<strong>Back End API:</strong>  / <a href="https://nodejs.org/">Node.js</a> / <a href="https://expressjs.com/">Express</a> / <a href="http://mongoosejs.com/">Mongoose</a> / <a href="https://docs.mongodb.com/">MongoDB</a> / <a href="http://www.passportjs.org/">Passport</a> / bcryptjs / <a href="https://aws.amazon.com/s3/">Amazon S3</a> / <a href="https://mochajs.org/">Mocha</a> + <a href="http://chaijs.com/">Chai</a> (testing) / <a href="https://travis-ci.org/">Travis CI</a> / <a href="https://www.heroku.com/">Heroku</a> /

Munch Minder is a full-stack Express application built with Nodejs 
<ul>
  <li>Implements RESTful architecture style</li>
  <li>API uses Mongoose for object modeling for the MongoDB database.</li>
  <li>Passwords are encrypted with bcryptjs</li>
  <li>Uses Multer-S3 storage engine for Amazon S3 uploads
  <li>JWT authentiction is session-based and does not persist</li>
  <li>API endpoints are tested with Mocha, Chai, Faker</li>
  <li>jQuery traversal and DOM maniuplation</li>
  <li>Event listeners trigger asynchronous AJAX calls to API processing CRUD operations</li>
</ul>

### live site:
https://munch-minder.herokuapp.com/

### landing page:
![Landing Page](/public/img/screenshots/landing-page-snapshot.jpg?raw=true "Landing Page")

### tutorial:
![Tutorial](/public/img/screenshots/tutorial-snapshot.jpg?raw=true "Tutorial")

### dashboard:
![Dashboard](/public/img/screenshots/dashboard-snapshot.jpg?raw=true "Dashboard")

### peeps:
![Peeps](/public/img/screenshots/peeps-snapshot.jpg?raw=true "Peeps")
