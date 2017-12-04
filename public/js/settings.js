function displayChangeAvatar() {
  $('#change-avatar-window').prepend(`
    <img src="${payloadData.avatarUrl}">`)
}

function listenForSettingsChanges() {
  $('#settings').submit(event => {
    event.preventDefault();
    if (!($('#change-password').val() == $('#change-password2').val())) {
      return alert('Passwords do not match, please try again')
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
      alert(result.message);
      location.href='/login.html'
    },
    error: error => {
      console.log(error);
      alert(error.responseJSON.message);
      location.href='/settings.html'
    },
  };
  $.ajax(updatedUser);
}


$(() => {
  displayChangeAvatar();
  listenForSettingsChanges();

});
