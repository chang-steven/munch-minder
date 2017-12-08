function listenForLoginHelp() {
  $('#login-help').submit(event => {
    event.preventDefault();
    let email = $('#user-email').val();
    $.ajax({
      type: 'GET',
      url: '/api/findbyemail?email=' + email,
      success: result => {
        showMessage(result.message);
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

$(listenForLoginHelp())
