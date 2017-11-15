const USER_REGISTER_URL = 'http://localhost:8080/api/user/';
const USER_LOGIN_URL = 'http://localhost:8080/api/login';

function listenForNewUserRegistration() {
  console.log('Now listening for new registration');
  $('#register').submit(event => {
    console.log('Attempted User Registration');
    event.preventDefault();
    let newRegistration = {
      email: $('#register-email').val(),
      username: $('#register-username').val(),
      password: $('#register-password').val()
    };
    registerNewUser(newRegistration);
  })
}

function registerNewUser(user) {
  let newUser = {
    type: 'POST',
    url: USER_REGISTER_URL,
    data: user,
    success: displayNewUser,
    error: errorHandler
  };
  console.log(newUser);
    $.ajax(newUser);
  // return new Promise(
  //   (resolve, reject) => {
  //     $.ajax(newUser);
  //     resolve();
  //     reject(new Error(msg))
  //   })
}

function listenForLogin() {
  console.log('Now listening for login');
  $('#login').submit(event => {
    console.log('Attempted Login');
    event.preventDefault();
    let user = {
      username: $('#login-username').val(),
      password: $('#login-password').val()
    };
    $.ajax({
      type: 'POST',
      url: USER_LOGIN_URL,
      data: user,
      success: displayResult,
      error: errorHandler
    })
  })
}

function errorHandler(err) {
  console.error('There was an error');
  console.log(err);
  alert(err);
}

function displayResult(result) {
  alert(result.message);
  console.log(result);
}

function app() {
  listenForNewUserRegistration();
  listenForLogin();
}

$(app);
