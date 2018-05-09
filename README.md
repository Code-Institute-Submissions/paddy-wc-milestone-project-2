# Destination explorer 

## Overview
![Screenshot](https://snag.gy/H6nIPV.jpg)

### What is the website for?
Viewing restaurants, accommodation, and tourist attractions at any holiday destination

###What does it do?
Displays a map where users can navigate to their next holiday destination using a search box. Users can view markers on the map for local bars, restaurants, accommodation and tourist attractions. Additionally, they can view the yelp rating and price estimate for each activity. 

### How does it work?
By using the **Google Maps API** to display the map and enable the search box functionality. The website employs the Maps JavaScript API. All other interactive elements of the website are also written in JavaScript, supplemented by some jQuery. The website sends a GET request to the **Yelp Fusion API** for information on local businesses and activities. This GET request sends the current map center as the request coordinates, along with a list of business categories to filter the results by. To enable Cross-Origin Resource Sharing(CORS), this GET request is sent via **CORS Anywhere**.  The yelp response includes a latitude and longitude for each business, and these are used to place the markers. Additional information from the yelp response, such as reviews, are displayed in cards for each business.

##Features

###Existing Features
- An interactive map for any location
- A search box to navigate to a location 
- Markers and cards for local businesses 
- A responsive design where cards are replaced by info boxes on mobile devices
- Buttons to filter search results 
- Ability to clear search results. This is called automatically after using the search box
- Click on a marker to view its information card
- A ‘View on Map’ link on each card to view that business’s marker
- Information for new businesses appear upon changing the map’s center

### Features Left to Implement
- None

## Tech Used

### Some of the tech used includes:
-**HTML**, **CSS** and **JavaScript
* Basic languages used for website
* CSS code written in **SCSS**
- [**Bootstrap**](http://getbootstrap.com/)
* Used for the layout of the website and the styling of the cards
- [**Jquery**](https://jquery.com)
* Used primarily for assigning styles to cards and enabling click functionality 
- **Ajax**
* To send get requests to the Yelp API
- [**Google Maps API**](https://cloud.google.com/maps-platform/)
* To display the map and markers, and to enable search box functionality 
- [**Yelp Fusion API**] (https://www.yelp.ie/developers/documentation/v3)
* Uses businesses search endpoint (https://www.yelp.ie/developers/documentation/v3/business_search) to get information on local businesses
- [**CORS Anywhere**](https://github.com/Rob--W/cors-anywhere)
* As the Yelp API does not have CORS functionality, CORS anywhere is used as a proxy request. This adds CORS headers to the request
- [**Node.js**](https://nodejs.org/en/)
* Required for CORS anywhere
- [**Postman**](https://www.getpostman.com/)
* Used to write the Ajax GET request to the Yelp API
- [**Jasmine**](https://jasmine.github.io/)
* Used to test the JavaScript code. Code found in assets/spec/mapsSpec.js


## Testing
- All code used on the site has been tested to ensure that everything works as expected. Bug fixes can be found in the commit history
- Site viewed and tested on the following browsers:
* Google Chrome
* Mozilla Firefox
* Safari 
* Opera
- Additional Jasmine testing was performed and can be found in assets/spec/mapsSpec.js

## Contributing

### Getting the code up and running 
1. Clone or fork this GitHub repository 
2. Ensure you have Node.js installed. If you do not, install it by following [this guide](https://nodejs.org/en/)
3. Compile any SCSS code to CSS. Use [**Easy Sass**](https://marketplace.visualstudio.com/items?itemName=spook.easysass) if using Visual Code Studio. If using Cloud9, write $ sass --watch main.scss in the terminal
4. Make your changes
5. Submit a pull request 

## Credits
- The sources for all non-original code are displayed in comments above the relevant code
- The checkIfOnMobile() function was taken from [Nahuel Barrios on Stack Overflow(https://stackoverflow.com/questions/9048253/in-javascript-if-mobile-phone). The original code also tests for tablets, but this was removed from the website’s code as tablets should have the same functionality as desktops
-The JQuery Ajax Prefilter was taken from the [CORS anywhere README](https://github.com/Rob--W/cors-anywhere/blob/master/README.md)
- Filter term variables are categories for the GET request to the Yelp API. They are extracted from Yelp’s list of [all possible categories](https://www.yelp.com/developers/documentation/v3/all_category_list)
-[Postman](https://www.getpostman.com/) was used to create the code in GetYelpData(). ‘access-control-allow-origin’ was added to enable CORS-anywhere. An error alert was also added
- With the exception of the clearMarkersAndCards() function, all code inside createSearchbox() was taken from the [Google Maps API documentation](https://developers.google.com/maps/documentation/javascript/examples/places-searchbox). Marker cluster code was also taken from this documentation.
- Code inside the addInfoWindow() function was taken from [Vinayak Kaniyarakkal on Stack Overflow](https://stackoverflow.com/questions/11106671/google-maps-api-multiple-markers-with-infowindows).The code was edited so that it loops through the Infowindow array.
- Code for testing asynchronous functions in Jasmine is taken from [Meta Broadcast](https://metabroadcast.com/blog/asynchronous-testing-with-jasmine).