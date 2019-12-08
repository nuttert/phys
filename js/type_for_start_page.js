  function typeNameVlad() {
  $('#Vlad .text h1').typeIt({
    speed: 50,
    autoStart: false,
    html: true
  })
    .tiType('<text style="color: #05e6eebd; font-size: 2.5vmin;">Vladislav Markov</text>');
}
  function typeNameAnya() {
  $('#Anya .text h1').typeIt({
    speed: 50,
    autoStart: false,
    html: true
  })
    .tiType('<text style="color: #ee05a9; font-size: 2.5vmin;">Anna Balakova</text>');
}
  function typeNamePasha() {
  $('#Pasha .text h1').typeIt({
    speed: 50,
    autoStart: false,
    html: true
  })
    .tiType('<text style="color: #05eea8; font-size: 2.5vmin;">Pavel Shvets</text>');
}
  function typeNameChich() {
  $('#Chich .text h1').typeIt({
    speed: 50,
    autoStart: false,
    html: true
  })
    .tiType('<text style="color: #430b15; font-size: 2.5vmin;">Chichigina O.A.</text>');
}

  function typeLeftDescription() {
  $('#left_description').typeIt({
    speed: 50,
    autoStart: false,
    html: true
  })
  .tiType('<text style="color: #fc5fa3; font-size: 3.5vmin;">Sub-poissonian</text>')
  .tiPause(400)
  .tiDelete(2)
  .tiType('<text style="color: #fc5fa3;font-size: 3.5vmin">an</text>')
  .tiType('<text style="color: #fff"> and</text>')
  .tiBreak()
  .tiType('<text style="color: #05e6eebd"> super-poissonian</text>')
  .tiType('<text style="color: #fff"> statistics</text>')

}
  function rightDescription() {
  $('#right_description').typeIt({
    speed: 50,
    autoStart: false,
    html: true
  })
    .tiType('<text style="color: #fff; font-size: 3vmin;">Billiard Modeling</text>');
}

  function typeMSU() {
  $('#msu_background > .description').typeIt({
    speed: 50,
    autoStart: false,
    html: true
  })
    .tiType('<text style="color: #000; font-size: 3vmin;">Moscow State University</text>');
}
  function typeCMC() {
  $('#cmc_background > .description').typeIt({
    speed: 30,
    autoStart: false,
    html: true
  })
    .tiType('<text style="color: #000; font-size: 3vmin;">Faculty of Computational Mathematics and Cybernetics</text>');
}

  function typePHYS() {
  $('#phys_background > .description').typeIt({
    speed: 30,
    autoStart: false,
    html: true
  })
    .tiType('<text style="color: #000; font-size: 3vmin;">Faculty of Physics</text>');
}

