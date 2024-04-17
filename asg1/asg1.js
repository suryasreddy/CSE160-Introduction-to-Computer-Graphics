// Surya Reddy Asg 1: Paint Program
//asg1.js
var VSHADER_SOURCE = `
  attribute vec4 a_Position; 
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    //gl_PointSize = 30.0;
    gl_PointSize = u_Size;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;  // uniform変数
  void main() {
    gl_FragColor = u_FragColor;
  }`

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

var g_shapesList = [];

function setupWebGL(){
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", {preseveDrawingBuffer: true}); // gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
}

function connectVariablesToGLSL(){
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    // Get the storage location of u_Size
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('Failed to get the storage location of u_Size');
        return;
    }
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const STAR = 3; // New constant for Star

//Globals related to UI Elements
let g_selectedColor = [1.0,1.0,1.0,1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedSegments = 10;

// set up js actions for html elements
function addActionForHtmlUI(){
    // Clear the canvas
    document.getElementById('clear').onclick = function() { 
        g_shapesList = []; 
        renderAllShapes(); 
    }; 

    // Buttons that change cursor shape directly
    document.getElementById('pointButton').onclick = function() { g_selectedType = POINT; }; 
    document.getElementById('triButton').onclick = function() { g_selectedType = TRIANGLE; };
    document.getElementById('circleButton').onclick = function() { g_selectedType = CIRCLE; };
    // Special Star feature added
    document.getElementById('starButton').onclick = function() { g_selectedType = STAR; }; 
    document.getElementById('mountainButton').onclick = function() {paintMountainRange();};

    // Slider color change of shape
    document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100; });
    document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100; });
    document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/100; });

    // Slider to change the size of our shape
    document.getElementById('sizeSlide').addEventListener('mouseup',
        function() { g_selectedSize = this.value; });

    // Slider to change the number of segments in the circle
    document.getElementById('segmentSlide').addEventListener('mouseup',
        function() { g_selectedSegments = this.value; });
}

function main() {
    setupWebGL(); // set global canvas webGL 
    connectVariablesToGLSL(); //Initialize shaders

    // Change the selected color of points
    addActionForHtmlUI();

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    canvas.onmousemove = function(ev) { if(ev.buttons==1) {click(ev)} }; 

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function click(ev) {
     //Extract the event click and return it in WebGL coordinates
    let [x, y] = convertCoordEventToWebGL(ev);  

    //Create and store the new point
    let point;
    if(g_selectedType == POINT){
        point = new Point();
    }
    else if(g_selectedType == TRIANGLE){
        point = new Triangle();
    }
    else if(g_selectedType == CIRCLE){
        point = new Circle();
        point.segments = g_selectedSegments;
    }
    else if(g_selectedType == STAR){ // New condition for star
        point = new Star();
        point.segments = g_selectedSegments;
    }

    point.position = [x, y];
    point.color = g_selectedColor.slice();
    point.size = g_selectedSize;
    g_shapesList.push(point);

    //Draw every shape that is supposed to be on the canvas
    renderAllShapes();                             
}

function convertCoordEventToWebGL(ev){
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    return ([x,y]);
}


function renderAllShapes(){
    var startTime = performance.now();

    //Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);                                      

    //For every point on the canvas 
    var len = g_shapesList.length;                                
    for(var i = 0; i < len; i++) {
        g_shapesList[i].render();
    }
    sendTextToHTML(g_selectedSegments, "numside");
}

function sendTextToHTML(text, htmlID){ 
    var htmlElement = document.getElementById(htmlID);
    if(!htmlElement){
        console.log("failed to get " + htmlID + "from HTML");
        return;
    }
    htmlElement.innerHTML = text;
}

function paintMountainRange() {
    // Clear the shapes list
    g_shapesList = [];
    
    // Create an instance of the MountainRange class
    let mountainRange = new MountainRange();
    
    // Render the mountain range
    mountainRange.render();
}






