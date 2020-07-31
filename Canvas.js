import Vector from "./Vector.js";
const defaultSprite = 0;
const invertedColorSprite = 1;
const demonSprite = 2;
const zombieSprite = 3;
const ghostSprite = 4;
const upsideDownSprite = 5;
const jailedSprite = 6;
const mushroomSprite = 7;
export default class Canvas {
   constructor() {
      this.colorsInverted = false;
      this.size = new Vector(600, 400);
      this.halfsize = this.size.scale(0.5);
      this.camera = {
         entity: null,
         enabled: false,
         follow: entity => this.camera.entity = entity,
         enable: () => this.camera.enabled = true,
         disable: () => this.camera.enabled = false,
         getPosition: () => this.camera.entity.position.round().invertY().subtract(this.halfsize),
         format: position => this.camera.enabled ? new Vector(position).subtract(this.camera.getPosition()) : new Vector(position),
		};
   }
   setElement(element) {
      this.element = element;
      this.ctx = element.getContext("2d");
      this.ctx.canvas.width = this.size.x;
      this.ctx.canvas.height = this.size.y;
      this.ctx.textAlign = "center";
   }
   fillStyle(fillStyle) {
      this.ctx.fillStyle = fillStyle;
      if (this.colorsInverted) {
         fillStyle = this.ctx.fillStyle;
         if (fillStyle.length === 9) {
            this.ctx.fillStyle = `#${(0xFFFFFFFF ^ parseInt(fillStyle.slice(1), 16)).toString(16).padStart(8, "0")}`;
         } else {
            this.ctx.fillStyle = `#${(0xFFFFFF ^ parseInt(fillStyle.slice(1), 16)).toString(16).padStart(6, "0")}`;
         }
      }
   }
   invertColors() {
      this.colorsInverted = !this.colorsInverted;
   }
   font(fontname) {
      this.ctx.font = fontname;
   }
   _rect(position, size) {
      this.ctx.fillRect(position.x, position.y, size.x, size.y);
   }
   rect(position, size) {
      this._rect(this.camera.format(position), new Vector(size));
   }
   _circle(position, radius) {
      this.ctx.beginPath();
      this.ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI);
      this.ctx.closePath();
      this.ctx.fill();
   }
   circle(position, radius) {
      this._circle(this.camera.format(position), radius);
   }
   _roundedRect(position, size, radius) {
      this._rect(position.add([radius, 0]), size.subtract([2 * radius, 0]));
      this._rect(position.add([0, radius]), size.subtract([0, 2 * radius]));
      this._rect(position.x, position.y + radius, size.x, size.y - 2 * radius);
      this._circle(position.add([radius, radius]), radius);
      this._circle(position.add([size.x - radius, radius]), radius);
      this._circle(position.add([radius, size.y - radius]), radius);
      this._circle(position.add([size.x - radius, size.y - radius]), radius);
   }
   roundedRect(position, size, radius) {
      this._roundedRect(this.camera.format(position), new Vector(size), radius);
   }
   _polygon(...positions) {
      let startPosition = positions[0];
      this.ctx.beginPath();
      this.ctx.moveTo(startPosition.x, startPosition.y);
      for (let i = 1; i < positions.length; i++) {
         this.ctx.lineTo(positions[i].x, positions[i].y);
      }
      this.ctx.closePath();
      this.ctx.fill();
   }
   polygon(...positions) {
      this._polygon(...positions.map(position => this.camera.format(position)));
   }
   _text(str, position) {
      this.ctx.fillText(str, position.x, position.y);
   }
   text(str, position) {
      this._text(str, this.camera.format(position));
   }
   _wrapText(str, position, lineHeight) {
      str.split("\n").forEach((line, i) => this.ctx.fillText(line, position.x, position.y + lineHeight * i));
   }
   wrapText(str, position, lineHeight) {
      this._wrapText(str, this.camera.format(position), lineHeight);
	}
	drawChar(sprite, position, eyePosition) {
		if (!eyePosition) { eyePosition = 0 }
		position = new Vector(position);
		let { x } = position,
			{ y } = position;
		switch (sprite) {
			// Default
			case 0:
				this.fillStyle("#F00");
				this.rect([x - 15, y - 15], [30, 10]);
				this.fillStyle("#FF0");
				this.roundedRect([x - 15, y - 15], [30, 30], 9);
				this.fillStyle("#00F");
				this.circle([x - 6 + eyePosition, y - 3], 3);
				this.circle([x + 6 + eyePosition, y - 3], 3);
				this.fillStyle("#000");
				this.roundedRect([x - 7, y + 4], [14, 5], 2);
				break;
			// Inverted colors
			case 1:
				this.fillStyle("#0FF");
				this.rect([x - 15, y - 15], [30, 10]);
				this.fillStyle("#00F");
				this.roundedRect([x - 15, y - 15], [30, 30], 9);
				this.fillStyle("#FF0");
				this.circle([x - 6 + eyePosition, y - 3], 3);
				this.circle([x + 6 + eyePosition, y - 3], 3);
				this.fillStyle("#FFF");
				this.roundedRect([x - 7, y + 4], [14, 5], 2);
				return;
			// Demon colors
			case 2:
				this.fillStyle("#FFF");
				this.rect([x - 15, y - 15], [30, 10]);
				this.fillStyle("#F00");
				this.roundedRect([x - 15, y - 15], [30, 30], 9);
				this.fillStyle("#000");
				this.circle([x - 6 + eyePosition, y - 3], 3);
				this.circle([x + 6 + eyePosition, y - 3], 3);
				this.fillStyle("#000");
				this.roundedRect([x - 7, y + 4], [14, 5], 2);
				return;
			//Zombie colors
			case 3:
				this.fillStyle("#000");
				this.rect([x - 15, y - 15], [30, 10]);
				this.fillStyle("#888");
				this.roundedRect([x - 15, y - 15], [30, 30], 9);
				this.fillStyle("#fff");
				this.circle([x - 6 + eyePosition, y - 3], 3);
				this.circle([x + 6 + eyePosition, y - 3], 3);
				this.fillStyle("#000");
				this.circle([x - 6 + eyePosition, y - 3], 2);
				this.circle([x + 6 + eyePosition, y - 3], 2);
				this.ctx.fillStyle = this.colorsInverted ? "rgba(0,255,255,0.4)" : "rgba(255,0,0,0.4)";
				this.roundedRect([x - 7, y + 4], [14, 5], 2);
				this.polygon([x + 13, y + 2], [x + 8, y + 10], [x + 8, y + 11], [x + 13, y + 3]);
				return;
			// White, black eyes
			case 4:
				this.fillStyle("#fff");
				this.rect([x - 15, y - 15], [30, 10]);
				this.fillStyle("#fff");
				this.roundedRect([x - 15, y - 15], [30, 30], 9);
				this.fillStyle("#000");
				this.circle([x - 6 + eyePosition, y - 3], 3);
				this.circle([x + 6 + eyePosition, y - 3], 3);
				this.roundedRect([x - 7, y + 4], [14, 5], 2);
				return;
			//Upside down
			case 5:
				this.fillStyle("#F00");
				this.rect([x - 15, y + 5], [30, 10]);
				this.fillStyle("#FF0");
				this.roundedRect([x - 15, y - 15], [30, 30], 9);
				this.fillStyle("#00F");
				this.circle([x - 6 - eyePosition, y + 3], 3);
				this.circle([x + 6 - eyePosition, y + 3], 3);
				this.fillStyle("#000");
				this.roundedRect([x - 7, y - 9], [14, 5], 2);
				return;
			// Jailed
			case 6:
				this.fillStyle("#000");
				this.rect([x - 11, y - 11], [22, 22]);
				this.fillStyle("#f00");
				this.circle([x - 6 + eyePosition, y - 3], 3);
				this.circle([x + 6 + eyePosition, y - 3], 3);
				this.roundedRect([x - 7, y + 4], [14, 5], 2);
				this.fillStyle("#666");
				this.rect([x - 15, y - 15], [4, 30]);
				this.rect([x - 15, y - 15], [30, 4]);
				this.rect([x + 11, y - 15], [4, 30]);
				this.rect([x - 15, y + 11], [30, 4]);
				this.rect([x - 11, y - 7], [22, 4]);
				this.rect([x - 11, y + 3], [22, 4]);
				return;
			// Mushroom
			case 7:
				this.fillStyle("#f00");
				this.rect([x - 10, y - 14], [20, 30]);
				this.rect([x - 6, y - 16], [12, 4]);
				this.rect([x - 12, y - 12], [24, 26]);
				this.rect([x - 14, y - 10], [28, 20]);
				this.rect([x - 16, y - 6], [32, 14]);
				this.fillStyle("#000");
				this.rect([x - 8, y - 12], [16, 26]);
				this.rect([x - 4, y - 14], [8, 20]);
				this.rect([x - 10, y - 6], [20, 18]);
				this.rect([x - 8, y - 12], [16, 26]);
				this.rect([x - 14, y - 4], [28, 6]);
				this.rect([x - 12, y - 8], [24, 4]);
				this.fillStyle("#00f");
				this.rect([x - 2, y - 14], [4, 8]);
				this.rect([x - 4, y - 10], [8, 4]);
				this.rect([x + 4, y - 8], [4, 4]);
				this.rect([x - 8, y - 8], [4, 4]);
				this.rect([x - 10, y - 10], [2, 4]);
				this.rect([x + 8, y - 10], [2, 4]);
				this.rect([x + 6, y - 4], [2, 4]);
				this.rect([x + 6, y], [4, 4]);
				this.rect([x + 10, y + 2], [4, 4]);
				this.rect([x + 4, y + 2], [2, 2]);
				this.rect([x - 8, y - 4], [2, 4]);
				this.rect([x - 10, y], [4, 4]);
				this.rect([x - 14, y + 2], [4, 4]);
				this.rect([x - 6, y + 2], [2, 2]);
				this.fillStyle("#f00");
				this.rect([x - 10, y + 4], [2, 4]);
				this.rect([x + 8, y + 4], [2, 4]);
				this.rect([x - 10, y + 4], [20, 2]);
				this.rect([x - 4 + eyePosition, y + 6], [2, 4]);
				this.rect([x + 2 + eyePosition, y + 6], [2, 4]);
		}
	}
}
