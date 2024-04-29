// Surya Reddy Assignment 2: Blocky Animal
// Vertex shader program
var VSHADER_SOURCE = `
attribute vec4 a_Position;
uniform mat4 u_ModelMatrix;
uniform mat4 u_GlobalRotateMatrix;
void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
}`;

// Fragment shader program
var FSHADER_SOURCE = `
precision mediump float;
uniform vec4 u_FragColor; // Uniform variable
void main() {
    gl_FragColor = u_FragColor;
}`;

// Global variables
var canvas;
var gl;
var a_Position;
var u_FragColor;
var u_ModelMatrix;
var u_GlobalRotateMatrix;
var dragging = false; // Is the mouse being dragged?
var lastX = null, lastY = null; // Last position of the mouse
var g_fastAnimationEnabled = false; // False means normal speed, true means fast speed



    function initEventHandlers(canvas) {
        canvas.onmousedown = function(ev) {   // Mouse is pressed
            var x = ev.clientX, y = ev.clientY;
            var rect = ev.target.getBoundingClientRect();
            if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
                lastX = x; lastY = y;
                dragging = true;
                if (ev.shiftKey) {  // Check if Shift key is pressed along with mouse click
                    g_fastAnimationEnabled = !g_fastAnimationEnabled;  // Toggle fast animation state
                }
            }
        };

        canvas.onmouseup = function(ev) {
            dragging = false;
        };

        canvas.onmousemove = function(ev) {
            var x = ev.clientX, y = ev.clientY;
            if (dragging) {
                var factor = 100 / canvas.height;
                var dx = factor * (x - lastX);
                var dy = factor * (y - lastY);
                g_cameraAngles[1] += dx;
                g_cameraAngles[0] += dy;
                g_cameraAngles[0] = Math.max(Math.min(g_cameraAngles[0], 90), -90);
                lastX = x; lastY = y;
            }
        };
    }


    function setUpWebGL(){
        // Retrieve <canvas> element
        canvas = document.getElementById('canvas');

        // Get the rendering context for WebGL
        //gl = getWebGLContext(canvas);
        gl = canvas.getContext('webgl', {preserveDrawingBuffer: true});
        if (!gl) {
            console.log('Failed to get the rendering context for WebGL');
            return;
        }
        
        gl.enable(gl.DEPTH_TEST);
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
        
        // Get the storage location of u_ModelMatrix
        u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
        if (!u_ModelMatrix){
            console.log('Failed to get the storage location of u_ModelMatrix');
            return;
        }
        
        // Get the storage location of u_GlobalRotateMatrixMatrix
        u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
        if (!u_GlobalRotateMatrix){
            console.log('Failed to get the storage location of u_GlobalRotateMatrix');
            return -1;
        }
        
        var identityM = new Matrix4();
        gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
    }

    // UI related global variables
    let g_cameraAngles = [0, 0, 0];
    let g_bodyAngle = 0;
    let g_headAngle = 0;
    let g_tailAngle = 0;
    let g_tailAngleX = 0;
    let g_frontLegAngle = 0;
    let g_hindLegAngle = 0;
    let g_frontFlipperAngle = 0;
    let g_hindFlipperAngle = 0;
    let g_animation = true;
    let g_color_default = true;
    let speedMultiplier = 5; // Normal speed


    function addActionsForHtmlUI(){
        // angle slider event
        document.getElementById("y_angle").addEventListener('mousemove', function() {g_cameraAngles[1] = this.value; console.log(this.value); renderAllShapes();});
        // reset camera angle
        document.getElementById("cam_reset").onclick = function() { g_cameraAngles = [0, 0, 0]; document.getElementById("y_angle").value = 0; renderAllShapes();};

        // buttons to turn on/off animations
        document.getElementById("animation_on").onclick = function() {g_animation = true;}
        document.getElementById("animation_off").onclick = function() {g_animation = false;}

        // joint rotation events
        document.getElementById("tail_move").addEventListener('mousemove', function(){g_tailAngle = this.value; renderAllShapes();});
        document.getElementById("front_flipper_move").addEventListener('mousemove', function(){g_frontFlipperAngle = this.value; renderAllShapes();});
        document.getElementById("rear_leg_move").addEventListener('mousemove', function(){g_hindLegAngle = this.value; renderAllShapes();});
        document.getElementById("rear_flipper_move").addEventListener('mousemove', function(){g_hindFlipperAngle = this.value; renderAllShapes();});
    }


    // set up global color dictionary to determine colors for each turtle part
    let g_color_set = {
        "body": [0/255, 100/255, 0/255, 1.0], // Dark green for the body
        "head": [144/255, 238/255, 144/255, 1.0], // Light green for the head
        "eye": [0.0, 0.0, 0.0, 1.0], // Black for the eyes
        "sclera": [1.0, 1.0, 1.0, 1.0], // White for the sclera
        "tail": [133/255, 80/255, 27/255, 1.0], // Brown for the tail
        "leg": [144/255, 238/255, 144/255, 1.0], // Light green for the legs
        "flipper": [0/255, 120/255, 0/255, 1.0], // Slightly lighter green for the flippers
        "belly": [194/255, 178/255, 128/255, 1.0] // Sand color for the belly
    };





    function main() {
        
        // set up and connect variables to WebGL
        setUpWebGL();
        connectVariablesToGLSL();

        // Add responses for user input
        addActionsForHtmlUI();
        initEventHandlers(canvas);
        
        //change background to a vibrant aquatic blue
        gl.clearColor(0, 0, 0.4, 1); // Dark blue color 
        gl.enable(gl.DEPTH_TEST);
        // Start animation
        requestAnimationFrame(tick);
    }


    var g_lastFrameTime = performance.now();
    var g_frameCount = 0;
    var g_fpsInterval = 1000; // Interval to update the FPS counter
    var g_lastFpsUpdate = performance.now();
    var g_fps = 0;
    var g_totalElapsedTime = 0;  // Total elapsed time since the start of the program in seconds


    function tick() {
        // Get the current time and calculate the elapsed time since the last frame
        var now = performance.now();
        var elapsedMs = now - g_lastFrameTime;
        g_lastFrameTime = now;

        // Update total elapsed time in seconds
        g_totalElapsedTime += elapsedMs / 1000;  // Convert milliseconds to seconds

        // Increment frame count for FPS calculation
        g_frameCount++;

        // Update FPS every second
        if (now - g_lastFpsUpdate > g_fpsInterval) {
            g_fps = g_frameCount * 1000 / (now - g_lastFpsUpdate);
            g_lastFpsUpdate = now;
            g_frameCount = 0;

            // Update the FPS and ms display
            sendTextToHTML("ms: " + Math.floor(elapsedMs) + " fps: " + Math.floor(g_fps), "numdot");
        }

        // Update animation states before rendering
        updateAnimationAngles(g_totalElapsedTime);

        // Render the scene
        renderAllShapes();

        // Request the next frame
        requestAnimationFrame(tick);
    }



    function updateAnimationAngles(totalTime) {
        var speedMultiplier = g_fastAnimationEnabled ? 25 : 1;  // Use faster speed if enabled
        if (g_animation) {
            g_tailAngle = 5.0 * Math.sin(speedMultiplier * totalTime + .174);
            g_frontLegAngle = 15 * Math.sin(speedMultiplier * 2 * totalTime);
            g_frontFlipperAngle = 60 * Math.sin(speedMultiplier * 2 * totalTime);
            g_hindLegAngle = 10 * Math.sin(speedMultiplier * 2 * totalTime);
            g_hindFlipperAngle = 10 * Math.sin(speedMultiplier * totalTime);
            g_bodyAngle = 10 * Math.sin(speedMultiplier * totalTime);
        } else {
            g_tailAngleX = 0;
        }
    }




