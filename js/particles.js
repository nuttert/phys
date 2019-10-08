
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");


canvas.width = document.querySelector("#work_area").offsetWidth;
canvas.height = document.querySelector("#work_area").offsetHeight;

var width = canvas.width,
  height = canvas.height;
var maxParticles = 5; // Эксперимент! 20 000 обеспечит прекрасную вселенную
var emissionRate = 5; // количество частиц, излучаемых за кадр
var particleSize = 10;
var particleColor = "#123";
var velocity = 2;

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
    for (var i = 0, j = clip_points.length - 1; i < clip_points.length; j = i++) {
        var xi = clip_points[i].x, yi = clip_points[i].y;
        var xj = clip_points[j].x, yj = clip_points[j].y;

        var common_intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
          
        if (common_intersect)
          inside = !inside;
        if(!intersection_with_vector){
           intersection_with_vector = vec_intersection(
             particle.position, direction_vector,
            new Vector(xi,yi), new Vector(xj,yj));

          if(intersection_with_vector){
          save_i = i;
          save_j = j;
        }
        }
        
    }
    if(!inside){
      //   if(save_i && save_j){
      //   var xi = clip_points[save_i].x, yi = clip_points[save_i].y;
      //   var xj = clip_points[save_j].x, yj = clip_points[save_j].y;


      //  var intersection_line_normal = new Vector(1/(xj-xi),-1/(yj-yi));
      //  var angle = particle.velocity.angleWithVector(intersection_line_normal);
      //  console.log(angle);
      //  if(angle)
      //  particle.velocity.rotate(-2*angle);
      //   }
       particle.velocity.redirection();
       particle.move();
    }
};

// function bounds_interection(particle, bounds_funcs){
//     for(var i=0;i<bounds_funcs.length;i++){
//       var func = bounds_funcs[i];
//       if(func(particle.position.x, particle.position.y) <= 0){
//        console.log("REVVV");
//        particle.velocity.x *= -1;
//        particle.velocity.y *= -1;
//       }
//     }
// }


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

       particle.velocity.x *= -1;
       particle.velocity.y *= -1;
    
       next_particle.velocity.x *= -1;
       next_particle.velocity.y *= -1;
       particle.lastFriend.setObject(next_particle);
       next_particle.lastFriend.setObject(particle);
       return;
    }
  }

}

var particles = new Particles([]);

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
  // Новый массив для частиц внутри холста


  particles.moves();
  

  // Замена глобального массива частиц на массив без вылетевших за пределы холста частиц
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
  emitters = [new Emitter(center, Vector.fromAngle(0, velocity))];
  loop();
}

// loop();





