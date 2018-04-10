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

//current filter. Set as activities for map intilzation
var globalSearchQuery = activities;

//icons to appear as markers on map
var foodIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGUSURBVFhH7ZHNLgRBEIDnLk5Ewns42O4hJBsx3ct6F/8n3sjPFRfi6iXs9MYKFw4SQVVvzVhVme3t5SLmSzqZqv6quqY7qakpcFZ/jLOovKynMBgLCiF2UfnvDUBhEO7HxoKgwOB+bCwICgzux8aCoMDgfmwsCAoM7sfGgqDA4H5sLAgKDO7HxgJn9IuXms0JSlXSW29Moptb9UypBL8xd7+azmLsjLqGnlf4jTnuC0C49QNkjWVKVYKOd6GGUklu1AUdskWpEmfVnt8z6pxSEpj4iKRjSlWSG33qBzDqkFJJnqWL/Zx+dTbdhluawwXxDuZyq987ppGSLnGbCzPQ8Mk3ydQupQXg7HvHqseOXZqmtAf/FA/q738tnxvSs6RjdRtu4I2KTvCq8b39m7fSFdg783vgdFvpBpV9A55gDWovy8PhaTBH22GwMVzZQ9FALKN6rqUt6ZUUPoVx3LXnp7pGH8Bb3xSN/DdcP+6RNpQfDTDIuI3qAeoB/u4ARWFokV7JqJ5g8JBhi/RKRvVq/jtJ8glPy0/Jm9T3zgAAAABJRU5ErkJggg=="
var activitiesIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEwSURBVFhH7ZRNjoJAEIV75b5xNnMVXRqPYzzFjMlcAAmcwGP4cxRdmgzOHuu1T4PaYJCuMSZ8yUvIK6hX3TSYjqYUC9M7pNFPntotdMiiGTyW9UGgqLjRjGV98szuEPqb2IHswBDX2AmW9TkPgPCXDIDtRuiVUvvFsj7uEGb2G6uGcP0vh/Bu1RXi7eHxhfnE23WQ73/MoCUtDLZ0ntRo6SFBU4bFtDBU7Dyp0dJDQhKGTWjBm9BLaOkhq12dwvojWjJAf+Q8qdHSQ4L2CPubf3zSMrg+DRXtaelQFwQPtfJgwanbat+rCY4EVB42eKxdDmdw6j43eK5W+jyDIwGVPxx4rlb6QbVGmm3YtI3WbNccT7OnxHbNadugG+B9Bzg/GFps/xjfwyHE9h0dNxhzBBwzDTiJaG//AAAAAElFTkSuQmCC";
var accommodationIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADzSURBVFhH7ZZBEsIgDEV7iToeuBzDoXfRlbpS76MNhk75oaTthB1vhhkCL/ksumjXaJQ4X1zfj8OdFu35eBVyTt49aG3xi/zD3es0ui8t2peGBt+7z+xP+8OPWIbToDi498M7N3QZnvoHHoHhVKcB6SPSu5y/4xGhEcL5andQ6S5LaFgJj+BQLQD9nDMTvt4N4nLofn948rEkDiy+kiHnqM9HElUAzH3zgYDqo1C7FmgN1rVAFQBz33wgoPoo1K4FWoN1LVAFwNw3HwioPgq1a4HWYF0LVAEw980HAqofhdqL4yTTz8It12C6vLtyXKPBdN0PrrhxMdGEPKgAAAAASUVORK5CYII=";

//Get request for yelp API. Generated using "postman" app
//added acess-conreol-allow-origin to enable cors-anywhere
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
    }, error: function(xhr, status, error){
      alert("Error! Failed to retrieve data. " + xhr.status + " error");
  }}

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

//enables clear markers
var markersArray = [];

//to check array entries against to prevent duplicates 
//final google marker clusters must use an array not a set
let markersSet = new Set([]);


