"avatars/"

const testFolder = './avatars/';
const fs = require('fs');

let avatarsArray = [];

fs.readdirSync(testFolder).forEach(file => {
  avatarsArray.push({
    "name": file.slice(0, -4),
    "url": `/img/avatars/${file}`
  })
})

let avatarJSON = JSON.stringify(avatarsArray, null, '  ');

console.log(avatarJSON);

// node avatars.js > avatars.json
