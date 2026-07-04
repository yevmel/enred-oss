var y=globalThis,N=($)=>{if(!y.emitLitDebugLogEvents)return;y.dispatchEvent(new CustomEvent("lit-debug",{detail:$}))},w6=0,G0;y.litIssuedWarnings??=new Set,G0=($,Z)=>{if(Z+=$?` See https://lit.dev/msg/${$} for more information.`:"",!y.litIssuedWarnings.has(Z)&&!y.litIssuedWarnings.has($))console.warn(Z),y.litIssuedWarnings.add(Z)},queueMicrotask(()=>{G0("dev-mode","Lit is in dev mode. Not recommended for production!")});var g=y.ShadyDOM?.inUse&&y.ShadyDOM?.noPatch===!0?y.ShadyDOM.wrap:($)=>$,D0=y.trustedTypes,_9=D0?D0.createPolicy("lit-html",{createHTML:($)=>$}):void 0,I6=($)=>$,b0=($,Z,J)=>I6,g6=($)=>{if(a!==b0)throw Error("Attempted to overwrite existing lit-html security policy. setSanitizeDOMValueFactory should be called at most once.");a=$},x6=()=>{a=b0},i0=($,Z,J)=>{return a($,Z,J)},T9="$lit$",h=`lit$${Math.random().toFixed(9).slice(2)}$`,f9="?"+h,h6=`<${f9}>`,n=document,Y0=()=>n.createComment(""),F0=($)=>$===null||typeof $!="object"&&typeof $!="function",r0=Array.isArray,u6=($)=>r0($)||typeof $?.[Symbol.iterator]==="function",d0=`[ 	
\f\r]`,v6=`[^ 	
\f\r"'\`<>=]`,p6=`[^\\s"'>=/]`,q0=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,S9=1,l0=2,m6=3,N9=/-->/g,L9=/>/g,d=new RegExp(`>|${d0}(?:(${p6}+)(${d0}*=${d0}*(?:${v6}|("|')|))|$)`,"g"),c6=0,P9=1,d6=2,A9=3,s0=/'/g,o0=/"/g,R9=/^(?:script|style|textarea|title)$/i,l6=1,T0=2,f0=3,n0=1,R0=2,s6=3,o6=4,i6=5,a0=6,r6=7,t0=($)=>(Z,...J)=>{if(Z.some((j)=>j===void 0))console.warn(`Some template strings are undefined.
This is probably caused by illegal octal escape sequences.`);if(J.some((j)=>j?._$litStatic$))G0("",`Static values 'literal' or 'unsafeStatic' cannot be used as values to non-static templates.
Please use the static 'html' tag function. See https://lit.dev/docs/templates/expressions/#static-expressions`);return{["_$litType$"]:$,strings:Z,values:J}},B=t0(l6),e0=t0(T0),c$=t0(f0),M0=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),D9=new WeakMap,r=n.createTreeWalker(n,129),a=b0;function b9($,Z){if(!r0($)||!$.hasOwnProperty("raw")){let J="invalid template strings array";throw J=`
          Internal Error: expected template strings to be an array
          with a 'raw' field. Faking a template strings array by
          calling html or svg like an ordinary function is effectively
          the same as calling unsafeHtml and can lead to major security
          issues, e.g. opening your code up to XSS attacks.
          If you're using the html or svg tagged template functions normally
          and still seeing this error, please file a bug at
          https://github.com/lit/lit/issues/new?template=bug_report.md
          and include information about your build tooling, if any.
        `.trim().replace(/\n */g,`
