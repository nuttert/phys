
 mean = document.getElementById("mean");
 std = document.getElementById("std");
//  tmean = document.getElementById("tmean");
 pois_stat = document.getElementById("pois_stat");
 
class Statstics {
  constructor() {
    this.fontColor = "#000000";
    this.mean = 0;
    this.std = 0;
    this.variance = 0;
    // this.tmean = 0;
  }

  draw(data) {
    // calc mean
    this.mean = 0;
    this.std = 0;
    if (data.length != 0) {
      this.mean = 0;
      this.std = 0;
      for (var i = 0; i < data.length; ++i) {
          this.mean += data[i];
      }
      this.mean /= data.length;
      for (var i = 0; i < data.length; ++i) {
          this.std += (data[i] - this.mean) * (data[i] - this.mean);
      }
      this.variance = this.std / data.length;
      this.std = Math.sqrt(this.std / data.length);
    }
    if (line_perimetr == 0 || polygon_area == 0 || velocity == 0) {
      // this.tmean = 0;
    } else {
      // this.tmean =  1 / (line_perimetr * velocity / (Math.PI + polygon_area));
    }

    // stat_p.style.color = this.fontColor;
    mean.innerHTML =  this.mean.toFixed(3);
    std.innerHTML =   this.std.toFixed(3);
    // tmean.innerHTML = this.tmean.toFixed(3);
    if (this.mean > this.variance) {
      pois_stat.innerHTML = 'sub-poissonian';
    } else {
      pois_stat.innerHTML = 'super-poissonian';
    }
    //  | statistics: ' + this.stat;
  }
}


