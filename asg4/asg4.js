// Assignment 4: Lighting
// Surya Reddy
var VSHADER_SOURCE =`
    precision mediump float;
    attribute vec4 a_Position;
    attribute vec2 a_UV;
    varying vec2 v_UV;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;
    attribute vec3 a_Normal;
    varying vec3 v_Normal;
    varying vec4 v_VertPos;
    uniform mat4 u_NormalMatrix;

    void main() {
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
        v_UV = a_UV;
        v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal,1)));
        v_VertPos = u_ModelMatrix * a_Position;
}`;



var FSHADER_SOURCE =`
    precision mediump float;
    varying vec2 v_UV;
    varying vec3 v_Normal;
    varying vec4 v_VertPos;
    uniform vec4 u_FragColor;
    uniform vec3 u_cameraPos;
    uniform bool u_lightON;
    uniform vec3 u_lightPos;
    uniform sampler2D u_Sampler0;
    uniform sampler2D u_Sampler1;
    uniform sampler2D u_Sampler2;
    uniform sampler2D u_Sampler3;
    uniform int u_whichTexture;
    void main() {
        if(u_whichTexture == -3){
         gl_FragColor = vec4((v_Normal + 1.0)/2.0,1.0); 
      } else if (u_whichTexture == -2){
         gl_FragColor = u_FragColor;                  // Use color
      } else if (u_whichTexture == -1){
         gl_FragColor = vec4(v_UV, 1.0, 1.0);         // Use UV debug color
      } else if(u_whichTexture == 0){
         gl_FragColor = texture2D(u_Sampler0, v_UV);  // Use texture0
      } else if(u_whichTexture == 1){
         gl_FragColor = texture2D(u_Sampler1, v_UV);  // Use texture1
      } else if(u_whichTexture == 2){
         gl_FragColor = texture2D(u_Sampler2, v_UV);  // Use texture2
      } else if(u_whichTexture == 3){
         gl_FragColor = texture2D(u_Sampler3, v_UV);  // Use texture3
      } else {
         gl_FragColor = vec4(1,.2,.2,1);              // Error, Red
      }
      vec3 lightVector = u_lightPos - vec3(v_VertPos);
        float r = length(lightVector);

        vec3 L = normalize(lightVector);
        vec3 N = normalize(v_Normal);
        float NdotL = max(dot(N,L),0.0);

        vec3 R = reflect(-L,N);
        vec3 E = normalize(u_cameraPos-vec3(v_VertPos));
        float specular = pow(max(dot(E,R), 0.0), 100.0) * 0.8;

        vec3 diffuse = vec3(gl_FragColor) * NdotL * 0.7;
        vec3 ambient = vec3(gl_FragColor) * 0.3;

        if(u_lightON){
            if(u_whichTexture == 0){
                gl_FragColor = vec4(diffuse + ambient, 1.0);
            }
            else if(u_whichTexture == 4){
                // gl_FragColor = u_FragColor;
            }
            else{ gl_FragColor = vec4(specular + diffuse + ambient, 1.0); }
        }
    }`

// Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let a_Normal;
let u_FragColor;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix
let u_whichTexture;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_cameraPos;
let g_globalAngle = 0;
var g_startTime = performance.now()/1000.0;
var g_seconds   = performance.now()/1000.0 - g_startTime;
let g_camera = new Camera();
let g_lightPos = [0,5,0];
let g_light_vol = [0,10,-1];
let g_normalOn = false;
let g_lightON = true; 
let g_sunAnim = true;
let orbitRadius = 5;  
let orbitCenter = [0, 5, 0];  



