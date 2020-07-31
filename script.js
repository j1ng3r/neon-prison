import globals from "./globals.js";
import Player from "./Player.js";

globals.canvas.camera.follow(Player);

document.cookie = "_d_=0";
let pau = 0,
   rsr = 1,
   player_costume = 0,
   paused = 0;

let levelText = [
      "",
      "Welcome to Neon Prison. You know the drill.\nHint: Red = Bad, Cyan = Win, valid keys are \"wasdr\←\↑\→\"",
      "Some blocks are fake.\nIf you can't seem to stand on it, it probably doesn't exist.",
      "Also, others are invisible.\nBe prepared to be trolled.",
      "You will learn to hate quicksand.\nIt's not directly harmful, but I added lava at the bottom.",
      "If you liked quicksand, you'll be happy\nto know about the latest block type.... Slowstone!",
      "Are walls around the exit too tall? Poor thing.\nBuy the bounce-pad today! (it's really just a block)",
      "Fallblocks and jumpblocks. Nuff said.\nDeath comes on your hands only.",
      "Mwahahahahahaha. I just wasted an entire line.\nOh no, I did it again! No more room to tell you about the new",
      "Lucy in the sky with bounce-pads\nBy the Beetels. (bugs included)",
      "Tick tock, I'm a clock\nFinally, some moving blocks!",
      "You sneaky custard!\nI haven't gotten this far yet.",
   ],
   m = [];

let
   mouse = { x: 0, y: 0 },
   clicked = false,
   clickin = null;


function translatedPoly(...args) {
   globals.canvas.ctx.beginPath();
   globals.canvas.ctx.moveTo(args[0] + globals.canvas.size.x - 50, args[1] + globals.canvas.halfsize.y);
   for (let i = 2; i < Math.floor(args.length / 2) * 2; i += 2) {
      globals.canvas.ctx.lineTo(args[i] + globals.canvas.size.x - 50, args[i + 1] + globals.canvas.halfsize.y);
   }
   globals.canvas.ctx.closePath();
   globals.canvas.ctx.fill();
}

globals.canvas.setElement(document.getElementById("c"));

