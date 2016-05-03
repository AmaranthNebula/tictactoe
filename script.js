$(document).ready(function() {
   // resize elements when page first loads  
   resizeElements();
   
   
   
   
   
   
   
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