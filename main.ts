import{mkdirSync,readdirSync,readFileSync,writeFileSync}from"node:fs";
import{join}from"node:path";
const I=process.env.MAKEFUN_INPUT_DIR??"/input",O=process.env.MAKEFUN_OUTPUT_DIR??"/output";
const LOWPOPS=[0,0,0,1,1,2,2,3];
function run(p:Uint8Array,q:Uint8Array){
 const D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),o=new Uint8Array(65536);
 let s=0,c=0,pc=0,t=0,ol=0,ip=0;const n=p.length;
 const end=(e:number)=>({o:o.slice(0,ol),c:e});
 for(;;){
  if(t===1e6)return end(10);
  if(pc<0||pc>=n)return end(9);
  const k=p[pc];
  if(!(k<8||k>=16&&k<=34&&k!==31||k>=48&&k<=52||k===64||k===65||k>=80&&k<=83))return end(5);
  const im=k===1?1:k===2?4:k>=48&&k<=51?2:0,nx=pc+1+im;
  if(pc+im>=n)return end(9);
  t++;
  const u=k<8?LOWPOPS[k]:k>=16&&k<=34?(k===23||k===27?1:2):k===49||k===50||k===64||k===80||k===81||k===83?1:k===65?2:0;
  const v=k===1||k===2||k===64||k===82?1:k===4||k===5?2:k===6||k===7?3:k>=16&&k<=34?1:0;
  if(s<u)return end(2);
  if(s-u+v>256)return end(3);
  pc=nx;
  if(k>=16&&k<=34){
   if(k===23){D[s-1]=-D[s-1]|0;continue;}
   if(k===27){D[s-1]=~D[s-1];continue;}
   const b=D[s-1],a=D[s-2];let r:number;
   if(k===16)r=a+b|0;
   else if(k===17)r=a-b|0;
   else if(k===18)r=Math.imul(a,b);
   else if(k===19){if(!b)return end(4);r=a===-2147483648&&b===-1?a:(a/b)|0;}
   else if(k===20){if(!b)return end(4);r=b===-1?0:a%b|0;}
   else if(k===21){if(!b)return end(4);r=Math.floor((a>>>0)/(b>>>0))|0;}
   else if(k===22){if(!b)return end(4);r=(a>>>0)%(b>>>0)|0;}
   else if(k===24)r=a&b;
   else if(k===25)r=a|b;
   else if(k===26)r=a^b;
   else if(k===28)r=a<<(b&31);
   else if(k===29)r=a>>(b&31);
   else if(k===30)r=a>>>(b&31)|0;
   else if(k===32)r=a===b?1:0;
   else if(k===33)r=a<b?1:0;
   else r=(a>>>0)<(b>>>0)?1:0;
   s-=2;D[s++]=r;continue;
  }
  switch(k){
   case 0:return end(0);
   case 1:D[s++]=(p[nx-1]<<24)>>24;break;
   case 2:D[s++]=p[nx-4]|p[nx-3]<<8|p[nx-2]<<16|p[nx-1]<<24;break;
   case 3:s--;break;
   case 4:D[s]=D[s-1];s++;break;
   case 5:{const x=D[s-1];D[s-1]=D[s-2];D[s-2]=x;break;}
   case 6:D[s]=D[s-2];s++;break;
   case 7:{const a=D[s-3];D[s-3]=D[s-2];D[s-2]=D[s-1];D[s-1]=a;break;}
   case 48:case 49:case 50:{
    const r=((p[nx-2]|p[nx-1]<<8)<<16)>>16;let g=1;
    if(k!==48){const w=D[--s];g=k===49?w===0:w!==0;}
    if(g)pc=nx+r;break;}
   case 51:
    if(c===64)return end(7);
    C[c++]=nx;pc=p[nx-2]|p[nx-1]<<8;break;
   case 52:
    if(!c)return end(8);
    pc=C[--c];break;
   case 64:{const a=D[s-1];if(a<0||a>255)return end(6);D[s-1]=M[a];break;}
   case 65:{const a=D[s-1],w=D[s-2];if(a<0||a>255)return end(6);s-=2;M[a]=w;break;}
   case 80:{const b=Buffer.from(String(D[s-1]));if(ol+b.length>65536)return end(11);s--;o.set(b,ol);ol+=b.length;break;}
   case 81:
    if(ol>=65536)return end(11);
    o[ol++]=D[--s]&255;break;
   case 82:D[s++]=ip<q.length?q[ip++]:-1;break;
   case 83:return end(D[--s]&255);
  }
 }
}
for(const d of readdirSync(I).sort()){
 const r=run(readFileSync(join(I,d,"program.bin")),readFileSync(join(I,d,"input.bin")));
 mkdirSync(join(O,d),{recursive:true});
 writeFileSync(join(O,d,"stdout.bin"),r.o);
 writeFileSync(join(O,d,"exit.txt"),r.c+"\n");
}
