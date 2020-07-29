import globals from "./globals.js";
import Vector from "./Vector.js";

document.cookie = "_d_=0";
let pau = 0,
	rsr = 1,
	inside,
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
		"You sneaky custard!\nI haven't gotten this far yet."
	],
	m = [];

let
	mouse = {x:0, y:0},
	clicked = false,
	clickin = null;


function translatedPoly(...args) {
	globals.ctx.beginPath();
	globals.ctx.moveTo(args[0] + globals.htmlCanvas.width - 50, args[1] + globals.htmlCanvas.height / 2);
	for (let i = 2; i < Math.floor(args.length / 2) * 2; i += 2) {
		globals.ctx.lineTo(args[i] + globals.htmlCanvas.width - 50, args[i + 1] + globals.htmlCanvas.height / 2);
	}
	globals.ctx.closePath();
	globals.ctx.fill();
}
globals.htmlCanvas = document.getElementById("c");
globals.ctx = globals.htmlCanvas.getContext("2d");
CanvasRenderingContext2D.prototype.wrapText = function(text, x, y, maxWidth, lineHeight) {
	text = text.split("\n");
	for (let i = 0; i < text.length; i++) {
		this.fillText(text[i], x, y);
		y += lineHeight;
	}
};
globals.htmlCanvas.onkeydown = function(evt) {
	globals.keys[evt.keyCode || evt.which] = true;
	console.log(evt.keyCode || evt.which);
	evt.preventDefault();
};
globals.htmlCanvas.onkeyup = function(evt) {
	globals.keys[evt.keyCode || evt.which] = false;
};
globals.htmlCanvas.addEventListener("mousedown", evt => {
	mouse = {
		x:evt.clientX - globals.htmlCanvas.getBoundingClientRect().left,
		y:evt.clientY - globals.htmlCanvas.getBoundingClientRect().top
	};
	clicked = 1;
	globals.htmlCanvas.focus();
	evt.preventDefault();
}, false);
globals.htmlCanvas.addEventListener("mouseup", evt => {
	mouse = {
		x:evt.clientX - globals.htmlCanvas.getBoundingClientRect().left,
		y:evt.clientY - globals.htmlCanvas.getBoundingClientRect().top
	};
	clicked = 0;
}, false);
globals.ctx.canvas.width = 600;
globals.ctx.canvas.height = 400;
globals.ctx.textAlign = "center";
if (!globals.unlockedCostumes.length) {
	globals.setCostumes(globals.unlockedCostumes = [0]);
}
globals.alabastorBalkans();
setInterval(() => {
	if (!paused) {
		if (globals.keys[83]) { globals.die(); }
		if (globals.keys[82] && rsr) {
			globals.die();
			rsr = 0;
		}
		if (!rsr && !globals.keys[82]) { rsr = 1; }
		if (globals.keys[37] || globals.keys[65]) { globals.playerVelocity.x -= 1; globals.l -= 0.5; if (!globals.start) { globals.start = Date.now(); } }
		if (globals.keys[39] || globals.keys[68]) { globals.playerVelocity.x += 1; globals.l += 0.5; if (!globals.start) { globals.start = Date.now(); } }
		if (globals.standing) {
			globals.playerVelocity.y = 0;
			if (globals.keys[38] || globals.keys[87]) { globals.playerVelocity.y = 13; if (!globals.start) { globals.start = Date.now(); } }
		} else {
			globals.playerVelocity.y -= 0.3;
		}
		if (globals.playerCoords.y + globals.playerVelocity.y <= 0) {
			globals.standing = true;
			globals.playerCoords.y = 0;
			globals.playerVelocity.y = 0;
		} else {
			globals.standing = false;
		}
		if (globals.playerCoords.x + globals.playerVelocity.x <= -500) {
			globals.playerVelocity.x = 0;
			globals.playerCoords.x = -500;
		}
		if (globals.playerCoords.x + globals.playerVelocity.x >= 500) {
			globals.playerVelocity.x = 0;
			globals.playerCoords.x = 500;
		}
		for (var i in globals.b) {
			if (globals.b[i].sense() === "levelup") {
				globals.lvl++;
				if (globals.gained) {
					globals.unlockedCostumes.push(globals.gained);
					globals.setCostumes(globals.unlockedCostumes);
					globals.unlockedCostumes = globals.getUnlockedCostumes_as_ary();
				}
				globals.alabastorBalkans();
				return;
			}
		}
		globals.l *= 0.9;
		globals.playerVelocity.y *= 0.95;
		globals.playerVelocity.x *= 0.8;
		globals.playerCoords.x += globals.playerVelocity.x;
		globals.playerCoords.y += globals.playerVelocity.y;
		pau = globals.start ? Math.floor((Date.now() - globals.start) / 100) / 10 : 0;
	}
	globals.setFillStyleOrInvert("#000");
	globals.roundedRectangle(0, 0, globals.htmlCanvas.width, globals.htmlCanvas.height);
	for (let i in globals.b) {
		globals.b[i].img();
	}
	globals.setFillStyleOrInvert("#FFF");
	globals.roundedRectangle(-1, globals.playerCoords.y + globals.htmlCanvas.height / 2 + 15, globals.htmlCanvas.width + 2, globals.htmlCanvas.height / 2 + 1);
	globals.roundedRectangle(globals.htmlCanvas.width / 2 - globals.playerCoords.x - 816, -1, globals.htmlCanvas.width / 2 + 1, globals.htmlCanvas.height + 2);
	globals.roundedRectangle(globals.htmlCanvas.width / 2 - globals.playerCoords.x + 515, -1, globals.htmlCanvas.width / 2 + 1, globals.htmlCanvas.height + 2);
	globals.drawChar(player_costume, globals.htmlCanvas.width / 2, globals.htmlCanvas.height / 2, globals.l);
	globals.setFillStyleOrInvert("#0F0");
	globals.poly(0, 0, 100, 50, globals.htmlCanvas.width - 100, 50, globals.htmlCanvas.width, 0);
	globals.setFillStyleOrInvert("#32C800");
	globals.poly(0, 0, 100, 50, 100, globals.htmlCanvas.height - 50, 0, globals.htmlCanvas.height);
	globals.poly(globals.htmlCanvas.width, 0, globals.htmlCanvas.width - 100, 50, globals.htmlCanvas.width - 100, globals.htmlCanvas.height - 50, globals.htmlCanvas.width, globals.htmlCanvas.height);
	globals.setFillStyleOrInvert("#009600");
	globals.poly(0, globals.htmlCanvas.height, 100, globals.htmlCanvas.height - 50, globals.htmlCanvas.width - 100, globals.htmlCanvas.height - 50, globals.htmlCanvas.width, globals.htmlCanvas.height);
	globals.setFillStyleOrInvert("#000");
	globals.ctx.font = "30px Monospace";
	globals.ctx.fillText("Neon Prison", globals.htmlCanvas.width / 2, 35);
	globals.ctx.font = "25px Monospace";
	const qwer = -75;
	globals.ctx.fillText("Level:", 50, globals.htmlCanvas.height / 2 + qwer);
	globals.ctx.fillText(globals.lvl, 50, globals.htmlCanvas.height / 2 + qwer + 30);
	globals.ctx.fillText("Deaths:", 50, globals.htmlCanvas.height / 2 + 80 + qwer);
	globals.ctx.fillText(globals.deaths, 50, globals.htmlCanvas.height / 2 + 110 + qwer);
	globals.ctx.fillText("Time:", 50, globals.htmlCanvas.height / 2 + 160 + qwer);
	globals.ctx.fillText(pau, 50, globals.htmlCanvas.height / 2 + 190 + qwer);
	globals.ctx.font = "15px Monospace";
	globals.ctx.wrapText(globals.lvl === levelText.length - 1 && globals.deaths > 0 ? "You not-so-sneaky custard!\nI haven't gotten this far yet." : levelText[globals.lvl], globals.htmlCanvas.width / 2, globals.htmlCanvas.height - 27, 20000, 18);
	globals.setFillStyleOrInvert(paused ? "#fff" : "#000");
	globals.roundedRectangle(globals.htmlCanvas.width - 95, globals.htmlCanvas.height / 2 - 45, 90, 90, 45);
	globals.setFillStyleOrInvert(paused ? "#cd38ff" : "#32C800");
	globals.roundedRectangle(globals.htmlCanvas.width - 70, globals.htmlCanvas.height / 2 - 20, 40, 40, 20);

	translatedPoly(28, 22, 35.5, 1, 0, 0, 11, 33, -11, 33, 0, 0, -28, 22, -35.5, 1, 0, 0, 11, -33, 28, -22, 0, 0, -11, -33, -28, -22, 0, 0);
	translatedPoly(10, 16, 28, 22, 35.5, 1, 19, -7, 28, -22, 11, -33, 0, -20, -11, -33, -28, -22, -19, -7, -35.5, 1, -28, 22, -10, 16, -11, 33, 11, 33);
	globals.setFillStyleOrInvert(paused ? "#fff" : "#000");
	globals.roundedRectangle(globals.htmlCanvas.width - 62, globals.htmlCanvas.height / 2 - 12, 24, 24, 12);
	globals.setFillStyleOrInvert(paused ? "#cd38ff" : "#32C800");
	globals.roundedRectangle(globals.htmlCanvas.width - 55, globals.htmlCanvas.height / 2 - 5, 10, 10, 5);
	if (paused) {
		if (globals.invert) { globals.ctx.fillStyle = "rgba(255,255,255,0.25)"; } else { globals.ctx.fillStyle = "rgba(0,0,0,0.25)"; }
		globals.roundedRectangle(100, 50, globals.htmlCanvas.width - 200, globals.htmlCanvas.height - 100);
		globals.setFillStyleOrInvert("#fff");
		globals.ctx.font = "30px Monospace";
		globals.ctx.fillText("Settings", globals.htmlCanvas.width / 2, 100);
		globals.roundedRectangle(150, 150, 16, 16, 3);
		globals.roundedRectangle(150, 200, 16, 16, 3);
		globals.ctx.font = "24px Monospace";
		globals.ctx.textAlign = "left";
		globals.ctx.fillText("Invert colors", 180, 166);
		globals.ctx.fillText("Sneaky Custard Mode", 180, 216);
		globals.ctx.textAlign = "center";
		globals.ctx.fillText("Choose your character", globals.htmlCanvas.width / 2, globals.htmlCanvas.height - 100);
		globals.setFillStyleOrInvert("#808080");
		if (globals.invert) { globals.roundedRectangle(153, 153, 10, 10, 5); }
		if (globals.sneaky) { globals.roundedRectangle(153, 203, 10, 10, 5); }
		for (var i in globals.unlockedCostumes) { 
			globals.drawChar(globals.unlockedCostumes[i], 120 + i * 50, globals.htmlCanvas.height - 70);
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
				if (globals.htmlCanvas.height - 55 > mouse.y && mouse.y > globals.htmlCanvas.height - 85) {
					for (var i in globals.unlockedCostumes) {
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
				globals.invert = !globals.invert;
				clickin = null;
			}
			if (globals.htmlCanvas.height - 55 > mouse.y && mouse.y > globals.htmlCanvas.height - 85) {
				for (var i in globals.unlockedCostumes) {
					if (105 + i * 50 < mouse.x && mouse.x < 135 + i * 50) {
						player_costume = globals.unlockedCostumes[i];
						clickin = null;
					}
				}
			}
		}
	}
	if (clicked) {
		if (((mouse.x - globals.htmlCanvas.width + 50) * (mouse.x - globals.htmlCanvas.width + 50) + (mouse.y - globals.htmlCanvas.height / 2) * (mouse.y - globals.htmlCanvas.height / 2)) < 2025 && !clickin) {
			clickin = "button";
		}
	} else {
		if (((mouse.x - globals.htmlCanvas.width + 50) * (mouse.x - globals.htmlCanvas.width + 50) + (mouse.y - globals.htmlCanvas.height / 2) * (mouse.y - globals.htmlCanvas.height / 2)) < 2025 && clickin === "button") {
			paused = !paused;
			globals.start = Date.now() - pau * 1000;
		}
		clickin = null;
	}
}, 17);
