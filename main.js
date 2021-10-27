"use strict";(self.webpackChunkgeotab=self.webpackChunkgeotab||[]).push([[179],{5:(e,t,a)=>{var n=a(294),s=a(935),c=a(243),i=a.n(c),r=a(974),l=a(680),o=a(479),d=a(403);const m=({title:e,formId:t,submitBtnId:a,children:[s,c],onSubmit:i,onClose:r})=>{const{current:l}=(0,n.useRef)({instance:null});return(0,n.useEffect)((()=>{const e=l.instance=new d.W(document.getElementById("app-dialog"));return e.listen("MDCDialog:closing",r),e.open(),document.getElementById(t)?.addEventListener("submit",i),document.getElementById(t)?.addEventListener("input",(function(e){this.elements[a].disabled=!this.checkValidity()})),()=>l.instance.destroy()}),[]),n.createElement("div",{id:"app-dialog",className:"mdc-dialog"},n.createElement("div",{className:"mdc-dialog__container"},n.createElement("div",{className:"mdc-dialog__surface"},n.createElement("h2",{className:"mdc-dialog__title centered"},e),n.createElement("div",{className:"mdc-dialog__content"},s),n.createElement("div",{className:"mdc-dialog__actions"},n.createElement("button",{type:"button",className:"mdc-button mdc-dialog__button","data-mdc-dialog-action":"close"},n.createElement("div",{className:"mdc-button__ripple"}),n.createElement("span",{className:"mdc-button__label"},"Cancel")),c))),n.createElement("div",{className:"mdc-dialog__scrim"}))};var u=a(189);const p=({type:e="text",name:t,value:a,placeholder:s,autoComplete:c="off",required:i=!1,onChange:r})=>{const[l,o]=(0,n.useState)(null),[d]=(0,n.useState)(b.next().value);return(0,n.useEffect)((()=>{if(l)return()=>l.destroy();const e=new u.K(document.getElementById(d));return o(e),()=>e.destroy()}),[]),(0,n.useEffect)((()=>{l&&(l.value=a)}),[a]),n.createElement("label",{id:d,className:"mdc-text-field mdc-text-field--filled auto-width"},n.createElement("span",{className:"mdc-text-field__ripple"}),n.createElement("span",{className:"mdc-floating-label",id:`${t}Field`},s),n.createElement("input",{type:e,name:t,defaultValue:a,autoComplete:c,className:"mdc-text-field__input",required:i,onChange:r}),n.createElement("span",{className:"mdc-line-ripple"}))},h={_listeners:{},subscribe(e,t,a=null){this._listeners[e]=[...this._listeners[e]??[],[t,a]]},dispatch(e,t){this._listeners[e]?.forEach((([e,a])=>{e.call(a,t)}))},unsubscribe(e,t){const a=this._listeners[e]?.findIndex(t)??-1;a>-1&&this._listeners[e].splice(a,1)},async makeRequest(e){let t;this.dispatch(PENDING_REQUEST);try{const a=await fetch(e);try{t=await a.clone().json()}catch(e){t=await a.text()}if(!a.ok)throw new Error(`${t?.error??t}`);return t}catch({message:e}){this.dispatch(ERROR_REQUEST,e),console.error(e)}finally{this.dispatch(COMPLETE_REQUEST)}}},g="pending_request",f="complete_request",_="error_request",v="set_user",b=function*(e){for(;;)yield"_react_component_"+e++}(0);function E(){try{const{database:e,sessionId:t,userName:a}=JSON.parse(localStorage.getItem("geotabAPI_credentials"));return{userName:a,database:e,sessionId:t,server:localStorage.getItem("geotabAPI_server")}}catch(e){return null}}function w(e,t){const a="authorize-form",c="form-submit-btn";s.render(n.createElement(m,{title:"Login to GeoTab",formId:a,submitBtnId:c,onSubmit:async t=>{t.preventDefault(),t.target.elements[c].disabled=!0;const a=new FormData(t.target),n=a.get("server")?.trim(),i={method:"Authenticate",params:{database:a.get("database")?.trim(),userName:a.get("username")?.trim(),password:a.get("password")?.trim()}};let[r,l,o,d]=[];h.dispatch(g);try{if(({result:{credentials:{database:r,sessionId:l,userName:o}={}}={},error:d}=await(await fetch(`https://${n}/apiv1`,{method:"post",headers:new Headers({"Content-Type":"application/json"}),body:JSON.stringify(i)})).json()),d)throw d}catch({message:e}){return t.target.elements[c].disabled=!1,h.dispatch(_,e)}finally{h.dispatch(f)}e({userName:o,database:r,server:n,sessionId:l}),h.dispatch(v,{userName:o}),s.unmountComponentAtNode(document.getElementById("dialog-pane")),document.body.classList.remove("mdc-dialog-scroll-lock")},onClose:()=>{s.unmountComponentAtNode(document.getElementById("dialog-pane")),document.body.classList.remove("mdc-dialog-scroll-lock"),t(new Error("Authentication failed"))}},[n.createElement("form",{key:"form",id:a,className:"flex flex--column flex--spreaded"},[n.createElement(p,{key:"server-input",name:"server",placeholder:"server",required:!0,value:"my5.geotab.com"}),n.createElement(p,{key:"database-input",name:"database",placeholder:"database",required:!0,value:"rollins"}),n.createElement(p,{key:"email-input",type:"email",name:"username",placeholder:"user name",autoComplete:"email",required:!0}),n.createElement(p,{key:"password-input",type:"password",name:"password",placeholder:"password",autoComplete:"current-password",required:!0})]),n.createElement("button",{key:"submit-button",id:c,type:"submit",form:a,className:"mdc-button mdc-dialog__button data-mdc-dialog-button-default",disabled:!0},[n.createElement("div",{key:"mdc-ripple",className:"mdc-button__ripple"}),n.createElement("span",{key:"submit-button-label",className:"mdc-button__label"},"Login")])]),document.getElementById("dialog-pane"))}const y={address:new Map,common:new Map,device:new Map,driver:new Map,exceptionEvent:new Map,group:new Map,rule:new Map,trip:new Map};function N(e,t){return e?.panTo(L.latLng(...t),{animate:!0})}function k({dateTime:e,...t}){return{dateTime:Date.parse(e),...t}}function x(e){const t=new Date;return t.setMilliseconds(t.getMilliseconds()-e),t}const C=({options:e,name:t,label:a,onChange:s})=>{const[c]=(0,n.useState)(b.next().value),i=(0,n.useCallback)((({detail:{item:{id:e}}})=>{s?.(t,[e])}),[]),{current:r}=(0,n.useRef)({instance:null});(0,n.useEffect)((()=>{r.instance?.unlisten("MDCMenu:selected",i),r.instance?.destroy();const e=document.getElementById(c),t=new l.g(e);t.setAnchorCorner(o.Ns.BOTTOM_LEFT),t.setFixedPosition(!0),t.open=!1,r.instance=t,t.listen("MDCMenu:selected",i)}),[e]);const d=(0,n.useMemo)((()=>e.map(S,{name:t})),[e]);return n.createElement("div",{className:"mdc-menu-surface--anchor"},n.createElement("button",{className:"mdc-button mdc-button--raised",onClick:()=>r.instance&&(r.instance.open=!0),disabled:!e.length},n.createElement("span",{className:"mdc-button__ripple"}),n.createElement("span",{className:"mdc-button__label"},a)),n.createElement("div",{id:c,className:"mdc-menu mdc-menu-surface"},n.createElement("ul",{className:"mdc-deprecated-list",role:"radiogroup"},d)))};function S({name:e,title:t,checked:a=!1}){return n.createElement("li",{key:e,id:e,className:"mdc-deprecated-list-item",role:"radio","aria-checked":a},n.createElement("span",{className:"mdc-deprecated-list-item__ripple"}),n.createElement("span",{className:"mdc-deprecated-list-item__graphic"},n.createElement("div",{className:"mdc-radio"},n.createElement("input",{className:"mdc-radio__native-control",type:"radio",id:`radio-${e}`,name:this.name,defaultChecked:a,value:e}),n.createElement("div",{className:"mdc-radio__background"},n.createElement("div",{className:"mdc-radio__outer-circle"}),n.createElement("div",{className:"mdc-radio__inner-circle"})))),n.createElement("label",{className:"mdc-deprecated-list-item__text",htmlFor:`radio-${e}`},t))}const I=n.createContext(null),M="./app-config.json",D=[{name:"auV1Pjb5pTkC5OzkCwOxoJA",title:"Harsh Brake",checked:!0},{name:"a4zk6nwPd-kus-jY3zBPPqw",title:"Harsh Cornering",checked:!0},{name:"RuleAccidentId",title:"Possible Accident",checked:!0},{name:"aX_l5MgXx8UODDE5rq2ovKw",title:"Speeding > 80 MPH",checked:!0}],T=new Map([["divisions",{label:"Division",options:new Set,checked:new Set,dependentFilter:"regions"}],["regions",{label:"Region",options:new Set,checked:new Set,dependentFilter:"branches"}],["branches",{label:"Branch",options:new Set,checked:new Set}]]),F="check_all",P="divider";let R,$;async function B(){return R??(async()=>{let{userName:e,sessionId:t,database:a,server:n}=E()??{};if(!e||!n)try{if(({userName:e,database:a,server:n,sessionId:t}=await($??($=new Promise(w)))),!e||!a||!n)throw new Error("Authentication failed")}catch({message:e}){return console.error(e),h.dispatch(_,e),{credentials:{}}}finally{$=null}return localStorage.setItem("geotabAPI_credentials",JSON.stringify({database:a,sessionId:t,userName:e})),localStorage.setItem("geotabAPI_server",n),R={credentials:{userName:e,sessionId:t,database:a},server:n}})()}function z(e,t){return t?V(e):A("Get",e)}async function O(e){return A("GetAddresses",e)}async function A(e,t){try{const{server:a,credentials:n}=await B(),s={method:e,params:{...t,credentials:n}},c=await fetch(`https://${a}/apiv1`,{method:"post",headers:new Headers({"Content-Type":"application/json"}),body:JSON.stringify(s)}),{result:i,error:{data:{type:r}={},message:l}={}}=await c.json();if("OverLimitException"===r)return async function(e,t){return await j(3e4),A(e,t)}(e,t);if("InvalidUserException"===r)return G(),[];if(l)throw new Error(l);return i}catch({message:e}){return h.dispatch(_,e),console.error(e),[]}}async function V(e){try{const{server:t,credentials:a}=await B(),n={method:"ExecuteMultiCall",params:{calls:e,credentials:a}},s=await fetch(`https://${t}/apiv1`,{method:"post",headers:new Headers({"Content-Type":"application/json"}),body:JSON.stringify(n)}),{result:c,error:{data:{type:i}={},message:r}={}}=await s.json();if("OverLimitException"===i)return async function(e){return await j(3e4),V(e)}(e);if("InvalidUserException"===i)return G(),[];if(r)throw new Error(r);return c}catch({message:e}){return h.dispatch(_,e),console.error(e),[]}}function G(){localStorage.removeItem("geotabAPI_credentials"),localStorage.removeItem("geotabAPI_server"),R=null,h.dispatch(v,null)}async function j(e){h.dispatch(g),await new Promise((t=>setTimeout(t,e))),h.dispatch(f)}const U=({onChange:e})=>{const[t,a]=(0,n.useState)([]),{current:s}=(0,n.useRef)(T),c=(0,n.useContext)(I),i=async()=>{const e=await Promise.all([...s.entries()].map((async([e,{options:t,checked:a,...n}])=>({...n,id:e,options:await Promise.all([...t.values()].map((async e=>{const[{name:t}]=await y.group.get(e);return function({id:e,name:t,checked:a=!1}){return{name:e,title:t,checked:a}}({id:e,name:t,checked:a.has(e)})})))}))));a(e)},r=(0,n.useCallback)((async(t,a)=>{s.get(t).checked=new Set(a),await async function e({dependentFilter:t,checked:a}){if(!s.has(t))return;const n=await[...a.values()].reduce((async(e,a)=>{const[{children:n=[]}={}]=await(y.group.get(a)??y.group.set(a,z({typeName:"Group",search:{id:a}})).get(a));let s=await(y.group.get(`${a}-children`)??y.group.set(`${a}-children`,z(n.map((({id:e})=>({method:"Get",params:{typeName:"Group",search:{id:e}}}))),!0)).get(`${a}-children`));return s="branches"===t&&s.map((([e])=>{const{id:t}=e;return y.group.set(t,Promise.resolve([e])),t}))||s.reduce(((e,[t])=>{const{id:a,children:{length:n}}=t;return n?(y.group.set(a,Promise.resolve([t])),[...e,a]):e}),[]),new Set([...await e,...s].sort())}),Promise.resolve(new Set));return s.set(t,{...s.get(t),options:n,checked:new Set([...s.get(t).checked.values()].filter((e=>n.has(e))))}),e(s.get(t))}(s.get(t)),i(),e?.([...s.get("branches").checked.values()])}),[]);(0,n.useEffect)((async()=>{if(!c)return[...s.values()].forEach((e=>e.options=e.checked=new Set)),i();const[{children:e={}}={}]=await z({typeName:"Group",search:{id:"b271F"}}),t=(await(y.group.get("b271F-children")??y.group.set("b271F-children",z(e.map((({id:e})=>({method:"Get",params:{typeName:"Group",search:{id:e}}}))),!0)).get("b271F-children"))).reduce(((e,[t])=>{const{id:a,children:{length:n}}=t;return n?(y.group.set(a,Promise.resolve([t])),[...e,a]):e}),[]).sort();s.set("divisions",{...s.get("divisions"),options:new Set(t)}),i()}),[c]);const l=(0,n.useMemo)((()=>t.map((({id:e,options:t,label:a})=>n.createElement("div",{key:e,className:"filter-control"},n.createElement(C,{options:t,name:e,label:a,onChange:r}))))),[t]);return n.createElement("div",{className:"flex flex--spreaded flex--wrap"},l)},q=(Q=new DOMParser,e=>Q.parseFromString(e,"text/html").body?.firstElementChild??document.createElement("div"));var Q;const H=({name:e="",status:t="",groups:a="",driver:n="",driverFICO:s,location:c="",issues:i=[]})=>`\n        <div class="car-tooltip">\n            <div class="car-tooltip__icon material-icons">directions_car</div>\n            <div class="car-tooltip__name">${e}</div>\n            <div class="car-tooltip__status">${t}</div>\n            <div class="car-tooltip__group">${a}</div>\n            <div class="car-tooltip__driver">${n}</div>\n            <div class="car-tooltip__driver-fico">`+(s&&`\n                    <span>FICO:</span>\n                    <span>${s}</span>`||"")+`\n            </div>\n            <div class="car-tooltip__location">${c}</div>\n            <div class="car-tooltip__issues">${i.reduce(((e,t)=>`${e}<li class="issues__item">${t}</li>`),'<ul class="issues__list">')+"</ul"}</div>\n        </div>`;a(803),a(134),a(965);const W=i().Marker.extend({speed:0,_lastData:null,_lastVersion:null,_animationQueue:Promise.resolve(),_setPos(e){this._icon&&(new(i().PosAnimation)).run(this._icon,e,.5,1),this._shadow&&(new(i().PosAnimation)).run(this._shadow,e,.5,1),this._zIndex=e.y+this.options.zIndexOffset,this._resetZIndex()},setSpeed(e){return this.getElement()?.classList?.toggle("car-icon--stopped",!e),this.speed=e,this},setDimmed(e){return this.getElement()?.classList?.toggle("car-icon--dimmed",e),this},getSpeed(){return this.speed},getLastData(){return this._lastData},setLastData(e){return this._lastData=e,this},getLastVersion(){return this._lastVersion},setLastVersion(e){return this._lastVersion=e,this},getAnimationQueue(){return this._animationQueue},setAnimationQueue(e){return this._animationQueue=e,this}}),J=18e4;let K,X=Promise.resolve();const Z={};let Y;const ee=({onReady:e,onClick:t,deviceFilter:a=[]})=>{const s=(0,n.useContext)(I);return Y=t,(0,n.useEffect)((async()=>{let[t,a,n,s]=[];try{({accessToken:t,center:a,attribution:n,tileLayerUrl:s}=await(y.common.get("app_config")??y.common.set("app_config",(await fetch(M)).json()).get("app_config")))}catch({message:e}){return console.error(e),void h.dispatch(_,e)}K=i().map("leaflet-map").setView(a,11).on("click",ae),i().tileLayer(s,{attribution:n,maxZoom:18,id:"mapbox/streets-v11",tileSize:512,zoomOffset:-1,accessToken:t}).addTo(K),e?.(K)}),[]),(0,n.useEffect)((async()=>{if(!s||!a.length)return ie([],Z,K);const e=a.reduce(((e,t,a)=>{const n=Math.floor(a/60);return(e[n]??(e[n]=[])).push(t),e}),[]);for await(let t of e){await X;const{result:e,throttleTimeout:n}=await oe(t,a);ie(e,Z,K),X=new Promise((e=>setTimeout(e,n)))}}),[s,a]),n.createElement("div",{id:"leaflet-map",className:"auto-height"})};async function te({latlng:{lat:e,lng:t},target:a}){const n=Z[this.id];ne(this.id),N(K,[e,t]),Y?.(this.id),ce(n,q('<div class="car-tooltip__stub material-icons">access_time</div>'),!0);const s=await le(this.id,a.getSpeed());n.setTooltipContent(q(H(s)))}function ae(){for(const e in Z)Z[e].unbindTooltip().setDimmed(!1);Y?.()}function ne(e){for(const t in Z)Z[t].unbindTooltip().setDimmed(t!==e)}function se(e){return i().divIcon({iconSize:i().point(24,24),className:"car-icon material-icons"+(e?"":" car-icon--stopped"),html:"directions_car"})}function ce(e,t,a=!1){e.bindTooltip(t,{...a&&{permanent:!0}}).openTooltip()}function ie(e,t,a){e.forEach((e=>{const{device:{id:n}}=e;n in t||(t[n]=function({latitude:e,longitude:t,isDriving:a,device:{id:n}},s){return new W(i().latLng(e,t),{icon:se(a)}).addTo(s).on("mouseover",re,{id:n}).on("click",te,{id:n,latitude:e,longitude:t})}(e,a),async function e(t,a){if(!(t in a))return;const n=await async function(e,t){let{toVersion:a,data:n=[]}=await async function(e,t,a){return async function(e){return A("GetFeed",e)}({typeName:"LogRecord",resultsLimit:1e3,...a&&{fromVersion:a},search:{...!a&&{fromDate:t},deviceSearch:{id:e}}})}(e,x(J).toISOString(),t[e].getLastVersion());if(t[e].setLastVersion(a),!n.length)return J;const s=t[e].getLastData();s&&n.unshift(s);const c=n.reduce(((a,n)=>(t[e].setAnimationQueue(async function(e,t,a,{dateTime:n,latitude:s,longitude:c,speed:r},{dateTime:l,latitude:o,longitude:d,speed:m}){if(!(t in a))return;e&&await e,a[t]?.setSpeed(r);const u=function*(e){for(let t=0,a=0,s=d-c,i=Math.round((l-n)/500);t<=i;a=++t/i){let t=d-s*(1-a);yield[e(t),t]}}(function([e,t],[a,n]){if(e===t)return()=>n;const s=(n-a)/(t-e),c=a-s*e;return e=>s*e+c}([c,d],[s,o]));await async function e(n){const{value:s}=n.next();if(s&&t in a)return a[t].setLatLng(i().latLng(...s)),await new Promise((e=>setTimeout(e,500))),e(n)}(u),a[t]?.setSpeed(m)}(t[e].getAnimationQueue(),e,t,k(a),k(n))),n)));return t[e].setLastData(c),Date.now()-Date.parse(c.dateTime)}(t,a);n&&setTimeout(e,n,t,a)}(n,t))}));const n=e.map((({device:{id:e}})=>e));for(const e in t)n.includes(e)||(t[e].remove(),delete t[e])}async function re({target:e}){if(e.getTooltip())return;ce(e,q('<div class="car-tooltip__stub material-icons">access_time</div>'));const t=await le(this.id,e.getSpeed());e.setTooltipContent(q(H(t)))}async function le(e,t){const[{groups:a,driver:{id:n},exceptionEvents:s,latitude:c,longitude:i}]=await z({typeName:"DeviceStatusInfo",resultsLimit:1,search:{deviceSearch:{id:e}}}),r=t&&`Driving ${t} Mph`||"Stopped",[{name:l}]=await(y.device.get(e)??y.device.set(e,z({typeName:"Device",resultsLimit:1,search:{id:e}})).get(e)),[{name:o}]=await(y.driver.get(n)??y.driver.set(n,z({typeName:"User",resultsLimit:1,search:{id:n}})).get(n)),d=await Promise.all(s.map((async({rule:{id:e}})=>{const[{name:t}]=await(y.rule.get(e)??y.rule.set(e,z({typeName:"Rule",resultsLimit:1,search:{id:e}})).get(e));return t}))),m=(await Promise.all(a.map((async({id:e})=>{const[{name:t}]=await(y.group.get(e)??y.group.set(e,z({typeName:"Group",resultsLimit:1,search:{id:e}})).get(e));return t})))).join(" "),[{formattedAddress:u}]=await O({coordinates:[{x:i,y:c}]});return{name:l,groups:m,status:r,driver:o,issues:d,location:u,driverFICO:await async function(e){if(!e)return;let t=[];try{const{ficoServiceUrl:e}=await(y.common.get("app_config")??y.common.set("app_config",(await fetch(M)).json()).get("app_config"));if(!e)throw new Error("FICO service URL is not configured");t=await(y.common.get("fico")??y.common.set("fico",(await fetch(e)).json()).get("fico"))}catch({message:e}){return h.dispatch(_,e),void console.error(e)}const{fico:a}=t.find((({device_id:t})=>t===e))??{};return a}(e)}}const oe=(de=new Map,async(e,t)=>{const[a,n]=e.reduce((([e,t],a)=>{const n=de.has(a);return[n&&[...e,de.get(a)]||e,!n&&[...t,a]||t]}),[[],[]]),s=n.length&&(await z(n.map((e=>({method:"Get",params:{typeName:"DeviceStatusInfo",resultsLimit:1,search:{deviceSearch:{id:e}}}}))),!0)).flat()||[];s.forEach((e=>{const{device:{id:t}}=e;de.set(t,e)}));for(const e of de.keys())!t.includes(e)&&de.delete(e);return{result:[...s,...a],throttleTimeout:1e3*n.length}});var de,me=a(828);const ue=({onClick:e,children:t,head:a=[],body:s=[]})=>{const{current:c}=(0,n.useRef)({table:null}),i=(0,n.useCallback)((({detail:{rowId:t}})=>e?.(t)),[]);(0,n.useEffect)((()=>(c.table=new me.T(document.getElementById("app-data-table")),c.table.listen("MDCDataTable:rowClick",i),()=>c.table.destroy())),[]),(0,n.useLayoutEffect)((()=>{c.table?.layout()}),[s]);const r=(0,n.useMemo)((()=>a.map(pe)),[a]),l=(0,n.useMemo)((()=>s.reduce(ge,[]).map(fe,[])),[s]);return n.createElement("div",{id:"app-data-table",className:"mdc-data-table auto-width auto-height scrollable"},n.createElement("div",{className:"mdc-data-table__table-container"},n.createElement("table",{className:"mdc-data-table__table"},n.createElement("thead",{style:{position:"sticky",top:"0"}},n.createElement("tr",{className:"mdc-data-table__header-row"},r)),n.createElement("tbody",{className:"mdc-data-table__content"},l))))};function pe(e,t){return n.createElement("th",{key:t,className:"mdc-data-table__header-cell",role:"columnheader",scope:"col"},e)}function he(e,t){return n.createElement("td",{key:t,className:"mdc-data-table__cell"},e)}function ge(e,t){return e.find((({id:e})=>e===t.id))?e:[...e,t]}function fe({id:e,columns:t}){return n.createElement("tr",{key:e,"data-row-id":e,className:"mdc-data-table__row"},t.map(he))}var _e=a(859);const ve=function({title:e,value:t}){return n.createElement("li",{key:t,className:["mdc-deprecated-list-item",...t===this.value&&["mdc-deprecated-list-item--selected"]||[]].join(" "),"data-value":t,role:"option"},n.createElement("span",{className:"mdc-deprecated-list-item__ripple"}),n.createElement("span",{className:"mdc-deprecated-list-item__text"},e))},be=({options:e,name:t,value:a,placeholder:s="Select item",callback:c=(()=>{})})=>{const[i,r]=(0,n.useState)(null),[l]=(0,n.useState)(b.next().value);(0,n.useEffect)((()=>{if(i)return()=>i.destroy();const e=new _e.H(document.getElementById(l));return r(e),e.listen("MDCSelect:change",(({detail:{value:e}})=>c(t,e))),()=>e.destroy()}),[]);const{title:o=""}=(0,n.useMemo)((()=>e.find((({value:e})=>e===a))??{}),[e,a]),d=(0,n.useMemo)((()=>e.map(ve,{value:a})),[e,a]);return n.createElement("div",{id:l,className:"mdc-select mdc-select--filled auto-width custom-select"},n.createElement("div",{className:"mdc-select__anchor",role:"button","aria-haspopup":"listbox","aria-expanded":"false","aria-labelledby":"demo-label demo-selected-text"},n.createElement("span",{className:"mdc-select__ripple"}),n.createElement("span",{id:"demo-label",className:"mdc-floating-label"},s),n.createElement("span",{className:"mdc-select__selected-text-container"},n.createElement("span",{id:"demo-selected-text",className:"mdc-select__selected-text"},o)),n.createElement("span",{className:"mdc-select__dropdown-icon"},n.createElement("svg",{className:"mdc-select__dropdown-icon-graphic",viewBox:"7 10 10 5",focusable:"false"},n.createElement("polygon",{className:"mdc-select__dropdown-icon-inactive",stroke:"none",fillRule:"evenodd",points:"7 10 12 15 17 10"}),n.createElement("polygon",{className:"mdc-select__dropdown-icon-active",stroke:"none",fillRule:"evenodd",points:"7 15 12 10 17 15"}))),n.createElement("span",{className:"mdc-line-ripple"})),n.createElement("div",{className:"mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth"},n.createElement("ul",{className:"mdc-deprecated-list",role:"listbox","aria-label":"Value picker listbox"},d)))},Ee=[{title:"50",value:50},{title:"200",value:200},{title:"1000",value:1e3}],we=({total:e=0,pageSize:t=50,callback:a})=>{const[s,c]=(0,n.useState)(!0),[i,r]=(0,n.useState)(!e),[l,o]=(0,n.useState)(Math.min(e,1)),[d,m]=(0,n.useState)(Math.min(e,t));(0,n.useEffect)((()=>{u.size=Math.min(e,t)}),[e,t]);const{current:u}=(0,n.useRef)({size:Math.min(e,t),index:0}),p=(0,n.useCallback)((()=>{a?.([u.size,u.index=0]),c(!0),r(!1),o(1),m(u.size*(u.index+1))}),[a]),h=(0,n.useCallback)((()=>{a?.([u.size,u.index=Math.max(u.index-1,0)]),c(!u.index),r(u.index===Math.floor(e/u.size)),o(u.size*u.index+1),m(u.size*(u.index+1))}),[a]),g=(0,n.useCallback)((()=>{a?.([u.size,u.index=Math.min(u.index+1,Math.floor(e/u.size))]),c(!1),r(u.index===Math.floor(e/u.size)),o(u.size*u.index+1),m(u.size*(u.index+1))}),[a]),f=(0,n.useCallback)((()=>{a?.([u.size,u.index=Math.floor(e/u.size)]),c(!1),r(!0),o(u.size*u.index+1),m(u.size*(u.index+1))}),[a]),_=(0,n.useCallback)((e=>{a?.([u.size=e,u.index])}),[]);return n.createElement("div",{className:"mdc-data-table__pagination"},n.createElement("div",{className:"mdc-data-table__pagination-trailing"},n.createElement("div",{className:"mdc-data-table__pagination-rows-per-page"},n.createElement(be,{options:Ee,value:50,placeholder:"Page size",callback:_})),n.createElement("div",{className:"mdc-data-table__pagination-navigation"},n.createElement("div",{className:"mdc-data-table__pagination-total"},l," - ",d," of ",e),n.createElement("button",{className:"mdc-icon-button material-icons mdc-data-table__pagination-button","data-first-page":"true",disabled:s,onClick:p},n.createElement("div",{className:"mdc-button__icon"},"first_page")),n.createElement("button",{className:"mdc-icon-button material-icons mdc-data-table__pagination-button","data-prev-page":"true",disabled:s,onClick:h},n.createElement("div",{className:"mdc-button__icon"},"chevron_left")),n.createElement("button",{className:"mdc-icon-button material-icons mdc-data-table__pagination-button","data-next-page":"true",onClick:g,disabled:i},n.createElement("div",{className:"mdc-button__icon"},"chevron_right")),n.createElement("button",{className:"mdc-icon-button material-icons mdc-data-table__pagination-button","data-last-page":"true",onClick:f,disabled:i},n.createElement("div",{className:"mdc-button__icon"},"last_page")))))},ye=36e5;let Ne,ke={},xe=[];const Ce=["Time","Event","Vehicle","Driver","Location","Branch"],Se=({onRowSelect:e,onExceptionEventsChange:t,deviceFilter:a,ruleFilter:s=[]})=>{const[c,i]=(0,n.useState)([]),[r,l]=(0,n.useState)(0),o=(0,n.useContext)(I),d=(0,n.useMemo)((()=>s),[]),{current:m}=(0,n.useRef)({slice:{from:0,to:1e3},lastRuleFilter:null,lastDeviceFilter:null}),u=(0,n.useCallback)((t=>{e?.(t)}),[e]),p=(0,n.useCallback)((async()=>{const e=await async function(e,t,a){return z(e.map((e=>{const n=a[e];return{method:"GetFeed",params:{typeName:"ExceptionEvent",...n&&{fromVersion:n},search:{...!n&&{fromDate:t},ruleSearch:{id:e}}}}})),!0)}(d,x(ye).toISOString(),ke);let a=[];({lastVersions:ke,lastData:a}=await e.reduce((async(e,{data:t,toVersion:a},n)=>{const{lastVersions:s,lastData:c}=await e;return{lastData:[...c,...await Promise.all(t.map((e=>async function({id:e,activeFrom:t,activeTo:a,device:{id:n},driver:{id:s},rule:{id:c}}){const{device:i,branch:r}=await(async e=>{const[{name:t="Unknown",groups:[{id:a}]}]=await(y.device.get(e)??y.device.set(e,z({typeName:"Device",resultsLimit:1,search:{id:e}})).get(e)),[{name:n="Unknown"}]=await(y.group.get(a)??y.group.set(a,z({typeName:"Group",resultsLimit:1,search:{id:a}})).get(a));return{device:t,branch:n}})(n),[{name:l="Unknown"}]=await(y.driver.get(s)??y.driver.set(s,z({typeName:"User",resultsLimit:1,search:{id:s}})).get(s)),[{name:o="Unknown"}]=await(y.rule.get(c)??y.rule.set(c,z({typeName:"Rule",resultsLimit:1,search:{id:c}})).get(c)),d=await(y.trip.get(`${t}-${a}-${n}`)??y.trip.set(`${t}-${a}-${n}`,z({typeName:"LogRecord",resultsLimit:100,search:{fromDate:t,toDate:a,deviceSearch:{id:n}}})).get(`${t}-${a}-${n}`)),[{longitude:m,latitude:u}={}]=d;y.exceptionEvent.set(e,{tripPoints:d,deviceId:n});const[{formattedAddress:p="Unknown"}]=m&&u&&await(y.address.get(`${m}-${u}`)??y.address.set(`${m}-${u}`,O({coordinates:[{x:m,y:u}]})).get(`${m}-${u}`));return{id:e,activeTo:a,rule:o,device:i,driver:l,location:p,branch:r,deviceId:n,ruleId:c}}(function({activeTo:e,...t}){return{activeTo:Date.parse(e),...t}}(e)))))],lastVersions:{...s,[d[n]]:a}}}),Promise.resolve({lastVersions:ke,lastData:a}))),xe=[...a.sort(Me),...xe.filter(Te,{noOlderThan:x(ye)})],l(xe.length);const n=Ie(xe,m.lastDeviceFilter,m.lastRuleFilter);i(n.slice(m.slice.from,m.slice.to).map(De)),t(n.map((({deviceId:e})=>e)))}),[]);(0,n.useEffect)((()=>{m.lastRuleFilter=s;const e=Ie(xe,a,s);i(e.slice(m.slice.from,m.slice.to).map(De)),t(e.map((({deviceId:e})=>e)))}),[s]),(0,n.useEffect)((()=>{m.lastDeviceFilter=a;const e=Ie(xe,a,s);i(e.slice(m.slice.from,m.slice.to).map(De))}),[a]),(0,n.useEffect)((async()=>{clearInterval(Ne),ke={},i(xe=[]),o&&(h.dispatch(g),await p(),h.dispatch(f),Ne=setInterval(p,6e4))}),[o]);const _=(0,n.useCallback)((([e,t])=>{const a=xe.slice(m.slice.from=e*t,m.slice.to=e*(t+1));i(a)}),[c]);return n.createElement(ue,{head:Ce,body:c,onClick:u},n.createElement(we,{total:r,pageSize:10,callback:_}))};function Ie(e,t,a){return e.reduce(((e,n)=>{const{deviceId:s,ruleId:c}=n;return(t?s===t:a.includes(c))&&[...e,n]||e}),[])}function Me({activeTo:e},{activeTo:t}){return function(e,t){return e>t?1:e<t?-1:0}(t,e)}function De({id:e,activeTo:t,rule:a,device:n,driver:s,location:c,branch:i}){return{id:e,columns:[new Date(t).toLocaleTimeString(),a,n,s,c,i]}}function Te({activeTo:e}){return e>this.noOlderThan}const Le={async"user-login"(){await B()},"user-logout":G},Fe=()=>{const[e,t]=(0,n.useState)(null),a=(0,n.useContext)(I);(0,n.useEffect)((()=>{if(e)return()=>e.destroy();const a=document.getElementById("auth-menu"),n=new l.g(a);return n.setAnchorCorner(o.Ns.BOTTOM_LEFT),n.listen("MDCMenu:selected",(({detail:{item:{id:e}}})=>Le[e]?.())),t(n),()=>n.destroy()}),[]);const s=(0,n.useMemo)((()=>a?.userName??"Guest"),[a]),c=(0,n.useMemo)((()=>[n.createElement("li",{key:"user-action",id:a?.userName?"user-logout":"user-login",className:"mdc-deprecated-list-item"},n.createElement("span",{className:"mdc-deprecated-list-item__ripple"}),n.createElement("span",{className:"mdc-list-item__text"},a?.userName?"Logout":"Login"))]),[a]),i=(0,n.useCallback)((()=>e&&(e.open=!0)),[e]);return n.createElement("div",{className:"mdc-menu-surface--anchor"},n.createElement("button",{className:"mdc-top-app-bar__action-item mdc-button",onClick:i},n.createElement("div",{className:"mdc-button__ripple"}),n.createElement("i",{className:"material-icons mdc-button__icon"},"account_circle"),n.createElement("span",{className:"mdc-button__label mobile-hidden"},s)),n.createElement("div",{id:"auth-menu",className:"mdc-menu mdc-menu-surface"},n.createElement("ul",{className:"mdc-deprecated-list"},c)))},Pe=({options:e,name:t,label:a,onChange:s})=>{const{value:c}=(0,n.useMemo)((()=>b.next()),[]),i=(0,n.useCallback)((({detail:{item:e}})=>{let{instance:{list:{listElements:a,selectedIndex:n}}}=r;if(e.id===F){const{checked:n=!1}=e.getElementsByTagName("input").item(0)??{};return s?.(t,n&&a.map((({id:e})=>e))||[])}s?.(t,n.reduce(((e,t)=>[...e,...a[t]?.id!==F&&[a[t]?.id]||[]]),[]))}),[]),{current:r}=(0,n.useRef)({instance:null});(0,n.useEffect)((()=>{r.instance?.unlisten("MDCMenu:selected",i),r.instance?.destroy();const e=document.getElementById(c),t=new l.g(e);t.setAnchorCorner(o.Ns.BOTTOM_LEFT),t.open=!1,r.instance=t,t.listen("MDCMenu:selected",i)}),[e]);const d=(0,n.useMemo)((()=>[Re({name:F,title:"Select all",checked:e.every((({checked:e})=>e))}),Re({name:P}),...e.map(Re)]),[e]);return n.createElement("div",{className:"mdc-menu-surface--anchor auto-width"},n.createElement("button",{className:"mdc-button mdc-button--raised auto-width",onClick:()=>r.instance&&(r.instance.open=!0),disabled:!e.length},n.createElement("span",{className:"mdc-button__ripple"}),n.createElement("span",{className:"mdc-button__label"},a)),n.createElement("div",{id:c,className:"mdc-menu mdc-menu-surface"},n.createElement("ul",{className:"mdc-deprecated-list",role:"radiogroup"},d)))};function Re({name:e,title:t,checked:a=!1}){return e===P&&n.createElement("li",{key:e,role:"separator",className:"mdc-deprecated-list-divider"})||n.createElement("li",{key:e,id:e,className:"mdc-deprecated-list-item",role:"checkbox","aria-checked":a},n.createElement("span",{className:"mdc-deprecated-list-item__ripple"}),n.createElement("span",{className:"mdc-deprecated-list-item__graphic"},n.createElement("div",{className:"mdc-checkbox"},n.createElement("input",{type:"checkbox",name:e,className:"mdc-checkbox__native-control",id:`checkbox-${e}`,defaultChecked:a}),n.createElement("div",{className:"mdc-checkbox__background"},n.createElement("svg",{className:"mdc-checkbox__checkmark",viewBox:"0 0 24 24"},n.createElement("path",{className:"mdc-checkbox__checkmark-path",fill:"none",d:"M1.73,12.91 8.1,19.28 22.79,4.59"})),n.createElement("div",{className:"mdc-checkbox__mixedmark"})))),n.createElement("label",{className:"mdc-deprecated-list-item__text",htmlFor:`checkbox-${e}`},t))}var $e=a(660);const Be=({name:e,label:t,onChange:a,on:s=!0})=>{const{value:c}=(0,n.useMemo)((()=>b.next()),[]),{current:i}=(0,n.useRef)({instance:null}),r=(0,n.useCallback)((()=>{a(e,i.instance?.selected)}),[e,a]);return(0,n.useEffect)((()=>{const e=document.getElementById(c);return i.instance=new $e.C(e),()=>i.instance?.destroy()}),[]),n.createElement("label",{className:"app-switch flex flex--center"},n.createElement("button",{id:c,className:["mdc-switch",s?"mdc-switch--selected":"mdc-switch--unselected"].join(" "),type:"button",role:"switch","aria-checked":"false",onClick:r},n.createElement("div",{className:"mdc-switch__track"}),n.createElement("div",{className:"mdc-switch__handle-track"},n.createElement("div",{className:"mdc-switch__handle"},n.createElement("div",{className:"mdc-switch__shadow"},n.createElement("div",{className:"mdc-elevation-overlay"})),n.createElement("div",{className:"mdc-switch__ripple"}),n.createElement("div",{className:"mdc-switch__icons"},n.createElement("svg",{className:"mdc-switch__icon mdc-switch__icon--on",viewBox:"0 0 24 24"},n.createElement("path",{d:"M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z"})),n.createElement("svg",{className:"mdc-switch__icon mdc-switch__icon--off",viewBox:"0 0 24 24"},n.createElement("path",{d:"M20 13H4v-2h16v2z"})))))),n.createElement("span",{className:"app-switch__label mdc-typography--button"},t))};let ze,Oe;const Ae=()=>{const[e,t]=(0,n.useState)(E()),[a,s]=(0,n.useState)(D),[c,l]=(0,n.useState)(D.map((({name:e})=>e))),[o,d]=(0,n.useState)(null),[m,u]=(0,n.useState)([]),[p,g]=(0,n.useState)(!0),{current:f}=(0,n.useRef)({lastGroupFilter:[],lastDeviceFilter:[],fleetManMode:p});(0,n.useEffect)((()=>{new r.t(document.getElementById("top-app-bar")),h.subscribe(v,t)}),[]);const _=(0,n.useCallback)((e=>ze=e),[]),b=(0,n.useCallback)((e=>d(e)),[]),w=(0,n.useCallback)((async e=>{if(!e.length||f.fleetManMode)return;Oe?.remove(),Oe=null;const t=e.map((e=>({id:e}))),a=await z({typeName:"DeviceStatusInfo",resultsLimit:1e3,search:{deviceSearch:{groups:t}}}),{latitude:n,longitude:s}=a[a.length-1];n&&s&&N(ze,[n,s]);const c=a.map((({device:{id:e}})=>e));f.lastGroupFilter=e,u(c)}),[p]),k=(0,n.useCallback)(((...[,e])=>{if(e.includes(F))return l(D.map((({name:e})=>e))),s(D);l(e),s(D.map((t=>({...t,checked:e.includes(t.name)}))))}),[]),x=(0,n.useCallback)(((e,t)=>{g(f.fleetManMode=t),t?u(f.lastDeviceFilter):w(f.lastGroupFilter)}),[]),C=(0,n.useCallback)((e=>{f.fleetManMode&&u(f.lastDeviceFilter=e)}),[]),S=(0,n.useCallback)((e=>{const{tripPoints:t=[[]],deviceId:a}=y.exceptionEvent.get(e)??{},n=t.map((({latitude:e,longitude:t})=>[e,t]));if(e===Oe?.getId())return ae(),Oe?.remove(),Oe=null;Oe?.remove(),ne(a),Oe=function(e,{points:t,color:a="red"},n){return{_marker:i().marker(t[0],{icon:i().divIcon({iconSize:i().point(12,12),className:"icon__point"})}).addTo(n),_path:i().polyline(t,{color:a}).addTo(n),_id:e,getId(){return this._id},remove(){this._marker?.remove(),this._path?.remove()}}}(e,{points:n},N(ze,n[0]))}),[]);return n.createElement(I.Provider,{value:e},n.createElement("header",{id:"top-app-bar",className:"mdc-top-app-bar mdc-top-app-bar--fixed"},n.createElement("div",{className:"mdc-top-app-bar__row"},n.createElement("section",{className:"mdc-top-app-bar__section mdc-top-app-bar__section--align-start",style:{flex:"0 1 auto",width:"6em"}},n.createElement("a",{href:"https://www.rollins.com",title:"Rollins Inc."},n.createElement("img",{className:"app-logo",src:"https://www.rollins.com/~/media/Images/R/Rollins-V2/logo/logo.png?h=69&la=en&w=137",alt:"Rollins Inc. - link to home page"}))),n.createElement("section",{className:"mdc-top-app-bar__section"},n.createElement("div",{className:"mdc-typography--headline5 centered",style:{flex:"1 1 auto",fontWeight:"500",lineHeight:"1.2"}},"Real time data")),n.createElement("section",{className:"mdc-top-app-bar__section mdc-top-app-bar__section--align-end",style:{flex:"0 1 auto",width:"6em"}},n.createElement(Fe,null)))),n.createElement("main",{id:"root",className:"flex__child flex flex--column mdc-top-app-bar--fixed-adjust"},n.createElement("div",{className:"leaflet-map-container",style:{flex:"1 0 auto"}},n.createElement(ee,{deviceFilter:m,onReady:_,onClick:b}),n.createElement("div",{className:"leaflet-map-overlay leaflet-map-overlay--left",style:{display:p?"none":"initial"}},n.createElement(U,{onChange:w})),n.createElement("div",{className:"leaflet-map-overlay leaflet-map-overlay--right flex flex--column flex--spreaded"},n.createElement("div",{className:"flex__child"},n.createElement(Be,{label:"Fleet manager mode",name:"mode",onChange:x,on:!0})),n.createElement("div",{className:"flex__child"},n.createElement(Pe,{options:a,onChange:k,name:"event_configurator",label:"Filter Events"})))),n.createElement("div",{className:"flex__child scrollable"},n.createElement(Se,{ruleFilter:c,deviceFilter:o,onExceptionEventsChange:C,onRowSelect:S}))))};var Ve=a(825);let Ge,je=0;const Ue=()=>((0,n.useEffect)((()=>(Ge=new Ve.z(document.getElementById("app-loader")),Ge.determinate=!1,Ge.close(),h.subscribe(g,qe),h.subscribe(f,Qe),()=>{h.unsubscribe(g,qe),h.unsubscribe(f,Qe),Ge.destroy(),Ge=null})),[]),(0,s.createPortal)(n.createElement("div",{id:"app-loader",className:"mdc-circular-progress app-loader",role:"progressbar","aria-label":"Example Progress Bar","aria-valuemin":"0","aria-valuemax":"1"},n.createElement("div",{className:"mdc-circular-progress__determinate-container"},n.createElement("svg",{className:"mdc-circular-progress__determinate-circle-graphic",viewBox:"0 0 48 48",xmlns:"http://www.w3.org/2000/svg"},n.createElement("circle",{className:"mdc-circular-progress__determinate-track",cx:"24",cy:"24",r:"18",strokeWidth:"4"}),n.createElement("circle",{className:"mdc-circular-progress__determinate-circle",cx:"24",cy:"24",r:"18",strokeDasharray:"113.097",strokeDashoffset:"113.097",strokeWidth:"4"}))),n.createElement("div",{className:"mdc-circular-progress__indeterminate-container"},n.createElement("div",{className:"mdc-circular-progress__spinner-layer"},n.createElement("div",{className:"mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left"},n.createElement("svg",{className:"mdc-circular-progress__indeterminate-circle-graphic",viewBox:"0 0 48 48",xmlns:"http://www.w3.org/2000/svg"},n.createElement("circle",{cx:"24",cy:"24",r:"18",strokeDasharray:"113.097",strokeDashoffset:"56.549",strokeWidth:"4"}))),n.createElement("div",{className:"mdc-circular-progress__gap-patch"},n.createElement("svg",{className:"mdc-circular-progress__indeterminate-circle-graphic",viewBox:"0 0 48 48",xmlns:"http://www.w3.org/2000/svg"},n.createElement("circle",{cx:"24",cy:"24",r:"18",strokeDasharray:"113.097",strokeDashoffset:"56.549",strokeWidth:"3.2"}))),n.createElement("div",{className:"mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right"},n.createElement("svg",{className:"mdc-circular-progress__indeterminate-circle-graphic",viewBox:"0 0 48 48",xmlns:"http://www.w3.org/2000/svg"},n.createElement("circle",{cx:"24",cy:"24",r:"18",strokeDasharray:"113.097",strokeDashoffset:"56.549",strokeWidth:"4"})))))),document.body));function qe(){++je&&Ge?.open()}function Qe(){--je<1&&Ge?.close()}var He=a(613);const We=()=>{const[e,t]=(0,n.useState)(null),[a,c]=(0,n.useState)(""),i=(0,n.useCallback)((()=>c("")));return(0,n.useEffect)((()=>{if(e)return()=>e.destroy();const a=new He.G(document.getElementById("app-snackbar"));return a.labelText="Error",a.closeOnEscape=!0,a.listen("MDCSnackbar:closed",i),t(a),h.subscribe(_,c),()=>a.destroy()}),[]),(0,n.useEffect)((()=>{e&&(a?e.open():e.close())}),[a]),(0,s.createPortal)(n.createElement("aside",{id:"app-snackbar",className:"mdc-snackbar",style:{zIndex:9e3}},n.createElement("div",{className:"mdc-snackbar__surface",role:"status","aria-relevant":"additions"},n.createElement("div",{className:"mdc-snackbar__label","aria-atomic":"false"},a))),document.body)};a(87),s.render(n.createElement(n.Fragment,null,n.createElement(Ue,null),n.createElement(We,null),n.createElement(Ae,null)),document.getElementById("root"))},87:(e,t,a)=>{e.exports=a.p+"app-config.json"}},e=>{e.O(0,[216],(()=>(5,e(e.s=5)))),e.O()}]);