(function(a,b){var c=a.define,d,e,b;(function(a){function n(a,b){var c,d,e,f,g,h,i,j,l,m,n=b&&b.split("/"),o=k.map,p=o&&o["*"]||{};if(a&&a.charAt(0)==="."&&b){n=n.slice(0,n.length-1),a=n.concat(a.split("/"));for(j=0;j<a.length;j+=1){m=a[j];if(m===".")a.splice(j,1),j-=1;else if(m===".."){if(j===1&&(a[2]===".."||a[0]===".."))break;j>0&&(a.splice(j-1,2),j-=2)}}a=a.join("/")}if((n||p)&&o){c=a.split("/");for(j=c.length;j>0;j-=1){d=c.slice(0,j).join("/");if(n)for(l=n.length;l>0;l-=1){e=o[n.slice(0,l).join("/")];if(e){e=e[d];if(e){f=e,g=j;break}}}if(f)break;!h&&p&&p[d]&&(h=p[d],i=j)}!f&&h&&(f=h,g=i),f&&(c.splice(0,g,f),a=c.join("/"))}return a}function o(b,c){return function(){return f.apply(a,m.call(arguments,0).concat([b,c]))}}function p(a){return function(b){return n(b,a)}}function q(a){return function(b){i[a]=b}}function r(b){if(j.hasOwnProperty(b)){var d=j[b];delete j[b],l[b]=!0,c.apply(a,d)}if(!i.hasOwnProperty(b)&&!l.hasOwnProperty(b))throw new Error("No "+b);return i[b]}function s(a){var b,c=a?a.indexOf("!"):-1;return c>-1&&(b=a.substring(0,c),a=a.substring(c+1,a.length)),[b,a]}function t(a){return function(){return k&&k.config&&k.config[a]||{}}}var c,f,g,h,i={},j={},k={},l={},m=[].slice;g=function(a,b){var c,d=s(a),e=d[0];return a=d[1],e&&(e=n(e,b),c=r(e)),e?c&&c.normalize?a=c.normalize(a,p(b)):a=n(a,b):(a=n(a,b),d=s(a),e=d[0],a=d[1],e&&(c=r(e))),{f:e?e+"!"+a:a,n:a,pr:e,p:c}},h={require:function(a){return o(a)},exports:function(a){var b=i[a];return typeof b!="undefined"?b:i[a]={}},module:function(a){return{id:a,uri:"",exports:i[a],config:t(a)}}},c=function(b,c,d,e){var f,k,m,n,p,s=[],t;e=e||b;if(typeof d=="function"){c=!c.length&&d.length?["require","exports","module"]:c;for(p=0;p<c.length;p+=1){n=g(c[p],e),k=n.f;if(k==="require")s[p]=h.require(b);else if(k==="exports")s[p]=h.exports(b),t=!0;else if(k==="module")f=s[p]=h.module(b);else if(i.hasOwnProperty(k)||j.hasOwnProperty(k)||l.hasOwnProperty(k))s[p]=r(k);else{if(!n.p)throw new Error(b+" missing "+k);n.p.load(n.n,o(e,!0),q(k),{}),s[p]=i[k]}}m=d.apply(i[b],s);if(b)if(f&&f.exports!==a&&f.exports!==i[b])i[b]=f.exports;else if(m!==a||!t)i[b]=m}else b&&(i[b]=d)},d=e=f=function(b,d,e,i,j){return typeof b=="string"?h[b]?h[b](d):r(g(b,d).f):(b.splice||(k=b,d.splice?(b=d,d=e,e=null):b=a),d=d||function(){},typeof e=="function"&&(e=i,i=j),i?c(a,b,d,e):setTimeout(function(){c(a,b,d,e)},15),f)},f.config=function(a){return k=a,f},b=function(a,b,c){b.splice||(c=b,b=[]),j[a]=[a,b,c]},b.amd={jQuery:!0}})(),b("../node_modules/almond/almond",function(){}),b("wings/Emitter",["require","exports","module"],function(a,b,c){var d=function(){this.callbacks={}};return d.prototype.on=function(a,b){a instanceof Array||(a=[a]);for(var c=0,d=a.length;c<d;c++)(this.callbacks[a[c]]=this.callbacks[a[c]]||[]).push(b);return this},d.prototype.once=function(a,b){function d(){return c.off(a,d),b.apply(this,arguments)}var c=this;return this.on(a,d),this},d.prototype.off=function(a,b){var c=this.callbacks[a];if(!c)return this;if(1==arguments.length)return delete this.callbacks[a],this;var d=c.indexOf(b);return c.splice(d,1),this},d.prototype.emit=function(a){var b=[].slice.call(arguments,1),c=this.callbacks[a],d=!0;if(c)for(var e=0,f=c.length;e<f;++e){d=c[e].apply(this,b),d===undefined&&(d=!0);if(d===!1)break}return d},d}),b("wings/Container",["require","exports","module","./Emitter"],function(a,b,c){var d=a("./Emitter"),e=function f(){function e(a){if(null==a||"object"!=typeof a||a instanceof f)return a;if(a instanceof Date){var b=new Date;return b.setTime(a.getTime()),b}if(a instanceof Array){var b=[];for(var c=0,d=a.length;c<d;++c)b[c]=e(a[c]);return b}if(a instanceof Object){var b={};for(var g in a)a.hasOwnProperty(g)&&(b[g]=e(a[g]));return b}throw new Error("Unable to copy obj! Its type isn't supported.")}var a=this,b,c=[];d.call(this),a.on("dispatch",function(b){if(b&&b.name){a.emit(b.name,b);if(!b.hasOwnProperty("bubbleUp")||b.bubbleUp===!0){var c=a.getParent();c&&c.emit("dispatch",b)}}}),a.setParent=function(d){var e=b;b=d,a.dispatchEvent("container:parentchanged",{oldParent:e,newParent:d})},a.getParent=function(){return b},a.getRoot=function(){var c=b,d=c;while(c!==undefined)d=c,c=d.getParent();return d},a.addWidget=function(d){d.getParent()&&d.getParent().removeWidget(d),d.setParent(a),c.push(d),a.dispatchEvent("container:widgetadded",{widget:d})},a.removeWidget=function(d){var e=d,f=d;typeof e=="number"?f=c[e]:e=c.indexOf(d),e>-1&&(f.setParent(undefined),c.splice(e,1),a.dispatchEvent("container:widgetremoved",{removedWidget:f}))},a.getWidgetCount=function(){return c.length},a.getWidget=function(b){return c[b]},a.getWidgets=function(){return c},a.dispatchEvent=function(c,d){var e=a.createDispatchableEvent(c,d);a.emit("dispatch",e)},a.createDispatchableEvent=function(c,d){var f=e(d)||{};return f.name=c,f.bubbleUp=!0,f.stopBubbling=function(){this.bubbleUp=!1},f.source=a,f}};return e.prototype=Object.create(d.prototype),e.prototype.constructor=e,e}),b("wings/MouseStrategy",["require","exports","module","./Emitter"],function(a,b,c){var d=a("./Emitter"),e=function(b){var c=this,e=b;d.call(this),c.mouseMoved=function(b){throw new Error("Implement mouseMoved!")},c.mouseButtonPressed=function(b,c){throw new Error("Implement mouseButtonPressed!")},c.mouseButtonReleased=function(b,c){throw new Error("Implement mouseButtonReleased!")},c.mouseButtonClicked=function(b,c){throw new Error("Implement mouseButtonClicked!")},c.getCanvasWrapper=function(){return e}};return e.prototype=Object.create(d.prototype),e.prototype.constructor=e,e}),b("wings/DefaultStrategy",["require","exports","module","./MouseStrategy"],function(a,b,c){var d=a("./MouseStrategy"),e=function(b){var c=this,e=[],f={mouseButtonPressed:!1,mouseButtonPressedStartPosition:{left:0,top:0},startThreshold:2,started:!1};d.call(this,b),c.mouseMoved=function(b){var d=c.getCanvasWrapper(),g=d.searchDeepestWidgetOnPosition(b);if(f.mouseButtonPressed&&!f.started){var h=f.mouseButtonPressedStartPosition,i=Math.abs(b.left)-Math.abs(h.left),j=Math.abs(b.top)-Math.abs(h.top),k=Math.sqrt(Math.pow(i,2)+Math.pow(j,2),2);k>=f.startThreshold&&(f.started=!0,c.emit("defaultstrategy:startdrag",b))}g&&(g.dispatchEvent("mouse:move",{absolutePosition:b}),e.indexOf(g)===-1&&(e.push(g),g.dispatchEvent("mouse:enter",{absolutePosition:b}))),d.searchMouseWidgetsOnPosition(b,undefined,function(c){var d=e.indexOf(c);c!==g&&d>-1&&(e.splice(d,1),c.dispatchEvent("mouse:exit",{absolutePosition:b}))})},c.mouseButtonPressed=function(b,d){var e=c.getCanvasWrapper(),g=e.searchDeepestWidgetOnPosition(d);f.mouseButtonPressed=!0,f.mouseButtonPressedStartPosition=d,g&&g.dispatchEvent("mouse:down",{button:b,absolutePosition:d})},c.mouseButtonReleased=function(b,d){var e=c.getCanvasWrapper(),g=e.searchDeepestWidgetOnPosition(d);f.mouseButtonPressed=!1,g&&g.dispatchEvent("mouse:up",{button:b,absolutePosition:d})},c.mouseButtonClicked=function(b,d){var e=c.getCanvasWrapper(),f=e.searchDeepestWidgetOnPosition(d);f&&f.dispatchEvent("mouse:click",{button:b,absolutePosition:d})}};return e.prototype=Object.create(d.prototype),e.prototype.constructor=e,e}),b("wings/DragAndDropStrategy",["require","exports","module","./MouseStrategy","./DefaultStrategy"],function(a,b,c){var d=a("./MouseStrategy"),e=a("./DefaultStrategy"),f=function(b){function i(a,b){f=a,e=b,h=!0}function j(a){h=!1,c.emit("draganddropstrategy:stopdrag",a)}var c=this,e,f,g=[],h=!1;d.call(this,b),c.dragStarted=function(c){var d=i,e=j,f=b.searchDeepestWidgetOnPosition(c);f.dispatchEvent("mouse:dragstart",{absolutePosition:c,acceptCallback:d,cancelCallback:e})},c.mouseMoved=function(b){if(h){var d=c.getCanvasWrapper(),e=d.searchDeepestWidgetOnPosition(b);e&&(e.dispatchEvent("mouse:drag",{absolutePosition:b}),g.indexOf(e)===-1&&(g.push(e),e.dispatchEvent("mouse:dragenter",{absolutePosition:b}))),d.searchMouseWidgetsOnPosition(b,undefined,function(c){var d=g.indexOf(c);c!==e&&d>-1&&(g.splice(d,1),c.dispatchEvent("mouse:dragexit",{absolutePosition:b}))})}},c.mouseButtonReleased=function(b,d){var e=c.getCanvasWrapper(),g=e.searchDeepestWidgetOnPosition(d);f&&f.dispatchEvent("mouse:dragstop",{absolutePosition:d}),g&&g.dispatchEvent("mouse:drop",{absolutePosition:d}),j(d)},c.mouseButtonPressed=function(b,c){},c.mouseButtonClicked=function(b,c){}};return f.prototype=Object.create(d.prototype),f.prototype.constructor=f,f}),b("wings/Widget",["require","exports","module","./Container"],function(a,b,c){var d=a("./Container"),e=function(){function j(a){for(var c=0,d=b.getWidgetCount();c<d;c++)k(a,b.getWidget(c))}function k(a,b){var c=b.getBoundingBox();a.save(),a.translate(c.left,c.top),a.beginPath(),a.rect(0,0,c.width,c.height),a.clip(),a.clearRect(0,0,c.width,c.height),b.draw(a),a.restore()}function l(){var a=(new Date).getTime(),b=Math.ceil(1e3*Math.random()),c=Math.ceil(1e3*Math.random());return b+"-"+a+"-"+c}var b=this,c=l(),e=0,f=0,g=0,h=0,i=!0;d.call(this),b.on(["widget:moved","widget:resized","widget:statechanged"],function(a){b.redraw()}),b.redraw=function(){b.dispatchEvent("widget:drawrequest")},b.drawWidget=function(b){},b.draw=function(c){b.drawWidget(c),j(c)},b.getId=function(){return c},b.getTop=function(){return e},b.getLeft=function(){return f},b.getWidth=function(){return g},b.getHeight=function(){return h},b.getPosition=function(){return{top:e,left:f}},b.getSize=function(){return{width:g,height:h}},b.getBoundingBox=function(){return{top:e,left:f,width:g,height:h}},b.setTop=function(c){var d=b.getPosition();e=c;var f=b.getPosition();b.dispatchEvent("widget:moved",{oldPosition:d,newPosition:f,widget:b})},b.setLeft=function(c){var d=b.getPosition();f=c;var e=b.getPosition();b.dispatchEvent("widget:moved",{oldPosition:d,newPosition:e,widget:b})},b.setWidth=function(c){var d=b.getSize();g=c;var e=b.getSize();b.dispatchEvent("widget:resized",{oldSize:d,newSize:e,widget:b})},b.setHeight=function(c){var d=b.getSize();h=c;var e=b.getSize();b.dispatchEvent("widget:resized",{oldSize:d,newSize:e,widget:b})},b.setPosition=function(c,d){var g=b.getPosition();f=c,e=d;var h=b.getPosition();b.dispatchEvent("widget:moved",{oldPosition:g,newPosition:h,widget:b})},b.setSize=function(c,d){var e=b.getSize();g=c,h=d;var f=b.getSize();b.dispatchEvent("widget:resized",{oldSize:e,newSize:f,widget:b})},b.getState=function(){return i},b.setState=function(c){var d=i;i=c,d!==c&&b.dispatchEvent("widget:statechanged",{oldState:d,newState:c,widget:b})}};return e.prototype=Object.create(d.prototype),e.prototype.constructor=e,e}),b("wings/MouseWidget",["require","exports","module","./Widget"],function(a,b,c){var d=a("./Widget"),e=function(){function f(a){var b=c;b!==a&&(c=a)}var b=this,c=!1,e=!1;d.call(this),b.on("mouse:enter",function(a){f(!0),a.stopBubbling()}),b.on("mouse:exit",function(a){f(!1),a.stopBubbling()}),b.on("mouse:dragstart",function(a){if(e){a.stopBubbling();var c=b.createDispatchableEvent("mouse:dragrequest",{absolutePosition:a.absolutePosition,acceptCallback:a.acceptCallback,cancelCallback:a.cancelCallback});b.emit("dispatch",c)}}),b.isMouseOver=function(){return c},b.setDraggable=function(b){e=b},b.isDraggable=function(){return e}};return e.prototype=Object.create(d.prototype),e.prototype.constructor=e,e}),b("wings/Button",["require","exports","module","./MouseWidget"],function(a,b,c){var d=a("./MouseWidget"),e=function(b){var c=this,e=b||"",f,g=5;d.call(this),c.on(["button:textchanged","button:iconchanged"],function(a,b,d){c.redraw()}),c.drawWidget=function(b){var d=c.getWidth(),h=c.getHeight(),i="lightgray";c.getState()||(i="darkgray"),b.strokeStyle="black",b.fillStyle=i,b.fillRect(0,0,d,h),b.strokeRect(0,0,d,h);if(f){var j=d-g*2,k=h-g*2;b.save(),b.translate(g,g),b.rect(0,0,j,k),b.clip(),f(b,j,k),b.restore()}else if(e&&e.length>0){var l=b.measureText(e).width;b.fillStyle="black",b.textBaseline="middle",b.fillText(e,(d-l)/2,h/2)}},c.setText=function(b){var d=e;e=b,c.dispatchEvent("button:textchanged",{oldText:d,newText:b})},c.getText=function(){return e},c.setIcon=function(b){var d=f;f=b,c.dispatchEvent("button:iconchanged",{oldIcon:d,newIcon:b})},c.getIcon=function(){return f}};return e.prototype=Object.create(d.prototype),e.prototype.constructor=e,e}),b("wings/CanvasWrapper",["require","exports","module","./Widget","./MouseWidget","./DefaultStrategy","./DragAndDropStrategy"],function(a,b,c){var d=a("./Widget"),e=a("./MouseWidget"),f=a("./DefaultStrategy"),g=a("./DragAndDropStrategy"),h=function i(a){function m(a){return{left:a.clientX-a.target.offsetLeft,top:a.clientY-a.target.offsetTop}}function n(){var a={},c=[];(function d(b,e,f){var g=f+1;for(var h=0,i=b.getWidgetCount();h<i;h++){var j=b.getWidget(h),k=j.getPosition(),l={left:e.left+k.left,top:e.top+k.top},m=j.getId();a[m]={widget:j,depth:g,absolutePosition:l},c.push(m),d(j,l,g)}})(b,{left:0,top:0},[],0),c.sort(function(b,c){return a[c].depth-a[b].depth}),j=a,k=c}function o(){var a=new f(b);return a.on("defaultstrategy:startdrag",function(b){var c=p();l=c,c.dragStarted(b)}),a}function p(){var a=new g(b);return a.on("draganddropstrategy:stopdrag",function(b){var c=o();l=c}),a}var b=this,c=a,h=a.getContext("2d"),j={},k=[],l=o();d.call(this),a&&b.setSize(a.width,a.height),c.addEventListener("mousemove",function(a){var b=m(a);a.stopPropagation(),l.mouseMoved(b)}),c.addEventListener("mousedown",function(a){var b=a.button,c=m(a);a.stopPropagation(),l.mouseButtonPressed(b,c)}),c.addEventListener("mouseup",function(a){var b=a.button,c=m(a);a.stopPropagation(),l.mouseButtonReleased(b,c)}),c.addEventListener("click",function(a){var b=a.button,c=m(a);a.stopPropagation(),l.mouseButtonClicked(b,c)}),b.on("widget:drawrequest",function(a){var b=a.source,c=b.getBoundingBox();h.save();var d={left:0,top:0};b instanceof i||(d=j[b.getId()].absolutePosition),h.translate(d.left,d.top),h.beginPath(),h.rect(0,0,c.width,c.height),h.clip(),h.clearRect(0,0,c.width,c.height),b.draw(h),h.restore()}),b.on(["container:widgetadded","container:widgetremoved","container:childaddedwidget","container:childremovedwidget"],function(a){n()}),b.on(["widget:moved","widget:resized"],function(a){a.source!==b&&n()}),b.drawWidget=function(b){},b.isPointContained=function(b,c){return b.top>=c.top&&b.top<=c.top+c.height&&b.left>=c.left&&b.left<=c.left+c.width?!0:!1},b.searchWidgetsOnPosition=function(c,d,e){for(var f in j){var g=j[f].widget;b.isPointContained(c,g.getBoundingBox())?d&&d(g):e&&e(g)}},b.searchMouseWidgetsOnPosition=function(c,d,f){b.searchWidgetsOnPosition(c,function(a){a instanceof e&&d&&d(a)},function(a){a instanceof e&&f&&f(a)})},b.searchDeepestWidgetOnPosition=function(c){var d;for(var e=0,f=k.length;e<f;e++){var g=j[k[e]],h=g.widget,i=h.getBoundingBox();i.left=g.absolutePosition.left,i.top=g.absolutePosition.top;if(b.isPointContained(c,i)){d=h;break}}return d},b.convertAbsoluteToRelativePosition=function(b,c){var d=j[c.getId()].absolutePosition,e={left:b.left-d.left,top:b.top-d.top};return e}};return h.prototype=Object.create(d.prototype),h.prototype.constructor=h,h}),b("wings/Label",["require","exports","module","./MouseWidget"],function(a,b,c){var d=a("./MouseWidget"),e=function(b){var c=this,e=b||"";d.call(this),c.on(["textChanged"],function(a,b,d){c.redraw()}),c.drawWidget=function(b){var d=c.getWidth(),f=c.getHeight();b.borderStyle="black",b.strokeRect(0,0,d,f);if(e&&e.length>0){var g=b.measureText(e).width;b.fillStyle="black",b.textBaseline="middle",b.font="10px Verdana",b.fillText(e,(d-g)/2,f/2)}},c.setText=function(b){var d=e;e=b,c.emit("textChanged",d,b,c)},c.getText=function(){return e}};return e.prototype=Object.create(d.prototype),e.prototype.constructor=e,e}),b("wings/Rectangle",["require","exports","module","./MouseWidget"],function(a,b,c){var d=a("./MouseWidget"),e=function(b){var c=this;d.call(this),c.drawWidget=function(b){var d=c.getWidth(),e=c.getHeight(),f="lightgray";b.strokeStyle="black",b.fillStyle=f,b.fillRect(0,0,d,e),b.strokeRect(0,0,d,e)}};return e.prototype=Object.create(d.prototype),e.prototype.constructor=e,e}),b("wings",["require","wings/Button","wings/CanvasWrapper","wings/Container","wings/DefaultStrategy","wings/DragAndDropStrategy","wings/Emitter","wings/Label","wings/MouseStrategy","wings/MouseWidget","wings/Rectangle","wings/Widget"],function(a){var b={Button:a("wings/Button"),CanvasWrapper:a("wings/CanvasWrapper"),Container:a("wings/Container"),DefaultStrategy:a("wings/DefaultStrategy"),DragAndDropStrategy:a("wings/DragAndDropStrategy"),Emitter:a("wings/Emitter"),Label:a("wings/Label"),MouseStrategy:a("wings/MouseStrategy"),MouseWidget:a("wings/MouseWidget"),Rectangle:a("wings/Rectangle"),Widget:a("wings/Widget")};return b});var f=e("wings");typeof module!="undefined"&&module.exports?module.exports=f:c?function(a){a(function(){return f})}(c):a.wings=f})(this)