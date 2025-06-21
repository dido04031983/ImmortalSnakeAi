"use strict";

let defaultTurningWeightFruit=0.3318041603685295;
let defaultTurningWeightTail=-0.36411346391901367;
let manhattanMultiWeightFruit=-1.3307381036750656;
let manhattanPowWeightFruit=-0.3859242473486551;
let manhattanMultiWeightTail=1.3537268649843788;
let manhattanPowWeightTail=1.5219678824857845;
let leftParityMultiWeightFruit=-0.09487473986502276;
let rightParityMultiWeightFruit=-0.09487473986502276;
let leftParityMultiWeightTail=-1.6227999074188488;
let rightParityMultiWeightTail=-1.6227999074188488;

const weightFruit=[];
for(let i=0;i<30;i++){
  weightFruit.push(new Float32Array(30));
  for(let j=0;j<30;j++){
    weightFruit[i][j]=0.9-(Math.max(Math.abs(14.5-i),Math.abs(14.5-j))-0.5)/17.5;
  }
}
const weightTail=[];
for(let i=0;i<30;i++){
  weightTail.push(new Float32Array(30));
  for(let j=0;j<30;j++){
    weightTail[i][j]=weightFruit[i][j];
  }
}

const bitCheck=function(num,pos){
  return (num>>pos)&1;
};
const bitAmend=function(num,val,pos){
  return val==0?num&(255^(1<<pos)):num|(1<<pos);
};

const BfsSearch=function(grid){
  const Dirs=[
    {x:1,y:0},{x:-1,y:0},
    {x:0,y:1},{x:0,y:-1}
  ];
  const head=grid.data.head;
  let activeNodes=new Minheap();
  activeNodes.insert({x:head.x,y:head.y,value:0});
  let fallbackRequired=true;
  let fruitFound={status:false};
  while(true){
    const node=activeNodes.extract();
    Dirs.forEach(function(dir){
      const target={x:node.x+dir.x,y:node.y+dir.y};
      if(target.x<0 || target.y<0 || target.x>=grid.data.size || target.y>=grid.data.size || grid[target.x][target.y]&1 || bitCheck(grid[target.x][target.y],4)){
        return;
      }
      target.value=node.value+weightFruit[target.x][target.y];
      grid[target.x][target.y]=bitAmend(grid[target.x][target.y],1,4);
      activeNodes.insert(target);
    });
    if(bitCheck(grid[node.x][node.y],1)){
      node.value+=manhattanMultiWeightFruit*Math.pow(Math.abs(head.x-node.x)+Math.abs(head.y-node.y),manhattanPowWeightFruit)
      +grid.data.turningWeightFactor*defaultTurningWeightFruit
      +grid.data.leftParityWeightFactor*leftParityMultiWeightFruit
      +grid.data.rightParityWeightFactor*rightParityMultiWeightFruit;
      fruitFound={status:true,fruit:node};
      break;
    }
    if(activeNodes.isEmpty()){
      grid[grid.data.secondTail.x][grid.data.secondTail.y]=bitAmend(grid[grid.data.secondTail.x][grid.data.secondTail.y],0,0);
      break;
    }
  }
  if(fruitFound.status){
    activeNodes=[fruitFound.fruit];
    while(true){
      const node=activeNodes.shift();
      Dirs.forEach(function(dir){
        const target={x:node.x+dir.x,y:node.y+dir.y};
        if(target.x<0 || target.y<0 || target.x>=grid.data.size || target.y>=grid.data.size || grid[target.x][target.y]&1 || bitCheck(grid[target.x][target.y],5)){
          return;
        }
        grid[target.x][target.y]=bitAmend(grid[target.x][target.y],1,5);
        activeNodes.push(target);
      });
      if(bitCheck(grid[node.x][node.y],3)){
        grid.data.pathLength=fruitFound.fruit.value;
        grid.data.isPromising=true;
        fallbackRequired=false;
        break;
      }
      if(activeNodes.length==0){
        grid[grid.data.secondTail.x][grid.data.secondTail.y]=bitAmend(grid[grid.data.secondTail.x][grid.data.secondTail.y],0,0);
        break;
      }
    }
  }
  if(fallbackRequired && !bitCheck(grid[head.x][head.y],1)){
    activeNodes=new Minheap();
    activeNodes.insert({x:head.x,y:head.y,value:0});
    while(true){
      const node=activeNodes.extract();
      Dirs.forEach(function(dir){
        const target={x:node.x+dir.x,y:node.y+dir.y};
        if(target.x<0 || target.y<0 || target.x>=grid.data.size || target.y>=grid.data.size || grid[target.x][target.y]&1 || bitCheck(grid[target.x][target.y],6)){
          return;
        }
        target.value=node.value+weightTail[target.x][target.y];
        grid[target.x][target.y]=bitAmend(grid[target.x][target.y],1,6);
        activeNodes.insert(target);
      });
      if(bitCheck(grid[node.x][node.y],2)){
        node.value+=manhattanMultiWeightTail*Math.pow(Math.abs(head.x-node.x)+Math.abs(head.y-node.y),manhattanPowWeightTail)
        +grid.data.turningWeightFactor*defaultTurningWeightTail;
        +grid.data.leftParityWeightFactor*leftParityMultiWeightTail
        +grid.data.rightParityWeightFactor*rightParityMultiWeightTail;
        grid.data.pathLength=node.value;
        grid.data.isSafe=true;
        break;
      }
      if(activeNodes.isEmpty()){
        break;
      }
    }
  }
  return grid.data;
};

