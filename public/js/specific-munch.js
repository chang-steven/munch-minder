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
    url: '/api/munches/' + munchId,
    headers: {
      Authorization: token
    },
    success: displayMunch,
    error: error => {
      console.log('Something went wrong');
    }
  })
}

function displayMunch(munch) {
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
  const imageURL = munch.image || "/img/no-image.jpg";
    $('#display-munch').empty().append(`<h2>${munch.title}</h2>
      <a href="/munch.html?id=${munch._id}"><div class="returned-munches">
      <div class="specific-munch-image">
        <img src="${imageURL}">
      </div>
    <div class="munch-blurb">
      <p><a href="${userURL}">${munch.userName}</a></p>
      <p>${thumb}${formattedDate}</p>
      <p>${munch.title}</p>
      <p>${munch.description}</p>
    </div>
  </div></a>`);
  if (munch.postedBy == payloadData.userId) {
    $('.munch-blurb').append(`<button id="delete-munch">Delete</button>`);
    listenForMunchDelete(munch._id);
  }
}

function listenForMunchDelete(munchId) {
  $('#delete-munch').click(event => {
    $.ajax({
      method: 'DELETE',
      url: '/api/munches/' + munchId,
      headers: {
        Authorization: token
      },
      success: (result) => {
        var modal = document.getElementById('myModal');
        modal.style.display = "block";
        $('.modal-content').append(`
          <p>Successfully deleted munch</p>
          <button id="ok-button">Ok</button>`);
        (function() {
          $('#ok-button').click(function() {
            modal.style.display = "none";
            location.href='/dashboard.html';
          })
        })()
      },
      error: error => {
        console.log('Something went wrong');
      }
    })
  })
}

$(function() {
  token = sessionStorage.getItem('token');
  if (token) {
  payloadData = parseJwt(token);
  displayAvatar();
  munchId = getQueryVariable('id');
  getSpecificMunch();
  }
  else {
    alert("Sorry, you're not logged in");
    location.href='/login.html';
  }
})
