var time_collision_canvas = document.querySelector("#time_collision_canvas");
var tc_ctx = time_collision_canvas.getContext("2d");

time_collision_canvas.width = document.querySelector("#time_collision_canvas").offsetWidth;
time_collision_canvas.height = document.querySelector("#time_collision_canvas").offsetHeight;

var tc_height = time_collision_canvas.height,
	tc_width = time_collision_canvas.width

function binarySearch(array, pred) {
    var lo = -1, hi = array.length;
    while (1 + lo < hi) {
        const mi = lo + ((hi - lo) >> 1);
        if (pred(array[mi])) {
            hi = mi;
        } else {
            lo = mi;
        }
    }
    return hi;
}

function lowerBound(array, item) {
    return binarySearch(array, j => item <= j);
}
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

class TimePlot{
	constructor(limit_left, limit_right, draw_area_size) {
		this.limit_left = limit_left;
		this.limit_right = limit_right;
		this.draw_area_size = draw_area_size;
    this.margin_bottom = 30;
    this.margin_top = 30;
    this.margin_left = 30;
    this.margin_right = 30;
    this.axes_start = [this.margin_left, draw_area_size[1] - this.margin_bottom];
    this.axes_end = [this.draw_area_size[0] - this.margin_right, this.margin_top];
    this.counters = [];
    this.time_line_width = 1;
    this.travel_line_width = 1.5;
    this.arrow_size = 10;
		this.arrow_shift_x = 15;
		this.arrow_shift_y = 15;
		this.prev_time = new Date().getTime() / 1000;	
		this.line_height = 30;
		this.travel_line_color = '#f18db5';
		this.numbers_color = '#05EEA8';
		this.text_color = '#000000';
		this.ticks_number = 6;
		this.ticks_height = 10;
		this.tick_width = 2;
		this.axis_title = "elapsed time after collision, s";
		this.title = 'Collision timeline';
	}

	get_right_limit(){
	  return this.limit_left;
  }

	draw(data){
		tc_ctx.fillStyle = "white";
      tc_ctx.fillRect(0, 0, this.draw_area_size[0], this.draw_area_size[1]);
		var new_time = new Date().getTime() / 1000;
		var diff_time = new_time - this.prev_time;
		var delTo = 0;
		for (var i = 0; i < this.counters.length; ++i) {
			this.counters[i] += diff_time;
			if (this.counters[i] >= this.limit_right - 0.05) {
				delTo = i;
			}
		}
		this.counters  = data;

		tc_ctx.fillStyle = this.numbers_color;
		tc_ctx.strokeStyle = this.strokeText;
		tc_ctx.strokeWidth = 0.01;
    tc_ctx.font = '25px Montserrat-Medium';
    tc_ctx.textAlign = 'right';
    tc_ctx.fillText(this.limit_left.toString(), this.axes_start[0], (this.axes_start[1] + this.margin_bottom));
    tc_ctx.fillText(this.limit_right.toString(), this.axes_end[0], this.axes_start[1] + this.margin_bottom);
    tc_ctx.fillStyle = this.text_color;
    tc_ctx.textAlign = 'center';
    tc_ctx.font = '18px Montserrat-Medium';
    tc_ctx.fillText(this.axis_title, (this.axes_start[0] + this.axes_end[0]) / 2, this.axes_start[1] + 4 * this.line_height / 5);
    tc_ctx.font = '25px Montserrat-Medium';
    tc_ctx.fillText(this.title, ((this.axes_start[0] + this.axes_end[0]) / 2), this.axes_start[1] - 1.5 * this.line_height);


		// draw timeline
    tc_ctx.strokeStyle = "#000000";
    tc_ctx.fillStyle = "black";
    tc_ctx.lineWidth = this.time_line_width * 2;
    tc_ctx.beginPath()
    tc_ctx.moveTo(this.axes_start[0] - this.margin_left / 3, this.axes_start[1]);
    tc_ctx.lineTo(this.axes_end[0] + this.arrow_shift_x, this.axes_start[1]);
    tc_ctx.stroke();
    tc_ctx.lineWidth = this.time_line_width * 1;
    tc_ctx.beginPath();
    tc_ctx.moveTo(this.axes_end[0] + this.arrow_shift_x + 1, this.axes_start[1]);
    tc_ctx.lineTo(this.axes_end[0] + this.arrow_shift_x - this.arrow_size * Math.cos(Math.PI / 6), this.axes_start[1] + this.arrow_size * Math.sin(Math.PI / 6));
    tc_ctx.lineTo(this.axes_end[0] + this.arrow_shift_x - this.arrow_size * Math.cos(Math.PI / 6), this.axes_start[1] - this.arrow_size * Math.sin(Math.PI / 6));
    tc_ctx.fill();

    tc_ctx.strokeStyle = this.travel_line_color;
    tc_ctx.fillStyle = "black";
    tc_ctx.lineWidth = this.travel_line_width;
    for (var i = 0; i < this.counters.length; ++i) {
      if (this.counters[i] < this.limit_right) {
        tc_ctx.beginPath()
        tc_ctx.moveTo(this.axes_start[0] + this.counters[i] / this.limit_right * (this.axes_end[0] - this.axes_start[0]), this.axes_start[1]);
        tc_ctx.lineTo(this.axes_start[0] + this.counters[i] / this.limit_right * (this.axes_end[0] - this.axes_start[0]), this.axes_start[1] - this.line_height);
        tc_ctx.stroke();
        // console.log(this.axes_start[0] + this.counters[i] / this.limit_right * (this.axes_end[0] - this.axes_start[0]), this.axes_start[1]);
      }
    }
		// xticks


		for (var i = 0; i <= this.ticks_number; ++i) {
			tc_ctx.beginPath();
			tc_ctx.strokeStyle = 'black';
			tc_ctx.lineWidth = this.tick_width;
			tc_ctx.moveTo(this.axes_start[0] + Math.trunc(i / this.ticks_number * (this.axes_end[0] - this.axes_start[0])), this.axes_start[1] - this.ticks_height / 2);
			tc_ctx.lineTo(this.axes_start[0] + Math.trunc(i / this.ticks_number * (this.axes_end[0] - this.axes_start[0])), this.axes_start[1] + this.ticks_height / 2);
			tc_ctx.stroke();
		}
	   	// console.log((this.axes_start[0] + this.counters[] / this.limit_left * (this.axes_end[0] - this.axes_start[0]));
	   // await sleep(3000);
	}
};

