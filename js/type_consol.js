

$('#console').typeIt({
  speed: 50,
  autoStart: true,
  html: true
})
  .tiType('<text style="color: #05eea8;">Lets</text>')
  .tiPause(400)
  .tiDelete(2)
  .tiType('<text style="color: #05eea8;">t\'s </text>')
  .tiType('<text style="color: #05eea8">get</text>')
  .tiType('<text style="color: #000"> started!</text>')

function typeClear(elem){
  elem.typeIt().tiEmpty();
}



function type_mean_value(new_mean){
  $('#mean').typeIt({
  speed: 50,
  autoStart: true,
  html: true
  })
  .tiDelete(1)
  .tiType('<text style="color: #05eea8;">'+new_mean+'</text>')
}

function type_mean(new_mean){
  $('#mean').typeIt({
  speed: 50,
  autoStart: true,
  html: true
  })
  .tiType('<text style="color: #05eea8;">mean: 0.000</text>')
}
function type_std_value(new_std){
  console.log(new_std);
  $('#std').typeIt({
  speed: 0,
  autoStart: false,
  html: true
  })
  .tiType('<text style="color: #05eea8;">0.153</text>')
}

function type_std(new_mean){
  $('#std').typeIt({
  speed: 50,
  autoStart: true,
  html: true
  })
  .tiType('<text style="color: #05eea8;">std: 0.000</text>')
}

function typeErrorPoligon() {
$('#console').typeIt({
  speed: 50,
  autoStart: false,
  html: true
})
  .tiType('<text style="color: rgba(5,230,238,0.74); font-size: 100%;">Poligon should be without intersections!</text>');
}


