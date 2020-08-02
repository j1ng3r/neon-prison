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
let BOUNCE = 1;
export default class Box {
   constructor(a) {
      this.type = a.type;
      this.position = new Vector(a.position);
      this.basePosition = new Vector(a.position);
      this.size = new Vector(a.size);
      if(a.costume) {
         this.costume = a.costume;
      }
      if (a.move) {
         this.move = {
            velocity: new Vector(a.move.velocity),
            sineVector: new Vector(a.move.sineVector)
         };
      } else {
         this.move = {
            velocity: Vector.zero(),
            sineVector: Vector.zero()
         };
      }
      this.col = Box.colors[this.type] || "#FFF";
      this.bright = 255;
      this.fake = false;
      this.draw = this.type !== "N";
   }
   checkLeft(Player) {
      return Player.position.x >= this.position.x + this.size.x + 10
         && Player.position.x + Player.velocity.x <= this.position.x + this.size.x + 15
         && Player.position.y >= this.position.y - 12
         && Player.position.y <= this.position.y + this.size.y + 12;
   }
   senseLeft(Player, bounce = 0) {
      if (this.checkLeft(Player)) {
         Player.position.x = this.position.x + this.size.x + 15;
         Player.velocity.x = 30 * bounce;
         return true;
      }
   }
   checkRight(Player) {
      return Player.position.x <= this.position.x - 10
         && Player.position.x + Player.velocity.x >= this.position.x - 15
         && Player.position.y >= this.position.y - 12
         && Player.position.y <= this.position.y + this.size.y + 12;
   }
   senseRight(Player, bounce = 0) {
      if (this.checkRight(Player)) {
         Player.position.x = this.position.x - 15;
         Player.velocity.x = -30 * bounce;
         return true;
      }
   }
   checkUp(Player) {
      return Player.position.y >= this.position.y + this.size.y + 10
      && Player.position.y + Player.velocity.y <= this.position.y + this.size.y + 15
      && Player.position.x >= this.position.x - 12
      && Player.position.x <= this.position.x + this.size.x + 12;
   }
   senseUp(Player, bounce = 0) {
      if (this.checkUp(Player)) {
         Player.position.y = this.position.y + this.size.y + 15;
         Player.velocity.y = 20 * bounce;
         Player.standing = bounce === 0;
         return true;
      }
   }
   checkDown(Player) {
      return Player.position.y <= this.position.y - 10
         && Player.position.y + Player.velocity.y >= this.position.y - 15
         && Player.position.x >= this.position.x - 12
         && Player.position.x <= this.position.x + this.size.x + 12;
   }
   senseDown(Player, bounce = 0) {
      if (this.checkDown(Player)) {
         Player.position.y = this.position.y - 15;
         Player.velocity.y = -10 * bounce;
         return true;
      }
   }
   checkInside(Player) {
      return Player.position.y < this.position.y + this.size.y + 15
      && Player.position.y > this.position.y - 15
      && Player.position.x > this.position.x - 15
      && Player.position.x < this.position.x + this.size.x + 15;
   }
   /**
    * Calculates the interaction between this Box and a Player object, updating this Box's properties and the Player's properties accordingly
    * @param {Player} Player The Player object interacting with the box
    * @param {integer} time The time, in milliseconds, since the start of the level.
    */
   sense(Player, time) {
      this.basePosition = this.basePosition.add(this.move.velocity);
      this.position = this.basePosition.add(this.move.sineVector.scale(Math.sin(time / 1200)));
      if (this.type === "R") {
         this.senseLeft(Player);
         this.senseUp(Player);
         this.senseRight(Player);
         this.senseDown(Player);
      }
      if (this.type === "N") {
         this.draw = this.senseLeft(Player)
                  || this.senseUp(Player)
                  || this.senseRight(Player)
                  || this.senseDown(Player);
      }
      if (this.type === "B") {
         this.senseLeft(Player, BOUNCE);
         this.senseUp(Player, BOUNCE);
         this.senseRight(Player, BOUNCE);
         this.senseDown(Player, BOUNCE);
      }
      if (this.type === "T") {
         this.senseUp(Player, BOUNCE);
      }
      if (this.type === "S") {
         this.senseLeft(Player);
         this.senseRight(Player);
         this.senseDown(Player);
      }
      if (this.type === "A") {
         this.senseLeft(Player);
         this.senseRight(Player);
         this.senseUp(Player);
      }
      if (this.type === "D" && this.checkInside(Player)) {
         Player.die();
      }
      if (this.type === "F" && this.checkInside(Player)) {
         this.fake = true;
      }
      if (this.type === "E" && this.checkInside(Player)) {
         this.fake = true;
      }
      if (this.type === "U" && this.checkInside(Player)) {
         if(this.checkInside(Player)) {
            Player.velocity.y += 2;
            Player.standing = true;
         }
         
      }
      if (this.type === "V" && this.checkInside(Player)) {
         // Player.velocity.y -= 0.5;
         Player.position.y -= 4;
      }
      if (this.type === "W" && this.checkInside(Player)) {
            return "levelup";
      }
      if (this.type === "*") {
         this.draw = false;
         if (!Player.unlockedCostumes.includes(this.costume) && Player.gained === 0) {
            this.draw = true;
            if (this.checkInside(Player)) {
               Player.gained = this.costume;
            }
         }
      }
   }
   img(canvas) {
      if (this.type === "*") {
         if (this.draw) {
            canvas.drawChar(this.costume, this.position.add([15, 15]).invertY(), 0);
         }
      } else {
         if (this.fake) {
            const hex = "0123456789abcdef";
            this.bright -= (this.bright >= 100);
            let brightness = hex[Math.floor(this.bright / 16)] + hex[this.bright % 16];
            if(this.type === "F") {
               this.col = `#${brightness}${brightness}${brightness}`
            } else {
               this.col = `#${brightness}0000`;
            }
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
