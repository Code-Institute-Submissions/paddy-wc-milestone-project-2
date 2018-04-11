

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

//current filter. Set as activities for map intilzation
var globalSearchQuery = activities;

//icons to appear as markers on map
var foodIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMZSURBVGhD7Zk7aBRBHMbXB4IKCtrYaCFYKKKNhYUQnyCa7MyFnEUKFRQtrIUEFRtBsTCNopWCIKiFCL4KC0VFFILczB4qsTEIGkRj9vaMiJL1m+U/u5Pksre7eYgyPxhIvv9rv9nHHbeOxWKx/LvUJL9WE/zhVC9qH2HOCCqltSQrvTuu8dgBkh3kbI11yXtITgfJ/YHk4VQvah9hzqhV+CaSI4NxjWCnSXbwd2esS/aU5HT+UyPsLJofKri6kj5/2Yg5JC/D1dYVyXBrJMIa0UXWCLBGdI01QlgjY7BGdM1kjSCxLylyt5OcG/9V+yrdpybYT5IjAsHfNZqB/y9o3Rf8KMkwzg5qHZsw6pv0hMD9M11Ur7h7Sc4NdrclHi7ZB5Ij1K7qWCBKR0jW5p8g/77/mi8lWfU6F/cS/CrJ6ajEZAi7SHJuMLzb6POY5AhoZ3QMeb1h6Myi0DjC3tYFOCMfk3x2mELpmNcjTA2oRhTKTBienI2BXjKcd1EoolZ116D3iI5jZnw/mISPWuai1rxvAvNMpTLYW16Ma9jXxTigExTKjC/Y/qSe/xqS7SspFIPYFZ0TLcHuBB7brDZOHYMvS7uhvzBzYP4YlWcD1/CpuFiy3xiyjUJNCWTbOtTVjeENr+kvfTsXqctK5zVb6HMvvFmeQ+XZ+FTZsRAH/yZpwn7UBd9H4QmpS7YL+d+M4QP1ankZhccxVO1Ygk27rfMnXIJfCqvleVSWD/WjAMx8Hd00etrsUbtJac7I8475foW1IfeumYszORx47hZKSyXaAFxaUY3ugcsbG3HdF6WNlFaculdabz4xRi3BB2Hsc8OYZENZTZiMubEbPgAKo54SagB2J3nKpCzs6oNhjy2n8lxMqxFNzeOrcZDnMeRtPIwWztp7nKHL36W7gdILMSNGTHB2jhsmbpA8aWbeiPFTjxpO8qSxRopijTTBGimKNdIEa6QZvnBdNB/3ygCf4rfigZK9bJzDOqlNZlA3PUbo2y4dcL6FT/9+apMZa6QZaNyDA4pfaOZaBe4d1DR8GWqxWCz/I47zB68T9UkMxST7AAAAAElFTkSuQmCC"
var activitiesIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMaSURBVGhD7Zg7aBRRFIbXB1EQH2BhI1YWoqidilpZKYqgKIighYiN2ogiiriFzpw7ibqmkoBEEAQNRATBZyEiojYWWkS0UkMawfhgN7sx7PjP8N/Lnd1psuzjZpkPDpv979m5/5l75+zN5jIyZghhPt8zIXJyQqmXJaW+IJ6WRA5Dn80U9wmVWowi3qCIsC5EhsOhoTlMdRvc+ZupRTAwfp6p7jJeKCyB0UnL9GA5CHbh9aFVzJjzW6zo+xuNYZFxvY1++/5Sq5Dwr+ctiz/gKpXe3nXabLQyRaWWR7pdIPRqNQgWxh9wlWjLwOyoNo0Yix5wdK1fRhN5zXS3KQXBIauQRGA1pkqet4Wp7oO7fhyrUEwUIvKjKLKHKe5R9rzVJd8/WxswfwUr8AmvPxHvEV5ann6OOg7MHozveIOBldvKS3WWrikEW2MDzAwwPloGRyx9AM/Id1MAjjBG9/2VvJQ7wNgDU4jIBcoxeG+OLsi7TtlNYPazNouV2ks5BuZPmUJEnlF2D3wZzofBKW0W3WwVh2KwhbbrMcQoZfeoiKzXRnH3KyhsLodioK2wCgmj4z6H3AKrYboX/v5AOQH0PyZHqc2U3QKd6LI2ibhLOQH0tyZH5Chlt4C5+9ok7vxFygmgD5pClLpG2S1gMjqOxCbRsfZRToDtdFrnIP8JZXeo9vfPg8l/2mR0/uJQgrJSO3QO4htld0DHWqsN4k5P1nYsTW3nqubzizjkBjB4wBSCYwrlOsIwnIVCTefCFtzEITeAqUvaHLrRPcqpYPydlXuEshvA0LA2hxXJU04F47dMIfifhbIbwNyIKURkP+VUMH7Gyn1EufPgwe5BIaZjVZRaw6FUyiI7dS5W8ivl9hH9FoWJb8P0czugvTLGENBe1ObYgXzzcypWpJqWg7hR7etbwKmbCwxctQ23IU5w6uaCQu6kTNa6EBFO3VzsQrD0j/H+WAvCbs2tL6RVk7RjjqyQ6ZAVMh1mdCHlINiNC9Z1lHZ0rZo5ttFSY+ACiW/tjgVWipYao5sKKfDs0+k4R0sZGRkZXUMu9x+HUURsSHCfWgAAAABJRU5ErkJggg==";
var accommodationIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMYSURBVGhD7Zk7iBNBGMfXB4IKCtrYaCFYKKKNhYXgs1K0tLhCBUULa+FEJY3g4SOb1RO1URAEvUIEX4WFoiKX7CQICoo2HoIcouclM8khStb/rN9MJt5ms5vLBTzmB1/zn+8x/93N3uTiWCwWy/+L64tbOSaedDuofUjTjAJfS7LjMnFc6744SLKTZXybobskx+P6fAQFQbeD2oc0z6hsIlkZDHXknCHZyfm8r6GLFyTHMzON+PysV6we7iRQ36/7IKh9SO+NGEPSkmO1FY0+1kiINaKKrBFgjZBujSiskX+wRkjvghHxQRVlC3wHyanJlcqrVB9s5CfJITjBfoyagdmXlY6T8DGSnawvDikd0XSSbgkSX6oiNN5Hcmq8QmWz7sP4Z5JD5FVVaziiHyX5r3lfPM8x/uhSvryUZHm8zxq9bpIcj0w0iq6QnBr6bkF9xDOSQ7DRAb3mcxYEwSxamsQ1FizAHf3SyK8eoaV4mp5HJkZlI1pKTCYIZqP2jeqD6KelEK9UWQMDdT3H+DyYZJ4Gc3H3jM+N4OadimWAjS3GJsqqGLf6FC0lBvUHdD3jv7KFiZW0pMEFu9HICc3cR2yRF07uAZ+LXcgZbs4RJ6g8GRh+Whcz/jtX5NtpqS3IXYcNCKM+8pn2hr8tko+VymsX6PNwaCiYQ+XJOPe6vhDu3xlNJnBn9tNyS5CzE/GjUSdGB/NiGS1P4sKr8SXofU/ltw5+NfM2mEdl6ZD/FECT72ZD+bbxGN8rryalYTP1+dlidTfuwgMzF8Nrns+3Ulos8gLIR0vW6Fny8fbFbY9VN1Ja51wsifXYoH5jmAFTY4ivUWuI8aQmTNAv8g9iV5BvCTkAjfVbJi6Q9/h8obacylMxrUYUbrGyGrd6EEPeq2HG0E+I63jENlB6R/TEiAkGnmwMFHdInjI9N4JB+l89cjjJU8Ya6RRrpA3WSKdYI22wRtrhFqp7on4ywJC7aiAOevmoHJzR+qhNYqbPiPHdOm1gIyPUJjHWSDtwSHTRVP+gmSbkpqhNYvAdJPLHUIvFYpmJOM4fKMSbNj4ks/MAAAAASUVORK5CYII=";

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


    //my code. Clears markers and cards if searchBox is used
    if (markers.length >0){


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
    Yelp rating: ${fullYelp[iCardBody].rating}/5<br>
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
}, 2000);


};

//Called when user filters results or changes location 
function addYelpMarkers(map, marker) {




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
   

  });
};

//called when card is clicked
//highlights and scrolls to that marker's card
//unhighlights other cards
function viewMarkerCard() {
  return function () {
    let markerIndex = markersArray.indexOf(this);
    let cardToTarget = `.card-${markerIndex}`;
    $(".card").removeAttr("id");
    $(cardToTarget).attr('id', 'highlightCard');
    $("#cards-col").animate({
      scrollTop: $(cardToTarget).offset().top - $("#cards-col").offset().top + $("#cards-col").scrollTop(),
      scrollLeft: 0
    }, 1500);
  };
}
