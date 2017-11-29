function listenForLoginHelp() {
  $('#login-help').submit(event => {
    event.preventDefault();
    let email = $('#user-email').val();
    $.ajax({
      type: 'GET',
      url: '/api/findbyemail?email=' + email,
      success: result => {
        alert(result.message);
        location.href='/login.html'
      },
      error: error => {
        alert('Sorry, there was an error, try again...');
        location.href='/help.html'
      },
    })
  })
}

$(listenForLoginHelp())
