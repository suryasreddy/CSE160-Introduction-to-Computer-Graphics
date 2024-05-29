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



//Taken from previous assignment: Blocky Animal
function renderBowser(){

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
