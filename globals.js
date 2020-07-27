import Vector from "./Vector.js";

export let htmlCanvas;
export let ctx;
export let playerCoords = new Vector(0, 0);
export let playerVelocity = new Vector(0, 0);
export let time = 0;
export let invert = !1;
export function setFillStyleOrInvert(color) {
   ctx.fillStyle = color;
   if (invert) {
      color = ctx.fillStyle;
      console.log(color);
      if (color.length == 9) {
         ctx.fillStyle = `#${(0xFFFFFFFF ^ parseInt(color.slice(1), 16)).toString(16).padStart(8, "0")}`;
      } else {
         ctx.fillStyle = `#${(0xFFFFFF ^ parseInt(color.slice(1), 16)).toString(16).padStart(6, "0")}`;
         console.log("Fill: ", ctx.fillStyle);
      }
   }
}
export function roundedRectangle(x, y, w, h, r) {
   if (typeof r === "undefined") {
      r = 0;
   }
   ctx.fillRect(x + r, y, w - r - r, h);
   ctx.fillRect(x, y + r, w, h - r - r);
   ctx.beginPath();
   ctx.arc(x + r, y + r, r, 0, Math.PI * 2);
   ctx.arc(x + w - r, y + r, r, 0, Math.PI * 2);
   ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 2);
   ctx.arc(x + r, y + h - r, r, 0, Math.PI * 2);
   ctx.closePath();
   ctx.fill();
}
export function setCostumes(ary_unlockedCostumes) {
   const c = ary_unlockedCostumes.filter((v, i, m) => m.indexOf(v) === i).reduce((a, v) => a + 2 ** v, 0).toString(36);
   document.cookie = `_d_=${c};`;
}
export function getUnlockedCostumes_as_ary() {
   const c = document.cookie.split(";").find(v => v.slice(0, 4) == "_d_=").slice(4);
   return parseInt(c, 36).toString(2).split("").map((v, i) => +v ? i : -1).filter(i => i > -1);
}
export let unlockedCostumes = getUnlockedCostumes_as_ary();
export let left;
export let right;
export let up;
export let down;
export let l = 1;
/**
 * Poly takes a list of argument pairs.
 * [x, y, x, y] etc and draws a line from each point to the given coodinates.
 * It fills it at the end.
 * It doesn't change any ctx styles which
 */
