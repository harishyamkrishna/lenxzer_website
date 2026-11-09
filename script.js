(function(){
  var svg=document.getElementById('curve'),out=document.getElementById('readout');
  var NS='http://www.w3.org/2000/svg',L=44,R=1076,T=16,B=284,W=R-L,H=B-T;
  document.getElementById('yr').textContent=new Date().getFullYear();
  function db(f){
    var l=Math.log10(f);
    var bass=5/(1+Math.pow(f/110,2));
    var pres=3.6*Math.exp(-Math.pow(l-Math.log10(3000),2)/(2*0.11*0.11));
    var dip=-1.4*Math.exp(-Math.pow(l-Math.log10(800),2)/(2*0.15*0.15));
    var air=-11*Math.pow(f/17000,4)/(1+Math.pow(f/17000,4));
    return bass+pres+dip+air;
  }
  function X(f){return L+Math.log10(f/20)/3*W}
  function Y(d){return T+(10-d)/20*H}
  function el(n,a){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);svg.appendChild(e);return e}
  [-10,-5,0,5,10].forEach(function(d){
    el('line',{x1:L,x2:R,y1:Y(d),y2:Y(d),'class':'grid'});
    var t=el('text',{x:L-10,y:Y(d)+4,'text-anchor':'end','class':'axis'});t.textContent=(d>0?'+':'')+d;
  });
  [[20,'20 Hz'],[100,'100'],[1000,'1 kHz'],[10000,'10 kHz'],[20000,'20 kHz']].forEach(function(p){
    el('line',{x1:X(p[0]),x2:X(p[0]),y1:T,y2:B,'class':'grid'});
    var t=el('text',{x:X(p[0]),y:B+24,'text-anchor':p[0]==20?'start':p[0]==20000?'end':'middle','class':'axis'});t.textContent=p[1];
  });
  var d='';
  for(var i=0;i<=240;i++){
    var f=20*Math.pow(1000,i/240);
    d+=(i?'L':'M')+X(f).toFixed(1)+' '+Y(db(f)).toFixed(1);
  }
  var path=el('path',{d:d,'class':'trace'});
  var len=path.getTotalLength();
  var still=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!still){
    path.style.strokeDasharray=len;path.style.strokeDashoffset=len;
    path.getBoundingClientRect();
    path.style.transition='stroke-dashoffset 2.2s cubic-bezier(.4,0,.2,1)';
    path.style.strokeDashoffset=0;
  }
  var cur=el('line',{y1:T,y2:B,'class':'cursor',visibility:'hidden'});
  var dot=el('circle',{r:6,'class':'dot',visibility:'hidden'});
  function fmt(f){return f>=1000?(f/1000).toFixed(f>=10000?1:2).replace(/\.?0+$/,'')+' kHz':Math.round(f)+' Hz'}
  function show(cx){
    var r=svg.getBoundingClientRect(),x=(cx-r.left)/r.width*1100;
    x=Math.max(L,Math.min(R,x));
    var f=20*Math.pow(1000,(x-L)/W),v=db(f);
    cur.setAttribute('x1',x);cur.setAttribute('x2',x);
    dot.setAttribute('cx',x);dot.setAttribute('cy',Y(v));
    cur.setAttribute('visibility','visible');dot.setAttribute('visibility','visible');
    out.innerHTML=fmt(f)+' <b>'+(v>=0?'+':'')+v.toFixed(1)+' dB</b>';
  }
  svg.addEventListener('pointermove',function(e){show(e.clientX)});
  svg.addEventListener('pointerdown',function(e){show(e.clientX)});
})();
