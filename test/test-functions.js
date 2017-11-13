const faker = require('faker');
const should = require('chai').should();
const mongoose = require('mongoose');

const {User} = require('../models/user');
const {Munch} = require('../models/munch');
// const {Group} = require('../models/group');

function seedMunchMinderDatabase() {
  console.info('Seeding Users, Munches & Groups collections...');
  const seedUserData = [];
  const seedMunchData = [];
  const seedGroupData = [];
  let i = 0;
  while (i < 10) {
    seedUserData.push(generateUserData());
    seedMunchData.push(generateMunchData());
    i++;
  };
  const insertUserData = User.insertMany(seedUserData);
  const insertMunchData = Munch.insertMany(seedMunchData);
  return Promise.all([insertUserData, insertMunchData])
}

function generateUserData() {
  return {
    userName: faker.internet.userName(),
    userEmail: faker.internet.email(),
    password: faker.internet.password(),
    joinDate: faker.date.past()
  };
}

function generateMunchData() {
  return {
    date: faker.date.past(),
    type: faker.lorem.word(),
    description: faker.lorem.sentence(),
    emoji: faker.image.avatar(),
    image: faker.image.image(),
    likes: {
      thumbsUp: faker.random.number(),
      thumbsDown: faker.random.number()
    }
  }
}

function teardownDatabase() {
  console.warn('Deleting database...');
  return mongoose.connection.dropDatabase();
}

module.exports = {seedMunchMinderDatabase, generateUserData, generateMunchData, teardownDatabase}
