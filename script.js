let c = null, ctx = null;
let time = 0;
//These should get added into a Vector library
let playerCoords = new Vector(0,0), playerVelocity = new Vector(0,0);
function setCostumes(ary_unlockedCostumes){
	let c = ary_unlockedCostumes.filter((v,i,m)=>m.indexOf(v)===i).reduce((a,v) => a + 2**v, 0).toString(36);
	document.cookie=`_d_=${c};`
}
function getUnlockedCostumes_as_ary(){
	let c = document.cookie.split(";").find(v => v.slice(0,4) == "_d_=").slice(4)
	return parseInt(c, 36).toString(2).split("").map((v,i) => +v ? i : -1).filter(i => i > -1);
}
document.cookie = "_d_=0";
let unlockedCostumes=getUnlockedCostumes_as_ary();
let start=0,pau=0,t,rsr=1,inside,left,right,up,down,player_costume=0,gained=0,paused=0,invert=!1,sneaky=!1, lvl = 1;
function fill(color){
	ctx.fillStyle = color;
	if(invert){
		color = ctx.fillStyle;
		console.log(color);
		if(color.length == 9) {
			ctx.fillStyle = '#' + (0xFFFFFFFF ^ parseInt(color.slice(1), 16)).toString(16).padStart(8, '0');
		} else {
			ctx.fillStyle = '#' + (0xFFFFFF ^ parseInt(color.slice(1), 16)).toString(16).padStart(6, '0');
			console.log("Fill: ", ctx.fillStyle);
		}
	}
}
// This entire system of level storage and generation is going to get reworked into a JSON file and reader
function ab(c,d,e,f){
	time=new Date().getTime();
	gained=0;
	playerCoords={x:0, y:0};
	playerVelocity={x:0, y:0};
	b=[];
	c=lvlinfo[lvl],e='',f={t:null,x:null,y:null,w:null,h:null};
	for(d in c){
		t=c[d].toString();
		if(/-|\d/.test(c[d])){
			e+=t;
		} else if(t==','){
			if(f.x == null){
				f.x = +e || 0;
			} else if(f.y == null){
				f.y = +e || 0;
			} else if(f.w == null){
				f.w = +e || 0;
			}
			e='';
		} else {
			f.h=parseFloat(e);
			f.t=t;
			b.push(new Box(f));
			f={t:null,x:null,y:null,w:null,h:null};
			e='';
		}
	}
	if(lvl===10){
		b.push(new Box({x:300,y:350,w:40,h:5,t:'R',m:{x:100}}))
		b.push(new Box({x:200,y:575,w:40,h:5,t:'T',m:{y:150}}))
		b.push(new Box({x:(-520),y:-1050,w:2000,h:1000,t:'D',m:{u:0.5}}));
	}
}
function rect(x,y,w,h,r){
	if(typeof r === 'undefined'){
		r=0;
	}
	ctx.fillRect(x+r,y,w-r-r,h);
	ctx.fillRect(x,y+r,w,h-r-r);
	ctx.beginPath();
		ctx.arc(x+r,y+r,r,0,Math.PI*2);
		ctx.arc(x+w-r,y+r,r,0,Math.PI*2);
		ctx.arc(x+w-r,y+h-r,r,0,Math.PI*2);
		ctx.arc(x+r,y+h-r,r,0,Math.PI*2);
	ctx.closePath();
	ctx.fill();
}
var l = 1, lvlnm = ['',
	'Welcome to Neon Prison. You know the drill.\nHint: Red = Bad, Cyan = Win, valid keys are "wasdr\←\↑\→"',
	'Some blocks are fake.\nIf you can\'t seem to stand on it, it probably doesn\'t exist.',
	'Also, others are invisible.\nBe prepared to be trolled.',
	'You will learn to hate quicksand.\nIt\'s not directly harmful, but I added lava at the bottom.',
	'If you liked quicksand, you\'ll be happy\nto know about the latest block type.... Slowstone!',
	'Are walls around the exit too tall? Poor thing.\nBuy the bounce-pad today! (it\'s really just a block)',
	'Fallblocks and jumpblocks. Nuff said.\nDeath comes on your hands only.',
	'Mwahahahahahaha. I just wasted an entire line.\nOh no, I did it again! No more room to tell you about the new',
	'Lucy in the sky with bounce-pads\nBy the Beetels. (bugs included)',
	'Tick tock, I\'m a clock\nFinally, some moving blocks!',
	'You sneaky custard!\nI haven\'t gotten this far yet.'
],
lvlinfo = ['',
	'-100,-15,5,155D-100,140,5,40E-100,180,5,1000D-400,-15,300,1000E-96,-15,40,40R56,-15,40,40R95,-15,300,350W-520,-20,10,10W-500,0,4,*',
	'-415,-15,320,9001D35,-15,300,10D35,-15,10,40D45,15,50,10R-95,-15,60,10D-45,-15,10,40D-95,15,50,10F-95,137,120,3R25,137,70,3F35,175,70,10D35,175,10,40D45,205,50,10F-95,175,60,10D-45,175,10,40D-95,205,50,10R-25,327,120,3R-95,327,70,3F45,395,50,10F35,365,10,40D35,365,70,10D-95,365,60,10D-45,365,10,40D-95,395,50,10R-95,517,70,3F-25,517,130,3R95,-15,300,532D105,517,300,35D95,552,300,400D-5,650,10,30W-15,660,30,10W-10,655,20,20W111,536,7,*105,517,300,35D95,517,10,35E',
	'-515,-20,100,1000R10,200,10,30F0,210,60,10F5,205,10,20F25,-15,500,100D-415,-15,390,100D25,85,35,5N-250,85,35,15N-415,130,5,600D-415,85,25,5N-415,95,10,3W',
	'-520,700,30,5D-520,400,30,5A-520,500,30,5A-520,600,30,5A-480,700,40,5A-520,800,30,5A-520,-15,120,250R20,-15,600,60D-345,35,20,10D-280,35,310,10D-325,35,10,380D-345,45,20,10N-400,150,20,10R-400,140,20,10D-345,240,20,10F-345,230,20,10D-420,235,20,150F-520,235,80,650F-440,235,20,80R-440,315,20,70F-440,365,20,520R-420,385,20,550R-345,330,20,10N-325,415,10,5N-315,45,800,370V0,45,75,20R145,45,30,20R175,45,30,50N205,45,50,20N390,45,300,5R400,100,100,15W-410,925,40,10R415,-20,200,1000R-480,1000,1,*',
	'-520,-20,1100,1000U-520,1100,300,200W-25,20,50,10R-450,500,30,1000E-420,500,1100,1000D-520,500,70,1000D-520,225,465,10D-25,225,455,10D-55,225,30,10E-460,485,10,15N100,490,10,10W-435,800,5,*',
	'-520,-20,132,50R-360,25,225,5R-95,25,1000,5R-20,-20,1000,10R-20,-20,1000,15R-20,-10,1000,10R-20,-10,1000,15R-20,0,1000,10R-20,10,1000,5R-20,0,1000,15R-20,15,1000,5R-20,15,1000,10R-20,15,1000,15R-125,30,20,50W-100,55,5,100N-135,55,5,100N-120,90,10,5N105,30,20,50B-390,-20,370,50F-360,25,225,5R-95,25,1000,5R-400,160,12,30N-300,130,20,20D',
	'500,-20,20,1000U-70,50,140,5A-70,150,140,5A-70,250,140,5A-25,-20,5,200R20,-20,5,350R-25,230,5,100R-25,180,5,50F210,-20,250,370U210,350,250,316V-520,666,950,334U-415,580,1,30U-520,580,730,86V-25,325,50,5S-520,20,495,5S25,20,400,5S210,420,40,5R300,400,40,5R340,400,40,5F375,425,40,5N300,470,40,5A300,470,5,40N275,535,5,5N-520,575,950,5A-500,1020,880,5S150,1000,5,10N-70,50,5,205F65,50,5,205F-520,1025,940,500W415,-20,200,50R415,150,22,900R415,1050,22,900F435,30,100,2000F415,30,20,120F480,825,2,*',
	'-23,-20,6,9N17,-20,6,9N-40,-20,20,10D-100,-20,60,10E20,-20,365,10D385,-20,200,10E-420,-20,320,10D-300,-10,50,10R250,-10,50,10F-40,120,80,5N-420,100,10,5R-420,200,40,5A380,200,40,5A-380,200,20,5N280,-10,20,5N-520,-20,100,2000R415,15,21,1000R406,101,8,3D405,100,10,5F415,-20,100,35F435,100,20,5A435,200,20,5A435,300,20,5A435,400,20,5A435,15,100,1000F500,475,20,15W',
	'400,290,200,10E470,295,40,5N400,390,50,10R410,380,30,10R375,100,1000,10T-30,330,50,10D20,330,10,1000D100,300,30,5F150,300,30,5N100,400,40,5A100,500,40,5A100,600,40,5A100,700,40,5A100,800,40,5A100,900,40,5A100,1000,40,5A95,500,5,1000R140,500,60,5D140,500,5,200D140,700,5,40E140,740,5,1000D195,500,5,1000D-520,-20,1050,10B-520,-15,1050,10B-520,-10,1050,10B-520,-20,20,2000B500,-20,100,2000B-100,100,200,20B-100,100,200,5S-100,120,200,5R-175,0,15,200D100,0,15,300D100,290,300,10D-255,92,10,258D-255,350,10,5N-300,150,45,10T-300,450,100,5A-425,50,15,400B-520,-20,15,2000B-420,50,10,400B-410,50,40,5S-375,0,5,50R155,520,30,30W450,40,3,*',
	(function(){
		var j='';
		for(var i = -20; i<=160; i+=5){
			j+='-10,'+i+',20,10R';
		}
		return j;
	}()+'300,100,50,10B480,275,50,5N480,350,50,5A-450,40,40,5N-520,135,40,5N-480,220,50,10T-520,420,40,5N-520,520,40,5T-450,650,30,5N-380,740,30,5N-350,825,50,5N-320,850,20,5N350,900,60,5A450,1000,70,10N250,1000,100,10D250,1000,10,40D340,1000,10,40D260,1010,80,10W-490,470,6,*'),
	'D-420,-15,200,400D30,-15,400,55D-70,30,100,10D-70,30,10,100F-60,40,100,50R20,40,20,10R20,-15,10,45F-130,-15,80,45R-100,20,120,10R250,40,222,10R-420,-15,290,100R390,-15,30,130R405,-15,30,400R300,170,20,10D250,160,70,10D250,160,20,50R250,220,20,10D200,210,70,10D200,210,20,50R200,270,20,10D150,260,70,10D150,260,20,50R150,320,20,10D100,310,70,10D100,310,20,50R100,370,20,10D50,360,70,10D50,360,20,50R50,420,20,10D0,410,70,10D0,410,20,50F0,470,20,10D-50,460,70,10D-50,460,20,60R-50,520,20,10W410,400,20,20F405,385,30,400W-50,550,20,20W'
],
deaths = 0,
standing = true,
b,m=[];
function die(){
	deaths++;
	if(sneaky||keys[83]){
		deaths=0;
		lvl=1;
		start=0;
	}
	ab();
}
var keys=[],mouse={x:0,y:0},clicked=false,clickin=null;
/**
 * Poly takes a list of argument pairs.
 * [x, y, x, y] etc and draws a line from each point to the given coodinates.
 * It fills it at the end.
 * It doesn't change any ctx styles which
 */
