/**
 * Created by IgorKhrypak on 06.12.2016.
 */
/* jshint esversion: 6 */


/*Animation*/
((main) => {

    this.requestAnimationFrame = (() => {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    main(this, document, Vector2);

})

((window, document, v2, undefined) => {

    'use strict';

    const PI = Math.PI,
        TAU = PI * 2;

    const APP_DEFAULTS = {
        particleCount: 325,
       // particleColor: 'rgba(200,200,230,0.5)'
    };

    class Particle {
        constructor(size, speed, context, bounds) {
            this.size = size;
            this.ctx = context;
            this.bounds = bounds;
            this.position = new v2();
            this.position.randomize(bounds);
            this.velocity = new v2(0,speed);
            this.velocity.y -= Math.random();
            this.velocity.x -= Math.random();
        }

        reset() {
            this.position.y = this.bounds.y + this.size;
            this.position.x = Math.random() * this.bounds.x;
            
        }

        center() {
            if(this.position.y <  this.bounds.y/2){
                this.velocity.y = 1;
            }
            else{
                this.velocity.y = -1;
            }

            if(this.position.x <  this.bounds.x/2){
                this.velocity.x = 1;
            }else{
                this.velocity.x = -1;
            }
        }

        stop(){
            this.velocity = 0;
        }

        update() {
            this.position.add(this.velocity);
            if (this.position.y < -this.size) {
                this.reset();
            }
        }
    }

    class App {
        constructor() {
            this.setup();
            this.getCanvas();
            this.resize();
            this.populate();
            this.render();
        }

        setup() {
            let self = this;
            self.props = Object.assign({}, APP_DEFAULTS);
            self.dimensions = new v2();
            window.onresize = () => {
                self.resize();
            };
        }

        getCanvas() {
            this.canvas = {
                back: document.querySelector('.back'),
                mid: document.querySelector('.mid'),
                front: document.querySelector('.front')
            };

            this.ctx = {
                back: this.canvas.back.getContext('2d'),
                mid: this.canvas.mid.getContext('2d'),
                front: this.canvas.front.getContext('2d')
            };
        }

        resize() {
            for (let c in this.canvas) {
                this.canvas[c].width = this.dimensions.x = window.innerWidth;
                this.canvas[c].height = this.dimensions.y = window.innerHeight;
            }
        }

        populate() {
            this.particles = [];
            for (let i = 0; i < this.props.particleCount; i++) {
                let pCtx = i < 300 ? this.ctx.back : i < 500 ? this.ctx.mid : this.ctx.front,
                    size = i < 300 ? 32 : i < 500 ? 50 : 300,
                    speed = i < 50 ? -0.5 : i < 100 ? -1 : -2,
                    particle = new Particle(size, speed, pCtx, this.dimensions);
                this.particles.push(particle);
            }
        }

        render() {
            let self = this;
            self.draw();
            window.requestAnimationFrame(self.render.bind(self));
        }

        draw() {
            for (let c in this.ctx) {
                this.ctx[c].clearRect(0, 0, this.dimensions.x, this.dimensions.y);
            }
            for (let i = 0, len = this.particles.length; i < len; i++) {
                let p = this.particles[i];
                p.update();
                if(i < 300){
                    let image = document.getElementById("photo-sm");
                    p.ctx.drawImage(image ,p.position.x,p.position.y);
                }
                else if(i < 500 && i > 300){
                    let image = document.getElementById("photo-md");
                    p.ctx.drawImage(image ,p.position.x,p.position.y);
                }
                else{
                    let image = document.getElementById("photo-lg");
                    p.ctx.drawImage(image ,p.position.x,p.position.y);
                }


            }
        }
        stop(){
            let canvas = this.ctx;
            console.log(canvas.canvas);
            for (let key in canvas){
                let canvasStyle = canvas[key].canvas.style;
                canvasStyle.filter = "blur(0px)";
               
            }

            for (let i = 0, len = this.particles.length; i < len; i++) {
                let p = this.particles[i];
                p.stop();

            }

            let self = this;
            setTimeout(function(){  self.drawSvg() },1600);

        }
        focus(){
            let canvas = this.ctx;
            console.log(canvas.canvas);
            for (let key in canvas){
                let canvasStyle = canvas[key].canvas.style;
                canvasStyle.filter = "blur(0px)";
             
            }
        }

        unfocus(){
            let canvas = this.ctx;
            console.log(canvas.canvas);
            for (let key in canvas){
                let canvasStyle = canvas[key].canvas.style;
                canvasStyle.filter = "blur(5px)";
             
            }
        }

        drawSvg(){
            let svg = new Walkway({
                selector: "#logo-svg",
                duration: 1500
            });

            svg.draw(function() {
                for (let i=1; i<=9;i++){

                    let path =  document.getElementsByClassName("cls-"+i)[0];
                    path.style.fill = "url(#linear-gradient-"+i+")";
                }

                let logoText = document.getElementById("deepframe-text");
                logoText.className = "active";
                logoText.parentElement.style.borderLeft = "1px solid #282b82";


                console.log('Animation finished');

            });


        }

    }

    window.onload = () => {
        let app = new App();
      
    setTimeout(function(){
            document.querySelector("canvas").style.filter = "blur(0)";
        },
        3500);
    };

});


