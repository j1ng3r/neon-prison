import Vector from "./Vector.js";

class EventHandler {
   constructor(element) {
      this.element = element;
      this.keys = [];
      this.mouse = Vector.zero();
      this.clicked = false;
      this.addEventListeners();
   }
   onkeydown(evt) {
      this.keys[evt.keyCode || evt.which] = true;
      evt.preventDefault();
   }
   onkeyup(evt) {
      this.keys[evt.keyCode || evt.which] = false;
   }
   getMouse(evt) {
      let clientRect = this.element.getBoundingClientRect();
      this.mouse = new Vector(evt.clientX - clientRect.left, evt.clientY - clientRect.top);
   }
   onmousedown(evt) {
      this.getMouse(evt);
      this.clicked = true;
      this.element.focus();
   }
   onmouseup(evt) {
      this.getMouse(evt);
      this.clicked = false;
   }
   addEventListeners() {
      this.element.addEventListener("keydown", evt => this.onkeydown(evt));
      this.element.addEventListener("keyup", evt => this.onkeyup(evt));
      this.element.addEventListener("mousedown", evt => this.onmousedown(evt));
      this.element.addEventListener("mouseup", evt => this.onmouseup(evt));
   }
}

export default EventHandler;
