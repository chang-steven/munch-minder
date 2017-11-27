const USER_REGISTER_URL = 'http://localhost:8080/api/user/';

function listenForNewUserRegistration() {
  console.log('Now listening for New Registration');
  $('#register').submit(event => {
    event.preventDefault();
    console.log('Attempted User Registration');
    if (!($('#register-password').val() == $('#register-password2').val())) {
      return alert('Passwords do not match, please try again')
    }
    else {
    let newRegistration = {
      email: $('#register-email').val(),
      username: $('#register-username').val(),
      password: $('#register-password').val()
    };
    $('#register-email').val("");
    $('#register-username').val("");
    $('#register-password').val("");
    registerNewUser(newRegistration);
  }
  })
}

function registerNewUser(user) {
  let newUser = {
    type: 'POST',
    url: USER_REGISTER_URL,
    data: user,
    success: result => {
      alert(result.message);
      location.href='/login.html'
    },
    error: error => {
      console.log(error);
      alert('Sorry, there was an error, try again...');
      location.href='/register.html'
    },
  };
    $.ajax(newUser);
}

$(listenForNewUserRegistration);
