
 mean = document.getElementById("mean");
 std = document.getElementById("std");
 pois_stat = document.getElementById("pois_stat");
 
class Statstics {
  constructor() {
    this.fontColor = "#000000";
    this.mean = 0;
    this.std = 0;
  }

  draw(data) {
    // calc mean
    this.mean = 0;
    this.std = 0;
    if (data.length != 0) {
      this.mean = 0;
      this.std = 0;
      for (var i = 0; i < data.length; ++i) {
        if (data[i] < 100) {
          this.mean += data[i];
        }
      }
      this.mean /= data.length;
      for (var i = 0; i < data.length; ++i) {
        if (data[i] < 100) {
          this.std += (data[i] - this.mean) * (data[i] - this.mean);
        }
      }
      this.std = Math.sqrt(this.std / data.length);
    }
    // stat_p.style.color = this.fontColor;
    mean.innerHTML =  'mean: '+this.mean.toFixed(3);
    std.innerHTML =   'std: ' + this.std.toFixed(3);
    if (this.mean < this.std * this.std) {
      pois_stat.innerHTML = 'sub-poissonian';
    } else {
      pois_stat.innerHTML = 'super-poissonian';
    }
    //  | statistics: ' + this.stat;
  }
}


