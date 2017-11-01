var MOCK_STATUS_UPDATES = {
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
          "publishedAt": 1470016976609
        },
        {
            "id": "2222222",
            "type": "Meal",
            "description": "Milk & Cookies",
            "emoji": ":)",
            "thumbUp": true,
            "friendId": "bbbbbbb",
            "peepUserName": "Jane Doe",
            "publishedAt": 1470012976609
        },
        {
            "id": "333333",
            "type": "Meal",
            "description": "Cheese and stale crackers",
            "emoji": ":/",
            "thumbUp": false,
            "friendId": "cccc",
            "peepUserName": "Jim Doe",
            "peepEmail": "john@me.com",
            "publishedAt": 1470011976609
        },
        {
            "id": "4444444",
            "type": "Meal",
            "description": "In 'n Out cheeseburger meal",
            "emoji": ":]",
            "thumbUp": true,
            "friendId": "ddddd",
            "peepUserName": "Jackie Doe",
            "peepEmail": "john@me.com",
            "publishedAt": 1470009976609
        }
    ]
};

function getRecentStatusUpdates(callbackFn) {
    setTimeout(function(){ callbackFn(MOCK_STATUS_UPDATES)}, 100);
}

// this function stays the same when we connect
// to real API later
function displayStatusUpdates(data) {
    for (index in data.statusUpdates) {
       $('body').append(
        `<p> ${data.statusUpdates[index].publishedAt} - ${data.statusUpdates[index].peepUserName} logged: ${data.statusUpdates[index].description} ${data.statusUpdates[index].emoji}  </p>`);
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayStatusUpdates() {
    getRecentStatusUpdates(displayStatusUpdates);
}

$(function() {
    getAndDisplayStatusUpdates();
})
