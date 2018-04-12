//enables cors in get request
jQuery.ajaxPrefilter(function (options) {
  if (options.crossDomain && jQuery.support.cors) {
    options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
  }
});

//initial centre of map
var currentLat = 53.3498053;
var currentLng = -6.2603097;


//filters terms for yelp search. 
var foodAndDrink = "food,bars";
var activities = "streetart,racetracks,sportsteams,theater,opera,museums,festivals,culturalcenter,countryclubs,castles,cabaret,gardens,galleries,active,tours";
var accommodation = "guesthouses,campgrounds,hostels,hotels";

//current filter. Set as activities for map initialization
var globalSearchQuery = activities;

//icons to appear as markers on map
var foodIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGQSURBVFhH7ZHNSgMxEMd7F0+KoO+ioOBBKJv0Xfw+6Rv5cVUviifF7hbqI3ioKG23B0HUmfjfZZ0xTVO9iPuD0M7kl5lJtlFTUzDM7Ps0C8fL8wiDsaIQYheO/94ACINIPzZWBAWB9GNjRVAQSD82VgQFgfRjY0VQEEg/NlYEBYH0Y2NFUBBIPzZWDDI7YuGhvT6DlJfefTKLgjlS3CDnXN5tLbo4NVfDzFzyf85JXzFI7Z2TOskqUl7YYZfPIEUXMOdugI7ZRKqELrfr/MyeIaWhiQ/dAJk5QsoLeSfOTc0BUnSBZMU1Sc1LP7Vbo9tkiRfF25yjYd/odxm6ZthuLVCBZxTZQVpBt9j7bG6fBjfNeaQdfFNu5PYrC829NUvoGS2tVxw85qfm7+2+ebu1Rjc+dQXJoaIGx76Qp3aD9i7K5vRpOIftMFyYGj0WBb5ZvX7HNqF7KXyEcfS7do6ebJ8GuS4b039+ft6DNpYfDVBl2kL1APUAf3eA4mBoQfcyqaeoNhm3oHuZ1Kv57zQaH1ER9ZNcI8FpAAAAAElFTkSuQmCC"
var activitiesIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEsSURBVFhH7ZRNisJAEIV75R28gloRshyX4nFkTjEKcwHxCEa9hD9Hicu5wliveQ5RelpiuhQhHxSE95KqSnd1u5a6FL1eZ51l32uRkjGHRtseFNQGfq9CNdr2FCInX7Tf/9gMhyM2UNK259IAir+kgdAWFFn2RdseP4QiM/w1Y/aUIbz96/+Cr6cnVCwUfN2G1WAwQRHd8x0lh2do8CjZsRL59A2ILCjhVCx8A+pRskMLLbkCU0pYgSk0eJTs0Inf+2IiY0rQxtT2lOzQQj8ots3zLiWHZ9+AepRsiBWCBq/aWHJiSw2N3t/WJCc2bNDgVYczObHjFjqeyYldOKELqjGa7IikTUJX5MB09QklfCSYrj5NE7QNvG8Dlw9TB9PfJ/RximD6lpYbnDsDu+iNTz9RmNwAAAAASUVORK5CYII=";
var accommodationIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGTSURBVFhH7ZLPSsNAEIdz10I3Wyz6Lgp6EwR9GP+f9CiVbEKfo5rEk6BelF59EEUvehBEndlMQpwh3W71IuaDhcxvv5ndJg1aWkqyOPycZVF71U+lsxaUgu+i9t+7AJVOuO9bC5wCg/u+tcApMLjvWwucAoP7vrXAKTC471sLnAKD+761wCkwuO9bC1KjXlG4HPTnKGokPdEddNNYvVAU4DNmo6i3WNThXWrCW3zGjPsCEO6tlOhVihpBB13soQgvcI1Znqhtiipgb9/ONuqKIkkWq2OSUooaAS9HNzPqiCJ4g90Vm8XhG8zYSYd6CRfM3S2y8OM86i6TLhkN+gsgPtPgPYoFmQkP0IGBT/npfI9iC/5SPMjOqC2bTZhZkRu9BQe8F40qw1eN39t+80ivwaALu4dOojep7Ru5Uetw2E11OHwazGjbDQ6GAx7LAXzBn+shi7sbpDdS+lT6cTbsaGg+hMPGtYPH+Ppxj7SJ/OgCdWYd1F6gvcDfvUDZ6FqkNzKtJ6gfMmmR3si0Xst/Jwi+AL08M6wrFEz7AAAAAElFTkSuQmCC";

