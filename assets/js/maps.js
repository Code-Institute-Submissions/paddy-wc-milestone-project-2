//enables cors in get request
jQuery.ajaxPrefilter(function (options) {
  if (options.crossDomain && jQuery.support.cors) {
    options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
  }
});



//initial centre of map
var currentLat = 53.3498053;
var currentLng = -6.2603097;


//filters terms for yep search. 
var foodAndDrink = "food,bars";
var activities = "streetart,racetracks,sportsteams,theater,opera,museums,festivals,culturalcenter,countryclubs,castles,cabaret,gardens,galleries,active,tours";
var accommodation = "guesthouses,campgrounds,hostels,hotels";

//icons to appear as markers on map
var foodIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGUSURBVFhH7ZHNLgRBEIDnLk5Ewns42O4hJBsx3ct6F/8n3sjPFRfi6iXs9MYKFw4SQVVvzVhVme3t5SLmSzqZqv6quqY7qakpcFZ/jLOovKynMBgLCiF2UfnvDUBhEO7HxoKgwOB+bCwICgzux8aCoMDgfmwsCAoM7sfGgqDA4H5sLAgKDO7HxgJn9IuXms0JSlXSW29Moptb9UypBL8xd7+azmLsjLqGnlf4jTnuC0C49QNkjWVKVYKOd6GGUklu1AUdskWpEmfVnt8z6pxSEpj4iKRjSlWSG33qBzDqkFJJnqWL/Zx+dTbdhluawwXxDuZyq987ppGSLnGbCzPQ8Mk3ydQupQXg7HvHqseOXZqmtAf/FA/q738tnxvSs6RjdRtu4I2KTvCq8b39m7fSFdg783vgdFvpBpV9A55gDWovy8PhaTBH22GwMVzZQ9FALKN6rqUt6ZUUPoVx3LXnp7pGH8Bb3xSN/DdcP+6RNpQfDTDIuI3qAeoB/u4ARWFokV7JqJ5g8JBhi/RKRvVq/jtJ8glPy0/Jm9T3zgAAAABJRU5ErkJggg=="
var activitiesIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEwSURBVFhH7ZRNjoJAEIV75b5xNnMVXRqPYzzFjMlcAAmcwGP4cxRdmgzOHuu1T4PaYJCuMSZ8yUvIK6hX3TSYjqYUC9M7pNFPntotdMiiGTyW9UGgqLjRjGV98szuEPqb2IHswBDX2AmW9TkPgPCXDIDtRuiVUvvFsj7uEGb2G6uGcP0vh/Bu1RXi7eHxhfnE23WQ73/MoCUtDLZ0ntRo6SFBU4bFtDBU7Dyp0dJDQhKGTWjBm9BLaOkhq12dwvojWjJAf+Q8qdHSQ4L2CPubf3zSMrg+DRXtaelQFwQPtfJgwanbat+rCY4EVB42eKxdDmdw6j43eK5W+jyDIwGVPxx4rlb6QbVGmm3YtI3WbNccT7OnxHbNadugG+B9Bzg/GFps/xjfwyHE9h0dNxhzBBwzDTiJaG//AAAAAElFTkSuQmCC";
var accommodationIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADzSURBVFhH7ZZBEsIgDEV7iToeuBzDoXfRlbpS76MNhk75oaTthB1vhhkCL/ksumjXaJQ4X1zfj8OdFu35eBVyTt49aG3xi/zD3es0ui8t2peGBt+7z+xP+8OPWIbToDi498M7N3QZnvoHHoHhVKcB6SPSu5y/4xGhEcL5andQ6S5LaFgJj+BQLQD9nDMTvt4N4nLofn948rEkDiy+kiHnqM9HElUAzH3zgYDqo1C7FmgN1rVAFQBz33wgoPoo1K4FWoN1LVAFwNw3HwioPgq1a4HWYF0LVAEw980HAqofhdqL4yTTz8It12C6vLtyXKPBdN0PrrhxMdGEPKgAAAAASUVORK5CYII=";

