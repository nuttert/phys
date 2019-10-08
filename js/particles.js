
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");


canvas.width = document.querySelector("#work_area").offsetWidth;
canvas.height = document.querySelector("#work_area").offsetHeight;

var width = canvas.width,
  height = canvas.height;
var maxParticles = 10; // Эксперимент! 20 000 обеспечит прекрасную вселенную
var emissionRate = 10; // количество частиц, излучаемых за кадр
var particleSize = 10;
var particleColor = "#123";
var velocity = 20;

var emitters = [];


function getCentroid(arr) {
    var twoTimesSignedArea = 0;
    var cxTimes6SignedArea = 0;
    var cyTimes6SignedArea = 0;

    var length = arr.length

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
  

  constructor(point, velocity, acceleration) {
    this.position = point || new Vector(0, 0);
    this.velocity = velocity || new Vector(0, 0);
    this.acceleration = acceleration || new Vector(0, 0);
    this.lastFriend = new ObjectHandler();
    this.lastBound = new ObjectHandler();
  }
  move() {
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
  }
  emitParticle() {
    // Использование случайного угла для формирования потока частиц позволит нам получить своего рода «спрей»
    var angle = this.velocity.getAngle() + this.spread - (Math.random() * this.spread * 2);

    // Магнитуда скорости излучателя
    var magnitude = this.velocity.getMagnitude();

    // Координаты излучателя
    var position = new Vector(this.position.x, this.position.y);

    // Обновлённая скорость, полученная из вычисленного угла и магнитуды
    var velocity = Vector.fromAngle(angle, magnitude);

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
    }, 4/velocity*1000);
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
      if(this.intersections){
        // particles_interection(i,this.list);
      }
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
       this.point = point1;
       this.C = -(point1.x*point2.y-point2.x*point1.y);
        console.log(this);
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
    return lines;
}



function circle_with_line_intersection(center, line){
  var distance = Math.abs(line.getA()*center.x+line.getB()*center.y+line.C)/line.normal.getMagnitude();
  if(particleSize >= distance) return true;
  return false;
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

function bounds_interection(particle, clip_points) {
    var direction_vector = particle.position.copy();
    direction_vector.add(particle.velocity.copy().norm().mult_number(particleSize));

    var x =  direction_vector.x, y = direction_vector.y;
    var save_i = 0, save_j = 0;
    var inside = false;
    var intersection_with_vector = false;

  for (var i = 0; i < lines.length;  i++) {
        var line = lines[i];
        var intersection = circle_with_line_intersection(particle.position, line);
        if(intersection){
            particle.velocity.reflection(line.normal);
            return;
        }
    }
  }

  


function particles_interection(particle_number, particles){
  var particle = particles[particle_number];

  
  
  for(var i=0;i<particles.length;i++){
    if(i == particle_number){
      continue;
    }
    var next_particle = particles[i];

    if(particle.lastFriend.checkObject(next_particle)){
      continue;
    }
    var distance = new Vector(particle.position.x - next_particle.position.x,
                              particle.position.y - next_particle.position.y);
    if(distance.getMagnitude() <= 1.2*particleSize){

       particle.velocity.redirection();
    
       next_particle.velocity.redirection();
      //  particle.lastFriend.setObject(next_particle);
      //  next_particle.lastFriend.setObject(particle);
       return;
    }
  }

}

var particles = new Particles([]);
var lines = [];
// Добавим один излучатель с координатами `100, 230` от начала координат (верхний левый угол)
// Начнём излучать на скорости `2` в правую сторону (угол `0`)



function update() {
  addNewParticles();
  plotParticles(canvas.width, canvas.height);
}



function addNewParticles() {
  // прекращаем, если достигнут предел
  if (particles.list.length > maxParticles) return;

  // запускаем цикл по каждому излучателю
  for (var i = 0; i < emitters.length; i++) {

    // согласно emissionRate, генерируем частицы
    for (var j = 0; j < emissionRate; j++) {
      particles.list.push(emitters[i].emitParticle());
    }

  }
}



function plotParticles(boundsX, boundsY) {
  particles.moves();
}


function draw() {
  // Задаём цвет частиц
  ctx.fillStyle = 'rgb(0,125,255)';

  // Запускаем цикл, который отображает частицы
  for (var i = 0; i < particles.list.length; i++) {
    var position = particles.list[i].position;
    // Рисуем квадрат определенных размеров с заданными координатами
    ctx.beginPath();
    ctx.arc(position.x, position.y, particleSize, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = particleColor;
    ctx.fill();
  }
    for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    // Рисуем квадрат определенных размеров с заданными координатами
    var point1 = line.point,
        point2 = line.normal.copy().add(point1);

    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);

    ctx.lineTo(point2.x,point2.y);
    ctx.lineWidth = '2';
    ctx.strokeStyle = '#000';
    ctx.stroke();
  }
  draw_lines();
}


function loop() {
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

function start(){
  var center = getCentroid(clip_points);
  lines = set_lines(clip_points);
  emitters = [new Emitter(center, Vector.fromAngle(0, 0.2))];
  loop();
}

// loop();





