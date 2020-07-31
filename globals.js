import Vector from "./Vector.js";
import Canvas from "./Canvas.js";
import Box from "./Box.js";

/** Global Variables :stevenson: */
const globals = {};

globals.canvas = new Canvas();

globals.time = 0;
globals.invert = false;

globals.setCostumes = function setCostumes(ary_unlockedCostumes) {
   const c = ary_unlockedCostumes.filter((v, i, m) => m.indexOf(v) === i).reduce((a, v) => a + 2 ** v, 0).toString(36);
   document.cookie = `_d_=${c};`;
};
globals.getUnlockedCostumes_as_ary = function getUnlockedCostumes_as_ary() {
   let cookie = document.cookie.split(";").find(v => v.slice(0, 4) === "_d_=");
   if (cookie === undefined) {
      cookie = document.cookie = "_d_=1";
   }
   return parseInt(cookie.slice(4), 36).toString(2).split("").map((v, i) => +v ? i : -1).filter(i => i > -1);
};

/**
 * Poly takes a list of argument pairs.
 * [x, y, x, y] etc and draws a line from each point to the given coodinates.
 * It fills it at the end.
 * It doesn't change any ctx styles which
 */
globals.keys = [];
globals.sneaky = !1;
globals.lvl = 1;
globals.start = 0;
globals.levelData = [
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
globals.b;
globals.t;

globals.canvas.drawChar = function drawChar(sprite, position, eyePosition) {
   if (!eyePosition) { eyePosition = 0 }
   position = new Vector(position);
   let { x } = position,
      { y } = position;
   switch (sprite) {
      case 0:
         globals.canvas.fillStyle("#F00");
         globals.canvas.rect([x - 15, y - 15], [30, 10]);
         globals.canvas.fillStyle("#FF0");
         globals.canvas.roundedRect([x - 15, y - 15], [30, 30], 9);
         globals.canvas.fillStyle("#00F");
         globals.canvas.circle([x - 6 + eyePosition, y - 3], 3);
         globals.canvas.circle([x + 6 + eyePosition, y - 3], 3);
         globals.canvas.fillStyle("#000");
         globals.canvas.roundedRect([x - 7, y + 4], [14, 5], 2);
         break;
      case 1:
         globals.canvas.fillStyle("#0FF");
         globals.canvas.rect([x - 15, y - 15], [30, 10]);
         globals.canvas.fillStyle("#00F");
         globals.canvas.roundedRect([x - 15, y - 15], [30, 30], 9);
         globals.canvas.fillStyle("#FF0");
         globals.canvas.circle([x - 6 + eyePosition, y - 3], 3);
         globals.canvas.circle([x + 6 + eyePosition, y - 3], 3);
         globals.canvas.fillStyle("#FFF");
         globals.canvas.roundedRect([x - 7, y + 4], [14, 5], 2);
         return;
      case 2:
         globals.canvas.fillStyle("#FFF");
         globals.canvas.rect([x - 15, y - 15], [30, 10]);
         globals.canvas.fillStyle("#F00");
         globals.canvas.roundedRect([x - 15, y - 15], [30, 30], 9);
         globals.canvas.fillStyle("#000");
         globals.canvas.circle([x - 6 + eyePosition, y - 3], 3);
         globals.canvas.circle([x + 6 + eyePosition, y - 3], 3);
         globals.canvas.fillStyle("#000");
         globals.canvas.roundedRect([x - 7, y + 4], [14, 5], 2);
         return;
      case 3:
         globals.canvas.fillStyle("#000");
         globals.canvas.rect([x - 15, y - 15], [30, 10]);
         globals.canvas.fillStyle("#888");
         globals.canvas.roundedRect([x - 15, y - 15], [30, 30], 9);
         globals.canvas.fillStyle("#fff");
         globals.canvas.circle([x - 6 + eyePosition, y - 3], 3);
         globals.canvas.circle([x + 6 + eyePosition, y - 3], 3);
         globals.canvas.fillStyle("#000");
         globals.canvas.circle([x - 6 + eyePosition, y - 3], 2);
         globals.canvas.circle([x + 6 + eyePosition, y - 3], 2);
         globals.canvas.ctx.fillStyle = globals.canvas.colorsInverted ? "rgba(0,255,255,0.4)" : "rgba(255,0,0,0.4)";
         globals.canvas.roundedRect([x - 7, y + 4], [14, 5], 2);
         globals.canvas.polygon([x + 13, y + 2], [x + 8, y + 10], [x + 8, y + 11], [x + 13, y + 3]);
         return;
      case 4:
         globals.canvas.fillStyle("#0f0");
         globals.canvas.rect([x - 15, y - 15], [30, 10]);
         globals.canvas.fillStyle("#0f0");
         globals.canvas.roundedRect([x - 15, y - 15], [30, 30], 9);
         globals.canvas.fillStyle("#000");
         globals.canvas.circle([x - 6 + eyePosition, y - 3], 3);
         globals.canvas.circle([x + 6 + eyePosition, y - 3], 3);
         globals.canvas.roundedRect([x - 7, y + 4], [14, 5], 2);
         return;
      case 5:
         globals.canvas.fillStyle("#F00");
         globals.canvas.rect([x - 15, y + 5], [30, 10]);
         globals.canvas.fillStyle("#FF0");
         globals.canvas.roundedRect([x - 15, y - 15], [30, 30], 9);
         globals.canvas.fillStyle("#00F");
         globals.canvas.circle([x - 6 - eyePosition, y + 3], 3);
         globals.canvas.circle([x + 6 - eyePosition, y + 3], 3);
         globals.canvas.fillStyle("#000");
         globals.canvas.roundedRect([x - 7, y - 9], [14, 5], 2);
         return;
      case 6:
         globals.canvas.fillStyle("#000");
         globals.canvas.rect([x - 11, y - 11], [22, 22]);
         globals.canvas.fillStyle("#f00");
         globals.canvas.circle([x - 6 + eyePosition, y - 3], 3);
         globals.canvas.circle([x + 6 + eyePosition, y - 3], 3);
         globals.canvas.roundedRect([x - 7, y + 4], [14, 5], 2);
         globals.canvas.fillStyle("#666");
         globals.canvas.rect([x - 15, y - 15], [4, 30]);
         globals.canvas.rect([x - 15, y - 15], [30, 4]);
         globals.canvas.rect([x + 11, y - 15], [4, 30]);
         globals.canvas.rect([x - 15, y + 11], [30, 4]);
         globals.canvas.rect([x - 11, y - 7], [22, 4]);
         globals.canvas.rect([x - 11, y + 3], [22, 4]);
         return;
      case 7:
         globals.canvas.fillStyle("#f00");
         globals.canvas.rect([x - 10, y - 14], [20, 30]);
         globals.canvas.rect([x - 6, y - 16], [12, 4]);
         globals.canvas.rect([x - 12, y - 12], [24, 26]);
         globals.canvas.rect([x - 14, y - 10], [28, 20]);
         globals.canvas.rect([x - 16, y - 6], [32, 14]);
         globals.canvas.fillStyle("#000");
         globals.canvas.rect([x - 8, y - 12], [16, 26]);
         globals.canvas.rect([x - 4, y - 14], [8, 20]);
         globals.canvas.rect([x - 10, y - 6], [20, 18]);
         globals.canvas.rect([x - 8, y - 12], [16, 26]);
         globals.canvas.rect([x - 14, y - 4], [28, 6]);
         globals.canvas.rect([x - 12, y - 8], [24, 4]);
         globals.canvas.fillStyle("#00f");
         globals.canvas.rect([x - 2, y - 14], [4, 8]);
         globals.canvas.rect([x - 4, y - 10], [8, 4]);
         globals.canvas.rect([x + 4, y - 8], [4, 4]);
         globals.canvas.rect([x - 8, y - 8], [4, 4]);
         globals.canvas.rect([x - 10, y - 10], [2, 4]);
         globals.canvas.rect([x + 8, y - 10], [2, 4]);
         globals.canvas.rect([x + 6, y - 4], [2, 4]);
         globals.canvas.rect([x + 6, y], [4, 4]);
         globals.canvas.rect([x + 10, y + 2], [4, 4]);
         globals.canvas.rect([x + 4, y + 2], [2, 2]);
         globals.canvas.rect([x - 8, y - 4], [2, 4]);
         globals.canvas.rect([x - 10, y], [4, 4]);
         globals.canvas.rect([x - 14, y + 2], [4, 4]);
         globals.canvas.rect([x - 6, y + 2], [2, 2]);
         globals.canvas.fillStyle("#f00");
         globals.canvas.rect([x - 10, y + 4], [2, 4]);
         globals.canvas.rect([x + 8, y + 4], [2, 4]);
         globals.canvas.rect([x - 10, y + 4], [20, 2]);
         globals.canvas.rect([x - 4 + eyePosition, y + 6], [2, 4]);
         globals.canvas.rect([x + 2 + eyePosition, y + 6], [2, 4]);
   }
};

/**
 * This is some kind of level generation thing??
 */
globals.alabastorBalkans = function alabastorBalkans() {
   globals.time = new Date().getTime();
   globals.b = [];
   let c = globals.levelData[globals.lvl],
      e = "",
      f = { t: null, x: null, y: null, w: null, h: null };
   for (let d in c) {
      globals.t = c[d].toString();
      if (/-|\d/.test(c[d])) {
         e += globals.t;
      } else if (globals.t == ",") {
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
         f.t = globals.t;
         globals.b.push(new Box(f));
         f = { t: null, x: null, y: null, w: null, h: null };
         e = "";
      }
   }
   if (globals.lvl === 10) {
      globals.b.push(new Box({ x: 300, y: 350, w: 40, h: 5, t: "R", m: { x: 100 } }));
      globals.b.push(new Box({ x: 200, y: 575, w: 40, h: 5, t: "T", m: { y: 150 } }));
      globals.b.push(new Box({ x: (-520), y: -1050, w: 2000, h: 1000, t: "D", m: { u: 0.5 } }));
   }
};

export default globals;