import Vector from "./Vector.js";
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
}
