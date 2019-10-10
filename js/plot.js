var distribution_canvas = document.querySelector("#distribution_canvas");
var d_ctx = distribution_canvas.getContext("2d");


distribution_canvas.width = document.querySelector("#distribution_area").offsetWidth;
distribution_canvas.height = document.querySelector("#distribution_area").offsetHeight;

var d_width = distribution_canvas.width,
    d_height = distribution_canvas.height;


class Histogram{
  constructor(bins_number, limit_left, limit_right, draw_area_size){ // types : (int, float, float, list[int|float, int|float])
    this.bins_number = bins_number;
    this.limit_left = limit_left;
    this.limit_right = limit_right;
    this.bins = [];
    this.counter = [];
    this.draw_area_size = draw_area_size;
    this.axes_start = [40, draw_area_size[1] - 50]; // (x, y) - point
    this.y_end = [this.axes_start[0], 50 + draw_area_size[1] / 2];
    this.x_end = [draw_area_size[0]  - 50, draw_area_size[1] - 50];

    this.first_margin = 0.5;
    this.between_margin = 0;
    this.bin_width = 25;
    this.outline_width = 1.0;
    this.arrow_size = 10;

    this.grid_size = this.bin_width;
    this.size_mlp = 5;
    this.size_multiplayer = this.grid_size / this.size_mlp;
    this.x_ticks = -(this.axes_start[0] - this.x_end[0]) / this.grid_size;
    this.y_ticks = (this.axes_start[1] - this.y_end[1]) / this.grid_size;


    for (var i = 0; i < bins_number + 1; i++) {
      this.bins[i] = i * (limit_right - limit_left) / bins_number + limit_left;
    }
  };
  findMinMax(){
    var max_min = [[0, this.counter[0]], [1, this.counter[0]]];
    for (var i = 1; i < this.bins_number; i++) {
      if (max_min[0][1] < this.counter[i]) {
        max_min[0][0] = i;
        max_min[0][1] = this.counter[i];
      }
      if (max_min[1][1] > this.counter[i]) {
        max_min[1][0] = i;
        max_min[1][1] = this.counter[i];
      }
    }

    return max_min;
  }
  draw(data){
    for (var i = 0; i < this.bins_number; i++) {
      this.counter[i] = 0;
    }

    for (var i = 0; i < data.length; i++) {
      var binTo = Math.trunc((data[i] - this.limit_left) / (this.limit_right - this.limit_left) * this.bins_number);
      this.counter[binTo] += 1;
    }
    //var max_min = this.findMinMax();

    //draw background
    d_ctx.fillStyle = "white";
    d_ctx.fillRect(0, 0, this.draw_area_size[0], this.draw_area_size[1]);

    //draw vertical-grid

    for (var i = 0; i < this.x_ticks; i++) {

      if (i != 0) {
        d_ctx.lineWidth = this.outline_width / 2;
        d_ctx.strokeStyle = "#acacac";
        d_ctx.fillStyle = "#acacac";
        d_ctx.beginPath()
        d_ctx.moveTo(this.axes_start[0] + i * this.grid_size, this.axes_start[1]);
        d_ctx.lineTo(this.axes_start[0] + i * this.grid_size, this.y_end[1]);
        d_ctx.stroke();
      } else {
        d_ctx.strokeStyle = "#000000";
        d_ctx.lineWidth = this.outline_width * 2;
        d_ctx.beginPath()
        d_ctx.moveTo(this.axes_start[0], this.axes_start[1]);
        d_ctx.lineTo(this.y_end[0], this.y_end[1]);
        d_ctx.stroke();
        d_ctx.lineWidth = this.outline_width * 1.5;
        d_ctx.beginPath();
        d_ctx.moveTo(this.y_end[0], this.y_end[1]);
        d_ctx.lineTo(this.y_end[0] - this.arrow_size * Math.sin(Math.PI / 12), this.y_end[1] + this.arrow_size * Math.cos(Math.PI / 12));
        d_ctx.moveTo(this.y_end[0], this.y_end[1]);
        d_ctx.lineTo(this.y_end[0] + this.arrow_size * Math.sin(Math.PI / 12), this.y_end[1] + this.arrow_size * Math.cos(Math.PI / 12));
        d_ctx.stroke();
      }

    }

    for (var i = 0; i < this.y_ticks; i++) {
      if (i != 0) {
        d_ctx.lineWidth = this.outline_width / 2;
        d_ctx.strokeStyle = "#acacac";
        d_ctx.fillStyle = "#acacac";
        d_ctx.beginPath()
        d_ctx.moveTo(this.axes_start[0], this.axes_start[1]  - i * this.grid_size);
        d_ctx.lineTo(this.x_end[0], this.axes_start[1]  - i * this.grid_size);
        d_ctx.stroke();
      } else {
        d_ctx.strokeStyle = "#000000";
        d_ctx.lineWidth = this.outline_width * 2;
        d_ctx.beginPath()
        d_ctx.moveTo(this.axes_start[0], this.axes_start[1]);
        d_ctx.lineTo(this.x_end[0], this.x_end[1]);
        d_ctx.stroke();
        d_ctx.lineWidth = this.outline_width * 1.5;
        d_ctx.beginPath();
        d_ctx.moveTo(this.x_end[0], this.x_end[1]);
        d_ctx.lineTo(this.x_end[0] - this.arrow_size * Math.cos(Math.PI / 12), this.x_end[1] + this.arrow_size * Math.sin(Math.PI / 12));
        d_ctx.moveTo(this.x_end[0], this.x_end[1]);
        d_ctx.lineTo(this.x_end[0] - this.arrow_size * Math.cos(Math.PI / 12), this.x_end[1] - this.arrow_size * Math.sin(Math.PI / 12));
        d_ctx.stroke();
      }
    }

    // draw ticks

    for (var i = 1; i < this.x_ticks && i <= this.bins_number; i++) {
      d_ctx.beginPath();
      d_ctx.lineWidth = 1;
      d_ctx.strokeStyle = "#000000";
      d_ctx.moveTo(this.axes_start[0] + i * this.grid_size, this.axes_start[1] - 3);
      d_ctx.lineTo(this.axes_start[0] + i * this.grid_size, this.axes_start[1] + 3);
      d_ctx.stroke();

      d_ctx.font = '9px Arial';
      d_ctx.textAlign = 'center';
      d_ctx.fillText(this.bins[i].toFixed(1), this.axes_start[0] + i * this.grid_size, this.axes_start[1] + 15);
    }

    for (var i = 1; i < this.y_ticks; ++i) {
      d_ctx.beginPath();
      d_ctx.lineWidth = 1;
      d_ctx.strokeStyle = "#000000";
      d_ctx.moveTo(this.axes_start[0] - 3, this.axes_start[1]  - i * this.grid_size);
      d_ctx.lineTo(this.axes_start[0] +3, this.axes_start[1]  - i * this.grid_size);
      d_ctx.stroke();

      d_ctx.font = '9px Arial';
      d_ctx.textAlign = 'end';
      d_ctx.fillText((this.size_mlp * i).toFixed(1), this.axes_start[0] - 10, this.axes_start[1]  - i * this.grid_size + 3);
    }
    // draw zero
    d_ctx.font = '10px Arial';
    d_ctx.textAlign = 'end';
    d_ctx.fillText(0, this.axes_start[0] - 10, this.axes_start[1] + 14);

    for (var i = 0; i < this.bins_number && i < this.x_ticks; ++i) {
      d_ctx.fillStyle = "#05eea8";
      var bin_x = this.axes_start[0] + this.first_margin + (this.bin_width + this.between_margin) * i,
          bin_y = this.axes_start[1] - this.size_multiplayer * this.counter[i];
      d_ctx.fillRect(bin_x, bin_y, this.bin_width, this.size_multiplayer * this.counter[i]);
      d_ctx.strokeStyle = "#000000";
      d_ctx.fillStyle = "#000000";
      d_ctx.lineWidth = this.outline_width;
      d_ctx.strokeRect(bin_x-0.5, bin_y-.5, this.bin_width, this.size_multiplayer * this.counter[i]);
    }
  }
};

// var hist = new Histogram(20, 0, 100, [d_width, d_height]);
//
// hist.draw([30, 30, 50, 60, 10, 80]);
//
// function getRandomInt(min, max) {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min)) + min;
// }
//
// data = [];
//
// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }
//
// async function demo() {
//   console.log('Taking a break...');
//   await sleep(2000);
//   console.log('Two seconds later, showing sleep in a loop...');
//
//   // Sleep in loop
//   for (var i = 0; i < 1000000; i++) {
//     for (var j = 0; j < 1000; ++j) {
//       data[j] = getRandomInt(0, 100);
//     }
//     hist.draw(data);
//     await sleep(1000);
//   }
//
// }
//
// demo();