function setupCanvas(){
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", {preserveDrawingBuffer: true}); // gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function connectVariablesToGLSL(){
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Get the storage location of a_UV
    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
        console.log('Failed to get the storage location of a_UV');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    // Get the storage location of a_Normal
    a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
    if(a_Normal < 0){
        console.log('Failed to create the a_Normal object');
        return;
    }

    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotateMatrix');
        return;
    }

    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
        console.log('Failed to get the storage location of u_ViewMatrix');
        return;
    }

    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
        console.log('Failed to get the storage location of u_ProjectionMatrix');
        return;
    }

    // Get the storage location of u_ModelMatrix
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    // Get the storage location of u_NormalMatrix
    u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    if (!u_NormalMatrix) {
        console.log('Failed to get the storage location of u_NormalMatrix');
        return;
    }

    // Get the storage location of u_Sampler0
    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if(!u_Sampler0){
        console.log('Failed to create the u_Sampler0 object');
        return;
    }

    // Get the storage location of u_Sampler1
    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if(!u_Sampler1){
        console.log('Failed to create the u_Sampler1 object');
        return;
    }

    // Get the storage location of u_Sampler2
    u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
    if(!u_Sampler2){
        console.log('Failed to create the u_Sampler1 object');
        return;
    }

    // Get the storage location of u_Sampler3
    u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
    if(!u_Sampler3){
        console.log('Failed to create the u_Sampler3 object');
        return;
    }

    // Get the storage location of u_Sampler
    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if(!u_whichTexture){
        console.log('Failed to create the u_whichTexture object');
        return;
    }

    // get the storage location of u_lightPos
    u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
    if(!u_lightPos){
        console.log('Failed to create the u_lightPos object');
        return;
    }

    // get the storage location of u_cameraPos
    u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
    if(!u_cameraPos){
        console.log('Failed to create the u_cameraPos object');
        return;
    }

    // get the storage location of u_lightON
    u_lightON = gl.getUniformLocation(gl.program, 'u_lightON');
    if(!u_lightON){
        console.log('Failed to create the u_lightON object');
        return;
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
    let g_Bowser = false;
    //let speedMultiplier = 5; 

function addActionForHtmlUI(){    
    document.getElementById('normalOn').onclick  = function(){g_normalOn = true; }
    document.getElementById('normalOff').onclick = function(){g_normalOn = false;}
    document.getElementById('lightSwitch').onclick  = function(){g_lightON = !g_lightON;}
    document.getElementById('animaSun').onclick = function(){g_sunAnim = !g_sunAnim;}
    document.getElementById('lightX').onmousemove = function(ev){g_lightPos[0] = this.value/5; renderAllShapes;}
    document.getElementById('lightY').onmousemove = function(ev){g_lightPos[1] = this.value/5; renderAllShapes;}
    document.getElementById('lightZ').onmousemove = function(ev){g_lightPos[2] = this.value/5; renderAllShapes;}
    document.getElementById('view_bowser').onclick  = function(){g_Bowser = !g_Bowser};
    // buttons to turn on/off animations
    document.getElementById("animation_on").onclick = function() {g_animation = true;}
    document.getElementById("animation_off").onclick = function() {g_animation = false;}
}

function convertCoordEventToWebGL(ev){
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    return ([x,y]);
}

function initTextures(){
   //load first texture
    var image0 = new Image();
    if(!image0){
        console.log('Failed to create the image0 object');
        return false;
    }
    // Register the event handler to be called on loading an image
    image0.onload = function(){ sendTextureToTEXTURE0(image0); };
    // Tell the browser to load
    image0.src = 'stone123.jpg';

    //load second texture
    var image1 = new Image();
    if(!image1){
        console.log('Failed to create the image1 object');
        return false;
    }
    // Register the event handler to be called on loading an image
    image1.onload = function(){ sendTextureToTEXTURE1(image1); };
    // Tell the browser to load
    image1.src = 'stone23.jpg';

    //load third texture
    var image2 = new Image();
    if(!image2){
        console.log('Failed to create the image2 object');
        return false;
    }
    // Register the event handler to be called on loading an image
    image2.onload = function(){ sendTextureToTEXTURE2(image2); };
    // Tell the browser to load
    image2.src = 'lava.jpg';

    //load third texture
    var image3 = new Image();
    if(!image3){
        console.log('Failed to create the image3 object');
        return false;
    }
    // Register the event handler to be called on loading an image
    image3.onload = function(){ sendTextureToTEXTURE3(image3); };
    // Tell the browser to load
    image3.src = 'hotstone.jpg';
    
    return true;
}

function sendTextureToTEXTURE0(image){
    var texture = gl.createTexture();   // create a texture object
    if(!texture){
        console.log('Failed to create the texture0 object');
        return false;
    }

    // flip the image's Y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    // enable texture unit0
    gl.activeTexture(gl.TEXTURE0);
    // bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler0, 0);
}

function sendTextureToTEXTURE1(image){
    var texture = gl.createTexture();   // create a texture object
    if(!texture){
        console.log('Failed to create the texture1 object');
        return false;
    }

    // flip the image's Y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    // enable texture unit1
    gl.activeTexture(gl.TEXTURE1);
    // bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler1, 1);
}

function sendTextureToTEXTURE2(image){
    var texture = gl.createTexture();   // create a texture object
    if(!texture){
        console.log('Failed to create the texture2 object');
        return false;
    }

    // flip the image's Y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    // enable texture unit0
    gl.activeTexture(gl.TEXTURE2);
    // bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler2, 2);
}

function sendTextureToTEXTURE3(image){
    var texture = gl.createTexture();   // create a texture object
    if(!texture){
        console.log('Failed to create the texture3 object');
        return false;
    }

    // flip the image's Y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    // enable texture unit0
    gl.activeTexture(gl.TEXTURE3);
    // bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler3, 3);
}

function main(){
    setupCanvas(); // set global canvas webGL 
    connectVariablesToGLSL(); // Initialize shaders
    addActionForHtmlUI(); // Connect buttons and sliders to js actions
    initTextures(); // Init textures
    document.onkeydown = keydown;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Specify the color for clearing <canvas>
    // Clear <canvas>    
    // gl.clear(gl.COLOR_BUFFER_BIT); 
    requestAnimationFrame(tick);
}

function tick(){
    g_seconds = performance.now()/1000.0 - g_startTime;
    updateAnimationAngles();             
    renderAllShapes();                      
    requestAnimationFrame(tick);                       
}

function updateAnimationAngles() {
    if (g_sunAnim) {
        g_lightPos[0] = orbitRadius * Math.sin(g_seconds); // X coordinate
        g_lightPos[2] = orbitRadius * Math.cos(g_seconds); // Y coordinate

    }
    
    if (g_animation) {
        g_tailAngle = 5.0 * Math.sin(5 * g_seconds + .174);
        g_frontLegAngle = 15 * Math.sin(5 * 2 * g_seconds);
        g_frontFlipperAngle = 60 * Math.sin(5 * 2 * g_seconds);
        g_hindLegAngle = 10 * Math.sin(5 * 2 * g_seconds);
        g_hindFlipperAngle = 10 * Math.sin(5 * g_seconds);
        g_bodyAngle = 10 * Math.sin(5 * g_seconds);
    } else {
        g_tailAngleX = 0;
    }
}


function keydown(ev){
    if(ev.keyCode      == 68){   
        g_camera.right();
    }
    else if(ev.keyCode == 65){
        g_camera.left();  
    }
    else if(ev.keyCode == 87){  
        g_camera.forward();
    }
    else if(ev.keyCode == 83){    
        g_camera.backward();
    }
    else if(ev.keyCode == 69){    
        g_camera.rotRight();
    }
    else if(ev.keyCode == 81){
        g_camera.rotLeft();      
    }
    else if(ev.keyCode == 90){
        g_camera.upward();        
    }
    else if(ev.keyCode == 88){
        g_camera.downward();      
    }
    renderAllShapes();
}

function renderAllShapes(){
    var startTime = performance.now();
    // Pass the project matrix
    var projMat = new Matrix4();
    projMat.setPerspective(60, canvas.width/canvas.height, .1, 100); 
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

    // Pass the view matrix
    var viewMat = new Matrix4();
    viewMat.setLookAt(
        g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],  
        g_camera.at.elements[0], g_camera.at.elements[1],  g_camera.at.elements[2],
        g_camera.up.elements[0], g_camera.up.elements[1],  g_camera.up.elements[2]);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

    // Pass the matrix to u_ModelMatrix attribute
    var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1 ,0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Pass the Light's position to GLSL
    gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);

    // Pass the Camera's position to GLSL
    gl.uniform3f(u_cameraPos, g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2]);
    gl.uniform1i(u_lightON, g_lightON);

    //render all shapes
    renderLight();
    renderSetting();
    drawMap();
    if(g_Bowser){ renderBowser(); }

}

