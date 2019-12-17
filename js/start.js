// var descriptionButtonWasPressed = false;
hide_object($("#right_description"));
typeMSU();
var page_number = 1;
var isDescription = false;

function hide_object(object, time=300){
    object.animate({opacity: 0}, time, function(){
    object.css("visibility", "hidden");
});
}


setTimeout(() => {
   hide_object($("#msu_background"));
   hide_object($("#msu_background > .description"));
        typePHYS();

   setTimeout(() => {
      hide_object($("#phys_background"));
      hide_object($("#phys_background > .description"));
       typeCMC();
     setTimeout(() => {
       hide_object($("#cmc_background"));
       hide_object($("#cmc_background > .description"));
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

hide_object($('.description_section > .prev_button'));

document.querySelector("#description_button").addEventListener("mousedown", function(e){ 
   vis_object_with_animation(  $('.description_view'));
   vis_object_with_animation(  $('#field_Description1'));
   page_number = 1;
   isDescription = true;
      vis_object_with_animation($('.description_section > .next_button'));
      hide_object($('.description_section > .prev_button'));
   
   // hide_object($('.background:not(.description_view,close_button)'));
});

document.querySelector("#doc_button").addEventListener("mousedown", function(e){ 
   vis_object_with_animation(  $('.description_view'));
   vis_object_with_animation(  $('#field_Description3'));
   page_number = 3;
   isDescription = false;
   hide_object($('.description_section > .next_button'),0);
   hide_object($('.description_section > .prev_button'),0);
   hide_object($('.description_section > #field_Description1'),0);
   // hide_object($('.background:not(.description_view,close_button)'));
});

document.querySelector(".description_section > .next_button").addEventListener("mousedown", function(e){
   let there_is_next_page =  document.querySelector('.description_section > #field_Description'+(page_number+1).toString()) != null ? true: false;
   let need_show_button = document.querySelector('.description_section > #field_Description'+(page_number+2).toString()) != null ? true: false;
   if(there_is_next_page){
      hide_object($('.description_section > #field_Description'+page_number.toString()));
   }
   else return;
   vis_object_with_animation($('.description_section > .prev_button'));

   if(need_show_button)
   vis_object_with_animation($('.description_section > .next_button'));
   else hide_object($('.description_section > .next_button'));

   page_number++;
   vis_object_with_animation($('.description_section > #field_Description'+page_number.toString()));
   if(isDescription){
      hide_object($('.description_section > .next_button'),0);
   }
 
   // hide_object($('.background:not(.description_view,close_button)'));
});

document.querySelector(".description_section > .prev_button").addEventListener("mousedown", function(e){
   let there_is_next_page =  document.querySelector('.description_section > #field_Description'+(page_number-1).toString()) != null ? true: false;
   let need_show_button = document.querySelector('.description_section > #field_Description'+(page_number-2).toString()) != null ? true: false;
   if(there_is_next_page){
       hide_object($('.description_section > #field_Description'+page_number.toString()));
   }
   else return;
   vis_object_with_animation($('.description_section > .next_button'));

   if(need_show_button)
   vis_object_with_animation($('.description_section > .next_button'));
   else
         hide_object($('.description_section > .prev_button'));
   page_number--;
   vis_object_with_animation($('.description_section > #field_Description'+page_number.toString()));
   // hide_object($('.background:not(.description_view,close_button)'));
   if(!isDescription && page_number == 3)
   hide_object($('.description_section > .prev_button'),0);
});

document.querySelector(".description_section > .close_button").addEventListener("mousedown", function(e){ 
   hide_object(  $('.description_view'));
   hide_object(  $('.field_Description'));
   // vis_object_with_animation($('canvas'));
   //  vis_object_with_animation($('.background:not(.description_view)'));
})

