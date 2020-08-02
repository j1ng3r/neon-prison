/** Global Variables :stevenson: */
const globals = {};

globals.setCostumes = function setCostumes(ary_unlockedCostumes) {
   const c = ary_unlockedCostumes.filter((v, i, m) => m.indexOf(v) === i).reduce((a, v) => a + 2 ** v, 0).toString(36);
   document.cookie = `_d_=${c};`;
};
globals.getUnlockedCostumes_as_ary = function getUnlockedCostumes_as_ary() {
   let cookie = document.cookie.split(";").find(v => v.slice(0, 4) === "_d_=");
   if (cookie === undefined) {
      cookie = document.cookie = "_d_=1";
   }
   return parseInt(cookie.slice(4), 36).toString(2).split("").map((v, i) => +v ? i : -1).filter(i => i > -1);
};

globals.keys = [];
globals.sneaky = !1;
globals.lvl = 1;
globals.start = 0;
globals.time = Date.now();

export default globals;
