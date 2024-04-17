class MountainRange {
    constructor() {
        this.type = 'mountainrange';
        this.mountainColor = [0.545, 0.271, 0.075, 1.0]; // Brown color for mountains
        this.waterfallColor = [0.0, 0.0, 1.0, 1.0]; // Blue color for waterfall
        this.sunColor = [1.0, 1.0, 0.0, 1.0]; // Yellow color for sun
        this.rayColor = [1.0, 1.0, 0.0, 1.0]; // Yellow color for sun rays
        this.grassColor = [0.196, 0.804, 0.196, 1.0]; // Green color for grass
        this.snowflakeColor = [0.529, 0.808, 0.922, 1.0]; // Light blue color for snowflakes
        this.skyColor = [0.0, 0.0, 0.3, 1.0]; // Dark blue color for the sky
    }

    render() {

        gl.clearColor(this.skyColor[0], this.skyColor[1], this.skyColor[2], this.skyColor[3]);
        gl.clear(gl.COLOR_BUFFER_BIT);
        // Draw sun
        this.drawSun([0.8, 0.8, 0.0, 0.1]); // Circle
        this.drawSunRays([0.85, 0.85, 0.0, 0.1]); // Sun rays

        // Draw mountains
        this.drawMountain([-1.0, -0.5, 0.0, 0.5, 1.0, -0.5]); // Triangle 1
        this.drawMountain([-1.0, -0.5, -0.5, 0.0, 0.0, -0.5]); // Triangle 2
        this.drawMountain([0.0, -0.5, 0.5, 0.0, 1.0, -0.5]); // Triangle 3
        // Add more triangles to create more mountains

         // Draw the white triangle at the tip of the mountain
        this.drawSnowCap([0.0, 0.5, -0.05, 0.55, 0.05, 0.55]); // Triangle 4


        // Draw waterfall
        this.drawWaterfall([0.0, -1.0, -0.1, -0.5, 0.1, -0.5]); // Triangle 1
        this.drawWaterfall([-0.1, -0.5, -0.1, -1.0, 0.1, -0.5]); // Triangle 2
        // Add more triangles to create a larger waterfall

        // Draw grass
        this.drawGrass([-1.0, -1.0, 1.0, -1.0, 1.0, -0.5, -1.0, -1.0, 1.0, -0.5, -1.0, -0.5]); // Rectangle

        // Draw snowflakes
        this.drawSnowflake([-0.9, 0.1]); // Snowflake 1
        this.drawSnowflake([-0.7, 0.3]); // Snowflake 2
        this.drawSnowflake([-0.5, 0.7]); // Snowflake 3
        this.drawSnowflake([-0.3, 0.55]); // Snowflake 4
        this.drawSnowflake([0.3, 0.2]); // Snowflake 5
        this.drawSnowflake([0.5, 0.4]); // Snowflake 6
        this.drawSnowflake([0.7, 0.9]); // Snowflake 7
        this.drawSnowflake([0.9, 0.3]); // Snowflake 8
    }


    drawSun(center) {
        gl.uniform4f(u_FragColor, this.sunColor[0], this.sunColor[1], this.sunColor[2], this.sunColor[3]);
        gl.uniform1f(u_Size, center[3]); // Adjust size of the sun
        drawCircle(center[0], center[1], center[2]);
    }

    drawSunRays(center) {
        gl.uniform4f(u_FragColor, this.rayColor[0], this.rayColor[1], this.rayColor[2], this.rayColor[3]);
        // Draw triangular rays
        // Define the vertices of the triangles
        const rayVertices = [
            center[0], center[1] + center[3],     // Top
            center[0] + 0.1, center[1],           // Bottom right
            center[0] - 0.1, center[1]            // Bottom left
        ];
        drawTriangle(rayVertices);
    }

    drawMountain(vertices) {
        gl.uniform4f(u_FragColor, this.mountainColor[0], this.mountainColor[1], this.mountainColor[2], this.mountainColor[3]);
        gl.uniform1f(u_Size, 1.0); // Adjust size if needed
        drawTriangle(vertices);
    }

    drawSnowCap(vertices) {
    // Adjusting vertices to flip the triangle and make it bigger
    const x1 = vertices[0]; // x-coordinate of the first vertex
    const y1 = vertices[1]; // y-coordinate of the first vertex
    const x2 = vertices[2]; // x-coordinate of the second vertex
    const y2 = vertices[3]; // y-coordinate of the second vertex
    const x3 = vertices[4]; // x-coordinate of the third vertex
    const y3 = vertices[5]; // y-coordinate of the third vertex

    // Calculate new vertices to flip and make the triangle bigger
    const newX1 = x1 - 0.1; // Adjust x-coordinate to move left
    const newX2 = x2 + 0.2; // Adjust x-coordinate to move right and make it bigger
    const newX3 = x3 - 0.1; // Adjust x-coordinate to move left

    // Update vertices array
    const newVertices = [newX1, y1, newX2, y2, newX3, y3];

    // Drawing code for the flipped and bigger white triangle representing the snowcap
    gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0); // White color
    gl.uniform1f(u_Size, 1.0); // Adjust size if needed
    drawTriangle(newVertices);
}


    drawWaterfall(vertices) {
        gl.uniform4f(u_FragColor, this.waterfallColor[0], this.waterfallColor[1], this.waterfallColor[2], this.waterfallColor[3]);
        gl.uniform1f(u_Size, 1.0); // Adjust size if needed
        drawTriangle(vertices);
    }

    drawGrass(vertices) {
        gl.uniform4f(u_FragColor, this.grassColor[0], this.grassColor[1], this.grassColor[2], this.grassColor[3]);
        gl.uniform1f(u_Size, 1.0); // Adjust size if needed
        drawTriangle(vertices);
    }
    drawSnowflake(position) {
        const x = position[0];
        const y = position[1];
        const size = 0.09; // Size of the snowflake
        const segments = 6; // Number of segments for each arm of the snowflake

        gl.uniform4f(u_FragColor, this.snowflakeColor[0], this.snowflakeColor[1], this.snowflakeColor[2], this.snowflakeColor[3]);

        // Draw the snowflake arms
        for (let i = 0; i < 360; i += 60) {
            const angle1 = i * Math.PI / 180;
            const angle2 = (i + 30) * Math.PI / 180;

            const x1 = x + Math.cos(angle1) * size;
            const y1 = y + Math.sin(angle1) * size;
            const x2 = x + Math.cos(angle2) * (size / 2);
            const y2 = y + Math.sin(angle2) * (size / 2);

            drawTriangle([x, y, x1, y1, x2, y2]);
        }
    }
}

function drawTriangle(vertices) {
    var n = vertices.length / 2; // Calculate the number of vertices dynamically

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function drawCircle(x, y, radius) {
    const vertices = [];
    const segments = 1000; // Increase or decrease segments for smoother or less detailed circle
    const angleStep = (2 * Math.PI) / segments;

    for (let i = 0; i < segments; i++) {
        const angle = i * angleStep;
        const vx = x + radius * Math.cos(angle);
        const vy = y + radius * Math.sin(angle);
        vertices.push(vx, vy);
    }

    drawTriangle(vertices);
}



