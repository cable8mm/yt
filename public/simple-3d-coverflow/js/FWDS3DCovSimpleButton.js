/* FWDS3DCovSimpleButton */
(function (window){
var FWDS3DCovSimpleButton = function(nImg, sImg){
		
		var self = this;
		var prototype = FWDS3DCovSimpleButton.prototype;
		
		this.nImg = nImg;
		this.sImg = sImg;
		
		this.n_do;
		this.s_do;
		
		this.isMobile_bl = FWDS3DCovUtils.isMobile;
		this.hasPointerEvent_bl = FWDS3DCovUtils.hasPointerEvent;
		
		//##########################################//
		/* initialize this */
		//##########################################//
		this.init = function(){
			self.setBackfaceVisibility();
			this.setupMainContainers();
		};
		
		//##########################################//
		/* setup main containers */
		//##########################################//
		this.setupMainContainers = function(){
			this.n_do = new FWDS3DCovSimpleDisplayObject("img");	
			this.n_do.setScreen(this.nImg);
			this.s_do = new FWDS3DCovSimpleDisplayObject("img");
			this.s_do.setScreen(this.sImg);
			this.addChild(this.s_do);
			this.addChild(this.n_do);
			
			this.setWidth(this.nImg.width);
			this.setHeight(this.nImg.height);
			this.setButtonMode(true);
			
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					self.screen.addEventListener("MSPointerOver", self.onMouseOver);
					self.screen.addEventListener("MSPointerOut", self.onMouseOut);
					self.screen.addEventListener("MSPointerUp", self.onClick);
				}else{
					self.screen.addEventListener("touchstart", self.onClick);
				}
			}else if(self.screen.addEventListener){	
				self.screen.addEventListener("mouseover", self.onMouseOver);
				self.screen.addEventListener("mouseout", self.onMouseOut);
				self.screen.addEventListener("mouseup", self.onClick);
			}else if(self.screen.attachEvent){
				self.screen.attachEvent("onmouseover", self.onMouseOver);
				self.screen.attachEvent("onmouseout", self.onMouseOut);
				self.screen.attachEvent("onmouseup", self.onClick);
			}
		};
		
		this.onMouseOver = function(e){
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				FWDS3DCovModTweenMax.to(self.n_do, .9, {alpha:0, ease:Expo.easeOut});
			}
		};
			
		this.onMouseOut = function(e){
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				FWDS3DCovModTweenMax.to(self.n_do, .9, {alpha:1, ease:Expo.easeOu});	
			}
		};
			
		this.onClick = function(e){
			self.dispatchEvent(FWDS3DCovSimpleButton.CLICK);
		};
		
		//##############################//
		/* destroy */
		//##############################//
		this.destroy = function(){
			
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					self.screen.removeEventListener("MSPointerOver", self.onMouseOver);
					self.screen.removeEventListener("MSPointerOut", self.onMouseOut);
					self.screen.removeEventListener("MSPointerUp", self.onClick);
				}else{
					self.screen.removeEventListener("touchstart", self.onClick);
				}
			}else if(self.screen.removeEventListener){	
				self.screen.removeEventListener("mouseover", self.onMouseOver);
				self.screen.removeEventListener("mouseout", self.onMouseOut);
				self.screen.removeEventListener("mouseup", self.onClick);
			}else if(self.screen.detachEvent){
				self.screen.detachEvent("onmouseover", self.onMouseOver);
				self.screen.detachEvent("onmouseout", self.onMouseOut);
				self.screen.detachEvent("onmouseup", self.onClick);
			}
			
			FWDS3DCovModTweenMax.killTweensOf(self.n_do);
			self.n_do.destroy();
			self.s_do.destroy();
			
			self.nImg = null;
			self.sImg = null;
			self.n_do = null;
			self.s_do = null;
			
			nImg = null;
			sImg = null;
			
			self.setInnerHTML("");
			prototype.destroy();
			self = null;
			prototype = null;
			FWDS3DCovSimpleButton.prototype = null;
		};
	
		this.init();
	};
	
	/* set prototype */
	FWDS3DCovSimpleButton.setPrototype = function(){
		FWDS3DCovSimpleButton.prototype = new FWDS3DCovDisplayObject("div");
	};
	
	FWDS3DCovSimpleButton.CLICK = "onClick";
	
	FWDS3DCovSimpleButton.prototype = null;
	window.FWDS3DCovSimpleButton = FWDS3DCovSimpleButton;
}(window));