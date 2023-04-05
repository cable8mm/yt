//FWDS3DCovUtils
(function (window){
	
	var FWDS3DCovUtils = function(){};
	
	FWDS3DCovUtils.dumy = document.createElement("div");
	
	//###################################//
	/* String */
	//###################################//
	FWDS3DCovUtils.trim = function(str){
		if (str)
		{
			return str.replace(/\s/g, "");
		}
		else
		{
			return undefined;
		}
	};
			
	FWDS3DCovUtils.trimAndFormatUrl = function(str){
		str = str.toLocaleLowerCase();
		str = str.replace(/ /g, "-");
		str = str.replace(/ä/g, "a");
		str = str.replace(/â/g, "a");
		str = str.replace(/â/g, "a");
		str = str.replace(/à/g, "a");
		str = str.replace(/è/g, "e");
		str = str.replace(/é/g, "e");
		str = str.replace(/ë/g, "e");
		str = str.replace(/ï/g, "i");
		str = str.replace(/î/g, "i");
		str = str.replace(/ù/g, "u");
		str = str.replace(/ô/g, "o");
		str = str.replace(/ù/g, "u");
		str = str.replace(/û/g, "u");
		str = str.replace(/ÿ/g, "y");
		str = str.replace(/ç/g, "c");
		str = str.replace(/œ/g, "ce");
		return str;
	};
	
	FWDS3DCovUtils.splitAndTrim = function(str, trim_bl){
		var array = str.split(",");
		var length = array.length;
		for(var i=0; i<length; i++){
			if(trim_bl) array[i] = FWDS3DCovUtils.trim(array[i]);
		};
		return array;
	};

	//#############################################//
	//Array //
	//#############################################//
	FWDS3DCovUtils.indexOfArray = function(array, prop){
		var length = array.length;
		for(var i=0; i<length; i++){
			if(array[i] === prop) return i;
		};
		return -1;
	};
	
	FWDS3DCovUtils.randomizeArray = function(aArray) {
		var randomizedArray = [];
		var copyArray = aArray.concat();
			
		var length = copyArray.length;
		for(var i=0; i< length; i++) {
				var index = Math.floor(Math.random() * copyArray.length);
				randomizedArray.push(copyArray[index]);
				copyArray.splice(index,1);
			}
		return randomizedArray;
	};
	

	//#############################################//
	/*DOM manipulation */
	//#############################################//
	FWDS3DCovUtils.parent = function (e, n){
		if(n === undefined) n = 1;
		while(n-- && e) e = e.parentNode;
		if(!e || e.nodeType !== 1) return null;
		return e;
	};
	
	FWDS3DCovUtils.sibling = function(e, n){
		while (e && n !== 0){
			if(n > 0){
				if(e.nextElementSibling){
					 e = e.nextElementSibling;	 
				}else{
					for(var e = e.nextSibling; e && e.nodeType !== 1; e = e.nextSibling);
				}
				n--;
			}else{
				if(e.previousElementSibling){
					 e = e.previousElementSibling;	 
				}else{
					for(var e = e.previousSibling; e && e.nodeType !== 1; e = e.previousSibling);
				}
				n++;
			}
		}
		return e;
	};
	
	FWDS3DCovUtils.getChildAt = function (e, n){
		var kids = FWDS3DCovUtils.getChildren(e);
		if(n < 0) n += kids.length;
		if(n < 0) return null;
		return kids[n];
	};
	
	FWDS3DCovUtils.getChildById = function(id){
		return document.getElementById(id) || undefined;
	};
	
	FWDS3DCovUtils.getChildren = function(e, allNodesTypes){
		var kids = [];
		for(var c = e.firstChild; c != null; c = c.nextSibling){
			if(allNodesTypes){
				kids.push(c);
			}else if(c.nodeType === 1){
				kids.push(c);
			}
		}
		return kids;
	};
	
	FWDS3DCovUtils.getChildrenFromAttribute = function(e, attr, allNodesTypes){
		var kids = [];
		for(var c = e.firstChild; c != null; c = c.nextSibling){
			if(allNodesTypes && FWDS3DCovUtils.hasAttribute(c, attr)){
				kids.push(c);
			}else if(c.nodeType === 1 && FWDS3DCovUtils.hasAttribute(c, attr)){
				kids.push(c);
			}
		}
		return kids.length == 0 ? undefined : kids;
	};
	
	FWDS3DCovUtils.getChildFromNodeListFromAttribute = function(e, attr, allNodesTypes){
		for(var c = e.firstChild; c != null; c = c.nextSibling){
			if(allNodesTypes && FWDS3DCovUtils.hasAttribute(c, attr)){
				return c;
			}else if(c.nodeType === 1 && FWDS3DCovUtils.hasAttribute(c, attr)){
				return c;
			}
		}
		return undefined;
	};
	
	FWDS3DCovUtils.getAttributeValue = function(e, attr){
		if(!FWDS3DCovUtils.hasAttribute(e, attr)) return undefined;
		return e.getAttribute(attr);	
	};
	
	FWDS3DCovUtils.hasAttribute = function(e, attr){
		if(e.hasAttribute){
			return e.hasAttribute(attr); 
		}else {
			var test = e.attributes[attr];
			return  test ? true : false;
		}
	};
	
	FWDS3DCovUtils.insertNodeAt = function(parent, child, n){
		var children = FWDS3DCovUtils.children(parent);
		if(n < 0 || n > children.length){
			throw new Error("invalid index!");
		}else {
			parent.insertBefore(child, children[n]);
		};
	};
	
	FWDS3DCovUtils.hasCanvas = function(){
		return Boolean(document.createElement("canvas"));
	};
	
	//###################################//
	/* DOM geometry */
	//##################################//
	FWDS3DCovUtils.hitTest = function(target, x, y){
		var hit = false;
		if(!target) throw Error("Hit test target is null!");
		var rect = target.getBoundingClientRect();
		
		if(x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) return true;
		return false;
	};
	
	FWDS3DCovUtils.getScrollOffsets = function(){
		//all browsers
		if(window.pageXOffset != null) return{x:window.pageXOffset, y:window.pageYOffset};
		
		//ie7/ie8
		if(document.compatMode == "CSS1Compat"){
			return({x:document.documentElement.scrollLeft, y:document.documentElement.scrollTop});
		}
	};
	
	FWDS3DCovUtils.getViewportSize = function(){
		if(FWDS3DCovUtils.hasPointerEvent && navigator.msMaxTouchPoints > 1){
			return {w:document.documentElement.clientWidth || window.innerWidth, h:document.documentElement.clientHeight || window.innerHeight};
		}
		
		if(FWDS3DCovUtils.isMobile) return {w:window.innerWidth, h:window.innerHeight};
		return {w:document.documentElement.clientWidth || window.innerWidth, h:document.documentElement.clientHeight || window.innerHeight};
	};
	
	FWDS3DCovUtils.getViewportMouseCoordinates = function(e){
		var offsets = FWDS3DCovUtils.getScrollOffsets();
		
		if(e.touches){
			return{
				screenX:e.changedTouches[0] == undefined ? e.changedTouches.pageX - offsets.x :e.changedTouches[0].pageX - offsets.x,
				screenY:e.changedTouches[0] == undefined ? e.changedTouches.pageY - offsets.y :e.changedTouches[0].pageY - offsets.y
			};
		}
		
		return{
			screenX: e.clientX == undefined ? e.pageX - offsets.x : e.clientX,
			screenY: e.clientY == undefined ? e.pageY - offsets.y : e.clientY
		};
	};
	
	
	//###################################//
	/* Browsers test */
	//##################################//
	FWDS3DCovUtils.hasPointerEvent = (function(){
		return Boolean(window.navigator.msPointerEnabled);
	}());
	
	FWDS3DCovUtils.isMobile = (function (){
		if(FWDS3DCovUtils.hasPointerEvent && navigator.msMaxTouchPoints > 1) return true;
		var agents = ['android', 'webos', 'iphone', 'ipad', 'blackberry', 'kfsowi'];
	    for(i in agents) {
	    	if(String(navigator.userAgent).toLowerCase().indexOf(String(agents[i]).toLowerCase()) != -1) {
	            return true;
	        }
	    }
	    return false;
	}());
	
	FWDS3DCovUtils.isAndroid = (function(){
		 return (navigator.userAgent.toLowerCase().indexOf("android".toLowerCase()) != -1);
	}());
	
	FWDS3DCovUtils.isChrome = (function(){
		return navigator.userAgent.toLowerCase().indexOf('chrome') != -1;
	}());
	
	FWDS3DCovUtils.isSafari = (function(){
		return navigator.userAgent.toLowerCase().indexOf('safari') != -1 && navigator.userAgent.toLowerCase().indexOf('chrome') == -1;
	}());
	
	FWDS3DCovUtils.isOpera = (function(){
		return navigator.userAgent.toLowerCase().indexOf('opera') != -1 && navigator.userAgent.toLowerCase().indexOf('chrome') == -1;
	}());
	
	FWDS3DCovUtils.isFirefox = (function(){
		return navigator.userAgent.toLowerCase().indexOf('firefox') != -1;
	}());
	
	FWDS3DCovUtils.isIE = (function(){
		var isIE = navigator.userAgent.toLowerCase().indexOf('msie') != -1;
		return Boolean(isIE || document.documentElement.msRequestFullscreen);
	}());
	
	FWDS3DCovUtils.isIEAndLessThen9 = (function(){
		return navigator.userAgent.toLowerCase().indexOf("msie 7") != -1 || navigator.userAgent.toLowerCase().indexOf("msie 8") != -1;
	}());
	
	FWDS3DCovUtils.isEdge = (function(){
		return navigator.userAgent.toLowerCase().indexOf("edge") != -1;
	}());
	
	FWDS3DCovUtils.isIEAndLessThen10 = (function(){
		return navigator.userAgent.toLowerCase().indexOf("msie 7") != -1 || navigator.userAgent.toLowerCase().indexOf("msie 8") != -1 || navigator.userAgent.toLowerCase().indexOf("msie 9") != -1;
	}());

	FWDS3DCovUtils.isIEAndMoreThen8 = (function(){
		return FWDS3DCovUtils.isIE9 || FWDS3DCovUtils.isIE10 || FWDS3DCovUtils.isIE11;
	}());
	
	FWDS3DCovUtils.isIE7 = (function(){
		return navigator.userAgent.toLowerCase().indexOf("msie 7") != -1;
	}());
	
	FWDS3DCovUtils.isIE8 = (function(){
		return navigator.userAgent.toLowerCase().indexOf("msie 8") != -1;
	}());

	FWDS3DCovUtils.isIE9 = (function(){
		return navigator.userAgent.toLowerCase().indexOf("msie 9") != -1;
	}());
	
	FWDS3DCovUtils.isIE10 = (function(){
		return navigator.userAgent.toLowerCase().indexOf("msie 10") != -1;
	}());
	
	FWDS3DCovUtils.isIE11 = (function(){
		var isIE = navigator.userAgent.toLowerCase().indexOf('msie') != -1;
		return Boolean(!isIE && document.documentElement.msRequestFullscreen);
	}());
	
	FWDS3DCovUtils.isIEAndMoreThen9 = (function(){
		return FWDS3DCovUtils.isIE10 || FWDS3DCovUtils.isIE11;
	}());
	
	FWDS3DCovUtils.isApple = (function(){
		return navigator.appVersion.toLowerCase().indexOf('mac') != -1;;
	}());
	
	FWDS3DCovUtils.isAndroidAndWebkit = (function(){
		return  (FWDS3DCovUtils.isOpera || FWDS3DCovUtils.isChrome) && FWDS3DCovUtils.isAndroid;
	}());
	
	FWDS3DCovUtils.hasFullScreen = (function(){
		return FWDS3DCovUtils.dumy.requestFullScreen || FWDS3DCovUtils.dumy.mozRequestFullScreen || FWDS3DCovUtils.dumy.webkitRequestFullScreen || FWDS3DCovUtils.dumy.msieRequestFullScreen;
	}());
	
	function get3d(){
	    var properties = ['transform', 'msTransform', 'WebkitTransform', 'MozTransform', 'OTransform', 'KhtmlTransform'];
	    var p;
	    var position;
	    while (p = properties.shift()) {
	       if (typeof FWDS3DCovUtils.dumy.style[p] !== 'undefined') {
	    	   FWDS3DCovUtils.dumy.style.position = "absolute";
	    	   position = FWDS3DCovUtils.dumy.getBoundingClientRect().left;
	    	   FWDS3DCovUtils.dumy.style[p] = 'translate3d(500px, 0px, 0px)';
	    	   position = Math.abs(FWDS3DCovUtils.dumy.getBoundingClientRect().left - position);
	    	   
	           if(position > 100 && position < 900){
	        	   try{document.documentElement.removeChild(FWDS3DCovUtils.dumy);}catch(e){}
	        	   return true;
	           }
	       }
	    }
	    try{document.documentElement.removeChild(FWDS3DCovUtils.dumy);}catch(e){}
	    return false;
	};
	
	function get2d(){
	    var properties = ['transform', 'msTransform', 'WebkitTransform', 'MozTransform', 'OTransform', 'KhtmlTransform'];
	    var p;
	    while (p = properties.shift()) {
	       if (typeof FWDS3DCovUtils.dumy.style[p] !== 'undefined') {
	    	   return true;
	       }
	    }
	    try{document.documentElement.removeChild(FWDS3DCovUtils.dumy);}catch(e){}
	    return false;
	};
	
	//###############################################//
	/* various utils */
	//###############################################//
	FWDS3DCovUtils.onReady = function(callback){
		if (document.addEventListener) {
			document.addEventListener( "DOMContentLoaded", function(){
				FWDS3DCovUtils.checkIfHasTransforms();
				callback();
			});
		}else{
			document.onreadystatechange = function () {
				FWDS3DCovUtils.checkIfHasTransforms();
				if (document.readyState == "complete") callback();
			};
		}
	};
	
	FWDS3DCovUtils.checkIfHasTransforms = function()
	{
		if (FWDS3DCovUtils.isReadyMethodCalled_bl)
			return;
			
		document.documentElement.appendChild(FWDS3DCovUtils.dumy);
		FWDS3DCovUtils.hasTransform3d = get3d();
		FWDS3DCovUtils.hasTransform2d = get2d();
		
		FWDS3DCovUtils.isReadyMethodCalled_bl = true;
	};
	
	FWDS3DCovUtils.disableElementSelection = function(e){
		try{e.style.userSelect = "none";}catch(e){};
		try{e.style.MozUserSelect = "none";}catch(e){};
		try{e.style.webkitUserSelect = "none";}catch(e){};
		try{e.style.khtmlUserSelect = "none";}catch(e){};
		try{e.style.oUserSelect = "none";}catch(e){};
		try{e.style.msUserSelect = "none";}catch(e){};
		try{e.msUserSelect = "none";}catch(e){};
		e.onselectstart = function(){return false;};
	};
	
	FWDS3DCovUtils.getUrlArgs = function urlArgs(string){
		var args = {};
		var query = string.substr(string.indexOf("?") + 1) || location.search.substring(1);
		var pairs = query.split("&");
		for(var i=0; i< pairs.length; i++){
			var pos = pairs[i].indexOf("=");
			var name = pairs[i].substring(0,pos);
			var value = pairs[i].substring(pos + 1);
			value = decodeURIComponent(value);
			args[name] = value;
		}
		return args;
	};
	
	FWDS3DCovUtils.validateEmail = function(mail){  
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){  
			return true;  
		}  
		return false;  
    }; 
    
	//################################//
	/* resize utils */
	//################################//
	FWDS3DCovUtils.resizeDoWithLimit = function(
			displayObject,
			containerWidth,
			containerHeight,
			doWidth,
			doHeight,
			removeWidthOffset,
			removeHeightOffset,
			offsetX,
			offsetY,
			animate,
			pDuration,
			pDelay,
			pEase
		) {
		var containerWidth = containerWidth - removeWidthOffset;
		var containerHeight = containerHeight - removeHeightOffset;
			
		var scaleX = containerWidth/doWidth;
		var scaleY = containerHeight/doHeight;
		var totalScale = 0;
				
		if(scaleX <= scaleY){
			totalScale = scaleX;
		}else if(scaleX >= scaleY){
			totalScale = scaleY;
		}
			
		var finalWidth = Math.round((doWidth * totalScale));
		var finalHeight = Math.round((doHeight * totalScale));
		var x = Math.floor((containerWidth -  (doWidth * totalScale))/2  + offsetX);
		var y = Math.floor((containerHeight -  (doHeight * totalScale))/2 + offsetY);
			
		if(animate){
			FWDS3DCovModTweenMax.to(displayObject, pDuration, {x:x, y:y, w:finalWidth, h:finalHeight, delay:pDelay, ease:pEase});
		}else{
			displayObject.x = x;
			displayObject.y = y;
			displayObject.w = finalWidth;
			displayObject.h = finalHeight;
		}
	};
	
	//#########################################//
	/* request animation frame */
	//########################################//
	window.requestAnimFrame = (function(){
	    return  window.requestAnimationFrame || 
	        window.webkitRequestAnimationFrame || 
	        window.mozRequestAnimationFrame || 
	        window.oRequestAnimationFrame || 
	        window.msRequestAnimationFrame || 
	        function(/* function */ callback, /* DOMElement */ element){
	            return window.setTimeout(callback, 1000 / 60);
	        };
	})();
	
	window.cancelRequestAnimFrame = ( function() {
	    return window.cancelAnimationFrame ||
	        window.webkitCancelRequestAnimationFrame ||
	        window.mozCancelRequestAnimationFrame ||
	        window.oCancelRequestAnimationFrame ||
	        window.msCancelRequestAnimationFrame ||
	        clearTimeout;
	} )();
	
	FWDS3DCovUtils.isReadyMethodCalled_bl = false;
	
	window.FWDS3DCovUtils = FWDS3DCovUtils;
}(window));

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());