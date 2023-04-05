/* FWDS3DCovCategoriesButton */
(function (){
var FWDS3DCovCategoriesButton = function(
			id,
			label, 
			textNormalColor,
			textSelectedColor,
			totalHeight
		){
		
		var self = this;
		var prototype = FWDS3DCovCategoriesButton.prototype;
		
		this.bkDO = null;
		this.textDO = null;
		this.dumyDO = null;
		
		this.label_str = label;
		this.textNormalColor_str = textNormalColor;
		this.textSelectedColor_str = textSelectedColor;
		
		this.totalWidth = 400;
		this.totalHeight = totalHeight;
		this.id = id;
		
		this.hasPointerEvent = FWDS3DCovUtils.hasPointerEvent;
		this.isMobile = FWDS3DCovUtils.isMobile;
		this.isDisabled = false;
		
	
		//##########################################//
		/* initialize */
		//##########################################//
		this.init = function(){
			self.setBackfaceVisibility();
			self.setButtonMode(true);
			self.setupMainContainers();
			self.setWidth(self.totalWidth);
			self.setHeight(self.totalHeight);
		};
		
		//##########################################//
		/* setup main containers */
		//##########################################//
		this.setupMainContainers = function()
		{
			self.bkDO = new FWDS3DCovSimpleDisplayObject("div");
			self.addChild(self.bkDO);
			
			self.textDO = new FWDS3DCovSimpleDisplayObject("div");
			self.textDO.getStyle().whiteSpace = "nowrap";
			self.textDO.setBackfaceVisibility();
			self.textDO.setOverflow("visible");
			self.textDO.setDisplay("inline-block");
			self.textDO.getStyle().fontFamily = "Arial";
			self.textDO.getStyle().fontSize = "13px";
			self.textDO.getStyle().padding = "6px";
			self.textDO.getStyle().color = self.normalColor_str;
			self.textDO.getStyle().fontSmoothing = "antialiased";
			self.textDO.getStyle().webkitFontSmoothing = "antialiased";
			self.textDO.getStyle().textRendering = "optimizeLegibility";	
			
			if (FWDS3DCovUtils.isIEAndLessThen9)
			{
				self.textDO.screen.innerText = self.label_str;
			}
			else
			{
				self.textDO.setInnerHTML(self.label_str);
			}
			
			self.addChild(self.textDO);
			
			self.dumyDO = new FWDS3DCovSimpleDisplayObject("div");
			if(FWDS3DCovUtils.isIE){
				self.dumyDO.setBkColor("#FF0000");
				self.dumyDO.setAlpha(0);
			};
			self.addChild(self.dumyDO);
			
			if(self.isMobile){
				if(self.hasPointerEvent){
					self.screen.addEventListener("MSPointerOver", self.onMouseOver);
					self.screen.addEventListener("MSPointerOut", self.onMouseOut);
					self.screen.addEventListener("MSPointerUp", self.onClick);
				}else{
					self.screen.addEventListener("touchstart", self.onClick);
				}
			}else if(self.screen.addEventListener){
				self.screen.addEventListener("mouseover", self.onMouseOver);
				self.screen.addEventListener("mouseout", self.onMouseOut);
				self.screen.addEventListener("click", self.onClick);
			}else if(self.screen.attachEvent){
				self.screen.attachEvent("onmouseover", self.onMouseOver);
				self.screen.attachEvent("onmouseout", self.onMouseOut);
				self.screen.attachEvent("onclick", self.onClick);
			}
			
			self.textPosId = setTimeout(self.positionText, 10);
		};
		
		this.onMouseOver = function(e){
			if(self.isDisabled) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				FWDS3DCovModTweenMax.killTweensOf(self.textDO);
				self.setSelectedState(true);
			}
		};
			
		this.onMouseOut = function(e){
			if(self.isDisabled) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				FWDS3DCovModTweenMax.killTweensOf(self.textDO);
				self.setNormalState(true);
			}
		};
		
		this.onClick = function(e){
			if(self.isDisabled) return;
			if(e.preventDefault) e.preventDefault();
			self.dispatchEvent(FWDS3DCovCategoriesButton.CLICK, {id:self.id});
		};
		
		//###########################################//
		/* set selected / normal state */
		//###########################################//
		this.setSelectedState = function(animate){
			if(animate){
				FWDS3DCovModTweenMax.to(self.textDO.screen, .6, {css:{color:self.textSelectedColor_str}, ease:Quart.easeOut});
			}else{
				self.textDO.getStyle().color = self.textSelectedColor_str;
			}
		};
		
		this.setNormalState = function(animate){
			if(animate){
				FWDS3DCovModTweenMax.to(self.textDO.screen, .6, {css:{color:self.textNormalColor_str}, ease:Quart.easeOut});
			}else{
				self.textDO.getStyle().color = self.textNormalColor_str;
			}
		};

		//##########################################//
		/* position text */
		//##########################################//
		this.positionText = function()
		{
			self.totalWidth = self.textDO.getWidth() + 4;
			
			self.setWidth(self.totalWidth);
			
			self.dumyDO.setWidth(self.totalWidth);
			self.dumyDO.setHeight(self.totalHeight);
			
			self.bkDO.setWidth(self.totalWidth);
			self.bkDO.setHeight(self.totalHeight);
			
			self.textDO.setX(2);
			
			if(FWDS3DCovUtils.isIEAndLessThen9 || FWDS3DCovUtils.isSafari){
				self.textDO.setY(Math.round((self.totalHeight - self.textDO.getHeight())/2) - 1);
			}else{
				self.textDO.setY(Math.round((self.totalHeight - self.textDO.getHeight())/2));
			}
			
			self.textDO.setHeight(self.totalHeight + 2);
			
			self.setNormalState();
		};
		
		//##############################//
		/* disable / enable */
		//#############################//
		this.disable = function(){
			self.isDisabled = true;
			self.setButtonMode(false);
			self.setSelectedState(true);
		};
		
		this.enable = function(){
			self.isDisabled = false;
			self.setNormalState(true);
			self.setButtonMode(true);
		};
		
		//##############################//
		/* destroy */
		//##############################//
		this.destroy = function(){
			
			if(self.isMobile){
				if(self.hasPointerEvent){
					self.screen.removeEventListener("MSPointerOver", self.onMouseOver);
					self.screen.removeEventListener("MSPointerOut", self.onMouseOut);
					self.screen.removeEventListener("MSPointerUp", self.onClick);
				}else{
					self.screen.removeEventListener("touchstart", self.onMouseClick);
				}
			}else if(self.screen.removeEventListener){
				self.screen.removeEventListener("mouseover", self.onMouseOver);
				self.screen.removeEventListener("mouseout", self.onMouseOut);
				self.screen.removeEventListener("click", self.onClick);
			}else if(self.screen.detachEvent){
				self.screen.detachEvent("onmouseover", self.onMouseOver);
				self.screen.detachEvent("onmouseout", self.onMouseOut);
				self.screen.detachEvent("onclick", self.onClick);
			}
			
			FWDS3DCovModTweenMax.killTweensOf(self.textDO.screen);
			FWDS3DCovModTweenMax.killTweensOf(self.bkDO.screen);
			
			self.textDO.destroy();
			self.bkDO.destroy();
			self.dumyDO.destroy();
			
			self.bkDO = null;
			self.textDO = null;
			self.dumyDO = null;
			
			self.label_str = null;
			self.normalColor_str = null;
			self.textSelectedColor_str = null;
			self.disabledColor_str = null;
			
			self.setInnerHTML("");
			prototype.destroy();
			self = null;
			prototype = null;
			FWDS3DCovCategoriesButton.prototype = null;
		};
	
		self.init();
	};
	
	/* set prototype */
	FWDS3DCovCategoriesButton.setPrototype = function(){
		FWDS3DCovCategoriesButton.prototype = new FWDS3DCovDisplayObject("div");
	};
	
	FWDS3DCovCategoriesButton.CLICK = "onClick";
	
	FWDS3DCovCategoriesButton.prototype = null;
	window.FWDS3DCovCategoriesButton = FWDS3DCovCategoriesButton;
}(window));