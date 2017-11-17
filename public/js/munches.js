const MUNCH_GET_URL = 'http://localhost:8080/api/munches';


// const MOCK_MUNCHES = {
//     "munches": [
//         {
//             "id": "1111111",
//             "type": "Meal",
//             "description": "In 'n Out cheeseburger meal",
//             "emoji": ":]",
//             "thumbUp": true,
//             "date": new Date(),
//             "lastEditAt": 1470016976609
//         },
//         {
//             "id": "22222",
//             "type": "Munch",
//             "description": "Milk & Cookies",
//             "emoji": ":)",
//             "thumbUp": true,
//             "date": new Date(),
//             "lastEditAt": 1470016976609
//         },
//         {
//             "id": "333333",
//             "type": "Munch",
//             "description": "Cheese and stale crackers",
//             "emoji": ":/",
//             "thumbUp": false,
//             "date": new Date(),
//             "lastEditAt": 1470016976609
//         },
//         {
//             "id": "44444",
//             "type": "Mug",
//             "description": "Coffee Large",
//             "emoji": ":)",
//             "thumbUp": true,
//             "date": new Date(),
//             "lastEditAt": 1470016976609
//         }
//     ]
// };

function getMunches() {
  const token = sessionStorage.getItem('token');

  if (token) {
    $.ajax({
      type: 'GET',
      url: MUNCH_GET_URL,
      headers: {
        Authorization: token
      },
      success: displayMunches,
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

function displayMunches(data) {
  console.log(data);
    $('#display-munches').empty().append(`<h2><a href="munches.html">My Munches</a></h2>`);
    for (index in data.munches) {
       $('#display-munches').append(
        `<p> ${data.munches[index].date} - ${data.munches[index].type} - ${data.munches[index].description} - ${data.munches[index].thumbUp} - ${data.munches[index].emoji}</p>`);
    }
}

$(function() {
    getMunches();
})
