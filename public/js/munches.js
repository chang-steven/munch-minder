var MOCK_STATUS_UPDATES = {
    "munches": [
        {
            "id": "1111111",
            "type": "Meal",
            "description": "In 'n Out cheeseburger meal",
            "emoji": ":]",
            "thumbUp": true,
            "created": Date.now(),
            "lastEdit": 1470016976609
        },
        {
            "id": "22222",
            "type": "Munch",
            "description": "Milk & Cookies",
            "emoji": ":)",
            "thumbUp": true,
            "created": Date.now(),
            "lastEdit": 1470016976609
        },
        {
            "id": "333333",
            "type": "Munch",
            "description": "Cheese and stale crackers",
            "emoji": ":/",
            "thumbUp": false,
            "created": Date.now(),
            "lastEdit": 1470016976609
        },
        {
            "id": "44444",
            "type": "Mug",
            "description": "Coffee Large",
            "emoji": ":)",
            "thumbUp": true,
            "created": Date.now(),
            "lastEdit": 1470016976609
        }
    ]
};

function getMunches(callbackFn) {
    setTimeout(function(){ callbackFn(MOCK_STATUS_UPDATES)}, 100);
}

// this function stays the same when we connect
// to real API later
function displayMunches(data) {
    console.log(data);
    for (index in data.munches) {
       $('body').append(
        `<p> ${data.munches[index].created} - ${data.munches[index].type} - ${data.munches[index].description} - ${data.munches[index].thumbUp} - ${data.munches[index].emoji}</p>`);
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayMunches() {
    getMunches(displayMunches);
}

$(function() {
    getAndDisplayMunches();
})
