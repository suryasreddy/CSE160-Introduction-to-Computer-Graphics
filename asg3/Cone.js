class Cone {
    constructor() {
        this.type = 'cone';
        this.color = [1.0, 1.0, 1.0, 1.0]; // default color is white
        this.matrix = new Matrix4();
        this.numSides = 20; // number of triangles to form the base circle, adjust for detail
    }

    render() {
        var rgba = this.color;

        // Pass the color uniform
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the model matrix uniform
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Vertex data for the cone tip and base circle
        var vertices = [];
        var angleStep = 2 * Math.PI / this.numSides;
        var radius = 1.0; // radius of the base of the cone
        var height = 1.0; // height of the cone from base to tip

        // Cone tip at origin
        var tip = [0, 0, height];

        // Generate circle vertices on the base
        for (let i = 0; i < this.numSides; i++) {
            var angle = i * angleStep;
            var x = radius * Math.cos(angle);
            var y = radius * Math.sin(angle);
            var z = 0;

            // Triangle from two adjacent base vertices to the tip
            var nextAngle = (i + 1) * angleStep;
            var nextX = radius * Math.cos(nextAngle);
            var nextY = radius * Math.sin(nextAngle);

            vertices.push(x, y, z);    // Current base vertex
            vertices.push(nextX, nextY, z);  // Next base vertex
            vertices.push(tip[0], tip[1], tip[2]);  // Tip of the cone
        }

        // Draw each triangle
        var n = this.numSides * 3; // Three vertices per triangle
        var vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
            console.log('Failed to create the buffer object for the cone');
            return -1;
        }

        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        // Write data into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);

        // Draw the cone
        gl.drawArrays(gl.TRIANGLES, 0, n);
    }
}
