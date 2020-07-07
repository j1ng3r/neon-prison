class Box {
	static colors = {
		"T": "#0BF",
		"D": "#F00",
		"E": "#F00",
		"W": "#0FF",
		"U": "#B90",
		"V": "#FB0",
		"B": "#00F",
		"S": "#F0F",
		"A": "93E"
	}
	constructor(a){
		this.x = a.x;
		this.bx = a.x;
		this.y = a.y;
		this.by = a.y;
		this.w = a.w;
		this.h = a.h;
		this.type = a.t;
		if(a.m){
			this.move={Up:(a.m.u || 0),Right:(a.m.r || 0),YSin:(a.m.y || 0),XSin:(a.m.x || 0)};
		} else {
			this.move={Up:0,Right:0,YSin:0,XSin:0};
		}
		this.col = Box.colors[a.t] || "#FFF";
		this.bright = 255;
		this.fake = false;
		this.draw = a.t !== 'N';
		this.img = this.type==='*'?
			function(){
				if(this.draw)drawChar(this.w,this.x+(c.width/2)-p.x,(c.height/2)+p.y-this.y);
			}:function(){
				if(this.fake){
					this.bright-=(this.bright>=100);
					this.col=hex[Math.floor(this.bright/16)]+hex[this.bright%16]
					this.col='#'+this.col+(this.type=='F'?(this.col+this.col):'0000');
				}
				fill(this.col);
				if(this.draw)rect(this.x+(c.width/2)-p.x,(c.height/2)+p.y-this.y,this.w,0-this.h);
			};
	}
	sense(){
		this.bx+=this.move.Right;
		this.by+=this.move.Up;
		this.y=this.by+this.move.YSin*Math.sin(((new Date()).getTime()-time)/1200);
		this.x=this.bx+this.move.XSin*Math.sin(((new Date()).getTime()-time)/1200);
		if(contains(this.type,ni)){}
		if(contains(this.type,tuo)){
			left=(p.x>=this.x+this.w+10&&p.x+v.x<=this.x+this.w+15&&p.y>=this.y-12&&p.y<=this.y+this.h+12);
			right=(p.x<=this.x-10&&p.x+v.x>=this.x-15&&p.y>=this.y-12&&p.y<=this.y+this.h+12);
			up=(p.y>=this.y+this.h+10&&p.y+v.y<=this.y+this.h+15&&p.x>=this.x-12&&p.x<=this.x+this.w+12);
			down=(p.y<=this.y-10&&p.y+v.y>=this.y-15&&p.x>=this.x-12&&p.x<=this.x+this.w+12);
		}
		if(this.type === 'R'){
			if(left){
				p.x = this.x + this.w + 15;
				v.x = 0;
			}
			if(right){
				p.x = this.x - 15;
				v.x = 0;
			}
			if(up){
				p.y = this.y + this.h + 15;
				v.y = 0;
				standing = true;
			}
			if(down){
				p.y = this.y - 15;
				v.y = 0;
			}
		}
		if(this.type === 'N'){
			this.draw = false;
			if(left){
				this.draw = true;
				p.x = this.x + this.w + 15;
				v.x = 0;
			}
			if(right){
				this.draw = true;
				p.x = this.x - 15;
				v.x = 0;
			}
			if(up){
				this.draw = true;
				p.y = this.y + this.h + 15;
				v.y = 0;
				standing = true;
			}
			if(down){
				this.draw = true;
				p.y = this.y - 15;
				v.y = 0;
			}
		}
		if(this.type==='B'){
			if(left){
				p.x = this.x + this.w + 15;
				v.x = 30;
			}
			if(right){
				p.x = this.x - 15;
				v.x = -30;
			}
			if(up){
				p.y = this.y + this.h + 15;
				v.y = 20;
			}
			if(down){
				p.y = this.y - 15;
				v.y = -10;
			}
		}
		if(this.type==='T'){
			if(up){
				p.y = this.y + this.h + 15;
				v.y = 20;
			}
		}
		if(this.type === 'S'){
			if(left){
				p.x = this.x + this.w + 15;
				v.x = 0;
			}
			if(right){
				p.x = this.x - 15;
				v.x = 0;
			}
			if(down){
				p.y = this.y - 15;
				v.y = 0;
			}
		}
		if(this.type === 'A'){
			if(left){
				p.x = this.x + this.w + 15;
				v.x = 0;
			}
			if(right){
				p.x = this.x - 15;
				v.x = 0;
			}
			if(up){
				p.y = this.y + this.h + 15;
				v.y = 0;
				standing = true;
			}
		}
		if(p.y<this.y+this.h+15&&p.y>this.y-15&&p.x>this.x-15&&p.x<this.x+this.w+15){
			if(this.type==='D')die();
			if(this.type==='F'&&!this.fake)this.fake=true;
			if(this.type==='E'&&!this.fake)this.fake=true;
			if(this.type==='U'){p.y+=2;standing=true;}
			if(this.type==='V')p.y-=4;
			if(this.type==='W'){
				return"levelup";
			}
		}
		if(this.type==='*'){
			if(contains(this.w,imgs)||gained===this.w){
				this.draw=false;
			} else {
				this.draw=true;
				if(p.y<this.y+30&&p.y>this.y-30&&p.x>this.x-30&&p.x<this.x+30)gained=this.w;
			}
		}
	}
}