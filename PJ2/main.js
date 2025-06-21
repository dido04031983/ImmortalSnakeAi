"use strict";

//Setup
const qualitydrop=1;//0.333510825131;
const canvas=document.querySelector("canvas");
if(window.innerWidth<window.innerHeight){
  canvas.width=window.innerWidth*qualitydrop;
  canvas.height=window.innerWidth*qualitydrop;
  canvas.style.width="calc(100vw - 4px)";
  canvas.style.height="calc(100vw - 4px)";
}else{
  canvas.width=window.innerHeight*qualitydrop;
  canvas.height=window.innerHeight*qualitydrop;
  canvas.style.width="calc(100vh - 4px)";
  canvas.style.height="calc(100vh - 4px)";
}
const ctx=canvas.getContext("2d");

//Game
const gradient=ctx.createLinearGradient(0,0,canvas.width,canvas.width);
gradient.addColorStop(0,"red");
gradient.addColorStop(0.2,"yellow");
gradient.addColorStop(0.4,"green");
gradient.addColorStop(0.6,"cyan");
gradient.addColorStop(0.8,"blue");
gradient.addColorStop(1,"magenta");
let snake=new game({gridsize:30,extraborder:1,border:2,extrabordercolor:"#808080",bordercolor:"#010101",snakecolor:gradient,fruitcolor:"#ffffff"});

//Animate
let speed=1;
let paused=false;
window.Animate=function(){
  if(!paused){
    let v=window.performance.now();
    for(let i=0;i<speed;i++){
      snake.move(AI());
    }
    snake.draw(ctx,canvas.width);
    v-=window.performance.now();
    if(v>-16){
      speed++;
    }else if(v<-20){
      speed--;
    }
  }
  if(!snake.finished && snake.movestilllastfruit<=1800){
    return requestAnimationFrame(window.Animate);
  }else{
  }
};
window.Animate();
canvas.addEventListener("touchstart",function(){
  paused=true;
});
canvas.addEventListener("touchend",function(){
  paused=false;
});