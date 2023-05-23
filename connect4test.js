describe("Connect 4 Game Setup", function(){
  //before each test, the board must be set up correctly
  beforeEach(function(){
    const board = document.getElementById('board');
    expect(board.children.length).toEqual(HEIGHT + 1);
  })
})
