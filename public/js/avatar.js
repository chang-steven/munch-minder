const AVATAR_GET_URL = 'http://localhost:8080/api/users/avatar'
const AVATAR_PATCH_URL = 'http://localhost:8080/api/user/'

function getAvatars() {
  $.ajax({
    type: 'GET',
    url: AVATAR_GET_URL,
    headers: {
      Authorization: token
    },
    success: displayAvatarCollection,
    error: error => {
      console.log(error);
      console.log('Something went wrong');
    }
  })
  listenForAvatarSelection();
}


function displayAvatarCollection(result) {
  console.log(result);
  $('#avatar-collection').empty().append(`<div class="avatar-banner"><h1>Choose your avatar</h1>
    <div id="avatar-button"><input type="submit" name="submit" value="I'm Done!"></div></div>`);
  result.forEach(avatar => {
  $('#avatar-collection').append(
    `<div class="avatar-window">
      <img src="${avatar.url}" alt="${avatar.name}">
      <div class="avatar-radio"><input value="${avatar._id}" type="radio"
       name="my-avatar"></div>
    </div>`
    );
  });
}

function listenForAvatarSelection() {
  console.log('Now listening for avatar submit');
  $('#avatar-form').submit(event => {
    event.preventDefault();
    let selectedAvatarData = {avatarId: $('input[name=my-avatar]:checked', '#avatar-form').val()};
    console.log(selectedAvatarData);
    $.ajax({
      type: 'PATCH',
      url: AVATAR_PATCH_URL,
      data: selectedAvatarData,
      headers: {
        Authorization: token
      },
      success: displayAvatarCollection,
      error: error => {
        console.log(error);
        console.log('Something went wrong');
      }
    })
  })
}


$(function() {
  token = sessionStorage.getItem('token');
  if (token) {
  getAvatars()
  }
  else {
    alert("Sorry, you're not logged in");
    location.href='/login.html'
  }
})
