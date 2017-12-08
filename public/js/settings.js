function displayChangeAvatar() {
  $('#change-avatar-window').prepend(`
    <img src="${payloadData.avatarUrl}">`)
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
    var modal = document.getElementById('myErrorModal');
    modal.style.display = "block";
    $('.error-modal-content').append(`
      <p>${message}</p>
      <button id="ok-button">Ok</button>`);
    (function() {
      $('#ok-button').click(function() {
        modal.style.display = "none";
        location.href = redirect;
      })
    })()
  }

$(function() {
  token = sessionStorage.getItem('token');
  if (token) {
    payloadData = parseJwt(token);
    displayChangeAvatar();
    displayAvatar();
    listenForSettingsChanges();
    $('#loader').fadeOut();
}
    else {
      alert("Sorry, you're not logged in");
      location.href='/login.html';
    }
});
