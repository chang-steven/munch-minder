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
      let updatedUser = {
        email: $('#change-email').val(),
        username: $('#change-username').val(),
        password: $('#change-password').val()
      };
      $('#change-email').val("");
      $('#change-username').val("");
      $('#change-password').val("");
      $('#change-password2').val("");
      registerNewUser(updatedUser);
    }
  })
}

$(() => {
  displayChangeAvatar();
  listenForSettingsChanges();

});
