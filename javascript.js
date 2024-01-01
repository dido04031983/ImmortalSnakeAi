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
    this.grid=[];
    for(let i=0;i<this.gridsize;i++){
      this.grid.push([]);
      for(let j=0;j<this.gridsize;j++){
        this.grid[i].push(0);
      }
    }
    this.grid[0][0]=1;
    this.grid[1][0]=1;
    this.grid[2][0]=1;
    this.grid[3][0]=1;
    this.grid[this.gridsize-1][this.gridsize-1]=2;
    this.fruit={x:this.gridsize-1,y:this.gridsize-1};
    this.moves=0;
  }
  removetail(){
    let tail=this.position.splice(0,1);
    this.grid[tail[0].x][tail[0].y]=0;
  }
  newfruit(){
    let emptyspots=[];
    for(let i=0;i<this.grid.length;i++){
      for(let j=0;j<this.grid[i].length;j++){
        if(this.grid[i][j]==0){
          emptyspots.push({x:i,y:j});
        }
      }
    }
    if(emptyspots.length==0){
      window.alert("You won");
      window.close();
    }
    let random=Math.floor(Math.random()*emptyspots.length-1e-6);
    this.grid[emptyspots[random].x][emptyspots[random].y]=2;
    this.fruit={x:emptyspots[random].x,y:emptyspots[random].y};
  }
  move(command){
    let head=JSON.parse(JSON.stringify(this.position[this.position.length-1]));
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
    if(head.x<0 || head.x>=this.grid.length || head.y<0 || head.y>=this.grid[0].length){
      return "shit";
    }
    if(this.grid[head.x][head.y]==0){
      this.position.push(head);
      this.grid[head.x][head.y]=1;
      this.removetail();
      this.moves++;
      return "done";
    }
    if(this.grid[head.x][head.y]==1){
      if(this.position[0].x==head.x && this.position[0].y==head.y){
        this.removetail();
        this.position.push(head);
        this.grid[head.x][head.y]=1;
        this.moves++;
        return "done";
      }
      return "shit";
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
