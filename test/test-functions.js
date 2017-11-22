const faker = require('faker');
const should = require('chai').should();
const mongoose = require('mongoose');

const {User} = require('../src/models/user');
const {Munch} = require('../src/models/munch');
const {Group} = require('../src/models/group');

function seedMunchMinderDatabase() {
  let i = 0;
  const promises = [];
  while (i < 3) {
    promises.push(createTestUserAndPostMunches(i));
    i++;
  };
  console.log('Generated iteration of user data');
  console.log('.....................');
  return Promise.all(promises);
}

function generateUserData() {
  return {
    userName: faker.internet.userName(),
    userEmail: faker.internet.email(),
    password: faker.internet.password(),
  };
}

function generateMunchData() {
  return {
    date: faker.date.past(),
    title: faker.lorem.words(),
    description: faker.lorem.sentence(),
    emoji: faker.image.avatar(),
    image: faker.image.imageUrl(),
    thumbsUp: faker.random.boolean(),
  }
}

function createTestUser() {
  return User.create(generateUserData());
}

function createTestUserAndPostMunches(i) {
  console.log(`Creating User ${i+1}`);
  return User.create(generateUserData())
  .then(user => {
    let userId = user._id;
    let username = user.userName
    let j = 0;
    const munchPromises = [];
    while (j < 3) {
      console.log(`Generating munch ${j+1} for user: ${username}`)
      let newMunch = generateMunchData();
      newMunch.postedBy = userId;
      newMunch.userName = username;
      munchPromises.push(Munch.create(newMunch));
      j++;
    }
    console.log('Generated Munches');
    console.log('==================');
    return Promise.all(munchPromises);
  })
}

function teardownDatabase() {
  console.warn('Deleting database...');
  return mongoose.connection.dropDatabase();
}

module.exports = {seedMunchMinderDatabase, generateUserData, generateMunchData, createTestUser, teardownDatabase}
