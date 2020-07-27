import { setFillStyleOrInvert, ctx, roundedRectangle, invert, l, poly } from "./globals.js";

/**
 * This function draws the character to the global `ctx` object.
 * Separate sprites out in the future
 */
export default function drawChar(sprite, x, y, eyePosition) {
   if (!eyePosition) { eyePosition = 0 }
   switch (sprite) {
      case 0:
         setFillStyleOrInvert("#F00");
         roundedRectangle(x - 15, y - 15, 30, 10);
         setFillStyleOrInvert("#FF0");
         roundedRectangle(x - 15, y - 15, 30, 30, 9);
         setFillStyleOrInvert("#00F");
         ctx.beginPath();
         ctx.arc(x - 6 + eyePosition, y - 3, 3, 0, Math.PI * 2);
         ctx.arc(x + 6 + eyePosition, y - 3, 3, 0, Math.PI * 2);
         ctx.closePath();
         ctx.fill();
         setFillStyleOrInvert("#000");
         roundedRectangle(x - 7, y + 4, 14, 5, 2);
         return;
      case 1:
         setFillStyleOrInvert("#0FF");
         roundedRectangle(x - 15, y - 15, 30, 10);
         setFillStyleOrInvert("#00F");
         roundedRectangle(x - 15, y - 15, 30, 30, 9);
         setFillStyleOrInvert("#FF0");
         ctx.beginPath();
         ctx.arc(x - 6 + eyePosition, y - 3, 3, 0, Math.PI * 2);
         ctx.arc(x + 6 + eyePosition, y - 3, 3, 0, Math.PI * 2);
         ctx.closePath();
         ctx.fill();
         setFillStyleOrInvert("#FFF");
         roundedRectangle(x - 7, y + 4, 14, 5, 2);
         return;
      case 2:
         setFillStyleOrInvert("#FFF");
         roundedRectangle(x - 15, y - 15, 30, 10);
         setFillStyleOrInvert("#F00");
         roundedRectangle(x - 15, y - 15, 30, 30, 9);
         setFillStyleOrInvert("#000");
         ctx.beginPath();
         ctx.arc(x - 6 + eyePosition, y - 3, 3, 0, Math.PI * 2);
         ctx.arc(x + 6 + eyePosition, y - 3, 3, 0, Math.PI * 2);
         ctx.closePath();
         ctx.fill();
         setFillStyleOrInvert("#000");
         roundedRectangle(x - 7, y + 4, 14, 5, 2);
         return;
      case 3:
         setFillStyleOrInvert("#000");
         roundedRectangle(x - 15, y - 15, 30, 10);
         ctx.fillStyle = "#888";
         roundedRectangle(x - 15, y - 15, 30, 30, 9);
         setFillStyleOrInvert("#fff");
         ctx.beginPath();
         ctx.arc(x - 6 + eyePosition, y - 3, 3, 0, Math.PI * 2);
         ctx.arc(x + 6 + eyePosition, y - 3, 3, 0, Math.PI * 2);
         ctx.closePath();
         ctx.fill();
         setFillStyleOrInvert("#000");
         ctx.beginPath();
         ctx.arc(x - 6 + eyePosition, y - 3, 2, 0, Math.PI * 2);
         ctx.arc(x + 6 + eyePosition, y - 3, 2, 0, Math.PI * 2);
         ctx.closePath();
         ctx.fill();
         ctx.fillStyle = invert ? "rgba(0,255,255,0.4)" : "rgba(255,0,0,0.4)";
         roundedRectangle(x - 7, y + 4, 14, 5, 2);
         poly(x + 13, y + 2, x + 8, y + 10, x + 8, y + 11, x + 13, y + 3);
         return;
      case 4:
         setFillStyleOrInvert("#fff");
         roundedRectangle(x - 15, y - 15, 30, 10);
         setFillStyleOrInvert("#fff");
         roundedRectangle(x - 15, y - 15, 30, 30, 9);
         setFillStyleOrInvert("#000");
         ctx.beginPath();
         ctx.arc(x - 6 + eyePosition, y - 3, 3, 0, Math.PI * 2);
         ctx.arc(x + 6 + eyePosition, y - 3, 3, 0, Math.PI * 2);
         ctx.closePath();
         ctx.fill();
         setFillStyleOrInvert("#000");
         ctx.beginPath();
         ctx.arc(x - 6 + eyePosition, y - 3, 2, 0, Math.PI * 2);
         ctx.arc(x + 6 + eyePosition, y - 3, 2, 0, Math.PI * 2);
         ctx.closePath();
         ctx.fill();
         roundedRectangle(x - 7, y + 4, 14, 5, 2);
         return;
      case 5:
         setFillStyleOrInvert("#F00");
         roundedRectangle(x - 15, y + 5, 30, 10);
         setFillStyleOrInvert("#FF0");
         roundedRectangle(x - 15, y - 15, 30, 30, 9);
         setFillStyleOrInvert("#00F");
         ctx.beginPath();
         ctx.arc(x - 6 - eyePosition, y + 3, 3, 0, Math.PI * 2);
         ctx.arc(x + 6 - eyePosition, y + 3, 3, 0, Math.PI * 2);
         ctx.closePath();
         ctx.fill();
         setFillStyleOrInvert("#000");
         roundedRectangle(x - 7, y - 9, 14, 5, 2);
         return;
      case 6:
         setFillStyleOrInvert("#000");
         roundedRectangle(x - 11, y - 11, 22, 22);
         setFillStyleOrInvert("#f00");
         ctx.beginPath();
         ctx.arc(x - 6 + eyePosition, y - 3, 3, 0, Math.PI * 2);
         ctx.arc(x + 6 + eyePosition, y - 3, 3, 0, Math.PI * 2);
         ctx.closePath();
         ctx.fill();
         roundedRectangle(x - 7, y + 4, 14, 5, 2);
         setFillStyleOrInvert("#666");
         roundedRectangle(x - 15, y - 15, 4, 30);
         roundedRectangle(x - 15, y - 15, 30, 4);
         roundedRectangle(x + 11, y - 15, 4, 30);
         roundedRectangle(x - 15, y + 11, 30, 4);
         roundedRectangle(x - 11, y - 7, 22, 4);
         roundedRectangle(x - 11, y + 3, 22, 4);
         return;
      case 7:
         setFillStyleOrInvert("#f00");
         roundedRectangle(x - 10, y - 14, 20, 30);
         roundedRectangle(x - 6, y - 16, 12, 4);
         roundedRectangle(x - 12, y - 12, 24, 26);
         roundedRectangle(x - 14, y - 10, 28, 20);
         roundedRectangle(x - 16, y - 6, 32, 14);
         setFillStyleOrInvert("#000");
         roundedRectangle(x - 8, y - 12, 16, 26);
         roundedRectangle(x - 4, y - 14, 8, 20);
         roundedRectangle(x - 10, y - 6, 20, 18);
         roundedRectangle(x - 8, y - 12, 16, 26);
         roundedRectangle(x - 14, y - 4, 28, 6);
         roundedRectangle(x - 12, y - 8, 24, 4);
         setFillStyleOrInvert("#00f");
         roundedRectangle(x - 2, y - 14, 4, 8);
         roundedRectangle(x - 4, y - 10, 8, 4);
         roundedRectangle(x + 4, y - 8, 4, 4);
         roundedRectangle(x - 8, y - 8, 4, 4);
         roundedRectangle(x - 10, y - 10, 2, 4);
         roundedRectangle(x + 8, y - 10, 2, 4);
         roundedRectangle(x + 6, y - 4, 2, 4);
         roundedRectangle(x + 6, y, 4, 4);
         roundedRectangle(x + 10, y + 2, 4, 4);
         roundedRectangle(x + 4, y + 2, 2, 2);
         roundedRectangle(x - 8, y - 4, 2, 4);
         roundedRectangle(x - 10, y, 4, 4);
         roundedRectangle(x - 14, y + 2, 4, 4);
         roundedRectangle(x - 6, y + 2, 2, 2);
         setFillStyleOrInvert("#f00");
         roundedRectangle(x - 10, y + 4, 2, 4);
         roundedRectangle(x + 8, y + 4, 2, 4);
         roundedRectangle(x - 10, y + 4, 20, 2);
         roundedRectangle(x - 4 + l, y + 6, 2, 4);
         roundedRectangle(x + 2 + l, y + 6, 2, 4);
   }
}
