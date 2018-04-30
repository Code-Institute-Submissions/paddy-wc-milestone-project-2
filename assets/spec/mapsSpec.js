describe('setTimeout gives correct value', function() {
    var result = 'an initial value';
  
    beforeEach(function(done) {
      setTimeout(function() {
        result = 'a different value';
        done();
      }, 2500);
    });
  
let businessesLength = 50;
       let latitude = 53.3498053
       let  longitude = -6.2603097
       let searchQuery = "food,bars";
        
    getYelpData(latitude, longitude, searchQuery, function(data){
            
        yelpResponse = data
        console.log(yelpResponse)
        businessesLength = yelpResponse.businesses.length
        console.log(businessesLength)
        
       
    })
    it('can now be tested properly', function() {
      // run assertions
      expect(businessesLength).toBe(20)
    });
  });





describe('checkIfOnMobile function', function () {


    it("should exist", function(){
        expect(checkIfOnMobile).toBeDefined();
    })
  it('should not return a value if not on mobile device', function () {

    let result = checkIfOnMobile();
    expect(result).toBeUndefined()
    
  })
})


// describe('generateNewMap function', function(){

//     it("should exist", function(){
//         expect(generateNewMap).toBeDefined();
//     })

// })




// describe("getYelpData function", function(){



//     it("should exist", function(){
//         expect(getYelpData).toBeDefined();
//     })

//     it("should return a list of 20 businesses on initial call", function(){
//         latitude = 53.3498053
//         longitude = -6.2603097
//         searchQuery = "food,bars";
        
        // getYelpData(latitude, longitude, searchQuery, function(data){
            
        //     yelpResponse = data
        //     console.log(yelpResponse)
        //     businessesLength = yelpResponse.businesses.length
        //     console.log(businessesLength)
        //     expect(businessesLength).toBe(20)
           
        // })
//     })
// })



