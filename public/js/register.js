let newRegistration;

function listenForNewUserRegistration() {
  $('#register').submit(event => {
    event.preventDefault();
    if (!($('#register-password').val() == $('#register-password2').val())) {
      return showMessage('Passwords do not match, please try again', true)
    }
    else {
      newRegistration = {
        email: $('#register-email').val(),
        username: $('#register-username').val(),
        password: $('#register-password').val()
      };
      $('#register-email').val("");
      $('#register-username').val("");
      $('#register-password').val("");
      $('#register-password2').val("");
      var modal = document.getElementById('myModal');
      modal.style.display = "block";
    }
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

function registerNewUser(user) {
  let newUser = {
    type: 'POST',
    url: '/api/user',
    data: user,
    success: result => {
      location.href='/login.html'
    },
    error: error => {
      var modal = document.getElementById('myModal');
      modal.style.display = "none";
      popupMessage('Sorry, there was an error, try again...', '/register.html');
    },
  };
  $.ajax(newUser);
}

function getAvatars() {
  $.ajax({
    method: 'GET',
    url: '/api/users/avatar',
    success: displayAvatarCollection,
    error: error => {
      console.log('Unable to get avatar collection');
    }
  });
}


function displayAvatarCollection(result) {
  $('#avatar-collection').empty().append(`<div class="avatar-banner"><h1>Choose your avatar</h1>
    <div id="avatar-button"><input type="submit" name="submit" value="I'm Done!"></div></div>`);
  result.forEach(avatar => {
  $('#avatar-collection').append(
    `<div class="avatar-window">
      <img src="${avatar.url}" alt="${avatar.name}">
      <div class="avatar-radio"><input value="${avatar._id}" type="radio"
       name="my-avatar" required></div>
    </div>`
    );
  });
}

function listenForAvatarSelection() {
  $('#avatar-form').submit(event => {
    event.preventDefault();
    newRegistration.avatar = $('input[name=my-avatar]:checked', '#avatar-form').val();
    registerNewUser(newRegistration);
  })
}

function popupMessage(message, redirect) {
    var modal = document.getElementById('myErrorModal');
    modal.style.display = "block";
    $('.error-modal-content').append(`
      <p>${message}</p>
      <button id="ok-button">Ok</button>`);
    (function() {
      $('#ok-button').click(function() {
        modal.style.display = "none";
        location.href = redirect;
      })
    })()
  }

$(() => {
  listenForNewUserRegistration();
  getAvatars();
  listenForAvatarSelection();

})