function renderLight(){
    var light = new Sphere();
    if(g_normalOn) {light.textureNum = -3;}
    light.color = [0.8, 0.8, 0, 1];
    light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
    light.matrix.scale(-2,-2,-2);
    light.render();
}


function renderSetting(){
    var pit = new Cube();
    pit.textureNum = 2;
    //ocean.color = [0, .25, .5, 1];
    pit.matrix.translate(-0, -.9, -0);
    pit.matrix.scale(63, .1, 63);
    pit.matrix.translate(-.35, 0, -.35);
    pit.render();

    var floor = new Cube();
    floor.textureNum = 1;
    floor.matrix.translate(-0, -.75, -0);
    floor.matrix.scale(35, .01, 35);
    floor.matrix.translate(-.15, 0, -.15);
    floor.render();

   var sky = new Cube();
   if(g_normalOn) {sky.textureNum = -3;}
   sky.color = [0.5, 0.05, 0.05, 1.0];  // Dark velvet blood red with no transparency
   sky.matrix.translate(-1, 0, -1);
   sky.matrix.scale(60, 60, 60);
   sky.matrix.translate(-0.3, -0.5, -0.3);
   sky.render();
}

let g_map = [
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    [4, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 18, 16, 18, 16, 18, 1, 1, 1, 1, 1, 1, 1, 18, 16, 18, 16, 18, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 16, 14, 14, 14, 16, 2, 2, 2, 2, 2, 2, 2, 16, 14, 14, 14, 16, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 18, 14, 14, 14, 18, 2, 2, 2, 2, 2, 2, 2, 18, 14, 14, 14, 18, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 16, 14, 14, 14, 16, 3, 3, 3, 3, 3, 3, 3, 16, 14, 14, 14, 16, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 18, 16, 18, 16, 18, 3, 3, 3, 3, 3, 3, 3, 18, 16, 18, 16, 18, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 14, 0, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 12, 0, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 14, 0, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 12, 0, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 14, 0, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 12, 0, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 14, 0, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 18, 16, 18, 16, 18, 0, 0, 0, 0, 0, 0, 0, 18, 16, 18, 16, 18, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 16, 14, 14, 14, 16, 0, 0, 0, 0, 0, 0, 0, 16, 14, 14, 14, 16, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 18, 14, 14, 14, 18, 14, 12, 14, 12, 14, 12, 14, 18, 14, 14, 14, 18, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 16, 14, 14, 14, 16, 0, 0, 0, 0, 0, 0, 0, 16, 14, 14, 14, 16, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 18, 16, 18, 16, 18, 0, 0, 0, 0, 0, 0, 0, 18, 16, 18, 16, 18, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
    [4, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 4],
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    [4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 4],
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
];

function drawMap(){
    // var c = new Cube();
    for(x=0; x<32; x++){
        for(y=0;y<32;y++){
            if(g_map[x][y] > 0 && g_map[x][y] < 6){   
                for(z=0; z<g_map[x][y]; z++){
                    var c = new Cube();
                    c.textureNum = 0;
                    c.matrix.translate(y-4, z-.75, x-4);
                    c.renderfaster();
                }              
            }
            if(g_map[x][y] > 6){
                for(z=0; z<g_map[x][y]; z++){
                    var c = new Cube();
                    c.textureNum = 3;
                    c.matrix.translate(y-4, z-.75, x-4);
                    c.renderfaster();
                }      
            }   
        }
    }
}