`),Error(J)}return _9!==void 0?_9.createHTML(Z):Z}var n6=($,Z)=>{let J=$.length-1,j=[],Q=Z===T0?"<svg>":Z===f0?"<math>":"",W,X=q0;for(let q=0;q<J;q++){let O=$[q],F=-1,G,L=0,C;while(L<O.length){if(X.lastIndex=L,C=X.exec(O),C===null)break;if(L=X.lastIndex,X===q0){if(C[S9]==="!--")X=N9;else if(C[S9]!==void 0)X=L9;else if(C[l0]!==void 0){if(R9.test(C[l0]))W=new RegExp(`</${C[l0]}`,"g");X=d}else if(C[m6]!==void 0)throw Error("Bindings in tag names are not supported. Please use static templates instead. See https://lit.dev/docs/templates/expressions/#static-expressions")}else if(X===d)if(C[c6]===">")X=W??q0,F=-1;else if(C[P9]===void 0)F=-2;else F=X.lastIndex-C[d6].length,G=C[P9],X=C[A9]===void 0?d:C[A9]==='"'?o0:s0;else if(X===o0||X===s0)X=d;else if(X===N9||X===L9)X=q0;else X=d,W=void 0}console.assert(F===-1||X===d||X===s0||X===o0,"unexpected parse state B");let S=X===d&&$[q+1].startsWith("/>")?" ":"";Q+=X===q0?O+h6:F>=0?(j.push(G),O.slice(0,F)+T9+O.slice(F))+h+S:O+h+(F===-2?q:S)}let U=Q+($[J]||"<?>")+(Z===T0?"</svg>":Z===f0?"</math>":"");return[b9($,U),j]};class O0{constructor({strings:$,["_$litType$"]:Z},J){this.parts=[];let j,Q=0,W=0,X=$.length-1,U=this.parts,[q,O]=n6($,Z);if(this.el=O0.createElement(q,J),r.currentNode=this.el.content,Z===T0||Z===f0){let F=this.el.content.firstChild;F.replaceWith(...F.childNodes)}while((j=r.nextNode())!==null&&U.length<X){if(j.nodeType===1){{let F=j.localName;if(/^(?:textarea|template)$/i.test(F)&&j.innerHTML.includes(h)){let G=`Expressions are not supported inside \`${F}\` elements. See https://lit.dev/msg/expression-in-${F} for more information.`;if(F==="template")throw Error(G);else G0("",G)}}if(j.hasAttributes()){for(let F of j.getAttributeNames())if(F.endsWith(T9)){let G=O[W++],C=j.getAttribute(F).split(h),S=/([.?@])?(.*)/.exec(G);U.push({type:n0,index:Q,name:S[2],strings:C,ctor:S[1]==="."?y9:S[1]==="?"?w9:S[1]==="@"?I9:B0}),j.removeAttribute(F)}else if(F.startsWith(h))U.push({type:a0,index:Q}),j.removeAttribute(F)}if(R9.test(j.tagName)){let F=j.textContent.split(h),G=F.length-1;if(G>0){j.textContent=D0?D0.emptyScript:"";for(let L=0;L<G;L++)j.append(F[L],Y0()),r.nextNode(),U.push({type:R0,index:++Q});j.append(F[G],Y0())}}}else if(j.nodeType===8)if(j.data===f9)U.push({type:R0,index:Q});else{let G=-1;while((G=j.data.indexOf(h,G+1))!==-1)U.push({type:r6,index:Q}),G+=h.length-1}Q++}if(O.length!==W)throw Error('Detected duplicate attribute bindings. This occurs if your template has duplicate attributes on an element tag. For example "<input ?disabled=${true} ?disabled=${false}>" contains a duplicate "disabled" attribute. The error was detected in the following template: \n`'+$.join("${...}")+"`");N&&N({kind:"template prep",template:this,clonableTemplate:this.el,parts:this.parts,strings:$})}static createElement($,Z){let J=n.createElement("template");return J.innerHTML=$,J}}function j0($,Z,J=$,j){if(Z===M0)return Z;let Q=j!==void 0?J.__directives?.[j]:J.__directive,W=F0(Z)?void 0:Z._$litDirective$;if(Q?.constructor!==W){if(Q?._$notifyDirectiveConnectionChanged?.(!1),W===void 0)Q=void 0;else Q=new W($),Q._$initialize($,J,j);if(j!==void 0)(J.__directives??=[])[j]=Q;else J.__directive=Q}if(Q!==void 0)Z=j0($,Q._$resolve($,Z.values),Q,j);return Z}class E9{constructor($,Z){this._$parts=[],this._$disconnectableChildren=void 0,this._$template=$,this._$parent=Z}get parentNode(){return this._$parent.parentNode}get _$isConnected(){return this._$parent._$isConnected}_clone($){let{el:{content:Z},parts:J}=this._$template,j=($?.creationScope??n).importNode(Z,!0);r.currentNode=j;let Q=r.nextNode(),W=0,X=0,U=J[0];while(U!==void 0){if(W===U.index){let q;if(U.type===R0)q=new H0(Q,Q.nextSibling,this,$);else if(U.type===n0)q=new U.ctor(Q,U.name,U.strings,this,$);else if(U.type===a0)q=new g9(Q,this,$);this._$parts.push(q),U=J[++X]}if(W!==U?.index)Q=r.nextNode(),W++}return r.currentNode=n,j}_update($){let Z=0;for(let J of this._$parts){if(J!==void 0)if(N&&N({kind:"set part",part:J,value:$[Z],valueIndex:Z,values:$,templateInstance:this}),J.strings!==void 0)J._$setValue($,J,Z),Z+=J.strings.length-2;else J._$setValue($[Z]);Z++}}}class H0{get _$isConnected(){return this._$parent?._$isConnected??this.__isConnected}constructor($,Z,J,j){this.type=R0,this._$committedValue=A,this._$disconnectableChildren=void 0,this._$startNode=$,this._$endNode=Z,this._$parent=J,this.options=j,this.__isConnected=j?.isConnected??!0,this._textSanitizer=void 0}get parentNode(){let $=g(this._$startNode).parentNode,Z=this._$parent;if(Z!==void 0&&$?.nodeType===11)$=Z.parentNode;return $}get startNode(){return this._$startNode}get endNode(){return this._$endNode}_$setValue($,Z=this){if(this.parentNode===null)throw Error("This `ChildPart` has no `parentNode` and therefore cannot accept a value. This likely means the element containing the part was manipulated in an unsupported way outside of Lit's control such that the part's marker nodes were ejected from DOM. For example, setting the element's `innerHTML` or `textContent` can do this.");if($=j0(this,$,Z),F0($)){if($===A||$==null||$===""){if(this._$committedValue!==A)N&&N({kind:"commit nothing to child",start:this._$startNode,end:this._$endNode,parent:this._$parent,options:this.options}),this._$clear();this._$committedValue=A}else if($!==this._$committedValue&&$!==M0)this._commitText($)}else if($._$litType$!==void 0)this._commitTemplateResult($);else if($.nodeType!==void 0){if(this.options?.host===$){this._commitText("[probable mistake: rendered a template's host in itself (commonly caused by writing ${this} in a template]"),console.warn("Attempted to render the template host",$,"inside itself. This is almost always a mistake, and in dev mode ","we render some warning text. In production however, we'll ","render it, which will usually result in an error, and sometimes ","in the element disappearing from the DOM.");return}this._commitNode($)}else if(u6($))this._commitIterable($);else this._commitText($)}_insert($){return g(g(this._$startNode).parentNode).insertBefore($,this._$endNode)}_commitNode($){if(this._$committedValue!==$){if(this._$clear(),a!==b0){let Z=this._$startNode.parentNode?.nodeName;if(Z==="STYLE"||Z==="SCRIPT"){let J="Forbidden";if(Z==="STYLE")J="Lit does not support binding inside style nodes. This is a security risk, as style injection attacks can exfiltrate data and spoof UIs. Consider instead using css`...` literals to compose styles, and do dynamic styling with css custom properties, ::parts, <slot>s, and by mutating the DOM rather than stylesheets.";else J="Lit does not support binding inside script nodes. This is a security risk, as it could allow arbitrary code execution.";throw Error(J)}}N&&N({kind:"commit node",start:this._$startNode,parent:this._$parent,value:$,options:this.options}),this._$committedValue=this._insert($)}}_commitText($){if(this._$committedValue!==A&&F0(this._$committedValue)){let Z=g(this._$startNode).nextSibling;if(this._textSanitizer===void 0)this._textSanitizer=i0(Z,"data","property");$=this._textSanitizer($),N&&N({kind:"commit text",node:Z,value:$,options:this.options}),Z.data=$}else{let Z=n.createTextNode("");if(this._commitNode(Z),this._textSanitizer===void 0)this._textSanitizer=i0(Z,"data","property");$=this._textSanitizer($),N&&N({kind:"commit text",node:Z,value:$,options:this.options}),Z.data=$}this._$committedValue=$}_commitTemplateResult($){let{values:Z,["_$litType$"]:J}=$,j=typeof J==="number"?this._$getTemplate($):(J.el===void 0&&(J.el=O0.createElement(b9(J.h,J.h[0]),this.options)),J);if(this._$committedValue?._$template===j)N&&N({kind:"template updating",template:j,instance:this._$committedValue,parts:this._$committedValue._$parts,options:this.options,values:Z}),this._$committedValue._update(Z);else{let Q=new E9(j,this),W=Q._clone(this.options);N&&N({kind:"template instantiated",template:j,instance:Q,parts:Q._$parts,options:this.options,fragment:W,values:Z}),Q._update(Z),N&&N({kind:"template instantiated and updated",template:j,instance:Q,parts:Q._$parts,options:this.options,fragment:W,values:Z}),this._commitNode(W),this._$committedValue=Q}}_$getTemplate($){let Z=D9.get($.strings);if(Z===void 0)D9.set($.strings,Z=new O0($));return Z}_commitIterable($){if(!r0(this._$committedValue))this._$committedValue=[],this._$clear();let Z=this._$committedValue,J=0,j;for(let Q of $){if(J===Z.length)Z.push(j=new H0(this._insert(Y0()),this._insert(Y0()),this,this.options));else j=Z[J];j._$setValue(Q),J++}if(J<Z.length)this._$clear(j&&g(j._$endNode).nextSibling,J),Z.length=J}_$clear($=g(this._$startNode).nextSibling,Z){this._$notifyConnectionChanged?.(!1,!0,Z);while($!==this._$endNode){let J=g($).nextSibling;g($).remove(),$=J}}setConnected($){if(this._$parent===void 0)this.__isConnected=$,this._$notifyConnectionChanged?.($);else throw Error("part.setConnected() may only be called on a RootPart returned from render().")}}class B0{get tagName(){return this.element.tagName}get _$isConnected(){return this._$parent._$isConnected}constructor($,Z,J,j,Q){if(this.type=n0,this._$committedValue=A,this._$disconnectableChildren=void 0,this.element=$,this.name=Z,this._$parent=j,this.options=Q,J.length>2||J[0]!==""||J[1]!=="")this._$committedValue=Array(J.length-1).fill(new String),this.strings=J;else this._$committedValue=A;this._sanitizer=void 0}_$setValue($,Z=this,J,j){let Q=this.strings,W=!1;if(Q===void 0){if($=j0(this,$,Z,0),W=!F0($)||$!==this._$committedValue&&$!==M0,W)this._$committedValue=$}else{let X=$;$=Q[0];let U,q;for(U=0;U<Q.length-1;U++){if(q=j0(this,X[J+U],Z,U),q===M0)q=this._$committedValue[U];if(W||=!F0(q)||q!==this._$committedValue[U],q===A)$=A;else if($!==A)$+=(q??"")+Q[U+1];this._$committedValue[U]=q}}if(W&&!j)this._commitValue($)}_commitValue($){if($===A)g(this.element).removeAttribute(this.name);else{if(this._sanitizer===void 0)this._sanitizer=a(this.element,this.name,"attribute");$=this._sanitizer($??""),N&&N({kind:"commit attribute",element:this.element,name:this.name,value:$,options:this.options}),g(this.element).setAttribute(this.name,$??"")}}}class y9 extends B0{constructor(){super(...arguments);this.type=s6}_commitValue($){if(this._sanitizer===void 0)this._sanitizer=a(this.element,this.name,"property");$=this._sanitizer($),N&&N({kind:"commit property",element:this.element,name:this.name,value:$,options:this.options}),this.element[this.name]=$===A?void 0:$}}class w9 extends B0{constructor(){super(...arguments);this.type=o6}_commitValue($){N&&N({kind:"commit boolean attribute",element:this.element,name:this.name,value:!!($&&$!==A),options:this.options}),g(this.element).toggleAttribute(this.name,!!$&&$!==A)}}class I9 extends B0{constructor($,Z,J,j,Q){super($,Z,J,j,Q);if(this.type=i6,this.strings!==void 0)throw Error(`A \`<${$.localName}>\` has a \`@${Z}=...\` listener with invalid content. Event listeners in templates must have exactly one expression and no surrounding text.`)}_$setValue($,Z=this){if($=j0(this,$,Z,0)??A,$===M0)return;let J=this._$committedValue,j=$===A&&J!==A||$.capture!==J.capture||$.once!==J.once||$.passive!==J.passive,Q=$!==A&&(J===A||j);if(N&&N({kind:"commit event listener",element:this.element,name:this.name,value:$,options:this.options,removeListener:j,addListener:Q,oldListener:J}),j)this.element.removeEventListener(this.name,this,J);if(Q)this.element.addEventListener(this.name,this,$);this._$committedValue=$}handleEvent($){if(typeof this._$committedValue==="function")this._$committedValue.call(this.options?.host??this.element,$);else this._$committedValue.handleEvent($)}}class g9{constructor($,Z,J){this.element=$,this.type=a0,this._$disconnectableChildren=void 0,this._$parent=Z,this.options=J}get _$isConnected(){return this._$parent._$isConnected}_$setValue($){N&&N({kind:"commit to element binding",element:this.element,value:$,options:this.options}),j0(this,$)}}var a6=y.litHtmlPolyfillSupportDevMode;a6?.(O0,H0);(y.litHtmlVersions??=[]).push("3.3.3");if(y.litHtmlVersions.length>1)queueMicrotask(()=>{G0("multiple-versions","Multiple versions of Lit loaded. Loading multiple versions is not recommended.")});var U0=($,Z,J)=>{if(Z==null)throw TypeError(`The container to render into may not be ${Z}`);let j=w6++,Q=J?.renderBefore??Z,W=Q._$litPart$;if(N&&N({kind:"begin render",id:j,value:$,container:Z,options:J,part:W}),W===void 0){let X=J?.renderBefore??null;Q._$litPart$=W=new H0(Z.insertBefore(Y0(),X),X,void 0,J??{})}return W._$setValue($),N&&N({kind:"end render",id:j,value:$,container:Z,options:J,part:W}),W};U0.setSanitizer=g6,U0.createSanitizer=i0,U0._testOnlyClearSanitizerFactoryDoNotCallOrElse=x6;var E0={accent:"#2F6BDB",showTypes:!0,gridStyle:"dots"};function t6($={}){return{sel:null,selIds:[],viewport:{scale:1,panX:30,panY:24},panelWidth:300,connecting:!1,connectFrom:null,marquee:null,nearId:null,newRel:null,newRelTarget:null,dragAttrIndex:-1,dialog:null,dragActive:!1,gridStyle:$.gridStyle??E0.gridStyle,theme:$.theme??"light"}}function x9($=E0,Z){return{config:$,ui:t6({gridStyle:$.gridStyle,theme:Z}),doc:{entities:[],relations:[],title:"",description:"",colorLegend:{}}}}var $9="c"+Math.random().toString(36).slice(2,10),e6=0;function h9(){return $9}function R(){return{id:$9+":"+e6++,clientId:$9}}function l($,Z){switch(Z.type){case"ADD_ENTITY":case"REMOVE_ENTITY":case"MOVE_ENTITY":case"UPDATE_ENTITY":case"SET_ENTITY_ATTRS":case"ADD_RELATION":case"REMOVE_RELATION":case"UPDATE_RELATION":case"SET_VIAS":case"UPDATE_META":case"SET_COLOR_DESC":case"REPLACE_DOC":case"BATCH":return{...$,doc:y0($.doc,Z)};case"SET_SELECTION":return{...$,ui:{...$.ui,sel:Z.sel,selIds:Z.selIds}};case"SET_VIEWPORT":return{...$,ui:{...$.ui,viewport:{scale:Z.scale,panX:Z.panX,panY:Z.panY}}};case"SET_PANEL_WIDTH":return{...$,ui:{...$.ui,panelWidth:Z.width}};case"SET_CONNECT":return{...$,ui:{...$.ui,connecting:Z.connecting,connectFrom:Z.connectFrom}};case"SET_MARQUEE":return{...$,ui:{...$.ui,marquee:Z.marquee}};case"SET_NEAR":return{...$,ui:{...$.ui,nearId:Z.nearId}};case"SET_NEW_REL":return{...$,ui:{...$.ui,newRel:Z.newRel,newRelTarget:Z.newRelTarget}};case"SET_DRAG_ATTR":return{...$,ui:{...$.ui,dragAttrIndex:Z.index}};case"OPEN_LOAD_DIALOG":return{...$,ui:{...$.ui,dialog:{kind:"load",items:Z.items}}};case"OPEN_ERROR_DIALOG":return{...$,ui:{...$.ui,dialog:{kind:"error",message:Z.message}}};case"CLOSE_DIALOG":return{...$,ui:{...$.ui,dialog:null}};case"SET_DRAG_ACTIVE":return{...$,ui:{...$.ui,dragActive:Z.active}};case"SET_GRID_STYLE":return{...$,ui:{...$.ui,gridStyle:Z.style}};case"SET_THEME":return{...$,ui:{...$.ui,theme:Z.theme}};default:return p9(Z)}}function y0($,Z){switch(Z.type){case"ADD_ENTITY":return{...$,entities:u9($.entities,Z.entity,Z.index)};case"REMOVE_ENTITY":return{...$,entities:$.entities.filter((J)=>J.id!==Z.id)};case"MOVE_ENTITY":return{...$,entities:Z9($.entities,Z.id,(J)=>({...J,x:Z.to.x,y:Z.to.y}))};case"UPDATE_ENTITY":return{...$,entities:Z9($.entities,Z.id,(J)=>({...J,...Z.patch}))};case"SET_ENTITY_ATTRS":return{...$,entities:Z9($.entities,Z.id,(J)=>({...J,attrs:Z.to}))};case"ADD_RELATION":return{...$,relations:u9($.relations,Z.relation,Z.index)};case"REMOVE_RELATION":return{...$,relations:$.relations.filter((J)=>J.id!==Z.id)};case"UPDATE_RELATION":return{...$,relations:v9($.relations,Z.id,(J)=>({...J,...Z.patch}))};case"SET_VIAS":return{...$,relations:v9($.relations,Z.id,(J)=>$$(J,Z.to))};case"UPDATE_META":return{...$,...Z.patch};case"SET_COLOR_DESC":return{...$,colorLegend:Z$($.colorLegend,Z.key,Z.to)};case"REPLACE_DOC":return Z.to;case"BATCH":return Z.actions.reduce(y0,$);default:return p9(Z)}}function u9($,Z,J){if(J==null||J>=$.length)return[...$,Z];let j=$.slice();return j.splice(J,0,Z),j}function $$($,Z){if(!Z||Z.length===0){let{vias:J,...j}=$;return j}return{...$,vias:Z}}function Z$($,Z,J){if(J===""){let{[Z]:j,...Q}=$;return Q}return{...$,[Z]:J}}function Z9($,Z,J){return $.map((j)=>j.id===Z?J(j):j)}function v9($,Z,J){return $.map((j)=>j.id===Z?J(j):j)}function p9($){throw Error("reducer: unhandled action "+JSON.stringify($))}function J9($,Z){let J=Z.meta;switch(Z.type){case"ADD_ENTITY":return{type:"REMOVE_ENTITY",meta:J,id:Z.entity.id};case"REMOVE_ENTITY":{let j=$.entities.findIndex((Q)=>Q.id===Z.id);if(j<0)return{type:"BATCH",meta:J,actions:[]};return{type:"ADD_ENTITY",meta:J,entity:$.entities[j],index:j}}case"MOVE_ENTITY":return{type:"MOVE_ENTITY",meta:J,id:Z.id,from:Z.to,to:Z.from};case"UPDATE_ENTITY":{let j=$.entities.find((W)=>W.id===Z.id),Q={};if(j)for(let W of Object.keys(Z.patch))Q[W]=j[W];return{type:"UPDATE_ENTITY",meta:J,id:Z.id,patch:Q}}case"SET_ENTITY_ATTRS":return{type:"SET_ENTITY_ATTRS",meta:J,id:Z.id,from:Z.to,to:Z.from};case"ADD_RELATION":return{type:"REMOVE_RELATION",meta:J,id:Z.relation.id};case"REMOVE_RELATION":{let j=$.relations.findIndex((Q)=>Q.id===Z.id);if(j<0)return{type:"BATCH",meta:J,actions:[]};return{type:"ADD_RELATION",meta:J,relation:$.relations[j],index:j}}case"UPDATE_RELATION":{let j=$.relations.find((W)=>W.id===Z.id),Q={};if(j)for(let W of Object.keys(Z.patch))Q[W]=j[W];return{type:"UPDATE_RELATION",meta:J,id:Z.id,patch:Q}}case"SET_VIAS":return{type:"SET_VIAS",meta:J,id:Z.id,from:Z.to,to:Z.from};case"UPDATE_META":{let j={};if("title"in Z.patch)j.title=$.title;if("description"in Z.patch)j.description=$.description;return{type:"UPDATE_META",meta:J,patch:j}}case"SET_COLOR_DESC":return{type:"SET_COLOR_DESC",meta:J,key:Z.key,from:Z.to,to:Z.from};case"REPLACE_DOC":return{type:"REPLACE_DOC",meta:J,from:Z.to,to:Z.from};case"BATCH":{let j=[],Q=$;for(let W of Z.actions)j.push(J9(Q,W)),Q=y0(Q,W);return j.reverse(),{type:"BATCH",meta:J,actions:j}}default:return J$(Z)}}function J$($){throw Error("invert: unhandled action "+JSON.stringify($))}class j9{state;history={entries:[],pointer:-1};renderView;renderScheduled=!1;localActionSubs=new Set;constructor($,Z){this.state=$,this.renderView=Z.render}subscribeLocalActions($){return this.localActionSubs.add($),()=>this.localActionSubs.delete($)}notifyLocal($){for(let Z of this.localActionSubs)Z($)}dispatch($){let Z=J9(this.state.doc,$);this.state=l(this.state,$),this.history.entries.length=this.history.pointer+1,this.history.entries.push({action:$,inverse:Z}),this.history.pointer++,this.notifyLocal($),this.scheduleRender()}dispatchUi($){this.state=l(this.state,$),this.scheduleRender()}preview($){this.state=l(this.state,$),this.scheduleRender()}undo(){if(this.history.pointer<0)return;let $=this.history.entries[this.history.pointer];this.state=l(this.state,$.inverse),this.history.pointer--,this.notifyLocal($.inverse),this.scheduleRender()}redo(){if(this.history.pointer>=this.history.entries.length-1)return;let $=this.history.entries[this.history.pointer+1];this.state=l(this.state,$.action),this.history.pointer++,this.notifyLocal($.action),this.scheduleRender()}dispatchRemote($){if($.meta.clientId===h9())return;this.state=l(this.state,$),this.scheduleRender()}applyRemoteState($){this.state=l(this.state,{type:"REPLACE_DOC",meta:R(),from:this.state.doc,to:$}),this.scheduleRender()}canUndo(){return this.history.pointer>=0}canRedo(){return this.history.pointer<this.history.entries.length-1}scheduleRender(){if(this.renderScheduled)return;this.renderScheduled=!0,queueMicrotask(()=>{this.renderScheduled=!1,this.renderView(this.state)})}renderNow(){this.renderView(this.state)}}var Q9=($,Z)=>({type:"ADD_ENTITY",meta:R(),entity:$,...Z!=null?{index:Z}:{}}),m9=($)=>({type:"REMOVE_ENTITY",meta:R(),id:$}),c9=($,Z,J)=>({type:"MOVE_ENTITY",meta:R(),id:$,from:Z,to:J}),w0=($,Z)=>({type:"UPDATE_ENTITY",meta:R(),id:$,patch:Z}),I0=($,Z,J)=>({type:"SET_ENTITY_ATTRS",meta:R(),id:$,from:Z,to:J}),K9=($,Z)=>({type:"ADD_RELATION",meta:R(),relation:$,...Z!=null?{index:Z}:{}}),z9=($)=>({type:"REMOVE_RELATION",meta:R(),id:$}),W9=($,Z)=>({type:"UPDATE_RELATION",meta:R(),id:$,patch:Z}),u=($,Z,J)=>({type:"SET_VIAS",meta:R(),id:$,from:Z,to:J}),X9=($)=>({type:"UPDATE_META",meta:R(),patch:$}),d9=($,Z,J)=>({type:"SET_COLOR_DESC",meta:R(),key:$,from:Z,to:J}),V9=($,Z)=>({type:"REPLACE_DOC",meta:R(),from:$,to:Z}),k0=($)=>({type:"BATCH",meta:R(),actions:$});var s=220,x=40,v=10,s9=29,o9=58.5;function Q0($){return 50+$.attrs.length*29}function t($,Z){if(Z!=null&&$.attrs[Z])return $.y+58.5+Z*29;return $.y+20}function i9($,Z,J){return{p1:{x:$.x+220+10,y:t($,J.fromAttr)},p2:{x:Z.x-10,y:Z.y+20}}}function g0($,Z,J,j){let Q=[$,...J,Z];if(J.length===0){if(j)return`M ${$.x} ${$.y} L ${Z.x} ${Z.y}`;let X=Math.max(50,Math.abs(Z.x-$.x)*0.5),U={x:$.x+X,y:$.y},q={x:Z.x-X,y:Z.y};return`M ${$.x} ${$.y} C ${U.x} ${U.y}, ${q.x} ${q.y}, ${Z.x} ${Z.y}`}let W=`M ${Q[0].x} ${Q[0].y}`;for(let X=0;X<Q.length-1;X++){let U=Q[X-1]||Q[X],q=Q[X],O=Q[X+1],F=Q[X+2]||O,G={x:q.x+(O.x-U.x)/6,y:q.y+(O.y-U.y)/6},L={x:O.x-(F.x-q.x)/6,y:O.y-(F.y-q.y)/6};W+=` C ${G.x} ${G.y}, ${L.x} ${L.y}, ${O.x} ${O.y}`}return W}function K0($,Z,J){let j=Z.x-$.x,Q=Z.y-$.y,W=Math.hypot(j,Q)||1,X=Math.min(J,W*0.4);return{x:$.x+j/W*X,y:$.y+Q/W*X}}function j$($,Z,J){let j=J.x-Z.x,Q=J.y-Z.y,W=j*j+Q*Q||1,X=(($.x-Z.x)*j+($.y-Z.y)*Q)/W;X=Math.max(0,Math.min(1,X));let U=Z.x+X*j,q=Z.y+X*Q;return Math.hypot($.x-U,$.y-q)}function r9($,Z,J,j){let Q=[$,...J,Z],W=0,X=1/0;for(let U=0;U<Q.length-1;U++){let q=j$(j,Q[U],Q[U+1]);if(q<X)X=q,W=U}return W}function q9($,Z,J){let j=null;for(let Q of $){if(Q.id===J)continue;if(Z.x>=Q.x&&Z.x<=Q.x+220&&Z.y>=Q.y&&Z.y<=Q.y+Q0(Q))j=Q.id}return j}function n9($,Z,J=46){let j=null,Q=J;for(let W of $){let X=Math.max(W.x-Z.x,0,Z.x-(W.x+220)),U=Math.max(W.y-Z.y,0,Z.y-(W.y+Q0(W))),q=Math.hypot(X,U);if(q<Q)Q=q,j=W.id}return j}function a9($,Z,J,j,Q){return $.filter((W)=>W.x<Z+j&&W.x+220>Z&&W.y<J+Q&&W.y+Q0(W)>J).map((W)=>W.id)}function e($){return Math.round($/8)*8}function x0($){if(!$.length)return null;let Z=1/0,J=1/0,j=-1/0,Q=-1/0;for(let W of $)Z=Math.min(Z,W.x),J=Math.min(J,W.y),j=Math.max(j,W.x+220),Q=Math.max(Q,W.y+Q0(W));return{x:Z,y:J,w:j-Z,h:Q-J}}var Q$=0;function $0($){return $+Date.now().toString(36)+(Q$++).toString(36)}var t9="enred.v2.index",U9="enred.v2.doc.",e9="enred.v2.theme";function $6(){let $=localStorage.getItem(e9);return $==="light"||$==="dark"?$:null}function Z6($){localStorage.setItem(e9,$)}function G9(){try{let $=localStorage.getItem(t9),Z=$?JSON.parse($):[];return Array.isArray(Z)?Z:[]}catch{return[]}}function J6($){localStorage.setItem(t9,JSON.stringify($))}function Y9(){return G9().slice().sort(($,Z)=>Z.savedAt-$.savedAt)}function j6($,Z){let J=$.trim()||"Untitled diagram",j=G9(),Q=j.find((U)=>U.name===J),W={id:Q?.id??$0("d"),name:J,savedAt:Date.now()},X=Q?j.map((U)=>U.id===W.id?W:U):[...j,W];return localStorage.setItem(U9+W.id,JSON.stringify(Z)),J6(X),W}function Q6($){try{let Z=localStorage.getItem(U9+$);return Z?JSON.parse(Z):null}catch{return null}}function K6($){localStorage.removeItem(U9+$),J6(G9().filter((Z)=>Z.id!==$))}var z6=["#3B6FD4","#7C5CD4","#2B9D8F","#C08A2E","#CE5C7C","#6B7280"],C0="#6B7280";function W6($,Z,J){return`color-mix(in srgb, ${$} ${J}%, ${Z})`}function X6($,Z=0.12){let J=z$($);if(!J)return $;let j=parseInt(J,16),Q=(q)=>Math.round(q*Z+255*(1-Z)),W=Q(j>>16&255),X=Q(j>>8&255),U=Q(j&255);return"#"+[W,X,U].map((q)=>q.toString(16).padStart(2,"0")).join("")}function z$($){let Z=/^#?([0-9a-f]{6})$/i.exec($.trim());if(Z)return Z[1].toLowerCase();try{let j=document.createElement("canvas").getContext("2d");if(!j)return null;j.fillStyle="#000000",j.fillStyle=$;let Q=/^#([0-9a-f]{6})$/i.exec(j.fillStyle);return Q?Q[1].toLowerCase():null}catch{return null}}function F9($){return $.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function V6($){return $.replace(/--/g,"––").replace(/-$/,"–")}function q6($){return $.split("]]>").join("]]]]><![CDATA[>")}function U6($){return $.trim().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function G6($){let Z=$.title.trim()||"Untitled diagram",J=$.description.trim(),j=new Map($.entities.map((X)=>[X.id,X])),Q=[`# ${Z}`];if(J)Q.push(J);Q.push(["## Entities",$.entities.map(W$).join(`

`)||"_None._"].join(`

`));let W=$.relations.map((X)=>V$(X,j)).filter((X)=>X!=null);return Q.push(["## Relations",W.length?W.join(`
`):"_None._"].join(`

`)),Q.join(`

`)+`
`}function W$($){let Z=$.attrs.map((J)=>`- ${J.name}: ${J.type}`).join(`
`);return`### ${$.name}
${Z}`}function X$($,Z){if(Z!=null&&$.attrs[Z])return`${$.name}.${$.attrs[Z].name}`;return $.name}function V$($,Z){let J=Z.get($.from),j=Z.get($.to);if(!J||!j)return null;let Q=($.fromCard||"").trim(),W=($.toCard||"").trim(),X=Q||W?` [${Q||"?"} to ${W||"?"}]`:"";return`- ${X$(J,$.fromAttr)} → ${j.name}${X}`}var v0="1",h0=48;function F6($,Z=new Date){return`${U6($.title)||"diagram"}-${q$(Z)}.svg`}function q$($){let Z=(Q)=>String(Q).padStart(2,"0"),J=`${$.getFullYear()}${Z($.getMonth()+1)}${Z($.getDate())}`,j=`${Z($.getHours())}${Z($.getMinutes())}${Z($.getSeconds())}`;return`${J}-${j}`}function M6($,Z){let J=x0($.entities)??{x:0,y:0,w:0,h:0},j=J.x-h0,Q=J.y-h0,W=Math.max(1,J.w+h0*2),X=Math.max(1,J.h+h0*2),U=new Map($.entities.map((S)=>[S.id,S])),q=[],O=$.entities.map((S)=>G$(S,Z,q)).join(`
`),F=$.relations.map((S)=>Y$(S,U)).filter((S)=>S!=null).join(`
`),G=F9($.title.trim()||"Untitled diagram"),L=q6(JSON.stringify({entities:$.entities,relations:$.relations,title:$.title,description:$.description,colorLegend:$.colorLegend}));return['<?xml version="1.0" encoding="UTF-8"?>',`<!--
${V6(G6($))}-->`,`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${j} ${Q} ${W} ${X}" width="${W}" height="${X}">`,`<title>${G}</title>`,`<metadata id="enred-state" data-format-version="${v0}"><![CDATA[${L}]]></metadata>`,q.length?`<defs>${q.join("")}</defs>`:"",`<rect x="${j}" y="${Q}" width="${W}" height="${X}" fill="#F6F6F7"></rect>`,F,O,"</svg>"].filter(Boolean).join(`
`)}function U$($){return $.replace(/[^A-Za-z0-9_-]/g,"_")}function G$($,Z,J){let j=s,Q=Q0($),W=$.color||C0,X=X6(W),U="card-"+U$($.id);J.push(`<clipPath id="${U}"><rect x="${$.x}" y="${$.y}" width="${j}" height="${Q}" rx="10"></rect></clipPath>`);let q=[`<rect x="${$.x}" y="${$.y}" width="${j}" height="${Q}" rx="10" fill="#FFFFFF" stroke="#E3E3E8" stroke-width="1"></rect>`,`<rect x="${$.x}" y="${$.y}" width="${j}" height="${x}" fill="${X}" clip-path="url(#${U})"></rect>`,`<line x1="${$.x}" y1="${$.y+x}" x2="${$.x+j}" y2="${$.y+x}" stroke="#ECECEF" stroke-width="1"></line>`,`<circle cx="${$.x+22}" cy="${$.y+x/2}" r="4" fill="${W}"></circle>`,u0($.x+34,$.y+x/2+5,$.name,{size:14,weight:600,color:"#26262B"})];return $.attrs.forEach((O,F)=>{let G=t($,F)+4;if(q.push(u0($.x+14,G,O.name,{size:13,color:"#26262B"})),Z.showTypes)q.push(u0($.x+j-14,G,O.type,{size:11,color:"#9A9CA6",mono:!0,anchor:"end"}))}),q.join(`
`)}function Y$($,Z){let J=Z.get($.from),j=Z.get($.to);if(!J||!j)return null;let Q={x:J.x+s+v,y:t(J,$.fromAttr)},W={x:j.x-v,y:j.y+x/2},X=$.vias||[],U=g0(Q,W,X,($.shape||"s-curve")==="straight"),q=[Q,...X,W],O=[`<path d="${U}" fill="none" stroke="#B9BBC4" stroke-width="1.5"></path>`,`<circle cx="${Q.x}" cy="${Q.y}" r="4" fill="#FFFFFF" stroke="#B9BBC4" stroke-width="1.5"></circle>`,`<circle cx="${W.x}" cy="${W.y}" r="4" fill="#FFFFFF" stroke="#B9BBC4" stroke-width="1.5"></circle>`],F=K0(Q,q[1],34),G=K0(W,q[q.length-2],34);if($.fromCard&&$.fromCard.trim())O.push(Y6(F.x,F.y-14,$.fromCard));if($.toCard&&$.toCard.trim())O.push(Y6(G.x,G.y-14,$.toCard));return O.join(`
`)}function Y6($,Z,J){let j=Math.max(18,J.length*6.5+14),Q=18;return[`<rect x="${$-j/2}" y="${Z-9}" width="${j}" height="18" rx="9" fill="#FFFFFF" stroke="#E3E3E8" stroke-width="1"></rect>`,u0($,Z+4,J,{size:11,color:"#7A7C86",anchor:"middle"})].join(`
`)}function u0($,Z,J,j){let Q=j.mono?"ui-monospace, Menlo, monospace":"'Helvetica Neue', Helvetica, Arial, sans-serif",W=j.anchor&&j.anchor!=="start"?` text-anchor="${j.anchor}"`:"",X=j.weight?` font-weight="${j.weight}"`:"";return`<text x="${$}" y="${Z}" font-family="${Q}" font-size="${j.size}" fill="${j.color}"${X}${W}>${F9(J)}</text>`}function O6($){let Z=new DOMParser().parseFromString($,"image/svg+xml");if(Z.querySelector("parsererror"))return{ok:!1,error:"This file could not be parsed as SVG — it may be corrupted."};let J=Z.querySelector('[id="enred-state"]');if(!J)return{ok:!1,error:"This SVG wasn't exported from EnReD — no embedded diagram data found."};let j=J.getAttribute("data-format-version");if(j!==v0)return{ok:!1,error:`This SVG was exported by an incompatible version of EnReD (format ${j??"unknown"}, expected ${v0}).`};let Q;try{Q=JSON.parse(J.textContent??"")}catch{return{ok:!1,error:"The embedded diagram data is corrupted and could not be read."}}let W=F$(Q);if(!W)return{ok:!1,error:"The embedded diagram data doesn't match the expected shape."};return{ok:!0,doc:W}}function F$($){if(!$||typeof $!=="object")return null;let Z=$;if(!Array.isArray(Z.entities)||!Z.entities.every(M$))return null;if(!Array.isArray(Z.relations)||!Z.relations.every(H$))return null;if(typeof Z.title!=="string"||typeof Z.description!=="string")return null;if(!Z.colorLegend||typeof Z.colorLegend!=="object"||Array.isArray(Z.colorLegend))return null;return{entities:Z.entities,relations:Z.relations,title:Z.title,description:Z.description,colorLegend:Z.colorLegend}}function M$($){if(!$||typeof $!=="object")return!1;let Z=$;return typeof Z.id==="string"&&typeof Z.name==="string"&&typeof Z.color==="string"&&typeof Z.x==="number"&&typeof Z.y==="number"&&Array.isArray(Z.attrs)&&Z.attrs.every(O$)}function O$($){if(!$||typeof $!=="object")return!1;let Z=$;return typeof Z.name==="string"&&typeof Z.type==="string"}function H$($){if(!$||typeof $!=="object")return!1;let Z=$;return typeof Z.id==="string"&&typeof Z.from==="string"&&typeof Z.to==="string"&&typeof Z.fromCard==="string"&&typeof Z.toCard==="string"}var M9=($,Z,J)=>Math.max(Z,Math.min(J,$));function H6($){let Z=null,J=null,j=null,Q=null,W=null,X=null,U=null,q=null,O=()=>document.getElementById("canvas"),F=()=>$.state.doc,G=()=>$.state.ui,L=(K)=>F().entities.find((z)=>z.id===K),C=(K)=>F().relations.find((z)=>z.id===K);function S(K){let z=O();if(!z)return{x:0,y:0};let V=z.getBoundingClientRect(),{panX:M,panY:Y,scale:k}=G().viewport;return{x:(K.clientX-V.left-M)/k,y:(K.clientY-V.top-Y)/k}}let H=(K,z,V=[])=>$.dispatchUi({type:"SET_SELECTION",sel:{kind:K,id:z},selIds:V}),_=()=>$.dispatchUi({type:"SET_SELECTION",sel:null,selIds:[]});function T(K){if(j){$.dispatchUi({type:"SET_PANEL_WIDTH",width:M9(j.sw+(j.sx-K.clientX),240,560)});return}if(Z){Z.moved=!0;let z=S(K),V=e(z.x-Z.dx),M=e(z.y-Z.dy),Y=Z.starts[Z.id],k=V-Y.x,D=M-Y.y;Z.dd={ddx:k,ddy:D},$.preview(V0(Z,k,D));return}if(Q){let z=S(K),V=Math.min(Q.x0,z.x),M=Math.min(Q.y0,z.y),Y=Math.abs(z.x-Q.x0),k=Math.abs(z.y-Q.y0),D=a9(F().entities,V,M,Y,k);$.dispatchUi({type:"SET_MARQUEE",marquee:{x:V,y:M,w:Y,h:k}}),$.dispatchUi({type:"SET_SELECTION",sel:D.length?{kind:"ent",id:D[D.length-1]}:null,selIds:D});return}if(W){let z=W.id;W=null;let V=C(z);if(!V)return;let M=(V.vias||[]).map((P)=>({...P})),Y=S(K),{p1:k,p2:D}=P0(V),w=r9(k,D,M,Y),c=M.slice();c.splice(w,0,{x:Math.round(Y.x),y:Math.round(Y.y)}),X={id:z,index:w,fromVias:M,toVias:c},$.preview(u(z,M,c));return}if(X){let z=S(K),V=C(X.id);if(!V)return;let M=(V.vias||[]).slice();M[X.index]={x:Math.round(z.x),y:Math.round(z.y)},X.toVias=M,$.preview(u(X.id,X.fromVias,M));return}if(U){let z=S(K),V=q9(F().entities,z,U.from);$.dispatchUi({type:"SET_NEW_REL",newRel:{from:U.from,fromAttr:U.fromAttr,x:z.x,y:z.y},newRelTarget:V});return}if(J){$.dispatchUi({type:"SET_VIEWPORT",scale:G().viewport.scale,panX:J.px+(K.clientX-J.sx),panY:J.py+(K.clientY-J.sy)});return}B9(K)}function b(K){if(Z){if(Z.moved)c0(Z);Z=null}if(X){if(!B$(X.fromVias,X.toVias))$.dispatch(u(X.id,X.fromVias,X.toVias));X=null}if(W=null,U){let z=q9(F().entities,S(K),U.from),V=U.from,M=U.fromAttr;if(U=null,z){let Y=$0("r"),k={id:Y,from:V,to:z,fromCard:"1",toCard:"N"};if(M!=null)k.fromAttr=M;$.dispatch(K9(k)),H("rel",Y)}$.dispatchUi({type:"SET_NEW_REL",newRel:null,newRelTarget:null}),$.dispatchUi({type:"SET_NEAR",nearId:null})}if(J=null,j=null,Q)Q=null,$.dispatchUi({type:"SET_MARQUEE",marquee:null});if(q){if(!k$(q.fromAttrs,q.toAttrs))$.dispatch(I0(q.entId,q.fromAttrs,q.toAttrs));q=null,$.dispatchUi({type:"SET_DRAG_ATTR",index:-1})}}function E(K){if(G().dialog){if(K.key==="Escape")$.dispatchUi({type:"CLOSE_DIALOG"});return}let z=K.target.tagName;if(z==="INPUT"||z==="SELECT"||z==="TEXTAREA")return;let V=K.metaKey||K.ctrlKey;if(V&&!K.altKey&&K.key.toLowerCase()==="z"){if(K.preventDefault(),K.shiftKey)i.redo();else i.undo();return}if(V&&!K.altKey&&K.key.toLowerCase()==="y"){K.preventDefault(),i.redo();return}if((K.key==="Delete"||K.key==="Backspace")&&(G().selIds.length||G().sel))K.preventDefault(),i.deleteSelected()}let f=0;function m(K){return!!K.dataTransfer&&Array.from(K.dataTransfer.types).includes("Files")}function J0(K){if(!m(K))return;if(K.preventDefault(),f++,f===1)$.dispatchUi({type:"SET_DRAG_ACTIVE",active:!0})}function W0(K){if(!m(K))return;K.preventDefault()}function m0(K){if(!m(K))return;if(f=Math.max(0,f-1),f===0)$.dispatchUi({type:"SET_DRAG_ACTIVE",active:!1})}function N0(K){K.preventDefault(),f=0,$.dispatchUi({type:"SET_DRAG_ACTIVE",active:!1});let z=Array.from(K.dataTransfer?.files??[]),V=z.find((M)=>M.name.toLowerCase().endsWith(".svg")||M.type==="image/svg+xml");if(!V){if(z.length)$.dispatchUi({type:"OPEN_ERROR_DIALOG",message:"Drop a single .svg file exported from EnReD to import it."});return}X0(V)}window.addEventListener("mousemove",T),window.addEventListener("mouseup",b),window.addEventListener("keydown",E),window.addEventListener("dragenter",J0),window.addEventListener("dragover",W0),window.addEventListener("dragleave",m0),window.addEventListener("drop",N0);function L0(K,z,V){let M=new Blob([z],{type:V}),Y=URL.createObjectURL(M),k=document.createElement("a");k.href=Y,k.download=K,k.click(),URL.revokeObjectURL(Y)}async function X0(K){let z=await K.text(),V=O6(z);if(!V.ok){$.dispatchUi({type:"OPEN_ERROR_DIALOG",message:V.error});return}$.dispatch(V9(F(),V.doc)),_(),i.fitToScreen()}function P0(K){let z=L(K.from),V=L(K.to);return i9(z,V,K)}function V0(K,z,V){let M=[];for(let Y of Object.keys(K.starts)){let k=K.starts[Y];M.push(c9(Y,k,{x:k.x+z,y:k.y+V}))}for(let Y of K.relVias)M.push(u(Y.id,Y.start,Y.start.map((k)=>({x:k.x+z,y:k.y+V}))));return k0(M)}function c0(K){let{ddx:z,ddy:V}=K.dd;if(z===0&&V===0)return;$.dispatch(V0(K,z,V))}function B9(K){if(Z||J||X||W||Q||U)return;if(G().connecting){if(G().nearId)$.dispatchUi({type:"SET_NEAR",nearId:null});return}let z=O();if(!z)return;let V=z.getBoundingClientRect();if(!(K.clientX>=V.left&&K.clientX<=V.right&&K.clientY>=V.top&&K.clientY<=V.bottom)){if(G().nearId)$.dispatchUi({type:"SET_NEAR",nearId:null});return}let Y=n9(F().entities,S(K));if(Y!==G().nearId)$.dispatchUi({type:"SET_NEAR",nearId:Y})}function y6(K,z){return{id:$0("r"),from:K,to:z,fromCard:"1",toCard:"N"}}function k9(K){let z=O();if(!z)return;let V=z.getBoundingClientRect();C9(V.width/2,V.height/2,K)}function C9(K,z,V){let{scale:M,panX:Y,panY:k}=G().viewport,D=M9(M*V,0.4,2.5),w=(K-Y)/M,c=(z-k)/M;$.dispatchUi({type:"SET_VIEWPORT",scale:D,panX:K-w*D,panY:z-c*D})}function A0(K){let z=G().sel?.id;if(!z)return;let V=L(z);if(!V)return;let M=V.attrs.map((k)=>({...k})),Y=K(V.attrs.map((k)=>({...k})));$.dispatch(I0(z,M,Y))}let i={addEntity(){let K=O();if(!K)return;let z=K.getBoundingClientRect(),{panX:V,panY:M,scale:Y}=G().viewport,k=e((z.width/2-V)/Y-110),D=e((z.height/2-M)/Y-60),w=$0("e");$.dispatch(Q9({id:w,name:"NewEntity",color:"#6B7280",x:k,y:D,attrs:[{name:"id",type:"uuid"}]})),H("ent",w,[w])},toggleConnect(){$.dispatchUi({type:"SET_CONNECT",connecting:!G().connecting,connectFrom:null})},undo(){$.undo(),_()},redo(){$.redo(),_()},zoomIn(){k9(1.15)},zoomOut(){k9(0.8695652173913044)},zoomReset(){$.dispatchUi({type:"SET_VIEWPORT",scale:1,panX:30,panY:24})},fitToScreen(){let K=O();if(!K)return;let z=x0(F().entities);if(!z){$.dispatchUi({type:"SET_VIEWPORT",scale:1,panX:30,panY:24});return}let V=K.getBoundingClientRect(),M=60,Y=M9(Math.min((V.width-2*M)/z.w,(V.height-2*M)/z.h),0.4,2.5),k=(V.width-z.w*Y)/2-z.x*Y,D=(V.height-z.h*Y)/2-z.y*Y;$.dispatchUi({type:"SET_VIEWPORT",scale:Y,panX:k,panY:D})},toggleTheme(){let K=G().theme==="dark"?"light":"dark";$.dispatchUi({type:"SET_THEME",theme:K}),Z6(K)},saveDiagram(){j6(F().title,F())},openLoadDialog(){$.dispatchUi({type:"OPEN_LOAD_DIALOG",items:Y9()})},loadSaved(K){let z=Q6(K);if($.dispatchUi({type:"CLOSE_DIALOG"}),!z)return;$.dispatch(V9(F(),z)),_(),i.fitToScreen()},deleteSaved(K){K6(K),$.dispatchUi({type:"OPEN_LOAD_DIALOG",items:Y9()})},closeDialog(){$.dispatchUi({type:"CLOSE_DIALOG"})},exportDiagram(){let K=M6(F(),$.state.config);L0(F6(F()),K,"image/svg+xml;charset=utf-8")},openImportPicker(){let K=document.createElement("input");K.type="file",K.accept=".svg,image/svg+xml",K.addEventListener("change",()=>{let z=K.files?.[0];if(z)X0(z)}),K.click()},onCanvasDown(K){if(G().connecting){$.dispatchUi({type:"SET_CONNECT",connecting:!1,connectFrom:null});return}if(K.shiftKey){let z=S(K);Q={x0:z.x,y0:z.y},$.dispatchUi({type:"SET_MARQUEE",marquee:{x:z.x,y:z.y,w:0,h:0}}),_();return}J={sx:K.clientX,sy:K.clientY,px:G().viewport.panX,py:G().viewport.panY},_()},onCanvasDblClick(K){if(K.target.closest?.(".node"))return;let z=S(K),V=$0("e");$.dispatch(Q9({id:V,name:"NewEntity",color:"#6B7280",x:e(z.x-110),y:e(z.y-25),attrs:[{name:"id",type:"uuid"}]})),H("ent",V,[V])},onCanvasMove(K){B9(K)},onCanvasLeave(){if(G().nearId&&!U)$.dispatchUi({type:"SET_NEAR",nearId:null})},onWheel(K){K.preventDefault();let z=O();if(!z)return;let V=z.getBoundingClientRect();C9(K.clientX-V.left,K.clientY-V.top,K.deltaY<0?1.08:0.93)},onEntityDown(K,z){if(K.stopPropagation(),G().connecting){let P=G().connectFrom;if(!P)$.dispatchUi({type:"SET_CONNECT",connecting:!0,connectFrom:z});else if(P!==z){let I=y6(P,z);$.dispatch(K9(I)),$.dispatchUi({type:"SET_CONNECT",connecting:!1,connectFrom:null}),H("rel",I.id)}return}let V=S(K);if(K.shiftKey||K.metaKey||K.ctrlKey){let P=G().selIds.slice(),I=P.indexOf(z);if(I>=0)P.splice(I,1);else P.push(z);$.dispatchUi({type:"SET_SELECTION",sel:P.length?{kind:"ent",id:P[P.length-1]}:null,selIds:P});return}let Y=G().selIds.includes(z)&&G().selIds.length>1?G().selIds.slice():[z],k={};for(let P of Y){let I=L(P);if(I)k[P]={x:I.x,y:I.y}}let D=new Set(Y),w=F().relations.filter((P)=>D.has(P.from)&&D.has(P.to)&&P.vias&&P.vias.length).map((P)=>({id:P.id,start:(P.vias||[]).map((I)=>({...I}))})),c=L(z);Z={id:z,dx:V.x-c.x,dy:V.y-c.y,starts:k,relVias:w,moved:!1,dd:{ddx:0,ddy:0}},H("ent",z,Y)},onEdgeDown(K,z){K.stopPropagation(),H("rel",z),W={id:z}},onEdgeRemoveVias(K,z){K.stopPropagation();let V=C(z);if(!V||!V.vias||!V.vias.length)return;let M=V.vias.map((Y)=>({...Y}));$.dispatch(u(z,M,[]))},onRelSelect(K,z){K.stopPropagation(),H("rel",z)},onHandleDown(K,z,V){K.stopPropagation(),H("rel",z);let M=C(z);X={id:z,index:V,fromVias:(M?.vias||[]).map((Y)=>({...Y})),toVias:(M?.vias||[]).map((Y)=>({...Y}))}},onHandleRemove(K,z,V){K.stopPropagation();let M=C(z);if(!M)return;let Y=(M.vias||[]).map((D)=>({...D})),k=Y.filter((D,w)=>w!==V);$.dispatch(u(z,Y,k))},onOutHandleDown(K,z,V){K.stopPropagation();let M=S(K);U={from:z,fromAttr:V},$.dispatchUi({type:"SET_NEW_REL",newRel:{from:z,fromAttr:V,x:M.x,y:M.y},newRelTarget:null})},onPanelResizeDown(K){K.preventDefault(),K.stopPropagation(),j={sx:K.clientX,sw:G().panelWidth}},onDiagramTitle(K){$.dispatch(X9({title:K}))},onDiagramDesc(K){$.dispatch(X9({description:K}))},onGridStyle(K){$.dispatchUi({type:"SET_GRID_STYLE",style:K})},onColorDesc(K,z){$.dispatch(d9(K,F().colorLegend[K]||"",z))},onEntityName(K){let z=G().sel?.id;if(z)$.dispatch(w0(z,{name:K}))},onEntityColorSwatch(K){let z=G().sel?.id;if(z)$.dispatch(w0(z,{color:K}))},onEntityColorText(K){let z=G().sel?.id;if(z)$.dispatch(w0(z,{color:K}))},onRelShape(K){let z=G().sel?.id;if(z)$.dispatch(W9(z,{shape:K}))},onRelCard(K,z){let V=G().sel?.id;if(V)$.dispatch(W9(V,K==="from"?{fromCard:z}:{toCard:z}))},onAttrName(K,z){A0((V)=>{if(V[K])V[K].name=z;return V})},onAttrType(K,z){A0((V)=>{if(V[K])V[K].type=z;return V})},onAttrRemove(K){A0((z)=>{return z.splice(K,1),z})},onAttrAdd(){A0((K)=>[...K,{name:"attribute",type:"string"}])},onAttrDragStart(K,z){K.preventDefault();let V=G().sel?.id,M=V?L(V):void 0;if(!M)return;let Y=M.attrs.map((k)=>({...k}));q={entId:M.id,index:z,fromAttrs:Y,toAttrs:Y.slice()},$.dispatchUi({type:"SET_DRAG_ATTR",index:z})},onAttrRowEnter(K){if(!q||K===q.index)return;let z=L(q.entId);if(!z)return;let V=z.attrs.map((Y)=>({...Y})),[M]=V.splice(q.index,1);if(!M)return;V.splice(K,0,M),q.index=K,q.toAttrs=V,$.preview(I0(z.id,q.fromAttrs,V)),$.dispatchUi({type:"SET_DRAG_ATTR",index:K})},onFieldFocus(){},deleteSelected(){let K=G().selIds;if(K.length){let V=new Set(K),M=[...F().relations.filter((Y)=>V.has(Y.from)||V.has(Y.to)).map((Y)=>z9(Y.id)),...K.map((Y)=>m9(Y))];$.dispatch(k0(M)),_();return}let z=G().sel;if(!z||z.kind!=="rel")return;$.dispatch(z9(z.id)),_()}};return i}function B$($,Z){if($.length!==Z.length)return!1;return $.every((J,j)=>J.x===Z[j].x&&J.y===Z[j].y)}function k$($,Z){if($.length!==Z.length)return!1;return $.every((J,j)=>J.name===Z[j].name&&J.type===Z[j].type)}var C$={mode:"light",appBg:"#E9E9EC",surface:"#FFFFFF",surfaceHover:"#F4F4F6",canvasBg:"#F6F6F7",border:"#E0E0E4",borderSubtle:"#ECECEF",divider:"#E7E7EA",textPrimary:"#26262B",textSecondary:"#5A5C66",textMuted:"#9A9CA6",entityBorder:"#E3E3E8",edgeStroke:"#B9BBC4",iconMuted:"#B3B4BC",gridCross:"#D6D6DB",gridDots:"#D2D2D8",rowBg:"#F7F7F8",rowBgActive:"#EDF3FC",toggleTrackBg:"#F2F2F4",dangerBorder:"#F0DCDC",dangerBg:"#FDF7F7",dangerBgHover:"#FBEDED",dangerText:"#C05555",overlayBackdrop:"rgba(20,22,30,0.28)",shadowRgb:"30,34,50",swatchRing:"rgba(0,0,0,0.1)",entityTintRatio:12},_$={mode:"dark",appBg:"#17181C",surface:"#24252B",surfaceHover:"#2E2F37",canvasBg:"#1B1C21",border:"#3A3B44",borderSubtle:"#33343B",divider:"#34353D",textPrimary:"#EDEDF0",textSecondary:"#A7A9B4",textMuted:"#787A87",entityBorder:"#3D3E48",edgeStroke:"#585A66",iconMuted:"#656674",gridCross:"#2C2D34",gridDots:"#34353D",rowBg:"#2B2C33",rowBgActive:"#232C42",toggleTrackBg:"#1C1D22",dangerBorder:"#5A3232",dangerBg:"#2E1F1F",dangerBgHover:"#3B2626",dangerText:"#E48787",overlayBackdrop:"rgba(0,0,0,0.55)",shadowRgb:"0,0,0",swatchRing:"rgba(255,255,255,0.16)",entityTintRatio:26};function B6($){return $==="dark"?_$:C$}function S$($){return $.replace(/[A-Z]/g,(Z)=>"-"+Z.toLowerCase())}function k6($){return Object.entries($).filter(([Z])=>Z!=="mode"&&Z!=="entityTintRatio").map(([Z,J])=>`--${S$(Z)}:${J}`).join(";")}var N$={cross:"url(#gcross)",dots:"url(#gdots)",none:"none"};function C6($){let{doc:Z,ui:J,config:j}=$,Q=j.accent,W=B6(J.theme),X=new Map;for(let H of Z.entities)X.set(H.id,H);let U=Z.entities.map((H)=>{let _=H.color||C0,T=J.selIds.includes(H.id),b=J.connectFrom===H.id,E=J.newRelTarget===H.id,f=T||b||E;return{id:H.id,name:H.name,x:H.x,y:H.y,tint:W6(_,W.surface,W.entityTintRatio),dot:_,borderColor:f?Q:W.entityBorder,shadow:T||E?`0 0 0 3px ${Q}33, 0 8px 24px rgba(${W.shadowRgb},0.10)`:`0 1px 3px rgba(${W.shadowRgb},0.06)`,zIndex:T?1:0,attrs:H.attrs.map((m)=>({name:m.name,type:m.type,showType:j.showTypes}))}}),q=[],O=[],F=[],G=J.sel;for(let H of Z.relations){let _=X.get(H.from),T=X.get(H.to);if(!_||!T)continue;let b={x:_.x+s+v,y:t(_,H.fromAttr)},E={x:T.x-v,y:T.y+x/2},f=!!G&&G.kind==="rel"&&G.id===H.id,m=f?Q:W.edgeStroke,J0=H.vias||[],W0=[b,...J0,E],m0=g0(b,E,J0,(H.shape||"s-curve")==="straight");if(J0.length)J0.forEach((V0,c0)=>F.push({relId:H.id,index:c0,x:V0.x,y:V0.y,fill:f?Q:W.surface,stroke:f?Q:W.edgeStroke}));q.push({id:H.id,d:m0,stroke:m,w:f?2:1.5,x1:b.x,y1:b.y,x2:E.x,y2:E.y,dotFill:f?Q:W.surface});let N0=K0(b,W0[1],34),L0=K0(E,W0[W0.length-2],34),X0=f?Q:W.textSecondary,P0=f?Q:W.entityBorder;if(H.fromCard&&H.fromCard.trim())O.push({id:H.id+"a",relId:H.id,x:N0.x,y:N0.y-14,text:H.fromCard,color:X0,border:P0});if(H.toCard&&H.toCard.trim())O.push({id:H.id+"b",relId:H.id,x:L0.x,y:L0.y-14,text:H.toCard,color:X0,border:P0})}let L=[],C=J.nearId?X.get(J.nearId):null;if(C&&!J.connecting&&!J.newRel)L.push({id:C.id,attr:"",x:C.x+s+v,y:C.y+x/2}),C.attrs.forEach((H,_)=>L.push({id:C.id,attr:String(_),x:C.x+s+v,y:C.y+o9+_*s9}));let S="";if(J.newRel){let H=X.get(J.newRel.from);if(H){let _=t(H,J.newRel.fromAttr),T={x:H.x+s+v,y:_},b={x:J.newRel.x,y:J.newRel.y},E=Math.max(40,Math.abs(b.x-T.x)*0.5);S=`M ${T.x} ${T.y} C ${T.x+E} ${T.y}, ${b.x-E} ${b.y}, ${b.x} ${b.y}`}}return{accent:Q,theme:W,gridFill:N$[J.gridStyle],panX:J.viewport.panX,panY:J.viewport.panY,scale:J.viewport.scale,zoomPct:Math.round(J.viewport.scale*100)+"%",entities:U,edges:q,labels:O,handles:F,outHandles:L,newRelPath:S,marquee:J.marquee,connecting:J.connecting,bannerText:J.connectFrom?"Now click the target entity":"Click the source entity",canvasCursor:J.connecting?"crosshair":"default",entCursor:J.connecting?"crosshair":"grab",panelWidth:J.panelWidth,panel:L$($,X)}}function L$($,Z){let{doc:J,ui:j,config:Q}=$,W=Q.accent,X=j.selIds.length>1,U=j.sel,q=!X&&U&&U.kind==="ent"?Z.get(U.id)??null:null,O=j.selIds.length===0&&U&&U.kind==="rel"?J.relations.find((_)=>_.id===U.id)??null:null,F=X?"multi":q?"entity":O?"relation":"empty",G=[];for(let _ of J.entities){let T=_.color||C0;if(!G.includes(T))G.push(T)}let L=G.map((_)=>({key:_,hex:_,desc:J.colorLegend[_]||""})),C=O?Z.get(O.from):void 0,S=O?Z.get(O.to):void 0,H=O&&C&&O.fromAttr!=null&&C.attrs[O.fromAttr]?"."+C.attrs[O.fromAttr].name:"";return{section:F,title:J.title,description:J.description,colors:L,hasColors:J.entities.length>0,gridStyle:j.gridStyle,multiCount:j.selIds.length,entName:q?q.name:"",entColor:q?q.color||"":"",swatches:z6.map((_)=>({key:_,hex:_,selected:!!q&&(q.color||"").toLowerCase()===_.toLowerCase()})),attrs:q?q.attrs.map((_,T)=>({index:T,name:_.name,type:_.type,dragging:j.dragAttrIndex===T})):[],relFromName:C?C.name+H:"",relToName:S?S.name:"",relFromCard:O?O.fromCard:"1",relToCard:O?O.toCard:"N",relShape:O?O.shape||"s-curve":"s-curve",shapeLocked:!!(O&&O.vias&&O.vias.length)}}var _6=new Map;function Z0($){_6.set($.id,$)}function O9($="left"){return[..._6.values()].filter((Z)=>(Z.align??"left")===$).sort((Z,J)=>Z.order-J.order)}function S6($){return B`
    <div style="height:62px;flex:none;display:flex;align-items:center;gap:10px;padding:0 16px;">
      ${O9("left").map((Z)=>Z.render($))}
      <div style="flex:1;"></div>
      ${O9("right").map((Z)=>Z.render($))}
    </div>
  `}function N6($,Z,J,j){return{accent:$.accent,connecting:$.connecting,zoomPct:$.zoomPct,canUndo:J,canRedo:j,theme:$.theme.mode,h:Z}}function L6($,Z,J){return B`
    <div
      class="node"
      @mousedown=${(j)=>J.onEntityDown(j,$.id)}
      style="position:absolute;left:0;top:0;width:220px;transform:translate(${$.x}px, ${$.y}px);background:var(--surface);border:1px solid ${$.borderColor};border-radius:10px;box-shadow:${$.shadow};cursor:${Z};user-select:none;box-sizing:border-box;z-index:${$.zIndex};"
    >
      <div
        style="height:40px;display:flex;align-items:center;gap:8px;padding:0 14px;background:${$.tint};border-radius:9px 9px 0 0;border-bottom:1px solid var(--border-subtle);box-sizing:border-box;"
      >
        <span style="width:8px;height:8px;border-radius:50%;background:${$.dot};flex:none;"></span>
        <span style="font-size:14px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
          ${$.name}
        </span>
      </div>
      <div style="padding:4px 0;">
        ${$.attrs.map((j)=>B`
            <div
              style="height:29px;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 14px;box-sizing:border-box;"
            >
              <span style="font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${j.name}</span>
              <span
                style="font-size:11px;color:var(--text-muted);font-family:ui-monospace,Menlo,monospace;flex:none;display:${j.showType?"inline":"none"};"
                >${j.type}</span
              >
            </div>
          `)}
      </div>
    </div>
  `}function P6($,Z){return B`
    <div
      id="canvas"
      @mousedown=${(J)=>Z.onCanvasDown(J)}
      @dblclick=${(J)=>Z.onCanvasDblClick(J)}
      @mousemove=${(J)=>Z.onCanvasMove(J)}
      @mouseleave=${()=>Z.onCanvasLeave()}
      @wheel=${(J)=>Z.onWheel(J)}
      style="flex:1;position:relative;overflow:hidden;background:var(--canvas-bg);border:1px solid var(--border);border-radius:12px;cursor:${$.canvasCursor};"
    >
      <div
        style="position:absolute;left:0;top:0;width:0;height:0;transform-origin:0 0;transform:translate(${$.panX}px, ${$.panY}px) scale(${$.scale});"
      >
        ${P$($,Z)} ${$.entities.map((J)=>L6(J,$.entCursor,Z))}
        ${$.labels.map((J)=>B`
            <div
              class="node"
              @mousedown=${(j)=>Z.onRelSelect(j,J.relId)}
              style="position:absolute;left:0;top:0;transform:translate(${J.x}px, ${J.y}px) translate(-50%, -50%);background:var(--surface);color:${J.color};border:1px solid ${J.border};border-radius:999px;padding:2px 7px;font-size:11px;font-weight:500;white-space:nowrap;cursor:pointer;box-shadow:0 1px 2px rgba(var(--shadow-rgb),0.05);"
            >
              ${J.text}
            </div>
          `)}
        ${$.marquee?B`<div
              style="position:absolute;left:0;top:0;transform:translate(${$.marquee.x}px, ${$.marquee.y}px);width:${$.marquee.w}px;height:${$.marquee.h}px;background:${$.accent}1A;border:1px solid ${$.accent};border-radius:2px;pointer-events:none;"
            ></div>`:""}
        ${$.outHandles.map((J)=>B`
            <div
              class="node"
              @mousedown=${(j)=>Z.onOutHandleDown(j,J.id,J.attr===""?null:Number(J.attr))}
              title="Drag to connect"
              style="position:absolute;left:0;top:0;transform:translate(${J.x}px, ${J.y}px) translate(-50%, -50%);width:14px;height:14px;border-radius:50%;background:var(--surface);border:2px solid ${$.accent};cursor:crosshair;box-shadow:0 1px 4px rgba(var(--shadow-rgb),0.25);z-index:5;"
            ></div>
          `)}
      </div>

      ${$.connecting?B`<div
            style="position:absolute;top:14px;left:50%;transform:translateX(-50%);background:#26262B;color:#FFFFFF;font-size:12px;padding:8px 16px;border-radius:999px;pointer-events:none;"
          >
            ${$.bannerText}
          </div>`:""}
    </div>
  `}function P$($,Z){return B`
    <svg width="6000" height="4000" style="position:absolute;left:0;top:0;overflow:visible;display:block;">
      <defs>
        <pattern id="gcross" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M 14 10 V 18 M 10 14 H 18" style="stroke:var(--grid-cross);stroke-width:1;fill:none;opacity:0.5;"></path>
        </pattern>
        <pattern id="gdots" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="1.2" style="fill:var(--grid-dots);opacity:0.5;"></circle>
        </pattern>
      </defs>
      <rect x="-4000" y="-4000" width="14000" height="12000" style="fill:${$.gridFill};"></rect>
      ${$.edges.map((J)=>e0`
          <g>
            <path
              class="node"
              d=${J.d}
              @mousedown=${(j)=>Z.onEdgeDown(j,J.id)}
              @dblclick=${(j)=>Z.onEdgeRemoveVias(j,J.id)}
              style="stroke:transparent;stroke-width:16;fill:none;cursor:pointer;"
            ></path>
            <path d=${J.d} style="stroke:${J.stroke};stroke-width:${J.w};fill:none;pointer-events:none;"></path>
            <circle
              cx=${J.x1}
              cy=${J.y1}
              r="4"
              style="fill:${J.dotFill};stroke:${J.stroke};stroke-width:1.5;pointer-events:none;"
            ></circle>
            <circle
              cx=${J.x2}
              cy=${J.y2}
              r="4"
              style="fill:${J.dotFill};stroke:${J.stroke};stroke-width:1.5;pointer-events:none;"
            ></circle>
          </g>
        `)}
      ${$.handles.map((J)=>e0`
          <circle
            class="node"
            cx=${J.x}
            cy=${J.y}
            r="6"
            @mousedown=${(j)=>Z.onHandleDown(j,J.relId,J.index)}
            @dblclick=${(j)=>Z.onHandleRemove(j,J.relId,J.index)}
            style="fill:${J.fill};stroke:${J.stroke};stroke-width:2;cursor:grab;"
          ></circle>
        `)}
      <path
        d=${$.newRelPath}
        style="stroke:${$.accent};stroke-width:2;stroke-dasharray:5 4;fill:none;pointer-events:none;"
      ></path>
    </svg>
  `}var o="font-size:12px;color:var(--text-secondary);",p0="font-size:11px;letter-spacing:0.08em;color:var(--text-muted);font-weight:600;",A6="width:100%;box-sizing:border-box;height:34px;padding:0 10px;border:1px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;background:var(--surface);color:var(--text-primary);outline:none;",H9="height:34px;border:1px solid var(--danger-border);background:var(--danger-bg);color:var(--danger-text);border-radius:8px;font-size:13px;font-family:inherit;cursor:pointer;margin-top:4px;",p=($)=>$.target.value;function D6($,Z,J,j){return B`
    <div
      style="width:${J}px;flex:none;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px;overflow-y:auto;box-sizing:border-box;display:flex;flex-direction:column;gap:14px;"
    >
      ${$.section==="empty"?T$($,Z,j):$.section==="multi"?f$($,j):$.section==="entity"?R$($,Z,j):b$($,Z,j)}
    </div>
  `}var A$=[{value:"cross",label:"Cross"},{value:"dots",label:"Dots"},{value:"none",label:"None"}];function D$($,Z){let J={bg:"var(--surface)",color:"var(--text-primary)",shadow:"0 1px 2px rgba(var(--shadow-rgb),0.12)"},j={bg:"transparent",color:"var(--text-secondary)",shadow:"none"};return B`
    <div style="display:flex;background:var(--toggle-track-bg);border-radius:8px;padding:3px;gap:3px;">
      ${A$.map((Q)=>{let W=Q.value===$?J:j;return B`
          <button
            @click=${()=>Z.onGridStyle(Q.value)}
            style="flex:1;height:30px;border:none;border-radius:6px;font-size:12px;font-family:inherit;cursor:pointer;background:${W.bg};color:${W.color};box-shadow:${W.shadow};"
          >
            ${Q.label}
          </button>
        `})}
    </div>
  `}function T$($,Z,J){return B`
    <div style=${p0}>DIAGRAM</div>
    <div style="display:flex;flex-direction:column;gap:6px;">
      <label style=${o}>Title</label>
      <input
        class="fld"
        .value=${$.title}
        @change=${(j)=>J.onDiagramTitle(p(j))}
        placeholder="Untitled diagram"
        style=${A6}
      />
    </div>
    <div style="display:flex;flex-direction:column;gap:6px;">
      <label style=${o}>Description</label>
      <textarea
        class="fld"
        .value=${$.description}
        @change=${(j)=>J.onDiagramDesc(p(j))}
        rows="4"
        placeholder="What does this diagram model?"
        style="width:100%;box-sizing:border-box;padding:8px 10px;border:1px solid var(--border);border-radius:8px;font-size:13px;line-height:1.5;font-family:inherit;background:var(--surface);color:var(--text-primary);outline:none;resize:vertical;"
      ></textarea>
    </div>
    <div style="display:flex;flex-direction:column;gap:6px;">
      <label style=${o}>Grid</label>
      ${D$($.gridStyle,J)}
    </div>
    ${$.hasColors?B`
          <div style="display:flex;flex-direction:column;gap:8px;">
            <label style=${o}>Colors used</label>
            <div style="display:flex;flex-direction:column;gap:6px;">
              ${$.colors.map((j)=>B`
                  <div style="display:flex;align-items:center;gap:8px;">
                    <span
                      style="width:16px;height:16px;flex:none;border-radius:4px;background:${j.hex};box-shadow:inset 0 0 0 1px var(--swatch-ring);"
                    ></span>
                    <input
                      class="fld"
                      .value=${j.desc}
                      @change=${(Q)=>J.onColorDesc(j.key,p(Q))}
                      placeholder="Describe this color…"
                      style="flex:1;min-width:0;height:32px;box-sizing:border-box;padding:0 10px;border:1px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;background:var(--surface);color:var(--text-primary);outline:none;"
                    />
                  </div>
                `)}
            </div>
          </div>
        `:A}
    <div style="border-top:1px solid var(--border-subtle);padding-top:12px;font-size:12px;color:var(--text-muted);line-height:1.6;">
      Select an entity or relation on the canvas to edit it. Drag entities to move; scroll to zoom; drag the background to
      pan. Shift-click entities or shift-drag the canvas to select several at once.
    </div>
  `}function f$($,Z){return B`
    <div style=${p0}>SELECTION</div>
    <div style="font-size:15px;font-weight:600;">${$.multiCount} entities selected</div>
    <div style="font-size:12px;color:var(--text-muted);line-height:1.6;">
      Drag any selected entity to move them together. Shift-click an entity to add or remove it from the selection.
    </div>
    <button class="danger-btn" @click=${()=>Z.deleteSelected()} style=${H9}>Delete selected</button>
  `}function R$($,Z,J){return B`
    <div style=${p0}>ENTITY</div>
    <div style="display:flex;flex-direction:column;gap:6px;">
      <label style=${o}>Name</label>
      <input
        class="fld"
        .value=${$.entName}
        @change=${(j)=>J.onEntityName(p(j))}
        @focus=${()=>J.onFieldFocus()}
        style=${A6}
      />
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;">
      <label style=${o}>Color</label>
      <div style="display:flex;align-items:center;gap:8px;">
        <span
          style="width:16px;height:16px;flex:none;border-radius:4px;background:${$.entColor};box-shadow:inset 0 0 0 1px var(--swatch-ring);"
        ></span>
        <input
          class="fld"
          .value=${$.entColor}
          @change=${(j)=>J.onEntityColorText(p(j))}
          @focus=${()=>J.onFieldFocus()}
          placeholder="#6B7280 or any CSS color"
          style="flex:1;min-width:0;height:34px;box-sizing:border-box;padding:0 10px;border:1px solid var(--border);border-radius:8px;font-size:13px;font-family:ui-monospace,Menlo,monospace;background:var(--surface);color:var(--text-primary);outline:none;"
        />
      </div>
      <div style="display:flex;gap:10px;">
        ${$.swatches.map((j)=>B`
            <div
              @click=${()=>J.onEntityColorSwatch(j.key)}
              style="width:20px;height:20px;border-radius:50%;background:${j.hex};box-shadow:0 0 0 2px var(--surface), 0 0 0 3.5px ${j.selected?"var(--text-primary)":"transparent"};cursor:pointer;"
            ></div>
          `)}
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;">
      <div style="display:flex;align-items:center;">
        <label style=${o}>Attributes</label>
        <div style="flex:1;"></div>
        <button
          @click=${()=>J.onAttrAdd()}
          style="border:none;background:transparent;color:${Z};font-size:12px;font-weight:600;font-family:inherit;cursor:pointer;padding:2px 4px;"
        >
          + Add
        </button>
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;">
        ${$.attrs.map((j)=>B`
            <div
              @mouseenter=${()=>J.onAttrRowEnter(j.index)}
              style="display:flex;align-items:center;gap:6px;background:${j.dragging?"var(--row-bg-active)":"var(--row-bg)"};border-radius:8px;padding:4px;"
            >
              <div
                @mousedown=${(Q)=>J.onAttrDragStart(Q,j.index)}
                title="Drag to reorder"
                style="cursor:grab;color:var(--icon-muted);font-size:11px;padding:0 3px;user-select:none;line-height:1;"
              >
                ⣿
              </div>
              <input
                class="fld"
                .value=${j.name}
                @change=${(Q)=>J.onAttrName(j.index,p(Q))}
                @focus=${()=>J.onFieldFocus()}
                style="flex:1;min-width:0;height:28px;padding:0 8px;border:1px solid var(--border);border-radius:6px;font-size:12px;font-family:inherit;background:var(--surface);color:var(--text-primary);outline:none;"
              />
              <input
                class="fld"
                .value=${j.type}
                @change=${(Q)=>J.onAttrType(j.index,p(Q))}
                @focus=${()=>J.onFieldFocus()}
                placeholder="type"
                style="width:72px;flex:none;height:28px;padding:0 8px;border:1px solid var(--border);border-radius:6px;font-size:11px;font-family:ui-monospace,Menlo,monospace;background:var(--surface);color:var(--text-secondary);outline:none;"
              />
              <button
                @click=${()=>J.onAttrRemove(j.index)}
                style="border:none;background:transparent;color:var(--icon-muted);cursor:pointer;font-size:14px;padding:0 4px;line-height:1;"
              >
                ×
              </button>
            </div>
          `)}
      </div>
    </div>
    <button class="danger-btn" @click=${()=>J.deleteSelected()} style=${H9}>Delete entity</button>
  `}function b$($,Z,J){let j={bg:"var(--surface)",color:"var(--text-primary)",shadow:"0 1px 2px rgba(var(--shadow-rgb),0.12)"},Q={bg:"transparent",color:"var(--text-secondary)",shadow:"none"},W=$.relShape==="s-curve"?j:Q,X=$.relShape==="straight"?j:Q,U=(q,O,F)=>B`
    <button
      @click=${()=>J.onRelShape(q)}
      style="flex:1;height:30px;border:none;border-radius:6px;font-size:12px;font-family:inherit;cursor:pointer;background:${F.bg};color:${F.color};box-shadow:${F.shadow};"
    >
      ${O}
    </button>
  `;return B`
    <div style=${p0}>RELATION</div>
    <div style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;">
      <span style="background:var(--surface-hover);border-radius:6px;padding:4px 8px;">${$.relFromName}</span>
      <span style="color:var(--text-muted);font-weight:400;">→</span>
      <span style="background:var(--surface-hover);border-radius:6px;padding:4px 8px;">${$.relToName}</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:6px;">
      <label style=${o}>Shape</label>
      <div
        style="display:flex;background:var(--toggle-track-bg);border-radius:8px;padding:3px;gap:3px;opacity:${$.shapeLocked?0.45:1};pointer-events:${$.shapeLocked?"none":"auto"};"
      >
        ${U("s-curve","S-curve",W)} ${U("straight","Straight",X)}
      </div>
      ${$.shapeLocked?B`<div style="font-size:11px;color:var(--text-muted);line-height:1.5;">
            Shape is driven by the curvature handles. Remove them (double-click) to switch strategy.
          </div>`:A}
    </div>
    <div style="display:flex;gap:10px;">
      <div style="flex:1;display:flex;flex-direction:column;gap:6px;min-width:0;">
        <label style="font-size:12px;color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"
          >${$.relFromName} end</label
        >
        <input
          class="fld"
          .value=${$.relFromCard}
          @change=${(q)=>J.onRelCard("from",p(q))}
          @focus=${()=>J.onFieldFocus()}
          placeholder="e.g. 1"
          style="height:34px;box-sizing:border-box;padding:0 10px;border:1px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;background:var(--surface);color:var(--text-primary);outline:none;"
        />
      </div>
      <div style="flex:1;display:flex;flex-direction:column;gap:6px;min-width:0;">
        <label style="font-size:12px;color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"
          >${$.relToName} end</label
        >
        <input
          class="fld"
          .value=${$.relToCard}
          @change=${(q)=>J.onRelCard("to",p(q))}
          @focus=${()=>J.onFieldFocus()}
          placeholder="e.g. N"
          style="height:34px;box-sizing:border-box;padding:0 10px;border:1px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;background:var(--surface);color:var(--text-primary);outline:none;"
        />
      </div>
    </div>
    <button class="danger-btn" @click=${()=>J.deleteSelected()} style=${H9}>Delete relation</button>
  `}var E$="position:fixed;inset:0;background:var(--overlay-backdrop);display:flex;align-items:center;justify-content:center;z-index:100;",y$="width:420px;max-width:calc(100vw - 32px);background:var(--surface);border-radius:14px;box-shadow:0 12px 48px rgba(var(--shadow-rgb),0.24);padding:20px;display:flex;flex-direction:column;gap:14px;box-sizing:border-box;",T6="font-size:15px;font-weight:600;color:var(--text-primary);",w$="height:36px;padding:0 16px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);border-radius:8px;font-size:13px;font-family:inherit;cursor:pointer;",I$="height:36px;padding:0 18px;border:none;background:var(--accent,#2F6BDB);color:#FFFFFF;border-radius:8px;font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;";function f6($,Z){if(!$)return A;return B`
    <div style=${E$} @mousedown=${()=>Z.closeDialog()}>
      <div style=${y$} @mousedown=${(J)=>J.stopPropagation()}>
        ${$.kind==="load"?g$($.items,Z):x$($.message,Z)}
      </div>
    </div>
  `}function g$($,Z){return B`
    <div style=${T6}>Load diagram</div>
    ${$.length===0?B`<div style="font-size:13px;color:var(--text-muted);line-height:1.6;padding:8px 0;">
          No saved diagrams yet. Use <strong style="color:var(--text-secondary);">Save</strong> to store the current one.
        </div>`:B`<div style="display:flex;flex-direction:column;gap:6px;max-height:50vh;overflow-y:auto;">
          ${$.map((J)=>h$(J,Z))}
        </div>`}
    <div style="display:flex;justify-content:flex-end;gap:8px;">
      <button style=${w$} @click=${()=>Z.closeDialog()}>Close</button>
    </div>
  `}function x$($,Z){return B`
    <div style=${T6}>Import failed</div>
    <div style="font-size:13px;color:var(--text-secondary);line-height:1.6;">${$}</div>
    <div style="display:flex;justify-content:flex-end;gap:8px;">
      <button style=${I$} @click=${()=>Z.closeDialog()}>OK</button>
    </div>
  `}function h$($,Z){return B`
    <div
      class="saved-row"
      @click=${()=>Z.loadSaved($.id)}
      style="display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--border-subtle);border-radius:9px;cursor:pointer;"
    >
      <div style="flex:1;min-width:0;">
        <div style="font-size:13px;font-weight:600;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
          ${$.name}
        </div>
        <div style="font-size:11px;color:var(--text-muted);">${u$($.savedAt)}</div>
      </div>
      <button
        title="Delete"
        @click=${(J)=>{J.stopPropagation(),Z.deleteSaved($.id)}}
        style="flex:none;border:none;background:transparent;color:var(--icon-muted);cursor:pointer;font-size:16px;padding:0 4px;line-height:1;"
      >
        ×
      </button>
    </div>
  `}function u$($){try{return new Date($).toLocaleString(void 0,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}catch{return""}}function R6($,Z,J){let j=C6($),Q=j.theme;return B`
    <div
      style="--accent:${j.accent};${k6(Q)};display:flex;flex-direction:column;width:100vw;height:100vh;background:var(--app-bg);font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:var(--text-primary);overflow:hidden;"
    >
      ${S6(N6(j,Z,J.canUndo,J.canRedo))}
      <div style="flex:1;display:flex;min-height:0;padding:0 12px 12px 12px;gap:12px;">
        ${P6(j,Z)}
        <div
          @mousedown=${(W)=>Z.onPanelResizeDown(W)}
          title="Drag to resize"
          style="width:8px;flex:none;margin:0 -6px;cursor:col-resize;display:flex;align-items:center;justify-content:center;position:relative;z-index:6;"
        >
          <div style="width:3px;height:44px;border-radius:2px;background:${Q.iconMuted};"></div>
        </div>
        ${D6(j.panel,j.accent,j.panelWidth,Z)}
      </div>
      ${$.ui.dragActive?B`<div
            style="position:fixed;inset:0;background:${j.accent}14;border:3px dashed ${j.accent};border-radius:16px;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:200;"
          >
            <div
              style="background:${Q.surface};color:${Q.textPrimary};font-size:15px;font-weight:600;padding:14px 22px;border-radius:12px;box-shadow:0 12px 40px rgba(${Q.shadowRgb},0.2);"
            >
              Drop SVG to import
            </div>
          </div>`:""}
      ${f6($.ui.dialog,Z)}
    </div>
  `}var z0="display:flex;align-items:center;background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden;",S0="width:1px;align-self:stretch;background:var(--divider);",_0="height:40px;padding:0 16px;border:none;background:transparent;font-size:14px;font-family:inherit;color:var(--text-primary);cursor:pointer;";Z0({id:"entity-relation",order:0,render:($)=>{let Z=$.connecting?$.accent:"transparent",J=$.connecting?"#FFFFFF":"var(--text-primary)";return B`
      <div style=${z0}>
        <button class="tb" @click=${()=>$.h.addEntity()} style=${_0}>+ Entity</button>
        <div style=${S0}></div>
        <button
          @click=${()=>$.h.toggleConnect()}
          style="height:40px;padding:0 16px;border:none;background:${Z};color:${J};font-size:14px;font-family:inherit;cursor:pointer;"
        >
          + Relation
        </button>
      </div>
    `}});Z0({id:"undo-redo",order:10,render:($)=>B`
    <div style=${z0}>
      <button
        class="tb"
        title="Undo"
        @click=${()=>$.h.undo()}
        style="height:40px;width:44px;border:none;background:transparent;font-size:16px;font-family:inherit;color:var(--text-primary);cursor:pointer;opacity:${$.canUndo?1:0.35};"
      >
        ←
      </button>
      <div style=${S0}></div>
      <button
        class="tb"
        title="Redo"
        @click=${()=>$.h.redo()}
        style="height:40px;width:44px;border:none;background:transparent;font-size:16px;font-family:inherit;color:var(--text-primary);cursor:pointer;opacity:${$.canRedo?1:0.35};"
      >
        →
      </button>
    </div>
  `});Z0({id:"zoom",order:20,render:($)=>B`
    <div style=${z0}>
      <button
        class="tb"
        @click=${()=>$.h.zoomOut()}
        style="height:40px;width:40px;border:none;background:transparent;font-size:16px;font-family:inherit;color:var(--text-primary);cursor:pointer;"
      >
        −
      </button>
      <button
        class="tb"
        title="Reset zoom"
        @click=${()=>$.h.zoomReset()}
        style="height:40px;width:56px;border:none;background:transparent;font-size:12px;font-family:inherit;color:var(--text-secondary);cursor:pointer;"
      >
        ${$.zoomPct}
      </button>
      <button
        class="tb"
        @click=${()=>$.h.zoomIn()}
        style="height:40px;width:40px;border:none;background:transparent;font-size:16px;font-family:inherit;color:var(--text-primary);cursor:pointer;"
      >
        +
      </button>
      <div style=${S0}></div>
      <button
        class="tb"
        title="Fit to screen"
        @click=${()=>$.h.fitToScreen()}
        style="height:40px;width:44px;border:none;background:transparent;font-size:15px;font-family:inherit;color:var(--text-primary);cursor:pointer;"
      >
        ⤢
      </button>
    </div>
  `});Z0({id:"save-load",order:30,render:($)=>B`
    <div style=${z0}>
      <button class="tb" @click=${()=>$.h.saveDiagram()} style=${_0}>Save</button>
      <div style=${S0}></div>
      <button class="tb" @click=${()=>$.h.openLoadDialog()} style=${_0}>Load</button>
    </div>
  `});Z0({id:"import-export",order:40,render:($)=>B`
    <div style=${z0}>
      <button class="tb" @click=${()=>$.h.exportDiagram()} style=${_0}>Export</button>
      <div style=${S0}></div>
      <button class="tb" @click=${()=>$.h.openImportPicker()} style=${_0}>Import</button>
    </div>
  `});Z0({id:"theme",order:50,render:($)=>B`
    <div style=${z0}>
      <button
        class="tb"
        title=${$.theme==="dark"?"Switch to light mode":"Switch to dark mode"}
        @click=${()=>$.h.toggleTheme()}
        style="height:40px;width:44px;border:none;background:transparent;font-size:16px;font-family:inherit;color:var(--text-primary);cursor:pointer;"
      >
        ${$.theme==="dark"?"☀︎":"☾"}
      </button>
    </div>
  `});function v$(){let $=$6();if($)return $;return window.matchMedia?.("(prefers-color-scheme: dark)").matches?"dark":"light"}function b6($,Z={}){let J={...E0,...Z.config??{}},j,Q=new j9(x9(J,v$()),{render:(W)=>U0(R6(W,j,{canUndo:Q.canUndo(),canRedo:Q.canRedo()}),$)});return j=H6(Q),Q.renderNow(),window.__removeAllCurvatureHandles=()=>{let W=Q.state.doc.relations.filter((X)=>X.vias&&X.vias.length).map((X)=>u(X.id,X.vias,[]));if(W.length)Q.dispatch(k0(W))},{store:Q}}var E6=document.getElementById("app");if(!E6)throw Error("index: #app mount point missing");b6(E6,{config:window.__ENRED__?.config});
