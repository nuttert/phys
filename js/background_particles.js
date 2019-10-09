

function RandomParticles(element, particleCount, color){

    // var canvas = document.createElement('canvas'),
    var canvas = document.querySelector("#background_canvas"),
    ctx = canvas.getContext('2d'),
    w = canvas.width = element.clientWidth,
    h = canvas.height = element.clientHeight,
    particles = [],
    properties = {
        bgColor             : 'rgba(0, 0, 0, 1)',
        particleColor       : 'rgba(' + color +',1)',
        particleRadius      : 4,
        particleCount       : particleCount,
        particleMaxVelocity : 0.5,
        lineLength          : 300,
        particleLife        : 10,
    };
    

    // document.querySelector('.background').appendChild(canvas);
    // element.appendChild(canvas);
    canvas.style.position = "fixed";
    canvas.style.zIndex = -1;
    window.onresize = function(){
        w = canvas.width = element.clientWidth,
        h = canvas.height = element.clientHeight;        
    }

    class Particle{
        constructor(){
            this.x = Math.random()*w;
            this.y = Math.random()*h;
            this.velocityX = Math.random()*(properties.particleMaxVelocity*2)-properties.particleMaxVelocity;
            this.velocityY = Math.random()*(properties.particleMaxVelocity*2)-properties.particleMaxVelocity;
            this.life = Math.random()*properties.particleLife*60;
        }
        position(){
            this.x + this.velocityX > w && this.velocityX > 0 || this.x + this.velocityX < 0 && this.velocityX < 0? this.velocityX*=-1 : this.velocityX;
            this.y + this.velocityY > h && this.velocityY > 0 || this.y + this.velocityY < 0 && this.velocityY < 0? this.velocityY*=-1 : this.velocityY;
            this.x += this.velocityX;
            this.y += this.velocityY;
        }
        reDraw(){
            ctx.beginPath();
            ctx.arc(this.x, this.y, properties.particleRadius, 0, Math.PI*2);
            ctx.closePath();
            ctx.fillStyle = properties.particleColor;
            ctx.fill();
        }
        reCalculateLife(){
            if(this.life < 1){
                this.x = Math.random()*w;
                this.y = Math.random()*h;
                this.velocityX = Math.random()*(properties.particleMaxVelocity*2)-properties.particleMaxVelocity;
                this.velocityY = Math.random()*(properties.particleMaxVelocity*2)-properties.particleMaxVelocity;
                this.life = Math.random()*properties.particleLife*60;
            }
            this.life--;
        }
    }



    function reDrawBackground(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawLines(){
        var x1, y1, x2, y2, length, opacity;
        for(var i in particles){
            for(var j in particles){
                x1 = particles[i].x;
                y1 = particles[i].y;
                x2 = particles[j].x;
                y2 = particles[j].y;
                length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                if(length < properties.lineLength){
                    opacity = 1-length/properties.lineLength;
                    ctx.lineWidth = '0.2';
                    ctx.strokeStyle = 'rgba(' + color +','+opacity+')';
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.closePath();
                    ctx.stroke();
                }
            }
        }
    }

    function reDrawParticles(){
        for(var i in particles){
            particles[i].reCalculateLife();
            particles[i].position();
            particles[i].reDraw();
        }
    }

    function loop(){
        reDrawBackground();
        reDrawParticles();
        drawLines();
        requestAnimationFrame(loop);
    }

    function init(){
        for(var i = 0 ; i < properties.particleCount ; i++){
            particles.push(new Particle);
        }
        loop();
    }

    init();

}
RandomParticles(document.querySelector('.background'),30, '255, 255, 255');
RandomParticles(document.querySelector('.background'),40, '0, 0, 0');


