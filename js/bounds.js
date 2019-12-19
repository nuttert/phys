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
var lineHasJustChoosen = false;
var draw_button_was_pressed = false;
var config_button_was_pressed = false;
var config_bounds_button_was_pressed = false;
var polygon_button_was_pressed = false;
var stop = false;
var stop_design_animation = false;
var clip_points = [];
var bounds_funcs = [];
var emitters = [];
var maxParticles = 20; 
const emissionRate = 1; // количество частиц, излучаемых за кадр
var particleSize = 10;
var particleColor = "#123";
var velocity = 30;
var particles = null;
var lines = [];
var boundParticles = [];
var kBoundParticle = false;
var kBoundParticleSet = false;
var kBoundParticleSize = 15;
var boundParticle = null;
var bound_patricle_color = 'rgb(100,0,100)';
var center = null;

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
  boundParticles = [];
  emitters = [];
  data_hist.splice(0, data_hist.length);
  particleColor = "#123";
  kBoundParticle = false;
  kBoundParticleSet = false;
  bound_patricle_color = 'rgb(100,0,100)';
  particles = null;
  lines = [];
  
  document.querySelector("#draw_button").style.opacity = '1';
  span = document.querySelector("#set_particle_button > span");
  dif_text(span, "place scatterer");
}

function dif_text(span, text){
   span.innerHTML = text;
}

function hide_object(object, time=300){
    object.animate({opacity: 0}, time, function(){
    object.css("visibility", "hidden");
});
}

function vis_object(object, time=300){
    object.animate({opacity: 1}, time, function(){
    object.css("visibility", "visible");
});
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
  maxParticles = parseInt(rng.value);
  dif_text(span, "Amount "+ maxParticles);
}

function change_size(){
   var rng=document.querySelector('#range_size');
  var span = document.querySelector('.range_size_li > span');
  particleSize = parseInt(rng.value);
  dif_text(span, "Size "+ particleSize);
}

function change__bound_size(){
   var rng=document.querySelector('#range_bound_particle_size');
  var span = document.querySelector('.range_bound_particle_size_li > span');
  kBoundParticleSize = parseInt(rng.value);
  dif_text(span, "Size "+ kBoundParticleSize);
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

    // line = new Line(point1,point2);
    // const r_x = 10;
    // const r_y = 10;

    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);

    ctx.lineTo(point2.x,point2.y);
    ctx.lineWidth = '4';
    ctx.strokeStyle = lineColor;
    if(choosenIndexies.includes(index))
    ctx.strokeStyle = lineColorForChoosenBounds;
    if(highlitedIndexies.includes(index))
    ctx.strokeStyle = lineColorWithHighliting;

    ctx.stroke();
  }
  ctx.closePath();
}


document.querySelector("#work_area").ondragstart = function() {
  return false;
};

document.querySelector("#work_area").onmousedown = function (e) {

    // 3, перемещать по экрану
    document.querySelector("#work_area").onmousemove = function(e) {
      mouse.x = e.pageX - work_area.offsetLeft;
      mouse.y = e.pageY - work_area.offsetTop;
      if (boundParticle) {
        bound_x = boundParticle.position.x;
        bound_y = boundParticle.position.y;
        var intersection = false;
        console.log(mouse.x,mouse.y);
        if (Math.pow(mouse.x - bound_x, 2) + Math.pow(mouse.y - bound_y, 2) <= Math.pow(kBoundParticleSize, 2)) {
          for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            intersection = circle_with_line_intersection(mouse, kBoundParticleSize, line);
            if (intersection) break;
          }

          for (var i = 0; i < boundParticles.length;  i++) {
            var bound = boundParticles[i];
            if(Math.pow(bound.position.x-mouse.x,2)+Math.pow(bound.position.y-mouse.y,2) 
              <= Math.pow(kBoundParticleSize,2)){
                intersection = true;
                break;
              }
            }

          if (intersection){
            return;
          }
          console.log(mouse.x,mouse.y);
          boundParticle.position.x = mouse.x;
          boundParticle.position.y = mouse.y;
        }

      }
    };
    
  
    // 4. отследить окончание переноса
    document.querySelector("#work_area").onmouseup = function() {
      document.querySelector("#work_area").onmousemove = null;
      document.querySelector("#work_area").onmouseup = null;
    }

};

