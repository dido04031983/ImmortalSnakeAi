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