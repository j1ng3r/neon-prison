import Levels from "./Levels.js";
import { Canvas } from "./Canvas.js";
import EventHandler from "./EventHandler.js";
import globals from "./globals.js";
import Player from "./Player.js";
import Vector from "./Vector.js";

let pau = 0;
let rsr = 1;
let player_costume = 0;
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
   globals.canvas.fillStyle("#000");
   globals.canvas.rect([0, 0], globals.canvas.size);
   globals.canvas.camera.enable();
   globals.b.forEach(b => b.img(globals.canvas));
   globals.canvas.camera.disable();
   globals.canvas.fillStyle("#FFF");
   globals.canvas.rect([0, Math.round(Player.position.y) + globals.canvas.halfsize.y + 15], globals.canvas.size);
   globals.canvas.rect([-Math.round(Player.position.x) - 515, -1], globals.canvas.size.scaleXY(0.5, 1));
   globals.canvas.rect([globals.canvas.halfsize.x - Math.round(Player.position.x) + 515, -1], globals.canvas.size);
   globals.canvas.drawChar(player_costume, globals.canvas.halfsize, Player.eyePosition);
   globals.canvas.fillStyle("#32C800");
   globals.canvas.rect([0, 0], [100, globals.canvas.size.y]);
   globals.canvas.rect([globals.canvas.size.x - 100, 0], [100, globals.canvas.size.y]);
   globals.canvas.fillStyle("#0F0");
   globals.canvas.polygon([0, 0], [100, 50], [globals.canvas.size.x - 100, 50], [globals.canvas.size.x, 0]);
   globals.canvas.fillStyle("#009600");
   globals.canvas.polygon([0, globals.canvas.size.y], [100, globals.canvas.size.y - 50], [globals.canvas.size.x - 100, globals.canvas.size.y - 50], [globals.canvas.size.x, globals.canvas.size.y]);
   globals.canvas.fillStyle("#000");
   globals.canvas.font("30px Monospace");
   globals.canvas.text("Neon Prison", [globals.canvas.halfsize.x, 35]);
   globals.canvas.font("25px Monospace");
   globals.canvas.text("Level:", [50, globals.canvas.halfsize.y - 75]);
   globals.canvas.text(globals.lvl, [50, globals.canvas.halfsize.y - 45]);
   globals.canvas.text("Deaths:", [50, globals.canvas.halfsize.y + 5]);
   globals.canvas.text(Player.deaths, [50, globals.canvas.halfsize.y + 35]);
   globals.canvas.text("Time:", [50, globals.canvas.halfsize.y + 95]);
   globals.canvas.text(pau, [50, globals.canvas.halfsize.y + 115]);

   globals.canvas.font("15px Monospace");
   let { subtext } = Levels[globals.lvl];
   if (Levels[globals.lvl].sneaky && globals.deaths === 0) {
      subtext = "You sneaky custard!\nI haven't gotten this far yet.";
   }
   globals.canvas.wrapText(subtext, [globals.canvas.halfsize.x, globals.canvas.size.y - 27], 18);

   globals.canvas.fillStyle(paused ? "#fff" : "#000");
   globals.canvas.circle([globals.canvas.size.x - 50, globals.canvas.halfsize.y], 45);
   globals.canvas.fillStyle(paused ? "#cd38ff" : "#32C800");
   globals.canvas.circle([globals.canvas.size.x - 50, globals.canvas.halfsize.y], 20);

   globals.canvas.polygon(...[[28, 22], [35.5, 1], [0, 0], [11, 33], [-11, 33], [0, 0], [-28, 22], [-35.5, 1], [0, 0], [11, -33], [28, -22], [0, 0], [-11, -33], [-28, -22], [0, 0]].map(position => new Vector(position).add([globals.canvas.size.x - 50, globals.canvas.halfsize.y])));
   globals.canvas.polygon(...[[10, 16], [28, 22], [35.5, 1], [19, -7], [28, -22], [11, -33], [0, -20], [-11, -33], [-28, -22], [-19, -7], [-35.5, 1], [-28, 22], [-10, 16], [-11, 33], [11, 33]].map(position => new Vector(position).add([globals.canvas.size.x - 50, globals.canvas.halfsize.y])));
   globals.canvas.fillStyle(paused ? "#fff" : "#000");
   globals.canvas.circle([globals.canvas.size.x - 50, globals.canvas.halfsize.y], 12);
   globals.canvas.fillStyle(paused ? "#cd38ff" : "#32C800");
   globals.canvas.circle([globals.canvas.size.x - 50, globals.canvas.halfsize.y], 5);
   if (paused) {
      if (globals.invert) { globals.canvas.ctx.fillStyle = "rgba(255,255,255,0.25)" } else { globals.canvas.ctx.fillStyle = "rgba(0,0,0,0.25)" }
      globals.canvas.rect([100, 50], globals.canvas.size.subtract([200, 100]));
      globals.canvas.fillStyle("#fff");
      globals.canvas.font("30px Monospace");
      globals.canvas.text("Settings", [globals.canvas.halfsize.x, 100]);
      globals.canvas.roundedRect([150, 150], [16, 16], 3);
      globals.canvas.roundedRect([150, 200], [16, 16], 3);
      globals.canvas.font("24px Monospace");
      globals.canvas.ctx.textAlign = "left";
      globals.canvas.text("Invert colors", [180, 166]);
      globals.canvas.text("Sneaky Custard Mode", [180, 216]);
      globals.canvas.ctx.textAlign = "center";
      globals.canvas.text("Choose your character", [globals.canvas.halfsize.x, globals.canvas.size.y - 100]);
      globals.canvas.fillStyle("#808080");
      if (globals.canvas.colorsInverted) { globals.canvas.circle([158, 158], 5) }
      if (globals.sneaky) { globals.canvas.circle([158, 208], 5) }
      for (let i in Player.unlockedCostumes) {
         globals.canvas.drawChar(Player.unlockedCostumes[i], [120 + i * 50, globals.canvas.size.y - 70]);
      }
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
                  player_costume = costume;
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