const Algorithm=function(){
  const head=snake.position[snake.position.length-1];
  const searchMaps=[
    {x:1,y:0,cmd:"r"},{x:-1,y:0,cmd:"l"},
    {x:0,y:1,cmd:"d"},{x:0,y:-1,cmd:"u"}
  ].map(function(dir){
    const subHead=snake.position[snake.position.length-2];
    let turningWeightFactor=1;
    let leftParityWeightFactor=0;
    let rightParityWeightFactor=0;
    if(head.x-subHead.x==dir.x && head.y-subHead.y==dir.y){
      turningWeightFactor=0;
    }
    const newPos={x:head.x+dir.x,y:head.y+dir.y};
    const leftyPos={x:newPos.x+dir.y,y:newPos.y-dir.x};
    const rightyPos={x:newPos.x-dir.y,y:newPos.y+dir.x};
    if(!(leftyPos.x<0 || leftyPos.y<0 || leftyPos.x>=snake.gridsize || leftyPos.y>=snake.gridsize) && snake.grid[leftyPos.x][leftyPos.y]==1){
      leftParityWeightFactor=1;
    }
    if(!(rightyPos.x<0 || rightyPos.y<0 || rightyPos.x>=snake.gridsize || rightyPos.y>=snake.gridsize) && snake.grid[rightyPos.x][rightyPos.y]==1){
      rightParityWeightFactor=1;
    }
    return{x:newPos.x,y:newPos.y,cmd:dir.cmd,turningWeightFactor,leftParityWeightFactor,rightParityWeightFactor};
  }).filter(function(position){
    /*ham filter*/
    if(position.x<0 || position.y<0 || position.x>=snake.gridsize || position.y>=snake.gridsize || snake.grid[position.x][position.y]==1){
      if(position.x==snake.position[0].x && position.y==snake.position[0].y){
        return true;
      }
      return false;
    }
    return true;
  }).map(function(position){
    const map=[];
    snake.grid.forEach(function(uarr){
      map.push(new Uint8Array(uarr));
    });
    map[position.x][position.y]=bitAmend(map[position.x][position.y],1,0);
    map[snake.position[0].x][snake.position[0].y]=8;
    map[snake.position[1].x][snake.position[1].y]=5;
    map.data={
      head:{x:position.x,y:position.y},
      secondTail:{x:snake.position[1].x,y:snake.position[1].y},
      cmd:position.cmd,size:snake.gridsize,
      turningWeightFactor:position.turningWeightFactor,
      leftParityWeightFactor:position.leftParityWeightFactor,
      rightParityWeightFactor:position.rightParityWeightFactor
    };
    return map;
  });
  const heuristic={
    promising:[],
    safe:[]
  };
  searchMaps.forEach(function(map){
    const result=BfsSearch(map);
    if(result.isPromising){
      heuristic.promising.push(result);
    }
    if(result.isSafe){
      heuristic.safe.push(result);
    }
  });
  heuristic.promising.sort(function(a,b){
    return a.pathLength-b.pathLength;
  });
  heuristic.safe.sort(function(a,b){
    return b.pathLength-a.pathLength;
  });
  return heuristic;
};

const AI=function(){
  const heuristic=Algorithm();
  if(heuristic.promising.length==0){
    if(heuristic.safe.length==0){
      snake.draw(ctx,canvas.width);
      throw new Error("Edge case probably");
    }else{
      return heuristic.safe[0].cmd;
    }
  }else{
    return heuristic.promising[0].cmd;
  }
};