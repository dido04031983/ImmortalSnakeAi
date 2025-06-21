"use strict";

class game{
  constructor($){
    this.gridsize=$.gridsize;
    this.extraborder=$.extraborder;
    this.border=$.border;
    this.extrabordercolor=$.extrabordercolor;
    this.bordercolor=$.bordercolor;
    this.snakecolor=$.snakecolor;
    this.fruitcolor=$.fruitcolor;
    this.position=[
      {x:0,y:0},
      {x:1,y:0},
      {x:2,y:0},
      {x:3,y:0},
    ];
    const stg=this.grid=[];
    for(let i=0;i<this.gridsize;i++){
      this.grid.push(new Uint8Array(this.gridsize));
    }
    this.position.forEach(function(pos){
      stg[pos.x][pos.y]=1;
    });
    const gsm1=this.gridsize-1;
    this.fruit={x:gsm1,y:gsm1};
    this.grid[this.fruit.x][this.fruit.y]=2;
    this.movestilllastfruit=0;
    this.finished=false;
    this.moves=0;
  }
  removetail(updateGrid=true){
    let tail=this.position.splice(0,1)[0];
    if(updateGrid){
      this.grid[tail.x][tail.y]=0;
    }
  }
  newfruit(){
    let emptyspots=[];
    this.grid.forEach(function(wz,i){
      wz.forEach(function(val,j){
        if(val==0){
          emptyspots.push({x:i,y:j});
        }
      });
    });
    if(emptyspots.length==0){
      window.alert(`You won in ${this.moves} moves!`);
      this.finished=true;
      return;
    }
    this.fruit=emptyspots[Math.floor(Math.random()*emptyspots.length-1e-6)];
    this.grid[this.fruit.x][this.fruit.y]=2;
    this.movestilllastfruit=0;
  }
  move(command){
    if(this.finished){
      return;
    }
    const headref=this.position[this.position.length-1];
    const head={x:headref.x,y:headref.y};
    if(command=="u"){
      head.y--;
    }
    if(command=="d"){
      head.y++;
    }
    if(command=="l"){
      head.x--;
    }
    if(command=="r"){
      head.x++;
    }
    if(head.x<0 || head.x>=this.gridsize || head.y<0 || head.y>=this.gridsize){
      window.alert("You lost");
      this.finished=true;
    }
    if(this.grid[head.x][head.y]==0){
      this.position.push(head);
      this.grid[head.x][head.y]=1;
      this.movestilllastfruit++;
      this.removetail();
      this.moves++;
      return "done";
    }
    if(this.grid[head.x][head.y]==1){
      if(this.position[0].x==head.x && this.position[0].y==head.y){
        this.removetail(false);
        this.position.push(head);
        this.movestilllastfruit++;
        this.moves++;
        return "done";
      }
      window.alert("You lost");
      this.finished=true;
    }
    if(this.grid[head.x][head.y]==2){
      this.position.push(head);
      this.grid[head.x][head.y]=1;
      this.newfruit();
      this.moves++;
      return "yumm";
    }
  }
  draw(context,width){
    context.lineWidth=(width-2*this.extraborder-this.border*(this.gridsize+1))/this.gridsize;
    context.lineCap="round";
    context.strokeStyle=this.snakecolor;
    context.fillStyle=this.extrabordercolor;
    context.fillRect(0,0,width,width);
    context.fillStyle=this.bordercolor;
    context.fillRect(this.extraborder,this.extraborder,width-2*this.extraborder,width-2*this.extraborder);
    context.fillStyle=this.fruitcolor;
    context.beginPath();
    context.arc(this.extraborder+this.border+this.fruit.x*(context.lineWidth+this.border)+context.lineWidth/2,this.extraborder+this.border+this.fruit.y*(context.lineWidth+this.border)+context.lineWidth/2,context.lineWidth/2,0,2*Math.PI);
    context.fill();
    for(let i=this.position.length-1;i>0;i--){
      if(i==1){
        context.lineCap="square";
      }
      context.beginPath();
      context.moveTo(this.extraborder+this.border+this.position[i].x*(context.lineWidth+this.border)+context.lineWidth/2,this.extraborder+this.border+this.position[i].y*(context.lineWidth+this.border)+context.lineWidth/2);
      context.lineTo(this.extraborder+this.border+this.position[i-1].x*(context.lineWidth+this.border)+context.lineWidth/2,this.extraborder+this.border+this.position[i-1].y*(context.lineWidth+this.border)+context.lineWidth/2);
      context.stroke();
    }
  }
}