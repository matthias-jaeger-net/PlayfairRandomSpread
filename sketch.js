/*
*  PlayfairRandomSpread
*
*  Is a typography experiment using the delicate path of Claus Eggers Sørensens
*  typeface Playfair Display as a base for further random spread, resulting in
*  an animation, drawn in a HTML5 <canvas> element
*
*  This program takes a single capital letter, in the given font, as an input.
*  After analyzing the bounding box of the letter it is centered on the screen.
*  An array of vectors is calculated by tracing the path of the given letter.
*
*  Each frame of the animation the traced points are spread by a random ammount.
*  If the user presses the correct key an svg image is rendered
*
*  Author
*  Matthias Jäger, Graz 2018
*
*  Documentation:
*  https://github.com/matthias-jaeger-net/PlayfairRandomSpread/
*
*  Playfair Display specimen:
*  https://fonts.google.com/specimen/Playfair+Display
*
*  Rendering with p5js:
*  http://p5js.org/
*/

// 1. Global Variables
// _____________________________________________________________________________

// Creating an HTML5 canvas to display the program in setup()
var canvas;

// Input all captial letters as an array
var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
               "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

// A random letter to be selected from the alphabet in setup()
var letter;

// The p5.font class renders the letter with the specified font and size
var font;
var fontpath = "fonts/PlayfairDisplay-Black.ttf";
var fontsize = 800;

// A centered letter on the canvas requires to know the bounds.
// Calling font.textBounds(text, x, y, fontSize) returns a rectangle w, h, x, y
var bounds;

// The origin position of a letter is on the baseline.
// To center its position an offset for x and y is calculated in setup()
var xoff;
var yoff;

// Tracing the path of the given letter to render its points in draw()
// Calling font.textToPoints(text, x, y, fontSize) returns p5.Vector objects
var points = [];

// Common radius for <ellipse> and ellipse()
var radius = 2;

// Random spread from -spread to spread
var spread = 50;

// A p5.createWriter creates a textfile to be used as output
var writer;
var filetype = "svg"
var filename = "Rendered";

// Each animation frame all points are stored to render a svg file
// A call to createSVG(svgpoints) returns a svg formatted string
var svgpoints = [];

// Stop drawing more random variations after 70 frames
var frames = 70;

// HTML div element to be selected via p5.dom.js
var modal;



// 2. Main program
// _____________________________________________________________________________

function preload() {
   font = loadFont(fontpath);
   modal = select(".modal");
}

function setup() {
   // Creating the outputs
   canvas = createCanvas(windowWidth, windowHeight);

   // Setup rendering style for the canvas
   noStroke();
   fill(0);

   // Select a random letter
   letter = random(alphabet);

   writer = createWriter(filename + "-" + letter +"." +filetype);

   // Calculate the bounding box
   bounds = font.textBounds(letter, 0, 0, fontsize);

   // Centering the letter on the screen:
   // The origin point set is on the x-height
   if (bounds.h == -bounds.y) {
      // Letter has no ascenders or descenders
      xoff = (width - bounds.w) / 2;
      yoff =  bounds.h + (height - bounds.h) / 2;
   } else {
      // Letter has a descender or ascender
      xoff = (width - bounds.w) / 2;
      yoff =  -bounds.y + (height-bounds.h)/2;
   }

   // Trace path of the centered letter
   points = font.textToPoints(letter, xoff, yoff, fontsize);

}

function draw() {
   // Only loop within limit
   if(frames > 0) {
      // For all vectors in points
      for (var i = 0; i < points.length; i++) {
         // Calculate x and position. Add a random spread
         var x = points[i].x + random(-spread, spread);
         var y = points[i].y + random(-spread, spread);
         // Draw the results on the canvas
         ellipse(x, y, radius * 2);
         // Store for svg string to render
         svgpoints.push(createVector(x, y));
      }
   } else {
      // Stop drawing and wait for user input
      noLoop();
   }
   frames--;
}

// 3. Helpers
// _____________________________________________________________________________

// Once a key is pressed
function keyPressed() {
   // Check if it is the correct letter
   if(key == letter) {
      // Then render svg file
      writer.print(createSVG(svgpoints));
      writer.close();
   }
}

// Returns a string to be rendered as svg file
function createSVG(svgpoints) {
   var string = "<?xml version="1.0" encoding="utf-8"?>";
   string += "<svg width='" + width + "' height= '" + height + "' >";
   for(var i = 0; i < svgpoints.length; i++) {
      string += "<circle cx='";
      string += svgpoints[i].x;
      string += "' cy='";
      string += svgpoints[i].y;
      string += "' r='";
      string += radius;
      string += "' fill='black' />";
   }
   string += "</svg>";
   return string;
}
