var XMIN = -1.0;
var XMAX =  1.0;
var YMIN = -1.0;
var YMAX =  1.0;

var canvas = document.getElementById('image');
var ctx = canvas.getContext('2d');
var xr = ctx.canvas.width;
var yr = ctx.canvas.height;
var imgd = ctx.getImageData(0, 0, xr, yr);

var trs = [];
var affinCount = 10;
for (var i = 0; i < affinCount; i++) {
  trs.push(getAffin(xr, yr));
}
var counter = {};
var stop = false;
function calc() {
  if (stop)
    return;
  var x = Math.random() * (XMAX - XMIN) + XMIN;
  var y = Math.random() * (YMAX - YMIN) + YMIN;
  for (var i = 0; i < 100000; i++ ) {
    var tr = trs[Math.floor(Math.random() * affinCount)];
    var nx = Math.sin(tr.a * x + tr.b * y + tr.c);
    var ny = Math.sin(tr.d * x + tr.e * y + tr.f);
    x = nx / (nx*nx + ny*ny);
    y = ny / (nx*nx + ny*ny);
    nx = cr(xr, XMIN, XMAX, x);
    ny = cr(yr, YMIN, YMAX, y);
    var index = (Math.floor(nx) + Math.floor(ny) * yr) * 4;
    if (!counter[index]) {
      counter[index] = 0;
      imgd.data[index + 0] = tr.red;
      imgd.data[index + 1] = tr.green;
      imgd.data[index + 2] = tr.blue;
      imgd.data[index + 3] = 255;
    } else {
      imgd.data[index + 0] = (imgd.data[index + 0] * counter[index] + tr.red) / (counter[index] + 1);
      imgd.data[index + 1] = (imgd.data[index + 1] * counter[index] + tr.green) / (counter[index] + 1);
      imgd.data[index + 2] = (imgd.data[index + 2] * counter[index] + tr.blue) / (counter[index] + 1);
    }
    counter[index]++;
  }
  ctx.putImageData(imgd, 0, 0);
  setTimeout(calc, 0);
}
calc();

function cr (r, min, max, c) {
  return r - Math.floor(((max - c) / (max - min)) * r);
}

function getAffin (x, y) {
  return {
    a: Math.random() * 2 - 1,
    b: Math.random() * 2 - 1,
    c: Math.random() * x,
    d: Math.random() * 2 - 1,
    e: Math.random() * 2 - 1,
    f: Math.random() * y,
    red: Math.floor(Math.random() * 128 + 128),
    green: Math.floor(Math.random() * 128 + 128),
    blue: Math.floor(Math.random() * 128 + 128)
  };
}
