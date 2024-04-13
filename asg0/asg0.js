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
   // I multiplied each element by 20 in order to scale to the new canvas size
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
   // Get input values
   var x = document.getElementById('xcoord').value;
   var y = document.getElementById('ycoord').value;
   var x2 = document.getElementById('xcoord2').value;
   var y2 = document.getElementById('ycoord2').value;
   
   // Clear Canvas and set background color to black
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   ctx.fillStyle = 'black';
   ctx.fillRect(0, 0, 400, 400);

   // Draw vectors
   var v1 = new Vector3([x, y, 0.0]);
   var v2 = new Vector3([x2, y2, 0.0]);
   drawVector(v1, "red");
   drawVector(v2, "red");

   // Get operator
   var operator = document.getElementById('oper').value;


   // Perform operations based on operator
   switch(operator) {	//idea for switch operator taken from personal calculator project
      case "Add":
         v1.add(v2);
         break;
      case "Subtract":
         v1.sub(v2);
         break;
      case "Multiply":
         var s = document.getElementById('scalar').value;
         v1.mul(s);
         v2.mul(s);
      case "Divide":
         var s = document.getElementById('scalar').value;
         v1.div(s);
         v2.div(s);
         break;
      case "Norm":
         v1.normalize();
         v2.normalize();
         break;
      case "Ang":
         console.log("Angle: " + angleBetween(v1, v2).toFixed(2));
         break;
      case "Area":
         console.log("Area of this triangle: " + areaTriangle(v1, v2).toFixed(2));
         break;
      case "Mag":
         console.log("Magnitude v1: "+ v1.magnitude());
         console.log("Magnitude v2: "+ v2.magnitude());
         break;
      default:
         console.log("Invalid operator");
   }

   // Draw modified vectors
   if (operator !== "Ang" && operator !== "Area" && operator !== "Mag") {
      drawVector(v1, "green");
      drawVector(v2, "green");
   }
}


// implement anglebetween
function angleBetween(v1, v2){
   var mag1 = v1.magnitude();
   var mag2 = v2.magnitude();
   var d = Vector3.dot(v1, v2);
   var angle = Math.acos(d/(mag1*mag2)); // Calculate the angle between the vectors using the dot product.
   angle *= 180/Math.PI; // Convert angle from radians to degrees.

   return angle;
}

//implement area of triangle
function areaTriangle(v1, v2){
   var cs = Vector3.cross(v1, v2);
   var mag1 = cs.magnitude(); // Calculate the magnitude of the resulting vector (which is proportional to the area of the parallelogram formed by v1 and v2).
   var area = mag1/ 2;  // The area of the triangle is half the magnitude of the cross product vector.
   
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

