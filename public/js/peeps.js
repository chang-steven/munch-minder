const FRIENDMUNCHES_GET_URL = 'http://localhost:8080/api/peeps/munches';
const FRIEND_GET_URL = 'http://localhost:8080/api/peeps/';
const ADDFRIENDS_BYEMAIL_URL = 'http://localhost:8080/api/peeps/findbyemail';
const ADDFRIENDS_URL = 'http://localhost:8080/api/peeps/add-friend';

function getRecentFriendMunches() {
  $.ajax({
    type: 'GET',
    url: FRIENDMUNCHES_GET_URL,
    headers: {
      Authorization: token
    },
    success: displayFriendMunches,
    error: error => {
      console.log(error);
      console.log('Something went wrong');
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
        <a href="munch.html?id=${munch._id}"><img src="${imageURL}"></a>
        </div>
        <div class="munch-blurb">
        <p><a href="${userURL}">${munch.username || "Blank for now"}</a></p>
        <p>${thumb}${formattedDate}</p>
        <a href="munch.html?id=${munch._id}"><p>${munch.title}</p></a>
        <p>${munch.description}</p>
        </div>
        </div>`);
      }
    }
  };

  function getMyFriends() {
    $.ajax({
      type: 'GET',
      url: FRIEND_GET_URL,
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
    console.log(myFriends);
    if (myFriends.length <= 0) {
      $('#display-friends').empty().append(`<h2>My Peeps</h2>
        <p>Looks like you need some friends!</p>`)
    }
    else {
    $('#display-friends').empty().append(`<h2>My Peeps</h2>`);
    for (i in myFriends) {
      let peep = myFriends[i];
        let formattedDate = new Date(peep.joinDate).toDateString();
      const imageURL = peep.image || "http://fakeimg.pl/200x200/?text=peep&font=lobster";
      $('#display-friends').append(
        `<a href="/peep.html?id=${peep._id}"><div class="returned-peeps">
        <div class="peeps-image">
        <img src="${imageURL}">
        </div>
        <div class="peeps-blurb">
        <p>${peep.userName}</p>
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
    console.log(query);
    $('#search-peeps-input').val("");
    searchAndGetPeeps(query);
  })
}


function searchAndGetPeeps(query) {
  $.ajax({
    type: 'GET',
    url: ADDFRIENDS_BYEMAIL_URL + `?email=${query}`,
    headers: {
      Authorization: token
    },
    success: displaySearchedPeeps,
    error: error => {
      console.log(error);
      console.log('Sorry, unable to return a search results');
    }
  })
}


function displaySearchedPeeps(searchResults) {
  if (searchResults.length <= 0) {
    alert('Sorry, unable to return any search results, try again.')
  }
  else {
  $('#display-friends').empty().append(`<h2>Peeps Search Results</h2>`);
  for (i in searchResults) {
    let peep = searchResults[i];
    const imageURL = peep.image || "http://fakeimg.pl/200x200/?text=peep&font=lobster";
    let formattedDate = new Date(peep.joinDate).toDateString();
    $('#display-friends').append(
      `<div class="returned-peeps">
      <div class="peeps-image">
      <img src="${imageURL}">
      </div>
      <div class="peeps-blurb">
      <p>${peep.userName}</p>
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
    // let friendId = this.id;
    let friendId = $(this).data('id');
    let friend = {friendId: friendId
    };
    console.log(friend);
    $.ajax({
      type: 'POST',
      url: ADDFRIENDS_URL,
      data: friend,
      headers: {
        Authorization: token
      },
      success: (response) => {
        console.log(response);
        alert(response.message);
        location.href='/peeps.html';
      },
      error: error => {
        console.log(error);
        console.log('Sorry, unable to add friend');
      }
    })
  })
}


$(function() {
  token = sessionStorage.getItem('token');
  if (token) {
    getMyFriends();
    getRecentFriendMunches();
    listenForSearchClick();
  }
  else {
    alert("Sorry, you're not logged in");
    location.href='/login.html'
  }
})
