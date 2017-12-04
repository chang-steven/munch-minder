let token, payloadData;

function parseJwt (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

function displayAvatar() {
  console.log('Now displaying avatar');
  $('#user-avatar-window').empty().append(`
    <img src="${payloadData.avatarUrl}">
    <a href="javascript: logOut()">Log Out</a>`);
}

function logOut() {
  sessionStorage.removeItem('token');
  location.href='/login.html';
}

$(function() {
  token = sessionStorage.getItem('token');

  if (token) {
    payloadData = parseJwt(token);
    displayAvatar();
    setTimeout(function () {
      $('#loader').fadeOut();
    }, 1000);
  }
  else {
    alert("Sorry, you're not logged in");
    location.href='/login.html';
  }
})
