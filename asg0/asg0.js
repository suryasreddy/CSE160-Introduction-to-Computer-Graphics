// Surya Reddy
// Asgn0: Matix libraries

//declare global variables outside scope
var canvas;
var ctx;

function main() {
  // Retrieve <canvas> element
  canvas = document.getElementById('asg0');
  if (!canvas) {
    console.log('Failed to retrieve the <canvas> element');
    return;
  }

  ctx = canvas.getContext('2d');

  // Set canvas to black
  ctx.fillStyle = 'black'; 
  ctx.fillRect(0, 0, 400, 400);
}

function drawVector(v, color){
   ctx.strokeStyle = color; // Set color
   ctx.beginPath();
   ctx.moveTo(canvas.width/2, canvas.height/2);
   // scale by 20 to match canvas
   ctx.lineTo(200+v.elements[0]*20, 200-v.elements[1]*20, v.elements[2]*20);
   ctx.stroke();
}

function handleDrawEvent(){
    // read values of text boxes to get v1
    var x = document.getElementById('xcoord').value;
   	var y = document.getElementById('ycoord').value;
   	//read values of text boxes to get v2
   	var x2 = document.getElementById('xcoord2').value;
   	var y2 = document.getElementById('ycoord2').value;

   	// clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

   // sets background to black
   ctx.fillStyle = 'black'; // Set color to black
   ctx.fillRect(0, 0, 400, 400);

   // draws first vector
   var v1 = new Vector3([x, y, 0.0]);
   drawVector(v1, "red");
   // draws second vector
   var v2 = new Vector3([x2, y2, 0.0]);
   drawVector(v2, "blue");
}

function handleDrawOperationEvent(){
   var x = document.getElementById('xcoord').value;
   var y = document.getElementById('ycoord').value;
   var x2 = document.getElementById('xcoord2').value;
   var y2 = document.getElementById('ycoord2').value;

   // Clear Canvas
   ctx.clearRect(0, 0, canvas.width, canvas.height);

   // Black blackground
   ctx.fillStyle = 'black'; // Set color to black
   ctx.fillRect(0, 0, 400, 400);

   // Draw lines
   var v1 = new Vector3([x, y, 0.0]);
   drawVector(v1, "red");
   var v2 = new Vector3([x2, y2, 0.0]);
   drawVector(v2, "red");

   var operator = document.getElementById('oper').value;
   // implement add and subtract
   if (operator == "Add"){
      v1.add(v2);
      drawVector(v1, "green");
   } else if (operator == "Subtract"){
      v1.sub(v2);
      drawVector(v1, "green");
   // implement multiply and divide
   } else if (operator == "Multiply"){
      var s = document.getElementById('scalar').value;
      v1.mul(s);
      drawVector(v1, "green");
      v2.mul(s);
      drawVector(v2, "green");
   } else if (operator == "Divide"){
      var s = document.getElementById('scalar').value;
      v1.div(s);
      drawVector(v1, "green");
      v2.div(s);
      drawVector(v2, "green");
   // implement magnitude
   } else if (operator == "Mag"){
      console.log("Magnitude v1: "+ v1.magnitude());
      console.log("Magnitude v2: "+ v2.magnitude());
   // implement normalize
   } else if (operator == "Norm"){
      var v1n = v1.normalize();
      drawVector(v1n, "green");
      var v2n = v2.normalize();
      drawVector(v2n, "green");
   // implement angle between
   } else if (operator == "Ang"){
      console.log("Angle: " + (angleBetween(v1, v2)).toFixed(2));
   // implement area of trangle
   } else if (operator == "Area"){
      console.log("Area of this triangle: " + (areaTriangle(v1, v2)).toFixed(2));
   }
}

// implement anglebetween
function angleBetween(v1, v2){
   var mag1 = v1.magnitude();
   var mag2 = v2.magnitude();
   var d = Vector3.dot(v1, v2);
   var alpha = Math.acos(d/(mag1*mag2)); 
   alpha *= 180/Math.PI;

   return alpha;
}

//implement area of triangle
function areaTriangle(v1, v2){
   var crossProduct = Vector3.cross(v1, v2);
   var crossMagnitude = crossProduct.magnitude();
   var area = crossMagnitude / 2;
   
   return area;
}

/*
function testCrossProduct() {
    // Define two vectors
    let v1 = new Vector3([1, 2, 3]);
    let v2 = new Vector3([4, 5, 6]);

    // Compute cross product
    let result = Vector3.cross(v1, v2);

    // Expected result: (-3, 6, -3)
    let expectedResult = new Vector3([-3, 6, -3]);

    // Compare the result with the expected result
    if (result.equals(expectedResult)) {
        console.log("Cross product test passed.");
    } else {
        console.log("Cross product test failed. Expected:", expectedResult, "but got:", result);
    }
}

// Call the test function
testCrossProduct();
*/

