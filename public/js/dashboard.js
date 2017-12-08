function getMunches() {
  return $.ajax({
    type: 'GET',
    url: '/api/munches',
    headers: {
      Authorization: token
    },
    success: displayMunches,
    error: error => {
      console.log(error);
      console.log('Unable to get munches');
    }
  });
}

function displayMunches(data) {
  if (data.munches.length <= 0) {
    $('#display-munches').empty().append(`
      <h2><a href="munches.html">My Munches</a></h2>
      <p>Looks like you haven't added any munches yet.</p>`);
    }
  else {
    $('#display-munches').empty().append(`<h2><a href="munches.html">My Munches</a></h2>`);
    for (i in data.munches) {
      let munch = data.munches[i];
      let thumb;
      if (munch.userThumbsUp == 1) {
        thumb = `<span class="thumbUp">&#x1F44D;</span>`
      }
      else if (munch.userThumbsUp == 2) {
        thumb = `<span class="thumbDown">&#x1F44E;</span>`
      }
      else {
        thumb = '';
      }
    let formattedDate = new Date(munch.date).toDateString();
    const imageURL = munch.image || "/img/no-image.jpg";
    $('#display-munches').append(
      `<div class="returned-munches">
      <div class="munch-image">
      <img src="${imageURL}">
      </div><a href="/munch.html?id=${munch._id}">
      <div class="munch-blurb">
      <p>${thumb}${formattedDate}</p>
      <p>${munch.title}</p>
      <p>${munch.description}</p>
      </div>
      </div></a>`);
    }
  }
}

function getRecentFriendMunches() {
  return $.ajax({
    type: 'GET',
    url: '/api/peeps/munches',
    headers: {
      Authorization: token
    },
    success: displayFriendMunches,
    error: error => {
      console.log(error);
      console.log('Unable to get friends munches');
    }
  });
}

function displayFriendMunches(friendData) {
  if (friendData <= 0) {
    $('#display-peeps').empty().append(`
      <h2><a href="peeps.html">Peeps' Munches</a></h2>
      <p>Add your friends and see their munches!</p></div>`);
    }
  else {
    $('#display-peeps').empty().append(`<h2><a href="peeps.html">Peeps' Munches</a></h2>`);
    for (let i = 0; i < friendData.length; i++) {
      let munch = friendData[i];
      let thumb;
      if (munch.userThumbsUp == 1) {
          thumb = `<span class="thumbUp">&#x1F44D;</span>`
        }
      else if (munch.userThumbsUp == 2) {
          thumb = `<span class="thumbDown">&#x1F44E;</span>`
        }
      else {
        thumb = '';
      }
      let formattedDate = new Date(munch.date).toDateString();
      let userURL = `/peep.html?id=${munch.postedBy || ""} `;
      let imageURL = munch.image || "http://fakeimg.pl/200x200/?text=Munch&font=lobster";
      $('#display-peeps').append(
        `<div class="returned-munches">
        <div class="munch-image">
        <img src="${imageURL}">
        </div>
        <a href="munch.html?id=${munch._id}"><div class="munch-blurb">
        <p class="username">${munch.userName}</p>
        <p>${thumb}${formattedDate}</p>
        <p>${munch.title}</p></a>
        <p>${munch.description}</p>
        </div>
        </div>`);
      }
    }
  };

$(function() {
  token = sessionStorage.getItem('token');
  if (token) {
    payloadData = parseJwt(token);
    displayAvatar();
    let fetchMunches = getMunches();
    let fetchFriendsMunches = getRecentFriendMunches()
    Promise.all([fetchMunches, fetchFriendsMunches])
      .then( () => $('#loader').fadeOut());
    }

    else {
      alert("Sorry, you're not logged in");
      location.href='/login.html';
    }
});