//Get request for yelp API. Generated using "postman" app
//enter filterTerm from above
//added acess-conreol-allow-origin to enable cors-anywhere
var getYelpData = function (latitude, longitude, filterTerm, cb) {
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": `https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&categories=${filterTerm}`,
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


//creates search bar
//Code from Google API documentation. Extracted to global function for bug fixing. 
function createSearchBar(map) {
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function () {
    searchBox.setBounds(map.getBounds());
  });
  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function () {
    var places = searchBox.getPlaces();
    //if (places.length == 0) {
    //return;
    // }
    // Clear out the old markers.
    markers.forEach(function (marker) {
      marker.setMap(null);
    });
    markers = [];
    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function (place) {
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
}

var generateNewMap = function (latitude, longitude) {
  return new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: {
      lat: latitude,
      lng: longitude
    },
    mapTypeId: 'roadmap'
  });
}

//Part of functions.  Need to be global in scope.
var yelpResponse = {};
var locations = [];
var markersArray = []; //enables clear markers


//clear markers functionality 
$(".clearMarkersButton").click(function () {
  markersArray.forEach(function (marker) {
    marker.setMap(null);
  });

});



//Adds details of yelp results to sidebar cards
let pushToCards = function () {
  $("#onClickContent").empty();
  $("#onClickContent").append(`<div class="card-group">`)
  for (var i = 0; i < yelpResponse.businesses.length; i++) {
    $("#onClickContent").append(`
    <div class="card card-${i}" style="width: 18rem;">

    <img class="card-img-top" src="${yelpResponse.businesses[i].image_url}" alt="Business Image">
    <div class="card-body">
    
    <h5 class="card-title">${yelpResponse.businesses[i].name}</h5>
    <h6 class="card-subtitle mb-2 text-muted">${yelpResponse.businesses[i].categories[0].title}</h6>

    <p class="card-text">
    Yelp rating: ${yelpResponse.businesses[i].rating} <br>
    Price: ${yelpResponse.businesses[i].price} 
    </p>
    <a href="${yelpResponse.businesses[i].url}" target = "_blank" class="card-link">Yelp Page</a>

    </div>
    </div>
    `)

  }
  $("#onClickContent").append(`</div>`)
}

//Adds coordinates of yelp results to locations array
let pushToLocations = function () {
  locations = [];
  for (var i = 0; i < yelpResponse.businesses.length; i++) {
    locations.push({ //must be called "lat" and "lng"
      lat: yelpResponse.businesses[i].coordinates.latitude,
      lng: yelpResponse.businesses[i].coordinates.longitude,
    });
  }
  console.log(locations);
};



//generates initial map with search bar
function initMap() {
  var map = generateNewMap(currentLat, currentLng);
  mapInteraction(activities, map);
  createSearchBar(map);
};


//Enables user interaction:
//filter yelp results via buttons 
//receive new yelp result upon location change
function mapInteraction(filterTerm, map) {

  var marker;

  //filter buttons functionality
  $(".foodAndDrinkButton").click(function () {
    addYelpMarkers(map, foodAndDrink, marker);
  });
  $(".activitiesButton").click(function () {
    addYelpMarkers(map, activities, marker);
  });
  $(".accommodationButton").click(function () {
    addYelpMarkers(map, accommodation, marker);
  });


  //adds yelp markers when tiles are loaded
  //occurs after initial map is loaded and when location is changed
  map.addListener("tilesloaded", function () {
    addYelpMarkers(map, filterTerm, marker);

  });



}

//Called when user filters results or changes location 
function addYelpMarkers(map, filterTerm, marker) {

  //gets lat and lng values for current map location
  var newPosition = map.getCenter();
  currentLat = newPosition.lat();
  currentLng = newPosition.lng();

  //sends GET request to yelp. Places results on map and on cards
  getYelpData(currentLat, currentLng, filterTerm, function (data) {
    yelpResponse = data;
    pushToLocations();
    pushToCards();

  var iconToUse;

  if (filterTerm === activities){
    iconToUse = activitiesIcon;
  } else if (filterTerm === accommodation){
    iconToUse = accommodationIcon;
  } else {
    iconToUse = foodIcon;
  }

    for (let i = 0; i < locations.length; i++) {

      marker = new google.maps.Marker({
        position: locations[i],
        map: map,
       icon: iconToUse
      });

      markersArray.push(marker);
      console.log(markersArray);




      let yelpObject = JSON.stringify(yelpResponse.businesses[i]);
      marker.addListener('click', function () {
        $("#onClickContent").html(yelpObject);
      });
    }



  });
};


//creates marker clusters. May want to enable later
/* var yelpMarkers = locations.map(function(location, i) {
     return new google.maps.Marker({
         position: location,
         label: labels[i % labels.length],
         animation: google.maps.Animation.DROP,
         title:"Hello World!"
     })

 }); */