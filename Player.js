import Vector from "./Vector.js";
import globals from "./globals.js";

const Player = {
	deaths: 0,
	eyePosition: 0,
	unlockedCostumes: globals.getUnlockedCostumes_as_ary(),
	position: new Vector(0, 0),
	velocity: new Vector(0, 0),
	standing: true,
	gained: 0,
	reset(){
		Player.position = new Vector(0, 0);
		Player.velocity = new Vector(0, 0);
		Player.standing = true;
		Player.gained = 0;
	},
	die(){
		if(globals.sneaky || globals.keys[83]) {
			Player.deaths = 0;
			globals.lvl = 1;
			globals.start = 0;
		} else {
			Player.deaths++;
		}
		Player.reset();
		globals.alabastorBalkans();
	}
};

Player.reset();

export default Player;
