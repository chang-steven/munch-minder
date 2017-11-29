function getAvatars() {
  $.ajax({
    method: 'GET',
    url: '/api/users/avatar',
    success: displayAvatarCollection,
    error: error => {
      console.log(error);
      console.log('Unable to get avatar collection');
    }
  });
}

function displayAvatarCollection(result) {
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
  $('#avatar-form').submit(event => {
    event.preventDefault();
    let selectedAvatarData = {avatarId: $('input[name=my-avatar]:checked', '#avatar-form').val()};
    $.ajax({
      method: 'PATCH',
      url: '/api/user/' + payloadData.userId,
      data: selectedAvatarData,
      headers: {
        Authorization: token
      },
      success: () =>
        {
          alert('User data changed, please log in.');
          sessionStorage.removeItem('token');
          location.href='/login.html';
        },
        error: error => {
        console.log(error);
        console.log('Error selecting avatar');
      }
    })
  })
}

$(function() {
  getAvatars();
  listenForAvatarSelection();
});
