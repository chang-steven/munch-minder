const USER_REGISTER_URL = 'http://localhost:8080/api/user';

function listenForNewUserRegistration() {
  console.log('Now listening for New Registration');
  $('#register').submit(event => {
    console.log('Attempted User Registration');
    event.preventDefault();
    let newRegistration = {
      email: $('#register-email').val(),
      username: $('#register-username').val(),
      password: $('#register-password').val()
    };
    $('#register-email').val("");
    $('#register-username').val("");
    $('#register-password').val("");
    registerNewUser(newRegistration);
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
