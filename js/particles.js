var canvas = document.querySelector("#work_canvas");
var ctx = canvas.getContext("2d");
var center= null;

canvas.width = document.querySelector("#work_area").offsetWidth;
canvas.height = document.querySelector("#work_area").offsetHeight;

var width = canvas.width,
  height = canvas.height;


stat_max_paticles = 1000;
collison_limit_right = 600;
time_limit_right = 10;
bins_number = 20;
use_grid = true;
polygon_area = 0.0;
line_perimetr = 0.0;
lambda = 0.0;
hist = new Histogram(bins_number, 0, time_limit_right, [d_width, d_height], collison_limit_right, use_grid);
time_plot = new TimePlot(0, 5, [tc_width, tc_height]);
stats = new Statstics();

data_hist = [];
data_time = [];
data_difftime = [];
curr_time = new Date().getTime()/1000;


function line_intersection(line1, line2) {
  function area (a, b, c) {
    return (b.x - a.x) * (c.y- a.y) - (b.y - a.y) * (c.x - a.x);
  }
 
  function intersect_1 (a, b, c, d) {
    if (a > b)  [a, b] = [b, a];
    if (c > d)  [c, d] = [d, c];
    return Math.max(a,c) <= Math.min(b,d);
  }
 
  function intersect (a, b, c, d) {
    return intersect_1(a.x, b.x, c.x, d.x)
      && intersect_1 (a.y, b.y, c.y, d.y)
      && area(a,b,c) * area(a,b,d) <= 0
      && area(c,d,a) * area(c,d,b) <= 0;
  }

  return intersect(line1.point1, line1.point2, line2.point1, line2.point2);
};


function getCentroid(arr) {
    var twoTimesSignedArea = 0;
    var cxTimes6SignedArea = 0;
    var cyTimes6SignedArea = 0;

    var length = arr.length;

    var x = function (i) { return arr[i % length].x };
    var y = function (i) { return arr[i % length].y };

    for ( var i = 0; i < arr.length; i++) {
        var twoSA = x(i)*y(i+1) - x(i+1)*y(i);
        twoTimesSignedArea += twoSA;
        cxTimes6SignedArea += (x(i) + x(i+1)) * twoSA;
        cyTimes6SignedArea += (y(i) + y(i+1)) * twoSA;
    }
    var sixSignedArea = 3 * twoTimesSignedArea;
    return new Vector(cxTimes6SignedArea / sixSignedArea, cyTimes6SignedArea / sixSignedArea);        
}

class ObjectHandler{
  setObject(object){
    this.object = object;
    setTimeout(() => {
      this.object = null;
    }, 50);
  }
  isObject(){
    return this.object != null;
  }
  checkObject(object){
    return this.object == object;
  }
}

class Particle {
  

  constructor(point, velocity, acceleration=0, color="#123", size=null, isBoundParticle=false) {
    this.position = point || new Vector(0, 0);
    this.velocity = velocity || new Vector(0, 0);
    this.acceleration = acceleration || new Vector(0, 0);
    this.lastFriend = new ObjectHandler();
    this.lastBound = new ObjectHandler();
    this.lastTimeCollision = 0;
    this.diffTimeCollsion = 0;
    this.size = size;
    this.isBoundParticle = isBoundParticle;

  }
  color(){
    if(this.isBoundParticle)
    return bound_patricle_color;
    return particleColor;
  }
  move() {
    if(this.isBoundParticle) return;
    this.position.x + this.velocity.x > width && this.velocity.x > 0 || this.position.x + this.velocity.x < 0 && this.velocity.x < 0 ? this.velocity.x *= -1 : this.velocity.x;
    this.position.y + this.velocity.y > height && this.velocity.y > 0 || this.position.y + this.velocity.y < 0 && this.velocity.y < 0 ? this.velocity.y *= -1 : this.velocity.y;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Добавить ускорение к скорости
    this.velocity.add(this.acceleration);
    // Добавить скорость к координатам
    this.position.add(this.velocity);
  };
}



