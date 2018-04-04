
//enables cors in get request
jQuery.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});


/*Yelp api authentication 
Generated using 'Postman' app*/
//added acess-conreol-allow-origin to enable cors-anywhere

function testYelpApi(cb){
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://api.yelp.com/v3/businesses/search?term=delis&latitude=53.3498053&longitude=-6.2603097",
  "method": "GET",
  "headers": {
    "authorization": "Bearer UTSSHcFmhNyctmBOeWKD2eeg9GV_LRkqsdjDa3Q_WkwvGywmY0cxtFDWQt1ib4lgRiE1y9l0_uRPdU6O4fY1rn164iomb6Y7_wR9G-Ii3WPWScwM5UWBZaPSz3LCWnYx",
    "access-control-allow-origin": "*",
    "cache-control": "no-cache",
    "postman-token": "c6fca5f7-e9ee-017f-8b66-d13a9884ec6d"
  }
}

$.ajax(settings).done(function (response) {
  cb(response);

});
};

var yelpResponse = {};

var locations = [];


testYelpApi(function(data){
  yelpResponse = data;
  pushToLocations();
  initAutocomplete();
});




let pushToLocations = function () {
  console.log(yelpResponse);
  for (var i = 0; i < yelpResponse.businesses.length; i++){
    locations.push({ //must be called "lat" and "lng"
    lat: yelpResponse.businesses[i].coordinates.latitude,
   lng: yelpResponse.businesses[i].coordinates.longitude,
   });
  } console.log(locations);
};



 //Search bar. 
 // Orginal code from: https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
 
   function initAutocomplete() {
        var map = new google.maps.Map(document.getElementById('map'), {
           zoom: 15,
         center: {
             lat: 53.3498053,
             lng: -6.2603097
         },
          mapTypeId: 'roadmap'
        });

        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        var labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

   
      var marker, i; 

      for (i = 0; i < locations.length; i++){
        marker = new google.maps.Marker({
          position: locations[i],
          map : map ,
          title : yelpResponse.businesses[i].name

      })
      let name = yelpResponse.businesses[i].name;
      marker.addListener('click', function() {
        $("#onClickContent").html(name);
        
        /*map.setZoom(20);
        map.setCenter(marker.getPosition());*/
      });
    };
      
      
 
       /* var yelpMarkers = locations.map(function(location, i) {
            return new google.maps.Marker({
                position: location,
                label: labels[i % labels.length],
                animation: google.maps.Animation.DROP,
                title:"Hello World!"
            })

        }); */

     

/*
//my code for adding click events to marker clustrt
google.maps.event.addListener(markerCluster, 'clusterclick', function(cluster) {
  map.setZoom(50);
  map.setCenter(marker.getPosition());
});
      
*/


        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));



          

            

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
          
          

        });
      };
 
 
