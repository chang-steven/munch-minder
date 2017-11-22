
const FRIEND_GET_URL = 'http://localhost:8080/api/peeps/';
const FRIENDBYID_GET_URL = 'http://localhost:8080/api/peep/';

let friendId;

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return (false);
}

function getSpecificFriend() {
  $.ajax({
    type: 'GET',
    url: FRIENDBYID_GET_URL + friendId,
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

function displayFriendMunches(result) {
    let friendData = result.munches;
    console.log(friendData);
    $('#display-friend').empty().append(`<h2>${result.userName}'s Munches</h2>`);
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
      $('#display-friend').append(
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
  };


$(function() {
  token = sessionStorage.getItem('token');
  if (token) {
    friendId = getQueryVariable('id');
    console.log(friendId);
    getSpecificFriend();
  }
  else {
    alert("Sorry, you're not logged in");
    location.href='/login.html'
  }
})
