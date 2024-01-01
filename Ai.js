bfs=r=>{let h=[[r.start]],n=[r.start];for(;0!=n.length;){let t=[];for(let e=0;e<n.length;e++){var a={x:n[e].x,y:n[e].y};-1<a.y-1&&0==r.grid[a.x][a.y-1]&&(t.push({x:a.x,y:a.y-1}),r.grid[a.x][a.y-1]=2),-1<a.x-1&&0==r.grid[a.x-1][a.y]&&(t.push({x:a.x-1,y:a.y}),r.grid[a.x-1][a.y]=2),a.y+1<r.grid[a.x].length&&0==r.grid[a.x][a.y+1]&&(t.push({x:a.x,y:a.y+1}),r.grid[a.x][a.y+1]=2),a.x+1<r.grid.length&&0==r.grid[a.x+1][a.y]&&(t.push({x:a.x+1,y:a.y}),r.grid[a.x+1][a.y]=2)}n=t,h.push(n);for(let e=0;e<n.length;e++)if(n[e].x==r.end.x&&n[e].y==r.end.y){let fr=[[r.end]];for(let r=h.length-2;-1<r;r--){fr.push([]);let ep=[];for(let e=0;e<fr[fr.length-2].length;e++)ep.push({x:fr[fr.length-2][e].x,y:fr[fr.length-2][e].y-1}),ep.push({x:fr[fr.length-2][e].x,y:fr[fr.length-2][e].y+1}),ep.push({x:fr[fr.length-2][e].x-1,y:fr[fr.length-2][e].y}),ep.push({x:fr[fr.length-2][e].x+1,y:fr[fr.length-2][e].y});for(let t=0;t<h[r].length;t++)for(let e=0;e<ep.length;e++)if(h[r][t].x==ep[e].x&&h[r][t].y==ep[e].y){fr[fr.length-1].push(h[r][t]);break}}let fp=[];for(let e=fr.length-1;-1<e;e--)fp.push(fr[e]);return fp}}};

random=$=>{
  let q=Math.floor(Math.random()*$.length);
  if($.length==0){
    alert("Problem ahead");
    snake.move(Math.random()<0.25?"u":Math.random()<0.5?"d":Math.random()<0.75?"l":"r");
  }
  if(q>=$.length){
    q=$.length-1;
  }
  return $[q];
};

findroute=$=>{
  if($.x-snake.position[snake.position.length-1].x==1){
    return "r";
  }
  if($.x-snake.position[snake.position.length-1].x==-1){
    return "l";
  }
  if($.y-snake.position[snake.position.length-1].y==1){
    return "d";
  }
  if($.y-snake.position[snake.position.length-1].y==-1){
    return "u";
  }
};

alternative=$=>{
  let head=snake.position[snake.position.length-1];
  let available=[];
  if(head.x+1<$.length?$[head.x+1][head.y]==0:0){
    let g=bfs({start:{x:head.x+1,y:head.y},grid:JSON.parse(JSON.stringify($)),end:snake.position[0]});
    if(g!=undefined){
      available.push({x:head.x+1,y:head.y,ln:g.length});
    }
    if(head.x+1==snake.position[0].x && head.y==snake.position[0].y){
      available.push({x:head.x+1,y:head.y,ln:0});
    }
  }
  if(head.x-1>-1?$[head.x-1][head.y]==0:0){
    let g=bfs({start:{x:head.x-1,y:head.y},grid:JSON.parse(JSON.stringify($)),end:snake.position[0]});
    if(g!=undefined){
      available.push({x:head.x-1,y:head.y,ln:g.length});
    }
    if(head.x-1==snake.position[0].x && head.y==snake.position[0].y){
      available.push({x:head.x-1,y:head.y,ln:0});
    }
  }
  if(head.y+1<$.length?$[head.x][head.y+1]==0:0){
    let g=bfs({start:{x:head.x,y:head.y+1},grid:JSON.parse(JSON.stringify($)),end:snake.position[0]});
    if(g!=undefined){
      available.push({x:head.x,y:head.y+1,ln:g.length});
    }
    if(head.x==snake.position[0].x && head.y+1==snake.position[0].y){
      available.push({x:head.x,y:head.y+1,ln:0});
    }
  }
  if(head.y-1>-1?$[head.x][head.y-1]==0:0){
    let g=bfs({start:{x:head.x,y:head.y-1},grid:JSON.parse(JSON.stringify($)),end:snake.position[0]});
    if(g!=undefined){
      available.push({x:head.x,y:head.y-1,ln:g.length});
    }
    if(head.x==snake.position[0].x && head.y-1==snake.position[0].y){
      available.push({x:head.x,y:head.y-1,ln:0});
    }
  }
  max=available[0];
  for(let i=0;i<available.length;i++){
    if(available[i].ln>max.ln){
      max=available[i];
    }
  }
  let list=[];
  for(let i=0;i<available.length;i++){
    if(available[i].ln==max.ln){
      list.push(available[i]);
    }
  }
  return random(list);
};

AI=$=>{
  let grid=[];
  for(let i=0;i<snake.grid.length;i++){
    grid.push([]);
    for(let j=0;j<snake.grid[i].length;j++){
      grid[i].push(snake.grid[i][j]);
    }
  }
  grid[snake.fruit.x][snake.fruit.y]=0;
  grid[snake.position[0].x][snake.position[0].y]=0;
  let v=bfs({start:snake.position[snake.position.length-1],grid:JSON.parse(JSON.stringify(grid)),end:snake.fruit});
  if(v==undefined){
    return findroute(alternative(grid));
  }
  let available=[];
  for(let i=0;i<v[1].length;i++){
    let n=bfs({start:v[1][i],grid:JSON.parse(JSON.stringify(grid)),end:snake.position[0]});
    if(n!=undefined){
      available.push(v[1][i]);
    }
  }
  if(available.length){
    return findroute(random(available));
  }
  return findroute(alternative(grid));
};
