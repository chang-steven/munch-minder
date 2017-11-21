const faker = require('faker');
const should = require('chai').should();
const mongoose = require('mongoose');

const {User} = require('../src/models/user');
const {Munch} = require('../src/models/munch');
const {Group} = require('../src/models/group');

function seedMunchMinderDatabase() {
  console.info('Seeding Users, Munches & Groups collections...');
  // const seedUserData = [];
  // const seedMunchData = [];
  // const seedGroupData = [];
  let i = 0;
  while (i < 10) {
    createTestUserAndPostMunches();
    // seedUserData.push(generateUserData());
    // seedMunchData.push(generateMunchData());
    i++;
  };
  // const insertUserData = User.insertMany(seedUserData);
  // const insertMunchData = Munch.insertMany(seedMunchData);
  // return Promise.all([insertUserData, insertMunchData])
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

function createTestUserAndPostMunches() {
  User.create(generateUserData())
  .then(user => {
    let userId = user._id;
    let username = user.userName
    let j = 0;
    while (j < 10) {
      let newMunch = generateMunchData();
      newMunch.postedBy = userId;
      newMunch.userName = username;
      Munch.create(newMunch);
      j++;
    }
  })
}

function teardownDatabase() {
  console.warn('Deleting database...');
  return mongoose.connection.dropDatabase();
}

module.exports = {seedMunchMinderDatabase, generateUserData, generateMunchData, createTestUser, teardownDatabase}
