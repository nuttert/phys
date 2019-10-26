typeMSU();

function hide_object(object, time=300){
    object.animate({opacity: 0}, time, function(){
    object.css("visibility", "hidden");
});
}


setTimeout(() => {
   hide_object($("#msu_background"));
        typePHYS();
  

   setTimeout(() => {
      hide_object($("#phys_background"));
       typeCMC();
     setTimeout(() => {
       hide_object($("#cmc_background"));
      typeNameChich();
      typeNameVlad();
      typeNameAnya();
      typeNamePasha();

      typeLeftDescription();
      rightDescription();
       }, 2500);
   }, 2500);
}, 2500);

