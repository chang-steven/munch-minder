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
          "date": 1470016976609,
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
            "date": 1470012976609,
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
            "date": 1470011976609,
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
            "date": 1470009976609,
            "lastEditAt": 1470016976609
        }
    ]
};

function getRecentStatusUpdates(callbackFn) {
    setTimeout(function(){ callbackFn(MOCK_STATUS_UPDATES)}, 100);
}

// this function stays the same when we connect
// to real API later
function displayStatusUpdates(data) {
   $('#display-peeps').empty().append(`<h2><a href="peeps.html">My Peeps</a></h2>`);
    for (index in data.statusUpdates) {
       $('#display-peeps').append(
        `
        <p> ${data.statusUpdates[index].date} - ${data.statusUpdates[index].peepUserName} logged: ${data.statusUpdates[index].description} ${data.statusUpdates[index].emoji}  </p>`);
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayStatusUpdates() {
    getRecentStatusUpdates(displayStatusUpdates);
}

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
    getAndDisplayStatusUpdates();
    listenForSearchClick();
})
