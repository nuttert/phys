

$('#console').typeIt({
  speed: 50,
  autoStart: true,
  html: true
})
  .tiType('<text style="color: #05eea8;">Lets</text>')
  .tiPause(400)
  .tiDelete(2)
  .tiType('<text style="color: #05eea8;">ts </text>')
  .tiType('<text style="color: #05eea8">get</text>')
  .tiType('<text style="color: #000"> started!</text>')

  function typeClear(elem){
    elem.typeIt().tiEmpty();
  }

  function typeErrorPoligon() {
  $('#console').typeIt({
    speed: 50,
    autoStart: false,
    html: true
  })
    .tiType('<text style="color: #05e6eebd; font-size: 100%;">Poligon should be without intersections!</text>');
}


