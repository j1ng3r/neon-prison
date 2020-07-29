import Vector from "Vector.js";
class Canvas {
	constructor(element){
		this.element = element;
		this.ctx = element.getContext("2d");
	}
	rect(x, y, w, h){
		this.ctx.fillRect(x, y, w, h);
	}
	circle(x, y, r){
		this.ctx.beginPath();
		this.ctx.arc(x, y, r, 0, 2 * Math.PI);
		this.ctx.closePath();
		this.ctx.fill();
	}
	roundedRect(x, y, w, h, r){
		this.rect(x + r, y, w - 2 * r, h);
		this.rect(x, y + r, w, h - 2 * r);
		this.circle(x + r, y + r, r);
		this.circle(x + r, y + h - r, r);
		this.circle(x + w - r, y + r, r);
		this.circle(x + w - r, y + h - r, r);
	}
	polynomial(){
		
	}
}
