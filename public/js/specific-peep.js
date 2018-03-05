function getQueryVariable(variable) {
  let query = window.location.search.substring(1);
  let vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return (false);
}

function getSpecificFriend(friendId) {
  $.ajax({
    type: 'GET',
    url: '/api/peep/' + friendId,
    headers: {
      Authorization: token
    },
    success: displayFriendMunches,
    error: error => {
      console.log('Unable to get specific friend');
    }
  });
}

function displayFriendMunches(result) {
    let friendData = result.munches;
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
    let formattedDate = new Date(munch.date).toDateString();      let userURL = `/peep.html?id=${munch.postedBy._id || ""} `;
      $('#display-friend').append(
        `<div class="returned-munches">
        <div class="specific-munch-image">
        <a href="munch.html?id=${munch._id}"><img src="${munch.image}"></a>
        </div>
        <div class="munch-blurb">
        <p class="username"><a href="${userURL}">${munch.postedBy.userName || "Blank for now"}</a></p>
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
    payloadData = parseJwt(token);
    displayAvatar();
    getSpecificFriend(getQueryVariable('id'));
  }
  else {
    alert("Sorry, you're not logged in");
    location.href='/login.html';
  }
})
