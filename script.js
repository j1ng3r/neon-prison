import {
   htmlCanvas,
   ctx,
   playerCoords,
   playerVelocity,
   time,
   roundedRectangle,
   setCostumes,
   getUnlockedCostumes_as_ary,
   setFillStyleOrInvert,
   unlockedCostumes,
   l,
   poly,
   invert,
   standing,
   gained,
   keys,
   sneaky,
   ab,
   die,
   start,
   deaths,
   lvl,
   b,
} from "./globals.js";
import Vector from "./Vector.js";
import drawChar from "./drawchar.js";

document.cookie = "_d_=0";
let pau = 0,
   rsr = 1,
   inside,
   player_costume = 0,
   paused = 0;

var levelText = [
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

var 
   mouse = { x: 0, y: 0 },
   clicked = false,
   clickin = null;


function translatedPoly(...args) {
   ctx.beginPath();
   ctx.moveTo(args[0] + htmlCanvas.width - 50, args[1] + htmlCanvas.height / 2);
   for (let i = 2; i < Math.floor(args.length / 2) * 2; i += 2) {
      ctx.lineTo(args[i] + htmlCanvas.width - 50, args[i + 1] + htmlCanvas.height / 2);
   }
   ctx.closePath();
   ctx.fill();
}
htmlCanvas = document.getElementById("c");
ctx = htmlCanvas.getContext("2d");
CanvasRenderingContext2D.prototype.wrapText = function (text, x, y, maxWidth, lineHeight) {
   text = text.split("\n");
   for (let i = 0; i < text.length; i++) {
      this.fillText(text[i], x, y);
      y += lineHeight;
   }
};
htmlCanvas.onkeydown = function (evt) {
   keys[evt.keyCode || evt.which] = true;
   console.log(evt.keyCode || evt.which);
   evt.preventDefault();
};
htmlCanvas.onkeyup = function (evt) {
   keys[evt.keyCode || evt.which] = false;
};
htmlCanvas.addEventListener("mousedown", evt => {
   mouse = {
      x: evt.clientX - htmlCanvas.getBoundingClientRect().left,
      y: evt.clientY - htmlCanvas.getBoundingClientRect().top,
   };
   clicked = 1;
   htmlCanvas.focus();
   evt.preventDefault();
}, false);
htmlCanvas.addEventListener("mouseup", evt => {
   mouse = {
      x: evt.clientX - htmlCanvas.getBoundingClientRect().left,
      y: evt.clientY - htmlCanvas.getBoundingClientRect().top,
   };
   clicked = 0;
}, false);
ctx.canvas.width = 600;
ctx.canvas.height = 400;
ctx.textAlign = "center";
if (!unlockedCostumes.length) {
   setCostumes(unlockedCostumes = [0]);
}
ab();
setInterval(() => {
   if (!paused) {
      if (keys[83]) { die() }
      if (keys[82] && rsr) {
         die();
         rsr = 0;
      }
      if (!rsr && !keys[82]) { rsr = 1 }
      if (keys[37] || keys[65]) { playerVelocity.x -= 1; l -= 0.5; if (!start) { start = Date.now() } }
      if (keys[39] || keys[68]) { playerVelocity.x += 1; l += 0.5; if (!start) { start = Date.now() } }
      if (standing) {
         playerVelocity.y = 0;
         if (keys[38] || keys[87]) { playerVelocity.y = 13; if (!start) { start = Date.now() } }
      } else {
         playerVelocity.y -= 0.3;
      }
      if (playerCoords.y + playerVelocity.y <= 0) {
         standing = true;
         playerCoords.y = 0;
         playerVelocity.y = 0;
      } else {
         standing = false;
      }
      if (playerCoords.x + playerVelocity.x <= -500) {
         playerVelocity.x = 0;
         playerCoords.x = -500;
      }
      if (playerCoords.x + playerVelocity.x >= 500) {
         playerVelocity.x = 0;
         playerCoords.x = 500;
      }
      for (var i in b) {
         if (b[i].sense() == "levelup") {
            lvl += lvl + 1;
            if (gained) {
               unlockedCostumes.push(gained);
               setCostumes(unlockedCostumes);
               unlockedCostumes = getUnlockedCostumes_as_ary();
            }
            ab();
            return;
         }
      }
      l *= 0.9;
      playerVelocity.y *= 0.95;
      playerVelocity.x *= 0.8;
      playerCoords.x += playerVelocity.x;
      playerCoords.y += playerVelocity.y;
      pau = start ? Math.floor((Date.now() - start) / 100) / 10 : 0;
   }
   setFillStyleOrInvert("#000");
   roundedRectangle(0, 0, htmlCanvas.width, htmlCanvas.height);
   for (var i in b) {
      b[i].img();
   }
   setFillStyleOrInvert("#FFF");
   roundedRectangle(-1, playerCoords.y + htmlCanvas.height / 2 + 15, htmlCanvas.width + 2, htmlCanvas.height / 2 + 1);
   roundedRectangle(htmlCanvas.width / 2 - playerCoords.x - 816, -1, htmlCanvas.width / 2 + 1, htmlCanvas.height + 2);
   roundedRectangle(htmlCanvas.width / 2 - playerCoords.x + 515, -1, htmlCanvas.width / 2 + 1, htmlCanvas.height + 2);
   drawChar(player_costume, htmlCanvas.width / 2, htmlCanvas.height / 2, l);
   setFillStyleOrInvert("#0F0");
   poly(0, 0, 100, 50, htmlCanvas.width - 100, 50, htmlCanvas.width, 0);
   setFillStyleOrInvert("#32C800");
   poly(0, 0, 100, 50, 100, htmlCanvas.height - 50, 0, htmlCanvas.height);
   poly(htmlCanvas.width, 0, htmlCanvas.width - 100, 50, htmlCanvas.width - 100, htmlCanvas.height - 50, htmlCanvas.width, htmlCanvas.height);
   setFillStyleOrInvert("#009600");
   poly(0, htmlCanvas.height, 100, htmlCanvas.height - 50, htmlCanvas.width - 100, htmlCanvas.height - 50, htmlCanvas.width, htmlCanvas.height);
   setFillStyleOrInvert("#000");
   ctx.font = "30px Monospace";
   ctx.fillText("Neon Prison", htmlCanvas.width / 2, 35);
   ctx.font = "25px Monospace";
   const qwer = -75;
   ctx.fillText("Level:", 50, htmlCanvas.height / 2 + qwer);
   ctx.fillText(lvl, 50, htmlCanvas.height / 2 + qwer + 30);
   ctx.fillText("Deaths:", 50, htmlCanvas.height / 2 + 80 + qwer);
   ctx.fillText(deaths, 50, htmlCanvas.height / 2 + 110 + qwer);
   ctx.fillText("Time:", 50, htmlCanvas.height / 2 + 160 + qwer);
   ctx.fillText(pau, 50, htmlCanvas.height / 2 + 190 + qwer);
   ctx.font = "15px Monospace";
   ctx.wrapText(lvl === levelText.length - 1 && deaths > 0 ? "You not-so-sneaky custard!\nI haven't gotten this far yet." : levelText[lvl], htmlCanvas.width / 2, htmlCanvas.height - 27, 20000, 18);
   setFillStyleOrInvert(paused ? "#fff" : "#000");
   roundedRectangle(htmlCanvas.width - 95, htmlCanvas.height / 2 - 45, 90, 90, 45);
   setFillStyleOrInvert(paused ? "#cd38ff" : "#32C800");
   roundedRectangle(htmlCanvas.width - 70, htmlCanvas.height / 2 - 20, 40, 40, 20);

   translatedPoly(28, 22, 35.5, 1, 0, 0, 11, 33, -11, 33, 0, 0, -28, 22, -35.5, 1, 0, 0, 11, -33, 28, -22, 0, 0, -11, -33, -28, -22, 0, 0);
   translatedPoly(10, 16, 28, 22, 35.5, 1, 19, -7, 28, -22, 11, -33, 0, -20, -11, -33, -28, -22, -19, -7, -35.5, 1, -28, 22, -10, 16, -11, 33, 11, 33);
   setFillStyleOrInvert(paused ? "#fff" : "#000");
   roundedRectangle(htmlCanvas.width - 62, htmlCanvas.height / 2 - 12, 24, 24, 12);
   setFillStyleOrInvert(paused ? "#cd38ff" : "#32C800");
   roundedRectangle(htmlCanvas.width - 55, htmlCanvas.height / 2 - 5, 10, 10, 5);
   if (paused) {
      if (invert) { ctx.fillStyle = "rgba(255,255,255,0.25)" } else { ctx.fillStyle = "rgba(0,0,0,0.25)" }
      roundedRectangle(100, 50, htmlCanvas.width - 200, htmlCanvas.height - 100);
      setFillStyleOrInvert("#fff");
      ctx.font = "30px Monospace";
      ctx.fillText("Settings", htmlCanvas.width / 2, 100);
      roundedRectangle(150, 150, 16, 16, 3);
      roundedRectangle(150, 200, 16, 16, 3);
      ctx.font = "24px Monospace";
      ctx.textAlign = "left";
      ctx.fillText("Invert colors", 180, 166);
      ctx.fillText("Sneaky Custard Mode", 180, 216);
      ctx.textAlign = "center";
      ctx.fillText("Choose your character", htmlCanvas.width / 2, htmlCanvas.height - 100);
      setFillStyleOrInvert("#808080");
      if (invert) { roundedRectangle(153, 153, 10, 10, 5) }
      if (sneaky) { roundedRectangle(153, 203, 10, 10, 5) }
      for (var i in unlockedCostumes) { drawChar(unlockedCostumes[i], 120 + i * 50, htmlCanvas.height - 70) }
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
            if (htmlCanvas.height - 55 > mouse.y && mouse.y > htmlCanvas.height - 85) {
               for (var i in unlockedCostumes) {
                  if (105 + i * 50 < mouse.x && mouse.x < 135 + i * 50) {
                     clickin = i;
                  }
               }
            }
         }
      } else {
         if (mouse.x > 150 && mouse.x < 166 && mouse.y > 200 && mouse.y < 216 && clickin === "wan") {
            sneaky = !sneaky;
            clickin = null;
         }
         if (mouse.x > 150 && mouse.x < 166 && mouse.y > 150 && mouse.y < 166 && clickin === "invert") {
            invert = !invert;
            clickin = null;
         }
         if (htmlCanvas.height - 55 > mouse.y && mouse.y > htmlCanvas.height - 85) {
            for (var i in unlockedCostumes) {
               if (105 + i * 50 < mouse.x && mouse.x < 135 + i * 50) {
                  player_costume = unlockedCostumes[i];
                  clickin = null;
               }
            }
         }
      }
   }
   if (clicked) {
      if (((mouse.x - htmlCanvas.width + 50) * (mouse.x - htmlCanvas.width + 50) + (mouse.y - htmlCanvas.height / 2) * (mouse.y - htmlCanvas.height / 2)) < 2025 && !clickin) {
         clickin = "button";
      }
   } else {
      if (((mouse.x - htmlCanvas.width + 50) * (mouse.x - htmlCanvas.width + 50) + (mouse.y - htmlCanvas.height / 2) * (mouse.y - htmlCanvas.height / 2)) < 2025 && clickin === "button") {
         paused = !paused;
         start = Date.now() - pau * 1000;
      }
      clickin = null;
   }
}, 17);
