class Star{
   constructor(){
      this.type='star';
      this.position = [0.0, 0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.size = 5.0;
      this.segments = 10;
   }

   render() {
      var xy = this.position;
      var rgba = this.color;
      var size = this.size;

      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      // Draw
      var d = this.size/200.0;
      let angleStep = 360/this.segments;
      let outerRadius = size / 100.0;
      let innerRadius = outerRadius / 2.0;

      for(let i = 0; i < this.segments; i++) {
          let angle1 = i * angleStep;
          let angle2 = (i + 0.5) * angleStep;

          let x1 = xy[0] + Math.cos(angle1 * Math.PI / 180) * outerRadius;
          let y1 = xy[1] + Math.sin(angle1 * Math.PI / 180) * outerRadius;
          let x2 = xy[0] + Math.cos(angle2 * Math.PI / 180) * innerRadius;
          let y2 = xy[1] + Math.sin(angle2 * Math.PI / 180) * innerRadius;

          drawTriangle([xy[0], xy[1], x1, y1, x2, y2]);
      }
   }
}
