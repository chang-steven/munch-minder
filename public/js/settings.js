function displayChangeAvatar() {
  $('#change-avatar-window').prepend(`
    <img src="${payloadData.avatarUrl}">`);
    $('#myBtn').click(function(event) {
      event.preventDefault();
      $('#myModal').show();
      $('.close').click(() => $('#myModal').hide());
    })
}

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
       name="my-avatar" required></div>
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
          sessionStorage.removeItem('token');
          $('#myModal').hide();
          popupMessageMod('User data changed, please log in.', '/login.html');
        },
        error: error => {
        console.log(error);
        console.log('Error selecting avatar');
      }
    })
  })
}


function listenForSettingsChanges() {
  $('#settings').submit(event => {
    event.preventDefault();
    if (!($('#change-password').val() == $('#change-password2').val())) {
      return showMessage('Passwords do not match, please try again', true)
    }
    else {
      let data = $('#settings').serializeArray().reduce(function(obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});
      $('#change-email').val("");
      $('#change-username').val("");
      $('#change-password').val("");
      $('#change-password2').val("");
      $('#current-password').val("");
      updateUserData(data);
    }
  })
}

function updateUserData(user) {
  let updatedUser = {
    method: 'PUT',
    headers: {
      Authorization: token
    },
    url: '/api/user/' + payloadData.userId,
    data: user,
    success: result => {
      popupMessageMod(result.message, '/login.html');
    },
    error: error => {
      showMessage(error.responseJSON.message);
    },
  };
  $.ajax(updatedUser);
}

function popupMessageMod(message, redirect) {
    $('#myErrorModal').show();
    $('.error-modal-content').append(`
      <p>${message}</p>
      <button id="ok-button">Ok</button>`);
      $('#ok-button').click(function() {
        $('#myErrorModal').hide();
        location.href = redirect;
      })
  }

$(function() {
  token = sessionStorage.getItem('token');
  if (token) {
    payloadData = parseJwt(token);
    displayChangeAvatar();
    displayAvatar();
    getAvatars();
    listenForAvatarSelection();
    listenForSettingsChanges();
    $('#loader').fadeOut();
}
    else {
      alert("Sorry, you're not logged in");
      location.href='/login.html';
    }
});
