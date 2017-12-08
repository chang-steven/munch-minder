let token, payloadData;

function parseJwt (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

function displayAvatar() {
  $('#user-avatar-window').prepend(`
    <img src="${payloadData.avatarUrl}">
    <a href="javascript: logOut()">Log Out</a>`);
}

function showMessage(message, isError) {
  const className = isError ? 'error' : 'success';
  $('.message').removeClass('error', 'success')
               .addClass(className)
               .text(message).slideDown();
  setTimeout(function () {
    $('.message').slideUp();
  }, 2000);
}

function popupMessage(response, redirect) {
    var modal = document.getElementById('myModal');
    modal.style.display = "block";
    $('.modal-content').append(`
      <p>${response.message}</p>
      <button id="ok-button">Ok</button>`);
    (function() {
      $('#ok-button').click(function() {
        modal.style.display = "none";
        location.href = redirect;
      })
    })()
  }

function logOut() {
  sessionStorage.removeItem('token');
  location.href='/login.html';
}
