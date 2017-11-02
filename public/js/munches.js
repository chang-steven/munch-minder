const MOCK_MUNCHES = {
    "munches": [
        {
            "id": "1111111",
            "type": "Meal",
            "description": "In 'n Out cheeseburger meal",
            "emoji": ":]",
            "thumbUp": true,
            "date": Date.now(),
            "lastEditAt": 1470016976609
        },
        {
            "id": "22222",
            "type": "Munch",
            "description": "Milk & Cookies",
            "emoji": ":)",
            "thumbUp": true,
            "date": Date.now(),
            "lastEditAt": 1470016976609
        },
        {
            "id": "333333",
            "type": "Munch",
            "description": "Cheese and stale crackers",
            "emoji": ":/",
            "thumbUp": false,
            "date": Date.now(),
            "lastEditAt": 1470016976609
        },
        {
            "id": "44444",
            "type": "Mug",
            "description": "Coffee Large",
            "emoji": ":)",
            "thumbUp": true,
            "date": Date.now(),
            "lastEditAt": 1470016976609
        }
    ]
};

function getMunches(callbackFn) {
    setTimeout(function(){ callbackFn(MOCK_MUNCHES)}, 100);
}

// this function stays the same when we connect
// to real API later
function displayMunches(data) {
    $('#display-munches').empty().append(`<h2><a href="munches.html">My Munches</a></h2>`);
    for (index in data.munches) {
       $('#display-munches').append(
        `<p> ${data.munches[index].date} - ${data.munches[index].type} - ${data.munches[index].description} - ${data.munches[index].thumbUp} - ${data.munches[index].emoji}</p>`);
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