//clears markers. Also clears marker cluster as part of addYelpMarkers function
$(".clearMarkersButton").click(function () {
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
  $("#onClickContent .card-group").empty();
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
let viewOnMap = function( latitude, longitude) {
  let viewOnMapLatLng = new google.maps.LatLng(latitude, longitude);

  let marker  = new google.maps.Marker({
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

      //Using iFullYelp iterator ensures that no index values are skiped
      iFullYelp++;
    }
  }


  let ifUndefinedReturnNA = function (valueToCheck) {
    if (valueToCheck == null){
      return "N/A"
    }else {
      return valueToCheck;
    }
  }


//must enter fullYelp[iCardBody].categories as argument 
  let showAllCategories = function (business){
    let categoriesArray = [];
    for (let i = 0; i < business.length; i ++){
    categoriesArray.push(" " + business[i].title );  
    } return categoriesArray;
  }

  for (iCardBody; iCardBody < Object.keys(fullYelp).length; iCardBody++) {
    $("#onClickContent .card-group").append(`
    <div class="card card-${iCardBody}">

    <img class="card-img-top" src="${fullYelp[iCardBody].image_url}" alt="Business Image">
    <div class="card-body">
    
    <h5 class="card-title">${fullYelp[iCardBody].name}</h5>
    <h6 class="card-subtitle mb-2 text-muted">${showAllCategories(fullYelp[iCardBody].categories)}</h6>

    <p class="card-text">
    Yelp rating: ${fullYelp[iCardBody].rating} <br>
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

  mapInteraction(map);
  createSearchBar(map);
};


//Enables user interaction:
//filter yelp results via buttons 
//receive new yelp result upon location change
function mapInteraction(map) {

  var marker;

  addYelpMarkers(map, marker);


  


  //filter buttons functionality
  $(".foodAndDrinkButton").click(function () {
    globalSearchQuery = foodAndDrink;
    addYelpMarkers(map, marker);
    scrollToNewFilterResults();
  })

  $(".activitiesButton").click(function () {
    globalSearchQuery = activities;
    addYelpMarkers(map, marker);
    scrollToNewFilterResults();
  });
  $(".accommodationButton").click(function () {
    globalSearchQuery = accommodation;
    addYelpMarkers(map, marker);
    scrollToNewFilterResults();
  });



  //adds yelp markers when tiles are loaded
  //occurs after initial map is loaded and when location is changed
  map.addListener("tilesloaded", function () {
    addYelpMarkers(map, marker);

  });


}



//called when filter button pressed
//scrolls to new cards
//timeout allows for delay in GET request
function scrollToNewFilterResults() {

  //the index of the last card before the function is called
  let indexOfFirstNewCard = iFullYelp;


  setTimeout(function() {
  cardToScrollTo = `.card-${indexOfFirstNewCard - 1}`; //-1 fixes bug where card is undefined 
  console.log(cardToScrollTo);
  $("#cards-col").animate({
    scrollTop: $(cardToScrollTo).offset().top - $("#cards-col").offset().top + $("#cards-col").scrollTop(),
    scrollLeft: 0
  }, 1000);
  console.log("iFullYelp after function: " + iFullYelp);
}, 2000);


};

//Called when user filters results or changes location 
function addYelpMarkers(map, marker) {


  let markerCluster = new MarkerClusterer(map, markersArray, {
    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
  });

  // Clears marker clusters. Needs to be same scope as declaration of markerCluster
  $(".clearMarkersButton").click(function () {
    markerCluster.clearMarkers();
  });


  //gets lat and lng values for current map location
  var newPosition = map.getCenter();
  currentLat = newPosition.lat();
  currentLng = newPosition.lng();

  //sends GET request to yelp. Places results on map and on cards
  getYelpData(currentLat, currentLng, function (data) {
    // $(yelpResponse).extend(data.businesses[0]);
    //console.log(yelpResponse);
    yelpResponse = data;
    //console.log(yelpResponse);
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


    for (let i = 0; i < locations.length; i++) {

      marker = new google.maps.Marker({
        position: locations[i],
        icon: iconToUse
      });

      //only adds markers to the array if they are not  duplicates 
      markersSet.add(locations[i].lat);
      if ((markersSet.size) > markersArray.length) {
        markersArray.push(marker);
      }



      marker.addListener('click', function () {
        let markerIndex = markersArray.indexOf(this);
        //console.log(markerIndex);
        let cardToTarget = `.card-${markerIndex}`;
       // console.log(cardToTarget);

        $(".card").removeAttr("id");
        $(cardToTarget).attr('id', 'highlightCard');

        $("#cards-col").animate({
          scrollTop: $(cardToTarget).offset().top - $("#cards-col").offset().top + $("#cards-col").scrollTop(),
          scrollLeft: 0
        }, 1500);


      });
    }

  });
};