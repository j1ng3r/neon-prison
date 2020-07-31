import Canvas from "./Canvas.js";
import globals from "./globals.js";
import Player from "./Player.js";

document.cookie = "_d_=0";
let pau = 0,
rsr = 1,
player_costume = 0,
paused = 0;

let canvas = new Canvas();
canvas.camera.follow(Player);


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
   canvas.ctx.beginPath();
   canvas.ctx.moveTo(args[0] + canvas.size.x - 50, args[1] + canvas.halfsize.y);
   for (let i = 2; i < Math.floor(args.length / 2) * 2; i += 2) {
      canvas.ctx.lineTo(args[i] + canvas.size.x - 50, args[i + 1] + canvas.halfsize.y);
   }
   canvas.ctx.closePath();
   canvas.ctx.fill();
}

canvas.setElement(document.getElementById("c"));

canvas.element.onkeydown = function (evt) {
   globals.keys[evt.keyCode || evt.which] = true;
   evt.preventDefault();
};
canvas.element.onkeyup = function (evt) {
   globals.keys[evt.keyCode || evt.which] = false;
};
canvas.element.addEventListener("mousedown", evt => {
   mouse = {
      x: evt.clientX - canvas.element.getBoundingClientRect().left,
      y: evt.clientY - canvas.element.getBoundingClientRect().top,
   };
   clicked = 1;
   canvas.element.focus();
   evt.preventDefault();
}, false);
canvas.element.addEventListener("mouseup", evt => {
   mouse = {
      x: evt.clientX - canvas.element.getBoundingClientRect().left,
      y: evt.clientY - canvas.element.getBoundingClientRect().top,
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
   canvas.fillStyle("#000");
   canvas.rect([0, 0], canvas.size);
   canvas.camera.enable();
   globals.b.forEach(b => b.img(canvas));
   canvas.camera.disable();
   canvas.fillStyle("#FFF");
   canvas.rect([0, Math.round(Player.position.y) + canvas.halfsize.y + 15], canvas.size);
   canvas.rect([-Math.round(Player.position.x) - 515, -1], canvas.size.scaleXY(0.5, 1));
   canvas.rect([canvas.halfsize.x - Math.round(Player.position.x) + 515, -1], canvas.size);
   canvas.drawChar(player_costume, canvas.halfsize, Player.eyePosition);
   canvas.fillStyle("#32C800");
   canvas.rect([0, 0], [100, canvas.size.y]);
   canvas.rect([canvas.size.x - 100, 0], [100, canvas.size.y]);
   canvas.fillStyle("#0F0");
   canvas.polygon([0, 0], [100, 50], [canvas.size.x - 100, 50], [canvas.size.x, 0]);
   canvas.fillStyle("#009600");
   canvas.polygon([0, canvas.size.y], [100, canvas.size.y - 50], [canvas.size.x - 100, canvas.size.y - 50], [canvas.size.x, canvas.size.y]);
   canvas.fillStyle("#000");
   canvas.font("30px Monospace");
   canvas.text("Neon Prison", [canvas.halfsize.x, 35]);
   canvas.font("25px Monospace");
   canvas.text("Level:", [50, canvas.halfsize.y - 75]);
   canvas.text(globals.lvl, [50, canvas.halfsize.y - 45]);
   canvas.text("Deaths:", [50, canvas.halfsize.y + 5]);
   canvas.text(Player.deaths, [50, canvas.halfsize.y + 35]);
   canvas.text("Time:", [50, canvas.halfsize.y + 95]);
   canvas.text(pau, [50, canvas.halfsize.y + 115]);
   canvas.font("15px Monospace");
   canvas.wrapText(globals.lvl === levelText.length - 1 && globals.deaths > 0 ? "You not-so-sneaky custard!\nI haven't gotten this far yet." : levelText[globals.lvl], [canvas.halfsize.x, canvas.size.y - 27], 18);
   canvas.fillStyle(paused ? "#fff" : "#000");
   canvas.roundedRect([canvas.size.x - 95, canvas.halfsize.y - 45], [90, 90], 45);
   canvas.fillStyle(paused ? "#cd38ff" : "#32C800");
   canvas.roundedRect([canvas.size.x - 70, canvas.halfsize.y - 20], [40, 40], 20);

   translatedPoly(28, 22, 35.5, 1, 0, 0, 11, 33, -11, 33, 0, 0, -28, 22, -35.5, 1, 0, 0, 11, -33, 28, -22, 0, 0, -11, -33, -28, -22, 0, 0);
   translatedPoly(10, 16, 28, 22, 35.5, 1, 19, -7, 28, -22, 11, -33, 0, -20, -11, -33, -28, -22, -19, -7, -35.5, 1, -28, 22, -10, 16, -11, 33, 11, 33);
   canvas.fillStyle(paused ? "#fff" : "#000");
   canvas.roundedRect([canvas.size.x - 62, canvas.halfsize.y - 12], [24, 24], 12);
   canvas.fillStyle(paused ? "#cd38ff" : "#32C800");
   canvas.roundedRect([canvas.size.x - 55, canvas.halfsize.y - 5], [10, 10], 5);
   if (paused) {
      if (globals.invert) { canvas.ctx.fillStyle = "rgba(255,255,255,0.25)" } else { canvas.ctx.fillStyle = "rgba(0,0,0,0.25)" }
      canvas.rect([100, 50], canvas.size.subtract([200, 100]));
      canvas.fillStyle("#fff");
      canvas.font("30px Monospace");
      canvas.text("Settings", [canvas.halfsize.x, 100]);
      canvas.roundedRect([150, 150], [16, 16], 3);
      canvas.roundedRect([150, 200], [16, 16], 3);
      canvas.font("24px Monospace");
      canvas.ctx.textAlign = "left";
      canvas.text("Invert colors", [180, 166]);
      canvas.text("Sneaky Custard Mode", [180, 216]);
      canvas.ctx.textAlign = "center";
      canvas.text("Choose your character", [canvas.halfsize.x, canvas.size.y - 100]);
      canvas.fillStyle("#808080");
      if (globals.invert) { canvas.roundedRect([153, 153], [10, 10], 5) }
      if (globals.sneaky) { canvas.roundedRect([153, 203], [10, 10], 5) }
      for (let i in Player.unlockedCostumes) {
         canvas.drawChar(Player.unlockedCostumes[i], [120 + i * 50, canvas.size.y - 70]);
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
            if (canvas.size.y - 55 > mouse.y && mouse.y > canvas.size.y - 85) {
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
            canvas.invertColors();
            clickin = null;
         }
         if (canvas.size.y - 55 > mouse.y && mouse.y > canvas.size.y - 85) {
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
      if (((mouse.x - canvas.size.x + 50) * (mouse.x - canvas.size.x + 50) + (mouse.y - canvas.halfsize.y) * (mouse.y - canvas.halfsize.y)) < 2025 && !clickin) {
         clickin = "button";
      }
   } else {
      if (((mouse.x - canvas.size.x + 50) * (mouse.x - canvas.size.x + 50) + (mouse.y - canvas.halfsize.y) * (mouse.y - canvas.halfsize.y)) < 2025 && clickin === "button") {
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
