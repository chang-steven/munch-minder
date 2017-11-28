function listenForLogin() {
  console.log('Now listening for Login');
  $('#login').submit(event => {
    console.log('Attempted Login');
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
        alert(result.message);
        location.href='/dashboard.html'
      },
      error: error => {
        alert('Sorry, there was an error, try again...');
        location.href='/login.html'
      },
    })
  })
}

$(listenForLogin());