function poly(...args){
	ctx.beginPath();
	ctx.moveTo(args[0],args[1]);
	for(var i = 2; i < Math.floor(args.length/2)*2; i+=2){
		ctx.lineTo(args[i],args[i+1]);
	}
	ctx.closePath();
	ctx.fill();
}

function translatedPoly(){
	ctx.beginPath();
	ctx.moveTo(arguments[0]+c.width-50,arguments[1]+c.height/2);
	for(var i = 2; i < Math.floor(arguments.length/2)*2; i+=2){
		ctx.lineTo(arguments[i]+c.width-50,arguments[i+1]+c.height/2);
	}
	ctx.closePath();
	ctx.fill();
}
window.onload = _ => {
	c = document.getElementById('c');
	ctx = c.getContext("2d");
	CanvasRenderingContext2D.prototype.wrapText = function (text, x, y, maxWidth, lineHeight) {
		text = text.split('\n');
		for (var i = 0; i < text.length; i++) {
			this.fillText(text[i], x, y);
			y += lineHeight;
		}
	};
	c.onkeydown = function(evt){
		keys[evt.keyCode||evt.which]=true;
		console.log(evt.keyCode||evt.which);
		evt.preventDefault();
	}
	c.onkeyup = function(evt){
		keys[evt.keyCode||evt.which]=false;
	}
	c.addEventListener('mousedown', function(evt){
		mouse = {
			x: evt.clientX - c.getBoundingClientRect().left,
			y: evt.clientY - c.getBoundingClientRect().top
		}
		clicked=1;
		c.focus();
		evt.preventDefault();
	}, false);
	c.addEventListener('mouseup', function(evt) {
		mouse = {
			x: evt.clientX - c.getBoundingClientRect().left,
			y: evt.clientY - c.getBoundingClientRect().top
		}
		clicked=0;
	}, false);
	ctx.canvas.width = 600;
	ctx.canvas.height = 400;
	ctx.textAlign = 'center';
	if(!unlockedCostumes.length){
		setCostumes(unlockedCostumes=[0]);
	}
	ab();
	setInterval(function update(){
		if(!paused){
			if(keys[83])die();
			if(keys[82]&&rsr){
				die();
				rsr=0;
			}
			if(!rsr&&!keys[82])rsr=1;
			if(keys[37]||keys[65]){playerVelocity.x-=1;l-=0.5;if(!start)start=Date.now()}
			if(keys[39]||keys[68]){playerVelocity.x+=1;l+=0.5;if(!start)start=Date.now()}
			if(standing){
				playerVelocity.y = 0;
				if(keys[38]||keys[87]){playerVelocity.y=13;if(!start)start=Date.now()}
			} else {
				playerVelocity.y-=0.3;
			}
			if(playerCoords.y+playerVelocity.y <= 0){
				standing = true;
				playerCoords.y=0;
				playerVelocity.y=0;
			} else {
				standing = false;
			}
			if(playerCoords.x+playerVelocity.x <= -500){
				playerVelocity.x = 0;
				playerCoords.x = -500;
			}
			if(playerCoords.x+playerVelocity.x >= 500){
				playerVelocity.x = 0;
				playerCoords.x = 500;
			}
			for(var i in b)if(b[i].sense()=='levelup'){
				lvl++;
				if(gained){
					unlockedCostumes.push(gained);
					setCostumes(unlockedCostumes);
					unlockedCostumes=getUnlockedCostumes_as_ary();
				}
				ab();
				return;
			}
			l*=0.9;
			playerVelocity.y*=0.95;
			playerVelocity.x*=0.8;
			playerCoords.x+=playerVelocity.x;
			playerCoords.y+=playerVelocity.y;
			pau=start?Math.floor((Date.now()-start)/100)/10:0;
		}
		fill('#000');
		rect(0,0,c.width,c.height);
		for(var i in b){
			b[i].img();
		}
		fill('#FFF')
		rect(-1,playerCoords.y+c.height/2+15,c.width+2,c.height/2+1)
		rect(c.width/2-playerCoords.x-816,-1,c.width/2+1,c.height+2)
		rect(c.width/2-playerCoords.x+515,-1,c.width/2+1,c.height+2)
		drawChar(player_costume,c.width/2,c.height/2,l)
		fill('#0F0')
		poly(0,0,100,50,c.width-100,50,c.width,0)
		fill('#32C800')
		poly(0,0,100,50,100,c.height-50,0,c.height)
		poly(c.width,0,c.width-100,50,c.width-100,c.height-50,c.width,c.height)
		fill('#009600')
		poly(0,c.height,100,c.height-50,c.width-100,c.height-50,c.width,c.height)
		fill('#000')
		ctx.font = '30px Monospace';
		ctx.fillText('Neon Prison',c.width/2,35)
		ctx.font = '25px Monospace';
		var qwer = -75;
		ctx.fillText('Level:',50,c.height/2+qwer)
		ctx.fillText(lvl,50,c.height/2+qwer+30)
		ctx.fillText('Deaths:',50,c.height/2+80+qwer)
		ctx.fillText(deaths,50,c.height/2+110+qwer)
		ctx.fillText('Time:',50,c.height/2+160+qwer)
		ctx.fillText(pau,50,c.height/2+190+qwer)
		ctx.font = '15px Monospace';
		ctx.wrapText(lvl===lvlnm.length-1&&deaths>0?'You not-so-sneaky custard!\nI haven\'t gotten this far yet.':lvlnm[lvl],c.width/2,c.height-27,20000,18);
		fill(paused?'#fff':'#000')
		rect(c.width-95,c.height/2-45,90,90,45)
		fill(paused?'#cd38ff':'#32C800')
		rect(c.width-70,c.height/2-20,40,40,20)

		translatedPoly(28,22,35.5,1,0,0,11,33,-11,33,0,0,-28,22,-35.5,1,0,0,11,-33,28,-22,0,0,-11,-33,-28,-22,0,0);
		translatedPoly(10,16,28,22,35.5,1,19,-7,28,-22,11,-33,0,-20,-11,-33,-28,-22,-19,-7,-35.5,1,-28,22,-10,16,-11,33,11,33)
		fill(paused?'#fff':'#000');
		rect(c.width-62,c.height/2-12,24,24,12)
		fill(paused?'#cd38ff':'#32C800');
		rect(c.width-55,c.height/2-5,10,10,5)
		if(paused){
			if(invert){ctx.fillStyle='rgba(255,255,255,0.25)'}else{ctx.fillStyle='rgba(0,0,0,0.25)'}
			rect(100,50,c.width-200,c.height-100);
			fill('#fff');
			ctx.font = '30px Monospace';
			ctx.fillText('Settings',c.width/2,100);
			rect(150,150,16,16,3);
			rect(150,200,16,16,3);
			ctx.font = '24px Monospace';
			ctx.textAlign = 'left';
			ctx.fillText('Invert colors',180,166);
			ctx.fillText('Sneaky Custard Mode',180,216);
			ctx.textAlign = 'center';
			ctx.fillText('Choose your character',c.width/2,c.height-100)
			fill('#808080');
			if(invert)rect(153,153,10,10,5);
			if(sneaky)rect(153,203,10,10,5);
			for(var i in unlockedCostumes)drawChar(unlockedCostumes[i],120+i*50,c.height-70);
			if(clicked){
				if(clickin===null){
					if(150<mouse.x&&166>mouse.x&&!clickin){
						if(150<mouse.y&&166>mouse.y){
							clickin='invert';
						}
						if(200<mouse.y&&216>mouse.y){
							clickin='wan';
						}
					}
					//Allot a lot of lots to my parking lot.
					if(c.height-55>mouse.y&&mouse.y>c.height-85){
						for(var i in unlockedCostumes){
							if(105+i*50<mouse.x&&mouse.x<135+i*50){
								clickin=i;
							}
						}
					}
				}
			} else {
				if(150<mouse.x&&166>mouse.x&&200<mouse.y&&216>mouse.y&&clickin==='wan'){
					sneaky=!sneaky;
					clickin=null;
				}
				if(150<mouse.x&&166>mouse.x&&150<mouse.y&&166>mouse.y&&clickin==='invert'){
					invert=!invert;
					clickin=null;
				}
				if(c.height-55>mouse.y&&mouse.y>c.height-85){
					for(var i in unlockedCostumes){
						if(105+i*50<mouse.x&&mouse.x<135+i*50){
							player_costume=unlockedCostumes[i];
							clickin=null;
						}
					}
				}
			}
		}
		if(clicked){
			if(2025>((mouse.x-c.width+50)*(mouse.x-c.width+50)+(mouse.y-c.height/2)*(mouse.y-c.height/2))&&!clickin){
				clickin='button';
			}
		} else {
			if(2025>((mouse.x-c.width+50)*(mouse.x-c.width+50)+(mouse.y-c.height/2)*(mouse.y-c.height/2))&&clickin==='button'){
				paused=!paused;
				start=Date.now()-pau*1000;
			}
			clickin=null;
		}
	}, 17);
}
