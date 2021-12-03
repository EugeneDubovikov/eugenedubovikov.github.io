(()=>{"use strict";function t(t=100){let e=0;return(i,s)=>{clearTimeout(e),e=setTimeout(i,t,s)}}function e(t=100){let e=!0;return setInterval((()=>e=!0),t),(t,i)=>{e&&t(i),e=!1}}const i=function*(){const t=2*Math.PI;let e=0;for(;;)yield Math.round(1e4*Math.sin(.5*e++%t))/100}(),s=(n=new Intl.DateTimeFormat("ru",{hour:"2-digit",minute:"2-digit",second:"2-digit"}),t=>n.format(t));var n;const h=(a=new Intl.DateTimeFormat("en",{day:"2-digit",month:"2-digit",year:"numeric"}),t=>a.format(t));var a;class r{_instance;canvas;components=[];ctx;lastHovered;lastActivated;static get instance(){return r._instance??(r._instance=new r(document.getElementById("canvas")))}constructor(t){this.canvas=t,this.ctx=t.getContext("2d",{alpha:!1}),this.ctx.strokeStyle="#222222",this.ctx.fillStyle="#7affd1",this.ctx.font="12px sans-serif",this._init()}static onContextMenu(t){return t.preventDefault(),!1}_init(){this.canvas.addEventListener("mousemove",e().bind(void 0,this.onMouseMove.bind(this))),this.canvas.addEventListener("mousedown",this.onMouseDown.bind(this)),this.canvas.addEventListener("mouseup",this.onMouseUp.bind(this)),this.canvas.addEventListener("contextmenu",r.onContextMenu),this.canvas.addEventListener("touchstart",this.onTouchStart.bind(this))}dispatch(t){this.canvas.dispatchEvent(t)}listen(t,e){this.canvas.addEventListener(t,e)}unlisten(t,e){this.canvas.removeEventListener(t,e)}onMouseUp(){this.lastActivated&&this.lastActivated.onMouseUp()}onMouseDown(t){t.preventDefault();const{offsetX:e,offsetY:i,button:s}=t;let n;for(let t=0,s=-1,h=this.components,{length:a}=h;t<a;t++)h[t].zIndex>s&&h[t].x<e&&h[t].y<i&&h[t].x+h[t].width>e&&h[t].y+h[t].height>i&&(n=h[t],s=n.zIndex);!Object.is(n,this.lastActivated)&&this.lastActivated&&(this.lastActivated.onBlur()||this.lastActivated.onMouseOut()),this.lastActivated=n,n&&(2===s?n.onContextMenu({x:e,y:i}):n.onMouseDown({x:e,y:i}))}onMouseMove({offsetX:t,offsetY:e}){let i;for(let s=0,n=-1,h=this.components,{length:a}=h;s<a;s++)h[s].zIndex>n&&h[s].x<t&&h[s].y<e&&h[s].x+h[s].width>t&&h[s].y+h[s].height>e&&(i=h[s],n=i.zIndex);!Object.is(i,this.lastHovered)&&this.lastHovered&&this.lastHovered.onMouseOut(),this.lastHovered=i,i&&i.onMouseOver({x:t,y:e})}onTouchStart(t){this.pointerContextMenuDelay=setTimeout(this.onTouchContextMenu.bind(this),500,t),this.canvas.addEventListener("touchmove",this),this.canvas.addEventListener("touchend",this)}onTouchContextMenu({touches:[{pageX:t,pageY:e}]}){const{offsetTop:i,offsetLeft:s}=this.canvas;this.onMouseDown({offsetX:Math.round(t-s),offsetY:Math.round(e-i),button:2,preventDefault(){}}),this.handleEvent()}assignLastActivated(t){this.lastActivated&&this.lastActivated.onBlur(),this.lastActivated=t}repaintAffected({id:t,x:e,y:i,width:s,height:n,zIndex:h}){for(let a=0,r=this.components,{length:o}=r;a<o;a++)r[a].id!==t&&r[a].zIndex>h&&(r[a].y>=i&&r[a].y<=i+n||r[a].y<=i&&r[a].y+r[a].height>=i)&&(r[a].x>=e&&r[a].x<=e+s||r[a].x<=e&&r[a].x+r[a].width>=e)&&r[a].render()}render(){this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);for(let t=0,e=this.components,{length:i}=e;t<i;t++)e[t].render()}handleEvent(){clearTimeout(this.pointerContextMenuDelay),this.canvas.removeEventListener("touchmove",this),this.canvas.removeEventListener("touchend",this)}}let o,l,d;class c{constructor({id:t}){this.id=t,this.ctxMenuItems=[],this.initialWidth=this.initialHeight=0,this.throttle=e(50)}static get instance(){return o||(t=new c({id:m.nextId}),o=t);var t}static render({x:t,y:e,width:i,height:s,initialWidth:n,initialHeight:h,ctxMenuItems:a},r){if(r.fillRect(t,e,i,s),!a.length)return[];r.save(),r.font="10px/1 sans-serif";const{width:o,actualBoundingBoxAscent:l}=r.measureText("▶"),{collection:d}=a.reduce((function t({x:e,y:i,width:s,visible:n,collection:h},{type:a,title:d,highlighted:u,disabled:x=!1,children:g=[]},f){r.font="12px/normal sans-serif";const{width:m,actualBoundingBoxAscent:y}=r.measureText(d),v={x:e,y:i+(y+10)*f,width:s,height:y+10},p={x:e,y:i,width:s,visible:n,collection:[...h,{...v,type:a,title:d,highlighted:u,disabled:x,children:g.reduce(t,{x:v.x+v.width,y:v.y,width:g.reduce(c.calculateMaxWidth,{ctx:r,maxWidth:0}).maxWidth,visible:u,collection:[]}).collection}]};return n?(r.fillStyle=u?"#91b5c8":"#d0d0d0",r.fillRect.apply(r,Object.values(v)),r.fillStyle=x?"#9d9d9d":"#181818",r.font="12px/normal sans-serif",r.fillText(d,v.x+10,v.y+v.height-5),g.length?(r.font="10px/1 sans-serif",r.fillText("▶",v.x+v.width-o-2,v.y+v.height/2+l/2),p):p):p}),{x:t,y:e,width:n,visible:!0,collection:[]});return r.restore(),d}static findItemUnderPointer({x:t,y:e,right:i=0,bottom:s=0,highlighted:n},h){let a,r=h.highlighted;return h.highlighted=!h.disabled&&h.x<=t&&h.y<=e&&h.x+h.width>t&&h.y+h.height>e,(h.highlighted||r)&&({highlighted:a,right:i,bottom:s}=h.children.reduce(c.findItemUnderPointer,{x:t,y:e,right:i,bottom:s})),h.highlighted=h.highlighted||a,{x:t,y:e,right:Math.max(i,h.x+h.width),bottom:Math.max(s,h.y+h.height),highlighted:h.highlighted||n}}static calculateMaxWidth({ctx:t,maxWidth:e},{title:i}){return{ctx:t,maxWidth:Math.floor(Math.max(e,t.measureText(i).width+30))}}onMouseUp(){}onMouseOver(){r.instance.listen("mousemove",this)}onMouseOut(){r.instance.unlisten("mousemove",this)}onMouseDown({x:t,y:e}){this.handleEvent({offsetX:t,offsetY:e});const{found:i}=this.ctxMenuItems.reduce((function i({zIndex:s,found:n},h){const{x:a,y:r,width:o,height:l,zIndex:d=1,highlighted:c,children:u=[]}=h;return d>s&&c&&a<t&&r<e&&a+o>t&&r+l>e&&{zIndex:d,found:h}||u.reduce(i,{zIndex:s,found:n})}),{zIndex:-1,found:null});i&&i.type&&(i.type()||this.hide())}onBlur(){this.hide()}show({x:t,y:e,ctxMenuConfig:i}){i&&(Object.assign(this,{x:t,y:e,zIndex:1/0,ctxMenuItems:i}),({maxWidth:this.initialWidth,maxWidth:this.width}=i.reduce(c.calculateMaxWidth,{ctx:r.instance.ctx,maxWidth:0})),this.render(),this.height=this.initialHeight=this.ctxMenuItems.reduce(((t,{height:e})=>t+e),0),r.instance.assignLastActivated(this))}hide(){Object.assign(this,{zIndex:-1,ctxMenuItems:[]}),this.render(),r.instance.repaintAffected(this),Object.assign(this,{x:-1/0,y:-1/0,width:0,height:0}),r.instance.unlisten("mousemove",this)}render(){this.ctxMenuItems=c.render(this,r.instance.ctx)}highlightItems({x:t,y:e}){const{width:i,height:s}=this,{right:n,bottom:h}=this.ctxMenuItems.reduce(c.findItemUnderPointer,{x:t,y:e,right:0,bottom:0});this.render(),this.width=n-this.x,this.height=h-this.y,r.instance.repaintAffected({...this,width:i,height:s,zIndex:-1})}handleEvent({offsetX:t,offsetY:e}){this.throttle(this.highlightItems.bind(this),{x:t,y:e})}}class u{constructor({id:e}){this.id=e,this.text="",this.debounce=t()}static get instance(){return l||(t=new u({id:m.nextId}),l=t);var t}static render({x:t,y:e,width:i,height:s,text:n},h){h.fillRect(t,e,i,s),n&&(h.save(),h.beginPath(),h.rect(t,e,500,s),h.clip(),h.font="10px sans-serif",h.fillStyle="#ffea9f",h.fillRect(t,e,i,s),h.fillStyle="#323232",h.fillText(n,t+10,e+s-10),h.restore())}onContextMenu(){}onBlur(){}onMouseOver(){}onMouseOut(){}onMouseDown(){}onMouseUp(){}show({x:t,y:e,tooltipContent:i}){const{ctx:s,canvas:{width:n}}=r.instance;s.save(),s.font="10px sans-serif";const{actualBoundingBoxAscent:h,width:a}=s.measureText(i);s.restore(),Object.assign(this,{x:t>n-a-20?t-a-20:t,y:e>h+20?e-h-20:e,width:a+20,height:h+20,text:i,zIndex:Number.MAX_SAFE_INTEGER}),this.render(),r.instance.listen("mousemove",this)}hide(){this.zIndex=-1,this.text="",this.render(),Object.assign(this,{x:-1/0,y:-1/0,width:0,height:0}),r.instance.unlisten("mousemove",this)}translate({x:t,y:e}){const{text:i,zIndex:s}=this;Object.assign(this,{text:"",zIndex:-1}),this.render(),Object.assign(this,{x:t,y:e-this.height,text:i,zIndex:s}),this.render()}render(){u.render(this,r.instance.ctx),r.instance.repaintAffected(this)}handleEvent({offsetX:t,offsetY:e}){this.debounce(this.translate.bind(this),{x:t,y:e})}}class x{constructor({id:t}){this.id=t,this.active=!1}static get instance(){return d||(t=new x({id:m.nextId}),d=t);var t}static render({x:t,y:e,width:i,height:s,active:n},h){h.fillRect(t-2,e-2,i+4,s+4),n&&(h.save(),h.strokeStyle="#fd2929",h.strokeRect(t,e,i,s),h.restore())}onContextMenu(){}onBlur(){}onMouseOver(){}onMouseOut(){}onMouseDown(){}onMouseUp(){}show({x:t,y:e,width:i,height:s,zIndex:n=1}){Object.assign(this,{x:t-1,y:e-1,width:i+2,height:s+2,zIndex:n-1,active:!0}),this.render()}hide(){this.zIndex=-1,this.active=!1,this.render(),Object.assign(this,{x:-1/0,y:-1/0,width:0,height:0})}render(){x.render(this,r.instance.ctx),r.instance.repaintAffected(this)}}let g,f=0;class m{constructor(t){this.visible=!0,this.zIndex=-1,this.x=0,this.y=0,this.width=0,this.height=0,this.ctxMenuConfig=[],this.tooltipContent="",this.name="",Object.assign(this,t),this.tooltipTimeout=0,this.firstRender=!0}static get nextId(){return(f++).toString()}onContextMenu(t){clearTimeout(this.tooltipTimeout),u.instance.hide(),c.instance.show({...this,...t})}onBlur(){}onMouseUp(){}onMouseDown(){}onMouseOver(t){x.instance.show(this),clearTimeout(this.tooltipTimeout),this.tooltipTimeout=setTimeout(this.initTooltip.bind(this),500,{...this,...t})}onMouseOut(){clearTimeout(this.tooltipTimeout),u.instance.hide(),x.instance.hide()}render(t=this){if(this.firstRender)return this.firstRender=!1;r.instance.repaintAffected(t)}translate({x:t=0,y:e=0}){this.hide(),Object.assign(this,{x:this.x+t,y:this.y+e}),this.show()}resize({width:t=0,height:e=0}){this.render({...this,visible:!1}),Object.assign(this,{width:this.width+t,height:this.height+e}),this.render()}hide(){this.visible=!1,this.render()}show(){this.visible=!0,this.render()}initTooltip(t){u.instance.show(t)}}class y extends m{constructor({value:t,...e}){super(e),this.name="ValueItem",this.value=this.tooltipContent=t,this.active=!1,this.trend=0,this.ctxMenuConfig=[{title:"Move",children:[{title:"Horizontally",children:[{title:"Left",type:this.translate.bind(this,{x:-20})},{title:"Right",type:this.translate.bind(this,{x:20})}]},{title:"Vertically",children:[{title:"Up",type:this.translate.bind(this,{y:-20})},{title:"Down",type:this.translate.bind(this,{y:20})}]}]},{title:"Resize",children:[{title:"X",children:[{title:"Grow",type:this.resize.bind(this,{x:20})},{title:"Shrink",type:this.resize.bind(this,{x:-20})}]},{title:"Y",children:[{title:"Grow",type:this.resize.bind(this,{y:20})},{title:"Shrink",type:this.resize.bind(this,{x:-20})}]}],disabled:!0},{title:"Hide",type:this.hide.bind(this)}],Object.assign(this,y.geometric)}static get geometric(){return{width:30,height:20}}static get randomValue(){return(100*Math.random()).toFixed(2)}static render({x:t,y:e,width:i,height:s,visible:n,value:h,trend:a,active:r},o){let l=0;if(o.fillRect(t,e,i,s),!n)return;o.save(),o.fillStyle="#161616",o.font="bold 12px serif";const d=o.measureText(h).actualBoundingBoxAscent;r&&(o.save(),l++,a>0?(o.fillStyle="#00FF00",o.fillRect(t,e,i,s),o.fillStyle="black"):a<0&&(o.fillStyle="#e50000",o.fillRect(t,e,i,s),o.fillStyle="white")),o.beginPath(),o.rect(t,e,i,s),o.clip(),o.fillText(h,t+1,e+d+5),l&&o.restore(),o.restore()}initRandomChange(){setInterval(this.onValueChange.bind(this),1e4+6e4*Math.random())}onMouseDown(){super.onMouseDown(),this.active=!0,this.render()}setText(t){this.active=!0,this.trend=t>this.value?1:t<this.value?-1:0,this.value=this.tooltipContent=t,this.render(),setTimeout(this.blink.bind(this),200)}blink(){this.active=!1,this.render()}onValueChange(){this.setText(y.randomValue)}render(){y.render(this,r.instance.ctx),super.render()}}class v extends m{constructor(t){super(t),this.name="ChartItem",this.scale=1,this.throttle=e(),this.dataDrawAreaMap=[],this.ctxMenuConfig=[{title:"Zoom In",children:[],type:this.setScale.bind(this,1.1)},{title:"Zoom Out",children:[],type:this.setScale.bind(this,.9)},{title:"Zoom Reset",children:[],type:this.resetScale.bind(this)}],this._init()}static render(t,e){const{x:i,y:s,width:n,height:h,padding:a,data:{points:r}}=t,o={x:i+a[3],y:s+a[0],width:n-a[1]-a[3],height:h-a[0]-a[2]},{min:l,max:d}=v.normalizeRange(r),c=(o.height-20)/(d-l),u=Math.floor(o.y+10+d*c);return e.save(),e.fillStyle="white",e.fillRect(i,s,n,h),e.fillStyle="rgba(127, 127, 127, 0.2)",e.fillRect.apply(e,Object.values(o)),e.restore(),v.drawXAxis({...t,...o},e),v.drawYAxis({...t,...o,zeroLevel:u,rangeScale:c},e),v.drawData({...t,...o,zeroLevel:u,rangeScale:c},e)}static drawData({x:t,y:e,width:i,height:s,padding:n,scale:h,data:{points:a=[],margin:r=.2},zeroLevel:o,rangeScale:l},d){const c=[...a];d.save(),d.beginPath(),d.rect(t,e,i,s),d.clip(),d.setTransform(1,0,0,1,t,o);for(let e=0,{length:s}=a,n=i/s,u=n*(1-r),x=-a[e].value*h*l,g=n/2-u/2,f=a[e].value>0?a[e].highlighted?"#006b00":"#00ff00":a[e].highlighted?"#810000":"#ff0000";e<s;e++,g+=n)f=a[e].value>0?a[e].highlighted?"#006b00":"#00ff00":a[e].highlighted?"#810000":"#ff0000",x=-a[e].value*h*l,d.fillStyle=f,d.fillRect(g,0,u,-a[e].value*h*l),c[e]={...c[e],x:g+t,y:Math.min(o,o+x),width:u,height:Math.abs(x)};return d.restore(),c}static drawXAxis({x:t,y:e,width:i,height:s,data:{points:n}},h){h.save(),h.strokeStyle="#3c3c3c",h.fillStyle="#3c3c3c",h.beginPath(),h.moveTo(t,e+s+5),h.lineTo(t,e),h.stroke(),h.strokeStyle="rgba(160, 160, 160, 0.5)";for(let a=0,r=i/n.length,o=t+r/2,l=Math.round(o);a<n.length;a++,o+=r,l=Math.round(o))h.beginPath(),h.moveTo(l,e+s+5),h.lineTo(l,e),h.stroke(),h.save(),h.font="10px sans-serif",h.setTransform(1,0,0,1,l+5,e+s+h.measureText(n[a].category).width+5),h.rotate(-Math.PI/2),h.fillText(n[a].category,0,0),h.restore();h.restore()}static drawYAxis({x:t,y:e,width:i,height:s,ticks:n=5,zeroLevel:h,scale:a,rangeScale:r,data:{points:o}},l){l.save(),l.strokeStyle="rgba(160, 160, 160, 0.5)",l.fillStyle="#1a1a1a",l.font="bold 14px sans-serif";const d=Math.floor(s/n);for(let o=0,c=e+s-Math.abs(h-e-s)%d,u=((h-c)/r/a).toFixed(2);o<n;c-=d,o++,u=((h-c)/r/a).toFixed(2))l.beginPath(),l.moveTo(t-5,c),l.lineTo(t+i,c),l.stroke(),l.fillText(u,t-l.measureText(u).width-10,c);l.restore()}static normalizeRange(t){return t.reduce((({min:t,max:e,maxNegative:i,minPositive:s},{value:n})=>({min:Math.min(n,t),max:Math.max(n,e)})),{min:1/0,max:-1/0})}static mockData(){return new Array(30).fill([1,-1]).map(((t,e)=>({category:`Category${e+1}`,value:Math.floor(1e4*Math.random()*t[Math.round(Math.random())])/100})))}_init(){r.instance.listen("randomizeChartData",this)}onMouseOver(){r.instance.listen("mousemove",this)}onMouseOut(){r.instance.unlisten("mousemove",this)}render(){this.data.points=v.render(this,r.instance.ctx),super.render()}resetScale(){this.scale=1}setScale(t=1){this.scale*=t,this.render()}highlightItems({x:t,y:e}){let i=null;this.tooltipContent="",super.onMouseOut(),this.data.points.forEach((s=>{const{x:n,y:h,width:a,height:r}=s;s.highlighted=n<t&&h<e&&n+a>t&&h+r>e,s.highlighted&&(i=s)})),this.render(),i&&(this.tooltipContent=i.value,clearTimeout(this.tooltipTimeout),this.tooltipTimeout=setTimeout(this.initTooltip.bind(this),500,{...this,x:t,y:e}))}handleEvent({type:t,offsetX:e,offsetY:i}){switch(t){case"mousemove":this.throttle(this.highlightItems.bind(this),{x:e,y:i});break;case"randomizeChartData":this.data.points=v.mockData(),this.render()}}}class p{constructor({id:t}){this.id=t,this.opened=!1,this.currentDate=new Date,this.calendarData=null,this.observableAreas={dates:[],rest:[]},this.initiator=null,Object.assign(this,p.geometric),this.throttle=e(),this._init()}static get instance(){return g||(t=new p({id:m.nextId}),g=t);var t}static get geometric(){return{width:300,height:240}}static render({x:t,y:e,width:i,height:s,opened:n,calendarData:{year:h,month:a,dates:r=[]},currentDate:o},l){if(l.fillRect(t,e,i,s),!n)return{year:h,month:a,dates:r};l.save(),l.setTransform(1,0,0,1,t,e),l.fillStyle="white",l.fillRect(0,0,i,s),l.fillStyle="#006d99",l.font="bold 16px/1 sans-serif";let{width:d,actualBoundingBoxAscent:c}=l.measureText(a);const{width:u}=l.measureText("▲");l.translate(10,8);let{e:x}=l.getTransform();l.fillText("◀",0,c+8),l.translate(u+10,0),l.fillText(a,0,c+8),l.translate(d+10,0);let{e:g}=l.getTransform();l.fillText("▶",0,c+8);let f=[{x,y:e,width:u,height:30,zIndex:2,type:"decreaseCurrentMonth",cursorType:"pointer"},{x:g,y:e,width:u,height:30,zIndex:2,type:"increaseCurrentMonth",cursorType:"pointer"}];({width:d,actualBoundingBoxAscent:c}=l.measureText(h)),l.setTransform(1,0,0,1,t+i-d-2*u-30,e+8),({e:x}=l.getTransform()),l.fillText("◀",0,c+8),l.translate(u+10,0),l.fillText(h,0,c+8),l.translate(d+10,0),({e:g}=l.getTransform()),l.fillText("▶",0,c+8),f=[...f,{x,y:e,width:d,height:30,zIndex:2,type:"decreaseCurrentYear",cursorType:"pointer"},{x:g,y:e,width:d,height:30,zIndex:2,type:"increaseCurrentYear",cursorType:"pointer"}];const m={year:h,month:a,observableAreas:f,dates:p.renderCalendarData({x:t+4,y:e+40+4,width:i-8,height:s-40-8,data:r,currentDate:o},l)};return l.restore(),m}static renderCalendarData({x:t,y:e,width:i,height:s,data:n,currentDate:h},a){a.save(),a.setTransform(1,0,0,1,t,e),a.font="18px sans-serif";let r,o=0,l=0,d=0,c=0;const u={horizontal:i/7,vertical:s/Math.ceil(n.length/7)},x=Math.round(u.vertical/2+a.measureText("0").actualBoundingBoxAscent/2)-2,g=h.getDate(),f=n.reduce(((i,s,n)=>{if(!s)return[...i,s];const{date:h,highlighted:f}=s,m=g===h;return o=n%7*u.horizontal,l=Math.round(o),d=o?d:n?d+u.vertical:d,c=Math.round(d),a.save(),a.fillStyle=m?"red":"#003b6e",f&&(a.shadowOffsetX=2,a.shadowOffsetY=2,a.shadowBlur=1,a.shadowColor="rgba(0, 0, 0, 0.7)"),a.fillRect(l,c,Math.round(u.horizontal)-4,Math.round(u.vertical)-4),a.restore(),a.fillStyle="white",({width:r}=a.measureText(h)),a.fillText(h,l+Math.round((u.horizontal-4)/2-r/2),c+x),[...i,{date:h,highlighted:f,x:t+l,y:e+c,width:Math.round(u.horizontal)-4,height:Math.round(u.vertical)-4,zIndex:2,type:"pickDate",cursorType:"pointer"}]}),[]);return a.restore(),f}static findItemUnderPointer({x:t,y:e,cursorType:i,zIndex:s},n){if(!n)return{x:t,y:e,cursorType:i,zIndex:s};const{x:h,y:a,width:r,height:o,zIndex:l}=n,d=l>s&&h<t&&a<e&&h+r>t&&a+o>e;return n.highlighted=d,{x:t,y:e,...d&&n||{cursorType:i,zIndex:s}}}static calendarBuilder(t){(t=new Date(t)).setDate(1);let e=(t.getDay()+6)%7;const i={year:t.getFullYear(),month:new Intl.DateTimeFormat("ru",{month:"long"}).format(t).replace(/^[а-я]/,(t=>t.toUpperCase()))},s=[];do{s[e++]={date:t.getDate(),highlighted:!1},t.setDate(t.getDate()+1)}while(t.getDate()>1);return{...i,dates:[...s]}}_init(){this.calendarData=p.calendarBuilder(this.currentDate)}onMouseOver(){r.instance.listen("mousemove",this)}onMouseOut(){r.instance.canvas.style.cursor="initial",r.instance.unlisten("mousemove",this)}onBlur(){this.hide()}onMouseUp(){}onMouseDown({x:t,y:e}){const i=i=>i&&i.x<t&&i.y<e&&i.x+i.width>t&&i.y+i.height>e,s=this.calendarData.observableAreas.find(i)||this.calendarData.dates.find(i)||{type:""};switch(s.type){case"pickDate":this.currentDate.setDate(s.date);break;case"increaseCurrentMonth":this.currentDate.setMonth(this.currentDate.getMonth()+1);break;case"decreaseCurrentMonth":this.currentDate.setMonth(this.currentDate.getMonth()-1);break;case"increaseCurrentYear":this.currentDate.setFullYear(this.currentDate.getFullYear()+1);break;case"decreaseCurrentYear":this.currentDate.setFullYear(this.currentDate.getFullYear()-1);break;default:return}this.calendarData=p.calendarBuilder(this.currentDate),this.render(),this.initiator.setDate(this.currentDate)}show({x:t=this.x,y:e=this.y,initiator:i}){Object.assign(this,{x:t,y:e,zIndex:1/0,initiator:i,opened:!0}),this.currentDate=i.date||new Date,this.calendarData=p.calendarBuilder(this.currentDate),this.render(),r.instance.assignLastActivated(this)}hide(){Object.assign(this,{opened:!1,zIndex:-1}),this.render(),r.instance.repaintAffected(this),Object.assign(this,{x:-1/0,y:-1/0,initiator:null}),r.instance.unlisten("mousemove",this)}render(){this.calendarData=p.render(this,r.instance.ctx)}highlightAreas(t){({cursorType:r.instance.canvas.style.cursor}=[...this.calendarData.dates,...this.calendarData.observableAreas].reduce(p.findItemUnderPointer,{...t,cursorType:"initial",zIndex:-1})),this.render()}handleEvent({offsetX:t,offsetY:e}){this.throttle(this.highlightAreas.bind(this),{x:t,y:e})}}class w extends m{constructor({width:t=w.geometric.width,isCalendar:i=!1,date:s=(i?new Date:null),value:n=(i?h(s):""),...a}){super(a),this.name="EditBox",this.focused=!1,this.value=n,this.date=s,this.isCalendar=i,this.htmlInput=null,Object.assign(this,w.geometric,{width:t}),this.observableAreas=[...i?[{x:this.x,y:this.y,width:this.width-this.height,height:this.height,type:"focus",cursorType:"text"},{x:this.x+this.width-this.height,y:this.y,width:this.height,height:this.height,zIndex:1,type:"showCalendar",cursorType:"pointer"}]:[{x:this.x,y:this.y,width:this.width,height:this.height,type:"focus",cursorType:"text"}]],this.throttle=e()}static get geometric(){return{width:90,height:20}}static render({x:t,y:e,width:i,height:s,value:n,isCalendar:h},a){if(a.fillRect(t-2,e-2,i+3,s+3),a.save(),a.font="14px sans-serif",a.strokeStyle="#666666",a.fillStyle="#dddddd",a.fillRect(t,e,i,s),a.strokeRect(t,e,i,s),a.save(),a.beginPath(),a.rect(t,e,i,s),a.clip(),n&&(a.fillStyle="#1d1d1d",a.fillText(n,t+3,e+s-4)),a.restore(),!h)return a.restore();a.font="18px/1 emoji";const r=a.measureText("📆").actualBoundingBoxAscent;a.fillStyle="#666666",a.fillText("📆",t+i-s,e+r),a.restore()}static defineCursorType({x:t,y:e}){({cursorType:r.instance.canvas.style.cursor}=this.observableAreas.find((function({x:t,y:e,width:i,height:s}){return t<this.x&&e<this.y&&t+i>this.x&&e+s>this.y}),{x:t,y:e})||{cursorType:"initial"})}onMouseOver(){r.instance.listen("mousemove",this)}onMouseOut(){r.instance.canvas.style.cursor="initial",r.instance.unlisten("mousemove",this)}onBlur(){this.focused=!1;const t=this.htmlInput?.value??this.value;this.isCalendar?/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(t)&&this.setDate(new Date(t)):this.setValue(t),this.render(),this.htmlInput&&(this.htmlInput.remove()||this.htmlInput.removeEventListener("keydown",this))}onMouseDown({x:t,y:e}){const i=this.observableAreas.find((function({x:t,y:e,width:i,height:s}){return t<this.x&&e<this.y&&t+i>this.x&&e+s>this.y}),{x:t,y:e});if(i)switch(i.type){case"focus":this.focus();break;case"showCalendar":this.showCalendar({x:t,y:e})}}showCalendar({x:t,y:e}){p.instance.show({initiator:this,x:t,y:e})}focus(){const t=r.instance.canvas.offsetTop,e=r.instance.canvas.offsetLeft;this.focused=!0,this.render(),this.htmlInput=document.createElement("input"),this.htmlInput.setAttribute("style",Object.entries({position:"absolute",top:`${this.y+t}px`,left:`${this.x+e}px`,width:`${this.isCalendar?this.width-this.height:this.width}px`,font:"14px sans-serif","background-color":"#dddddd",border:"none",padding:"2px 0"}).map((t=>t.join(":"))).join(";")),this.htmlInput.id="html-input-element",this.htmlInput.value=this.value,document.body.appendChild(this.htmlInput),this.htmlInput.focus(),this.htmlInput.addEventListener("keydown",this)}setDate(t=this.date){t&&(this.date=t,this.value=h(t),this.render())}setValue(t=this.value){this.value=t,this.render()}render(){w.render(this,r.instance.ctx),super.render()}handleEvent({type:t,key:e,offsetX:i,offsetY:s}){switch(t){case"keydown":"Enter"===e&&this.onBlur();break;case"mousemove":return this.throttle(w.defineCursorType.bind(this),{x:i,y:s})}this.render()}}class b extends m{constructor({value:t="Apply",callback:e=(()=>{}),...i}){super(i),this.name="Button",this.pressed=!1,this.value=t,this.fontSize=12,this.callback=e;const s=r.instance.ctx;s.save(),s.font=`bold ${this.fontSize}px sans-serif`,Object.assign(this,b.geometric,{width:s.measureText(t).width+20}),s.restore(),this.x+=b.geometric.width-this.width-2}static get geometric(){return{width:50,height:20}}static render({x:t,y:e,width:i,height:s,value:n,fontSize:h,pressed:a,radius:r=3},o){o.fillRect(t-3,e-3,i+9,s+9),o.save(),o.fillStyle="#a2a2a2",a||(o.fillStyle="#b1b1b1",o.shadowOffsetX=2,o.shadowOffsetY=2,o.shadowBlur=2,o.shadowColor="rgba(127,127,127,0.7)"),o.beginPath(),o.moveTo(t+r,e),o.lineTo(t+i-r,e),o.arcTo(t+i,e,t+i,e+r,r),o.lineTo(t+i,e+s-r),o.arcTo(t+i,e+s,t+i-r,e+s,r),o.lineTo(t+r,e+s),o.arcTo(t,e+s,t,e+s-r,r),o.lineTo(t,e+r),o.arcTo(t,e,t+r,e,r),o.fill(),a&&(o.strokeStyle="rgba(0, 0, 0, 0.5)",o.lineWidth=2,o.beginPath(),o.moveTo(t+2,e+2+s-r),o.lineTo(t+2,e+2+r),o.arcTo(t+2,e+2,t+2+r,e,r),o.lineTo(t+2+i-r,e+2),o.stroke()),o.restore(),o.save(),o.fillStyle="#353535",o.font=`bold ${h}px sans-serif`,o.fillText(n,t+10,e+s-5),o.restore()}onMouseOver(){r.instance.canvas.style.cursor="pointer"}onMouseOut(){r.instance.canvas.style.cursor="initial"}onMouseDown(){super.onMouseDown(),this.pressed=!0,this.render(),this.callback()}onMouseUp(){this.pressed=!1,this.render()}render(){b.render(this,r.instance.ctx),super.render()}}class T extends m{constructor({width:t=T.geometric.width,menuItems:i=[],variableName:s,...n}){super(n),this.name="ComboBox",this.opened=!1,Object.assign(this,T.geometric,{width:t}),this.throttle=e(),this.variable={name:s,value:null,title:"Select..."},this.menuItems=i.map(((t,e)=>({...t,y:this.y+this.height+e*this.height,height:this.height,highlighted:!1}))),this.triggerArea={x:this.x+t-20,y:this.y,width:20,height:this.height},this.fullHeight=this.height+20*i.length}static get geometric(){return{width:70,height:20}}static render({x:t,y:e,width:i,height:s,fullHeight:n,opened:h,variable:{title:a},menuItems:r},o){const l="#242424",d="#c8c8c8";if(o.fillRect(t-2,e-2,i+3,n+3),o.save(),o.fillStyle=l,o.strokeStyle="#808080",o.font="bold 12px sans-serif",o.strokeRect(t,e,i,s),o.save(),o.beginPath(),o.rect(t,e,t+i-s,s),o.clip(),o.fillText(a,t+3,e+s-5),o.restore(),o.save(),o.fillStyle=d,o.fillRect(t+i-s,e,s,s),o.font="12px sans-serif",o.fillStyle=l,o.fillText(h?"▲":"▼",t+i-s/2-5,e+s-6),o.restore(),!h)return o.restore();for(let n=0,{length:h}=r,a=e+s+1,c=o.measureText(r[n].title).actualBoundingBoxAscent,u=(s-c)/2+c;n<h;n++,a=e+s+1+s*n)o.fillStyle=r[n].highlighted?"#8d8d8d":d,o.fillRect(t,a,i,s),o.fillStyle=l,o.fillText(r[n].title,t+3,a+u);o.restore()}onMouseOver({x:t,y:e}){r.instance.canvas.style.cursor=this.triggerArea.x>t||this.triggerArea.y>e||this.triggerArea.x+this.triggerArea.width<t||this.triggerArea.y+this.triggerArea.height<e?"initial":"pointer"}onMouseOut(){r.instance.canvas.style.cursor="initial"}onBlur(){this.opened=!1,this.render(),r.instance.unlisten("mousemove",this)}onMouseDown({x:t,y:e}){super.onMouseDown({x:t,y:e}),this.triggerArea.x>t||this.triggerArea.y>e||this.triggerArea.x+this.triggerArea.width<t||this.triggerArea.y+this.triggerArea.height<e||(this.opened=!this.opened,this.render(),this.opened?r.instance.listen("mousemove",this)||r.instance.listen("mousedown",this):r.instance.unlisten("mousemove",this)||r.instance.unlisten("mousedown",this))}onMenuSelect({offsetX:t,offsetY:e}){if(this.triggerArea.x<t&&this.triggerArea.y<e&&this.triggerArea.x+this.triggerArea.width>t&&this.triggerArea.y+this.triggerArea.height>e)return;const i=this.menuItems.find((({y:i,height:s})=>this.x<t&&i<e&&this.x+this.width>t&&i+s>e));this.hideMenu(),i&&(this.setValue(i)||this.render())}hideMenu(){this.opened=!1,this.render()}render(){T.render(this,r.instance.ctx),super.render({...this,height:this.fullHeight})}highlightItems({offsetX:t,offsetY:e}){this.menuItems.forEach((i=>{const{y:s,height:n}=i;i.highlighted=this.x<t&&s<e&&this.x+this.width>t&&s+n>e})),this.render()}setValue({title:t,value:e}){Object.assign(this.variable,{title:t,value:e})}handleEvent(t){switch(t.type){case"mousedown":this.onMenuSelect(t);break;case"mousemove":this.throttle(this.highlightItems.bind(this),t)}}}class M extends m{constructor(e){super(e),this.name="Trender",this.scale=1,this.ctxMenuConfig=[{title:"Zoom In",callback:function(){this.scale*=1.1,this.render()}},{title:"Zoom Out",callback:function(){this.scale*=.9,this.render()}},{title:"Zoom Reset",callback:function(){this.scale=1,this.render()}}].map((({callback:t,...e})=>({...e,callback:t.bind(this)}))),this.debounce=t(),this._init()}static render(t,e){const{x:i,y:s,width:n,height:h,padding:a,data:{points:r}}=t,o={x:i+a[3],y:s+a[0],width:n-a[1]-a[3],height:h-a[0]-a[2]},{min:l,max:d}=M.normalizeRange(r),c=(o.height-20)/(d-l),u=Math.floor(o.y+10+d*c);e.save(),e.fillStyle="white",e.fillRect(i,s,n,h),e.fillStyle="rgba(127, 127, 127, 0.2)",e.fillRect.apply(e,Object.values(o)),e.restore(),M.drawXAxis({...t,...o},e),M.drawYAxis({...t,...o,zeroLevel:u,rangeScale:c},e),M.drawData({...t,...o,zeroLevel:u,rangeScale:c},e),M.drawLegend({...t,x:i,y:s+h-40,width:n,height:40},e)}static drawData({x:t,y:e,width:i,height:s,padding:n,scale:h,data:{points:a=[]},zeroLevel:r,rangeScale:o},l){l.save(),l.strokeStyle="#0000ff",l.fillStyle="white",l.setTransform(1,0,0,1,t,r),l.beginPath(),l.moveTo(0,(-a[0]?.value||0)*h*o);for(let t=0,{length:e}=a,s=i/e,n=-a[t].value*h*o,r=0;t<e;r+=s,n=(-a[++t]?.value||0)*h*o)l.lineTo(r,n);l.stroke();for(let t=0,{length:e}=a,s=i/e,n=-a[t].value*h*o,r=0;t<e;r+=s,n=(-a[++t]?.value||0)*h*o)l.fillRect(r-4,n-4,8,8),l.strokeRect(r-4,n-4,8,8);l.restore()}static drawXAxis({x:t,y:e,width:i,height:s,data:{points:n}},h){h.save(),h.strokeStyle="#3c3c3c",h.fillStyle="#3c3c3c",h.beginPath(),h.moveTo(t,e+s),h.lineTo(t,e),h.stroke(),h.strokeStyle="rgba(160, 160, 160, 0.5)",h.font="10px sans-serif";for(let a=0,r=t,o=i/n.length,l=Math.round(r),d=h.measureText(n[0].time).width,c=Math.round(d/2),u=Math.ceil((d+20)/o),x=r+u,g=!1;a<n.length;a++,r+=o,l=Math.round(r),g=!(a%u))h.strokeStyle=g?"#3c3c3c":"rgba(160, 160, 160, 0.5)",h.beginPath(),h.moveTo(l,g?e+s+5:e+s),h.lineTo(l,e),h.stroke(),g&&(h.fillText(n[a].time,l-c,e+s+20),x+=u);h.restore()}static drawYAxis({x:t,y:e,width:i,height:s,ticks:n=20,majorTicksInterval:h,zeroLevel:a,scale:r,rangeScale:o,data:{points:l}},d){d.save(),d.strokeStyle="rgba(160, 160, 160, 0.5)",d.fillStyle="#1a1a1a",d.font="bold 14px sans-serif";const c=s/n;d.beginPath(),d.rect(t-100,e,i+100,s),d.clip();for(let l=0,u=a+Math.ceil((e+s-a)/c)*c,x=Math.round(u),g=((a-u)/o/r).toFixed(2),f=!1;l<n;l++,u-=c,x=Math.round(u),g=((a-u)/o/r).toFixed(2),f=Math.abs(u-a)%(c*h)<c/2)d.strokeStyle=f?"#434343":"rgba(160, 160, 160, 0.5)",d.beginPath(),d.moveTo(f?t-5:t,x),d.lineTo(t+i,x),d.stroke(),f&&d.fillText(g,t-d.measureText(g).width-10,x);d.restore()}static drawLegend({x:t,y:e,width:i,height:s,data:{name:n}},h){h.save(),h.strokeStyle="rgb(0,0,255)",h.font="bold 12px sans-serif";const a=h.measureText(n).actualBoundingBoxAscent;h.setTransform(-1,0,0,1,t+i/2-5,e+s/2),h.beginPath(),h.moveTo(0,4),h.lineTo(20,4),h.stroke(),h.fillStyle="white",h.fillRect(6,0,8,8),h.strokeRect(6,0,8,8),h.setTransform(1,0,0,1,t+i/2+5,e+s/2),h.fillStyle="#151515",h.fillText(n,0,a-2),h.restore()}static normalizeRange(t){return t.reduce((({min:t,max:e,maxNegative:i,minPositive:s},{value:n})=>({min:Math.min(n,t),max:Math.max(n,e)})),{min:1/0,max:-1/0})}static mockData(){const t=Date.now()-29e3;return new Array(30).fill(t).map(((t,e)=>({time:new Date(t+1e3*e).toLocaleTimeString(),value:i.next().value})))}static mockNextData(){r.instance.dispatch(new CustomEvent("trenderNextTick",{detail:{time:(new Date).toLocaleTimeString(),value:i.next().value}}))}_init(){r.instance.listen("trenderNextTick",this)}onMouseOver(){}render(){M.render(this,r.instance.ctx),super.render()}handleEvent({detail:t}){this.data.points.shift(),this.data.points.push(t),this.render()}}class I extends m{constructor(t){super(t),this.name="Clock",this.value=this.tooltipContent="",this.fontSize=20,Object.assign(this,I.geometric),this._init()}static get geometric(){return{width:30,height:20}}static render({x:t,y:e,width:i,height:s,value:n,fontSize:h},a){a.fillRect(t,e,i,s),a.save(),a.fillStyle="#161616",a.font=`bold ${h}px sans-serif`;const r=a.measureText(n).actualBoundingBoxAscent;a.fillText(n,t+1,e+r+5),a.restore()}_init(){const t=r.instance.ctx;setInterval(this.onValueChange.bind(this),1e3),this.setValue(s(Date.now())),t.save(),t.font=`bold ${this.fontSize}px sans-serif`,this.width=Math.ceil(t.measureText(this.value).width)+1,t.restore(),this.x=r.instance.canvas.width-this.width}onMouseOver(t){clearTimeout(this.tooltipTimeout),this.tooltipTimeout=setTimeout(this.initTooltip.bind(this),500,{...this,...t})}onMouseOut(){clearTimeout(this.tooltipTimeout),u.instance.hide()}setValue(t){this.value=this.tooltipContent=t,this.render()}onValueChange(){this.setValue(s(Date.now()))}render(){I.render(this,r.instance.ctx),super.render()}}const D={type:"column",padding:[20,20,70,70],ticks:5,data:{points:v.mockData(),margin:.1}},S={padding:[20,20,70,70],ticks:20,majorTicksInterval:4,data:{name:"sin(x)",points:M.mockData()}};setInterval(M.mockNextData,1e3),r.instance.components=[new I({y:0,zIndex:1,id:m.nextId}),...class{static compose({x:t,y:e,cols:i,rows:s,gap:n=20,ctor:h}){const{width:a,height:o}=h.geometric;return new Array(s).fill(r.instance.ctx).reduce(((s,r,l)=>[...s,...new Array(i).fill(h).map(((i,s)=>{const[h,d,c,u]=[m.nextId,t+s*(a+n),e+l*(o+n),(l+1)*(s+1)],x=new i({id:h,x:d,y:c,value:y.randomValue,zIndex:u,ctx:r});return x.initRandomChange(),x}))]),[])}}.compose({x:0,y:30,cols:25,rows:12,gap:20,ctor:y}),new w({x:0,y:600,zIndex:1,id:m.nextId}),new w({x:100,y:600,width:100,zIndex:1,isCalendar:!0,id:m.nextId}),new T({x:250,y:600,zIndex:1,variableName:"Combobox1",menuItems:[{title:"One",value:1},{title:"Two",value:2},{title:"Three",value:3}],id:m.nextId}),new v({x:r.instance.canvas.width-600,y:30,width:600,height:400,zIndex:1,id:m.nextId,...D}),new b({x:r.instance.canvas.width-b.geometric.width,y:450,zIndex:1,value:"Randomize",callback:()=>r.instance.dispatch(new CustomEvent("randomizeChartData")),id:m.nextId}),new M({x:r.instance.canvas.width-600,y:490,width:600,height:400,zIndex:1,id:m.nextId,...S}),u.instance,x.instance,c.instance,p.instance],r.instance.render()})();