typeMSU();

function hide_object(object, time=300){
    object.animate({opacity: 0}, time, function(){
    object.css("visibility", "hidden");
});
}


setTimeout(() => {
   hide_object($("#msu_background"));
   typeCMC();
   setTimeout(() => {
     hide_object($("#cmc_background"));
      typeNameVlad();
      typeNameAnya();
      typeNamePasha();

      typeLeftDescription();
      rightDescription();
   }, 2500);
}, 2000);

