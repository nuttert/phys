var distribution_canvas = document.querySelector("#distribution_canvas");
var d_ctx = distribution_canvas.getContext("2d");

// var d_title = document.getElementById("distribution_area_title");
var d_axis_x_title = document.querySelector("#distribution_area_axis_x_title > span");
var d_axis_y_title = document.querySelector("#distribution_area_axis_y_title > span");
var d_axis_x_limit = document.getElementById("distribution_area_axis_x_limit");
var d_axis_y_limit = document.getElementById("distribution_area_axis_y_limit");
var d_axis_start = document.getElementById("distribution_area_axis_start");

distribution_canvas.width = document.querySelector("#distribution_canvas").offsetWidth;
distribution_canvas.height = document.querySelector("#distribution_canvas").offsetHeight;

// const deg = 90;




var d_width = distribution_canvas.width,
    d_height = distribution_canvas.height;

function getHexColor(number){
    return "#"+((number)>>>0).toString(16).slice(-6);
}

var grad_canvas = document.querySelector('#gradient_line');
var g_ctx = grad_canvas.getContext("2d");
var g_width = grad_canvas.width,
    g_height = grad_canvas.height;

var gradient = g_ctx.createLinearGradient(10, 0, 500, 0);

gradient.addColorStop(0, 'rgb(230,208,62)');
gradient.addColorStop(1 / 2, 'rgb(5,230,238)');
gradient.addColorStop(1, 'rgb(5,238,168)');


g_ctx.fillStyle = gradient;

g_ctx.fillRect(0, 0, g_width, g_height);

// d_ctx.fillStyle = gradient;
// d_ctx.fillRect(gradient_x, gradient_y, gradient_width, gradient_height);

function rgbToHex(r, g, b){
  if (r > 255 || g > 255 || b > 255)
    throw "Invalid color component";
  return ((r << 16) | (g << 8) | b).toString(16);
};

getColor = function(lambda) {
  // console.log(gradient_x, gradient_x + lambda * gradient_width);
  alpha = Math.min(0.999, Math.max(lambda, 0.001));
  // console.log(Math.trunc(alpha * g_width), Math.trunc(g_height / 2), 1, 1);
  p = g_ctx.getImageData(Math.trunc(alpha * g_width), Math.trunc(g_height / 2), 1, 1).data;
  // console.log(p);
  var hex = "#" + ("000000" + rgbToHex(p['0'], p['1'], p['2'])).slice(-6);
  return hex;
}

