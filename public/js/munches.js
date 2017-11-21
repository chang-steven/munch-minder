const MUNCH_GET_URL = 'http://localhost:8080/api/munches';

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
  if (data.munches.length <= 0) {
      $('#display-munches').empty().append(`
        <h2><a href="munches.html">My Munches</a></h2>
        <p>Looks like you haven't added any munches yet.</p>`);
  }
  else {
    $('#display-munches').empty().append(`<h2><a href="munches.html">My Munches</a></h2>`);
    for (i in data.munches) {
      let munch = data.munches[i];
        const imageURL = munch.image || "http://fakeimg.pl/200x200/?text=Munch&font=lobster";
       $('#display-munches').append(
        `<div class="returned-munches">
          <div class="munch-image">
            <img src="${imageURL}">
          </div>
        <div class="munch-blurb">
          <p>${munch.date}</p>
          <p>${munch.title}</p>
          <p>${munch.description}</p>
          <p>${munch.emoji || ""}</p>
        </div>
      </div>`);
    }
  }
}

$(function() {
    getMunches();
})
