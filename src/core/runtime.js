'use strict';
const W=6000,HW=W/2,TAU=Math.PI*2;
const A='Vael Oster Ald Bran Mere Har Fen Cor Raven Stone Thorn Wych'.split(' '),B='mere ford holt wick fall haven bridge field barrow gate watch'.split(' '),BEAST='Stag Wolf Oak Comet Tower Wave Key Sun'.split(' ');
const BUILD_TYPES='house longhouse shop smithy mill granary tavern temple warehouse tower wall gate keep'.split(' '),TIERS='hovel timber stone'.split(' ');
let genR,hisR,terrainSpec,world,scene,camera,renderer,labels=[],selectables=[],pickables=[],settlementDetailGroup,clock={day:1,speed:8,acc:0},director={queue:[],until:0,suspend:0},keys={};
function xmur3(str){let h=1779033703^String(str).length;for(let i=0;i<String(str).length;i++){h=Math.imul(h^String(str).charCodeAt(i),3432918353);h=h<<13|h>>>19}return()=>{h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return(h^h>>>16)>>>0}}
function sfc32(a,b,c,d){return()=>{a>>>=0;b>>>=0;c>>>=0;d>>>=0;let t=a+b|0;a=b^b>>>9;b=c+(c<<3)|0;c=c<<21|c>>>11;d=d+1|0;t=t+d|0;c=c+t|0;return(t>>>0)/4294967296}}
function rng(seed,tag){let f=xmur3(seed+':'+tag);return sfc32(f(),f(),f(),f())}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,Number.isFinite(v)?v:a)),rnd=(r,a,b)=>a+r()*(b-a),irnd=(r,a,b)=>Math.floor(rnd(r,a,b+1)),pick=(r,a)=>a[Math.floor(r()*a.length)%a.length],place=r=>pick(r,A)+pick(r,B),dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z),angleTo=(a,b)=>Math.atan2(b.z-a.z,b.x-a.x),safeName=s=>String(s||'').replace(/[<>&]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));
function vnoise(seed,x,y){let xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf),n=(a,b)=>{let s=Math.sin(a*127.1+b*311.7+seed)*43758.5453;return s-Math.floor(s)};return((n(xi,yi)*(1-u)+n(xi+1,yi)*u)*(1-v)+(n(xi,yi+1)*(1-u)+n(xi+1,yi+1)*u)*v)}
function fbm(seed,x,y){let v=0,a=.5,f=1,n=0;for(let i=0;i<5;i++){v+=a*vnoise(seed,x*f,y*f);n+=a;a*=.5;f*=2.03}return v/n}
function signed(seed,x,y){return fbm(seed,x,y)*2-1}
function makeTerrainSpec(seed){return{seed:xmur3(seed+':terrain')(),ridge:irnd(genR,1,9999),moist:irnd(genR,1,9999),angle:rnd(genR,-.9,.9),offset:rnd(genR,-.35,.35),width:rnd(genR,.15,.28),coast:{active:genR()<.4,side:pick(genR,['north','south','east','west']),edge:rnd(genR,1900,2600),curve:rnd(genR,-520,520),deep:rnd(genR,220,420)}}}
function coastDist(x,z,s=terrainSpec){let c=s.coast;if(!c.active)return 9999;let edge=c.side==='west'?x+HW:c.side==='east'?HW-x:c.side==='north'?z+HW:HW-z,along=(c.side==='east'||c.side==='west')?z:x;return edge-(c.edge+Math.sin(along/820+.01*s.seed)*c.curve+220*signed(s.seed+7,along/900,2))}
function hWorld(x,z,s=terrainSpec){let nx=x/W*2,nz=z/W*2,axis=nx*Math.sin(s.angle)+nz*Math.cos(s.angle),warp=.3*signed(s.seed+3,nx,nz),base=170*signed(s.seed,nx*1.5+warp,nz*1.5)+35*signed(s.seed+9,nx*5,nz*5),ridge=Math.exp(-(((axis+s.offset+.12*signed(s.ridge,nx,nz))/s.width)**2))*340,edge=clamp(1-1.35*(Math.max(Math.abs(nx),Math.abs(nz))-.74),.62,1.08);let h=(base+ridge+80)*edge;if(s.coast.active){let d=coastDist(x,z,s);h-=clamp((260-d)/560,0,1)*s.coast.deep;if(d<0)h-=Math.min(190,Math.abs(d)*.18)}return clamp(h,-36,720)}
function nearRiver(paths,x,z){let d=1e9;for(const p of paths||[])for(const q of p)d=Math.min(d,Math.hypot(q.x-x,q.z-z));return d}
function slope(x,z){return(Math.abs(hWorld(x+42,z)-hWorld(x-42,z))+Math.abs(hWorld(x,z+42)-hWorld(x,z-42)))/168}
function moisture(x,z){let r=nearRiver(world?world.rivers:[],x,z);return clamp(fbm(terrainSpec.moist,x/740+2,z/740-1)+(r<520?(520-r)/1700:0)+(terrainSpec.coast.active?clamp((440-Math.abs(coastDist(x,z)))/1800,0,.22):0)-Math.max(0,hWorld(x,z)-360)/1700,0,1)}
function biome(x,z){let h=hWorld(x,z),m=moisture(x,z);return h<2?'water':h>520?'stone':m>.62?'forest':h<150&&m>.42?'farmland':m<.28?'dry steppe':'grassland'}
