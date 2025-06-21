import os,json,time,random
import threading,subprocess
import multiprocessing,itertools

NODE_PATH="node"
SCRIPT_PATH="./worker.js"
avg_num=2

def timed_input(prompt,timeout):
  result=[None]
  def get_input():
    result[0]=input(prompt)
  input_thread=threading.Thread(target=get_input)
  input_thread.daemon=True
  input_thread.start()
  input_thread.join(timeout)
  if input_thread.is_alive():
    print()
    return None
  return result[0]

def run_communicate(args):
  try:
    result=subprocess.run(
      [NODE_PATH,SCRIPT_PATH],
      capture_output=True,
      text=True,
      check=True
    )
    return "OK",result.stdout.strip()
  except subprocess.CalledProcessError as e:
    return "ERROR",e.stderr.strip()
  except Exception as e:
    return "ERROR",str(e)

def ensure_boundary(vec):
  arr=[]
  for i in vec:
    if i>0 and i<1e-3:
      arr.append(1e-3)
    elif i<0 and i>-1e-3:
      arr.append(-1e-3)
    elif i>2:
      arr.append(2)
    elif i<-2:
      arr.append(-2)
    else:
      arr.append(i)
  return arr

def random_input_gen():
  arr=[]
  for i in range(8):
    rawRand=random.random()
    if rawRand<0.5:
      rand=3.998*rawRand-2
    elif rawRand>=0.5:
      rand=3.998*rawRand-1.998
    arr.append(rand)
  return arr
  
def input_generator(codename):
  global Processes
  code=None
  for i in range(len(Processes)):
    if codename==Processes[i][0]:
      code=i
      break
  if code==None:
    return random_input_gen()
  if code==0:
    return random_input_gen() # complete chaos
  if code==14:
    if os.path.isdir(os.path.join("./results/",codename)):
      filechoice=str(random.choices(range(1,16),weights=range(15,0,-1))[0])+".json"
      try:
        with open(os.path.join("./results/",codename,filechoice)) as f:
          prevVec=json.load(f)["ingr"]
        newVec=[i+(2*random.random()-1)*0.0005 for i in prevVec] # no obstacles
        return ensure_boundary(newVec)
      except:
        return random_input_gen()
    else:
      return random_input_gen()
  factor=0.1083-0.00825*i
  vector=[factor*random.random() for i in range(8)]
  choice=random.randint(1,10)
  if choice==1:
    targetcode=Processes[random.randint(0,code-1)][0]
  elif choice<5:
    targetcode=codename
  else:
    targetcode=Processes[random.randint(code+1,14)][0]
  if os.path.isdir(os.path.join("./results/",targetcode)):
    filechoice=str(random.choices(range(1,16),weights=range(15,0,-1))[0])+".json"
    try:
      with open(os.path.join("./results/",targetcode,filechoice)) as f:
        prevVec=json.load(f)["ingr"]
      newVec=[i+(2*random.random()-1)*factor for i in prevVec]
      return ensure_boundary(newVec)
    except:
      return random_input_gen()
  else:
    return random_input_gen()

def displace_file_to_tmp(loc_file):
  new_loc=os.path.join("./results/tmp/",random_generator()+".json")
  os.rename(loc_file,new_loc)
  return new_loc

def sort_outputs_to_results():
  global Processes
  global avg_num
  outputfiles=[[os.path.join("./output/",f)] for f in os.listdir("./output/") if os.path.isfile(os.path.join("./output/",f)) and f.endswith(".json")]
  print(len(outputfiles),"Results this batch.")
  if len(outputfiles)>0 and avg_num<12:
    avg_num+=1
  for i in Processes:
    if os.path.isdir(os.path.join("./results/",i[0])):
      otherfiles=[os.path.join("./results/",i[0],f) for f in os.listdir(os.path.join("./results/",i[0])) if f.endswith(".json")]
      for j in otherfiles:
        outputfiles.append([displace_file_to_tmp(j)])
    else:
      os.mkdir(os.path.join("./results/",i[0]))
  for i in outputfiles:
    with open(i[0],"r") as f:
      data=json.load(f)
      i.append(1125*data["avgNum"]+data["squares"]+225-data["moves"]/data["squares"])
  sortedFiles=sorted(outputfiles,key=lambda x:-x[1])
  for i in range(len(sortedFiles)):
    j=sortedFiles[i][0]
    if i>224:
      os.remove(j)
      continue
    os.rename(j,os.path.join("./results/",Processes[14-(i//15)][0],str((i%15)+1)+".json"))

def random_generator():
  alpha="QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm"
  string=""
  for i in range(12):
    string+=alpha[random.randint(0,len(alpha)-1)]
  return string

simDataFinished=False
def update_dirs(code,num):
  global simDataFinished
  global avg_num
  anum=0
  for i in range(num):
    try:
      ingr=input_generator(code)
    except:
      simDataFinished=True
      break
    with open(os.path.join("./input/",code+"-"+random_generator()+".json"),"w") as f:
      json.dump(ingr,f)
      anum+=1
  while True:
    try:
      with open(os.path.join("./bridge/",code+".json"),"r") as f:
        brdg=json.load(f)
      brdg["filecount"]+=anum
      brdg["avgNum"]=avg_num
      with open(os.path.join("./bridge/",code+".json"),"w") as f:
        json.dump(brdg,f)
      return anum
    except:
      print("Error Writing bridge file.")


Processes=[]
def main():
  global simDataFinished
  global Processes
  for i in range(15):
    sPrs=[random_generator()]
    print("Selecting Worker for the first time")
    sPrs.append(multiprocessing.Process(target=run_communicate,args=(None,)))
    with open("./input/"+sPrs[0]+"-"+random_generator()+".json","w") as f:
      json.dump(random_input_gen(),f)
    sPrs[1].start()
    time.sleep(0.5)
    while len([f for f in os.listdir("./bridge/") if f==sPrs[0]+".json"])!=1:
      time.sleep(0.05)
    print("Worker stablised")
    Processes.append(sPrs)
  while simDataFinished==False:
    files=[f for f in os.listdir("./input/") if os.path.isfile(os.path.join("./input/",f)) and f.endswith(".json")]
    for sPrs in Processes:
      num=8
      for i in files:
        name=i.split("-")[0]
        if name==sPrs[0]:
          num-=1
      if num!=0 and simDataFinished==False:
        tasknum=update_dirs(sPrs[0],num)
        print("Assigning",tasknum,"Tasks to Worker")
    sort_outputs_to_results()
    time.sleep(10)
    #cmd=timed_input("This interface is on timeout. Abort (n/N)? ",5)
    #if cmd=="n" or cmd=="N":
    #  simDataFinished=True
  print("Cleaning up...")
  while len([f for f in os.listdir("./input/") if os.path.isfile(os.path.join("./input/",f)) and f.endswith(".json")])!=0:
    time.sleep(1)
  for sPrs in Processes:
    sPrs[1].terminate()
    print("Process terminated.")
  print("Cleaned Up.")

if __name__=="__main__":
  main()
