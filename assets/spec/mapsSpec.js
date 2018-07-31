describe('checkIfOnMobile function', function() {

  it("should exist", function() {
    expect(checkIfOnMobile).toBeDefined();
  });

  it('should not return a value if not on mobile device', function() {
    let result = checkIfOnMobile();
    expect(result).toBeUndefined();
  });
});

describe('generateNewMap function', function() {
  it("should exist", function() {
    expect(generateNewMap).toBeDefined();
  });
});

describe("getYelpData function", function() {

  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  let result = "an initial value";
  //enables testing of asynchronous functions
  // postpones running of 'it' functions 
  //code source: https://metabroadcast.com/blog/asynchronous-testing-with-jasmine 
  beforeEach(function(done) {
    setTimeout(function() {
      result = 'a different value';
      done();
    }, 6000);
  });

  it("should exist", function() {
    expect(getYelpData).toBeDefined();
  });

  let latitude = 53.3498053;
  let longitude = -6.2603097;
  let searchQuery = "food,bars";
  let businessesLength = 50;


  getYelpData(latitude, longitude, searchQuery, function(data) {
    let yelpResponse = data;
    businessesLength = yelpResponse.businesses.length;
  });


  it('should initially return 20 businesses ', function() {
    expect(businessesLength).toBe(20);
  });
});


describe("ifUndefinedReturnNA function", function() {
  it("should exist", function() {
    expect(ifUndefinedReturnNA).toBeDefined();
  });

  let firstResult = ifUndefinedReturnNA(undefined);
  it("should return 'N/A' when undefined entered  ", function() {
    expect(firstResult).toBeDefined();
    expect(firstResult).toBe('N/A');
  });

  let definedArgument = "test argument";
  let secondResult = ifUndefinedReturnNA(definedArgument);
  it("should return argument if argument is not undefined ", function() {
    expect(secondResult).toBe(definedArgument);
  });
});

describe("showAllCategories function", function() {
  it("should exist", function() {
    expect(showAllCategories).toBeDefined();
  })

  let sampleArray = [{
      alias: "desserts",
      title: "Desserts"
    },
    {
      alias: "tea",
      title: "Tea Rooms"
    },
    {
      alias: "breakfast_brunch",
      title: "Breakfast & Brunch"
    }
  ];

  let sampleArrayLength = sampleArray.length;
  let resultArray = showAllCategories(sampleArray);
  let resultArrayLength = resultArray.length;
  it("should return an array the same length as its argument ", function() {
    expect(resultArrayLength).toBe(sampleArrayLength);
  });
});


describe("pushToCardsOrInfoboxes function", function() {


  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  let result = "an initial value"
  //enables testing of asynchronous functions
  //code source: https://metabroadcast.com/blog/asynchronous-testing-with-jasmine 
  beforeEach(function(done) {
    setTimeout(function() {
      result = 'a different value';
      done();
    }, 5000);
  });


  getYelpData(53.3498053, -6.2603097, 'food, bars', function(data) {
    let yelpResponse = data;
    pushToCardsOrInfoboxes(map, yelpResponse);
  });

  it("should exist", function() {
    expect(pushToCardsOrInfoboxes).toBeDefined();
  })

  it("should add aside cards to #cards-content on non-mobile devices ", function() {
    let cardsContent = $("#cards-content").html();
    expect(cardsContent).toContain('  <div class="card aside-card card-0">');
  });
});

describe("pushToLocations function", function() {
  //enables testing of asynchronous functionsx
  //code source: https://metabroadcast.com/blog/asynchronous-testing-with-jasmine 
  let result = 'an initial value';
  beforeEach(function(done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    setTimeout(function() {
      result = 'a different value';
      done();
    }, 7000);
  });


  it("should exist", function() {
    expect(pushToLocations).toBeDefined();
  });


  let getLocations = function() {

    let latitude = 53.3498053;
    let longitude = -6.2603097;
    let searchQuery = "food,bars";
    let yelpResponse = {};
    firstLocation = {};

    getYelpData(latitude, longitude, searchQuery, function(data) {

      yelpResponse = data;
      let locations = pushToLocations(yelpResponse);
      return locations;
    });
  };

  locations = getLocations()


  it("should return an object with lat and lng int values", function() {
    let firstLocation = locations[0];
    let latType = typeof firstLocation["lat"];
    expect(Object.keys(firstLocation)[0]).toBe("lat");
    expect(Object.keys(firstLocation)[1]).toBe("lng");
    expect(latType).toBe("number")
  });

});
