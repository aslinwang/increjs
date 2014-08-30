var Zepto=function(){function t(t){return null==t?String(t):X[V.call(t)]||"object"}function e(e){return"function"==t(e)}function n(t){return null!=t&&t==t.window}function r(t){return null!=t&&t.nodeType==t.DOCUMENT_NODE}function i(e){return"object"==t(e)}function o(t){return i(t)&&!n(t)&&Object.getPrototypeOf(t)==Object.prototype}function a(t){return"number"==typeof t.length}function s(t){return A.call(t,function(t){return null!=t})}function u(t){return t.length>0?T.fn.concat.apply([],t):t}function c(t){return t.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/_/g,"-").toLowerCase()}function l(t){return t in P?P[t]:P[t]=new RegExp("(^|\\s)"+t+"(\\s|$)")}function f(t,e){return"number"!=typeof e||L[c(t)]?e:e+"px"}function h(t){var e,n;return D[t]||(e=_.createElement(t),_.body.appendChild(e),n=getComputedStyle(e,"").getPropertyValue("display"),e.parentNode.removeChild(e),"none"==n&&(n="block"),D[t]=n),D[t]}function p(t){return"children"in t?O.call(t.children):T.map(t.childNodes,function(t){return 1==t.nodeType?t:void 0})}function d(t,e,n){for(E in e)n&&(o(e[E])||Y(e[E]))?(o(e[E])&&!o(t[E])&&(t[E]={}),Y(e[E])&&!Y(t[E])&&(t[E]=[]),d(t[E],e[E],n)):e[E]!==w&&(t[E]=e[E])}function v(t,e){return null==e?T(t):T(t).filter(e)}function m(t,n,r,i){return e(n)?n.call(t,r,i):n}function g(t,e,n){null==n?t.removeAttribute(e):t.setAttribute(e,n)}function y(t,e){var n=t.className,r=n&&n.baseVal!==w;return e===w?r?n.baseVal:n:void(r?n.baseVal=e:t.className=e)}function x(t){var e;try{return t?"true"==t||("false"==t?!1:"null"==t?null:/^0/.test(t)||isNaN(e=Number(t))?/^[\[\{]/.test(t)?T.parseJSON(t):t:e):t}catch(n){return t}}function b(t,e){e(t);for(var n=0,r=t.childNodes.length;r>n;n++)b(t.childNodes[n],e)}var w,E,T,j,C,S,N=[],O=N.slice,A=N.filter,_=window.document,D={},P={},L={"column-count":1,columns:1,"font-weight":1,"line-height":1,opacity:1,"z-index":1,zoom:1},$=/^\s*<(\w+|!)[^>]*>/,q=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,k=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,R=/^(?:body|html)$/i,Z=/([A-Z])/g,I=["val","css","html","text","data","width","height","offset"],M=["after","prepend","before","append"],F=_.createElement("table"),U=_.createElement("tr"),H={tr:_.createElement("tbody"),tbody:F,thead:F,tfoot:F,td:U,th:U,"*":_.createElement("div")},z=/complete|loaded|interactive/,B=/^[\w-]*$/,X={},V=X.toString,G={},J=_.createElement("div"),W={tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},Y=Array.isArray||function(t){return t instanceof Array};return G.matches=function(t,e){if(!e||!t||1!==t.nodeType)return!1;var n=t.webkitMatchesSelector||t.mozMatchesSelector||t.oMatchesSelector||t.matchesSelector;if(n)return n.call(t,e);var r,i=t.parentNode,o=!i;return o&&(i=J).appendChild(t),r=~G.qsa(i,e).indexOf(t),o&&J.removeChild(t),r},C=function(t){return t.replace(/-+(.)?/g,function(t,e){return e?e.toUpperCase():""})},S=function(t){return A.call(t,function(e,n){return t.indexOf(e)==n})},G.fragment=function(t,e,n){var r,i,a;return q.test(t)&&(r=T(_.createElement(RegExp.$1))),r||(t.replace&&(t=t.replace(k,"<$1></$2>")),e===w&&(e=$.test(t)&&RegExp.$1),e in H||(e="*"),a=H[e],a.innerHTML=""+t,r=T.each(O.call(a.childNodes),function(){a.removeChild(this)})),o(n)&&(i=T(r),T.each(n,function(t,e){I.indexOf(t)>-1?i[t](e):i.attr(t,e)})),r},G.Z=function(t,e){return t=t||[],t.__proto__=T.fn,t.selector=e||"",t},G.isZ=function(t){return t instanceof G.Z},G.init=function(t,n){var r;if(!t)return G.Z();if("string"==typeof t)if(t=t.trim(),"<"==t[0]&&$.test(t))r=G.fragment(t,RegExp.$1,n),t=null;else{if(n!==w)return T(n).find(t);r=G.qsa(_,t)}else{if(e(t))return T(_).ready(t);if(G.isZ(t))return t;if(Y(t))r=s(t);else if(i(t))r=[t],t=null;else if($.test(t))r=G.fragment(t.trim(),RegExp.$1,n),t=null;else{if(n!==w)return T(n).find(t);r=G.qsa(_,t)}}return G.Z(r,t)},T=function(t,e){return G.init(t,e)},T.extend=function(t){var e,n=O.call(arguments,1);return"boolean"==typeof t&&(e=t,t=n.shift()),n.forEach(function(n){d(t,n,e)}),t},G.qsa=function(t,e){var n,i="#"==e[0],o=!i&&"."==e[0],a=i||o?e.slice(1):e,s=B.test(a);return r(t)&&s&&i?(n=t.getElementById(a))?[n]:[]:1!==t.nodeType&&9!==t.nodeType?[]:O.call(s&&!i?o?t.getElementsByClassName(a):t.getElementsByTagName(e):t.querySelectorAll(e))},T.contains=_.documentElement.contains?function(t,e){return t!==e&&t.contains(e)}:function(t,e){for(;e&&(e=e.parentNode);)if(e===t)return!0;return!1},T.type=t,T.isFunction=e,T.isWindow=n,T.isArray=Y,T.isPlainObject=o,T.isEmptyObject=function(t){var e;for(e in t)return!1;return!0},T.inArray=function(t,e,n){return N.indexOf.call(e,t,n)},T.camelCase=C,T.trim=function(t){return null==t?"":String.prototype.trim.call(t)},T.uuid=0,T.support={},T.expr={},T.map=function(t,e){var n,r,i,o=[];if(a(t))for(r=0;r<t.length;r++)n=e(t[r],r),null!=n&&o.push(n);else for(i in t)n=e(t[i],i),null!=n&&o.push(n);return u(o)},T.each=function(t,e){var n,r;if(a(t)){for(n=0;n<t.length;n++)if(e.call(t[n],n,t[n])===!1)return t}else for(r in t)if(e.call(t[r],r,t[r])===!1)return t;return t},T.grep=function(t,e){return A.call(t,e)},window.JSON&&(T.parseJSON=JSON.parse),T.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(t,e){X["[object "+e+"]"]=e.toLowerCase()}),T.fn={forEach:N.forEach,reduce:N.reduce,push:N.push,sort:N.sort,indexOf:N.indexOf,concat:N.concat,map:function(t){return T(T.map(this,function(e,n){return t.call(e,n,e)}))},slice:function(){return T(O.apply(this,arguments))},ready:function(t){return z.test(_.readyState)&&_.body?t(T):_.addEventListener("DOMContentLoaded",function(){t(T)},!1),this},get:function(t){return t===w?O.call(this):this[t>=0?t:t+this.length]},toArray:function(){return this.get()},size:function(){return this.length},remove:function(){return this.each(function(){null!=this.parentNode&&this.parentNode.removeChild(this)})},each:function(t){return N.every.call(this,function(e,n){return t.call(e,n,e)!==!1}),this},filter:function(t){return e(t)?this.not(this.not(t)):T(A.call(this,function(e){return G.matches(e,t)}))},add:function(t,e){return T(S(this.concat(T(t,e))))},is:function(t){return this.length>0&&G.matches(this[0],t)},not:function(t){var n=[];if(e(t)&&t.call!==w)this.each(function(e){t.call(this,e)||n.push(this)});else{var r="string"==typeof t?this.filter(t):a(t)&&e(t.item)?O.call(t):T(t);this.forEach(function(t){r.indexOf(t)<0&&n.push(t)})}return T(n)},has:function(t){return this.filter(function(){return i(t)?T.contains(this,t):T(this).find(t).size()})},eq:function(t){return-1===t?this.slice(t):this.slice(t,+t+1)},first:function(){var t=this[0];return t&&!i(t)?t:T(t)},last:function(){var t=this[this.length-1];return t&&!i(t)?t:T(t)},find:function(t){var e,n=this;return e=t?"object"==typeof t?T(t).filter(function(){var t=this;return N.some.call(n,function(e){return T.contains(e,t)})}):1==this.length?T(G.qsa(this[0],t)):this.map(function(){return G.qsa(this,t)}):[]},closest:function(t,e){var n=this[0],i=!1;for("object"==typeof t&&(i=T(t));n&&!(i?i.indexOf(n)>=0:G.matches(n,t));)n=n!==e&&!r(n)&&n.parentNode;return T(n)},parents:function(t){for(var e=[],n=this;n.length>0;)n=T.map(n,function(t){return(t=t.parentNode)&&!r(t)&&e.indexOf(t)<0?(e.push(t),t):void 0});return v(e,t)},parent:function(t){return v(S(this.pluck("parentNode")),t)},children:function(t){return v(this.map(function(){return p(this)}),t)},contents:function(){return this.map(function(){return O.call(this.childNodes)})},siblings:function(t){return v(this.map(function(t,e){return A.call(p(e.parentNode),function(t){return t!==e})}),t)},empty:function(){return this.each(function(){this.innerHTML=""})},pluck:function(t){return T.map(this,function(e){return e[t]})},show:function(){return this.each(function(){"none"==this.style.display&&(this.style.display=""),"none"==getComputedStyle(this,"").getPropertyValue("display")&&(this.style.display=h(this.nodeName))})},replaceWith:function(t){return this.before(t).remove()},wrap:function(t){var n=e(t);if(this[0]&&!n)var r=T(t).get(0),i=r.parentNode||this.length>1;return this.each(function(e){T(this).wrapAll(n?t.call(this,e):i?r.cloneNode(!0):r)})},wrapAll:function(t){if(this[0]){T(this[0]).before(t=T(t));for(var e;(e=t.children()).length;)t=e.first();T(t).append(this)}return this},wrapInner:function(t){var n=e(t);return this.each(function(e){var r=T(this),i=r.contents(),o=n?t.call(this,e):t;i.length?i.wrapAll(o):r.append(o)})},unwrap:function(){return this.parent().each(function(){T(this).replaceWith(T(this).children())}),this},clone:function(){return this.map(function(){return this.cloneNode(!0)})},hide:function(){return this.css("display","none")},toggle:function(t){return this.each(function(){var e=T(this);(t===w?"none"==e.css("display"):t)?e.show():e.hide()})},prev:function(t){return T(this.pluck("previousElementSibling")).filter(t||"*")},next:function(t){return T(this.pluck("nextElementSibling")).filter(t||"*")},html:function(t){return 0 in arguments?this.each(function(e){var n=this.innerHTML;T(this).empty().append(m(this,t,e,n))}):0 in this?this[0].innerHTML:null},text:function(t){return 0 in arguments?this.each(function(e){var n=m(this,t,e,this.textContent);this.textContent=null==n?"":""+n}):0 in this?this[0].textContent:null},attr:function(t,e){var n;return"string"!=typeof t||1 in arguments?this.each(function(n){if(1===this.nodeType)if(i(t))for(E in t)g(this,E,t[E]);else g(this,t,m(this,e,n,this.getAttribute(t)))}):this.length&&1===this[0].nodeType?!(n=this[0].getAttribute(t))&&t in this[0]?this[0][t]:n:w},removeAttr:function(t){return this.each(function(){1===this.nodeType&&g(this,t)})},prop:function(t,e){return t=W[t]||t,1 in arguments?this.each(function(n){this[t]=m(this,e,n,this[t])}):this[0]&&this[0][t]},data:function(t,e){var n="data-"+t.replace(Z,"-$1").toLowerCase(),r=1 in arguments?this.attr(n,e):this.attr(n);return null!==r?x(r):w},val:function(t){return 0 in arguments?this.each(function(e){this.value=m(this,t,e,this.value)}):this[0]&&(this[0].multiple?T(this[0]).find("option").filter(function(){return this.selected}).pluck("value"):this[0].value)},offset:function(t){if(t)return this.each(function(e){var n=T(this),r=m(this,t,e,n.offset()),i=n.offsetParent().offset(),o={top:r.top-i.top,left:r.left-i.left};"static"==n.css("position")&&(o.position="relative"),n.css(o)});if(!this.length)return null;var e=this[0].getBoundingClientRect();return{left:e.left+window.pageXOffset,top:e.top+window.pageYOffset,width:Math.round(e.width),height:Math.round(e.height)}},css:function(e,n){if(arguments.length<2){var r=this[0],i=getComputedStyle(r,"");if(!r)return;if("string"==typeof e)return r.style[C(e)]||i.getPropertyValue(e);if(Y(e)){var o={};return T.each(Y(e)?e:[e],function(t,e){o[e]=r.style[C(e)]||i.getPropertyValue(e)}),o}}var a="";if("string"==t(e))n||0===n?a=c(e)+":"+f(e,n):this.each(function(){this.style.removeProperty(c(e))});else for(E in e)e[E]||0===e[E]?a+=c(E)+":"+f(E,e[E])+";":this.each(function(){this.style.removeProperty(c(E))});return this.each(function(){this.style.cssText+=";"+a})},index:function(t){return t?this.indexOf(T(t)[0]):this.parent().children().indexOf(this[0])},hasClass:function(t){return t?N.some.call(this,function(t){return this.test(y(t))},l(t)):!1},addClass:function(t){return t?this.each(function(e){j=[];var n=y(this),r=m(this,t,e,n);r.split(/\s+/g).forEach(function(t){T(this).hasClass(t)||j.push(t)},this),j.length&&y(this,n+(n?" ":"")+j.join(" "))}):this},removeClass:function(t){return this.each(function(e){return t===w?y(this,""):(j=y(this),m(this,t,e,j).split(/\s+/g).forEach(function(t){j=j.replace(l(t)," ")}),void y(this,j.trim()))})},toggleClass:function(t,e){return t?this.each(function(n){var r=T(this),i=m(this,t,n,y(this));i.split(/\s+/g).forEach(function(t){(e===w?!r.hasClass(t):e)?r.addClass(t):r.removeClass(t)})}):this},scrollTop:function(t){if(this.length){var e="scrollTop"in this[0];return t===w?e?this[0].scrollTop:this[0].pageYOffset:this.each(e?function(){this.scrollTop=t}:function(){this.scrollTo(this.scrollX,t)})}},scrollLeft:function(t){if(this.length){var e="scrollLeft"in this[0];return t===w?e?this[0].scrollLeft:this[0].pageXOffset:this.each(e?function(){this.scrollLeft=t}:function(){this.scrollTo(t,this.scrollY)})}},position:function(){if(this.length){var t=this[0],e=this.offsetParent(),n=this.offset(),r=R.test(e[0].nodeName)?{top:0,left:0}:e.offset();return n.top-=parseFloat(T(t).css("margin-top"))||0,n.left-=parseFloat(T(t).css("margin-left"))||0,r.top+=parseFloat(T(e[0]).css("border-top-width"))||0,r.left+=parseFloat(T(e[0]).css("border-left-width"))||0,{top:n.top-r.top,left:n.left-r.left}}},offsetParent:function(){return this.map(function(){for(var t=this.offsetParent||_.body;t&&!R.test(t.nodeName)&&"static"==T(t).css("position");)t=t.offsetParent;return t})}},T.fn.detach=T.fn.remove,["width","height"].forEach(function(t){var e=t.replace(/./,function(t){return t[0].toUpperCase()});T.fn[t]=function(i){var o,a=this[0];return i===w?n(a)?a["inner"+e]:r(a)?a.documentElement["scroll"+e]:(o=this.offset())&&o[t]:this.each(function(e){a=T(this),a.css(t,m(this,i,e,a[t]()))})}}),M.forEach(function(e,n){var r=n%2;T.fn[e]=function(){var e,i,o=T.map(arguments,function(n){return e=t(n),"object"==e||"array"==e||null==n?n:G.fragment(n)}),a=this.length>1;return o.length<1?this:this.each(function(t,e){i=r?e:e.parentNode,e=0==n?e.nextSibling:1==n?e.firstChild:2==n?e:null;var s=T.contains(_.documentElement,i);o.forEach(function(t){if(a)t=t.cloneNode(!0);else if(!i)return T(t).remove();i.insertBefore(t,e),s&&b(t,function(t){null==t.nodeName||"SCRIPT"!==t.nodeName.toUpperCase()||t.type&&"text/javascript"!==t.type||t.src||window.eval.call(window,t.innerHTML)})})})},T.fn[r?e+"To":"insert"+(n?"Before":"After")]=function(t){return T(t)[e](this),this}}),G.Z.prototype=T.fn,G.uniq=S,G.deserializeValue=x,T.zepto=G,T}();window.Zepto=Zepto,void 0===window.$&&(window.$=Zepto),function(t){function e(t){return t._zid||(t._zid=h++)}function n(t,n,o,a){if(n=r(n),n.ns)var s=i(n.ns);return(m[e(t)]||[]).filter(function(t){return!(!t||n.e&&t.e!=n.e||n.ns&&!s.test(t.ns)||o&&e(t.fn)!==e(o)||a&&t.sel!=a)})}function r(t){var e=(""+t).split(".");return{e:e[0],ns:e.slice(1).sort().join(" ")}}function i(t){return new RegExp("(?:^| )"+t.replace(" "," .* ?")+"(?: |$)")}function o(t,e){return t.del&&!y&&t.e in x||!!e}function a(t){return b[t]||y&&x[t]||t}function s(n,i,s,u,l,h,p){var d=e(n),v=m[d]||(m[d]=[]);i.split(/\s/).forEach(function(e){if("ready"==e)return t(document).ready(s);var i=r(e);i.fn=s,i.sel=l,i.e in b&&(s=function(e){var n=e.relatedTarget;return!n||n!==this&&!t.contains(this,n)?i.fn.apply(this,arguments):void 0}),i.del=h;var d=h||s;i.proxy=function(t){if(t=c(t),!t.isImmediatePropagationStopped()){t.data=u;var e=d.apply(n,t._args==f?[t]:[t].concat(t._args));return e===!1&&(t.preventDefault(),t.stopPropagation()),e}},i.i=v.length,v.push(i),"addEventListener"in n&&n.addEventListener(a(i.e),i.proxy,o(i,p))})}function u(t,r,i,s,u){var c=e(t);(r||"").split(/\s/).forEach(function(e){n(t,e,i,s).forEach(function(e){delete m[c][e.i],"removeEventListener"in t&&t.removeEventListener(a(e.e),e.proxy,o(e,u))})})}function c(e,n){return(n||!e.isDefaultPrevented)&&(n||(n=e),t.each(j,function(t,r){var i=n[t];e[t]=function(){return this[r]=w,i&&i.apply(n,arguments)},e[r]=E}),(n.defaultPrevented!==f?n.defaultPrevented:"returnValue"in n?n.returnValue===!1:n.getPreventDefault&&n.getPreventDefault())&&(e.isDefaultPrevented=w)),e}function l(t){var e,n={originalEvent:t};for(e in t)T.test(e)||t[e]===f||(n[e]=t[e]);return c(n,t)}var f,h=1,p=Array.prototype.slice,d=t.isFunction,v=function(t){return"string"==typeof t},m={},g={},y="onfocusin"in window,x={focus:"focusin",blur:"focusout"},b={mouseenter:"mouseover",mouseleave:"mouseout"};g.click=g.mousedown=g.mouseup=g.mousemove="MouseEvents",t.event={add:s,remove:u},t.proxy=function(n,r){var i=2 in arguments&&p.call(arguments,2);if(d(n)){var o=function(){return n.apply(r,i?i.concat(p.call(arguments)):arguments)};return o._zid=e(n),o}if(v(r))return i?(i.unshift(n[r],n),t.proxy.apply(null,i)):t.proxy(n[r],n);throw new TypeError("expected function")},t.fn.bind=function(t,e,n){return this.on(t,e,n)},t.fn.unbind=function(t,e){return this.off(t,e)},t.fn.one=function(t,e,n,r){return this.on(t,e,n,r,1)};var w=function(){return!0},E=function(){return!1},T=/^([A-Z]|returnValue$|layer[XY]$)/,j={preventDefault:"isDefaultPrevented",stopImmediatePropagation:"isImmediatePropagationStopped",stopPropagation:"isPropagationStopped"};t.fn.delegate=function(t,e,n){return this.on(e,t,n)},t.fn.undelegate=function(t,e,n){return this.off(e,t,n)},t.fn.live=function(e,n){return t(document.body).delegate(this.selector,e,n),this},t.fn.die=function(e,n){return t(document.body).undelegate(this.selector,e,n),this},t.fn.on=function(e,n,r,i,o){var a,c,h=this;return e&&!v(e)?(t.each(e,function(t,e){h.on(t,n,r,e,o)}),h):(v(n)||d(i)||i===!1||(i=r,r=n,n=f),(d(r)||r===!1)&&(i=r,r=f),i===!1&&(i=E),h.each(function(f,h){o&&(a=function(t){return u(h,t.type,i),i.apply(this,arguments)}),n&&(c=function(e){var r,o=t(e.target).closest(n,h).get(0);return o&&o!==h?(r=t.extend(l(e),{currentTarget:o,liveFired:h}),(a||i).apply(o,[r].concat(p.call(arguments,1)))):void 0}),s(h,e,i,r,n,c||a)}))},t.fn.off=function(e,n,r){var i=this;return e&&!v(e)?(t.each(e,function(t,e){i.off(t,n,e)}),i):(v(n)||d(r)||r===!1||(r=n,n=f),r===!1&&(r=E),i.each(function(){u(this,e,r,n)}))},t.fn.trigger=function(e,n){return e=v(e)||t.isPlainObject(e)?t.Event(e):c(e),e._args=n,this.each(function(){"dispatchEvent"in this?this.dispatchEvent(e):t(this).triggerHandler(e,n)})},t.fn.triggerHandler=function(e,r){var i,o;return this.each(function(a,s){i=l(v(e)?t.Event(e):e),i._args=r,i.target=s,t.each(n(s,e.type||e),function(t,e){return o=e.proxy(i),i.isImmediatePropagationStopped()?!1:void 0})}),o},"focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(e){t.fn[e]=function(t){return t?this.bind(e,t):this.trigger(e)}}),["focus","blur"].forEach(function(e){t.fn[e]=function(t){return t?this.bind(e,t):this.each(function(){try{this[e]()}catch(t){}}),this}}),t.Event=function(t,e){v(t)||(e=t,t=e.type);var n=document.createEvent(g[t]||"Events"),r=!0;if(e)for(var i in e)"bubbles"==i?r=!!e[i]:n[i]=e[i];return n.initEvent(t,r,!0),c(n)}}(Zepto),function(t){function e(e,n,r){var i=t.Event(n);return t(e).trigger(i,r),!i.isDefaultPrevented()}function n(t,n,r,i){return t.global?e(n||y,r,i):void 0}function r(e){e.global&&0===t.active++&&n(e,null,"ajaxStart")}function i(e){e.global&&!--t.active&&n(e,null,"ajaxStop")}function o(t,e){var r=e.context;return e.beforeSend.call(r,t,e)===!1||n(e,r,"ajaxBeforeSend",[t,e])===!1?!1:void n(e,r,"ajaxSend",[t,e])}function a(t,e,r,i){var o=r.context,a="success";r.success.call(o,t,a,e),i&&i.resolveWith(o,[t,a,e]),n(r,o,"ajaxSuccess",[e,r,t]),u(a,e,r)}function s(t,e,r,i,o){var a=i.context;i.error.call(a,r,e,t),o&&o.rejectWith(a,[r,e,t]),n(i,a,"ajaxError",[r,i,t||e]),u(e,r,i)}function u(t,e,r){var o=r.context;r.complete.call(o,e,t),n(r,o,"ajaxComplete",[e,r]),i(r)}function c(){}function l(t){return t&&(t=t.split(";",2)[0]),t&&(t==T?"html":t==E?"json":b.test(t)?"script":w.test(t)&&"xml")||"text"}function f(t,e){return""==e?t:(t+"&"+e).replace(/[&?]{1,2}/,"?")}function h(e){e.processData&&e.data&&"string"!=t.type(e.data)&&(e.data=t.param(e.data,e.traditional)),!e.data||e.type&&"GET"!=e.type.toUpperCase()||(e.url=f(e.url,e.data),e.data=void 0)}function p(e,n,r,i){return t.isFunction(n)&&(i=r,r=n,n=void 0),t.isFunction(r)||(i=r,r=void 0),{url:e,data:n,success:r,dataType:i}}function d(e,n,r,i){var o,a=t.isArray(n),s=t.isPlainObject(n);t.each(n,function(n,u){o=t.type(u),i&&(n=r?i:i+"["+(s||"object"==o||"array"==o?n:"")+"]"),!i&&a?e.add(u.name,u.value):"array"==o||!r&&"object"==o?d(e,u,r,n):e.add(n,u)})}var v,m,g=0,y=window.document,x=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,b=/^(?:text|application)\/javascript/i,w=/^(?:text|application)\/xml/i,E="application/json",T="text/html",j=/^\s*$/;t.active=0,t.ajaxJSONP=function(e,n){if(!("type"in e))return t.ajax(e);var r,i,u=e.jsonpCallback,c=(t.isFunction(u)?u():u)||"jsonp"+ ++g,l=y.createElement("script"),f=window[c],h=function(e){t(l).triggerHandler("error",e||"abort")},p={abort:h};return n&&n.promise(p),t(l).on("load error",function(o,u){clearTimeout(i),t(l).off().remove(),"error"!=o.type&&r?a(r[0],p,e,n):s(null,u||"error",p,e,n),window[c]=f,r&&t.isFunction(f)&&f(r[0]),f=r=void 0}),o(p,e)===!1?(h("abort"),p):(window[c]=function(){r=arguments},l.src=e.url.replace(/\?(.+)=\?/,"?$1="+c),y.head.appendChild(l),e.timeout>0&&(i=setTimeout(function(){h("timeout")},e.timeout)),p)},t.ajaxSettings={type:"GET",beforeSend:c,success:c,error:c,complete:c,context:null,global:!0,xhr:function(){return new window.XMLHttpRequest},accepts:{script:"text/javascript, application/javascript, application/x-javascript",json:E,xml:"application/xml, text/xml",html:T,text:"text/plain"},crossDomain:!1,timeout:0,processData:!0,cache:!0},t.ajax=function(e){var n=t.extend({},e||{}),i=t.Deferred&&t.Deferred();for(v in t.ajaxSettings)void 0===n[v]&&(n[v]=t.ajaxSettings[v]);r(n),n.crossDomain||(n.crossDomain=/^([\w-]+:)?\/\/([^\/]+)/.test(n.url)&&RegExp.$2!=window.location.host),n.url||(n.url=window.location.toString()),h(n);var u=n.dataType,p=/\?.+=\?/.test(n.url);if(p&&(u="jsonp"),n.cache!==!1&&(e&&e.cache===!0||"script"!=u&&"jsonp"!=u)||(n.url=f(n.url,"_="+Date.now())),"jsonp"==u)return p||(n.url=f(n.url,n.jsonp?n.jsonp+"=?":n.jsonp===!1?"":"callback=?")),t.ajaxJSONP(n,i);var d,g=n.accepts[u],y={},x=function(t,e){y[t.toLowerCase()]=[t,e]},b=/^([\w-]+:)\/\//.test(n.url)?RegExp.$1:window.location.protocol,w=n.xhr(),E=w.setRequestHeader;if(i&&i.promise(w),n.crossDomain||x("X-Requested-With","XMLHttpRequest"),x("Accept",g||"*/*"),(g=n.mimeType||g)&&(g.indexOf(",")>-1&&(g=g.split(",",2)[0]),w.overrideMimeType&&w.overrideMimeType(g)),(n.contentType||n.contentType!==!1&&n.data&&"GET"!=n.type.toUpperCase())&&x("Content-Type",n.contentType||"application/x-www-form-urlencoded"),n.headers)for(m in n.headers)x(m,n.headers[m]);if(w.setRequestHeader=x,w.onreadystatechange=function(){if(4==w.readyState){w.onreadystatechange=c,clearTimeout(d);var e,r=!1;if(w.status>=200&&w.status<300||304==w.status||0==w.status&&"file:"==b){u=u||l(n.mimeType||w.getResponseHeader("content-type")),e=w.responseText;try{"script"==u?(1,eval)(e):"xml"==u?e=w.responseXML:"json"==u&&(e=j.test(e)?null:t.parseJSON(e))}catch(o){r=o}r?s(r,"parsererror",w,n,i):a(e,w,n,i)}else s(w.statusText||null,w.status?"error":"abort",w,n,i)}},o(w,n)===!1)return w.abort(),s(null,"abort",w,n,i),w;if(n.xhrFields)for(m in n.xhrFields)w[m]=n.xhrFields[m];var T="async"in n?n.async:!0;w.open(n.type,n.url,T,n.username,n.password);for(m in y)E.apply(w,y[m]);return n.timeout>0&&(d=setTimeout(function(){w.onreadystatechange=c,w.abort(),s(null,"timeout",w,n,i)},n.timeout)),w.send(n.data?n.data:null),w},t.get=function(){return t.ajax(p.apply(null,arguments))},t.post=function(){var e=p.apply(null,arguments);return e.type="POST",t.ajax(e)},t.getJSON=function(){var e=p.apply(null,arguments);return e.dataType="json",t.ajax(e)},t.fn.load=function(e,n,r){if(!this.length)return this;var i,o=this,a=e.split(/\s/),s=p(e,n,r),u=s.success;return a.length>1&&(s.url=a[0],i=a[1]),s.success=function(e){o.html(i?t("<div>").html(e.replace(x,"")).find(i):e),u&&u.apply(o,arguments)},t.ajax(s),this};var C=encodeURIComponent;t.param=function(t,e){var n=[];return n.add=function(t,e){this.push(C(t)+"="+C(e))},d(n,t,e),n.join("&").replace(/%20/g,"+")}}(Zepto),function(t){t.fn.serializeArray=function(){var e,n=[];return t([].slice.call(this.get(0).elements)).each(function(){e=t(this);var r=e.attr("type");"fieldset"!=this.nodeName.toLowerCase()&&!this.disabled&&"submit"!=r&&"reset"!=r&&"button"!=r&&("radio"!=r&&"checkbox"!=r||this.checked)&&n.push({name:e.attr("name"),value:e.val()})}),n},t.fn.serialize=function(){var t=[];return this.serializeArray().forEach(function(e){t.push(encodeURIComponent(e.name)+"="+encodeURIComponent(e.value))}),t.join("&")},t.fn.submit=function(e){if(e)this.bind("submit",e);else if(this.length){var n=t.Event("submit");this.eq(0).trigger(n),n.isDefaultPrevented()||this.get(0).submit()}return this}}(Zepto),function(t){"__proto__"in{}||t.extend(t.zepto,{Z:function(e,n){return e=e||[],t.extend(e,t.fn),e.selector=n||"",e.__Z=!0,e},isZ:function(e){return"array"===t.type(e)&&"__Z"in e}});try{getComputedStyle(void 0)}catch(e){var n=getComputedStyle;window.getComputedStyle=function(t){try{return n(t)}catch(e){return null}}}}(Zepto),!function(t,e){function n(t){return function(e){return{}.toString.call(e)=="[object "+t+"]"}}function r(){return C++}function i(t){return t.match(O)[0]}function o(t){for(t=t.replace(A,"/"),t=t.replace(D,"$1/");t.match(_);)t=t.replace(_,"/");return t}function a(t){var e=t.length-1,n=t.charAt(e);return"#"===n?t.substring(0,e):".js"===t.substring(e-2)||t.indexOf("?")>0||"/"===n?t:t+".js"}function s(t){var e=b.alias;return e&&E(e[t])?e[t]:t}function u(t){var e,n=b.paths;return n&&(e=t.match(P))&&E(n[e[1]])&&(t=n[e[1]]+e[2]),t}function c(t){var e=b.vars;return e&&t.indexOf("{")>-1&&(t=t.replace(L,function(t,n){return E(e[n])?e[n]:t})),t}function l(t){var e=b.map,n=t;if(e)for(var r=0,i=e.length;i>r;r++){var o=e[r];if(n=j(o)?o(t)||t:t.replace(o[0],o[1]),n!==t)break}return n}function f(t,e){var n,r=t.charAt(0);if($.test(t))n=t;else if("."===r)n=o((e?i(e):b.cwd)+t);else if("/"===r){var a=b.cwd.match(q);n=a?a[0]+t.substring(1):t}else n=b.base+t;return 0===n.indexOf("//")&&(n=location.protocol+n),n}function h(t,e){if(!t)return"";t=s(t),t=u(t),t=c(t),t=a(t);var n=f(t,e);return n=l(n)}function p(t){return t.hasAttribute?t.src:t.getAttribute("src",4)}function d(t,e,n){var r=k.createElement("script");if(n){var i=j(n)?n(t):n;i&&(r.charset=i)}v(r,e,t),r.async=!0,r.src=t,F=r,z?H.insertBefore(r,z):H.appendChild(r),F=null}function v(t,e,n){function r(){t.onload=t.onerror=t.onreadystatechange=null,b.debug||H.removeChild(t),t=null,e()}var i="onload"in t;i?(t.onload=r,t.onerror=function(){N("error",{uri:n,node:t}),r()}):t.onreadystatechange=function(){/loaded|complete/.test(t.readyState)&&r()}}function m(){if(F)return F;if(U&&"interactive"===U.readyState)return U;for(var t=H.getElementsByTagName("script"),e=t.length-1;e>=0;e--){var n=t[e];if("interactive"===n.readyState)return U=n}}function g(t){var e=[];return t.replace(V,"").replace(X,function(t,n,r){r&&e.push(r)}),e}function y(t,e){this.uri=t,this.dependencies=e||[],this.exports=null,this.status=0,this._waitings={},this._remain=0}if(!t.seajs){var x=t.seajs={version:"2.3.0"},b=x.data={},w=n("Object"),E=n("String"),T=Array.isArray||n("Array"),j=n("Function"),C=0,S=b.events={};x.on=function(t,e){var n=S[t]||(S[t]=[]);return n.push(e),x},x.off=function(t,e){if(!t&&!e)return S=b.events={},x;var n=S[t];if(n)if(e)for(var r=n.length-1;r>=0;r--)n[r]===e&&n.splice(r,1);else delete S[t];return x};var N=x.emit=function(t,e){var n=S[t];if(n){n=n.slice();for(var r=0,i=n.length;i>r;r++)n[r](e)}return x},O=/[^?#]*\//,A=/\/\.\//g,_=/\/[^/]+\/\.\.\//,D=/([^:/])\/+\//g,P=/^([^/:]+)(\/.+)$/,L=/{([^{]+)}/g,$=/^\/\/.|:\//,q=/^.*?\/\/.*?\//,k=document,R=location.href&&0!==location.href.indexOf("about:")?i(location.href):"",Z=k.scripts,I=k.getElementById("seajsnode")||Z[Z.length-1],M=i(p(I)||R);x.resolve=h;var F,U,H=k.head||k.getElementsByTagName("head")[0]||k.documentElement,z=H.getElementsByTagName("base")[0];x.request=d;var B,X=/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g,V=/\\\\/g,G=x.cache={},J={},W={},Y={},K=y.STATUS={FETCHING:1,SAVED:2,LOADING:3,LOADED:4,EXECUTING:5,EXECUTED:6};y.prototype.resolve=function(){for(var t=this,e=t.dependencies,n=[],r=0,i=e.length;i>r;r++)n[r]=y.resolve(e[r],t.uri);return n},y.prototype.load=function(){var t=this;if(!(t.status>=K.LOADING)){t.status=K.LOADING;var n=t.resolve();N("load",n);for(var r,i=t._remain=n.length,o=0;i>o;o++)r=y.get(n[o]),r.status<K.LOADED?r._waitings[t.uri]=(r._waitings[t.uri]||0)+1:t._remain--;if(0===t._remain)return t.onload(),e;var a={};for(o=0;i>o;o++)r=G[n[o]],r.status<K.FETCHING?r.fetch(a):r.status===K.SAVED&&r.load();for(var s in a)a.hasOwnProperty(s)&&a[s]()}},y.prototype.onload=function(){var t=this;t.status=K.LOADED,t.callback&&t.callback();var e,n,r=t._waitings;for(e in r)r.hasOwnProperty(e)&&(n=G[e],n._remain-=r[e],0===n._remain&&n.onload());delete t._waitings,delete t._remain},y.prototype.fetch=function(t){function n(){x.request(a.requestUri,a.onRequest,a.charset)}function r(){delete J[s],W[s]=!0,B&&(y.save(o,B),B=null);var t,e=Y[s];for(delete Y[s];t=e.shift();)t.load()}var i=this,o=i.uri;i.status=K.FETCHING;var a={uri:o};N("fetch",a);var s=a.requestUri||o;return!s||W[s]?(i.load(),e):J[s]?(Y[s].push(i),e):(J[s]=!0,Y[s]=[i],N("request",a={uri:o,requestUri:s,onRequest:r,charset:b.charset}),a.requested||(t?t[a.requestUri]=n:n()),e)},y.prototype.exec=function(){function t(e){return y.get(t.resolve(e)).exec()}var n=this;if(n.status>=K.EXECUTING)return n.exports;n.status=K.EXECUTING;var i=n.uri;t.resolve=function(t){return y.resolve(t,i)},t.async=function(e,n){return y.use(e,n,i+"_async_"+r()),t};var o=n.factory,a=j(o)?o(t,n.exports={},n):o;return a===e&&(a=n.exports),delete n.factory,n.exports=a,n.status=K.EXECUTED,N("exec",n),a},y.resolve=function(t,e){var n={id:t,refUri:e};return N("resolve",n),n.uri||x.resolve(n.id,e)},y.define=function(t,n,r){var i=arguments.length;1===i?(r=t,t=e):2===i&&(r=n,T(t)?(n=t,t=e):n=e),!T(n)&&j(r)&&(n=g(""+r));var o={id:t,uri:y.resolve(t),deps:n,factory:r};if(!o.uri&&k.attachEvent){var a=m();a&&(o.uri=a.src)}N("define",o),o.uri?y.save(o.uri,o):B=o},y.save=function(t,e){var n=y.get(t);n.status<K.SAVED&&(n.id=e.id||t,n.dependencies=e.deps||[],n.factory=e.factory,n.status=K.SAVED,N("save",n))},y.get=function(t,e){return G[t]||(G[t]=new y(t,e))},y.use=function(e,n,r){var i=y.get(r,T(e)?e:[e]);i.callback=function(){for(var e=[],r=i.resolve(),o=0,a=r.length;a>o;o++)e[o]=G[r[o]].exec();n&&n.apply(t,e),delete i.callback},i.load()},x.use=function(t,e){return y.use(t,e,b.cwd+"_use_"+r()),x},y.define.cmd={},t.define=y.define,x.Module=y,b.fetchedList=W,b.cid=r,x.require=function(t){var e=y.get(y.resolve(t));return e.status<K.EXECUTING&&(e.onload(),e.exec()),e.exports},b.base=M,b.dir=M,b.cwd=R,b.charset="utf-8",x.config=function(t){for(var e in t){var n=t[e],r=b[e];if(r&&w(r))for(var i in n)r[i]=n[i];else T(r)?n=r.concat(n):"base"===e&&("/"!==n.slice(-1)&&(n+="/"),n=f(n)),b[e]=n}return N("config",t),x}}}(this);var X={};!function(){X.txTpl=function(){var t={};return function(e,n,r,i,o){function a(t){var e=navigator.userAgent.toLowerCase(),n=document.getElementsByTagName("head")[0],r=document.createElement("script");return e.indexOf("gecko")>-1&&-1==e.indexOf("khtml")?void window.eval.call(window,y):(r.innerHTML=t,n.appendChild(r),void n.removeChild(r))}var s,u=n,c=[],o=void 0!=o?o:!0;if(o&&t[e]){for(var l=0,f=t[e].propList,h=f.length;h>l;l++)c.push(u[f[l]]);s=t[e].parsefn}else{var p=[],d=function(t,e,n){if(!e)var e="<%";if(!n)var n="%>";var r=0==/[^\w\d_:\.-]/g.test(t)?document.getElementById(t).innerHTML:t;return r.replace(/\\/g,"\\\\").replace(/[\r\t\n]/g," ").split(e).join("	").replace(new RegExp("((^|"+n+")[^	]*)'","g"),"$1\r").replace(new RegExp("	=(.*?)"+n,"g"),"';\n s+=$1;\n s+='").split("	").join("';\n").split(n).join("\n s+='").split("\r").join("\\'")}(e,r,i);for(var v in u)p.push(v),c.push(u[v]);s=new Function(p," var s='';\n s+='"+d+"';\n return s"),o&&(t[e]={parsefn:s,propList:p})}try{return s.apply(null,c)}catch(m){var g="txTpl"+(new Date).getTime(),y="var "+g+"="+s.toString();
a(y),window[g].apply(null,c)}}}()}();var Auto={};!function(){Auto.Boss=function(){}}();