document.querySelector("#work_area").addEventListener("mousedown", function(e){ 
  if(draw_button_was_pressed) return;
  if(!stop_design_animation){
    hide_object($('.design_animation_class'),0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stop_design_animation = true;
  }
   
  mouse.x = e.pageX - work_area.offsetLeft;
  mouse.y = e.pageY - work_area.offsetTop;
  clip_points.push(new Vector(mouse.x,mouse.y));
  console.log(mouse.x,mouse.y);
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, pointSize, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fillStyle = pointColor;
  ctx.fill();
});



document.querySelector("#draw_button").addEventListener("mousedown", function(e){
  if(draw_button_was_pressed) return;
  if(!stop_design_animation){
    hide_object($('.design_animation_class'), 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stop_design_animation = true;
  }

  document.querySelector("#draw_button").style.opacity = '0.3';
  draw_button_was_pressed = true;
  for(var index = 0;index < clip_points.length;index++){
    var current_index = index,
    next_index = index ==  clip_points.length -1 ? 0: index + 1;

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

function vis_button(button, time=300, static=true){
    button.animate({opacity: 1}, time, function(){
    button.css("visibility", "visible");
    if(static)
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
  if(stop_design_animation){
    vis_object($('.design_animation_class'), 0);
    stop_design_animation = false;
    start_design_animation(ctx);
  }
});

document.querySelector("#clear_gr_button").addEventListener("mousedown", function(e){ 
  data_hist = [];
  data_time = [];
  for (var i = 0; i < particles.list.length; i++) {
    particles.list[i].lastTimeCollision = -1;
  }
});


document.querySelector("#config_button").addEventListener("mousedown", function(e){ 
  span = document.querySelector("#config_button > span");

if(!config_button_was_pressed){
  config_button_was_pressed = true;

  hide_button($('.draw_button_li'));
  hide_button($('.clear_button_li'));
  hide_button($('#bounds_config_li'));

   $('.config_button_li').css("position","absolute");
   $('.menu').css("justify-content","center");
   dif_text(span, "close");
   $('.config_button_li').animate({top: '0%'}, 200, function(){});

   vis_button($('.config_part_ranges'));
  //  vis_button($('#bounds_config_li'));

  //  static_position($('.ranges_li'));
  return;
}


config_button_was_pressed = false;
 $('.menu').css("justify-content","center");
dif_text(span, "particle config");
$('.config_button_li').animate({top: '40%'}, 300, function(){
   $('.config_button_li').css("position","static");
});


vis_button($('.draw_button_li'));
vis_button($('.clear_button_li'));
vis_button($('#bounds_config_li'));

hide_button($('.config_part_ranges'));
// absolute_position($('.ranges_li'));


});

document.querySelector(".distribution_area_right_arrow").addEventListener("mousedown", function(e){ 
  hide_object($('.distribution_statistic'),0);
  vis_object($('.time_collision'),0);
});
document.querySelector(".distribution_area_left_arrow").addEventListener("mousedown", function(e){ 
  hide_object($('.time_collision'),0);
  vis_object($('.distribution_statistic'),0);
});



document.querySelector("#bounds_config_button").addEventListener("mousedown", function(e){ 
  span = document.querySelector("#bounds_config_button > span");

if(!config_bounds_button_was_pressed){
  config_bounds_button_was_pressed = true;

  hide_button($('.draw_button_li'));
  hide_button($('.clear_button_li'));
  hide_button($('.config_button_li'));

   $('#bounds_config_li').css("position","absolute");
   $('.menu').css("justify-content","center");
   dif_text(span, "close");
   $('#bounds_config_li').animate({top: '0%'}, 200, function(){});

   vis_button($('#set_particle_li'));
   vis_button($('.config_bound_ranges'));
   vis_button($('.bounds_config_class'),time=300,static=false);
  //  vis_button($('#back_for_config'));
  //  static_position($('.ranges_li'));
  return;
}

config_bounds_button_was_pressed = false;
 $('.menu').css("justify-content","center");
dif_text(span, "bounds config");
$('#bounds_config_li').animate({top: '40%'}, 300, function(){
   $('#bounds_config_li').css("position","static");
});


vis_button($('.draw_button_li'));
vis_button($('.clear_button_li'));
vis_button($('.config_button_li'));

hide_button($('#set_particle_li'));
hide_button($('.config_bound_ranges'));
hide_button($('.bounds_config_class'));
// hide_button($('#back_for_config'));
// absolute_position($('.ranges_li'));


});






