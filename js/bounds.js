var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var work_area = document.querySelector("#work_area");

var pointSize = 5;
var pointColor = "#d6265b";
var lineColor = "#fff";

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  sub(vector){
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }
  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  div_number(number){
    this.x /= number;
    this.y /= number;
    return this;
  }
  mult_number(number){
    this.x *= number;
    this.y *= number;
    return this;
  }
  copy(){
    return new Vector(this.x,this.y);
  }
  norm(){
    this.x /= this.getMagnitude();
    this.y /= this.getMagnitude();
    return this;
  }
  rotate(angle){
    var x = this.x;
    this.x = this.x*Math.cos(angle) - this.y*Math.sin(angle);
    this.y = x*Math.sin(angle) + this.y*Math.cos(angle);
    return this;
  }
  redirection(){
    this.x *= -1;
    this.y *= -1;
    return this;
  }
  scalar(vector2){
    return this.x*vector2.x+this.y*vector2.y;
  }
  angleWithVector(vector2){
    return Math.acos(this.scalar(vector2)/(this.getMagnitude()*vector2.getMagnitude()));
  }
  getMagnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };
  getAngle() {
    return Math.atan2(this.y, this.x);
  };
  static fromAngle(angle, magnitude) {
    return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
  };
}


var mouse = new Vector(0,0);
var clip_points = [];
var bounds_funcs = [];

canvas.addEventListener("mousedown", function(e){ 
  mouse.x = e.pageX - work_area.offsetLeft;
  mouse.y = e.pageY - work_area.offsetTop;
  clip_points.push(new Vector(mouse.x,mouse.y));
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, pointSize, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fillStyle = pointColor;
  ctx.fill();
});

function draw_lines(){
   for(var index = 0;index < clip_points.length;index++){
    var current_index = index,
    next_index = index ==  clip_points.length -1 ? 0:index + 1;

    var point1 = clip_points[current_index],
        point2 = clip_points[next_index];

    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);

    ctx.lineTo(point2.x,point2.y);
    ctx.lineWidth = '2';
    ctx.strokeStyle = lineColor;
    ctx.stroke();
  }
  ctx.closePath();
}

document.querySelector("#draw_button").addEventListener("mousedown", function(e){ 
  for(var index = 0;index < clip_points.length;index++){
    var current_index = index,
    next_index = index ==  clip_points.length -1 ? 0:index + 1;

    var point1 = clip_points[current_index],
        point2 = clip_points[next_index];
    bounds_funcs.push((x,y) => {
      console.log((x-point2.x)/(point2.x - point1.x)-
             (y-point2.y)/(point2.y - point1.y));
      return (x-point2.x)/(point2.x - point1.x)-
             (y-point2.y)/(point2.y - point1.y);});

    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);

    ctx.lineTo(point2.x,point2.y);
    ctx.lineWidth = '4';
    ctx.strokeStyle = lineColor;
    ctx.stroke();
  }
  ctx.closePath();
  start();
});



document.querySelector("#clear_button").addEventListener("mousedown", function(e){ 
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  clip_points = [];
});
