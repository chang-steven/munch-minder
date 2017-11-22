const MUNCH_GET_URL = 'http://localhost:8080/api/munches/';
let munchId;

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

function getSpecificMunch() {
  $.ajax({
    type: 'GET',
    url: MUNCH_GET_URL + munchId,
    headers: {
      Authorization: token
    },
    success: displayMunch,
    error: error => {
      console.log(error);
      console.log('Something went wrong');
    }
  })
}

function displayMunch(munch) {
  console.log(munch);
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
  const imageURL = munch.image || "http://fakeimg.pl/200x200/?text=Munch&font=lobster";
    $('#display-munch').empty().append(`<h2>${munch.title}</h2>
      <a href="/munch.html?id=${munch._id}"><div class="returned-munches">
      <div class="munch-image">
        <img src="${imageURL}">
      </div>
    <div class="munch-blurb">
      <p><a href="${userURL}">${munch.username || "Blank for now"}</a></p>
      <p>${thumb}${formattedDate}</p>
      <p>${munch.title}</p>
      <p>${munch.description}</p>
    </div>
  </div></a>`);
}

$(function() {
  token = sessionStorage.getItem('token');
  if (token) {
    munchId = getQueryVariable('id');
    console.log(munchId);
    getSpecificMunch();
  }
  else {
    alert("Sorry, you're not logged in");
    location.href='/login.html'
  }
})
