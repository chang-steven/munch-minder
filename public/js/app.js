const USER_REGISTER_URL = 'http://localhost:8080/api/user';
const USER_LOGIN_URL = 'http://localhost:8080/api/login';
const MUNCH_POST_URL = 'http://localhost:8080/api/munches';


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
      alert('Sorry, there was an error, try again...');
      location.href='/register.html'
    },
  };
  console.log(newUser);
    $.ajax(newUser);
}



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
      url: USER_LOGIN_URL,
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
      headers: {
        Authorization: sessionStorage.getItem('token')
      },
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
  location.href='/munches.html'
}

function app() {
  listenForNewUserRegistration();
  listenForLogin();
  listenForMunch();
}

$(app);
