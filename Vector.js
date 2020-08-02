export default class Vector {
   constructor(x, y) {
      if (Vector.isVector(x)) {
         this.x = x.x;
         this.y = x.y;
      } else if (Array.isArray(x)) {
         this.x = x[0];
         this.y = x[1];
      } else {
         this.x = x;
         this.y = y;
      }
   }
   static log(...args) {
      if (Vector.debug) {
         console.log(...args);
      }
   }
   static isVector(v) {
      return v instanceof Vector;
   }
   static zero() {
      return new Vector(0, 0);
   }
   round() {
      return new Vector(Math.round(this.x), Math.round(this.y));
   }
   add(...args) {
      let vector = new Vector(...args);
      return new Vector(this.x + vector.x, this.y + vector.y);
   }
   subtract(...args) {
      let vector = new Vector(...args);
      return new Vector(this.x - vector.x, this.y - vector.y);
   }
   scale(scalar) {
      return new Vector(scalar * this.x, scalar * this.y);
   }
   scaleXY(scalar_x, scalar_y) {
      return new Vector(scalar_x * this.x, scalar_y * this.y);
   }
   invertY() {
      return new Vector(this.x, -this.y);
   }
}

Vector.debug = false;
