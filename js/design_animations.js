function start_design_animation(context){
work_area = document.querySelector("#work_area");

   var start_angle = 0;
   var end_angle = 4;
   var step = 0.01;
   var context = context;
   var colored_vertices_coafficient = 0;
   var clockwise_indexies = [];
   var unclockwise_indexies = [];

 draw = function(){
   var x = work_area.offsetWidth/100*15;
   var y1 = work_area.offsetHeight/100*15,
   y2 = work_area.offsetHeight*55/100,
   radius = work_area.offsetWidth/100*10;

  // draw_circle_arrow(context, new Vector(x,y1), radius, true);
  // draw_circle_arrow(context, new Vector(x,y2), radius, false);
  draw_polygon(context, new Vector(x,y1));
  draw_polygon(context, new Vector(x,y2), false);
}

 update = function () {
  start_angle += step;
  end_angle += step;
  colored_vertices_coafficient += step*4;
}

 clear = function () {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

 queue = function () {
  window.requestAnimationFrame(loop);
}

 function draw_polygon(context, position,clockwise=true, color='#000'){
  context.strokeStyle = '#000';
  context.fillStyle = '#000';
  context.lineWidth = 3;

  var coordinats = [new Vector(0,0),
  new Vector(-4,4),
  new Vector(-1,5),
  new Vector(6,3),
  new Vector(7,-0.4),
  new Vector(-1,-7),
  new Vector(0,0)
  ];

  

  const colored_vertices = Math.trunc(colored_vertices_coafficient) % coordinats.length;

  if(clockwise_indexies.includes(coordinats.length-1))
    clockwise_indexies = [];
  if(unclockwise_indexies.includes(0))
    unclockwise_indexies = [];
  
  console.log(clockwise_indexies.length);

  unclockwise_indexies.push(coordinats.length-1 - colored_vertices);
  clockwise_indexies.push(colored_vertices);

  var init_position = new Vector(position.x, position.y);
   const radius = work_area.offsetWidth/100*1;
  for(var index=1;index<coordinats.length;index++){
    const current_coordinat = coordinats[index];

    position.x = position.x+work_area.offsetWidth/100*coordinats[index-1].x;
    position.y = position.y+work_area.offsetHeight/100*coordinats[index-1].y;

  if(clockwise)
  context.strokeStyle = clockwise_indexies.includes(index) ? '#fff':"#000";
  else
  context.strokeStyle = unclockwise_indexies.includes(index) ? '#fff':"#000";
  
  context.fillStyle = context.strokeStyle;
   context.beginPath();
   context.arc(position.x, position.y, radius, 0,Math.PI*2);
   context.fill();
   context.stroke();

   context.moveTo(position.x, position.y);

   position = coordinats.length-1 == index ? init_position:position;

   var x = position.x+work_area.offsetWidth/100*current_coordinat.x;
   var y = position.y+work_area.offsetHeight/100*current_coordinat.y;

  context.lineWidth = radius;
   context.lineTo(x,y);
   context.stroke();



  }

  context.strokeStyle = "#fff";
  context.fillStyle = context.strokeStyle;

    context.beginPath();
   context.arc(init_position.x, init_position.y, radius, 0,Math.PI*2);
   context.fill();
   context.stroke();

  //  context.moveTo(position.x, position.y);
  //  var x = position.x+work_area.offsetWidth/100*current_coordinat.x;
  //  var y = position.y+work_area.offsetHeight/100*current_coordinat.y;

  // context.lineWidth = 7;
  //  context.lineTo(init_position.x,init_position.y);
  //  context.stroke();




 }

 function draw_circle_arrow(context, position, radius, clockwise, color='#000'){


  current_start_angle = clockwise ? start_angle: -start_angle-1.2;
  current_end_angle = clockwise ? end_angle: -end_angle;

  context.beginPath();
  context.strokeStyle = '#05e6eebd';
  context.lineWidth = '3';
  context.arc(position.x, position.y, radius, current_start_angle,current_end_angle);
 

  // context.beginPath();

  // context.lineTo((radius-10)*Math.cos(end_angle-0.2)+position.x,(radius-10)*Math.sin(end_angle-0.2)+position.y);
  // context.stroke();

  var angle_for_arrow = clockwise ? current_end_angle: current_start_angle;
  var offset_from_top = clockwise? -0.2 : 0.2;
  var offset_from_top_angle = clockwise? 0.05 : -0.05;


  context.moveTo((radius)*Math.cos(angle_for_arrow+offset_from_top_angle)+position.x,(radius)*Math.sin(angle_for_arrow+offset_from_top_angle)+position.y);
  context.lineTo((radius+10)*Math.cos(angle_for_arrow+offset_from_top)+position.x,(radius+10)*Math.sin(angle_for_arrow+offset_from_top)+position.y);
  context.stroke();

  context.moveTo((radius)*Math.cos(angle_for_arrow+offset_from_top_angle)+position.x,(radius)*Math.sin(angle_for_arrow+offset_from_top_angle)+position.y);
  context.lineTo((radius-10)*Math.cos(angle_for_arrow+offset_from_top)+position.x,(radius-10)*Math.sin(angle_for_arrow+offset_from_top)+position.y);
  context.stroke();

  
      // pic       = new Image();              // "Создаём" изображение
      // pic.src    = '../data/arrow.png';  // Источник изображения, позаимствовано на хабре
      // pic.onload = function() {    // Событие onLoad, ждём момента пока загрузится изображение
      //     // Рисуем изображение от точки с координатами 0, 0
      // }
      // ctx.rotate(step);
      // context.drawImage(pic, 50, 50, 200, 200);
      
      
  // context.lineTo((radius+10)*Math.cos(end_angle-0.2)+position.x,(radius+10)*Math.sin(end_angle-0.2)+position.y);
  // context.stroke();

  // context.lineTo((radius+10)*Math.cos(end_angle)+position.x,(radius+10)*Math.sin(end_angle)+position.y);

  
}

loop = function () {
  if(stop_design_animation)return;
  clear();
  update();
  draw();
  queue();
}

loop();
}


start_design_animation(ctx);

