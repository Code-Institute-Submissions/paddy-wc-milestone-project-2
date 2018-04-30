


describe('checkIfOnMobile function', function () {


  it("should exist", function () {
    expect(checkIfOnMobile).toBeDefined();
  })
  it('should not return a value if not on mobile device', function () {

    let result = checkIfOnMobile();
    expect(result).toBeUndefined()

  })
})


describe('generateNewMap function', function(){

    it("should exist", function(){
        expect(generateNewMap).toBeDefined();
    })

})




describe("getYelpData function", function () {

  //enables testing of asynchronous functions
  //code source: https://metabroadcast.com/blog/asynchronous-testing-with-jasmine 
  beforeEach(function (done) {
    setTimeout(function () {
      result = 'a different value';
      done();
    }, 2500);
  });


  it("should exist", function () {
    expect(getYelpData).toBeDefined();
  })


  let businessesLength = 50;
  let latitude = 53.3498053
  let longitude = -6.2603097
  let searchQuery = "food,bars";

  getYelpData(latitude, longitude, searchQuery, function (data) {

    yelpResponse = data
    console.log(yelpResponse)
    businessesLength = yelpResponse.businesses.length
    console.log(businessesLength)


  })
  it('should initially return 20 businesses ', function () {

    expect(businessesLength).toBe(20)
  });


})


describe("ifUndefinedReturnNA function", function () {
  it("should exist", function () {
    expect(ifUndefinedReturnNA).toBeDefined();
  })

  it("should return 'N/A' when undefined entered  ", function () {
    let result = ifUndefinedReturnNA(undefined)
    expect(result).toBeDefined()
    expect(result).toBe('N/A')
    
  })

  it("should return argument if argument is not undefined ", function(){
    let argument = "argument"
    let result = ifUndefinedReturnNA(argument)
    expect(result).toBe(argument)
  })
})