class Emitter {
  constructor(point, velocity, spread) {
    this.position = point; // Вектор
    this.velocity = velocity; // Вектор
    this.spread = spread || Math.PI; // Возможный угол = скорость +/- разброс.
    this.drawColor = "#999";
    this.current_particel_index = 0;
  }
  emitParticle() {
    // Использование случайного угла для формирования потока частиц позволит нам получить своего рода «спрей»
    var angle = Math.PI*2/maxParticles*this.current_particel_index;

    this.current_particel_index++;
    // Магнитуда скорости излучателя
    var magnitude = this.velocity.getMagnitude();

    // Координаты излучателя
    var position = new Vector(this.position.x, this.position.y);

    // Обновлённая скорость, полученная из вычисленного угла и магнитуды
    var velocity = Vector.fromAngle(angle, magnitude);

    position.add(velocity.copy().norm().mult_number(particleSize));
    // Возвращает нашу Частицу!
    return new Particle(position, velocity);
  };
}


class Particles{
  constructor(particles){
    this.list = particles;
    this.intersections = false;
    setTimeout(() => {
      this.intersections = true;
    }, 5);
  }
  sort_particles(){
    this.list.sort(function(particle1, particle2){
     if(particle1.position.x < particle2.position.x){
       return -1;
     }
      return 0; 
  });
  }

  moves(){
    for (var i = 0; i < this.list.length; i++) {
      for(var vel_i = 0; vel_i < velocity;vel_i++){
      var particle = this.list[i];
      var pos = this.list.position;
      bounds_interection(particle, clip_points);
      particles_interection(i,this.list);
      
      particle.move();
     
      }
      
  }
  }
}

class Line{
  constructor(point1,point2){
        var A = point1.y-point2.y;
        var B = point2.x-point1.x;
       this.normal = new Vector(-A, -B);
       var norma = this.normal.getMagnitude();
       this.point1 = point1;
       this.point2 = point2;
       this.C = -(point1.x*point2.y-point2.x*point1.y);
       this.coaff = this.normal.y?-this.normal.x/this.normal.y:0;
       this.angle = Math.atan(this.coaff);
       this.sin = Math.sin(this.angle);
       this.cos = Math.cos(this.angle);


  }
  getA(){
    return this.normal.x;
  }
  getB(){
    return this.normal.y;
  }
  getC(){
    return this.C;
  }
  getCoaff(){
    return this.coaff;
  }
  getSin(){
    return this.sin;
  }
  getCos(){
    return this.cos;
  }
}

function set_lines(clip_points){
  var lines = [];
    for(var index = 0;index < clip_points.length;index++){
    var current_index = index,
    next_index = index ==  clip_points.length -1 ? 0:index + 1;
    var point1 = clip_points[current_index],
        point2 = clip_points[next_index];
        lines.push(new Line(point1,point2));
    }
    
    polygon_area = calc_area(clip_points);
    line_perimetr = calc_perimetr(clip_points);

    return lines;
}



function circle_with_line_intersection(center, radius, line){

        var distance = Math.abs(line.getA()*center.x+line.getB()*center.y+line.C)/line.normal.getMagnitude();
        var y,x;
        const x_sign = Math.sign(line.getA()),
              y_sign = Math.sign(line.getB());

        if(line.getA() != 0 || line.getB() != 0)
        y = (line.getA()*line.getA()*center.y-line.getA()*line.getB()*center.x-line.getB()*line.getC())/
          (line.getA()*line.getA()+line.getB()*line.getB())
        ;
        else y = center.y;

        if(line.getA() != 0)
        x = -(line.getC()+y*line.getB())/line.getA();
        else  x = center.x;



        var r_x = radius*Math.abs(line.getCos());
        var r_y = radius*Math.abs(line.getSin());
        r_x = r_x < 0.01 ? 0.01:r_x;
        r_y = r_y < 0.01 ? 0.01:r_y;

        // if(line.getA() == 0){
        //   console.log(x,y);
        //   console.log("LINE:"," --X:",line.point1.x,line.point2.x," --Y:",line.point1.y,line.point2.y);

        //   console.log("CONDITIONS:",
        //   (x >= line.point1.x-r_x && x <= line.point2.x+r_x),
        //   (y >= line.point1.y-r_y && y <= line.point2.y + r_y),
        //   (y >= line.point1.y-r_y && y <= line.point2.y + r_y),
        //   (y <= line.point1.y+r_y && y >= line.point2.y-r_y))
        // }


  
      if(((x >= line.point1.x-r_x && x <= line.point2.x+r_x)||
     (x <= line.point1.x+r_x && x >= line.point2.x - r_x))&&
    ((y >= line.point1.y-r_y && y <= line.point2.y + r_y)||
     (y <= line.point1.y+r_y && y >= line.point2.y-r_y))){
      if(radius >= distance){
        return true;
      }
     }
 
     
 
  return false;
}



