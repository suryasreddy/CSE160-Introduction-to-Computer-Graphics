class Cube{
    // construct new triangle object 
    constructor(){
        this.type = 'cube';
        //this.position = [0.0, 0.0, 0.0];
        this.color = [1.0,1.0,1.0,1.0];
        //this.size = 5.0;
        //this.segments = 10;
        this.matrix = new Matrix4();
        this.textureNum = -2;
        this.verts = [0,0,0, 1,1,0, 1,0,0, 0,0,0, 0,1,0, 1,1,0, 0,1,0, 0,1,1, 1,1,1, 0,1,0, 1,1,1, 1,1,0, 0,1,0, 0,1,1, 1,1,1, 0,1,0, 1,1,1, 1,1,0, 1,0,0, 1,1,1, 1,1,0,
            1,0,0, 1,0,1, 1,1,1, 0,0,0, 0,1,1, 0,1,0, 0,0,0, 0,0,1, 0,1,1, 0,0,1, 1,1,1, 0,1,1, 0,0,1, 1,0,1, 1,1,1];
        this.vert32bit = new Float32Array([
            0,0,0, 1,1,0, 1,0,0,
            0,0,0, 0,1,0, 1,1,0,
    
            0,1,0, 0,1,1, 1,1,1,
            0,1,0, 1,1,1, 1,1,0,
    
            0,1,0, 0,1,1, 1,1,1,
            0,1,0, 1,1,1, 1,1,0,
    
            0,0,0, 1,0,1, 0,0,1,
            0,0,0, 1,0,0, 1,0,1,
    
            1,0,0, 1,1,1, 1,1,0,
            1,0,0, 1,0,1, 1,1,1,
    
            0,0,1, 1,1,1, 0,1,1,
            0,0,1, 1,0,1, 1,1,1
        ]);
        this.uvVerts  = [
            0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,  0,0, 0,1, 1,1
        ];
    }

    render(){
      //var xy = this.position;
      var rgba = this.color;
      //var size = this.size;                                        
        
        // Pass the texture number
        gl.uniform1i(u_whichTexture, this.textureNum);
        // Pass the color of point to u_FragColor
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);  
        // Pass the matrix to u_ModelMatrix attribute 
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
        //Front of cube
        //drawTriangle3D([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0 ]);
        //drawTriangle3D([0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0 ]);
        // Front of cube
        drawTriangle3DUV([0,0,0,  1,1,0,  1,0,0], [0,0, 1,1, 1,0]);
        drawTriangle3DUV([0,0,0,  0,1,0,  1,1,0], [0,0, 0,1, 1,1]);

        // Top of cube
        drawTriangle3DUV([0,1,0,  1,1,1,  1,1,0], [0,0, 1,1, 1,0]);
        drawTriangle3DUV([0,1,0,  0,1,1,  1,1,1], [0,0, 0,1, 1,1]);

        // Bottom of cube
        drawTriangle3DUV([0,0,0,  1,0,1,  0,0,1], [0,0, 1,1, 1,0]);
        drawTriangle3DUV([0,0,0,  1,0,0,  1,0,1], [0,0, 0,1, 1,1]);

        // Left side of cube
        drawTriangle3DUV([1,0,0,  1,1,1,  1,1,0], [0,0, 1,1, 1,0]);
        drawTriangle3DUV([1,0,0,  1,0,1,  1,1,1], [0,0, 0,1, 1,1]);

        // Right side of cube
        drawTriangle3DUV([0,0,0,  0,1,1,  0,1,0], [0,0, 1,1, 1,0]);
        drawTriangle3DUV([0,0,0,  0,0,1,  0,1,1], [0,0, 0,1, 1,1]);

        // Back of cube
        drawTriangle3DUV([0,0,1,  1,1,1,  0,1,1], [0,0, 1,1, 1,0]);
        drawTriangle3DUV([0,0,1,  1,0,1,  1,1,1], [0,0, 0,1, 1,1]);
    }

    renderfast(){
        var rgba = this.color;

        gl.uniform1i(u_whichTexture, this.textureNum);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        

        var allverts = [];
        // Front of cube
        allverts = allverts.concat([0,0,0, 1,1,0, 1,0,0]);
        allverts = allverts.concat([0,0,0, 0,1,0, 1,1,0]);

        // Top of cube
        allverts = allverts.concat([0,1,0, 0,1,1, 1,1,1]);
        allverts = allverts.concat([0,1,0, 1,1,1, 1,1,0]);

        // Bottom of cube
        allverts = allverts.concat([0,1,0, 0,1,1, 1,1,1]);
        allverts = allverts.concat([0,1,0, 1,1,1, 1,1,0]);

        // Right of cube
        allverts = allverts.concat([0,0,0, 1,0,1, 0,0,1]);
        allverts = allverts.concat([0,0,0, 1,0,0, 1,0,1]);

        // Left of cube
        allverts = allverts.concat([1,0,0, 1,1,1, 1,1,0]);
        allverts = allverts.concat([1,0,0, 1,0,1, 1,1,1]);

        // Back of cube
        allverts = allverts.concat([0,0,1, 1,1,1, 0,1,1]);
        allverts = allverts.concat([0,0,1, 1,0,1, 1,1,1]);

        
        // // var n = this.verts.length/3; 

        // if(g_vertexBuffer == null){
        //     initTriagnle3D();
        // }
    
        // Write date into the buffer object
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(allverts), gl.DYNAMIC_DRAW);
    
        // gl.drawArrays(gl.TRIANGLES, 0, 36);


        drawTriangle3D(allverts);
    }

    renderfaster(){
        var rgba = this.color;                                           // set rgba to the ith point's color field
        
        // Pass the texture number
        gl.uniform1i(u_whichTexture, this.textureNum);
        // Pass the color of point to u_FragColor
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);  
        // Pass the matrix to u_ModelMatrix attribute 
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        
        drawTriangle3DUV(this.verts, this.uvVerts);
    }
}

