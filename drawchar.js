/**
 * This function draws the character to the global `ctx` object.
 * Separate sprites out in the future
 */
function drawChar(sprite,x,y,eyePosition){
	if(!eyePosition)eyePosition=0;
	switch(sprite){
		case 0:
			fill('#F00');
			rect(x-15,y-15,30,10);
			fill('#FF0');
			rect(x-15,y-15,30,30,9);
			fill('#00F');
			ctx.beginPath();
			ctx.arc(x-6+eyePosition, y-3, 3, 0, Math.PI*2);
			ctx.arc(x+6+eyePosition, y-3, 3, 0, Math.PI*2);
			ctx.closePath();
			ctx.fill();
			fill('#000');
			rect(x-7,y+4,14,5,2);
			return;
		case 1:
			fill('#0FF');
			rect(x-15,y-15,30,10);
			fill('#00F');
			rect(x-15,y-15,30,30,9);
			fill('#FF0');
			ctx.beginPath();
			ctx.arc(x-6+eyePosition, y-3, 3, 0, Math.PI*2);
			ctx.arc(x+6+eyePosition, y-3, 3, 0, Math.PI*2);
			ctx.closePath();
			ctx.fill();
			fill('#FFF');
			rect(x-7,y+4,14,5,2);
			return;
		case 2:
			fill('#FFF');
			rect(x-15,y-15,30,10);
			fill('#F00');
			rect(x-15,y-15,30,30,9);
			fill('#000');
			ctx.beginPath();
			ctx.arc(x-6+eyePosition, y-3, 3, 0, Math.PI*2);
			ctx.arc(x+6+eyePosition, y-3, 3, 0, Math.PI*2);
			ctx.closePath();
			ctx.fill();
			fill('#000');
			rect(x-7,y+4,14,5,2);
			return;
		case 3:
			fill('#000');
			rect(x-15,y-15,30,10);
			ctx.fillStyle = '#888';
			rect(x-15,y-15,30,30,9);
			fill('#fff');
			ctx.beginPath();
			ctx.arc(x-6+eyePosition, y-3, 3, 0, Math.PI*2);
			ctx.arc(x+6+eyePosition, y-3, 3, 0, Math.PI*2);
			ctx.closePath();
			ctx.fill();
			fill('#000');
			ctx.beginPath();
			ctx.arc(x-6+eyePosition, y-3, 2, 0, Math.PI*2);
			ctx.arc(x+6+eyePosition, y-3, 2, 0, Math.PI*2);
			ctx.closePath();
			ctx.fill();
			ctx.fillStyle=invert?'rgba(0,255,255,0.4)':'rgba(255,0,0,0.4)';
			rect(x-7,y+4,14,5,2);
			poly(x+13,y+2,x+8,y+10,x+8,y+11,x+13,y+3);
			return;
		case 4:
			fill('#fff');
			rect(x-15,y-15,30,10);
			fill('#fff');
			rect(x-15,y-15,30,30,9);
			fill('#000');
			ctx.beginPath();
			ctx.arc(x-6+eyePosition, y-3, 3, 0, Math.PI*2);
			ctx.arc(x+6+eyePosition, y-3, 3, 0, Math.PI*2);
			ctx.closePath();
			ctx.fill();
			fill('#000');
			ctx.beginPath();
			ctx.arc(x-6+eyePosition, y-3, 2, 0, Math.PI*2);
			ctx.arc(x+6+eyePosition, y-3, 2, 0, Math.PI*2);
			ctx.closePath();
			ctx.fill();
			rect(x-7,y+4,14,5,2);
			return;
		case 5:
			fill('#F00');
			rect(x-15,y+5,30,10);
			fill('#FF0');
			rect(x-15,y-15,30,30,9);
			fill('#00F');
			ctx.beginPath();
			ctx.arc(x-6-eyePosition, y+3, 3, 0, Math.PI*2);
			ctx.arc(x+6-eyePosition, y+3, 3, 0, Math.PI*2);
			ctx.closePath();
			ctx.fill();
			fill('#000');
			rect(x-7,y-9,14,5,2);
			return;
		case 6:
			fill('#000')
			rect(x-11,y-11,22,22)
			fill('#f00')
			ctx.beginPath();
			ctx.arc(x-6+eyePosition, y-3, 3, 0, Math.PI*2);
			ctx.arc(x+6+eyePosition, y-3, 3, 0, Math.PI*2);
			ctx.closePath();
			ctx.fill();
			rect(x-7,y+4,14,5,2);
			fill('#666')
			rect(x-15,y-15,4,30)
			rect(x-15,y-15,30,4)
			rect(x+11,y-15,4,30)
			rect(x-15,y+11,30,4)
			rect(x-11,y-7,22,4)
			rect(x-11,y+3,22,4)
			return;
		case 7:
			fill('#f00')
			rect(x-10,y-14,20,30)
			rect(x-6,y-16,12,4)
			rect(x-12,y-12,24,26)
			rect(x-14,y-10,28,20)
			rect(x-16,y-6,32,14)
			fill('#000')
			rect(x-8,y-12,16,26)
			rect(x-4,y-14,8,20)
			rect(x-10,y-6,20,18)
			rect(x-8,y-12,16,26)
			rect(x-14,y-4,28,6)
			rect(x-12,y-8,24,4)
			fill('#00f')
			rect(x-2,y-14,4,8)
			rect(x-4,y-10,8,4)
			rect(x+4,y-8,4,4)
			rect(x-8,y-8,4,4)
			rect(x-10,y-10,2,4)
			rect(x+8,y-10,2,4)
			rect(x+6,y-4,2,4)
			rect(x+6,y,4,4)
			rect(x+10,y+2,4,4)
			rect(x+4,y+2,2,2)
			rect(x-8,y-4,2,4)
			rect(x-10,y,4,4)
			rect(x-14,y+2,4,4)
			rect(x-6,y+2,2,2)
			fill('#f00')
			rect(x-10,y+4,2,4)
			rect(x+8,y+4,2,4)
			rect(x-10,y+4,20,2)
			rect(x-4+l,y+6,2,4)
			rect(x+2+l,y+6,2,4)
			return;
	}
};
