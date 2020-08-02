import Vector from "./Vector.js";
/* A few comments
   D=die
   R=regular
   N=invisible
   F=fake
   W=win
   B=bounce
   U=slowstone
   V=quicksand
   A=jumpblock
   S=fallblock
   E=fake death
   T=bounce jumpblock
   *=New character {x,y,size,number (0 is default)}
*/
export default class Box {
   constructor(a) {
      this.position = new Vector(a.position);
      this.basePosition = new Vector(a.position);
      if(a.costume) {
         this.costume = a.costume;
      }
      this.size = new Vector(a.size);
      this.type = a.t;
      if (a.m) {
         this.move = { velocity: new Vector(a.m.velocity), sineVector: new Vector(a.m.sineVector)};
      } else {
         this.move = { velocity: Vector.zero(), sineVector: Vector.zero()};
      }
      this.col = Box.colors[a.t] || "#FFF";
      this.bright = 255;
      this.fake = false;
      this.draw = a.t !== "N";
   }
   /**
    * Calculates the interaction between this Box and a Player object, updating this Box's properties and the Player's properties accordingly
    * @param {Player} Player The Player object interacting with the box
    * @param {integer} time The time, in milliseconds, since the start of the level.
    */
   sense(Player, time) {
      this.basePosition = this.basePosition.add(this.move.velocity);
      this.position = this.basePosition.add(this.move.sineVector.scale(Math.sin(time / 1200)));
      if ("NBASTR".split("").includes(this.type)) {
         let left = (Player.position.x >= this.position.x + this.size.x + 10 && Player.position.x + Player.velocity.x <= this.position.x + this.size.x + 15 && Player.position.y >= this.position.y - 12 && Player.position.y <= this.position.y + this.size.y + 12);
         let right = (Player.position.x <= this.position.x - 10 && Player.position.x + Player.velocity.x >= this.position.x - 15 && Player.position.y >= this.position.y - 12 && Player.position.y <= this.position.y + this.size.y + 12);
         let up = (Player.position.y >= this.position.y + this.size.y + 10 && Player.position.y + Player.velocity.y <= this.position.y + this.size.y + 15 && Player.position.x >= this.position.x - 12 && Player.position.x <= this.position.x + this.size.x + 12);
         let down = (Player.position.y <= this.position.y - 10 && Player.position.y + Player.velocity.y >= this.position.y - 15 && Player.position.x >= this.position.x - 12 && Player.position.x <= this.position.x + this.size.x + 12);
         if (this.type === "R") {
            if (left) {
               Player.position.x = this.position.x + this.size.x + 15;
               Player.velocity.x = 0;
            }
            if (right) {
               Player.position.x = this.position.x - 15;
               Player.velocity.x = 0;
            }
            if (up) {
               Player.position.y = this.position.y + this.size.y + 15;
               Player.velocity.y = 0;
               Player.standing = true;
            }
            if (down) {
               Player.position.y = this.position.y - 15;
               Player.velocity.y = 0;
            }
         }
         if (this.type === "N") {
            this.draw = false;
            if (left) {
               this.draw = true;
               Player.position.x = this.position.x + this.size.x + 15;
               Player.velocity.x = 0;
            }
            if (right) {
               this.draw = true;
               Player.position.x = this.position.x - 15;
               Player.velocity.x = 0;
            }
            if (up) {
               this.draw = true;
               Player.position.y = this.position.y + this.size.y + 15;
               Player.velocity.y = 0;
               Player.standing = true;
            }
            if (down) {
               this.draw = true;
               Player.position.y = this.position.y - 15;
               Player.velocity.y = 0;
            }
         }
         if (this.type === "B") {
            if (left) {
               Player.position.x = this.position.x + this.size.x + 15;
               Player.velocity.x = 30;
            }
            if (right) {
               Player.position.x = this.position.x - 15;
               Player.velocity.x = -30;
            }
            if (up) {
               Player.position.y = this.position.y + this.size.y + 15;
               Player.velocity.y = 20;
            }
            if (down) {
               Player.position.y = this.position.y - 15;
               Player.velocity.y = -10;
            }
         }
         if (this.type === "T") {
            if (up) {
               Player.position.y = this.position.y + this.size.y + 15;
               Player.velocity.y = 20;
            }
         }
         if (this.type === "S") {
            if (left) {
               Player.position.x = this.position.x + this.size.x + 15;
               Player.velocity.x = 0;
            }
            if (right) {
               Player.position.x = this.position.x - 15;
               Player.velocity.x = 0;
            }
            if (down) {
               Player.position.y = this.position.y - 15;
               Player.velocity.y = 0;
            }
         }
         if (this.type === "A") {
            if (left) {
               Player.position.x = this.position.x + this.size.x + 15;
               Player.velocity.x = 0;
            }
            if (right) {
               Player.position.x = this.position.x - 15;
               Player.velocity.x = 0;
            }
            if (up) {
               Player.position.y = this.position.y + this.size.y + 15;
               Player.velocity.y = 0;
               Player.standing = true;
            }
         }
      }
      if (Player.position.y < this.position.y + this.size.y + 15 && Player.position.y > this.position.y - 15 && Player.position.x > this.position.x - 15 && Player.position.x < this.position.x + this.size.x + 15) {
         if (this.type === "D") { Player.die() }
         if (this.type === "F" && !this.fake) { this.fake = true }
         if (this.type === "E" && !this.fake) { this.fake = true }
         if (this.type === "U") { Player.position.y += 2; Player.standing = true }
         if (this.type === "V") { Player.position.y -= 4 }
         if (this.type === "W") {
            return "levelup";
         }
      }
      if (this.type === "*") {
         if (Player.unlockedCostumes.includes(this.costume) || Player.gained === this.costume) {
            this.draw = false;
         } else {
            this.draw = true;
            if (Player.position.y < this.position.y + 30 && Player.position.y > this.position.y - 30 && Player.position.x > this.position.x - 30 && Player.position.x < this.position.x + 30) {
               Player.gained = this.costume;
            }
         }
      }
   }
   img(canvas) {
      if (this.type === "*") {
         if (this.draw) {
            canvas.drawChar(this.costume, this.position.invertY(), 0);
         }
      } else {
         if (this.fake) {
            const hex = "0123456789abcdef";
            this.bright -= (this.bright >= 100);
            let brightness = hex[Math.floor(this.bright / 16)] + hex[this.bright % 16];
            this.col = `#${brightness}${this.type === "F" ? (brightness + brightness) : "0000"}`;
         }
         canvas.fillStyle(this.col);
         if (this.draw) {
            canvas.rect(this.position.invertY(), this.size.invertY());
         }
      }
   }
}

Box.colors = {
   T: "#0BF",
   D: "#F00",
   E: "#F00",
   W: "#0FF",
   U: "#B90",
   V: "#FB0",
   B: "#00F",
   S: "#F0F",
   A: "#93E",
};
