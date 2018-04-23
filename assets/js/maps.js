// everything inside this function to avoid variable conflicts
function initMapDestinationExplorer () {
  // checks if user in on a mobile device
  // code from: https://stackoverflow.com/questions/9048253/in-javascript-if-mobile-phone;
  function checkIfOnMobile () {
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
      return true
    }
  }


  //for testing jasmine 
  let returnSum = function(x,y){
    return x + y;
  }


  // enables cors in get request
  jQuery.ajaxPrefilter(function (options) {
    if (options.crossDomain && jQuery.support.cors) {
      options.url = 'https://cors-anywhere.herokuapp.com/' + options.url
    }
  })

  // initial center of map
  // dublin city center
  let currentLat = 53.3498053
  let currentLng = -6.2603097

  // filters terms for yelp search
  // chosen from list of possible categories: https://www.yelp.com/developers/documentation/v3/all_category_list
  let foodAndDrink = 'food,bars'
  let activities = 'streetart,racetracks,sportsteams,theater,opera,museums,festivals,culturalcenter,countryclubs,castles,cabaret,gardens,galleries,active,tours'
  let accommodation = 'guesthouses,campgrounds,hostels,hotels'

  // current filter
  // set as activities for map initialization
  let functionSearchQuery = activities

  // Get request for yelp API. Generated using "postman" app
  // added access-control-allow-origin to enable cors-anywhere
  let getYelpData = function (latitude, longitude, cb) {
    let settings = {
      'async': true,
      'crossDomain': true,
      'url': `https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&categories=${functionSearchQuery}`,
      'method': 'GET',
      'headers': {
        'authorization': 'Bearer UTSSHcFmhNyctmBOeWKD2eeg9GV_LRkqsdjDa3Q_WkwvGywmY0cxtFDWQt1ib4lgRiE1y9l0_uRPdU6O4fY1rn164iomb6Y7_wR9G-Ii3WPWScwM5UWBZaPSz3LCWnYx',
        'access-control-allow-origin': '*',
        'cache-control': 'no-cache',
        'postman-token': 'c6fca5f7-e9ee-017f-8b66-d13a9884ec6d'
      },
      error: function (xhr, status, error) {
        alert('Error! Failed to retrieve data. ' + xhr.status + ' error')
      }
    }

    $.ajax(settings).done(function (response) {
      cb(response)
    })
  }

  // icons to appear as markers on map
  let foodIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGTSURBVFhH7ZLPSsNAEIdz10I3Wyz6Lgp6EwR9GP+f9CiVbEKfo5rEk6BelF59EEUvehBEndlMQpwh3W71IuaDhcxvv5ndJg1aWkqyOPycZVF71U+lsxaUgu+i9t+7AJVOuO9bC5wCg/u+tcApMLjvWwucAoP7vrXAKTC471sLnAKD+761wCkwuO9bC1KjXlG4HPTnKGokPdEddNNYvVAU4DNmo6i3WNThXWrCW3zGjPsCEO6tlOhVihpBB13soQgvcI1Znqhtiipgb9/ONuqKIkkWq2OSUooaAS9HNzPqiCJ4g90Vm8XhG8zYSYd6CRfM3S2y8OM86i6TLhkN+gsgPtPgPYoFmQkP0IGBT/npfI9iC/5SPMjOqC2bTZhZkRu9BQe8F40qw1eN39t+80ivwaALu4dOojep7Ru5Uetw2E11OHwazGjbDQ6GAx7LAXzBn+shi7sbpDdS+lT6cTbsaGg+hMPGtYPH+Ppxj7SJ/OgCdWYd1F6gvcDfvUDZ6FqkNzKtJ6gfMmmR3si0Xst/Jwi+AL08M6wrFEz7AAAAAElFTkSuQmCC'
  let activitiesIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEsSURBVFhH7ZRNisJAEIV75R28gloRshyX4nFkTjEKcwHxCEa9hD9Hicu5wliveQ5RelpiuhQhHxSE95KqSnd1u5a6FL1eZ51l32uRkjGHRtseFNQGfq9CNdr2FCInX7Tf/9gMhyM2UNK259IAir+kgdAWFFn2RdseP4QiM/w1Y/aUIbz96/+Cr6cnVCwUfN2G1WAwQRHd8x0lh2do8CjZsRL59A2ILCjhVCx8A+pRskMLLbkCU0pYgSk0eJTs0Inf+2IiY0rQxtT2lOzQQj8ots3zLiWHZ9+AepRsiBWCBq/aWHJiSw2N3t/WJCc2bNDgVYczObHjFjqeyYldOKELqjGa7IikTUJX5MB09QklfCSYrj5NE7QNvG8Dlw9TB9PfJ/RximD6lpYbnDsDu+iNTz9RmNwAAAAASUVORK5CYII='
  let accommodationIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAD4SURBVFhH7ZJBEoIwDEW5hCeChWek42l0pY6LlvsokVThpzTApLu+mYxN+/pTZmwqlRzny+vUOX+nojVvr0JO24cH1RY/yzfMBd+58KaidS6UzsaHDtGn9eFHLIdT6BQ8fllIhS6H/3363f0IHE79fAA+Yn6W8uMe63lIxOF8tHtQ7iwJCWvDIxiqDUA/5fygf+4WcRm6zx8/8MnbkhiYfSUzhR7zeUuiCoC5bx4IqD4KpXuBdsG6F6gCYO6bBwKqj0LpXqBdsO4FqgCY++aBgOqjULoXaBese4EqAOa+eSCg+lEoXTxO0vb+lrpgWa3zVx5XqTBN8wF05P4FG/6txAAAAABJRU5ErkJggg=='

  // creates new map
  // initial code from: https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
  let generateNewMap = function (latitude, longitude) {
    return new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: {
        lat: latitude,
        lng: longitude
      },
      mapTypeId: 'roadmap'
    })
  }

  // part of functions
  // need to be at function scope.
  let yelpResponse = {}
  let locations = []

  // enables clear markers functionality
  let markersArray = []

  // to check markersArray entries against
  // to prevent duplicates
  // final google marker clusters must use an array not a set
  let markersSet = new Set([])

  // iterators used in pushToCardsOrInfoboxes
  // placed outside function to avoid resting
  let iFullYelp = 0
  let iCardBody = 0

  // holds yelp data to be pushed to cards
  // values only pushed to fullYelp object if they can be entered into set. Prevents duplicates
  let fullYelp = {}
  let yelpCardsSet = new Set([])

  // all viewOnMap markers pushed to this array
  // cleared when clear markers button is clicked
  let markersArrayViewOnMap = []

  // used in pushToCardsOrInfoboxes function
  // iterated on with every new set of cards
  // only scroll to cards when value > 1
  // reset when clear search button pressed
  let pushToCardsCalled = -1

  // used in mobile functions
  let infowindowArray = []
  let infowindowSet = new Set([])

  // full iterator for infowindow array
  // used in addInfoboxes(i)
  // function scope  to ensure it is not reset
  // except when markers are cleared
  let totalIInfowindowArray = 0

  // used in pushToCardsOrInfoboxes
  let indexBeforeNewCards = 0

  // clears markers
  // also clears markerCluster in addYelpMarkers function
  $('.clear-markers-button').click(function () {
    // makes markers on map invisible
    for (let i = 0; i < markersArray.length; i++) {
      markersArray[i].setMap(null)
    }
    markersArray.length = 0
    markersArrayViewOnMap.forEach(function (marker) {
      marker.setMap(null)
    })

    // resets letiables
    markersSet.clear()
    yelpCardsSet.clear()
    for (let member in fullYelp) delete fullYelp[member]
    infowindowArray = []
    infowindowSet.clear()
    totalIInfowindowArray = 0
    pushToCardsCalled = -1

    // clears card results and resets pushToCards iterators
    $('#cards-content .card-group').empty()
    iCardBody = 0
    iFullYelp = 0
  })

  // called when "view on map" link on card is clicked
  let viewOnMap = function (latitude, longitude) {
    let viewOnMapLatLng = new google.maps.LatLng(latitude, longitude)

    let marker = new google.maps.Marker({
      position: viewOnMapLatLng,
      map: map
    })

    markersArrayViewOnMap.push(marker)

    map.setCenter(viewOnMapLatLng)
    map.setZoom(17)
  }

  // Adds details of yelp results to sidebar cards
  let pushToCardsOrInfoboxes = function (map) {
    // print n/a rather than undefined
    let ifUndefinedReturnNA = function (valueToCheck) {
      if (valueToCheck == null) {
        return 'N/A'
      } else {
        return valueToCheck
      }
    }

    // shows all business categories
    // must enter fullYelp[iCardBody].categories as argument
    let showAllCategories = function (business) {
      let categoriesArray = []
      for (let i = 0; i < business.length; i++) {
        categoriesArray.push(' ' + business[i].title)
      }
      return categoriesArray
    }

    for (let z = 0; z < yelpResponse.businesses.length; z++) {
      // iff value is added to yelpCardsSet it is added to fullYelp
      yelpCardsSet.add(yelpResponse.businesses[z].id)
      if (yelpCardsSet.size > Object.keys(fullYelp).length) {
        fullYelp[iFullYelp] = yelpResponse.businesses[z]

        // using iFullYelp iterator ensures that no index values are skipped
        // doesn't reset with every time pushToCardsOrInfobox is called
        iFullYelp++
      }
    }

    // adds each response to infoboxArray if user is on a mobile device
    if (checkIfOnMobile()) {
      for (iCardBody; iCardBody < Object.keys(fullYelp).length; iCardBody++) {
        infowindowSet.add(fullYelp[iCardBody].id)

        if (infowindowSet.size > infowindowArray.length) {
          infowindowArray.push(
            (`
    <div class="card infobox-card card-${iCardBody}">

    <img class="card-img-top" src="${fullYelp[iCardBody].image_url}" alt="Business Image">
    <div class="card-body">
    
    <h5 class="card-title">${fullYelp[iCardBody].name}</h5>
    <h6 class="card-subtitle mb-2 text-muted">${showAllCategories(fullYelp[iCardBody].categories)}</h6>

    <p class="card-text">
    Yelp Rating: ${fullYelp[iCardBody].rating}/5<br>
    Price: ${ifUndefinedReturnNA(fullYelp[iCardBody].price)} 
    </p>
    <a href="${fullYelp[iCardBody].url}" target= "_blank" class="card-link">Yelp Page</a>

    </div>
    </div>
    `))
        }
      }

      // if user is not on mobile device
      // push each response to a card
    } else {
      // index value of last card before loop starts
      indexBeforeNewCards = iCardBody

      for (iCardBody; iCardBody < Object.keys(fullYelp).length; iCardBody++) {
        $('#cards-content .card-group').append(`
    <div class="card aside-card card-${iCardBody}">

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

      // only called when more than 10 new results to stop
      // function being called every time the users drags map
      // only calledwhen pushToCards > 1 to avoid scrollToNewCards
      // being called on initial pushToCardsOrInfoboxes
      pushToCardsCalled++
      if (pushToCardsCalled > 1 && (iCardBody - indexBeforeNewCards) > 10) {
        scrollToNewCards()
      }
    }
  }

  // called when new cards added
  // not called for initial cards
  // scrolls to new cards
  function scrollToNewCards () {
    // the index of the first new card
    let indexOfFirstNewCard = indexBeforeNewCards + 1

    let cardToScrollTo = `.card-${indexOfFirstNewCard}`
    $('#cards-col').animate({
      scrollTop: $(cardToScrollTo).offset().top - $('#cards-col').offset().top + $('#cards-col').scrollTop(),
      scrollLeft: 0
    }, 1000)
  };

  // adds coordinates of yelp results to locations[]
  let pushToLocations = function () {
    locations = []
    for (let i = 0; i < yelpResponse.businesses.length; i++) {
      locations.push({ // must be called "lat" and "lng"
        lat: yelpResponse.businesses[i].coordinates.latitude,
        lng: yelpResponse.businesses[i].coordinates.longitude
      })
    }
  }

  // generates initial map with search bar
  map = generateNewMap(currentLat, currentLng)
  createSearchbox(map)
  mapInteraction(map)

  // Enables user interaction:
  // filter yelp results via buttons
  // receive new yelp result upon location change
  function mapInteraction (map) {
    // avoids bugs due to scope
    let marker

    addYelpMarkersAndCards(map, marker)

    // filter buttons functionality
    // adds new yelp markers and cards then scrolls to first new card
    $('.food-and-drink-button').click(function () {
      functionSearchQuery = foodAndDrink
      addYelpMarkersAndCards(map, marker)
    })

    $('.activities-button').click(function () {
      functionSearchQuery = activitiesIcon
      addYelpMarkersAndCards(map, marker)
    })
    $('.accommodation-button').click(function () {
      functionSearchQuery = accommodation
      addYelpMarkersAndCards(map, marker)
    })

    // adds yelp markers when tiles are loaded
    // occurs after initial map is loaded and when location is changed
    map.addListener('tilesloaded', function () {
      addYelpMarkersAndCards(map, marker)
    })
  }

  // called when user filters results or changes location
  function addYelpMarkersAndCards (map, marker) {
    // gets lat and lng values for current map location
    let newPosition = map.getCenter()
    currentLat = newPosition.lat()
    currentLng = newPosition.lng()

    // sends GET request to yelp
    // places results on map and on cards/infoboxes
    getYelpData(currentLat, currentLng, function (data) {
      // callback from GET request
      yelpResponse = data

      // coordinates for map markers
      pushToLocations()

      pushToCardsOrInfoboxes(map)

      // value determined below
      let iconToUse

      if (functionSearchQuery === activities) {
        iconToUse = activitiesIcon
      } else if (functionSearchQuery === accommodation) {
        iconToUse = accommodationIcon
      } else {
        iconToUse = foodIcon
      }

      for (let i = 0; i < locations.length; i++) {
        // not  placed on map
        // added to markersArray
        // then placed on map as part of markersCluster
        marker = new google.maps.Marker({
          position: locations[i],
          icon: iconToUse
        })

        // only adds markers to the array if they are not  duplicates
        markersSet.add(locations[i].lat)
        if ((markersSet.size) > markersArray.length) {
          markersArray.push(marker)
          totalIInfowindowArray++ // used in addinfoboxes. Ensures iterator is not reset
        };

        // click on marker functionality:
        // on mobile devices view infobox
        // otherwise view card
        if (checkIfOnMobile()) {
          addInfoboxes(i)
        } else {
          // scrolls to that marker's card
          marker.addListener('click', viewMarkerCard())
        }
      }

      // places markers on map
      // with markerCluster functionality
      let markerCluster = new MarkerClusterer(map, markersArray, {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
      })

      // Clears marker clusters
      // should be same scope as declaration of markerCluster
      $('.clear-markers-button').click(function () {
        markerCluster.clearMarkers()
      })
    })

    // adds an infobox to every new marker
    // called on mobile devices
    // code structure partly from: https://stackoverflow.com/questions/11106671/google-maps-api-multiple-markers-with-infowindows
    function addInfoboxes (i) {
      let infoWindowContent = infowindowArray[totalIInfowindowArray - 1] // -1 because totalIInfowindowArray++ happens before function is called
      let infoWindow = new google.maps.InfoWindow()
      google.maps.event.addListener(marker, 'click', (function (marker, InfoWindow, infoWindow) {
        return function () {
          infoWindow.setContent(infoWindowContent)
          infoWindow.open(map, marker)
        }
      })(marker, infoWindowContent, infoWindow))
    }
  };

  // called when card is clicked
  // highlights and scrolls to that marker's card
  // removes highlighting on other cards
  function viewMarkerCard () {
    return function () {
      let markerIndex = markersArray.indexOf(this)
      let cardToTarget = `.card-${markerIndex}`
      $('.card').removeAttr('id')
      $(cardToTarget).attr('id', 'highlight-card')
      $('#cards-col').animate({
        scrollTop: $(cardToTarget).offset().top - $('#cards-col').offset().top + $('#cards-col').scrollTop(),
        scrollLeft: 0
      }, 1500)
    }
  }

  // creates searchbox
  // Code from Google API documentation: https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
  // extracted to function scope  for bug fixing.
  function createSearchbox (map) {
    let input = document.getElementById('pac-input')
    let searchBox = new google.maps.places.SearchBox(input)
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input)
    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
      searchBox.setBounds(map.getBounds())
    })
    let markers = []
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
      let places = searchBox.getPlaces()

      // Clear out the old markers.
      markers.forEach(function (marker) {
        marker.setMap(null)
      })
      markers = []
      // For each place, get the icon, name and location.
      let bounds = new google.maps.LatLngBounds()
      places.forEach(function (place) {
        if (!place.geometry) {
          console.log('Returned place contains no geometry')
          return
        }
        let icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        }
        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }))
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport)
        } else {
          bounds.extend(place.geometry.location)
        }
      })
      map.fitBounds(bounds)

      // my code
      // clears markers and cards if searchBox is used
      function clearMarkersAndCards () {
        if (markers.length > 0) {
          for (let i = 0; i < markersArray.length; i++) {
            markersArray[i].setMap(null)
          }
          markersArray.length = 0
          markersArrayViewOnMap.forEach(function (marker) {
            marker.setMap(null)
          })
          markersSet.clear()
          yelpCardsSet.clear()
          for (let member in fullYelp) {
            delete fullYelp[member]
          }
          // clears card results and resets pushToCards iterators
          $('#cards-content .card-group').empty()
          iCardBody = 0
          iFullYelp = 0
        }
      }

      clearMarkersAndCards()
    })
  }



};
