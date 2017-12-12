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

function getSpecificMunch(munchId) {
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
  let formattedDate = Date(munch.date).slice(0, -24);
  let userURL = `/peep.html?id=${munch.postedBy._id || ""} `;
  const imageURL = munch.image || "/img/no-image.jpg";
    $('#display-munch').empty().append(`<h2>${munch.title}</h2>
      <a href="/munch.html?id=${munch._id}"><div class="returned-munches">
      <div class="specific-munch-image">
        <img src="${imageURL}">
      </div>
    <div class="munch-blurb">
      <p><a href="${userURL}">${munch.postedBy.userName}</a></p>
      <p>${thumb}${formattedDate}</p>
      <p>${munch.title}</p>
      <p>${munch.description}</p>
    </div>
  </div></a>`);
  if (munch.postedBy._id == payloadData.userId) {
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
        $('#myModal').show();
        $('.modal-content').append(`
          <p>Successfully deleted munch</p>
          <button id="ok-button">Ok</button>`);
          $('#ok-button').click(function() {
            $('#myModal').hide();
            location.href='/dashboard.html';
          });
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
  getSpecificMunch(getQueryVariable('id'));
  }
  else {
    alert("Sorry, you're not logged in");
    location.href='/login.html';
  }
})
