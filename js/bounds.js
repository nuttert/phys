var canvas = document.querySelector("#work_canvas");
var ctx = canvas.getContext("2d");
var work_area = document.querySelector("#work_area");

var pointSize = 5;
var pointColor = "#d6265b";
var lineColorWithoutHighliting = "#fff";
var lineColorWithHighliting = "#05e6ee";
var lineColorForChoosenBounds = "#ee05a9";
var lineColor = "#fff";
var highlitedIndexies = [];
var choosenIndexies = [];
var draw_button_was_pressed = false;
var config_button_was_pressed = false;
var stop = false;
var clip_points = [];
var bounds_funcs = [];
var emitters = [];
var maxParticles = 20; 
const emissionRate = 2; // количество частиц, излучаемых за кадр
var particleSize = 10;
var particleColor = "#123";
var velocity = 30;
var particles = null;
var lines = [];



function restart(){
  pointSize = 5;
  pointColor = "#d6265b";
  lineColorWithoutHighliting = "#fff";
  lineColorWithHighliting = "#05e6ee";
  lineColorForChoosenBounds = "#ee05a9";
  lineColor = "#fff";
  highlitedIndexies = [];
  choosenIndexies = [];
  draw_button_was_pressed = false;
  stop = false;
  mouse = new Vector(0,0);
  clip_points = [];
  bounds_funcs = [];
  emitters = [];

  particleColor = "#123";

  particles = null;
  lines = [];

  document.querySelector("#draw_button").style.opacity = '1';
}

function dif_text(span, text){
   span.innerHTML = text;
}

function change_velocity(){
  var rng=document.querySelector('#range_velocity');
  var span = document.querySelector('.range_velocity_li > span');

  velocity = rng.value;
  dif_text(span, "Velocity "+ velocity);
}
function change_amount(){
  var rng=document.querySelector('#range_amount');
  var span = document.querySelector('.range_amount_li > span');
  maxParticles = rng.value;
  dif_text(span, "Amount "+ maxParticles);
}

function change_size(){
   var rng=document.querySelector('#range_size');
  var span = document.querySelector('.range_size_li > span');
  particleSize = rng.value;
  dif_text(span, "Size "+ particleSize);
}

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
  reflection(norm){
    var angle = this.angleWithVector(norm);

    if(angle > Math.PI/2) angle -= Math.PI/2;
    this.rotate(2*angle);
    this.redirection();
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

function vec_intersection(point1,point2,point3,point4){
var ax1 = point1.x, ay1 =point1.y,
ax2 = point2.x, ay2 = point2.y,
bx1 = point3.x, by1 = point3.y,
bx2 = point4.x, by2 = point4.y;
var v1,v2,v3,v4;
   v1 =(bx2-bx1)*(ay1-by1)-(by2-by1)*(ax1-bx1);
   v2 =(bx2-bx1)*(ay2-by1)-(by2-by1)*(ax2-bx1);
   v3 =(ax2-ax1)*(by1-ay1)-(ay2-ay1)*(bx1-ax1);
   v4 =(ax2-ax1)*(by2-ay1)-(ay2-ay1)*(bx2-ax1);
   Intersection =(v1*v2<0) && (v3*v4<0);
   return Intersection
}

function check_intersections(lines){
  // for(var i = 0;index < lines.length;i++){
  //   for(var j = i+1;index < lines.length;i++){
    var current_index = index,
    next_index = index ==  clip_points.length -1 ? 0:index + 1;

    var point1 = clip_points[current_index],
        point2 = clip_points[next_index];
  // }
}

var mouse = new Vector(0,0);

function draw_lines(){
   for(var index = 0;index < clip_points.length;index++){
    var current_index = index,
    next_index = index ==  clip_points.length -1 ? 0:index + 1;

    var point1 = clip_points[current_index],
        point2 = clip_points[next_index];

    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);

    ctx.lineTo(point2.x,point2.y);
    ctx.lineWidth = '4';
    ctx.strokeStyle = lineColor;
    if(highlitedIndexies.includes(index))
    ctx.strokeStyle = lineColorWithHighliting;
    if(choosenIndexies.includes(index))
    ctx.strokeStyle = lineColorForChoosenBounds;
    ctx.stroke();
  }
  ctx.closePath();
}

canvas.addEventListener("mousedown", function(e){ 
  if(draw_button_was_pressed) return;
  mouse.x = e.pageX - work_area.offsetLeft;
  mouse.y = e.pageY - work_area.offsetTop;
  clip_points.push(new Vector(mouse.x,mouse.y));
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, pointSize, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fillStyle = pointColor;
  ctx.fill();
});



document.querySelector("#draw_button").addEventListener("mousedown", function(e){
  if(draw_button_was_pressed) return;
  document.querySelector("#draw_button").style.opacity = '0.3';
  draw_button_was_pressed = true;
  for(var index = 0;index < clip_points.length;index++){
    var current_index = index,
    next_index = index ==  clip_points.length -1 ? 0:index + 1;

    var point1 = clip_points[current_index],
        point2 = clip_points[next_index];

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



function hide_button(button, time=300){
    button.animate({opacity: 0}, time, function(){
    button.css("visibility", "hidden");
    button.css("position", "absolute");
});
}

function vis_button(button, time=300){
    button.animate({opacity: 1}, time, function(){
    button.css("visibility", "visible");
    button.css("position", "static");
});
}

// function absolute_position(object){
//   object.css("position", "absolute");
// }
// function static_position(object){
//   object.css("position", "static");
// }


document.querySelector("#clear_button").addEventListener("mousedown", function(e){ 
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  restart();
  stop = true;
});


document.querySelector("#config_button").addEventListener("mousedown", function(e){ 
  span = document.querySelector("#config_button > span");

if(!config_button_was_pressed){
  config_button_was_pressed = true;

  hide_button($('.draw_button_li'));
  hide_button($('.clear_button_li'));
   
   $('.config_button_li').css("position","absolute");
   dif_text(span, "close");
   $('.config_button_li').animate({top: '0%'}, 200, function(){});

   vis_button($('.ranges_li'));
  //  static_position($('.ranges_li'));
  return;
}

config_button_was_pressed = false;

dif_text(span, "config");
$('.config_button_li').animate({top: '40%'}, 300, function(){
   $('.config_button_li').css("position","static");
});


vis_button($('.draw_button_li'));
vis_button($('.clear_button_li'));

hide_button($('.ranges_li'));
// absolute_position($('.ranges_li'));


});
