describe("sum function", function(){
  it("should return 3 when 2 and 1 entered", function(){
   // spyOn(initMapDestinationExplorer, "returnSum");
    //expect(initMapDestinationExplorer.returnSum).toHaveBeenCalled();
   // let result = initMapDestinationExplorer.returnSum(2,1);
   // expect(result).toBe(3)
  })
})


describe('checkIfOnMobile function', function () {
  it('should return a boolean', function () {

    let result = checkIfOnMobile();
    expect(result).toBe("true" || "false")
    
  })
})

