'use strict';

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

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the app know the current login status of the person.
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        login();
        addLayersToMap();
        getDataFromDB();
    } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app
        document.getElementById('login').innerHTML = '<h5 class="logInText">Log in</h5>&nbsp;&nbsp;&nbsp;<div class="fb-login-button" id="login-button" scope="public_profile,email" onlogin="checkLoginState();" data-size="icon"></div>';
    } else {
        // The person is not logged into Facebook, so we're not sure if they are logged into this app or not.
        document.getElementById('login').innerHTML = '<h5 class="logInText">Log in</h5>&nbsp;&nbsp;&nbsp;<div class="fb-login-button" id="login-button" scope="public_profile,email" onlogin="checkLoginState();" data-size="icon"></div>';
    }
}

// This function is called when someone finishes with the Login Button.
function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

//Run a simple test of the Graph API after login is successful
function login() {
    console.log('Welcome! Waiting for your information... ');
    FB.api('/me', function(response) {
        console.log('Successful login for: ' + response.name);
        console.log(response);

        //Create user status & logout-button
        document.getElementById('status').innerHTML =
            '<i class="fa fa-user fa-2x" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;<h5 id="status-username">' + response.name + '</h5><br><button onclick="logout()" id="log-out-button" class="btn btn-default">Log out</button>';

        //Make form visible
        document.getElementById('createMarkerForm').style.visibility = "visible";

        //Add Username to form
        var newMarkerForm = document.getElementById('createMarkerForm');
        var inputName = document.createElement("input");
        inputName.type = "text";
        inputName.name = "UserName";
        inputName.id = "formUser";
        inputName.style = "visibility: hidden;";
        inputName.value = response.name;
        newMarkerForm.insertBefore(inputName, newMarkerForm.childNodes[0]);
        console.log('Username added to form!');

        //Add UserID to form
        var inputID = document.createElement("input");
        inputID.type = "text";
        inputID.name = "UserID";
        inputID.id = "formUserID";
        inputID.style = "visibility: hidden;";
        inputID.value = response.id;
        newMarkerForm.insertBefore(inputID, newMarkerForm.childNodes[1]);

        //Remove fb-login-button
        document.getElementById('login').innerHTML = '';
    });
}

function logout() {
    FB.logout(function(response) {

        //Remove user status & logout-button
        var userStatus = document.getElementById('status');
        userStatus.parentNode.removeChild(userStatus);

        //Create fb-login-button
        document.getElementById('login').innerHTML = '<h5 class="logInText">Log in</h5>&nbsp;&nbsp;&nbsp;<div class="fb-login-button" id="login-button" scope="public_profile,email" onlogin="checkLoginState();" data-size="icon"></div>';

        //Make form hidden
        document.getElementById('createMarkerForm').style.visibility = "hidden";
        console.log('User logged out!');
    });
}

//Create base map layer
var mymap = L.map('mapid');
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 10,
    id: 'ellahyvarinen.pp8fe87e',
    accessToken: 'pk.eyJ1IjoiZWxsYWh5dmFyaW5lbiIsImEiOiJjaW5md3I3bWcwMDg3dzRseGdidDR6dWNxIn0.BEptiAhxiXNJZAexSRNurQ',
    layers: [myPlaces]
}).addTo(mymap);

//Get user's coordinates
if (window.navigator.geolocation) {
    window.navigator.geolocation.watchPosition(getCoordinates);
} else {
    window.alert('Geolocation is not supported by this browser.');
}

function getCoordinates(position) {
    var latitude = position.coords.latitude.toFixed(5);
    var longitude = position.coords.longitude.toFixed(5);
    //Add coordinates to form
    $('#formLatitude').val(latitude);
    $('#formLongitude').val(longitude);
}

//Locate the user and set the map view
mymap.locate({
    setView: true,
    maxZoom: 10
});
mymap.on('locationfound', onLocationFound);

//Add marker based on user's location
function onLocationFound(e) {
    console.log(e);
    L.marker(e.latlng).addTo(mymap).bindPopup('<b>Your location</b><p>Latitude ' + e.latitude + '<br>Longitude ' + e.longitude + '</p>');
    console.log('Location found and marker added!');
}

//Layer groups
var myPlaces = new L.LayerGroup();
var allPlaces = new L.LayerGroup();
var overlayMaps = {
    "My Places": myPlaces,
    "All places": allPlaces
};

function addLayersToMap() {
    //Add layer control to the map
    L.control.layers(null, overlayMaps).addTo(mymap);
    console.log('Layers added to the map');
}

//Send form data to database
function sendDataToDB() {

    //Collect data from form
    var placeName = $('#formName').val();
    var note = $('#formDescription').val();
    var latitude = $('#formLatitude').val();
    var longitude = $('#formLongitude').val();
    var userName = $('#formUser').val();
    var userID = $('#formUserID').val();

    console.log('Place name: ' + placeName);
    console.log('Note: ' + note);
    console.log('Latitude: ' + latitude);
    console.log('Longitude: ' + longitude);
    console.log('User name: ' + userName);
    console.log('User ID: ' + userID);

    //Send data to DB
    $.ajax({
        url: "https://docs.google.com/forms/d/18ymLe_gWmaHiEZKYUxnVmGB5ItKqc4fOeum1EEpGj1Y/formResponse",
        type: "POST",
        dataType: "xml",
        data: {
            "entry.1550552479": placeName,
            "entry.1866528485": note,
            "entry.1208890182": latitude,
            "entry.709367535": longitude,
            "entry.1655780962": userName,
            "entry.1377639871": userID
        }
    });
}

//Get data from database
function getDataFromDB() {
    $.ajax({
        url: 'https://spreadsheets.google.com/feeds/list/1Bo7vikiwIG8v3cINZd9MZRIQuGNrrvUwaxs9ubPNlrU/1/public/basic?alt=json',
        type: "GET",
        dataType: "json",
        success: function(data) {
            console.log(data);
            handleDataFromDB(data);
        }
    });
}

//Process the data and add markers to the map
function handleDataFromDB(data) {
    var rows = [];
    var cells = data.feed.entry;

    for (var i = 0; i < cells.length; i++) {
        var rowObject = {};
        rowObject.timestamp = cells[i].title.$t;
        var rowCols = cells[i].content.$t.split(',');
        for (var j = 0; j < rowCols.length; j++) {
            var keyValue = rowCols[j].split(':');
            rowObject[keyValue[0].trim()] = keyValue[1].trim();
        }
        rows.push(rowObject);
        var latitude = JSON.parse(rowObject.latitude);
        var longitude = JSON.parse(rowObject.longitude);
        var timestamp = rowObject.timestamp;
        var placename = rowObject.placename;
        var note = rowObject.note;
        //Get username
        var usernameValue = $('#formUser').val();
        console.log('Username value: ' + usernameValue);
        //Add logged user's markers to the map
        if (rowObject.username == usernameValue) {
            var myPlaceMarker = L.marker([latitude, longitude]).addTo(myPlaces).bindPopup('<b>' + placename + '</b><br><p>' + note + '<br><br>' + timestamp + '</p>');
            console.log(rowObject);
            console.log('Marker added!');
        } else { //Add all markers to the map
            var allPlacesMarker = L.marker([latitude, longitude]).addTo(allPlaces).bindPopup('<b>' + placename + '</b><br><p>' + note + '<br><br>' + rowObject.username + '<br>' + timestamp + '</p>');
        }
    }
}