class Sphere{
    constructor(){
        this.type = 'sphere';
        this.color = [1.0,1.0,1.0,1.0];
        this.matrix = new Matrix4();
        this.normalMatrix = new Matrix4();
        this.textureNum = -2;
    }

    render(){
        let colorRGBA = this.color; // set colorRGBA to the ith point's color field
        gl.uniform1i(u_whichTexture, this.textureNum); // Pass the texture number
        gl.uniform4f(u_FragColor, colorRGBA[0], colorRGBA[1], colorRGBA[2], colorRGBA[3]); // Pass the color of point to u_FragColor
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements); // Pass the matrix to u_ModelMatrix attribute 
        gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements); // Pass the matrix to u_NormallMatrix attribute
        let angleDelta = Math.PI/10; //delta1
        let radialDelta = Math.PI/10; //delta2

        for(let theta=0; theta<Math.PI; theta=theta+angleDelta){
            for(let radius=0; radius<(2*Math.PI); radius=radius+angleDelta){
                let point1 = [Math.sin(theta)*Math.cos(radius), Math.sin(theta)*Math.sin(radius), Math.cos(theta)];
                let point2 = [Math.sin(theta+radialDelta)*Math.cos(radius), Math.sin(theta+radialDelta)*Math.sin(radius), Math.cos(theta+radialDelta)];
                let point3 = [Math.sin(theta)*Math.cos(radius+radialDelta), Math.sin(theta)*Math.sin(radius+radialDelta), Math.cos(theta)];
                let point4 = [Math.sin(theta+radialDelta)*Math.cos(radius+radialDelta), Math.sin(theta+radialDelta)*Math.sin(radius+radialDelta), Math.cos(theta+radialDelta)];

                let uvPoint1 = [theta/Math.PI, radius/(2*Math.PI)];
                let uvPoint2 = [(theta+radialDelta)/Math.PI, radius/(2*Math.PI)];
                let uvPoint3 = [(theta)/Math.PI, (radius+radialDelta)/(2*Math.PI)];
                let uvPoint4 = [(theta+radialDelta)/Math.PI, (radius+radialDelta)/(2*Math.PI)];

                let vertices = [];
                vertices = vertices.concat(point1); 
                vertices = vertices.concat(point2);  
                vertices = vertices.concat(point4); 
                
                let uvCoords = [];
                uvCoords = uvCoords.concat(uvPoint1); 
                uvCoords = uvCoords.concat(uvPoint2); 
                uvCoords = uvCoords.concat(uvPoint4);
                drawTriangle3DUVNormal(vertices, uvCoords, vertices);

                vertices = [];
                vertices = vertices.concat(point1); 
                vertices = vertices.concat(point4);  
                vertices = vertices.concat(point3); 

                uvCoords = [];
                uvCoords = uvCoords.concat(uvPoint1); 
                uvCoords = uvCoords.concat(uvPoint4); 
                uvCoords = uvCoords.concat(uvPoint3);

                drawTriangle3DUVNormal(vertices, uvCoords, vertices);
            }
        }

    }

    renderfaster(){
        let colorRGBA = this.color; // set colorRGBA to the ith point's color field
        gl.uniform1i(u_whichTexture, this.textureNum); // Pass the texture number
        gl.uniform4f(u_FragColor, colorRGBA[0], colorRGBA[1], colorRGBA[2], colorRGBA[3]); // Pass the color of point to u_FragColor
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements); // Pass the matrix to u_ModelMatrix attribute 
        drawTriangle3DUVNormal(this.verts, this.uvVerts, this.NormalVerts);
    }
}

