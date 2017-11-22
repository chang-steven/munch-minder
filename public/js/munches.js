const MUNCH_GET_URL = 'http://localhost:8080/api/munches/';
const MUNCH_POST_URL = 'http://localhost:8080/api/munches/';

function listenForMunch() {
  console.log('Now listening for Munch');
  $('#munch-form').submit(event => {
    console.log('Attempted Munch Log');
    event.preventDefault();
    let thumb = $('input[name=thumb]:checked', '#munch-form').val();
    console.log(thumb);
    let munch = {
      date: $('#munch-date').val(),
      title: $('#munch-title').val(),
      description: $('#munch-description').val(),
      userThumbsUp: thumb
    };
    console.log(munch);
    $.ajax({
      type: 'POST',
      url: MUNCH_POST_URL,
      headers: {
        Authorization: sessionStorage.getItem('token')
      },
      data: munch,
      success: result => {
        alert(result.message);
        location.href='/munches.html'
      },
      error: error => {
        alert('Sorry, there was an error, try again...');
        location.href='/munches.html'
      }
    })
  })
}

function getMunches() {
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
      const imageURL = munch.image || "http://fakeimg.pl/200x200/?text=Munch&font=lobster";
       $('#display-munches').append(
        `<a href="/munch.html?id=${munch._id}"><div class="returned-munches">
          <div class="munch-image">
            <img src="${imageURL}">
          </div>
        <div class="munch-blurb">
          <p>${thumb}${formattedDate}</p>
          <p>${munch.title}</p>
          <p>${munch.description}</p>
        </div>
      </div></a>`);
    }
  }
}

$(function() {
  token = sessionStorage.getItem('token');
  if (token) {
    getMunches();
    listenForMunch();
  }
  else {
    alert("Sorry, you're not logged in");
    location.href='/login.html'
  }
})