//Get request for yelp API. Generated using "postman" app
//added access-control-allow-origin to enable cors-anywhere
var getYelpData = function (latitude, longitude, cb) {

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": `https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&categories=${globalSearchQuery}`,
    "method": "GET",
    "headers": {
      "authorization": "Bearer UTSSHcFmhNyctmBOeWKD2eeg9GV_LRkqsdjDa3Q_WkwvGywmY0cxtFDWQt1ib4lgRiE1y9l0_uRPdU6O4fY1rn164iomb6Y7_wR9G-Ii3WPWScwM5UWBZaPSz3LCWnYx",
      "access-control-allow-origin": "*",
      "cache-control": "no-cache",
      "postman-token": "c6fca5f7-e9ee-017f-8b66-d13a9884ec6d"
    },
    error: function (xhr, status, error) {
      alert("Error! Failed to retrieve data. " + xhr.status + " error");
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


    //my code. Clears markers and cards if searchBox is used
    if (markers.length > 0) {

      for (var i = 0; i < markersArray.length; i++) {
        markersArray[i].setMap(null);
      }
      markersArray.length = 0;
      markersArrayViewOnMap.forEach(function (marker) {
        marker.setMap(null);
      });
      markersSet.clear();
      yelpCardsSet.clear();
      for (var member in fullYelp) delete fullYelp[member];

      //clears card results and resets pushToCards iterators
      $("#cards-content .card-group").empty();
      iCardBody = 0;
      iFullYelp = 0;
    }
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

//enables clear markers
var markersArray = [];

//to check array entries against to prevent duplicates 
//final google marker clusters must use an array not a set
let markersSet = new Set([]);


//clears markers. Also clears marker cluster as part of addYelpMarkers function
$(".clear-markers-button").click(function () {
  for (var i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(null);

  }
  markersArray.length = 0;
  markersArrayViewOnMap.forEach(function (marker) {
    marker.setMap(null);
  });
  markersSet.clear();
  yelpCardsSet.clear();
  for (var member in fullYelp) delete fullYelp[member];

  //clears card results and resets pushToCards iterators
  $("#cards-content .card-group").empty();
  iCardBody = 0;
  iFullYelp = 0;
});

//iterators used in pushToCards
//placed outside function to avoid resting 
let iFullYelp = 0;
let iCardBody = 0;


//holds yelp data to be pushed to cards
//values only pushed to fullYelp object if they can be entered into set. Prevents duplicates
let fullYelp = {};
let yelpCardsSet = new Set([]);

//all viewOnMap markers pushed to this array
//cleared when clear markers button is clicked
let markersArrayViewOnMap = [];

//called when "view on map" link on card is clicked
let viewOnMap = function (latitude, longitude) {
  let viewOnMapLatLng = new google.maps.LatLng(latitude, longitude);

  let marker = new google.maps.Marker({
    position: viewOnMapLatLng,
    map: map,
  })

  markersArrayViewOnMap.push(marker);

  map.setCenter(viewOnMapLatLng);
  map.setZoom(17);
};



//Adds details of yelp results to sidebar cards
let pushToCards = function (map) {

  for (let z = 0; z < yelpResponse.businesses.length; z++) {

    //iff value is added to yelpCardsSet it is added to fullYelp
    yelpCardsSet.add(yelpResponse.businesses[z].id);
    if (yelpCardsSet.size > Object.keys(fullYelp).length) {
      fullYelp[iFullYelp] = yelpResponse.businesses[z];

      //Using iFullYelp iterator ensures that no index values are skipped
      iFullYelp++;
    }
  }

  let ifUndefinedReturnNA = function (valueToCheck) {
    if (valueToCheck == null) {
      return "N/A"
    } else {
      return valueToCheck;
    }
  }

  //must enter fullYelp[iCardBody].categories as argument 
  let showAllCategories = function (business) {
    let categoriesArray = [];
    for (let i = 0; i < business.length; i++) {
      categoriesArray.push(" " + business[i].title);
    }
    return categoriesArray;
  }

  for (iCardBody; iCardBody < Object.keys(fullYelp).length; iCardBody++) {
    $("#cards-content .card-group").append(`
    <div class="card card-${iCardBody}">

    <img class="card-img-top" src="${fullYelp[iCardBody].image_url}" alt="Business Image">
    <div class="card-body">
    
    <h5 class="card-title">${fullYelp[iCardBody].name}</h5>
    <h6 class="card-subtitle mb-2 text-muted">${showAllCategories(fullYelp[iCardBody].categories)}</h6>

    <p class="card-text">
    Yelp Rating: ${fullYelp[iCardBody].rating}/5<br>
    Price: ${ifUndefinedReturnNA(fullYelp[iCardBody].price)} 
    </p>
    <a onclick="viewOnMap( ${fullYelp[iCardBody].coordinates.latitude}, ${fullYelp[iCardBody].coordinates.longitude})" href = "#" class="card-link viewOnMapLink">View on Map</a>
    <a href="${fullYelp[iCardBody].url}" target= "_blank" class="card-link">Yelp Page</a>

    </div>
    </div>
    `)
  }
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

};



//generates initial map with search bar
function initMap() {
  map = generateNewMap(currentLat, currentLng);


  createSearchBar(map);
  mapInteraction(map);
};


//Enables user interaction:
//filter yelp results via buttons 
//receive new yelp result upon location change
function mapInteraction(map) {

  var marker;

  addYelpMarkersAndCards(map, marker);

  //filter buttons functionality
  //adds new yelp markers and cards then scrolls to first new card
  $(".food-and-drink-button").click(function () {
    addYelpMarkersAndCardsPromise(foodAndDrink).then(function(){
      scrollToNewFilterResults();
});
  });

  $(".activities-button").click(function () {
    addYelpMarkersAndCardsPromise(activities).then(function(){
      scrollToNewFilterResults();
});
  });
  $(".accommodation-button").click(function () {
    addYelpMarkersAndCardsPromise(accommodation).then(function(){
          scrollToNewFilterResults();
    });
  });

//used in filter buttons
  function addYelpMarkersAndCardsPromise(filterTerm){
    return new Promise(function(resolve, reject){
        globalSearchQuery = filterTerm;
        addYelpMarkersAndCards(map, marker);
        resolve();
    });
  }

  //adds yelp markers when tiles are loaded
  //occurs after initial map is loaded and when location is changed
  map.addListener("tilesloaded", function () {
    addYelpMarkersAndCards(map, marker);
  });
}



//called when filter button pressed
//scrolls to new cards
//timeout allows for delay in GET request
function scrollToNewFilterResults() {

  //the index of the last card before the function is called
  let indexOfFirstNewCard = iFullYelp;
 
    cardToScrollTo = `.card-${indexOfFirstNewCard-1}`; //-1 fixes bug where card is undefined 
    console.log(cardToScrollTo);
    $("#cards-col").animate({
      scrollTop: $(cardToScrollTo).offset().top - $("#cards-col").offset().top + $("#cards-col").scrollTop(),
      scrollLeft: 0
    }, 1000);
 
};

//Called when user filters results or changes location 
function addYelpMarkersAndCards(map, marker) {

  //gets lat and lng values for current map location
  var newPosition = map.getCenter();
  currentLat = newPosition.lat();
  currentLng = newPosition.lng();

  //sends GET request to yelp. Places results on map and on cards
  getYelpData(currentLat, currentLng, function (data) {

    yelpResponse = data;

    pushToLocations();
    pushToCards(map);

    var iconToUse;

    if (globalSearchQuery === activities) {
      iconToUse = activitiesIcon;
    } else if (globalSearchQuery === accommodation) {
      iconToUse = accommodationIcon;
    } else {
      iconToUse = foodIcon;
    }

    console.log(yelpResponse);

    for (let i = 0; i < locations.length; i++) {

      marker = new google.maps.Marker({
        position: locations[i],
        icon: iconToUse,
      });

      //only adds markers to the array if they are not  duplicates 
      markersSet.add(locations[i].lat);
      if ((markersSet.size) > markersArray.length) {
        markersArray.push(marker);
      };

      //scrolls to that marker's card
      marker.addListener('click', viewMarkerCard());
    }

    let markerCluster = new MarkerClusterer(map, markersArray, {
      imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    });

    // Clears marker clusters. Needs to be same scope as declaration of markerCluster
    $(".clear-markers-button").click(function () {
      markerCluster.clearMarkers();
    });
  });
};

//called when card is clicked
//highlights and scrolls to that marker's card
//removes highlighting of other cards
function viewMarkerCard() {
  return function () {
    let markerIndex = markersArray.indexOf(this);
    let cardToTarget = `.card-${markerIndex}`;
    $(".card").removeAttr("id");
    $(cardToTarget).attr('id', 'highlight-card');
    $("#cards-col").animate({
      scrollTop: $(cardToTarget).offset().top - $("#cards-col").offset().top + $("#cards-col").scrollTop(),
      scrollLeft: 0
    }, 1500);
  };
}