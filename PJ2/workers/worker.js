"use strict";
class Minheap{
  constructor(){
    this.heap=[];
  }
  insert(node){
    this.heap.push(node);
    let i=this.heap.length-1;
    while(i>0){
      let p=(i-1)>>1;
      if(this.heap[i].value >= this.heap[p].value){
        break;
      }
      [this.heap[i],this.heap[p]]=[this.heap[p],this.heap[i]];
      i=p;
    }
  }
  extract(){
    if(this.heap.length==1){
      return this.heap.pop();
    }
    const min=this.heap[0];
    this.heap[0]=this.heap.pop();
    let i=0;
    const n=this.heap.length;
    while(true){
      let left=2*i+1,right=2*i+2;
      let smallest = i;
      if(left<n && this.heap[left].value<this.heap[smallest].value){
        smallest=left;
      }
      if(right<n && this.heap[right].value<this.heap[smallest].value){
        smallest=right;
      }
      if(smallest==i){
        break;
      }
      [this.heap[i],this.heap[smallest]]=[this.heap[smallest],this.heap[i]];
      i=smallest;
    }
    return min;
  }
  isEmpty(){
    return this.heap.length==0;
  }
}
class Maxheap{
  constructor(){
    this.heap=[];
  }
  insert(node){
    this.heap.push(node);
    let i=this.heap.length-1;
    while(i>0){
      let p=(i-1)>>1;
      if(this.heap[i].value<=this.heap[p].value){
        break;
      }
      [this.heap[i],this.heap[p]]=[this.heap[p],this.heap[i]];
      i=p;
    }
  }
  extract(){
    if(this.heap.length==1){
      return this.heap.pop();
    }
    const max=this.heap[0];
    this.heap[0]=this.heap.pop();
    let i=0;
    const n=this.heap.length;
    while(true){
      let left=2*i+1,right=2*i+2;
      let largest=i;
      if(left<n && this.heap[left].value>this.heap[largest].value){
        largest=left;
      }
      if(right<n && this.heap[right].value>this.heap[largest].value){
        largest=right;
      }
      if(largest==i){
        break;
      }
      [this.heap[i],this.heap[largest]]=[this.heap[largest],this.heap[i]];
      i=largest;
    }
    return max;
  }
  isEmpty(){
    return this.heap.length==0;
  }
}
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
    this.movedata=[];
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
      this.movedata.push(this.movestilllastfruit);
      this.finished=true;
      return;
    }
    this.fruit=emptyspots[Math.floor(Math.random()*emptyspots.length-1e-6)];
    this.grid[this.fruit.x][this.fruit.y]=2;
    this.movedata.push(this.movestilllastfruit);
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
      this.movestilllastfruit++;
      this.newfruit();
      this.moves++;
      return "yumm";
    }
  }
}
let snake;
let defaultTurningWeightFruit;
let defaultTurningWeightTail;
let manhattanMultiWeightFruit;
let manhattanPowWeightFruit;
let manhattanMultiWeightTail;
let manhattanPowWeightTail;
let leftParityMultiWeightFruit;
let rightParityMultiWeightFruit;
let leftParityMultiWeightTail;
let rightParityMultiWeightTail;
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
    weightTail[i][j]=1;
  }
}
let avgNum=2;
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
      throw new Error("Edge case probably");
    }else{
      return heuristic.safe[0].cmd;
    }
  }else{
    return heuristic.promising[0].cmd;
  }
};
const SIM=function(ingredients){
  snake=new game({gridsize:30});
  [defaultTurningWeightFruit,defaultTurningWeightTail,manhattanMultiWeightFruit,manhattanPowWeightFruit,manhattanMultiWeightTail,manhattanPowWeightTail,leftParityMultiWeightFruit,leftParityMultiWeightTail]=ingredients;
  rightParityMultiWeightFruit=leftParityMultiWeightFruit;
  rightParityMultiWeightTail=leftParityMultiWeightTail;
  while(!snake.finished && snake.movestilllastfruit<=1800){
    snake.move(AI());
  }
  return{ingr:ingredients,avgNum,ingredients:{
    defaultTurningWeightFruit,
    defaultTurningWeightTail,
    manhattanMultiWeightFruit,
    manhattanPowWeightFruit,
    manhattanMultiWeightTail,
    manhattanPowWeightTail,
    leftParityMultiWeightFruit,
    rightParityMultiWeightFruit,
    leftParityMultiWeightTail,
    rightParityMultiWeightTail
  },movedata:snake.movedata,
  moves:snake.moves,
  squares:snake.position.length};
};



