'use strict';

$(function() {

    var mymap = L.map('mapid').setView([51.505, -0.09], 10);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'ellahyvarinen.pp8fe87e',
        accessToken: 'pk.eyJ1IjoiZWxsYWh5dmFyaW5lbiIsImEiOiJjaW5md3I3bWcwMDg3dzRseGdidDR6dWNxIn0.BEptiAhxiXNJZAexSRNurQ'
    }).addTo(mymap);

    $('.location').on('click', function() {
        mymap.locate({
            setView: true,
            maxZoom: 15
        });
    });

    mymap.on('locationfound', onLocationFound);

    function onLocationFound(e) {
        console.log(e);
        L.marker(e.latlng).addTo(mymap).bindPopup("<b>You are here</b>").openPopup();
        console.log(e.latlng);
    }

    /*
    $('.newMarker').on('click', function(e) {
    	mymap.on('locationfound', onLocationFound);
    	L.marker(e.latlng).addTo(mymap).bindPopup("<b>Test</b>").openPopup();
    });

    var marker = L.marker([60.1, 24.5]).addTo(mymap);
    marker.bindPopup("<b>Hello world!</b><br>#NewsByTwitter").openPopup();

    var popup = L.popup()
    	.setLatLng([60.1, 24.5]);
      //.setContent("#NewsByTwitter")
      //(.openOn(mymap);
    	*/
});