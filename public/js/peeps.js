const FRIENDMUNCHES_GET_URL = 'http://localhost:8080/api/peeps';


const MOCK_STATUS_UPDATES = {
    "statusUpdates": [
        {
          "id": "1111111",
          "type": "Meal",
          "description": "In 'n Out cheeseburger meal",
          "emoji": ":]",
          "thumbUp": true,
          "lastEdit": 1470016976609,
          "peepUserName": "John Doe",
          "peepEmail": "john@me.com",
          "date": new Date(),
          "lastEditAt": 1470016976609
        },
        {
            "id": "2222222",
            "type": "Meal",
            "description": "Milk & Cookies",
            "emoji": ":)",
            "thumbUp": true,
            "friendId": "bbbbbbb",
            "peepUserName": "Jane Doe",
            "peepEmail": "jane@me.com",
            "date": new Date(),
            "lastEditAt": 1470016976609
        },
        {
            "id": "333333",
            "type": "Meal",
            "description": "Cheese and stale crackers",
            "emoji": ":/",
            "thumbUp": false,
            "friendId": "cccc",
            "peepUserName": "Jim Doe",
            "peepEmail": "jim@me.com",
            "date": new Date(),
            "lastEditAt": 1470016976609
        },
        {
            "id": "4444444",
            "type": "Meal",
            "description": "In 'n Out cheeseburger meal",
            "emoji": ":]",
            "thumbUp": true,
            "friendId": "ddddd",
            "peepUserName": "Jackie Doe",
            "peepEmail": "jackie@me.com",
            "date": new Date(),
            "lastEditAt": 1470016976609
        }
    ]
};

function getRecentFriendMunches() {
  const token = sessionStorage.getItem('token');
  if (token) {
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
    })
  }
  else {
    alert("Sorry, you're not logged in");
    location.href='/login.html'
  }
}

// this function stays the same when we connect
// to real API later
function displayFriendMunches(friendData) {
  if (friendData <= 0) {
    $('#display-peeps').empty().append(`
    <h2><a href="peeps.html">My Peeps</a></h2>
    <p>Add your friends and see their munches!</p></div>`);
  }

  else {
    $('#display-peeps').empty().append(`<h2><a href="peeps.html">My Peeps</a></h2>`);
    for (let i = 0; i < friendData.length; i++) {
      let munch = friendData[i];
      // console.log(munch);
      // let formattedDate = munch.date.toLocaleDateString("en-US");
      // console.log(formattedDate);
      let userURL = `/api/user/${munch.postedBy || ""} `;
      console.log(userURL);
      let imageURL = munch.image || "http://fakeimg.pl/200x200/?text=Munch&font=lobster";
      $('#display-peeps').append(
        `<div class="returned-munches">
        <div class="munch-image">
        <img src="${imageURL}">
        </div>
        <div class="munch-blurb">
        <p><a href="${userURL}">${munch.username || "Blank for now"}</a></p>
        <p>${munch.date}</p>
        <p>${munch.title}</p>
        <p>${munch.description}</p>
        <p>${munch.emoji || ""}</p>
        </div>
        </div>`);
      }
    }
  };


function listenForSearchClick() {
  $('#js-search-peeps-button').click(event => {
    event.preventDefault();
    let query = $('#search-peeps-input').val();
    console.log(query);
    searchAndGetPeeps(query);
  });
}

function searchAndGetPeeps(query) {
  alert(`There was a click, we're searching for: ${query}, but this feature doesn't quite work yet, so I'll return some random data`);
  displaySearchedPeeps(MOCK_STATUS_UPDATES);
}

function displaySearchedPeeps(data) {
  $('#display-peeps').empty().append(`<h2>Peeps Search Results</h2>`);
  for (index in data.statusUpdates) {
    $('#display-peeps').append(
      `<p>${data.statusUpdates[index].peepUserName} - ${data.statusUpdates[index].peepEmail}</p>
      `
    )
  }
}


$(function() {
    getRecentFriendMunches();
    listenForSearchClick();
})
