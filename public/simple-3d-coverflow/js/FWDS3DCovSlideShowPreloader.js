/* Slideshow preloader */
(function (window){
	
	var FWDS3DCovSlideShowPreloader = function(imageSource_img, segmentWidth, segmentHeight, totalSegments, duration){
		
		var self  = this;
		var prototype = FWDS3DCovSlideShowPreloader.prototype;
		
		this.imageSource_img = imageSource_img;
		this.image_do = null;
		this.tweenObj = {currentPos:0};
		
		this.segmentWidth = segmentWidth;
		this.segmentHeight = segmentHeight;
		this.totalSegments = totalSegments;
		this.duration = duration/1000;
		this.delayTimerId_int;
		
		//###################################//
		/* init */
		//###################################//
		this.init = function(){
			this.setWidth(this.segmentWidth);
			this.setHeight(this.segmentHeight);
		
			this.image_do = new FWDS3DCovDisplayObject("img");
			this.image_do.setScreen(this.imageSource_img);
			this.addChild(this.image_do);
			this.onUpdateHandler();
			this.hide(false);
		};
		
		//###################################//
		/* start / stop preloader animation */
		//###################################//
		this.animIn = function(){
			FWDS3DCovModTweenMax.killTweensOf(this.tweenObj);
			this.currentPos = 0;
			FWDS3DCovModTweenMax.to(this.tweenObj, this.duration, {currentPos:1, ease:Linear.easeNone, onUpdate:this.onUpdateHandler});
		};
		
		this.animOut = function(){
			FWDS3DCovModTweenMax.killTweensOf(this.tweenObj);
			FWDS3DCovModTweenMax.to(this.tweenObj, .8, {currentPos:0, onUpdate:this.onUpdateHandler});
		};
		
		this.onUpdateHandler = function(){
			var posX = Math.round((self.tweenObj.currentPos/1) * (self.totalSegments - 1)) * self.segmentWidth;
			self.image_do.setX(-posX);
		};
		
		//###################################//
		/* show / hide preloader animation */
		//###################################//
		this.show = function(){
			this.setVisible(true);
			if(this.opacityType == "opacity"){
				FWDS3DCovModTweenMax.killTweensOf(this.image_do);
				FWDS3DCovModTweenMax.to(this.image_do, 1, {alpha:1});
			}else{
				this.setWidth(this.segmentWidth);
			}
		};
		
		this.hide = function(animate){
			if(animate){
				if(this.opacityType == "opacity"){
					FWDS3DCovModTweenMax.killTweensOf(this.image_do);
					FWDS3DCovModTweenMax.to(this.image_do, 1, {alpha:0});
				}else{
					this.setWidth(0);
				}
			}else{
				if(this.opacityType == "opacity"){
					FWDS3DCovModTweenMax.killTweensOf(this.image_do);
					this.setVisible(false);
					this.image_do.setAlpha(0);
				}else{
					this.setWidth(0);
				}
			}
		};
		
		//###################################//
		/* destroy */
		//##################################//
		this.destroy = function(){
			FWDS3DCovModTweenMax.killTweensOf(this);
			FWDS3DCovModTweenMax.killTweensOf(this.tweenObj);
			FWDS3DCovModTweenMax.killTweensOf(this.image_do);
			
			this.image_do.destroy();
			
			this.imageSource_img = null;
			this.image_do = null;
			this.tweenObj = null;
			imageSource_img = null;
			
			this.setInnerHTML("");
			prototype.destroy();
			self = null;
			prototype = null;
			FWDS3DCovSlideShowPreloader.prototype = null;
		};
		
		this.init();
	};
	
	FWDS3DCovSlideShowPreloader.HIDE_COMPLETE
	
	FWDS3DCovSlideShowPreloader.setPrototype = function(){
		FWDS3DCovSlideShowPreloader.prototype = new FWDS3DCovDisplayObject("div");
	};
	
	FWDS3DCovSlideShowPreloader.prototype = null;
	window.FWDS3DCovSlideShowPreloader = FWDS3DCovSlideShowPreloader;
	
}(window));
