// var descriptionButtonWasPressed = false;

typeMSU();
var page_number = 1;

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
       }, 0);
   }, 0);
}, 0);

function hide_object(object, time=300){
    object.animate({opacity: 0}, time, function(){
    object.css("visibility", "hidden");
    object.css("z-index", "0");
});
}

function vis_object_with_animation(object, time=100){
    object.animate({opacity: 1}, time, function(){
    object.css("visibility", "visible");
    object.css("z-index", "100");
});
}

hide_object($('#description > .prev_button'));

document.querySelector("#description_button").addEventListener("mousedown", function(e){ 
   vis_object_with_animation(  $('#description_view'));
   vis_object_with_animation(  $('#field_Description1'));
   page_number = 1;
      vis_object_with_animation($('#description > .next_button'));
      hide_object($('#description > .prev_button'));

   // hide_object($('.background:not(#description_view,close_button)'));
});

document.querySelector("#description > .next_button").addEventListener("mousedown", function(e){
   let there_is_next_page =  document.querySelector('#description > #field_Description'+(page_number+1).toString()) != null ? true: false;
   let need_show_button = document.querySelector('#description > #field_Description'+(page_number+2).toString()) != null ? true: false;
   if(there_is_next_page){
      hide_object($('#description > #field_Description'+page_number.toString()));
   }
   else return;
   vis_object_with_animation($('#description > .prev_button'));

   if(need_show_button)
   vis_object_with_animation($('#description > .next_button'));
   else hide_object($('#description > .next_button'));

   page_number++;
   vis_object_with_animation($('#description > #field_Description'+page_number.toString()));
   // hide_object($('.background:not(#description_view,close_button)'));
});

document.querySelector("#description > .prev_button").addEventListener("mousedown", function(e){
   let there_is_next_page =  document.querySelector('#description > #field_Description'+(page_number-1).toString()) != null ? true: false;
   let need_show_button = document.querySelector('#description > #field_Description'+(page_number-2).toString()) != null ? true: false;
   if(there_is_next_page){
       hide_object($('#description > #field_Description'+page_number.toString()));
   }
   else return;
   vis_object_with_animation($('#description > .next_button'));

   if(need_show_button)
   vis_object_with_animation($('#description > .next_button'));
   else
         hide_object($('#description > .prev_button'));
   page_number--;
   vis_object_with_animation($('#description > #field_Description'+page_number.toString()));
   // hide_object($('.background:not(#description_view,close_button)'));
});

document.querySelector("#description > .close_button").addEventListener("mousedown", function(e){ 
   hide_object(  $('#description_view'));
   hide_object(  $('.field_Description'));
   // vis_object_with_animation($('canvas'));
   //  vis_object_with_animation($('.background:not(#description_view)'));
})

