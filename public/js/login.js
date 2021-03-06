function listenForLogin() {
  $('#login').submit(event => {
    event.preventDefault();
    let user = {
      username: $('#login-username').val(),
      password: $('#login-password').val()
    };
    $('#login-username').val("");
    $('#login-password').val("");
    $.ajax({
      type: 'POST',
      url: '/api/login',
      data: user,
      success: result => {
        sessionStorage.setItem('token', result.token);
        location.href='/dashboard.html'
      },
      error: error => {
        showMessage('Sorry, there was an error, try again...', true);
      },
    })
  })
}

function listenForDemoLogin() {
  $('#demo-login').click(event => {
    event.preventDefault();
    const demoUser = {
      username: 'sam_i_am',
      password: 'test1234'
    };
    $.ajax({
      type: 'POST',
      url: '/api/login',
      data: demoUser,
      success: result => {
        sessionStorage.setItem('token', result.token);
        location.href='/dashboard.html'
      },
      error: error => {
        showMessage('Sorry, there was an error, try again...', true);
      },
    })
  })
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

$(function() {
  listenForLogin();
  listenForDemoLogin();
});
