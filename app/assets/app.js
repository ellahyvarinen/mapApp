'use strict';

//Map layer
var mymap = L.map('mapid');
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 10,
    id: 'ellahyvarinen.pp8fe87e',
    accessToken: 'pk.eyJ1IjoiZWxsYWh5dmFyaW5lbiIsImEiOiJjaW5md3I3bWcwMDg3dzRseGdidDR6dWNxIn0.BEptiAhxiXNJZAexSRNurQ',
    layers: [myPlaces]
}).addTo(mymap);

//Layer groups and layer control
var myPlaces = new L.LayerGroup();
var overlayMaps = {
    "My Places": myPlaces
};
L.control.layers(null, overlayMaps).addTo(mymap);

//Get user's coordinates to form
if (window.navigator.geolocation) {
    window.navigator.geolocation.watchPosition(showPosition);
} else {
    window.alert('Geolocation is not supported by this browser.');
}

function showPosition(position) {
    var latitude = position.coords.latitude.toFixed(5);
    var longitude = position.coords.longitude.toFixed(5);
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
    L.marker(e.latlng).addTo(mymap);
    console.log('Location found!');
}

//Send form data to database
function sendDataToDB() {

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
$.ajax({
    url: 'https://spreadsheets.google.com/feeds/list/1Bo7vikiwIG8v3cINZd9MZRIQuGNrrvUwaxs9ubPNlrU/1/public/basic?alt=json',
    type: "GET",
    dataType: "json",
    success: function(data) {
        console.log(data);
        getDataFromDB(data);
    }
});

function getDataFromDB(data) {
    var rows = [];
    var cells = data.feed.entry;
		//Process the data
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
        if (rowObject.username == 'Ella Hyvärinen') {
            var newMarker = L.marker([latitude, longitude]).addTo(myPlaces).bindPopup('<b>' + placename + '</b><br><p>' + note + '<br><br>' + timestamp + '</p>');
            console.log(rowObject);
            console.log('Marker added!');
        }
    }
}
