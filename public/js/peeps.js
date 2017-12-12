function getRecentFriendMunches() {
  return $.ajax({
    type: 'GET',
    url: '/api/peeps/munches',
    headers: {
      Authorization: token
    },
    success: displayFriendMunches,
    error: error => {
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
      let userURL = `/peep.html?id=${munch.postedBy._id || ""} `;
      let imageURL = munch.image || "http://fakeimg.pl/200x200/?text=Munch&font=lobster";
      $('#display-peeps').append(
        `<div class="returned-munches">
        <div class="munch-image">
        <img src="${imageURL}">
        </div>
        <a href="munch.html?id=${munch._id}"><div class="munch-blurb">
        <p class="username">${munch.postedBy.userName}</p>
        <p>${thumb}${formattedDate}</p>
        <p>${munch.title}</p></a>
        <p>${munch.description}</p>
        </div>
        </div>`);
      }
    }
  };

  function getMyFriends() {
    return $.ajax({
      type: 'GET',
      url: '/api/peeps',
      headers: {
        Authorization: token
      },
      success: displayMyFriends,
      error: error => {
        console.log('Unable to get friends');
      }
    });
  }

  function displayMyFriends(result) {
    let myFriends = result.friends;
    if (myFriends.length <= 0) {
      $('#display-friends').empty().append(`<h2>My Peeps</h2>
        <p>Looks like you need some friends!</p>`)
    }
    else {
    $('#display-friends').empty().append(`<h2>My Peeps</h2>`);
    for (i in myFriends) {
      let peep = myFriends[i];
      let imageURL = (peep.avatar ? peep.avatar.url : "http://fakeimg.pl/200x200/?text=peep&font=lobster");
        let formattedDate = Date(peep.joinDate).slice(0, -24);
        $('#display-friends').append(
        `<a href="/peep.html?id=${peep._id}"><div class="returned-peeps">
        <div class="peeps-image">
        <img src="${imageURL}">
        </div>
        <div class="peeps-blurb">
        <p class="username">${peep.userName}</p>
        <p>${peep.userEmail}</p>
        <p>Joined: ${formattedDate}</p>
        </div>
        </div></a>`
      )
    }
  }
}


function listenForSearchClick() {
  $('#js-search-peeps-button').click(event => {
    event.preventDefault();
    let query = $('#search-peeps-input').val();
    $('#search-peeps-input').val("");
    searchAndGetPeeps(query);
  })
}

function searchAndGetPeeps(query) {
  $.ajax({
    type: 'GET',
    url: '/api/peeps/findbyemail' + `?email=${query}`,
    headers: {
      Authorization: token
    },
    success: displaySearchedPeeps,
    error: error => {
      showMessage('Sorry, unable to return a search results', true);
    }
  })
}

function displaySearchedPeeps(searchResults) {
  if (searchResults.length <= 0) {
    showMessage('Sorry, unable to return any search results, try again.', true)
  }
  else {
  $('#display-friends').empty().append(`<h2>Peeps Search Results</h2>`);
  for (i in searchResults) {
    let peep = searchResults[i];
    let imageURL = (peep.avatar ? peep.avatar.url : "http://fakeimg.pl/200x200/?text=peep&font=lobster");
    let formattedDate = Date(peep.joinDate).slice(0, -24);
    $('#display-friends').append(
      `<div class="returned-peeps">
      <div class="peeps-image">
      <img src="${imageURL}">
      </div>
      <div class="peeps-blurb">
      <p class="username">${peep.userName}</p>
      <p>${peep.userEmail}</p>
      <p>Joined: ${formattedDate}</p>
      </div>
      <button class="add-friend" data-id="${peep._id}" type="button">Add Friend</button>
      </div>`
    )
  }
  listenForAddFriend();
  }
}

function listenForAddFriend() {
  $('.add-friend').click( function(event) {
    event.preventDefault();
    let friendId = $(this).data('id');
    let friend = {friendId: friendId
    };
    $.ajax({
      type: 'POST',
      url: '/api/peeps/add-friend',
      data: friend,
      headers: {
        Authorization: token
      },
      success: (response) => {
        showMessage(response.message);
        getMyFriends();
        getRecentFriendMunches();
      },
      error: error => {
        showMessage(error.responseJSON.message, true)
      }
    })
  })
}

$(function() {
  token = sessionStorage.getItem('token');
  if (token) {
    payloadData = parseJwt(token);
    displayAvatar();
    let fetchMyFriends = getMyFriends();
    let fetchMyFriendsMunches = getRecentFriendMunches();
    Promise.all([fetchMyFriends, fetchMyFriendsMunches])
    .then(() => {
        $('#loader').fadeOut();
    });
    listenForSearchClick();
  }
  else {
    alert("Sorry, you're not logged in");
    location.href='/login.html';
  }
})
