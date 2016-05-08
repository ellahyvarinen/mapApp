# mapApp

##What is Mapper?
Log in with Facebook to locate yourself and add a marker to the map based on your location. Marker information consists of the place name, optional notes, coordinates, your name and Facebook user ID.

##Code Example
Here is example how to add Mapbox map to your app by using leaflet Javascript library. This example shows how to locate yourself and add a marker based on your location.
```
HTML
<div id="map"></div>

CSS
#map {
	height: 300px;
}

JavaScript
//Map layer
var mymap = L.map('map');
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 10,
    id: 'your_id',
    accessToken: 'your_access_token'
}).addTo(mymap);

//Locate the user and set the map view
mymap.locate({
    setView: true,
    maxZoom: 10
});
mymap.on('locationfound', onLocationFound);

//Add marker based on user's location
function onLocationFound(e) {
    L.marker(e.latlng).addTo(mymap).bindPopup('<b>You are here</b><p>Latitude ' + e.latitude + '<br>Longitude ' + e.longitude + '</p>').openPopup();
}
```
##API Reference
- Facebook API for developers
- Bootstrap
- Leaflet.js
- Mapbox
- Google Sheets as a database

##Installation
`git clone https://github.com/ellahyvarinen/mapApp.git`

##License
The MIT License (MIT)

Copyright (c) 2016 Ella Hyvärinen