const fs=require('fs');
const path=require('path');
let codename;
let filecount=0;
const findFirstJsonFile=function(dirPath){
  try{
    const entries=fs.readdirSync(dirPath,{ withFileTypes:true});
    for(const entry of entries){
      if(entry.isFile() &&
        entry.name.toLowerCase().endsWith('.json') && (entry.name.split("-")[0]==codename || codename==undefined)){
        return entry.name;
      }
    }
  }catch(err){
    return {ErrorText:`Error reading directory: ${err}`};
  }
  return null;
};
const readAndDeleteJson=function(filePath){
  try{
    const content=fs.readFileSync(filePath,'utf8');
    const data=JSON.parse(content);
    fs.unlinkSync(filePath);
    filecount++;
    return data;
  }catch (err){
    return `Error parsing file: ${err}`;
  }
};
const addError=function(text,code=(function(){
  if(codename!=undefined){
    return codename;
  }
  const alpha="QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm";
  let str="";
  for(let i=0;i<12;i++){
    str+=alpha[Math.floor(Math.random()*alpha.length)];
  }
  return str;
})()){
  const filePath=path.join("./error/",`${code}.txt`);
  try{
    fs.appendFileSync(filePath,text+"\n","utf-8");
  }catch(err){
    console.error(`Unable to output errors: ${err}`);
  }
};
function outputToJsonFile(filePath,newItem){
  try{
    fs.writeFileSync(filePath,JSON.stringify(newItem),'utf8');
  }catch(err){
    addError(`Failed to Add Solution file ${filePath}: ${err}`);
  }
}
const sumSimData=function(data1,data2){
  const moveArr=[],maxLen=Math.max(data1.movedata.length,data2.movedata.length);
  for(let i=0;i<maxLen;i++){
    moveArr.push((data1.movedata.length>i?data1.movedata[i]:0)+(data2.movedata.length>i?data2.movedata[i]:0));
  }
  return{
    ingr:data1.ingr,avgNum:data1.avgNum,
    ingredients:data1.ingredients,
    movedata:moveArr,
    moves:data1.moves+data2.moves,
    squares:data1.squares+data2.squares
  };
};
const divSimData=function(data,factor){
  const moveArr=[];
  for(let i=0;i<data.movedata.length;i++){
    moveArr.push(data.movedata[i]/factor);
  }
  return{
    ingr:data.ingr,avgNum:data.avgNum,
    ingredients:data.ingredients,
    movedata:moveArr,
    moves:data.moves/factor,
    squares:data.squares/factor
  };
};
const Communicate=function(){
  let file;
  while(typeof(file)!="string"){
    file=findFirstJsonFile("./input/");
    if(file==null || typeof(file)=="object"){
      addError("Failed to find file in input dir: "+file.ErrorText);
    }
  }
  if(codename==undefined){
    codename=file.split("-")[0];
    fs.writeFileSync(path.join("./bridge/",codename+".json"),JSON.stringify({filecount:1,avgNum}),'utf8');
  }
  const ingredients=readAndDeleteJson(path.join("./input/",file));
  if(typeof(ingredients)=="string"){
    addError("Failed to read and delete input json: "+ingredients);
  }else{
    let result=SIM(ingredients);
    if(result.squares<720 || result.moves/result.squares>220){
      return;
    }
    for(let simNo=1;simNo<avgNum;simNo++){
      const newResult=SIM(ingredients);
      if(newResult.squares<720 || newResult.moves/newResult.squares>220){
        return;
      }
      result=sumSimData(result,newResult);
    }
    outputToJsonFile(path.join("./output/",file),divSimData(result,avgNum));
  }
};
const sleepSync=function(ms){
  const sab=new SharedArrayBuffer(4);
  const int32=new Int32Array(sab);
  Atomics.wait(int32,0,0,ms);
};
while(true){
  if(codename==undefined){
    Communicate();
    continue;
  }
  try{
    const bridgeData=fs.readFileSync(path.join("./bridge/",`${codename}.json`),'utf8');
    const bridge=JSON.parse(bridgeData);
    avgNum=bridge.avgNum;
    if(bridge.filecount>filecount){
      for(let i=0;i<bridge.filecount-filecount;i++){
        Communicate();
      }
    }else{
      sleepSync(1000);
    }
  }catch(err){
    console.warn("Race condition. Python's probably writing bridge file");
    sleepSync(50);
  }
}