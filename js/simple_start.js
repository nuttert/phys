  // restart();

  kBoundParticle = true;
  kBoundParticleSet = false;
  document.querySelector("#draw_button").style.opacity = '0.3';
  draw_button_was_pressed = true;
  hide_object($('.design_animation_class'),0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stop_design_animation = true;

  clip_points =[[ -5.5 ,  15.  ],
  [ 94.5 ,  15.  ],
  [ 94.5 ,  65.  ],
  [ 50.75,  65.  ],
  [ 75.75, 102.5 ],
  [ 13.25, 102.5 ],
  [ 38.25,  65.  ],
  [ -5.5 ,  65.  ]];

  choosenIndexies.push(3);
  choosenIndexies.push(4);
  choosenIndexies.push(5);

  set_lines(clip_points);
  for(var i=0;i<clip_points.length;i++)
  clip_points[i] = new Vector(clip_points[i][0],clip_points[i][1]);

  let add_vector = new Vector(
    canvas.width/35,
  canvas.height/35);
    let coafficient = canvas.width/140;

    for(var i=0;i<clip_points.length;i++){
      clip_points[i] = clip_points[i].add(add_vector);
      clip_points[i] = clip_points[i].mult_number(coafficient);
    };




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

