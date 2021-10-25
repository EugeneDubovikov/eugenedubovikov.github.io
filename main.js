"use strict";(self.webpackChunkgeotab=self.webpackChunkgeotab||[]).push([[179],{878:(e,t,a)=>{var n=a(294),s=a(935),c=a(243),r=a.n(c),i=a(974),l=a(252),o=a(479),d=a(403);const m=({title:e,formId:t,submitBtnId:a,children:[s,c],onSubmit:r,onClose:i})=>{const{current:l}=(0,n.useRef)({instance:null});return(0,n.useEffect)((()=>{const e=l.instance=new d.W(document.getElementById("app-dialog"));return e.listen("MDCDialog:closing",i),e.open(),document.getElementById(t)?.addEventListener("submit",r),document.getElementById(t)?.addEventListener("input",(function(e){this.elements[a].disabled=!this.checkValidity()})),()=>l.instance.destroy()}),[]),n.createElement("div",{id:"app-dialog",className:"mdc-dialog"},n.createElement("div",{className:"mdc-dialog__container"},n.createElement("div",{className:"mdc-dialog__surface"},n.createElement("h2",{className:"mdc-dialog__title centered"},e),n.createElement("div",{className:"mdc-dialog__content"},s),n.createElement("div",{className:"mdc-dialog__actions"},n.createElement("button",{type:"button",className:"mdc-button mdc-dialog__button","data-mdc-dialog-action":"close"},n.createElement("div",{className:"mdc-button__ripple"}),n.createElement("span",{className:"mdc-button__label"},"Cancel")),c))),n.createElement("div",{className:"mdc-dialog__scrim"}))};var u=a(113);const p=({type:e="text",name:t,value:a,placeholder:s,autoComplete:c="off",required:r=!1,onChange:i})=>{const[l,o]=(0,n.useState)(null),[d]=(0,n.useState)(E.next().value);return(0,n.useEffect)((()=>{if(l)return()=>l.destroy();const e=new u.K(document.getElementById(d));return o(e),()=>e.destroy()}),[]),(0,n.useEffect)((()=>{l&&(l.value=a)}),[a]),n.createElement("label",{id:d,className:"mdc-text-field mdc-text-field--filled auto-width"},n.createElement("span",{className:"mdc-text-field__ripple"}),n.createElement("span",{className:"mdc-floating-label",id:`${t}Field`},s),n.createElement("input",{type:e,name:t,defaultValue:a,autoComplete:c,className:"mdc-text-field__input",required:r,onChange:i}),n.createElement("span",{className:"mdc-line-ripple"}))},h={_listeners:{},subscribe(e,t,a=null){this._listeners[e]=[...this._listeners[e]??[],[t,a]]},dispatch(e,t){this._listeners[e]?.forEach((([e,a])=>{e.call(a,t)}))},unsubscribe(e,t){const a=this._listeners[e]?.findIndex(t)??-1;a>-1&&this._listeners[e].splice(a,1)},async makeRequest(e){let t;this.dispatch(PENDING_REQUEST);try{const a=await fetch(e);try{t=await a.clone().json()}catch(e){t=await a.text()}if(!a.ok)throw new Error(`${t?.error??t}`);return t}catch({message:e}){this.dispatch(ERROR_REQUEST,e),console.error(e)}finally{this.dispatch(COMPLETE_REQUEST)}}},g="pending_request",f="complete_request",v="error_request",_="set_user",E=function*(e){for(;;)yield"_react_component_"+e++}(0);function b(e,t){return e>t?1:e<t?-1:0}function w(){try{const{database:e,sessionId:t,userName:a}=JSON.parse(localStorage.getItem("geotabAPI_credentials"));return{userName:a,database:e,sessionId:t,server:localStorage.getItem("geotabAPI_server")}}catch(e){return null}}function y(e,t){const a="authorize-form",c="form-submit-btn";s.render(n.createElement(m,{title:"Login to GeoTab",formId:a,submitBtnId:c,onSubmit:async t=>{t.preventDefault(),t.target.elements[c].disabled=!0;const a=new FormData(t.target),n=a.get("server")?.trim(),r={method:"Authenticate",params:{database:a.get("database")?.trim(),userName:a.get("username")?.trim(),password:a.get("password")?.trim()}};let[i,l,o,d]=[];h.dispatch(g);try{if(({result:{credentials:{database:i,sessionId:l,userName:o}={}}={},error:d}=await(await fetch(`https://${n}/apiv1`,{method:"post",headers:new Headers({"Content-Type":"application/json"}),body:JSON.stringify(r)})).json()),d)throw d}catch({message:e}){return t.target.elements[c].disabled=!1,h.dispatch(v,e)}finally{h.dispatch(f)}e({userName:o,database:i,server:n,sessionId:l}),h.dispatch(_,{userName:o}),s.unmountComponentAtNode(document.getElementById("dialog-pane")),document.body.classList.remove("mdc-dialog-scroll-lock")},onClose:()=>{s.unmountComponentAtNode(document.getElementById("dialog-pane")),document.body.classList.remove("mdc-dialog-scroll-lock"),t(new Error("Authentication failed"))}},[n.createElement("form",{key:"form",id:a,className:"flex flex--column flex--spreaded"},[n.createElement(p,{key:"server-input",name:"server",placeholder:"server",required:!0,value:"my5.geotab.com"}),n.createElement(p,{key:"database-input",name:"database",placeholder:"database",required:!0,value:"rollins"}),n.createElement(p,{key:"email-input",type:"email",name:"username",placeholder:"user name",autoComplete:"email",required:!0}),n.createElement(p,{key:"password-input",type:"password",name:"password",placeholder:"password",autoComplete:"current-password",required:!0})]),n.createElement("button",{key:"submit-button",id:c,type:"submit",form:a,className:"mdc-button mdc-dialog__button data-mdc-dialog-button-default",disabled:!0},[n.createElement("div",{key:"mdc-ripple",className:"mdc-button__ripple"}),n.createElement("span",{key:"submit-button-label",className:"mdc-button__label"},"Login")])]),document.getElementById("dialog-pane"))}const N={driver:new Map,rule:new Map,device:new Map,group:new Map,trip:new Map,exceptionEvent:new Map,common:new Map};function k(e,t){return e?.panTo(L.latLng(...t),{animate:!0})}function x({dateTime:e,...t}){return{dateTime:Date.parse(e),...t}}function C(e){const t=new Date;return t.setMilliseconds(t.getMilliseconds()-e),t}const S=({options:e,name:t,label:a,onChange:s})=>{const[c]=(0,n.useState)(E.next().value),r=(0,n.useCallback)((({detail:{item:{id:e}}})=>{s?.(t,[e])}),[]),{current:i}=(0,n.useRef)({instance:null});(0,n.useEffect)((()=>{i.instance?.unlisten("MDCMenu:selected",r),i.instance?.destroy();const e=document.getElementById(c),t=new l.g(e);t.setAnchorCorner(o.Ns.BOTTOM_LEFT),t.setFixedPosition(!0),t.open=!1,i.instance=t,t.listen("MDCMenu:selected",r)}),[e]);const d=(0,n.useMemo)((()=>e.map(I,{name:t})),[e]);return n.createElement("div",{className:"mdc-menu-surface--anchor"},n.createElement("button",{className:"mdc-button mdc-button--raised",onClick:()=>i.instance&&(i.instance.open=!0),disabled:!e.length},n.createElement("span",{className:"mdc-button__ripple"}),n.createElement("span",{className:"mdc-button__label"},a)),n.createElement("div",{id:c,className:"mdc-menu mdc-menu-surface"},n.createElement("ul",{className:"mdc-deprecated-list",role:"radiogroup"},d)))};function I({name:e,title:t,checked:a=!1}){return n.createElement("li",{key:e,id:e,className:"mdc-deprecated-list-item",role:"radio","aria-checked":a},n.createElement("span",{className:"mdc-deprecated-list-item__ripple"}),n.createElement("span",{className:"mdc-deprecated-list-item__graphic"},n.createElement("div",{className:"mdc-radio"},n.createElement("input",{className:"mdc-radio__native-control",type:"radio",id:`radio-${e}`,name:this.name,defaultChecked:a,value:e}),n.createElement("div",{className:"mdc-radio__background"},n.createElement("div",{className:"mdc-radio__outer-circle"}),n.createElement("div",{className:"mdc-radio__inner-circle"})))),n.createElement("label",{className:"mdc-deprecated-list-item__text",htmlFor:`radio-${e}`},t))}const D=n.createContext(null),T="./app-config.json",M=[{name:"ayqvrTR8lIkiMFFZtHz2xdw",title:"Backing Up When Leaving",checked:!0},{name:"aCdkH9ou4QEKRsJmUYQh6CQ",title:"Harsh Acceleration",checked:!0},{name:"auV1Pjb5pTkC5OzkCwOxoJA",title:"Harsh Brake",checked:!0},{name:"a4zk6nwPd-kus-jY3zBPPqw",title:"Harsh Cornering",checked:!0},{name:"RuleAccidentId",title:"Possible Accident",checked:!0},{name:"aX_l5MgXx8UODDE5rq2ovKw",title:"Speeding > 80 MPH",checked:!0}],P=new Map([["divisions",{label:"Division",options:new Set,checked:new Set,dependentFilter:"regions"}],["regions",{label:"Region",options:new Set,checked:new Set,dependentFilter:"branches"}],["branches",{label:"Branch",options:new Set,checked:new Set}]]),F="check_all",B="divider";let R,O;async function $(){return R??(async()=>{let{userName:e,sessionId:t,database:a,server:n}=w()??{};if(!e||!n)try{if(({userName:e,database:a,server:n,sessionId:t}=await(O??(O=new Promise(y)))),!e||!a||!n)throw new Error("Authentication failed")}catch({message:e}){return console.error(e),h.dispatch(v,e),{credentials:{}}}finally{O=null}return localStorage.setItem("geotabAPI_credentials",JSON.stringify({database:a,sessionId:t,userName:e})),localStorage.setItem("geotabAPI_server",n),R={credentials:{userName:e,sessionId:t,database:a},server:n}})()}function A(e,t){return t?G(e):V("Get",e)}async function U(e){return V("GetAddresses",e)}async function V(e,t){try{const{server:a,credentials:n}=await $(),s={method:e,params:{...t,credentials:n}},c=await fetch(`https://${a}/apiv1`,{method:"post",headers:new Headers({"Content-Type":"application/json"}),body:JSON.stringify(s)}),{result:r,error:{data:{type:i}={},message:l}={}}=await c.json();if("OverLimitException"===i)return async function(e,t){return await j(3e4),V(e,t)}(e,t);if(l)throw new Error(l);return r}catch({message:e}){return h.dispatch(v,e),console.error(e),[]}}async function G(e){try{const{server:t,credentials:a}=await $(),n={method:"ExecuteMultiCall",params:{calls:e,credentials:a}},s=await fetch(`https://${t}/apiv1`,{method:"post",headers:new Headers({"Content-Type":"application/json"}),body:JSON.stringify(n)}),{result:c,error:{data:{type:r}={},message:i}={}}=await s.json();if("OverLimitException"===r)return async function(e){return await j(3e4),G(e)}(e);if(i)throw new Error(i);return c}catch({message:e}){return h.dispatch(v,e),console.error(e),[]}}async function j(e){h.dispatch(PENDING_REQUEST),await new Promise((t=>setTimeout(t,e))),h.dispatch(COMPLETE_REQUEST)}const q=({onChange:e})=>{const[t,a]=(0,n.useState)([]),{current:s}=(0,n.useRef)(P),c=(0,n.useContext)(D),r=async()=>{const e=await Promise.all([...s.entries()].map((async([e,{options:t,checked:a,...n}])=>({...n,id:e,options:await Promise.all([...t.values()].map((async e=>{const[{name:t}]=await N.group.get(e);return function({id:e,name:t,checked:a=!1}){return{name:e,title:t,checked:a}}({id:e,name:t,checked:a.has(e)})})))}))));a(e)},i=(0,n.useCallback)((async(t,a)=>{s.get(t).checked=new Set(a),await async function e({dependentFilter:t,checked:a}){if(!s.has(t))return;const n=await[...a.values()].reduce((async(e,a)=>{const[{children:n=[]}={}]=await(N.group.get(a)??N.group.set(a,A({typeName:"Group",search:{id:a}})).get(a));let s=await(N.group.get(`${a}-children`)??N.group.set(`${a}-children`,A(n.map((({id:e})=>({method:"Get",params:{typeName:"Group",search:{id:e}}}))),!0)).get(`${a}-children`));return s="branches"===t&&s.map((([e])=>{const{id:t}=e;return N.group.set(t,Promise.resolve([e])),t}))||s.reduce(((e,[t])=>{const{id:a,children:{length:n}}=t;return n?(N.group.set(a,Promise.resolve([t])),[...e,a]):e}),[]),new Set([...await e,...s].sort())}),Promise.resolve(new Set));return s.set(t,{...s.get(t),options:n,checked:new Set([...s.get(t).checked.values()].filter((e=>n.has(e))))}),e(s.get(t))}(s.get(t)),r(),e?.([...s.get("branches").checked.values()])}),[]);(0,n.useEffect)((async()=>{if(!c)return[...s.values()].forEach((e=>e.options=e.checked=new Set)),r();const[{children:e={}}={}]=await A({typeName:"Group",search:{id:"b271F"}}),t=(await(N.group.get("b271F-children")??N.group.set("b271F-children",A(e.map((({id:e})=>({method:"Get",params:{typeName:"Group",search:{id:e}}}))),!0)).get("b271F-children"))).reduce(((e,[t])=>{const{id:a,children:{length:n}}=t;return n?(N.group.set(a,Promise.resolve([t])),[...e,a]):e}),[]).sort();s.set("divisions",{...s.get("divisions"),options:new Set(t)}),r()}),[c]);const l=(0,n.useMemo)((()=>t.map((({id:e,options:t,label:a})=>n.createElement("div",{key:e,className:"filter-control"},n.createElement(S,{options:t,name:e,label:a,onChange:i}))))),[t]);return n.createElement("div",{className:"flex flex--spreaded flex--wrap"},l)},z=(H=new DOMParser,e=>H.parseFromString(e,"text/html").body?.firstElementChild??document.createElement("div"));var H;const Q=({name:e="",status:t="",groups:a="",driver:n="",driverFICO:s,location:c="",issues:r=[]})=>`\n        <div class="car-tooltip">\n            <div class="car-tooltip__icon material-icons">directions_car</div>\n            <div class="car-tooltip__name">${e}</div>\n            <div class="car-tooltip__status">${t}</div>\n            <div class="car-tooltip__group">${a}</div>\n            <div class="car-tooltip__driver">${n}</div>\n            <div class="car-tooltip__driver-fico">`+(s&&`\n                    <span>FICO:</span>\n                    <span>${s}</span>`||"")+`\n            </div>\n            <div class="car-tooltip__location">${c}</div>\n            <div class="car-tooltip__issues">${r.reduce(((e,t)=>`${e}<li class="issues__item">${t}</li>`),'<ul class="issues__list">')+"</ul"}</div>\n        </div>`;a(803),a(134),a(965);const W=r().Marker.extend({_setPos(e){this._icon&&(new(r().PosAnimation)).run(this._icon,e,.5,1),this._shadow&&(new(r().PosAnimation)).run(this._shadow,e,.5,1),this._zIndex=e.y+this.options.zIndexOffset,this._resetZIndex()},setStopped(e){this.getElement()?.classList?.toggle("car-icon--stopped",e)},setDimmed(e){this.getElement()?.classList?.toggle("car-icon--dimmed",e)}}),J=6e5;let K,Z=Promise.resolve(),X={},Y={},ee={};const te={};let ae,ne={};const se=({onReady:e,onClick:t,groupFilter:a=[]})=>{const s=(0,n.useContext)(D);ae=t;const c=(0,n.useCallback)((async(e,t,a)=>{if(!ee[a])return;await t;const n=await async function(e,t,a){return A(e.map((e=>{const n=a[e];return{method:"GetFeed",params:{typeName:"LogRecord",resultsLimit:1e3,...n&&{fromVersion:n},search:{...!n&&{fromDate:t},deviceSearch:{id:e}}}}})),!0)}(e,C(J).toISOString(),X);let s=[];return({lastVersions:X,lastData:s}=n.reduce((({lastVersions:t,lastData:a},{data:n,toVersion:s},c)=>{const[{device:{id:r}={}}={}]=n,i=n.map(x);return{lastData:[...a,...r&&[[r,i]]||[]],lastVersions:{...t,[e[c]]:s}}}),{lastVersions:X,lastData:s})),s.forEach((([e,t])=>t.reduce(((t,a)=>(ne[e]=async function(e,t,a,{dateTime:n,latitude:s,longitude:c,speed:i},{dateTime:l,latitude:o,longitude:d,speed:m}){if(!t in a)return;e&&await e;const u=function*(e){for(let t=0,a=0,s=d-c,r=Math.round((l-n)/500);t<=r;a=++t/r){let t=d-s*(1-a);yield[e(t),t]}}(function([e,t],[a,n]){if(e===t)return()=>n;const s=(n-a)/(t-e),c=a-s*e;return e=>s*e+c}([c,d],[s,o])),p=a[t];p?.setStopped(!i),await async function e(t){const{value:a}=t.next();if(a&&p)return p?.setLatLng(r().latLng(...a)),await new Promise((e=>setTimeout(e,500))),e(t)}(u),p?.setStopped(!m)}(ne[e],e,te,t,a),a))))),new Promise((e=>setTimeout(e,3e4)))}),[]);return(0,n.useEffect)((async()=>{let[t,a,n,s]=[];try{({accessToken:t,center:a,attribution:n,tileLayerUrl:s}=await(N.common.get("app_config")??N.common.set("app_config",(await fetch(T)).json()).get("app_config")))}catch({message:e}){return console.error(e),void h.dispatch(v,e)}K=r().map("leaflet-map").setView(a,11).on("click",re),r().tileLayer(s,{attribution:n,maxZoom:18,id:"mapbox/streets-v11",tileSize:512,zoomOffset:-1,accessToken:t}).addTo(K),e?.(K)}),[]),(0,n.useEffect)((async()=>{for(const e in Y)clearInterval(Y[e]),delete Y[e];for(const e in ee)delete ee[e];if(X={},!s||!a.length)return oe([],te,K);const e=await async function(e){return A({typeName:"DeviceStatusInfo",resultsLimit:1e3,search:{deviceSearch:{groups:e}}})}(a);oe(e,te,K);const{latitude:t,longitude:n}=e[e.length-1]??{};if(!t||!n)return;k(K,[t,n]);const r=e.sort(ue).reduce(((e,{device:{id:t}},a)=>{const n=Math.floor(a/20);return(e[n]??(e[n]=[])).push(t),e}),[]);for await(let e of r){const t=void Math.round(1e5*Math.random());ee[t]=!0,Y[t]=setInterval(c,J,e,Z,t),Z=await c(e,Z,t)}}),[s,a]),n.createElement("div",{id:"leaflet-map",className:"auto-height"})};async function ce({latlng:{lat:e,lng:t}}){const a=te[this.id];for(const e in te)te[e].unbindTooltip().setDimmed(e!==this.id);k(K,[e,t]),ae?.(this.id),le(a,z('<div class="car-tooltip__stub material-icons">access_time</div>'),!0);const n=await me(this.id);a.setTooltipContent(z(Q(n)))}function re(){for(const e in te)te[e].unbindTooltip().setDimmed(!1);ae?.()}function ie(e){return r().divIcon({iconSize:r().point(24,24),className:"car-icon material-icons"+(e?"":" car-icon--stopped"),html:"directions_car"})}function le(e,t,a=!1){e.bindTooltip(t,{...a&&{permanent:!0}}).openTooltip()}function oe(e,t,a){e.forEach((e=>{const{device:{id:n}}=e;n in t||(t[n]=function({latitude:e,longitude:t,isDriving:a,device:{id:n}},s){return new W(r().latLng(e,t),{icon:ie(a)}).addTo(s).on("mouseover",de,{id:n}).on("click",ce,{id:n,latitude:e,longitude:t})}(e,a))}));const n=e.map((({device:{id:e}})=>e));for(const e in t)n.includes(e)||(t[e].remove(),delete t[e])}async function de({target:e}){if(e.getTooltip())return;le(e,z('<div class="car-tooltip__stub material-icons">access_time</div>'));const t=await me(this.id);e.setTooltipContent(z(Q(t)))}async function me(e){const[{groups:t,driver:{id:a},exceptionEvents:n,isDriving:s,speed:c,latitude:r,longitude:i,dateTime:l}]=await A({typeName:"DeviceStatusInfo",resultsLimit:1,search:{deviceSearch:{id:e}}}),o=new Date(Date.parse(l)),d=(s&&`Driving ${c} Mph`||"Stopped")+` on ${o.toLocaleDateString()} at ${o.toLocaleTimeString()}`,[{name:m}]=await(N.device.get(e)??N.device.set(e,A({typeName:"Device",resultsLimit:1,search:{id:e}})).get(e)),[{name:u}]=await(N.driver.get(a)??N.driver.set(a,A({typeName:"User",resultsLimit:1,search:{id:a}})).get(a)),p=await Promise.all(n.map((async({rule:{id:e}})=>{const[{name:t}]=await(N.rule.get(e)??N.rule.set(e,A({typeName:"Rule",resultsLimit:1,search:{id:e}})).get(e));return t}))),g=(await Promise.all(t.map((async({id:e})=>{const[{name:t}]=await(N.group.get(e)??N.group.set(e,A({typeName:"Group",resultsLimit:1,search:{id:e}})).get(e));return t})))).join(" "),[{formattedAddress:f}]=await U({coordinates:[{x:i,y:r}]});return{name:m,status:d,driver:u,groups:g,issues:p,location:f,driverFICO:await async function(e){if(!e)return;let t=[];try{const{ficoServiceUrl:e}=await(N.common.get("app_config")??N.common.set("app_config",(await fetch(T)).json()).get("app_config"));if(!e)throw new Error("FICO service URL is not configured");t=await(N.common.get("fico")??N.common.set("fico",(await fetch(e)).json()).get("fico"))}catch({message:e}){return h.dispatch(v,e),void console.error(e)}const{fico:a}=t.find((({device_id:t})=>t===e))??{};return a}(e)}}function ue({isDriving:e},{isDriving:t}){b(+t,+e)}var pe=a(828);const he=({head:e,body:t,onClick:a})=>{const{current:s}=(0,n.useRef)({table:null}),c=(0,n.useCallback)((({detail:{rowId:e}})=>a?.(e)),[]);(0,n.useEffect)((()=>(s.table=new pe.T(document.getElementById("app-data-table")),s.table.listen("MDCDataTable:rowClick",c),()=>s.table.destroy())),[]),(0,n.useLayoutEffect)((()=>{s.table?.layout()}),[t]);const r=(0,n.useMemo)((()=>e.map(ge)),[e]),i=(0,n.useMemo)((()=>t.reduce(ve,[]).map(_e,[])),[t]);return n.createElement("div",{id:"app-data-table",className:"mdc-data-table auto-width",style:{overflow:"hidden"}},n.createElement("div",{className:"mdc-data-table__table-container"},n.createElement("table",{className:"mdc-data-table__table"},n.createElement("thead",null,n.createElement("tr",{className:"mdc-data-table__header-row"},r)),n.createElement("tbody",{className:"mdc-data-table__content"},i))))};function ge(e,t){return n.createElement("th",{key:t,className:"mdc-data-table__header-cell",role:"columnheader",scope:"col"},e)}function fe(e,t){return n.createElement("td",{key:t,className:"mdc-data-table__cell"},e)}function ve(e,t){return e.find((({id:e})=>e===t.id))?e:[...e,t]}function _e({id:e,columns:t}){return n.createElement("tr",{key:e,"data-row-id":e,className:"mdc-data-table__row"},t.map(fe))}let Ee,be={},we=[];const ye=["Time","Event","Vehicle","Driver","Location","Branch"],Ne=({onRowSelect:e,deviceFilter:t,ruleFilter:a=[],groupFilter:s=[]})=>{const[c,r]=(0,n.useState)([]),i=(0,n.useContext)(D),l=(0,n.useCallback)((t=>{e?.(t)}),[e]),o=(0,n.useCallback)((async()=>{const e=await async function(e,t,a,n){return A(e.map((e=>{const s=n[e];return{method:"GetFeed",params:{typeName:"ExceptionEvent",resultsLimit:100,...s&&{fromVersion:s},search:{...!s&&{fromDate:a},deviceSearch:{groups:t},ruleSearch:{id:e}}}}})),!0)}(a,s,C(36e5).toISOString(),be);let n;({lastVersions:be,lastData:n}=await e.reduce((async(e,{data:t,toVersion:n},s)=>{const{lastVersions:c,lastData:r}=await e;return{lastData:[...r,...await Promise.all(t.map((e=>async function({id:e,activeFrom:t,activeTo:a,device:{id:n},driver:{id:s},rule:{id:c}}){const{device:r,branch:i}=await(async e=>{const[{name:t="Unknown",groups:[{id:a}]}]=await(N.device.get(e)??N.device.set(e,A({typeName:"Device",resultsLimit:1,search:{id:e}})).get(e)),[{name:n="Unknown"}]=await(N.group.get(a)??N.group.set(a,A({typeName:"Group",resultsLimit:1,search:{id:a}})).get(a));return{device:t,branch:n}})(n),[{name:l="Unknown"}]=await(N.driver.get(s)??N.driver.set(s,A({typeName:"User",resultsLimit:1,search:{id:s}})).get(s)),[{name:o="Unknown"}]=await(N.rule.get(c)??N.rule.set(c,A({typeName:"Rule",resultsLimit:1,search:{id:c}})).get(c)),d=await A({typeName:"LogRecord",resultsLimit:100,search:{fromDate:t,toDate:a,deviceSearch:{id:n}}}),[{latitude:m,longitude:u}={}]=d;N.exceptionEvent.set(e,{startPoint:{latitude:m,longitude:u}});const[{formattedAddress:p="Unknown"}={}]=m&&u&&await U({coordinates:[{x:u,y:m}]})||[];return{id:e,activeTo:a,rule:o,device:r,driver:l,location:p,branch:i,deviceId:n}}(function({activeTo:e,...t}){return{activeTo:Date.parse(e),...t}}(e)))))],lastVersions:{...c,[a[s]]:n}}}),Promise.resolve({lastVersions:be,lastData:[]}))),we=[...n.sort(ke),...we].slice(-100),r((t&&we.filter((({deviceId:e})=>e===t))||we).map(xe))}),[a,s,t]);return(0,n.useEffect)((()=>{const e=t&&we.filter((({deviceId:e})=>e===t))||we;r(e.map(xe))}),[t]),(0,n.useEffect)((async()=>{clearInterval(Ee),be={},r(we=[]),i&&a.length&&s.length&&(Ee=setInterval(o,6e4),o())}),[i,a,s]),n.createElement(he,{head:ye,body:c,onClick:l})};function ke({activeTo:e},{activeTo:t}){return b(t,e)}function xe({id:e,activeTo:t,rule:a,device:n,driver:s,location:c,branch:r}){return{id:e,columns:[new Date(t).toLocaleTimeString(),a,n,s,c,r]}}const Ce={async"user-login"(){await $()},"user-logout":function(){localStorage.removeItem("geotabAPI_credentials"),localStorage.removeItem("geotabAPI_server"),R=null,h.dispatch(_,null)}},Se=()=>{const[e,t]=(0,n.useState)(null),a=(0,n.useContext)(D);(0,n.useEffect)((()=>{if(e)return()=>e.destroy();const a=document.getElementById("auth-menu"),n=new l.g(a);return n.setAnchorCorner(o.Ns.BOTTOM_LEFT),n.listen("MDCMenu:selected",(({detail:{item:{id:e}}})=>Ce[e]?.())),t(n),()=>n.destroy()}),[]);const s=(0,n.useMemo)((()=>a?.userName??"Guest"),[a]),c=(0,n.useMemo)((()=>[n.createElement("li",{key:"user-action",id:a?.userName?"user-logout":"user-login",className:"mdc-deprecated-list-item"},n.createElement("span",{className:"mdc-deprecated-list-item__ripple"}),n.createElement("span",{className:"mdc-list-item__text"},a?.userName?"Logout":"Login"))]),[a]),r=(0,n.useCallback)((()=>e&&(e.open=!0)),[e]);return n.createElement("div",{className:"mdc-menu-surface--anchor"},n.createElement("button",{className:"mdc-top-app-bar__action-item mdc-button",onClick:r},n.createElement("div",{className:"mdc-button__ripple"}),n.createElement("i",{className:"material-icons mdc-button__icon"},"account_circle"),n.createElement("span",{className:"mdc-button__label mobile-hidden"},s)),n.createElement("div",{id:"auth-menu",className:"mdc-menu mdc-menu-surface"},n.createElement("ul",{className:"mdc-deprecated-list"},c)))},Ie=({options:e,name:t,label:a,onChange:s})=>{const{value:c}=(0,n.useMemo)((()=>E.next()),[]),r=(0,n.useCallback)((({detail:{item:e}})=>{let{instance:{list:{listElements:a,selectedIndex:n}}}=i;if(e.id===F){const{checked:n=!1}=e.getElementsByTagName("input").item(0)??{};return s?.(t,n&&a.map((({id:e})=>e))||[])}s?.(t,n.reduce(((e,t)=>[...e,...a[t]?.id!==F&&[a[t]?.id]||[]]),[]))}),[]),{current:i}=(0,n.useRef)({instance:null});(0,n.useEffect)((()=>{i.instance?.unlisten("MDCMenu:selected",r),i.instance?.destroy();const e=document.getElementById(c),t=new l.g(e);t.setAnchorCorner(o.Ns.BOTTOM_LEFT),t.open=!1,i.instance=t,t.listen("MDCMenu:selected",r)}),[e]);const d=(0,n.useMemo)((()=>[De({name:F,title:"Select all",checked:e.every((({checked:e})=>e))}),De({name:B}),...e.map(De)]),[e]);return n.createElement("div",{className:"mdc-menu-surface--anchor"},n.createElement("button",{className:"mdc-button mdc-button--raised",onClick:()=>i.instance&&(i.instance.open=!0),disabled:!e.length},n.createElement("span",{className:"mdc-button__ripple"}),n.createElement("span",{className:"mdc-button__label"},a)),n.createElement("div",{id:c,className:"mdc-menu mdc-menu-surface"},n.createElement("ul",{className:"mdc-deprecated-list",role:"radiogroup"},d)))};function De({name:e,title:t,checked:a=!1}){return e===B&&n.createElement("li",{key:e,role:"separator",className:"mdc-deprecated-list-divider"})||n.createElement("li",{key:e,id:e,className:"mdc-deprecated-list-item",role:"checkbox","aria-checked":a},n.createElement("span",{className:"mdc-deprecated-list-item__ripple"}),n.createElement("span",{className:"mdc-deprecated-list-item__graphic"},n.createElement("div",{className:"mdc-checkbox"},n.createElement("input",{type:"checkbox",name:e,className:"mdc-checkbox__native-control",id:`checkbox-${e}`,defaultChecked:a}),n.createElement("div",{className:"mdc-checkbox__background"},n.createElement("svg",{className:"mdc-checkbox__checkmark",viewBox:"0 0 24 24"},n.createElement("path",{className:"mdc-checkbox__checkmark-path",fill:"none",d:"M1.73,12.91 8.1,19.28 22.79,4.59"})),n.createElement("div",{className:"mdc-checkbox__mixedmark"})))),n.createElement("label",{className:"mdc-deprecated-list-item__text",htmlFor:`checkbox-${e}`},t))}let Te;const Me={id:null,instance:null},Le=()=>{const[e,t]=(0,n.useState)(w()),[a,s]=(0,n.useState)(M),[c,l]=(0,n.useState)(M.map((({name:e})=>e))),[o,d]=(0,n.useState)([]),[m,u]=(0,n.useState)(null);(0,n.useEffect)((()=>{new i.t(document.getElementById("top-app-bar")),h.subscribe(_,t)}),[]);const p=(0,n.useCallback)((e=>Te=e),[]),g=(0,n.useCallback)((e=>u(e)),[]),f=(0,n.useCallback)((e=>{Me.instance?.remove(),Me.instance=null;const t=e.map((e=>({id:e})));d(t)}),[]),v=(0,n.useCallback)(((...[,e])=>{if(e.includes(F))return l(M.map((({name:e})=>e))),s(M);l(e),s(M.map((t=>({...t,checked:e.includes(t.name)}))))}),[]),E=(0,n.useCallback)((e=>{const{startPoint:{latitude:t,longitude:a}={}}=N.exceptionEvent.get(e)??{};if(Me.instance?.remove(),Me.instance=null,e===Me.id)return Me.id=null;Me.instance=function({latitude:e,longitude:t},a){return r().marker([e,t]).addTo(a)}({latitude:t,longitude:a},k(Te,[t,a])),Me.id=e}),[]);return n.createElement(D.Provider,{value:e},n.createElement("header",{id:"top-app-bar",className:"mdc-top-app-bar mdc-top-app-bar--fixed"},n.createElement("div",{className:"mdc-top-app-bar__row"},n.createElement("section",{className:"mdc-top-app-bar__section mdc-top-app-bar__section--align-start",style:{flex:"0 1 auto",width:"6em"}},n.createElement("a",{href:"https://www.rollins.com",title:"Rollins Inc."},n.createElement("img",{className:"app-logo",src:"https://www.rollins.com/~/media/Images/R/Rollins-V2/logo/logo.png?h=69&la=en&w=137",alt:"Rollins Inc. - link to home page"}))),n.createElement("section",{className:"mdc-top-app-bar__section"},n.createElement("div",{className:"mdc-typography--headline5 centered",style:{flex:"1 1 auto",fontWeight:"500",lineHeight:"1.2"}},"Real time data")),n.createElement("section",{className:"mdc-top-app-bar__section mdc-top-app-bar__section--align-end",style:{flex:"0 1 auto",width:"6em"}},n.createElement(Se,null)))),n.createElement("main",{id:"root",className:"mdc-top-app-bar--fixed-adjust"},n.createElement("div",{className:"leaflet-map-container"},n.createElement(se,{groupFilter:o,onReady:p,onClick:g}),n.createElement("div",{className:"leaflet-map-overlay leaflet-map-overlay--left"},n.createElement(q,{onChange:f})),n.createElement("div",{className:"leaflet-map-overlay leaflet-map-overlay--right"},n.createElement(Ie,{options:a,onChange:v,name:"event_configurator",label:"Filter Events"}))),n.createElement(Ne,{ruleFilter:c,deviceFilter:m,groupFilter:o,onRowSelect:E})))};var Pe=a(825);let Fe,Be=0;const Re=()=>((0,n.useEffect)((()=>(Fe=new Pe.z(document.getElementById("app-loader")),Fe.determinate=!1,Fe.close(),h.subscribe(g,Oe),h.subscribe(f,$e),()=>{h.unsubscribe(g,Oe),h.unsubscribe(f,$e),Fe.destroy(),Fe=null})),[]),(0,s.createPortal)(n.createElement("div",{id:"app-loader",className:"mdc-circular-progress app-loader",role:"progressbar","aria-label":"Example Progress Bar","aria-valuemin":"0","aria-valuemax":"1"},n.createElement("div",{className:"mdc-circular-progress__determinate-container"},n.createElement("svg",{className:"mdc-circular-progress__determinate-circle-graphic",viewBox:"0 0 48 48",xmlns:"http://www.w3.org/2000/svg"},n.createElement("circle",{className:"mdc-circular-progress__determinate-track",cx:"24",cy:"24",r:"18",strokeWidth:"4"}),n.createElement("circle",{className:"mdc-circular-progress__determinate-circle",cx:"24",cy:"24",r:"18",strokeDasharray:"113.097",strokeDashoffset:"113.097",strokeWidth:"4"}))),n.createElement("div",{className:"mdc-circular-progress__indeterminate-container"},n.createElement("div",{className:"mdc-circular-progress__spinner-layer"},n.createElement("div",{className:"mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left"},n.createElement("svg",{className:"mdc-circular-progress__indeterminate-circle-graphic",viewBox:"0 0 48 48",xmlns:"http://www.w3.org/2000/svg"},n.createElement("circle",{cx:"24",cy:"24",r:"18",strokeDasharray:"113.097",strokeDashoffset:"56.549",strokeWidth:"4"}))),n.createElement("div",{className:"mdc-circular-progress__gap-patch"},n.createElement("svg",{className:"mdc-circular-progress__indeterminate-circle-graphic",viewBox:"0 0 48 48",xmlns:"http://www.w3.org/2000/svg"},n.createElement("circle",{cx:"24",cy:"24",r:"18",strokeDasharray:"113.097",strokeDashoffset:"56.549",strokeWidth:"3.2"}))),n.createElement("div",{className:"mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right"},n.createElement("svg",{className:"mdc-circular-progress__indeterminate-circle-graphic",viewBox:"0 0 48 48",xmlns:"http://www.w3.org/2000/svg"},n.createElement("circle",{cx:"24",cy:"24",r:"18",strokeDasharray:"113.097",strokeDashoffset:"56.549",strokeWidth:"4"})))))),document.body));function Oe(){++Be&&Fe?.open()}function $e(){--Be<1&&Fe?.close()}var Ae=a(613);const Ue=()=>{const[e,t]=(0,n.useState)(null),[a,c]=(0,n.useState)(""),r=(0,n.useCallback)((()=>c("")));return(0,n.useEffect)((()=>{if(e)return()=>e.destroy();const a=new Ae.G(document.getElementById("app-snackbar"));return a.labelText="Error",a.closeOnEscape=!0,a.listen("MDCSnackbar:closed",r),t(a),h.subscribe(v,c),()=>a.destroy()}),[]),(0,n.useEffect)((()=>{e&&(a?e.open():e.close())}),[a]),(0,s.createPortal)(n.createElement("aside",{id:"app-snackbar",className:"mdc-snackbar",style:{zIndex:9e3}},n.createElement("div",{className:"mdc-snackbar__surface",role:"status","aria-relevant":"additions"},n.createElement("div",{className:"mdc-snackbar__label","aria-atomic":"false"},a))),document.body)};a(87),s.render(n.createElement(n.Fragment,null,n.createElement(Le,null),n.createElement(Ue,null),n.createElement(Re,null)),document.getElementById("root"))},87:(e,t,a)=>{e.exports=a.p+"app-config.json"}},e=>{e.O(0,[216],(()=>(878,e(e.s=878)))),e.O()}]);