getGradientColor = function(start_color, end_color, percent) {
   // strip the leading # if it's there
   start_color = start_color.replace(/^\s*#|\s*$/g, '');
   end_color = end_color.replace(/^\s*#|\s*$/g, '');

   // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
   if(start_color.length == 3){
     start_color = start_color.replace(/(.)/g, '$1$1');
   }

   if(end_color.length == 3){
     end_color = end_color.replace(/(.)/g, '$1$1');
   }

   // get colors
   var start_red = parseInt(start_color.substr(0, 2), 16),
       start_green = parseInt(start_color.substr(2, 2), 16),
       start_blue = parseInt(start_color.substr(4, 2), 16);

   var end_red = parseInt(end_color.substr(0, 2), 16),
       end_green = parseInt(end_color.substr(2, 2), 16),
       end_blue = parseInt(end_color.substr(4, 2), 16);

   // calculate new color
   var diff_red = end_red - start_red;
   var diff_green = end_green - start_green;
   var diff_blue = end_blue - start_blue;

   diff_red = ( (diff_red * percent) + start_red ).toString(16).split('.')[0];
   diff_green = ( (diff_green * percent) + start_green ).toString(16).split('.')[0];
   diff_blue = ( (diff_blue * percent) + start_blue ).toString(16).split('.')[0];

   // ensure 2 digits by color
   if( diff_red.length == 1 ) diff_red = '0' + diff_red
   if( diff_green.length == 1 ) diff_green = '0' + diff_green
   if( diff_blue.length == 1 ) diff_blue = '0' + diff_blue

   return '#' + diff_red + diff_green + diff_blue;
 };


class Histogram{
	constructor(bins_number, limit_left, limit_right, draw_area_size, max_particles, grid_on) {
		this.counter = [];
    this.draw_area_size = draw_area_size;
    this.margin_bottom = draw_area_size[1] * 0.05;
    this.margin_top = draw_area_size[0] * 0.05;
    this.margin_left = draw_area_size[0] * 0.05;
    this.margin_right = draw_area_size[0] * 0.05;
    this.axes_start = [this.margin_left, draw_area_size[1] - this.margin_bottom];
    this.axes_end = [this.draw_area_size[0] - this.margin_right, this.margin_top];
    this.grid_size = 10;
    this.bins_number = bins_number;
		this.limit_left = limit_left;
		this.limit_right = limit_right;
		this.max_particles = max_particles;
		this.outline_width = 1;
		this.grid_size_x = 25;
		this.grid_size_y = 25;
		this.arrow_size = draw_area_size[0] * 0.02;
    this.arrow_shift_x = draw_area_size[0] * 0.03;
    this.arrow_shift_y = draw_area_size[0] * 0.03;
		this.grid_shift_x = 10;
		this.grid_shift_y = 10;
		this.inner_radius = 3;
		this.outer_radius = 5;
		this.text_color = '#000000'; //'#05EEA8'
    this.numbers_color = '#05EEA8';
		this.hat_margin = 10;
		this.thresh = 30;
		this.grid_on = grid_on;
		this.curve_color = 'rgb(252,95,163)';
		this.title = 'Particle collision histogram';
		this.title_x = 'number of particles';
		this.title_y = 'time between collisions, s';
	}
	setMaxParticles(max_particles) {
		this.max_particles = max_particles;
	}
	setBinsNumber(bins_number) {
		this.bins_number = bins_number;
	}
	setLimitLeft(limit_left) {
		this.limit_left = limit_left;
	}
	setLimitRight(limit_right) {
		this.limit_right = limit_right;
	}

	draw(data) {
	  var max_time = 0;
    for (var i = 0; i < data.length; ++i) {
      max_time = Math.max(max_time, data[i]);
    }
    max_time = Math.max(2, 2 * Math.ceil(max_time / 2));
    console.log();
    this.setLimitRight(max_time);
		//draw pipe line: grid, rects, whitespace below axes, text, axes
		this.xticks = Math.trunc(Math.abs(this.axes_start[0] - this.axes_end[0]) / this.grid_size_x);
		this.yticks = Math.trunc(Math.abs(this.axes_start[1] - this.axes_end[1]) / this.grid_size_y);
		this.counter = new Array(this.bins_number).fill(0);
		for (var i = 0; i < data.length; i++) {
			var toBin = Math.trunc((data[i] - this.limit_left) / (this.limit_right - this.limit_left) * this.bins_number);
			this.counter[toBin]++;
		}
    this.max_particles = Math.max(1, Math.trunc(this.counter[0]));
    for (var i = 1; i < this.bins_number; i++) {
      this.max_particles = Math.max(this.max_particles, Math.trunc(this.counter[i]));
    } 
    this.max_particles = Math.floor((this.max_particles + 49) / 50) * 50;

		d_ctx.fillStyle = "white";
		d_ctx.fillRect(0, 0, this.draw_area_size[0], this.draw_area_size[1]);

    	// draw grid
      if (this.grid_on) {
        for (var i = 1; i <= this.xticks; i++) {
          d_ctx.lineWidth = this.outline_width / 2;
          d_ctx.strokeStyle = "#acacac";
          d_ctx.fillStyle = "#acacac";
          d_ctx.beginPath();
          d_ctx.moveTo(this.axes_start[0] + i * this.grid_size_x, this.axes_start[1]);
          d_ctx.lineTo(this.axes_start[0] + i * this.grid_size_x, this.axes_end[1] + this.grid_shift_y);
          d_ctx.stroke();
        }

        for (var i = 1; i < this.yticks; i++) {
          d_ctx.lineWidth = this.outline_width / 2;
          d_ctx.strokeStyle = "#acacac";
          d_ctx.fillStyle = "#acacac";
          d_ctx.beginPath()
          d_ctx.moveTo(this.axes_start[0], this.axes_start[1] - i * this.grid_size_y);
          d_ctx.lineTo(this.axes_end[0] - this.grid_shift_x, this.axes_start[1] - i * this.grid_size_y);
          d_ctx.stroke();
        }
      }
    	// draw rects
    	var prev_coord_x = 0;
    	var prev_coord_y = 0;
    	for (var i = 0; i < this.bins_number; i++) {
    		// var radius = Math.abs(this.axes_start[0] - this.axes_end[0]) / this.bins_number / 4;
    		var coord_x = this.counter[i] / this.max_particles * Math.abs(this.axes_start[0] - this.axes_end[0]) + this.axes_start[0];
    		var coord_y = this.axes_start[1] - (i + .5) / this.bins_number * Math.abs(this.axes_start[1] - this.axes_end[1]);
    		if (i != 0) {
    			d_ctx.beginPath();
    			d_ctx.strokeStyle = this.curve_color;
    			d_ctx.lineWidth = this.outline_width;
    			var lambda_12 = 0.2;
    			var lambda_22 = 0.9;
    			if (this.counter[i - 1] > this.counter[i]) {
    				d_ctx.moveTo(prev_coord_x, prev_coord_y);
    				if (prev_coord_x - coord_x > this.thresh) {
    					d_ctx.bezierCurveTo(prev_coord_x - this.hat_margin, lambda_12 * prev_coord_y + (1 - lambda_12) * coord_y,  coord_x + this.hat_margin, lambda_22 * prev_coord_y + (1 - lambda_22) * coord_y, coord_x, coord_y);
    				} else {
    					d_ctx.lineTo(coord_x, coord_y);
    				}
    				d_ctx.stroke();
    			} else {
    				[coord_x, prev_coord_x] = [prev_coord_x, coord_x];
    				[coord_y, prev_coord_y] = [prev_coord_y, coord_y];
    				d_ctx.moveTo(prev_coord_x, prev_coord_y);
    				if (prev_coord_x - coord_x > this.thresh) {
    					d_ctx.bezierCurveTo(prev_coord_x - this.hat_margin, lambda_12 * prev_coord_y + (1 - lambda_12) * coord_y,  coord_x + this.hat_margin, lambda_22 * prev_coord_y + (1 - lambda_22) * coord_y, coord_x, coord_y);
    				} else {
    					d_ctx.lineTo(coord_x, coord_y);
    				}
    				d_ctx.stroke();
    				[coord_x, prev_coord_x] = [prev_coord_x, coord_x];
    				[coord_y, prev_coord_y] = [prev_coord_y, coord_y];
    			}
    			
    		}
    		prev_coord_x = coord_x;
    		prev_coord_y = coord_y;
    	}
    	for (var i = 0; i < this.bins_number; i++) {
    		// console.log(this.couter, this.max_particles);
    		var coord_x = this.counter[i] / this.max_particles * Math.abs(this.axes_start[0] - this.axes_end[0]) + this.axes_start[0];
    		var coord_y = this.axes_start[1] - (i + .5) / this.bins_number * Math.abs(this.axes_start[1] - this.axes_end[1]);
    		d_ctx.beginPath();
    		d_ctx.fillStyle = this.curve_color;
    		d_ctx.arc(coord_x, coord_y, this.outer_radius, 0, 2 * Math.PI);
    		d_ctx.fill();
    		d_ctx.beginPath();
    		d_ctx.fillStyle = "white";
    		d_ctx.arc(coord_x, coord_y, this.inner_radius, 0, 2 * Math.PI);
    		d_ctx.fill();
    	}
    	// draw shapochki
    	for (var i = 0; i < this.bins_number; i++) {
    		var radius = Math.abs(this.axes_start[0] - this.axes_end[0]) / this.bins_number / 4;
    		var coord_x = this.counter[i] / this.max_particles * Math.abs(this.axes_start[0] - this.axes_end[0]) + this.axes_start[0] - 2 * radius;
    		var coord_y = this.axes_start[1] - (i + .5) / this.bins_number * Math.abs(this.axes_start[1] - this.axes_end[1]);
    		var lambda = this.counter[i]/ this.max_particles;
    		d_ctx.beginPath();
    		// d_ctx.fillStyle = getGradientColor(this.start_color, this.end_color, Math.log(lambda + 1));
    		d_ctx.fillStyle = getColor(lambda);
        d_ctx.arc(coord_x - this.hat_margin, coord_y, radius, -Math.PI / 2 - 0.015, Math.PI/2 + 0.015);
    		d_ctx.fill();
    		d_ctx.fillRect(this.axes_start[0], coord_y - radius, coord_x - this.axes_start[0] - this.hat_margin, 2 * radius);

    	}


    	//draw white fields
    	d_ctx.fillStyle = "white";
    	d_ctx.fillRect(0, 0, this.margin_left, this.draw_area_size[1]);
    	
    	//draw text
      d_axis_start.innerHTML = '0';
      d_axis_x_limit.innerHTML = this.max_particles.toString();
      d_axis_y_limit.innerHTML = this.limit_right.toFixed(0);
      d_axis_x_title.innerHTML = this.title_x;
      d_axis_y_title.innerHTML = this.title_y;
      // d_title.innerHTML = this.title;
    	// d_ctx.fillStyle = this.numbers_color;
    	// d_ctx.font = '24px Montserrat-Medium';
    	// d_ctx.textAlign = 'right';
    	// d_ctx.fillText(0, this.axes_start[0] - this.margin_left / 6, this.axes_start[1] + 2 * this.margin_bottom / 3);
    	// d_ctx.fillText(this.max_particles.toString(), this.axes_end[0], this.axes_start[1]  + 2 * this.margin_bottom / 3);
		  // d_ctx.fillText(this.limit_right.toFixed(0), this.axes_start[0] - this.margin_left / 6, this.axes_end[1] + 2 * this.margin_top / 3);
		  // d_ctx.textAlign = 'center';
      // d_ctx.font = '18px Montserrat-Light';
      // d_ctx.fillStyle = this.text_color;
      // d_ctx.fillText(this.title_x, (this.axes_end[0] + this.axes_start[0]) / 2, this.axes_start[1]  + 2 * this.margin_bottom / 3);
      // d_ctx.rotate(-Math.PI / 2);
		  // d_ctx.fillText(this.title_y, -(this.axes_start[1] + this.axes_end[1]) / 2 , 2 * this.margin_left / 3);
		  // d_ctx.setTransform(1, 0, 0, 1, 0, 0);
      // d_ctx.font = '25px Montserrat-Medium';
      // d_ctx.fillText(this.title, (this.axes_start[0] + this.axes_end[0]) / 2, 1.75 * this.grid_size);

		// draw Y
		  d_ctx.strokeStyle = "black";
	    d_ctx.fillStyle = "black";
	    d_ctx.lineWidth = this.outline_width * 2;
	    d_ctx.beginPath()
	    d_ctx.moveTo(this.axes_start[0], this.axes_start[1] + this.margin_bottom / 3);
	    d_ctx.lineTo(this.axes_start[0], this.axes_end[1] - this.arrow_shift_y);
	    d_ctx.stroke();
	    d_ctx.lineWidth = this.outline_width * 1.5;
	    d_ctx.beginPath();
	    d_ctx.moveTo(this.axes_start[0], this.axes_end[1] - this.arrow_shift_y - 1);
	    d_ctx.lineTo(this.axes_start[0] - this.arrow_size * Math.sin(Math.PI / 6), this.axes_end[1] + this.arrow_size * Math.cos(Math.PI / 6) - this.arrow_shift_y);
	    d_ctx.lineTo(this.axes_start[0] + this.arrow_size * Math.sin(Math.PI / 6), this.axes_end[1] + this.arrow_size * Math.cos(Math.PI / 6) - this.arrow_shift_y);
	    d_ctx.fill();

	    // draw X
	    d_ctx.strokeStyle = "#000000";
	    d_ctx.fillStyle = "black";
	    d_ctx.lineWidth = this.outline_width * 2;
	    d_ctx.beginPath()
	    d_ctx.moveTo(this.axes_start[0] - this.margin_left / 3, this.axes_start[1]);
	    d_ctx.lineTo(this.axes_end[0] + this.arrow_shift_x, this.axes_start[1]);
	    d_ctx.stroke();
	    d_ctx.lineWidth = this.outline_width * 1.5;
	    d_ctx.beginPath();
	    d_ctx.moveTo(this.axes_end[0] + this.arrow_shift_x + 1, this.axes_start[1]);
	    d_ctx.lineTo(this.axes_end[0] + this.arrow_shift_x - this.arrow_size * Math.cos(Math.PI / 6), this.axes_start[1] + this.arrow_size * Math.sin(Math.PI / 6));
	    d_ctx.lineTo(this.axes_end[0] + this.arrow_shift_x - this.arrow_size * Math.cos(Math.PI / 6), this.axes_start[1] - this.arrow_size * Math.sin(Math.PI / 6));
	    d_ctx.fill();
      d_ctx.moveTo(Math.abs(this.axes_start[0] - this.axes_end[0]) + this.axes_start[0], this.axes_start[1] + this.arrow_size * Math.cos(Math.PI / 6))
      d_ctx.lineTo(Math.abs(this.axes_start[0] - this.axes_end[0]) + this.axes_start[0], this.axes_start[1] - this.arrow_size * Math.cos(Math.PI / 6))
      d_ctx.stroke();
	}
};

// var hist = new Histogram(10, 0, 50, [d_width, d_height], 10);

// hist.draw([30, 30, 50, 60, 10, 80]);

// function getRandomInt(min, max) {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min)) + min;
// }

// data = [];

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// async function demo() {
//   console.log('Taking a break...');
//   await sleep(2000);
//   console.log('Two seconds later, showing sleep in a loop...');

//   // Sleep in loop
//   for (var i = 0; i < 1000000; i++) {
//     for (var j = 0; j < 1000; ++j) {
//       data[j] = getRandomInt(0, 50);
//     }
//     hist.setMaxParicles(250);
//     hist.draw(data);
//     await sleep(3000);
//   }

// }

// demo();