function bounds_interection(particle, clip_points) {
    for (var i = 0; i < lines.length;  i++) {
          var line = lines[i];
          var intersection = circle_with_line_intersection(particle.position, particleSize, line);

          if(intersection){
              particle.velocity.reflection(line.normal);
              if(choosenIndexies.includes(i)) {
                const current_time = new Date().getTime() / 1000;
                if (current_time - particle.lastTimeCollision > 0.01) {
                  data_time.push(current_time);
                  particle.diffTimeCollsion = current_time - particle.lastTimeCollision;
                  data_hist.push(particle.diffTimeCollsion);
                  particle.lastTimeCollision = current_time;
                }
              }
              return;
          }
      }
  }

  function get_random_color(){
    var color = "rgb(#1,#2,#3)";
    for(var i=1;i<=3;i++)
      color =color.replace("#"+i.toString(),Math.floor(255*Math.random()).toString());
    return color;
  }


function particles_interection(particle_number, particles){
  var particle = particles[particle_number];

  
  for(var i=0;i<particles.length;i++){
    if(i == particle_number){
      continue;
    }
    var next_particle = particles[i];
    var isBounds = next_particle.isBoundParticle + particle.isBoundParticle;
    var bound_part = isBounds ? (next_particle.isBoundParticle ? next_particle:particle) : null;
    var non_bound_part = isBounds ? (next_particle.isBoundParticle ? particle:next_particle):null;

    var distance = new Vector(particle.position.x - next_particle.position.x,
                              particle.position.y - next_particle.position.y);
    let magn = distance.getMagnitude();
    distance = isBounds ? kBoundParticleSize +particleSize : null;
    if((!isBounds &&
       magn <= 1.7*particleSize) ||
       (isBounds &&
        magn <= distance )){
  

       var norm = next_particle.position.copy().sub(particle.position);
       particle.velocity.reflection(norm);
       norm.mult_number(-1);
       next_particle.velocity.reflection(norm);
       particle.move();
       next_particle.move();
        if(isBounds){
                  bound_patricle_color = get_random_color();
                 const current_time = new Date().getTime()/1000;
                 if (current_time - particle.lastTimeCollision > 0.01) {
                   data_time.push(current_time);
                   non_bound_part.diffTimeCollsion = current_time - non_bound_part.lastTimeCollision;
                   non_bound_part.lastTimeCollision = current_time;
                   data_hist.push(non_bound_part.diffTimeCollsion);
                 }
        }
        
       return;
    }
  }
 

}

// Добавим один излучатель с координатами `100, 230` от начала координат (верхний левый угол)
// Начнём излучать на скорости `2` в правую сторону (угол `0`)







function addNewParticles() {
  // прекращаем, если достигнут предел
  if (particles.list.length == maxParticles+kBoundParticleSet) return;
  if (particles.list.length > maxParticles + kBoundParticleSet){
   var popped_particle = particles.list.pop();
   if(popped_particle == boundParticle){
     particles.list.pop();
     particles.list.push(boundParticle);
   }
   return;
  }
  // запускаем цикл по каждому излучателю
  for (var i = 0; i < emitters.length; i++) {

    // согласно emissionRate, генерируем частицы
    for (var j = 0; j < emissionRate; j++) {
      particles.list.push(emitters[i].emitParticle());
    }

  }
}




function addBoundParticle(){

  if(kBoundParticleSet) return;
  kBoundParticleSet = true;
  var position = new Vector(center.x,center.y-(particleSize+kBoundParticleSize)*2);
  var velocity = new Vector(0,0);
  boundParticle = new Particle(position, velocity, 0, color=bound_patricle_color,size=kBoundParticleSize,isBoundParticle=true);
  particles.list.push(boundParticle);
}


