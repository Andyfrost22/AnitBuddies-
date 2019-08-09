// var AWS = require('aws-sdk');
// var uuid = require('uuid');
// var sha256 = require('js-sha256');

//AWS configurations
AWS.config.update({region:'us-east-2'});
AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: 'us-east-2:ae65310a-354d-4f4b-a770-e5d13c2cc74e'});

var lambda = new AWS.Lambda({region: 'us-east-2', apiVersion: '2015-03-31'});


//variables that hold lambda responses
var responseVal;
var loginResponse;
var isLoggedIn = false;
var user;
var getUserPromise;
var firstName;
var lastName;
var userName;
var password;
var newUserResponse;
var isLoading;
var passToStore;


  //init
  window.onload = function() {
    // inititally hide the user welcome
    document.getElementById("user_div").style.display = "none";


      if (isLoggedIn) {
        document.getElementById("user_div").style.display = "block";
        document.getElementById("login_form").style.display = "none";

        if(user != null){
          var user_name = user.userName;
          document.getElementById("user_para").innerHTML = "User Name : " + user_name;
        }

      } else {
      // No user is signed in.
        document.getElementById("user_div").style.display = "none";

      }

  }


  function getUser(userID) {

    var tempUser;

    // create JSON object for getUser
    var getUserParams = {
      FunctionName : "getUserWeb",
      InvocationType : "RequestResponse",
      LogType : "None",
      Payload : '{"ID":"'+String(userID)+'"}',
    };

    var getUserPromise = new Promise((resolve, reject) => {
      lambda.invoke(getUserParams, function(error, data) {
        if (error) {
          prompt(error, error.stack);
          reject();
        } else {
          responseVal = JSON.parse(data.Payload);
          user = responseVal[0];
          resolve(user);
        }
      });
    })

    getUserPromise
    .then(function(user) {
      console.log("User: "+user);
      document.getElementById("getUserFirst").innerHTML = "Welcome " + String(getUserFirstName(user));

      //just calling in user here because of async function happening when getting user
      directAfterLogin(user);
    }, function() {
        console.log("failed");
    })
    if (tempUser) {
      return tempUser;
    }

  }

  function getUserFirstName(user) {
    return user.firstName;
  }


function login(){

  isLoading = true;

  //get login input values
  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  //run a sha256 on the password so we can query it
  var passHash = sha256(userPass);

  // create JSON object for loginParams
  var loginParams = {
    FunctionName : "loginUser",
    InvocationType : "RequestResponse",
    LogType : "None",
    Payload : '{"username":"'+String(userEmail)+
              '","password":"'+String(passHash)+'"}',
  };

  lambda.invoke(loginParams, function(error, data) {
    if (error) {
      prompt(error, error.stack);
    } else {
      console.log('data: '+ data.Payload);
      loginResponse = JSON.parse(data.Payload);

      //if login was successful
      if (loginResponse.response) {
        userID = loginResponse.ID;
        console.log("UserID: " + userID);
        getUser(userID);
      }
      else {
        //wrong login information
        //TODO: Raise error
        document.getElementById("user_div").style.display = "none";
      }
    }
  });

  isLoading = false;
}


function addUser() {

  //get all input values
  firstName = document.getElementById("first_name_field").value;
  lastName = document.getElementById("last_name_field").value;
  userName = document.getElementById("user_name_field").value;
  password = document.getElementById("create_password_field").value;
  //debugger;
  passToStore = sha256(password);


  var addUserParams = {
    FunctionName : "createUser",
    InvocationType : "RequestResponse",
    LogType : "None",
    Payload : '{"firstName":"'+String(firstName)+
                '","lastName":"'+String(lastName)+
                '","username":"'+String(userName)+
                '","password":"'+String(passToStore)+
                '"}',
  };

  lambda.invoke(addUserParams, function(error, data) {
    if (error) {
      prompt(error, error.stack);
      document.getElementById("user_div").style.display = "none";
      //TODO: Show create user error
    } else {
      console.log('newUser: '+ data.Payload);
      newUserResponse = JSON.parse(data.Payload);
      user = newUserResponse;
      var modal = document.getElementById("newuser_div");
      modal.style.display = "none";//this is leaving the back blackground - can't click on anything
      directAfterLogin(user);
    }
  });

}

function directAfterLogin(user) {

  isLoggedIn = true;

  if (user.isAdmin) {
    window.location.href="admin.html";
  } else {
    document.getElementById("user_div").style.display = "block";
    document.getElementById("login_form").style.display = "none";
  }

}

function admin(){
  window.location.href="admin.html";
}

function practiceQuestions(){
  window.location.href="quiz.html";
}

function courses(){
  window.location.href="courses.html";
}

function immunhematology(){
  window.location.href="Immunhematology.html";
}

function chemistry(){
  window.location.href="chemistry.html";
}

function home(){
  window.location.href="home.html";
}

function logout(){
  firebase.auth().signOut();
}

function newPanel(){
  window.location.href="admin-grid.html";
}

function newQuestion() {
  window.location.href="admin-quiz.html";
}

function antigram(){
  window.location.href="grid.html";
}

function beginner(){
  window.location.href="panel.html"
}

function intermediate(){
  window.location.href="panel.html";
}

function advanced(){
  window.location.href="panel.html";
}

function quiz(){
  window.location.href="quiz.html";
}

