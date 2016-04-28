'use strict';

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the app know the current login status of the person.
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        testAPI();
    } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app
        document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
    } else {
        // The person is not logged into Facebook, so we're not sure if they are logged into this app or not.
        document.getElementById('status').innerHTML = 'Please log ' + 'into Facebook.';
    }
}

// This function is called when someone finishes with the Login Button. 
// See the onlogin handler attached to it in the sample code below.
function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

window.fbAsyncInit = function() {
    FB.init({
        appId: '1591917047790330',
        cookie: true, // enable cookies to allow the server to access the session
        xfbml: true, // parse social plugins on this page
        version: 'v2.5' // use graph api version 2.5
    });
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
};
// Load the SDK asynchronously
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Here we run a very simple test of the Graph API after login is successful.
function testAPI() {
    console.log('Welcome! Fetching your information... ');
    FB.api('/me', function(response) {
        console.log('Successful login for: ' + response.name);
        //Create user status & logout-button
        document.getElementById('status').innerHTML =
            '<i class="fa fa-user" aria-hidden="true"></i> ' + response.name + '<button onclick="logout()" id="log-out-button" class="btn btn-default btn-sm">Log out</button>';
        //Remove fb-login-button
        var child = document.getElementById('login-button');
        child.parentNode.removeChild(child);
    });
}

function logout() {
    FB.logout(function(response) {
        console.log('User logged out');
        //Remove user status & logout-button
        var userStatus = document.getElementById('status');
        userStatus.parentNode.removeChild(userStatus);
        //Create fb-login-button
        document.getElementById('login').innerHTML = '<div class="fb-login-button" id="login-button" scope="public_profile,email" onlogin="checkLoginState();" data-size="large"></div>';
        console.log('all done!');
    });
}