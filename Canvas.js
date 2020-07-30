import Vector from "./Vector.js";
export default class Canvas {
	constructor(){
		this.colorsInverted = false;
		this.size = new Vector(600, 400);
	}
	setElement(element){
		this.element = element;
		this.ctx = element.getContext("2d");
		this.ctx.canvas.width = this.size.x;
		this.ctx.canvas.height = this.size.y;
		this.ctx.textAlign = "center";
	}
	fillStyle(fillStyle){
		this.ctx.fillStyle = fillStyle;
		if(this.colorsInverted) {
			fillStyle = this.ctx.fillStyle;
			if(fillStyle.length === 9) {
				this.ctx.fillStyle = `#${(0xFFFFFFFF ^ parseInt(fillStyle.slice(1), 16)).toString(16).padStart(8, "0")}`;
			} else {
				this.ctx.fillStyle = `#${(0xFFFFFF ^ parseInt(fillStyle.slice(1), 16)).toString(16).padStart(6, "0")}`;
			}
		}
	}
	font(fontname) {
		this.ctx.font = fontname;
	}
	rect(position, size){
		position = new Vector(position);
		size = new Vector(size);
		this.ctx.fillRect(position.x, position.y, size.x, size.y);
	}
	circle(position, radius){
		position = new Vector(position);
		this.ctx.beginPath();
		this.ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI);
		this.ctx.closePath();
		this.ctx.fill();
	}
	roundedRect(position, size, radius){
		position = new Vector(position);
		size = new Vector(size);
		this.rect(position.add([radius, 0]), size.subtract([2 * radius, 0]));
		this.rect(position.add([0, radius]), size.subtract([0, 2 * radius]));
		this.rect(position.x, position.y + radius, size.x, size.y - 2 * radius);
		this.circle(position.add([radius, radius]), radius);
		this.circle(position.add([size.x - radius, radius]), radius);
		this.circle(position.add([radius, size.y - radius]), radius);
		this.circle(position.add([size.x - radius, size.y - radius]), radius);
	}
	polygon(...positions){
		positions = positions.map(p => new Vector(p));
		let startPosition = positions[0];
		this.ctx.beginPath();
		this.ctx.moveTo(startPosition.x, startPosition.y);
		for(let i = 1; i < positions.length; i++) {
			this.ctx.lineTo(positions[i].x, positions[i].y);
		}
		this.ctx.closePath();
		this.ctx.fill();
	}
	text(str, position) {
		position = new Vector(position);
		this.ctx.fillText(str, position.x, position.y);
	}
	wrapText(str, position, lineHeight) {
		position = new Vector(position);
		str.split("\n").forEach((line, i) => this.ctx.fillText(line, position.x, position.y + lineHeight * i));
	}
}
