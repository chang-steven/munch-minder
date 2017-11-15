const USER_REGISTER_URL = 'http://localhost:8080/api/user';
const USER_LOGIN_URL = 'http://localhost:8080/api/login';
const MUNCH_POST_URL = 'http://localhost:8080/api/munches';

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
      url: MUNCH,
      data: user,
      success: displayResult,
      error: errorHandler
    })
  })
}

function listenForMunch() {
  console.log('Now listening for Munch');
  $('#munch-form').submit(event => {
    console.log('Attempted Munch Log');
    event.preventDefault();
    let munch = {
      date: $('#munch-date').val(),
      title: $('#munch-title').val(),
      description: $('#munch-description').val()
    };
    $.ajax({
      type: 'POST',
      url: MUNCH_POST_URL,
      data: munch,
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
  listenForMunch();
}

$(app);
