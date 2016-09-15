//author: Mitchell Fabian
//date: 9/15/2016
//description: makes a rotating square that can have its color changed, its speed and direction change
//all by sliders, menus, buttons, and keys.
//proposed points (out of 15): 15/15 follows all required points

//KEYS: D - direction change, S - makes it go slower, F - makes it go faster

"use strict";

var gl;

var theta = 0.0; //variable for movement
var speed = 0.1; //speed variable
var thetaLoc;
var red = 1.0; //color variable
var redLoc;

var direction = true; //direction variable
var timesPressed = 0; //counts how many times the button is pressed

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height ); 
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 ); //background is white

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vertices = [ //makes a square
        vec2(  0,  1 ),
        vec2(  -1,  0 ),
        vec2( 1,  0 ),
        vec2(  0, -1 )
    ]; 


    // Load the data into the GPU

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    thetaLoc = gl.getUniformLocation( program, "theta" );
    redLoc = gl.getUniformLocation( program, "red" );

    document.getElementById("redSlider").onchange = function(event) { //makes a slider that changes the red component of the square
        red = parseFloat(event.target.value);
        console.debug(red);
    };

    document.getElementById("Controls" ).onclick = function(event) { //makes a menu
        switch( event.target.index ) {
          case 0:
            direction = !direction; //changes the direction
            break;
         case 1:
            speed += 0.1; //speeds it up
            break;
       }
    };

    document.getElementById("slider").onchange = function(event) {//makes a slider for the speed
        speed = parseFloat(event.target.value);
    };

    // Initialize event handler (button)
    document.getElementById("Direction").onclick = function () {//makes a button
        timesPressed++; //counts up how many times it has been pressed
        console.debug("pressed button", timesPressed); 
        direction = !direction; //changes the direction
    };

    // Initialize event handler (key codes)
    window.onkeydown = function( event ) { //adds the keystroke changes
        var key = String.fromCharCode(event.keyCode);
        switch( key ) {
          case 'D': //direction
          case 'd':
            direction = !direction;
            break;
          case 'F':  //faster
          case 'f':
            speed += 0.1; 
           break;
          case 'S':  //slower
          case 's':
            speed -= 0.1;
            if (speed <= 0.0) {
                speed = 0.0;
            }
            break;
        }
    };

    render();
};

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );

    if (direction == true) //rotates the square
    {
        theta += speed; 
    }
    else 
    {
        theta -= speed;
    }
    gl.uniform1f(thetaLoc, theta);
    gl.uniform1f(redLoc, red); //red color

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    window.requestAnimFrame(render);
}