function renderAllShapes(){
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    
    // set up rotation due to camera
    var globalRotateMatrix = new Matrix4().rotate(g_cameraAngles[0], 1, 0, 0);
    globalRotateMatrix.rotate(g_cameraAngles[1], 0, 1, 0);
    globalRotateMatrix.rotate(g_cameraAngles[2], 0, 0, 1);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotateMatrix.elements);
    
    //Render all parts of turtle
    var body = new Cube();
    body.color = g_color_set["body"];
    body.matrix.translate(-.25, -.25, .5*.1);
    body.matrix.rotate(g_bodyAngle, 1, 1, 1);
    body.matrix.translate(0, 0, -.5*.1*2);
    var bodyCoordMatrix = new Matrix4(body.matrix);
    body.matrix.scale(.1*5, .1*2, .1*5.5);  // Adjusted for turtle body
    body.render();

    var belly = new Cube();
    belly.color = g_color_set["belly"];
    belly.matrix = new Matrix4(bodyCoordMatrix); // Start with the body's coordinate matrix
    belly.matrix.translate(0, -0.05, -2 * .1 * 0); // Move it directly below the body
    belly.matrix.scale(.1 * 5, .05 , .1 * 5.5); // Same dimensions as the body
    belly.render();

    var spikeColor = [165/255, 42/255, 42/255, 1.0]; // Brown color for the spikes
    var positions = [
        [0.3, 0.2, 0.275],
        [0.4, 0.2, 0.275],
        [0.2, 0.2, 0.275],
        [0.1, 0.2, 0.275],
        [0, 0.2, 0.275]
    ]; // Relative positions of the spikes on the back

    var scales = [
        [0.05, 0.05, 0.15],
        [0.05, 0.05, 0.09],
        [0.05, 0.05, 0.2],
        [0.05, 0.05, 0.15],
        [0.05, 0.05, 0.09]
    ]; // Scaling factors for each spike, making central spikes taller

    positions.forEach((pos, index) => {
        var spike = new Cone();
        spike.color = spikeColor;
        spike.matrix = new Matrix4(bodyCoordMatrix); // Start with the turtle body coordinate matrix
        spike.matrix.translate(pos[0], pos[1], pos[2]); // Apply translation
        spike.matrix.rotate(-90, 1, 0, 0); // Rotate to face upward
        spike.matrix.scale(scales[index][0], scales[index][1], scales[index][2]); // Apply correct scaling for each spike
        spike.render(); // Render the spike
    });


    
    var head = new Cube();
    head.color = g_color_set["head"];
    head.matrix = new Matrix4(bodyCoordMatrix);
    head.matrix.translate(-.1*2, 0, .79*.25);  // Increased x-coordinate left shift
    head.matrix.rotate(g_headAngle, 0, 0, 1);
    var headCoordMatrix = new Matrix4(head.matrix);
    head.matrix.scale(.1*2, .1*1.75, .1*1.5);
    head.render();
    
    
    var left_eye = new Cube();
    left_eye.color = g_color_set["eye"];
    left_eye.matrix = new Matrix4(headCoordMatrix);
    left_eye.matrix.translate(.1*.3, .1*1.75 - 2*.1*.3 , - .1*.1);
    left_eye.matrix.scale(.1*.3, .1*.3, .1*.1);
    left_eye.render();

    var left_sclera = new Cube();
    left_sclera.color = g_color_set["sclera"];
    left_sclera.matrix = new Matrix4(left_eye.matrix);
    left_sclera.matrix.translate(-.1 * -10, 0, 0); // Adjust position to the left of the left eye
    left_sclera.matrix.scale(1, 1, 1); // Same size as the eye
    left_sclera.render();
    
    var right_eye = new Cube();
    right_eye.color = g_color_set["eye"];
    right_eye.matrix = new Matrix4(headCoordMatrix);
    right_eye.matrix.translate(.1*.3, .1*1.75 - 2*.1*.3 , .1*1.5);
    right_eye.matrix.scale(.1*.3, .1*.3, .1*.1);
    right_eye.render();

    var right_sclera = new Cube();
    right_sclera.color = g_color_set["sclera"];
    right_sclera.matrix = new Matrix4(right_eye.matrix);
    right_sclera.matrix.translate(.1 * 10, 0, 0); // Adjust position to the right of the right eye
    right_sclera.matrix.scale(1, 1, 1); // Same size as the eye
    right_sclera.render();
    
    
    var tail = new Cube();
    tail.color = g_color_set["tail"];
    tail.matrix = new Matrix4(headCoordMatrix);
    tail.matrix.translate(.1*3*1.5, .1*.5 + .5*.1*1, 2*.1*.25 + .5*.1*1);
    tail.matrix.translate(0, -.5*.1*1, -.5*.1*1);
    tail.matrix.rotate(g_tailAngle, 0, 0, 1);
    tail.matrix.scale(.1*3, .1*1, .1*1);
    tail.render();
    
    var front_left_leg = new Cube();
    front_left_leg.color = g_color_set["leg"];
    front_left_leg.matrix = new Matrix4(bodyCoordMatrix);
    front_left_leg.matrix.translate(.1*.5 + .5*.1*1, 0, -.1*.75);
    front_left_leg.matrix.rotate(g_frontLegAngle, 1, 1, 1);
    front_left_leg.matrix.translate(-.5*.1*1, 0, 0);    // Standardized pivot point
    var frontLeftLegCoordMatrix = new Matrix4(front_left_leg.matrix);
    front_left_leg.matrix.scale(.1*1, .1*.2, .1*.75);
    front_left_leg.render();
    
    var front_left_flipper = new Cube();
    front_left_flipper.color = g_color_set["flipper"];
    front_left_flipper.matrix = new Matrix4(frontLeftLegCoordMatrix);
    front_left_flipper.matrix.translate(0, .1*.2, 0);
    front_left_flipper.matrix.rotate(180 - g_frontFlipperAngle, 1, 0, 0);
    front_left_flipper.matrix.translate(-.1*.25, 0, 0);
    front_left_flipper.matrix.scale(.1*1.5, .1*.2, 2*.1*.75);
    front_left_flipper.render();
    
    var front_right_leg = new Cube();
    front_right_leg.color = g_color_set["leg"];
    front_right_leg.matrix = new Matrix4(bodyCoordMatrix);
    front_right_leg.matrix.translate(.1*.5 + .5*.1*1, 0, .1*2);
    front_right_leg.matrix.rotate(g_frontLegAngle, 1, 1, 1);
    front_right_leg.matrix.translate(-.5*.1*1, 0, .35);   // Standardized pivot point, removed .35 translation
    var frontRightLegCoordMatrix = new Matrix4(front_right_leg.matrix);
    front_right_leg.matrix.scale(.1*1, .1*.2, .1*.75);
    front_right_leg.render();
    
    var front_right_flipper = new Cube();
    front_right_flipper.color = g_color_set["flipper"];
    front_right_flipper.matrix = new Matrix4(frontRightLegCoordMatrix);
    front_right_flipper.matrix.translate(-.1*.25 + .5*.1*1.5, 0, .1*.75);
    front_right_flipper.matrix.rotate(g_frontFlipperAngle, 1, 0, 0);
    front_right_flipper.matrix.translate(-.5*.1*1.5, 0, 0);
    front_right_flipper.matrix.scale(.1*1.5, .1*.2, 2*.1*.75);
    front_right_flipper.render();
    
    var hind_left_leg = new Cube();
    hind_left_leg.color = g_color_set["leg"];
    hind_left_leg.matrix = new Matrix4(bodyCoordMatrix);
    hind_left_leg.matrix.translate(.1*5 - 2*.1*.5 + .5*.1*1, 0, -.1*.75);
    hind_left_leg.matrix.rotate(g_hindLegAngle, 0, 0, 1);
    hind_left_leg.matrix.translate(-.5*.1*1, 0, 0); // have it so that the leg rotates about its center
    var hindLeftLegCoordMatrix = new Matrix4(hind_left_leg.matrix);
    hind_left_leg.matrix.scale(.1*1, .1*.2, .1*.75);
    hind_left_leg.render();
    
    var hind_left_flipper = new Cube();
    hind_left_flipper.color = g_color_set["flipper"];
    hind_left_flipper.matrix = new Matrix4(hindLeftLegCoordMatrix);
    hind_left_flipper.matrix.translate(0, .1*.2, 0);
    hind_left_flipper.matrix.rotate(180 - g_hindFlipperAngle, 1, 0, 0);
    hind_left_flipper.matrix.translate(-.1*.25, 0, 0);
    hind_left_flipper.matrix.scale(.1*1.5, .1*.2, 2*.1*.75);
    hind_left_flipper.render();
    
    var hind_right_leg = new Cube();
    hind_right_leg.color = g_color_set["leg"];
    hind_right_leg.matrix = new Matrix4(bodyCoordMatrix);
    hind_right_leg.matrix.translate(.1*5 - 2*.1*.5 + .5*.1*1, 0, .1*2 );
    hind_right_leg.matrix.rotate(g_hindLegAngle, 0, 0, 1);
    hind_right_leg.matrix.translate(-.5*.1*1, 0, .35);    // have it so that the leg rotates about its center
    var hindRightLegCoordMatrix = new Matrix4(hind_right_leg.matrix);
    hind_right_leg.matrix.scale(.1*1, .1*.2, .1*.75);
    hind_right_leg.render();
    
    var hind_right_flipper = new Cube();
    hind_right_flipper.color = g_color_set["flipper"];
    hind_right_flipper.matrix = new Matrix4(hindRightLegCoordMatrix);
    hind_right_flipper.matrix.translate(-.1*.25 + .5*.1*1.5, 0, .1*.75);
    hind_right_flipper.matrix.rotate(g_hindFlipperAngle, 1, 0, 0);
    hind_right_flipper.matrix.translate(-.5*.1*1.5, 0, 0);
    hind_right_flipper.matrix.scale(.1*1.5, .1*.2, 2*.1*.75);
    hind_right_flipper.render();

}

function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + "from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}