export function poly(...args) {
   ctx.beginPath();
   ctx.moveTo(args[0], args[1]);
   for (let i = 2; i < Math.floor(args.length / 2) * 2; i += 2) {
      ctx.lineTo(args[i], args[i + 1]);
   }
   ctx.closePath();
   ctx.fill();
}
export let standing = true;
export let gained = 0;
export let deaths = 0;
export let keys = [];
export let sneaky = !1;
export let lvl = 1;
export let start = 0;
export let levelData = [
   "",
   "-100,-15,5,155D-100,140,5,40E-100,180,5,1000D-400,-15,300,1000E-96,-15,40,40R56,-15,40,40R95,-15,300,350W-520,-20,10,10W-500,0,4,*",
   "-415,-15,320,9001D35,-15,300,10D35,-15,10,40D45,15,50,10R-95,-15,60,10D-45,-15,10,40D-95,15,50,10F-95,137,120,3R25,137,70,3F35,175,70,10D35,175,10,40D45,205,50,10F-95,175,60,10D-45,175,10,40D-95,205,50,10R-25,327,120,3R-95,327,70,3F45,395,50,10F35,365,10,40D35,365,70,10D-95,365,60,10D-45,365,10,40D-95,395,50,10R-95,517,70,3F-25,517,130,3R95,-15,300,532D105,517,300,35D95,552,300,400D-5,650,10,30W-15,660,30,10W-10,655,20,20W111,536,7,*105,517,300,35D95,517,10,35E",
   "-515,-20,100,1000R10,200,10,30F0,210,60,10F5,205,10,20F25,-15,500,100D-415,-15,390,100D25,85,35,5N-250,85,35,15N-415,130,5,600D-415,85,25,5N-415,95,10,3W",
   "-520,700,30,5D-520,400,30,5A-520,500,30,5A-520,600,30,5A-480,700,40,5A-520,800,30,5A-520,-15,120,250R20,-15,600,60D-345,35,20,10D-280,35,310,10D-325,35,10,380D-345,45,20,10N-400,150,20,10R-400,140,20,10D-345,240,20,10F-345,230,20,10D-420,235,20,150F-520,235,80,650F-440,235,20,80R-440,315,20,70F-440,365,20,520R-420,385,20,550R-345,330,20,10N-325,415,10,5N-315,45,800,370V0,45,75,20R145,45,30,20R175,45,30,50N205,45,50,20N390,45,300,5R400,100,100,15W-410,925,40,10R415,-20,200,1000R-480,1000,1,*",
   "-520,-20,1100,1000U-520,1100,300,200W-25,20,50,10R-450,500,30,1000E-420,500,1100,1000D-520,500,70,1000D-520,225,465,10D-25,225,455,10D-55,225,30,10E-460,485,10,15N100,490,10,10W-435,800,5,*",
   "-520,-20,132,50R-360,25,225,5R-95,25,1000,5R-20,-20,1000,10R-20,-20,1000,15R-20,-10,1000,10R-20,-10,1000,15R-20,0,1000,10R-20,10,1000,5R-20,0,1000,15R-20,15,1000,5R-20,15,1000,10R-20,15,1000,15R-125,30,20,50W-100,55,5,100N-135,55,5,100N-120,90,10,5N105,30,20,50B-390,-20,370,50F-360,25,225,5R-95,25,1000,5R-400,160,12,30N-300,130,20,20D",
   "500,-20,20,1000U-70,50,140,5A-70,150,140,5A-70,250,140,5A-25,-20,5,200R20,-20,5,350R-25,230,5,100R-25,180,5,50F210,-20,250,370U210,350,250,316V-520,666,950,334U-415,580,1,30U-520,580,730,86V-25,325,50,5S-520,20,495,5S25,20,400,5S210,420,40,5R300,400,40,5R340,400,40,5F375,425,40,5N300,470,40,5A300,470,5,40N275,535,5,5N-520,575,950,5A-500,1020,880,5S150,1000,5,10N-70,50,5,205F65,50,5,205F-520,1025,940,500W415,-20,200,50R415,150,22,900R415,1050,22,900F435,30,100,2000F415,30,20,120F480,825,2,*",
   "-23,-20,6,9N17,-20,6,9N-40,-20,20,10D-100,-20,60,10E20,-20,365,10D385,-20,200,10E-420,-20,320,10D-300,-10,50,10R250,-10,50,10F-40,120,80,5N-420,100,10,5R-420,200,40,5A380,200,40,5A-380,200,20,5N280,-10,20,5N-520,-20,100,2000R415,15,21,1000R406,101,8,3D405,100,10,5F415,-20,100,35F435,100,20,5A435,200,20,5A435,300,20,5A435,400,20,5A435,15,100,1000F500,475,20,15W",
   "400,290,200,10E470,295,40,5N400,390,50,10R410,380,30,10R375,100,1000,10T-30,330,50,10D20,330,10,1000D100,300,30,5F150,300,30,5N100,400,40,5A100,500,40,5A100,600,40,5A100,700,40,5A100,800,40,5A100,900,40,5A100,1000,40,5A95,500,5,1000R140,500,60,5D140,500,5,200D140,700,5,40E140,740,5,1000D195,500,5,1000D-520,-20,1050,10B-520,-15,1050,10B-520,-10,1050,10B-520,-20,20,2000B500,-20,100,2000B-100,100,200,20B-100,100,200,5S-100,120,200,5R-175,0,15,200D100,0,15,300D100,290,300,10D-255,92,10,258D-255,350,10,5N-300,150,45,10T-300,450,100,5A-425,50,15,400B-520,-20,15,2000B-420,50,10,400B-410,50,40,5S-375,0,5,50R155,520,30,30W450,40,3,*",
   (`${function () {
      let j = "";
      for (let i = -20; i <= 160; i += 5) {
         j += `-10,${i},20,10R`;
      }
      return j;
   }()}300,100,50,10B480,275,50,5N480,350,50,5A-450,40,40,5N-520,135,40,5N-480,220,50,10T-520,420,40,5N-520,520,40,5T-450,650,30,5N-380,740,30,5N-350,825,50,5N-320,850,20,5N350,900,60,5A450,1000,70,10N250,1000,100,10D250,1000,10,40D340,1000,10,40D260,1010,80,10W-490,470,6,*`),
   "D-420,-15,200,400D30,-15,400,55D-70,30,100,10D-70,30,10,100F-60,40,100,50R20,40,20,10R20,-15,10,45F-130,-15,80,45R-100,20,120,10R250,40,222,10R-420,-15,290,100R390,-15,30,130R405,-15,30,400R300,170,20,10D250,160,70,10D250,160,20,50R250,220,20,10D200,210,70,10D200,210,20,50R200,270,20,10D150,260,70,10D150,260,20,50R150,320,20,10D100,310,70,10D100,310,20,50R100,370,20,10D50,360,70,10D50,360,20,50R50,420,20,10D0,410,70,10D0,410,20,50F0,470,20,10D-50,460,70,10D-50,460,20,60R-50,520,20,10W410,400,20,20F405,385,30,400W-50,550,20,20W",
];
export let b;
export let t;
class Box {
   constructor(a) {
      this.position = new Vector(a.x, a.y);
      this.bx = a.x;
      this.by = a.y;
      this.w = a.w;
      this.h = a.h;
      this.type = a.t;
      if (a.m) {
         this.move = { Up: (a.m.u || 0), Right: (a.m.r || 0), YSin: (a.m.y || 0), XSin: (a.m.x || 0) };
      } else {
         this.move = { Up: 0, Right: 0, YSin: 0, XSin: 0 };
      }
      this.col = Box.colors[a.t] || "#FFF";
      this.bright = 255;
      this.fake = false;
      this.draw = a.t !== "N";
      const hex = "0123456789abcdef";
      this.img = this.type === "*"
         ? function () {
            if (this.draw) { drawChar(this.w, this.position.x + (htmlCanvas.width / 2) - playerCoords.x, (htmlCanvas.height / 2) + playerCoords.y - this.position.y) }
         } : function () {
            if (this.fake) {
               this.bright -= (this.bright >= 100);
               this.col = hex[Math.floor(this.bright / 16)] + hex[this.bright % 16];
               this.col = `#${this.col}${this.type == "F" ? (this.col + this.col) : "0000"}`;
            }
            setFillStyleOrInvert(this.col);
            if (this.draw) { roundedRectangle(this.position.x + (htmlCanvas.width / 2) - playerCoords.x, (htmlCanvas.height / 2) + playerCoords.y - this.position.y, this.w, 0 - this.h) }
         };
   }
   sense() {
      this.bx += this.move.Right;
      this.by += this.move.Up;
      this.position.y = this.by + this.move.YSin * Math.sin(((new Date()).getTime() - time) / 1200);
      this.position.x = this.bx + this.move.XSin * Math.sin(((new Date()).getTime() - time) / 1200);
      if ("NBASTR".split("").includes(this.type)) {
         left = (playerCoords.x >= this.position.x + this.w + 10 && playerCoords.x + playerVelocity.x <= this.position.x + this.w + 15 && playerCoords.y >= this.position.y - 12 && playerCoords.y <= this.position.y + this.h + 12);
         right = (playerCoords.x <= this.position.x - 10 && playerCoords.x + playerVelocity.x >= this.position.x - 15 && playerCoords.y >= this.position.y - 12 && playerCoords.y <= this.position.y + this.h + 12);
         up = (playerCoords.y >= this.position.y + this.h + 10 && playerCoords.y + playerVelocity.y <= this.position.y + this.h + 15 && playerCoords.x >= this.position.x - 12 && playerCoords.x <= this.position.x + this.w + 12);
         down = (playerCoords.y <= this.position.y - 10 && playerCoords.y + playerVelocity.y >= this.position.y - 15 && playerCoords.x >= this.position.x - 12 && playerCoords.x <= this.position.x + this.w + 12);
      }
      if (this.type === "R") {
         if (left) {
            playerCoords.x = this.position.x + this.w + 15;
            playerVelocity.x = 0;
         }
         if (right) {
            playerCoords.x = this.position.x - 15;
            playerVelocity.x = 0;
         }
         if (up) {
            playerCoords.y = this.position.y + this.h + 15;
            playerVelocity.y = 0;
            standing = true;
         }
         if (down) {
            playerCoords.y = this.position.y - 15;
            playerVelocity.y = 0;
         }
      }
      if (this.type === "N") {
         this.draw = false;
         if (left) {
            this.draw = true;
            playerCoords.x = this.position.x + this.w + 15;
            playerVelocity.x = 0;
         }
         if (right) {
            this.draw = true;
            playerCoords.x = this.position.x - 15;
            playerVelocity.x = 0;
         }
         if (up) {
            this.draw = true;
            playerCoords.y = this.position.y + this.h + 15;
            playerVelocity.y = 0;
            standing = true;
         }
         if (down) {
            this.draw = true;
            playerCoords.y = this.position.y - 15;
            playerVelocity.y = 0;
         }
      }
      if (this.type === "B") {
         if (left) {
            playerCoords.x = this.position.x + this.w + 15;
            playerVelocity.x = 30;
         }
         if (right) {
            playerCoords.x = this.position.x - 15;
            playerVelocity.x = -30;
         }
         if (up) {
            playerCoords.y = this.position.y + this.h + 15;
            playerVelocity.y = 20;
         }
         if (down) {
            playerCoords.y = this.position.y - 15;
            playerVelocity.y = -10;
         }
      }
      if (this.type === "T") {
         if (up) {
            playerCoords.y = this.position.y + this.h + 15;
            playerVelocity.y = 20;
         }
      }
      if (this.type === "S") {
         if (left) {
            playerCoords.x = this.position.x + this.w + 15;
            playerVelocity.x = 0;
         }
         if (right) {
            playerCoords.x = this.position.x - 15;
            playerVelocity.x = 0;
         }
         if (down) {
            playerCoords.y = this.position.y - 15;
            playerVelocity.y = 0;
         }
      }
      if (this.type === "A") {
         if (left) {
            playerCoords.x = this.position.x + this.w + 15;
            playerVelocity.x = 0;
         }
         if (right) {
            playerCoords.x = this.position.x - 15;
            playerVelocity.x = 0;
         }
         if (up) {
            playerCoords.y = this.position.y + this.h + 15;
            playerVelocity.y = 0;
            standing = true;
         }
      }
      if (playerCoords.y < this.position.y + this.h + 15 && playerCoords.y > this.position.y - 15 && playerCoords.x > this.position.x - 15 && playerCoords.x < this.position.x + this.w + 15) {
         if (this.type === "D") { die() }
         if (this.type === "F" && !this.fake) { this.fake = true }
         if (this.type === "E" && !this.fake) { this.fake = true }
         if (this.type === "U") { playerCoords.y += 2; standing = true }
         if (this.type === "V") { playerCoords.y -= 4 }
         if (this.type === "W") {
            return "levelup";
         }
      }
      if (this.type === "*") {
         if (unlockedCostumes.includes(this.w) || gained === this.w) {
            this.draw = false;
         } else {
            this.draw = true;
            if (playerCoords.y < this.position.y + 30 && playerCoords.y > this.position.y - 30 && playerCoords.x > this.position.x - 30 && playerCoords.x < this.position.x + 30) { gained = this.w }
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
// This entire system of level storage and generation is going to get reworked into a JSON file and reader
export function ab(c, d, e, f) {
   time = new Date().getTime();
   gained = 0;
   playerCoords = { x: 0, y: 0 };
   playerVelocity = { x: 0, y: 0 };
   b = [];
   c = levelData[lvl], e = "", f = { t: null, x: null, y: null, w: null, h: null };
   for (d in c) {
      t = c[d].toString();
      if (/-|\d/.test(c[d])) {
         e += t;
      } else if (t == ",") {
         if (f.x == null) {
            f.x = +e || 0;
         } else if (f.y == null) {
            f.y = +e || 0;
         } else if (f.w == null) {
            f.w = +e || 0;
         }
         e = "";
      } else {
         f.h = parseFloat(e);
         f.t = t;
         b.push(new Box(f));
         f = { t: null, x: null, y: null, w: null, h: null };
         e = "";
      }
   }
   if (lvl === 10) {
      b.push(new Box({ x: 300, y: 350, w: 40, h: 5, t: "R", m: { x: 100 } }));
      b.push(new Box({ x: 200, y: 575, w: 40, h: 5, t: "T", m: { y: 150 } }));
      b.push(new Box({ x: (-520), y: -1050, w: 2000, h: 1000, t: "D", m: { u: 0.5 } }));
   }
}
export function die() {
   deaths++;
   if (sneaky || keys[83]) {
      deaths = 0;
      lvl = 1;
      start = 0;
   }
   ab();
}

