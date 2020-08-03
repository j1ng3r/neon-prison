import { Canvas } from "./Canvas.js";
import EventHandler from "./EventHandler.js";


/** Global Variables :stevenson: */
const globals = {};

globals.keys = [];
globals.sneaky = false;
globals.lvl = 1;
globals.start = 0;
globals.time = Date.now();

globals.canvas = new Canvas();
globals.canvas.setElement(document.getElementById("c"));
globals.evts = new EventHandler(globals.canvas.element);

export default globals;
