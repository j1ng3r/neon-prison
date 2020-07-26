class Vector{
	constructor(x,y){
		this.x = x;
		this.y = y;
	}
	static isVector(v){
		return v instanceof Vector;
	}
	add(x,y){
		if(Vector.isVector(x)){
			return new Vector(this.x + x.x,this.y + x.y);
		}
		return new Vector(this.x + x,this.y + y);
	}
	subtract(x,y){
		if(Vector.isVector(x)){
			return new Vector(this.x - x.x,this.y - x.y);
		}
		return new Vector(this.x - x,this.y - y);
	}
	scale(scalar){
		return new Vector(scalar*this.x,scalar*this.y);
	}
	scaleXY(scalar_x,scalar_y){
		return new Vector(scalar_x*this.x,scalar_y*this.y);
	}
}
