'use strict';

$(function() {

    //Map layer
    var mymap = L.map('mapid');
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'ellahyvarinen.pp8fe87e',
        accessToken: 'pk.eyJ1IjoiZWxsYWh5dmFyaW5lbiIsImEiOiJjaW5md3I3bWcwMDg3dzRseGdidDR6dWNxIn0.BEptiAhxiXNJZAexSRNurQ'
    }).addTo(mymap);

    //GeoJson layer
    var geoJsonLayer = L.geoJson().addTo(mymap);
    //geoJsonLayer.addData(geojsonFeature);
		/*
		//GeoJSon Layer
		var myGeoJsonLayer = L.geoJson().addTo(mymap);
		myGeoJsonLayer.addData(geojsonFeature);
		console.log('Marker added!');
		*/

    //Locate the user
    mymap.locate({
        setView: true,
        maxZoom: 15
    });
    mymap.on('locationfound', onLocationFound);

    //Add marker based on user's location
    function onLocationFound(e) {
        console.log(e);
        console.log(e.timestamp);
        console.log(e.timestamp * 1000);

        L.marker(e.latlng).addTo(mymap).bindPopup('<b>You are here</b><br/><br/>' + e.latitude + '<br/>' + e.longitude + '<br/>' + e.timestamp + '<br/>');

    }

    //Add new marker
		//<button class="add-marker-button btn btn-default">Add marker</button>
    $('.add-marker-button').on('click', function() {
        console.log('Marker button clicked!');
    });


    $('#createMarkerForm').submit(function(e) {
        var formData = {
            method: "POST",
            dataType: "json",
            url: '',
            success: function(resp) {
                console.log(resp);
                location.reload();
            }
        };
        e.preventDefault();
        $(this).ajaxSubmit(formData);
    });


});

