/** Conveyor in side elevation: one moving object and a half-transparent cover. */
const {
  Cam, clamp, fit, lerp, open, poly, prism, proj, rings, seg,
  spring, stepS, tween, tset, tval, tdone, disposer, mk, pointer, put, register, solid,
} = HL;

function mount({ stage, svg, read, managed=false }, value) {
  const bag=disposer(), C=Cam(0,0,1.5);
  fit(C,[[-18,0,0],[213,0,0],[-18,0,96],[213,0,96]],200,166);
  const P=proj(C), Q=(u,v,d)=>P(u,60+d,v), g=mk("g",{},svg);
  const front=q=>q.nv>0;
  let reach=value, over=false, active=false, drawn="", coverDrawn=NaN;
  let progress=spring(managed?0:0.94), power=spring(0.38), travel=tween(0,3000);
  const engagement=tween(0);
  let playing=false, visible=!managed;
  const eased=v=>{const t=clamp(v,0,1);return t*t*(3-2*t);};
  // These rings are in the x/z plane: profile corners stay rounded edge-on.
  function profile(parent,x0,z0,x1,z1,r,b) {
    const [ring,inner]=rings(x0,z0,x1,z1,r,b), el=solid(parent);
    put(el,prism(Q,front,ring,inner,0,2)); return el;
  }

  // Feet, legs, a single continuous belt casing, and the side rail.
  for(const x of [12,94,184]) {
    profile(g,x-7,0,x+7,3,1.4,0.5);
    profile(g,x-3,3,x+3,22,1.4,0.7);
  }
  profile(g,-15,19,209,32,6,1.3);
  for(let x=-6;x<=201;x+=9) {
    const ring=rings(x-2.1,23.2,x+2.1,27.4,2,0.6)[0];
    mk("path",{d:poly(ring.map(q=>P(q.u,61,q.v))),class:"nf lo"},g);
    mk("path",{d:seg(P(x,60,30),P(x,60,32)),class:"nf lo"},g);
  }
  profile(g,-11,32,205,34,0.9,0.35);
  const work=mk("g",{"data-moving-object":""},g), crate=solid(work);
  const bundle=Array.from({length:8},()=>mk("path",{class:"nf"},work));
  const head=mk("path",{class:"nf hi"},work);
  // Requested exception to Hairline's opaque solids: reveal the travelling work.
  const cover=mk("g",{"data-transform-cover":"",opacity:0.5},g), housing=solid(cover);

  function drawCover(lift,light) {
    if(coverDrawn!==lift) {
      coverDrawn=lift;
      const [ring,inner]=rings(44,34+lift,148,83+lift,6,1.4);
      put(housing,prism(Q,front,ring,inner,0,2));
    }
    housing.sil.classList.toggle("hi",active&&light>0.48);
  }

  function drawMaterial(p) {
    const cx=lerp(3,185,p), transformation=eased((p-0.3)/0.48), height=24*transformation;
    if(height>0.1) {
      const [ring,inner]=rings(cx-13,35,cx+13,35+height,Math.min(3,height/2),Math.min(1,height/3));
      put(crate,prism(Q,front,ring,inner,0,2));
    } else {crate.sil.setAttribute("d","");crate.cr.setAttribute("d","");}
    const count=4+Math.floor(p*4), noise=7*(1-p)**2;
    bundle.forEach((el,k)=>{
      const pts=[];
      if(k<count) for(let j=0;j<=24;j++) {
        const t=j/24;
        pts.push(P(cx+(t-0.5)*20+noise*0.45*Math.sin(t*19+k),60,
          lerp(43,35+height/2,transformation)+(k-(count-1)/2)*1.5+noise*Math.sin(t*12+k*1.4)));
      }
      el.setAttribute("d",open(pts));
      el.setAttribute("class",!active&&height<=12&&k===0?"nf hi":height>12?"nf lo":"nf");
    });
    head.setAttribute("d",height>12?seg(P(cx-9.5,60,35+height),P(cx+9.5,60,35+height)):"");
    head.setAttribute("class",!active?"nf hi":"nf sil");
    if(over) read.textContent=`chaos → clarity · ${Math.round(p*100)}%`;
  }

  const B=register(stage,(dt,now)=>{
    if(playing) {
      over=true;progress.t=tval(travel,now);power.t=0.75;
      const cx=lerp(3,185,progress.t);select(cx>=31&&cx<=161);
    }
    let moving=stepS(progress,dt);moving=stepS(power,dt)||moving;
    const p=clamp(progress.x,0,1), light=clamp(power.x,0,1), picked=tval(engagement,now);
    drawCover(clamp(picked*reach*light,0,8),light);
    const key=`${p},${light},${active},${over}`;
    if(key!==drawn) {drawn=key;drawMaterial(p);}
    if(playing&&tdone(travel,now)&&!moving) playing=false;
    return playing||moving||!tdone(engagement,now);
  });
  bag.add(B.unregister);
  const start=P(3,60,34),end=P(185,60,34);
  function select(on) {
    if(active===on) return;
    active=on;tset(engagement,on?1:0,performance.now(),0);
  }
  function reset() {
    if(playing||!visible) return;
    over=managed;select(false);progress.t=managed?1:0.94;power.t=0.38;
    read.textContent=managed?"chaos → clarity · 100%":"rest";B.wake();
  }
  function rewind() {
    playing=false;visible=false;over=false;select(false);
    progress=spring(0);power=spring(0.38);travel=tween(0,3000);drawn="";
    read.textContent="chaos → clarity · 0%";B.wake();
  }
  function play() {
    rewind();visible=true;playing=true;
    // Three seconds lets the passage through the enclosed middle be read.
    tset(travel,1,performance.now(),0);B.wake();
  }
  bag.add(pointer(stage,{
    move:([x,y])=>{
      if(playing||!visible) return;
      const t=clamp((x-start[0])/(end[0]-start[0]),0,1),base=start[1];
      if(x<start[0]-24||x>end[0]+24||y<base-120||y>base+45) {reset();return;}
      over=true;progress.t=t;power.t=clamp((base-y+15)/95,0,1);
      const cx=lerp(3,185,t);select(cx>=31&&cx<=161);B.wake();
    },leave:reset,
  }));
  bag.add(()=>svg.replaceChildren());
  read.textContent=managed?"chaos → clarity · 0%":"rest";
  return {set:v=>{reach=v;coverDrawn=NaN;B.wake();},play,reset:rewind,destroy:bag.dispose};
}

hairline({
  name:"conveyor",
  means:"One object becomes an ordered box inside a half-transparent cover. Move along the conveyor to watch the transformation.",
  rules:[1,3,5,7,8,9,10],
  range:[2,5,8],
  mount,
});
