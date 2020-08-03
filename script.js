import Levels from "./Levels.js";
import globals from "./globals.js";
import Player from "./Player.js";
import Draw from "./Draw.js";

let draw = new Draw(globals.canvas);

let pau = 0;
let rsr = 1;
let paused = 0;
let clickin = null;

function setCostumes(ary_unlockedCostumes) {
   const c = ary_unlockedCostumes.filter((v, i, m) => m.indexOf(v) === i).reduce((a, v) => a + 2 ** v, 0).toString(36);
   document.cookie = `_d_=${c};`;
};
function getUnlockedCostumes_as_ary() {
   let cookie = document.cookie.split(";").find(v => v.slice(0, 4) === "_d_=");
   if (cookie === undefined) {
      cookie = document.cookie = "_d_=1";
   }
   return parseInt(cookie.slice(4), 36).toString(2).split("").reverse().map((v, i) => +v ? i : -1).filter(i => i > -1);
};

function update() {
   if (!paused) {
      if(globals.evts.keys[84]) {
         globals.lvl = +prompt("Which level?") || globals.lvl;
         Player.reset();
         globals.time = Date.now();
         globals.b = Levels.generate(globals.lvl);
         globals.evts.keys[84] = false;
         return;
      }
      if (globals.evts.keys[83]) { Player.die() }
      if (globals.evts.keys[82] && rsr) {
         Player.die();
         rsr = 0;
      }
      if (!rsr && !globals.evts.keys[82]) { rsr = 1 }
      if (globals.evts.keys[37] || globals.evts.keys[65]) {
         Player.velocity.x -= 1;
         Player.eyePosition -= 0.5;
         if (!globals.start) {
            globals.start = Date.now();
         }
      }
      if (globals.evts.keys[39] || globals.evts.keys[68]) {
         Player.velocity.x += 1;
         Player.eyePosition += 0.5;
         if (!globals.start) {
            globals.start = Date.now();
         }
      }
      if (Player.standing) {
         Player.velocity.y = 0;
         if (globals.evts.keys[38] || globals.evts.keys[87]) {
            Player.velocity.y = 13;
            if (!globals.start) {
               globals.start = Date.now();
            }
         }
      } else {
         Player.velocity.y -= 0.3;
      }
      Player.standing = false;
      if (Player.position.y + Player.velocity.y <= 0) {
         Player.standing = true;
         Player.position.y = 0;
         Player.velocity.y = 0;
      }
      if (Player.position.x + Player.velocity.x <= -500) {
         Player.velocity.x = 0;
         Player.position.x = -500;
      }
      if (Player.position.x + Player.velocity.x >= 500) {
         Player.velocity.x = 0;
         Player.position.x = 500;
      }
      for (let i in globals.b) {
         if (globals.b[i].sense(Player, Date.now() - globals.time) === "levelup") {
            globals.lvl++;
            if (Player.gained) {
               Player.unlockedCostumes.push(Player.gained);
               setCostumes(Player.unlockedCostumes);
               Player.unlockedCostumes = getUnlockedCostumes_as_ary();
            }
            Player.reset();
            globals.time = Date.now();
            globals.b = Levels.generate(globals.lvl);
            return;
         }
      }
      Player.eyePosition *= 0.9;
      Player.velocity = Player.velocity.scaleXY(0.8, 0.95);
      Player.position = Player.position.add(Player.velocity);
      pau = globals.start ? Math.floor((Date.now() - globals.start) / 100) / 10 : 0;
   }

   
   draw.background();
   draw.boxes(globals.b);
   draw.walls(Player.position);
   draw.player(Player);
   draw.frame();
   draw.info(globals.lvl, Player.deaths, pau);
   draw.subtext(globals.lvl, Player.deaths);
   draw.gear(paused);
   
   if (paused) {
      draw.blankout();
      draw.variantMenu(globals.canvas.colorsInverted, globals.sneaky);
      draw.characterMenu(Player.unlockedCostumes);
      
      if (globals.evts.clicked) {
         if (clickin === null) {
            if (globals.evts.mouse.x > 150 && globals.evts.mouse.x < 166 && !clickin) {
               if (globals.evts.mouse.y > 150 && globals.evts.mouse.y < 166) {
                  clickin = "invert";
               }
               if (globals.evts.mouse.y > 200 && globals.evts.mouse.y < 216) {
                  clickin = "wan";
               }
            }
            // Allot a lot of lots to my parking lot.
            if (globals.canvas.size.y - 55 > globals.evts.mouse.y && globals.evts.mouse.y > globals.canvas.size.y - 85) {
               Player.unlockedCostumes.forEach((costume, i) => {
                  if (105 + i * 50 < globals.evts.mouse.x && globals.evts.mouse.x < 135 + i * 50) {
                     clickin = i;
                  }
               });
            }
         }
      } else {
         if (globals.evts.mouse.x > 150 && globals.evts.mouse.x < 166 && globals.evts.mouse.y > 200 && globals.evts.mouse.y < 216 && clickin === "wan") {
            globals.sneaky = !globals.sneaky;
            clickin = null;
         }
         if (globals.evts.mouse.x > 150 && globals.evts.mouse.x < 166 && globals.evts.mouse.y > 150 && globals.evts.mouse.y < 166 && clickin === "invert") {
            globals.canvas.invertColors();
            clickin = null;
         }
         if (globals.canvas.size.y - 55 > globals.evts.mouse.y && globals.evts.mouse.y > globals.canvas.size.y - 85) {
            Player.unlockedCostumes.forEach((costume, i) => {
               if (105 + i * 50 < globals.evts.mouse.x && globals.evts.mouse.x < 135 + i * 50) {
                  Player.costume = costume;
                  clickin = null;
               }
            });
         }
      }
   }
   if (globals.evts.clicked) {
      if (((globals.evts.mouse.x - globals.canvas.size.x + 50) * (globals.evts.mouse.x - globals.canvas.size.x + 50) + (globals.evts.mouse.y - globals.canvas.halfsize.y) * (globals.evts.mouse.y - globals.canvas.halfsize.y)) < 2025 && !clickin) {
         clickin = "button";
      }
   } else {
      if (((globals.evts.mouse.x - globals.canvas.size.x + 50) * (globals.evts.mouse.x - globals.canvas.size.x + 50) + (globals.evts.mouse.y - globals.canvas.halfsize.y) * (globals.evts.mouse.y - globals.canvas.halfsize.y)) < 2025 && clickin === "button") {
         paused = !paused;
         globals.start = Date.now() - pau * 1000;
      }
      clickin = null;
   }
}
function animator() {
   try {
      update();
   } catch (e) {
      console.error(e);
   }
   requestAnimationFrame(animator);
}

Player.unlockedCostumes = getUnlockedCostumes_as_ary();
globals.b = Levels.generate(globals.lvl);
animator();
