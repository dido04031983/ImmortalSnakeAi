"use strict";

const defaultTurningWeightFruit=0.05;
const defaultTurningWeightTail=0;
const manhattanMultiWeightFruit=0.0001;
const manhattanPowWeightFruit=1;
const manhattanMultiWeightTail=-0.01;
const manhattanPowWeightTail=-1;
const reachablePosMultiWeightFruit=0.5;
const reachablePosPowWeightFruit=-0.5;
const reachablePosMultiWeightTail=0.5;
const reachablePosPowWeightTail=-0.5;
const weightFruit=[];
for(let i=0;i<30;i++){
  weightFruit.push(new Float32Array(30));
  for(let j=0;j<30;j++){
    weightFruit[i][j]=0.9-2*(Math.max(Math.abs(14.5-i),Math.abs(14.5-j))-0.5)/35;
  }
}
const weightTail=[];
for(let i=0;i<30;i++){
  weightTail.push(new Float32Array(30));
  for(let j=0;j<30;j++){
    weightTail[i][j]=1;
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
  let reachablePosCount=0;
  let fallbackRequired=true;
  let fruitFound={status:false};
  while(true){
    const node=activeNodes.extractMin();
    Dirs.forEach(function(dir){
      const target={x:node.x+dir.x,y:node.y+dir.y};
      if(target.x<0 || target.y<0 || target.x>=grid.data.size || target.y>=grid.data.size || grid[target.x][target.y]&1 || bitCheck(grid[target.x][target.y],4)){
        return;
      }
      if(!fruitFound.status){
        target.value=node.value+weightFruit[target.x][target.y];
      }
      grid[target.x][target.y]=bitAmend(grid[target.x][target.y],1,4);
      activeNodes.insert(target);
      reachablePosCount++;
    });
    if(bitCheck(grid[node.x][node.y],1)){
      node.value+=manhattanMultiWeightFruit*Math.pow(Math.abs(head.x-node.x)+Math.abs(head.y-node.y),manhattanPowWeightFruit)+grid.data.extraWeightFactor*defaultTurningWeightFruit;
      fruitFound={status:true,fruit:node};
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
        grid.data.pathLength=fruitFound.fruit.value+reachablePosMultiWeightFruit*Math.pow(reachablePosCount,reachablePosPowWeightFruit);
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
      const node=activeNodes.extractMin();
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
        +reachablePosMultiWeightTail*Math.pow(reachablePosCount,reachablePosPowWeightTail)+grid.data.extraWeightFactor*defaultTurningWeightTail;
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

const AI=function(){
  const head=snake.position[snake.position.length-1];
  const searchMaps=[
    {x:1,y:0,cmd:"r"},{x:-1,y:0,cmd:"l"},
    {x:0,y:1,cmd:"d"},{x:0,y:-1,cmd:"u"}
  ].map(function(dir){
    const subHead=snake.position[snake.position.length-2];
    let extraWeightFactor=1;
    if(head.x-subHead.x==dir.x && head.y-subHead.y==dir.y){
      extraWeightFactor=0;
    }
    return{x:head.x+dir.x,y:head.y+dir.y,cmd:dir.cmd,extraWeightFactor};
  }).filter(function(position){
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
      extraWeightFactor:position.extraWeightFactor
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
  if(heuristic.promising.length==0){
    if(heuristic.safe.length==0){
      snake.draw(ctx,canvas.width);
      throw new Error("Edge case probably");
    }else{
      return heuristic.safe[heuristic.safe.length-1].cmd;
    }
  }else{
    return heuristic.promising[0].cmd;
  }
};