function start(){
vis_object($('#distribution_area> .distribution_statistic'), 0);
vis_object($('#distribution_area> .distribution_area_common'), 0);
hide_object($('#console'));
function update() {
  addNewParticles();
  if(kBoundParticle)
  addBoundParticle();
  plotParticles(canvas.width, canvas.height);
}

  function plotParticles(boundsX, boundsY) {
  particles.moves();
}


function draw() {
  // Задаём цвет частиц

  ctx.fillStyle = 'rgb(0,125,255)';

  curr_time = new Date().getTime()/1000;
  var delTo = 0;
  for (var i = 0; i < data_time.length; ++i) {
    if (curr_time - data_time[i] >= time_plot.get_right_limit() - 0.05) {
      delTo = i;
      break;
    }
  }
  data_time.splice(0, delTo);
  data_difftime = data_time.slice();
  if (data_hist.length > stat_max_paticles) {
    data_hist.splice(0, data_hist.length - stat_max_paticles);
  }
  for (var i = 0; i < data_difftime.length; ++i) {
    data_difftime[i] = curr_time - data_difftime[i];
  }

  // Запускаем цикл, который отображает частицы
  for (var i = 0; i < particles.list.length; i++) {

    var position = particles.list[i].position;

    ctx.fillStyle = particles.list[i].color();
    size =  particles.list[i].isBoundParticle ?  kBoundParticleSize : particleSize;
    // data_hist.push(particles.list[i].diffTimeCollsion);
    // data_hist.push(nowTime - particles.list[i].lastTimeCollision);
    // if (nowTime - particles.list[i].lastTimeCollision < 0.0001 / Math.log2(30 * velocity + 2)) {
    //   data_time.push(particles.list[i].lastTimeCollision);
    // }
    // Рисуем квадрат определенных размеров с заданными координатами
    ctx.beginPath();
    ctx.arc(position.x, position.y,size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
  draw_lines();

  line_perimetr = calc_perimetr(clip_points);
  lambda = line_perimetr * velocity / (Math.PI * (polygon_area + 1e-5));

  // hist.setMaxParticles(particles.list.length - kBoundParticleSet);
  // hist.setMaxParticles(collison_limit_right);
  hist.draw(data_hist);
  time_plot.draw(data_difftime);
  stats.draw(data_hist);
}


function loop() {
  if(stop)return;
  clear();
  update();
  draw();
  queue();
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}


function queue() {
  window.requestAnimationFrame(loop);
}

  stop = false;
  center = getCentroid(clip_points);
  lines = set_lines(clip_points);
  // var isIntersected = false;
  // for (var i = 0; i < lines.length && !isIntersected; i++) {
  //   for (var j = 0; j < lines.length && !isIntersected; j++) {
  //     if (j != i && (j + 1) % lines.length != i && (j - 1 + lines.length) % lines.length != i) {
  //       isIntersected = line_intersection(lines[i], lines[j]);
  //       if (isIntersected) {
  //         break;
  //       }
  //     }
  //   }
  // }
  // if (isIntersected) {
  //   typeErrorPoligon();
  // }
  emitters = [new Emitter(center, Vector.fromAngle(0, 0.02))];
  particles = new Particles([]);
  loop();
}

function line_highlighting(line){
    var point1 = line.point1,
    point2 = line.point2;

    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);

    ctx.lineTo(point2.x,point2.y);
    ctx.lineWidth = '10';
    ctx.strokeStyle = '#05e6ee';
    ctx.stroke();
    ctx.closePath();
  
}


function lineHighliting(e){
     var mouse = new Vector(0,0);
   mouse.x = e.pageX - work_area.offsetLeft;
   mouse.y = e.pageY - work_area.offsetTop;
   var needHighliting = false;
   var savedIndex = null;
    for (var i = 0; i < lines.length;  i++) {
          var line = lines[i];
          var intersection = circle_with_line_intersection(mouse,10,line);


          if(intersection){
              needHighliting = true;
              savedIndex = i;
          }
      }
    return {'condition':needHighliting,'index':savedIndex};
}

canvas.addEventListener("mousemove", function(e){ 
    var result = lineHighliting(e);
    if(result['condition'] && !lineHasJustChoosen)
    highlitedIndexies.push(result['index']);
    else{
      lineHasJustChoosen = false;
      highlitedIndexies = [];
      }
});
canvas.addEventListener("mousedown", function(e){ 
    var result = lineHighliting(e);
    if(result['condition']){
      const element = result['index'];
      if(choosenIndexies.includes(element)){
        const index = choosenIndexies.indexOf(element);
        choosenIndexies.splice(index,1);
        highlitedIndexies = [];
        lineHasJustChoosen = true;
      }
      else{
        choosenIndexies.push(element);
        highlitedIndexies = [];
        lineHasJustChoosen = true;
      }
    }
});



document.querySelector("#set_particle_button").addEventListener("mousedown", function(e){ 
   span = document.querySelector("#set_particle_button > span");
  if(!kBoundParticle){
kBoundParticle = true;
kBoundParticleSet = false;

  dif_text(span, "unset scatterer");
return;
  }
  

  dif_text(span, "set scatterer");
  kBoundParticle = false;
  kBoundParticleSet = false;
  particles.list.splice(particles.list.indexOf(boundParticle),1);
});


document.querySelector("#highlighting1").addEventListener("mousedown", function(e){ 
  restart();
  clip_points = [ [70,5], [90,41], [136,48], [103,80], [111,126], [70,105], [29,126], [36,80], [5,48], [48,41]];
  for(var i=0;i<clip_points.length;i++)
  clip_points[i] = new Vector(clip_points[i][0],clip_points[i][1]);

  let add_vector = new Vector(
    canvas.width/2 -70,
  canvas.height/2-40);
    let coafficient = canvas.width/140;

    for(var i=0;i<clip_points.length;i++){
      // clip_points[i] = clip_points[i].add(add_vector);
      clip_points[i] = clip_points[i].mult_number(coafficient);
    }
    ;

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


document.querySelector("#highlighting2").addEventListener("mousedown", function(e){ 
  restart();
  clip_points = [ [20,0],[0, 20], [30, 50], [0,80],[ 20,100], [50, 70],[80, 100], [100, 80],[ 70,50], [100, 20], [80, 0], [50,30]].reverse();
  for(var i=0;i<clip_points.length;i++)
  clip_points[i] = new Vector(clip_points[i][0],clip_points[i][1]);

  let add_vector = new Vector(
    canvas.width/35,
  canvas.height/35);
    let coafficient = canvas.width/140;

    for(var i=0;i<clip_points.length;i++){
      clip_points[i] = clip_points[i].add(add_vector);
      clip_points[i] = clip_points[i].mult_number(coafficient);
    }
    ;

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


document.querySelector("#highlighting3").addEventListener("mousedown", function(e){ 
  restart();
  clip_points =[[ -5.5 ,  15.  ],
  [ 94.5 ,  15.  ],
  [ 94.5 ,  65.  ],
  [ 50.75,  65.  ],
  [ 75.75, 102.5 ],
  [ 13.25, 102.5 ],
  [ 38.25,  65.  ],
  [ -5.5 ,  65.  ]];
  for(var i=0;i<clip_points.length;i++)
  clip_points[i] = new Vector(clip_points[i][0],clip_points[i][1]);

  let add_vector = new Vector(
    canvas.width/35,
  canvas.height/35);
    let coafficient = canvas.width/140;

    for(var i=0;i<clip_points.length;i++){
      clip_points[i] = clip_points[i].add(add_vector);
      clip_points[i] = clip_points[i].mult_number(coafficient);
    }
    ;

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

function calc_area(points){
  var area = 0;
  for (var i = 0; i < points.length; i++) {
    area += points[i].x * points[(i + 1) % points.length].y;
  }
  for (var i = 0; i < points.length; i++) {
    area -= points[(i + 1) % points.length].x * points[i].y;
  }
  area = 0.5 * Math.abs(area);
  return area;
}

function calc_perimetr(points) {
  var p = 0;
  if (points.length == 1) {
    return 0;
  } else if (points.length == 2) {
    if (choosenIndexies.includes(0)) {
      return Math.sqrt((points[0].x - points[1].x) * (points[0].x - points[1].x) + (points[0].y - points[1].y) * (points[0].y - points[1].y));
    } else {
      return 0;
    }
  }
  for (var i = 0; i < points.length; i++) {
    if (choosenIndexies.includes(i)) {
      p += Math.sqrt(Math.pow(points[i].x - points[(i + 1) % points.length].x, 2) + Math.pow(points[i].y - points[(i + 1) % points.length].y, 2));
    }
  }
  return p;
}
