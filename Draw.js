import Vector from "./Vector.js";
import Levels from "./Levels.js";

export default class Draw {
	/**
	 * 
	 * @param {Canvas} canvas 
	 */
	constructor(canvas) {
		this.canvas = canvas;
	}
	background(){
		this.canvas.fillStyle("#000");
   	this.canvas.rect([0, 0], this.canvas.size);
	}
	coloredRect(color, position, size) {
		this.canvas.fillStyle(color);
		this.canvas.rect(position, size);
	}
	boxes(boxList) {
		this.canvas.camera.enable();
		boxList.forEach(box => box.draw(this));
   	this.canvas.camera.disable();
	}
	walls(playerPosition){
		this.canvas.fillStyle("#FFF");
		this.canvas.rect([0, Math.round(playerPosition.y) + this.canvas.halfsize.y + 15], this.canvas.size);
		this.canvas.rect([-Math.round(playerPosition.x) - 515, -1], this.canvas.size.scaleXY(0.5, 1));
		this.canvas.rect([this.canvas.halfsize.x - Math.round(playerPosition.x) + 515, -1], this.canvas.size);
	}
	player(Player) {
		this.character(Player.costume, this.canvas.halfsize, Player.eyePosition);
	}
	frame() {
		this.canvas.fillStyle("#32C800");
		this.canvas.rect([0, 0], [100, this.canvas.size.y]);
		this.canvas.rect([this.canvas.size.x - 100, 0], [100, this.canvas.size.y]);
		this.canvas.fillStyle("#0F0");
		this.canvas.polygon([0, 0], [100, 50], [this.canvas.size.x - 100, 50], [this.canvas.size.x, 0]);
		this.canvas.fillStyle("#009600");
		this.canvas.polygon([0, this.canvas.size.y], [100, this.canvas.size.y - 50], [this.canvas.size.x - 100, this.canvas.size.y - 50], [this.canvas.size.x, this.canvas.size.y]);
	}
	info(level, deaths, time) {
		this.canvas.fillStyle("#000");
		this.canvas.font("30px Monospace");
		this.canvas.text("Neon Prison", [this.canvas.halfsize.x, 35]);
		this.canvas.font("25px Monospace");
		this.canvas.text("Level:", [50, this.canvas.halfsize.y - 75]);
		this.canvas.text(level, [50, this.canvas.halfsize.y - 45]);
		this.canvas.text("Deaths:", [50, this.canvas.halfsize.y + 5]);
		this.canvas.text(deaths, [50, this.canvas.halfsize.y + 35]);
		this.canvas.text("Time:", [50, this.canvas.halfsize.y + 95]);
		this.canvas.text(time, [50, this.canvas.halfsize.y + 115]);
	}
	subtext(level, deaths) {
		let { sneaky, subtext } = Levels[level];
		if (sneaky && deaths === 0) {
			subtext = "You sneaky custard!\nI haven't gotten this far yet.";
		}
		this.canvas.font("15px Monospace");
   	this.canvas.wrapText(subtext, [this.canvas.halfsize.x, this.canvas.size.y - 27], 18);
	}
	gear(paused) {
		this.canvas.fillStyle(paused ? "#fff" : "#000");
		this.canvas.circle([this.canvas.size.x - 50, this.canvas.halfsize.y], 45);
		this.canvas.fillStyle(paused ? "#cd38ff" : "#32C800");
		this.canvas.circle([this.canvas.size.x - 50, this.canvas.halfsize.y], 20);
		this.canvas.polygon(...[[28, 22], [35.5, 1], [0, 0], [11, 33], [-11, 33], [0, 0], [-28, 22], [-35.5, 1], [0, 0], [11, -33], [28, -22], [0, 0], [-11, -33], [-28, -22], [0, 0]].map(position => new Vector(position).add([this.canvas.size.x - 50, this.canvas.halfsize.y])));
		this.canvas.polygon(...[[10, 16], [28, 22], [35.5, 1], [19, -7], [28, -22], [11, -33], [0, -20], [-11, -33], [-28, -22], [-19, -7], [-35.5, 1], [-28, 22], [-10, 16], [-11, 33], [11, 33]].map(position => new Vector(position).add([this.canvas.size.x - 50, this.canvas.halfsize.y])));
		this.canvas.fillStyle(paused ? "#fff" : "#000");
		this.canvas.circle([this.canvas.size.x - 50, this.canvas.halfsize.y], 12);
		this.canvas.fillStyle(paused ? "#cd38ff" : "#32C800");
		this.canvas.circle([this.canvas.size.x - 50, this.canvas.halfsize.y], 5);
   }
   blankout(){
      this.canvas.fillStyle("rgba(0,0,0,0.25)");
      this.canvas.rect([100, 50], this.canvas.size.subtract([200, 100]));
   }
   variantMenu(inverted, sneaky) {
      this.canvas.fillStyle("#fff");
      this.canvas.font("30px Monospace");
      this.canvas.text("Settings", [this.canvas.halfsize.x, 100]);
      this.canvas.roundedRect([150, 150], [16, 16], 3);
      this.canvas.roundedRect([150, 200], [16, 16], 3);
      this.canvas.font("24px Monospace");
      this.canvas.ctx.textAlign = "left";
      this.canvas.text("Invert colors", [180, 166]);
      this.canvas.text("Sneaky Custard Mode", [180, 216]);
      this.canvas.fillStyle("#808080");
      if (inverted) {
         this.canvas.circle([158, 158], 5);
      }
      if (sneaky) {
         this.canvas.circle([158, 208], 5);
      }
   }
   characterMenu(unlockedCostumes) {
      this.canvas.fillStyle("#fff");
      this.canvas.ctx.textAlign = "center";
      this.canvas.text("Choose your character", [this.canvas.halfsize.x, this.canvas.size.y - 100]);
      unlockedCostumes.forEach((costume, i) => this.character(costume, [120 + i * 50, this.canvas.size.y - 70]));
   }
	character(sprite, position, eyePosition) {
      if (!eyePosition) { eyePosition = 0 }
      position = new Vector(position);
      let { x, y } = position;
      switch (sprite) {
         case Draw.COSTUME.DEFAULT:
            this.canvas.fillStyle("#F00");
            this.canvas.rect([x - 15, y - 15], [30, 10]);
            this.canvas.fillStyle("#FF0");
            this.canvas.roundedRect([x - 15, y - 15], [30, 30], 9);
            this.canvas.fillStyle("#00F");
            this.canvas.circle([x - 6 + eyePosition, y - 3], 3);
            this.canvas.circle([x + 6 + eyePosition, y - 3], 3);
            this.canvas.fillStyle("#000");
            this.canvas.roundedRect([x - 7, y + 4], [14, 5], 2);
            return;
         case Draw.COSTUME.INVERTED_COLORS:
            this.canvas.fillStyle("#0FF");
            this.canvas.rect([x - 15, y - 15], [30, 10]);
            this.canvas.fillStyle("#00F");
            this.canvas.roundedRect([x - 15, y - 15], [30, 30], 9);
            this.canvas.fillStyle("#FF0");
            this.canvas.circle([x - 6 + eyePosition, y - 3], 3);
            this.canvas.circle([x + 6 + eyePosition, y - 3], 3);
            this.canvas.fillStyle("#FFF");
            this.canvas.roundedRect([x - 7, y + 4], [14, 5], 2);
            return;
         case Draw.COSTUME.DEMON:
            this.canvas.fillStyle("#FFF");
            this.canvas.rect([x - 15, y - 15], [30, 10]);
            this.canvas.fillStyle("#F00");
            this.canvas.roundedRect([x - 15, y - 15], [30, 30], 9);
            this.canvas.fillStyle("#000");
            this.canvas.circle([x - 6 + eyePosition, y - 3], 3);
            this.canvas.circle([x + 6 + eyePosition, y - 3], 3);
            this.canvas.fillStyle("#000");
            this.canvas.roundedRect([x - 7, y + 4], [14, 5], 2);
            return;
         case Draw.COSTUME.ZOMBIE:
            this.canvas.fillStyle("#000");
            this.canvas.rect([x - 15, y - 15], [30, 10]);
            this.canvas.fillStyle("#888");
            this.canvas.roundedRect([x - 15, y - 15], [30, 30], 9);
            this.canvas.fillStyle("#fff");
            this.canvas.circle([x - 6 + eyePosition, y - 3], 3);
            this.canvas.circle([x + 6 + eyePosition, y - 3], 3);
            this.canvas.fillStyle("#000");
            this.canvas.circle([x - 6 + eyePosition, y - 3], 2);
            this.canvas.circle([x + 6 + eyePosition, y - 3], 2);
            this.canvas.ctx.fillStyle = this.canvas.colorsInverted ? "rgba(0,255,255,0.4)" : "rgba(255,0,0,0.4)";
            this.canvas.roundedRect([x - 7, y + 4], [14, 5], 2);
            this.canvas.polygon([x + 13, y + 2], [x + 8, y + 10], [x + 8, y + 11], [x + 13, y + 3]);
            return;
         case Draw.COSTUME.GHOST:
            this.canvas.fillStyle("#fff");
            this.canvas.rect([x - 15, y - 15], [30, 10]);
            this.canvas.fillStyle("#fff");
            this.canvas.roundedRect([x - 15, y - 15], [30, 30], 9);
            this.canvas.fillStyle("#000");
            this.canvas.circle([x - 6 + eyePosition, y - 3], 3);
            this.canvas.circle([x + 6 + eyePosition, y - 3], 3);
            this.canvas.roundedRect([x - 7, y + 4], [14, 5], 2);
            return;
         case Draw.COSTUME.UPSIDE_DOWN:
            this.canvas.fillStyle("#F00");
            this.canvas.rect([x - 15, y + 5], [30, 10]);
            this.canvas.fillStyle("#FF0");
            this.canvas.roundedRect([x - 15, y - 15], [30, 30], 9);
            this.canvas.fillStyle("#00F");
            this.canvas.circle([x - 6 - eyePosition, y + 3], 3);
            this.canvas.circle([x + 6 - eyePosition, y + 3], 3);
            this.canvas.fillStyle("#000");
            this.canvas.roundedRect([x - 7, y - 9], [14, 5], 2);
            return;
         case Draw.COSTUME.JAILED:
            this.canvas.fillStyle("#000");
            this.canvas.rect([x - 11, y - 11], [22, 22]);
            this.canvas.fillStyle("#f00");
            this.canvas.circle([x - 6 + eyePosition, y - 3], 3);
            this.canvas.circle([x + 6 + eyePosition, y - 3], 3);
            this.canvas.roundedRect([x - 7, y + 4], [14, 5], 2);
            this.canvas.fillStyle("#666");
            this.canvas.rect([x - 15, y - 15], [4, 30]);
            this.canvas.rect([x - 15, y - 15], [30, 4]);
            this.canvas.rect([x + 11, y - 15], [4, 30]);
            this.canvas.rect([x - 15, y + 11], [30, 4]);
            this.canvas.rect([x - 11, y - 7], [22, 4]);
            this.canvas.rect([x - 11, y + 3], [22, 4]);
            return;
         case Draw.COSTUME.MUSHROOM:
            this.canvas.fillStyle("#f00");
            this.canvas.rect([x - 10, y - 14], [20, 30]);
            this.canvas.rect([x - 6, y - 16], [12, 4]);
            this.canvas.rect([x - 12, y - 12], [24, 26]);
            this.canvas.rect([x - 14, y - 10], [28, 20]);
            this.canvas.rect([x - 16, y - 6], [32, 14]);
            this.canvas.fillStyle("#000");
            this.canvas.rect([x - 8, y - 12], [16, 26]);
            this.canvas.rect([x - 4, y - 14], [8, 20]);
            this.canvas.rect([x - 10, y - 6], [20, 18]);
            this.canvas.rect([x - 8, y - 12], [16, 26]);
            this.canvas.rect([x - 14, y - 4], [28, 6]);
            this.canvas.rect([x - 12, y - 8], [24, 4]);
            this.canvas.fillStyle("#00f");
            this.canvas.rect([x - 2, y - 14], [4, 8]);
            this.canvas.rect([x - 4, y - 10], [8, 4]);
            this.canvas.rect([x + 4, y - 8], [4, 4]);
            this.canvas.rect([x - 8, y - 8], [4, 4]);
            this.canvas.rect([x - 10, y - 10], [2, 4]);
            this.canvas.rect([x + 8, y - 10], [2, 4]);
            this.canvas.rect([x + 6, y - 4], [2, 4]);
            this.canvas.rect([x + 6, y], [4, 4]);
            this.canvas.rect([x + 10, y + 2], [4, 4]);
            this.canvas.rect([x + 4, y + 2], [2, 2]);
            this.canvas.rect([x - 8, y - 4], [2, 4]);
            this.canvas.rect([x - 10, y], [4, 4]);
            this.canvas.rect([x - 14, y + 2], [4, 4]);
            this.canvas.rect([x - 6, y + 2], [2, 2]);
            this.canvas.fillStyle("#f00");
            this.canvas.rect([x - 10, y + 4], [2, 4]);
            this.canvas.rect([x + 8, y + 4], [2, 4]);
            this.canvas.rect([x - 10, y + 4], [20, 2]);
            this.canvas.rect([x - 4 + eyePosition, y + 6], [2, 4]);
            this.canvas.rect([x + 2 + eyePosition, y + 6], [2, 4]);
      }
   }
}

Draw.COSTUME = {
	DEFAULT: 0,
	INVERTED_COLORS: 1,
	DEMON: 2,
	ZOMBIE: 3,
	GHOST: 4,
	UPSIDE_DOWN: 5,
	JAILED: 6,
	MUSHROOM: 7,
};