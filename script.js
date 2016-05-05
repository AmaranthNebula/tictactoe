$(document).ready(function() {
   // resize elements when page first loads  
   resizeElements();
   // have user choose x or o
   
   //player key
   var playerKey = {"C": "X", "H": "O"}
   
   var currentGame = [["","",""],
                      ["","",""],
                      ["","",""]];
   computersMove();
      //button event handler
   $("#container button").click(function(e){
       // call function to update display
       updateGameBoardDisplay(this.name.split("_"), "H");
       // function for computer's move
       computersMove();
   });
   
   // this function updates the display
   // updates the currentGame array
   // disables appropriate button
   function updateGameBoardDisplay(coord, player) {
       // create button's name
       var buttonName = coord[0] + "_" + coord[1];
       
       // disable button
        $("button[name=" + buttonName + "]").prop("disabled", "true");
        
        //update button with player icon
        $("button[name=" + buttonName + "]").text(playerKey[player]);
        //update game array with current player
        currentGame[coord[0]][coord[1]] = player;    
        
        //determine if game is over
        isGameOver(coord, player);   
   }
   
   function computersMove() {
       var availableMoves = getAvailableMoves(currentGame);
       var nextMove;
       //for first move have the computer choose a move at random
       if (availableMoves.length === 9) {
           var randomIndex = Math.floor(Math.random() * (availableMoves.length - 0) + 0);
           nextMove = availableMoves[randomIndex];
       }else {
           // call AI function
           var moveAI = getNextMove(currentGame);
           nextMove = moveAI.position;
       }
       updateGameBoardDisplay(nextMove, "C");
   }
   
   function isGameOver(lastMove, player) {
       var row = lastMove[0];
       var column = lastMove[1];
       var available = getAvailableMoves(currentGame);
       
       // check for horizontal/row winner
       if (currentGame[row][0] === player && currentGame[row][1] === player && currentGame[row][2] === player) {
           endGame([[row, 0],[row, 1],[row, 2]]);
       }
       // check for vertical/ column winner
       else if (currentGame[0][column] === player && currentGame[1][column] === player && currentGame[2][column] === player) {
           endGame([[0, column],[1, column],[2, column]]);
       }
       // check for left to right diagonal winner
       else if (currentGame[0][0] === player && currentGame[1][1] === player && currentGame[2][2] === player) {
           endGame([[0,0],[1,1],[2,2]]);
       }
       // check for right to left diagonal winner
       else if (currentGame[0][2] === player && currentGame[1][1] === player && currentGame[2][0] === player) {
           endGame([[0,2],[1,1],[2,0]]);
       }
       // if game is a draw
       else if (available.length === 0) {
           endGame();
       }
       
   }
   //this function is called after a game is over
   //
   function endGame(winningCoords) {
       if (winningCoords !== undefined) {
            //disable all buttons
            $("button").prop("disabled", "true");
            //set winning styling
            // go through all winning buttons
            for (var i=0; i < 3; i++) {
                var currentName = winningCoords[i][0] + "_" + winningCoords[i][1];
                $("button[name=" + currentName + "]").addClass("winningMove");  
            }
   
       }
       
       setTimeout(function() {
           console.log("new game");
           //after 2 seconds call function to reset game
           // newGame();
       },1500);
   }
   
   
   
   // this function resets all values and to start a new game
   function resetGame() {
       // clear board of previous moves
       currentGame = [["","",""],
                      ["","",""],
                      ["","",""]];
                      
        // re-enable all buttons
        $("button").prop("disabled", "false");
        // clear buttons
        $("button").text("");
        // remove winning styling
        $("button").removeClass("winningMove");
   }
   
   
   
   //tic tac toe AI function
   function getNextMove(pastMoves, depth) {
        // check if the computer won
        if (isWinner(pastMoves, "C")) {
            return {"score": (100 - depth)};
        }
        //check if the human player won
        else if (isWinner(pastMoves, "H")){
            return {"score": (depth - 100)};
        }
        //check if game is over
        else if(isDraw(pastMoves)) {
            return {"score": depth};
        }
        
        // if the game is not over and there is no winner
        //find the highest scoring move that is available
        //set depth to 0 for the first set of moves
        if (depth === undefined) {depth = 0;}  
        else {depth++;}
        // set current player
        // on even depths, the computer is the current player
        // on odd depths, the human is the current player
        if (depth %2 === 0) {var player = "C"}
        else {var player = "H"}
        var highestScore = {"score": 0, "position": [0,0]};  
        var availableMoves = getAvailableMoves(pastMoves);
        for(var i =0; i < availableMoves.length; i++) {
            // clone all array values
            // and not just references 
            var tempBoard = [];
            tempBoard.push(pastMoves[0].slice());
            tempBoard.push(pastMoves[1].slice());
            tempBoard.push(pastMoves[2].slice());
            //now add possible move to board and calculate score
            var testMove = availableMoves[i];
            tempBoard[testMove[0]][testMove[1]] = player;
            var score = getNextMove(tempBoard, depth);
    
            // if its computer move, find the highest score
            // it its the humans move, determine the person's highest scoring move 
            //   i.e. the lowest score for the computer
            if (player === "C" && (highestScore.score === 0 || score.score > highestScore.score)) {
                highestScore.score = score.score;
                highestScore.position = testMove.slice();
            }
            else if (player === "H" && (highestScore.score === 0 || score.score < highestScore.score)) {
                highestScore.score = score.score;
                highestScore.position = testMove.slice();
            }
        }
        
        return highestScore;
        
        

        
        
    } // end of getNextMove function
    //end of tic tac toe AI function
     
     // determines if there is a winner
     // input: the board to be analyzed and the player to check
     // output: boolean: true if there is a winner/ false if not
    function isWinner(moves, player) {
        var winner = false;
        for (var i=0; i < moves.length; i++) {
            // check horizontal rows for winner
            if (moves[i][0] === player && moves[i][1] === player && moves[i][2]=== player){
                winner = true;
                break; //end loop
            }
            // check for vertical columns for winner
            if (moves[0][i] === player && moves[1][i] === player && moves[2][i]=== player) {
                winner = true;
                break; //end loop
            }
            //check diagonals
        if ((moves[0][0] === player && moves[1][1] === player && moves[2][2] === player) ||
                (moves[0][2] === player && moves[1][1] === player && moves[2][0] === player)) {
                    winner = true;
            }
            
        }
        return winner;
    } // end of isWinner
    
     // determines if there is a draw
     // input: the board to be analyzed
     // output: boolean: true if there are no more moves/ false if there are still mvoves available
    function isDraw(moves) {
        //check for available moves
        var anyMoves = getAvailableMoves(moves);
        // if the returned array has a length of zero
        // there are no more moves; and game is a draw
        return anyMoves.length === 0;
    } //end of isDraw
    
    //finds all available moves
    // input: the board to be analyzed
    // output: a 2d array of the positions that are available; each index has the row and column
    function getAvailableMoves(moves) {
        var available = [];
        // go through 2d array of moves made
        //if a move is an empty string add that index to the available moves array
        for(var i = 0; i < moves.length; i++) {
            for (var j = 0; j < moves[i].length; j++) {
                var temp = moves[i][j];
                if(moves[i][j] === "") {
                    available.push([i,j]);   
                }
            }// end of j loop
        } // end of i loop
        return available;
    } // end of getAvailableMoves    
    
  
   
   // resizes grid and buttons to fit on screen
   // and centers grid on window
   function resizeElements() {
       //get size of window
       var height = $(window).outerHeight(true);
       var width = $(window).outerWidth(true);
       //find smaller value to use for the grid size
       var gridHeight = Math.min(height, width)*0.9;
       // find border size between buttons
       var gridLineSize = gridHeight*0.025;
       //button size is the size of the grid minus two of the grid lines
       // and divided by the 3 buttons per row and column and 
       var buttonSize = (gridHeight-(gridLineSize*2))/3;
       var fontSize = buttonSize*0.8;
        //get space around grid to center grid on screen;
       var paddingHeight = (height-gridHeight)/2;
       
       //set Grid size
       $("#container").css({
            "height": gridHeight + "px",
            "min-height": gridHeight + "px",             
            "width": gridHeight + "px",
       });
       //set button size and font size
       $("button").css({
            "height": buttonSize + "px",
            "min-height": buttonSize + "px",
            "width": buttonSize + "px",
            "font-size": fontSize + "px"
       });
       //set gridlines between buttons size
       $(".borderTopBottom").css({
          "border-top-width": gridLineSize + "px",
          "border-bottom-width": gridLineSize + "px"
       });
       $(".borderSides").css({
          "border-left-width": gridLineSize + "px",
          "border-right-width": gridLineSize + "px"           
       });
       //set padding height for grid
       $("body").css({
            "padding-top": paddingHeight + "px",
            "padding-bottom": paddingHeight + "px"            
       });
       
   } // end of resize elements
   

   $(window).resize(function() {
       resizeElements();
   });
});