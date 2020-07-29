/* A few comments
	D=die
	R=regular
	N=invisible
	F=fake
	W=win
	B=bounce
	U=slowstone
	V=quicksand
	A=jumpblock
	S=fallblock
	E=fake death
	T=bounce jumpblock
	*=New character {x,y,size,number (0 is default)}
*/
class Box {
	constructor(a){
		this.position = new Vector(a.x,a.y);
		this.bx = a.x;
		this.by = a.y;
		this.w = a.w;
		this.h = a.h;
		this.type = a.t;
		if(a.m){
			this.move={Up:(a.m.u || 0),Right:(a.m.r || 0),YSin:(a.m.y || 0),XSin:(a.m.x || 0)};
		}else{
			this.move={Up:0,Right:0,YSin:0,XSin:0};
		}
		this.col = Box.colors[a.t] || "#FFF";
		this.bright = 255;
		this.fake = false;
		this.draw = a.t !== "N";
		let hex="0123456789abcdef";
		this.img = this.type==="*"
			?function(){
				if(this.draw)drawChar(this.w,this.position.x+(c.width/2)-playerCoords.x,(c.height/2)+playerCoords.y-this.position.y);
			}:function(){
				if(this.fake){
					this.bright-=(this.bright>=100);
					this.col=hex[Math.floor(this.bright/16)]+hex[this.bright%16];
					this.col="#"+this.col+(this.type=="F"?(this.col+this.col):"0000");
				}
				setFillStyleOrInvert(this.col);
				if(this.draw)rect(this.position.x+(c.width/2)-playerCoords.x,(htmlCanvas.height/2)+playerCoords.y-this.position.y,this.w,0-this.h);
			};
	}
	sense(){
		this.bx+=this.move.Right;
		this.by+=this.move.Up;
		this.position.y=this.by+this.move.YSin*Math.sin(((new Date()).getTime()-time)/1200);
		this.position.x=this.bx+this.move.XSin*Math.sin(((new Date()).getTime()-time)/1200);
		if("NBASTR".split("").includes(this.type)){
			left=(playerCoords.x>=this.position.x+this.w+10&&playerCoords.x+playerVelocity.x<=this.position.x+this.w+15&&playerCoords.y>=this.position.y-12&&playerCoords.y<=this.position.y+this.h+12);
			right=(playerCoords.x<=this.position.x-10&&playerCoords.x+playerVelocity.x>=this.position.x-15&&playerCoords.y>=this.position.y-12&&playerCoords.y<=this.position.y+this.h+12);
			up=(playerCoords.y>=this.position.y+this.h+10&&playerCoords.y+playerVelocity.y<=this.position.y+this.h+15&&playerCoords.x>=this.position.x-12&&playerCoords.x<=this.position.x+this.w+12);
			down=(playerCoords.y<=this.position.y-10&&playerCoords.y+playerVelocity.y>=this.position.y-15&&playerCoords.x>=this.position.x-12&&playerCoords.x<=this.position.x+this.w+12);
		}
		if(this.type === "R"){
			if(left){
				playerCoords.x = this.position.x + this.w + 15;
				playerVelocity.x = 0;
			}
			if(right){
				playerCoords.x = this.position.x - 15;
				playerVelocity.x = 0;
			}
			if(up){
				playerCoords.y = this.position.y + this.h + 15;
				playerVelocity.y = 0;
				standing = true;
			}
			if(down){
				playerCoords.y = this.position.y - 15;
				playerVelocity.y = 0;
			}
		}
		if(this.type === "N"){
			this.draw = false;
			if(left){
				this.draw = true;
				playerCoords.x = this.position.x + this.w + 15;
				playerVelocity.x = 0;
			}
			if(right){
				this.draw = true;
				playerCoords.x = this.position.x - 15;
				playerVelocity.x = 0;
			}
			if(up){
				this.draw = true;
				playerCoords.y = this.position.y + this.h + 15;
				playerVelocity.y = 0;
				standing = true;
			}
			if(down){
				this.draw = true;
				playerCoords.y = this.position.y - 15;
				playerVelocity.y = 0;
			}
		}
		if(this.type==="B"){
			if(left){
				playerCoords.x = this.position.x + this.w + 15;
				playerVelocity.x = 30;
			}
			if(right){
				playerCoords.x = this.position.x - 15;
				playerVelocity.x = -30;
			}
			if(up){
				playerCoords.y = this.position.y + this.h + 15;
				playerVelocity.y = 20;
			}
			if(down){
				playerCoords.y = this.position.y - 15;
				playerVelocity.y = -10;
			}
		}
		if(this.type==="T"){
			if(up){
				playerCoords.y = this.position.y + this.h + 15;
				playerVelocity.y = 20;
			}
		}
		if(this.type === "S"){
			if(left){
				playerCoords.x = this.position.x + this.w + 15;
				playerVelocity.x = 0;
			}
			if(right){
				playerCoords.x = this.position.x - 15;
				playerVelocity.x = 0;
			}
			if(down){
				playerCoords.y = this.position.y - 15;
				playerVelocity.y = 0;
			}
		}
		if(this.type === "A"){
			if(left){
				playerCoords.x = this.position.x + this.w + 15;
				playerVelocity.x = 0;
			}
			if(right){
				playerCoords.x = this.position.x - 15;
				playerVelocity.x = 0;
			}
			if(up){
				playerCoords.y = this.position.y + this.h + 15;
				playerVelocity.y = 0;
				standing = true;
			}
		}
		if(playerCoords.y<this.position.y+this.h+15&&playerCoords.y>this.position.y-15&&playerCoords.x>this.position.x-15&&playerCoords.x<this.position.x+this.w+15){
			if(this.type==="D")die();
			if(this.type==="F"&&!this.fake)this.fake=true;
			if(this.type==="E"&&!this.fake)this.fake=true;
			if(this.type==="U"){playerCoords.y+=2; standing=true;}
			if(this.type==="V")playerCoords.y-=4;
			if(this.type==="W"){
				return"levelup";
			}
		}
		if(this.type==="*"){
			if(unlockedCostumes.includes(this.w)||gained===this.w){
				this.draw=false;
			}else{
				this.draw=true;
				if(playerCoords.y<this.position.y+30&&playerCoords.y>this.position.y-30&&playerCoords.x>this.position.x-30&&playerCoords.x<this.position.x+30)gained=this.w;
			}
		}
	}
}

Box.colors = {
	T:"#0BF",
	D:"#F00",
	E:"#F00",
	W:"#0FF",
	U:"#B90",
	V:"#FB0",
	B:"#00F",
	S:"#F0F",
	A:"#93E"
};
