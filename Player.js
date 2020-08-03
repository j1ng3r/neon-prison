import Vector from "./Vector.js";
import globals from "./globals.js";
import Levels from "./Levels.js";

const Player = {
   deaths: 0,
   eyePosition: 0,
   unlockedCostumes: [],
   position: Vector.zero(),
   velocity: Vector.zero(),
   standing: true,
   gained: 0,
   reset() {
      Player.position = Vector.zero();
      Player.velocity = Vector.zero();
      Player.standing = true;
      Player.gained = 0;
   },
   die() {
      if (globals.sneaky || globals.evts.keys[83]) {
         Player.deaths = 0;
         globals.lvl = 1;
         globals.start = 0;
      } else {
         Player.deaths++;
      }
      Player.reset();
      globals.time = Date.now();
      globals.b = Levels.generate(globals.lvl);
   },
};

globals.canvas.camera.follow(Player);

export default Player;
