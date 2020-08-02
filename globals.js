import Box from "./Box.js";
import Levels from "./Levels.js";

/** Global Variables :stevenson: */
const globals = {};

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

globals.keys = [];
globals.sneaky = !1;
globals.lvl = 1;
globals.start = 0;
globals.b;
globals.t;

/**
 * This is some kind of level generation thing??
 */
globals.alabastorBalkans = function alabastorBalkans() {
   globals.time = new Date().getTime();
   globals.b = [];
   let c = Levels[globals.lvl].boxData;
   let e = "";
   let f = { t: null, x: null, y: null, w: null, h: null };
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
