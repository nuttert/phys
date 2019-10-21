var time_collision_canvas = document.querySelector("#time_collision_canvas");
var tc_ctx = time_collision_canvas.getContext("2d");

time_collision_canvas.width = document.querySelector("#time_collision_canvas").offsetWidth;
time_collision_canvas.height = document.querySelector("#time_collision_canvas").offsetHeight;

var tc_height = time_collision_canvas.height,
	tc_width = time_collision_canvas.width

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
    	this.counters = []
    	this.timelineWidth = 2;
    	this.arrow_size = 10;
		this.arrow_shift_x = 15;
		this.arrow_shift_y = 15;
	}
	draw(data){
		tc_ctx.fillStyle = this.text_color;
    	tc_ctx.font = '24px Montserrat-Medium';
    	tc_ctx.textAlign = 'right';
    	tc_ctx.fillText(0, this.axes_start[0] - this.margin_left / 6, this.axes_start[1] + 2 * this.margin_bottom / 3);
    	tc_ctx.fillText(this.limit_right.toString(), this.axes_end[0], this.axes_start[1]  + 2 * this.margin_bottom / 3);
		
		
		// draw timeline
		tc_ctx.strokeStyle = "#000000";
	    tc_ctx.fillStyle = "black";
	    tc_ctx.lineWidth = this.timelineWidth * 2;
	    tc_ctx.beginPath()
	    tc_ctx.moveTo(this.axes_start[0] - this.margin_left / 3, this.axes_start[1]);
	    tc_ctx.lineTo(this.axes_end[0] + this.arrow_shift_x, this.axes_start[1]);
	    tc_ctx.stroke();
	    tc_ctx.lineWidth = this.timelineWidth * 1;
	    tc_ctx.beginPath();
	    tc_ctx.moveTo(this.axes_end[0] + this.arrow_shift_x + 1, this.axes_start[1]);
	    tc_ctx.lineTo(this.axes_end[0] + this.arrow_shift_x - this.arrow_size * Math.cos(Math.PI / 6), this.axes_start[1] + this.arrow_size * Math.sin(Math.PI / 6));
	    tc_ctx.lineTo(this.axes_end[0] + this.arrow_shift_x - this.arrow_size * Math.cos(Math.PI / 6), this.axes_start[1] - this.arrow_size * Math.sin(Math.PI / 6));
	    tc_ctx.fill();
	}
};

tp = new TimePlot(0, 10, [tc_width, tc_height])

tp.draw()