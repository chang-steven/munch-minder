function parseJwt (token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
};

function listenForMunch() {
  $('#munch-form').submit(function(event) {
    const data = new FormData(this);
    event.preventDefault();
    let image = $('#munch-image').val();
    console.log(image);
    let thumb = $('input[name=thumb]:checked', '#munch-form').val();
    let munch = {
      date: $('#munch-date').val(),
      title: $('#munch-title').val(),
      description: $('#munch-description').val(),
      userThumbsUp: thumb,
      imgFile: $('#munch-image').val()
    };
    $('#munch-date').val("");
    $('#munch-title').val("");
    $('#munch-description').val("");
    $('#munch-image').val("");
    $('#munch-userThumbsUp').prop('checked', false);
    $('#munch-userThumbsDown').prop('checked', false);
    console.log(munch);
    $.ajax({
      method: 'POST',
      enctype: 'multipart/form-data',
      url: '/api/munches',
      headers: {
        Authorization: token
      },
      data: data,
      processData: false,
      contentType: false,
      success: result => {
        // location.href='/munches.html'
        console.log('now showing some new munch');
        console.log(result.message);
        showMessage(result.message);
        getMunches();

      },
      error: error => {
        console.log(error);
        alert('Sorry, there was an error, try again...');
        location.href='/munches.html'
      }
    })
  })
}

function getMunches() {
  $.ajax({
    type: 'GET',
    url: '/api/munches',
    headers: {
      Authorization: token
    },
    success: displayMunches,
    error: error => {
      console.log(error);
      console.log('Unable to get munches');
    }
  });
}

function displayMunches(data) {
  if (data.munches.length <= 0) {
    $('#display-munches').empty().append(`
      <h2><a href="munches.html">My Munches</a></h2>
      <p>Looks like you haven't added any munches yet.</p>`);
    }
  else {
    $('#display-munches').empty().append(`<h2><a href="munches.html">My Munches</a></h2>`);
    for (i in data.munches) {
      let munch = data.munches[i];
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
    const imageURL = munch.image || "/img/no-image.jpg";
    $('#display-munches').append(
      `<div class="returned-munches">
      <div class="munch-image">
      <img src="${imageURL}">
      </div><a href="/munch.html?id=${munch._id}">
      <div class="munch-blurb">
      <p>${thumb}${formattedDate}</p>
      <p>${munch.title}</p>
      <p>${munch.description}</p>
      </div>
      </div></a>`);
    }
  }
  $('#loader').fadeOut();
}

$(function() {
  token = sessionStorage.getItem('token');
  if (token) {
    payloadData = parseJwt(token);
    displayAvatar();
    getMunches();
    listenForMunch();
}
    else {
      alert("Sorry, you're not logged in");
      location.href='/login.html';
    }
});
