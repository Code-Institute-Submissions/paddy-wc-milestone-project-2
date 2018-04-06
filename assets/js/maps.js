//enables cors in get request
jQuery.ajaxPrefilter(function (options) {
  if (options.crossDomain && jQuery.support.cors) {
    options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
  }
});




//initial centre of map
var originalLat = 53.3498053;
var originalLng = -6.2603097;


//filters terms for yep search. 
var foodAndDrink = "food,bars";
var activities = "streetart,racetracks,sportsteams,theater,opera,museums,festivals,culturalcenter,countryclubs,castles,cabaret,gardens,galleries,active,tours";
var accommodation = "guesthouses,campgrounds,hostels,hotels";


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
  console.log(yelpResponse);
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
  var map = generateNewMap(originalLat, originalLng);
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
  var newLat = newPosition.lat();
  var newLng = newPosition.lng();

  //sends GET request to yelp. Places results on map and on cards
  getYelpData(newLat, newLng, filterTerm, function (data) {
    yelpResponse = data;
    pushToLocations();
    pushToCards();
    for (let i = 0; i < locations.length; i++) {
      marker = new google.maps.Marker({
        position: locations[i],
        map: map,
      });
      let yelpObject = JSON.stringify(yelpResponse.businesses[i]);
      marker.addListener('click', function () {
        $("#onClickContent").html(yelpObject);
      });
    };
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