globals.canvas.element.onkeydown = function (evt) {
   globals.keys[evt.keyCode || evt.which] = true;
   evt.preventDefault();
};
globals.canvas.element.onkeyup = function (evt) {
   globals.keys[evt.keyCode || evt.which] = false;
};
globals.canvas.element.addEventListener("mousedown", evt => {
   mouse = {
      x: evt.clientX - globals.canvas.element.getBoundingClientRect().left,
      y: evt.clientY - globals.canvas.element.getBoundingClientRect().top,
   };
   clicked = 1;
   globals.canvas.element.focus();
   evt.preventDefault();
}, false);
globals.canvas.element.addEventListener("mouseup", evt => {
   mouse = {
      x: evt.clientX - globals.canvas.element.getBoundingClientRect().left,
      y: evt.clientY - globals.canvas.element.getBoundingClientRect().top,
   };
   clicked = 0;
}, false);
if (!Player.unlockedCostumes.length) {
   globals.setCostumes(Player.unlockedCostumes = [0]);
}
function update() {
   if (!paused) {
      if (globals.keys[83]) { Player.die() }
      if (globals.keys[82] && rsr) {
         Player.die();
         rsr = 0;
      }
      if (!rsr && !globals.keys[82]) { rsr = 1 }
      if (globals.keys[37] || globals.keys[65]) { Player.velocity.x -= 1; Player.eyePosition -= 0.5; if (!globals.start) { globals.start = Date.now() } }
      if (globals.keys[39] || globals.keys[68]) { Player.velocity.x += 1; Player.eyePosition += 0.5; if (!globals.start) { globals.start = Date.now() } }
      if (Player.standing) {
         Player.velocity.y = 0;
         if (globals.keys[38] || globals.keys[87]) { Player.velocity.y = 13; if (!globals.start) { globals.start = Date.now() } }
      } else {
         Player.velocity.y -= 0.3;
      }
      if (Player.position.y + Player.velocity.y <= 0) {
         Player.standing = true;
         Player.position.y = 0;
         Player.velocity.y = 0;
      } else {
         Player.standing = false;
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
         if (globals.b[i].sense(Player, globals.time) === "levelup") {
            globals.lvl++;
            if (Player.gained) {
               Player.unlockedCostumes.push(Player.gained);
               globals.setCostumes(Player.unlockedCostumes);
               Player.unlockedCostumes = globals.getUnlockedCostumes_as_ary();
            }
            Player.reset();
            globals.alabastorBalkans();
            return;
         }
      }
      Player.eyePosition *= 0.9;
      Player.velocity.y *= 0.95;
      Player.velocity.x *= 0.8;
      Player.position.x += Player.velocity.x;
      Player.position.y += Player.velocity.y;
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
   globals.canvas.wrapText(globals.lvl === levelText.length - 1 && globals.deaths > 0 ? "You not-so-sneaky custard!\nI haven't gotten this far yet." : levelText[globals.lvl], [globals.canvas.halfsize.x, globals.canvas.size.y - 27], 18);
   globals.canvas.fillStyle(paused ? "#fff" : "#000");
   globals.canvas.roundedRect([globals.canvas.size.x - 95, globals.canvas.halfsize.y - 45], [90, 90], 45);
   globals.canvas.fillStyle(paused ? "#cd38ff" : "#32C800");
   globals.canvas.roundedRect([globals.canvas.size.x - 70, globals.canvas.halfsize.y - 20], [40, 40], 20);

   translatedPoly(28, 22, 35.5, 1, 0, 0, 11, 33, -11, 33, 0, 0, -28, 22, -35.5, 1, 0, 0, 11, -33, 28, -22, 0, 0, -11, -33, -28, -22, 0, 0);
   translatedPoly(10, 16, 28, 22, 35.5, 1, 19, -7, 28, -22, 11, -33, 0, -20, -11, -33, -28, -22, -19, -7, -35.5, 1, -28, 22, -10, 16, -11, 33, 11, 33);
   globals.canvas.fillStyle(paused ? "#fff" : "#000");
   globals.canvas.roundedRect([globals.canvas.size.x - 62, globals.canvas.halfsize.y - 12], [24, 24], 12);
   globals.canvas.fillStyle(paused ? "#cd38ff" : "#32C800");
   globals.canvas.roundedRect([globals.canvas.size.x - 55, globals.canvas.halfsize.y - 5], [10, 10], 5);
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
      if (globals.invert) { globals.canvas.roundedRect([153, 153], [10, 10], 5) }
      if (globals.sneaky) { globals.canvas.roundedRect([153, 203], [10, 10], 5) }
      for (let i in Player.unlockedCostumes) {
         globals.canvas.drawChar(Player.unlockedCostumes[i], [120 + i * 50, globals.canvas.size.y - 70]);
      }
      if (clicked) {
         if (clickin === null) {
            if (mouse.x > 150 && mouse.x < 166 && !clickin) {
               if (mouse.y > 150 && mouse.y < 166) {
                  clickin = "invert";
               }
               if (mouse.y > 200 && mouse.y < 216) {
                  clickin = "wan";
               }
            }
            // Allot a lot of lots to my parking lot.
            if (globals.canvas.size.y - 55 > mouse.y && mouse.y > globals.canvas.size.y - 85) {
               for (var i in Player.unlockedCostumes) {
                  if (105 + i * 50 < mouse.x && mouse.x < 135 + i * 50) {
                     clickin = i;
                  }
               }
            }
         }
      } else {
         if (mouse.x > 150 && mouse.x < 166 && mouse.y > 200 && mouse.y < 216 && clickin === "wan") {
            globals.sneaky = !globals.sneaky;
            clickin = null;
         }
         if (mouse.x > 150 && mouse.x < 166 && mouse.y > 150 && mouse.y < 166 && clickin === "invert") {
            globals.canvas.invertColors();
            clickin = null;
         }
         if (globals.canvas.size.y - 55 > mouse.y && mouse.y > globals.canvas.size.y - 85) {
            for (var i in Player.unlockedCostumes) {
               if (105 + i * 50 < mouse.x && mouse.x < 135 + i * 50) {
                  player_costume = Player.unlockedCostumes[i];
                  clickin = null;
               }
            }
         }
      }
   }
   if (clicked) {
      if (((mouse.x - globals.canvas.size.x + 50) * (mouse.x - globals.canvas.size.x + 50) + (mouse.y - globals.canvas.halfsize.y) * (mouse.y - globals.canvas.halfsize.y)) < 2025 && !clickin) {
         clickin = "button";
      }
   } else {
      if (((mouse.x - globals.canvas.size.x + 50) * (mouse.x - globals.canvas.size.x + 50) + (mouse.y - globals.canvas.halfsize.y) * (mouse.y - globals.canvas.halfsize.y)) < 2025 && clickin === "button") {
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


globals.alabastorBalkans();
animator();
