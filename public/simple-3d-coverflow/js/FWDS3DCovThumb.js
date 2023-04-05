/* thumb */
(function(window)
{
	var FWDS3DCovThumb = function(id, data, parent)
	{
		var self = this;
		var prototype = FWDS3DCovThumb.prototype;

		this.id = id;
		this.borderSize = data.thumbBorderSize;
		this.backgroundColor = data.thumbBackgroundColor;
		this.borderColor1 = data.thumbBorderColor1;
		this.borderColor2 = data.thumbBorderColor2;

		this.mainDO = null;
		this.borderDO = null;
		this.bgDO = null;
		this.imageHolderDO = null;
		this.imageDO = null;
		this.reflCanvasDO = null;
		
		this.gradientDO = null;
		this.gradientLeftDO = null;
		this.gradientRightDO = null;
		
		this.textHolderDO = null;
		this.textGradientDO = null;
		this.textDO = null;
		
		this.tooltipDO = null;
		
		this.curDataListAr = parent.curDataListAr;
		
		this.thumbWidth = self.curDataListAr[self.id].thumbWidth;
		this.thumbHeight = self.curDataListAr[self.id].thumbHeight;
		
		this.mouseX = 0;
		this.mouseY = 0;
		
		this.gradPos = 0;
		this.thumbScale = 1;
		
		this.showBoxShadow = data.showBoxShadow;
		
		this.isOver = false;
		this.isOver2 = false;
		this.hasText = false;
		this.isEnabled = true;
		this.hasImage = false;
		
		this.isMobile = FWDS3DCovUtils.isMobile;
		this.hasPointerEvent = FWDS3DCovUtils.hasPointerEvent;

		/* init */
		this.init = function()
		{
			self.setupScreen();
		};

		/* setup screen */
		this.setupScreen = function()
		{
			self.mainDO = new FWDS3DCovDisplayObject("div", "absolute", "visible");
			self.addChild(self.mainDO);
			
			self.mainDO.setWidth(self.thumbWidth);
			self.mainDO.setHeight(self.thumbHeight);
			
			self.setWidth(self.thumbWidth);
			self.setHeight(self.thumbHeight);
			
			if (!data.transparentImages)
			{
				self.borderDO = new FWDS3DCovSimpleDisplayObject("div");
				self.bgDO = new FWDS3DCovSimpleDisplayObject("div");
				
				self.mainDO.addChild(self.borderDO);
				self.mainDO.addChild(self.bgDO);
				
				self.borderDO.setWidth(self.thumbWidth);
				self.borderDO.setHeight(self.thumbHeight);
				
				self.bgDO.setWidth(self.thumbWidth - self.borderSize * 2);
				self.bgDO.setHeight(self.thumbHeight - self.borderSize * 2);
				
				self.bgDO.setX(self.borderSize);
				self.bgDO.setY(self.borderSize);

				self.borderDO.setCSSGradient("top", self.borderColor1, self.borderColor2);
				
				self.bgDO.setBkColor(self.backgroundColor);
				
				if (FWDS3DCovUtils.isAndroid)
				{
					self.borderDO.setBackfaceVisibility();
					self.bgDO.setBackfaceVisibility();
				}
			}
			else
			{
				self.borderSize = 0;
			}
			
			self.imageHolderDO = new FWDS3DCovDisplayObject("div");
			self.mainDO.addChild(self.imageHolderDO);
			
			self.curDataListAr = parent.curDataListAr;
			
			if (!self.isMobile && (self.curDataListAr[self.id].mediaType != "none"))
			{
				self.mainDO.setButtonMode(true);
			}
			
			self.setupGradient();
			
			if (FWDS3DCovUtils.isAndroid)
			{
				self.setBackfaceVisibility();
				self.mainDO.setBackfaceVisibility();
				self.imageHolderDO.setBackfaceVisibility();
			}
			
			if (self.showBoxShadow)
			{
				self.mainDO.screen.style.boxShadow = data.thumbBoxShadowCss;
			}
			
			if (self.isMobile)
			{
				if (self.hasPointerEvent)
				{
					self.mainDO.screen.addEventListener("MSPointerUp", self.onMouseTouchHandler);
				}
				else
				{
					self.mainDO.screen.addEventListener("touchend", self.onMouseTouchHandler);
				}
			}
			else
			{
				if (self.screen.addEventListener)
				{
					self.mainDO.screen.addEventListener("click", self.onMouseClickHandler);
					self.mainDO.screen.addEventListener("mouseover", self.onMouseOverHandler);
					self.mainDO.screen.addEventListener("mouseout", self.onMouseOutHandler);
				}
				else
				{
					self.mainDO.screen.attachEvent("onclick", self.onMouseClickHandler);
				}
				
				if (parent.showTooltip)
				{
					self.setupTooltip();
				}
			}
			
			if (!FWDS3DCovUtils.isIEAndLessThen10)
			{
				self.setTransformOrigin("100%");
			}
		};
		
		this.setTransformOrigin = function(percent)
		{
			self.screen.style.transformOrigin = "50% " + percent;
			self.screen.style.WebkitTransformOrigin = "50% " + percent;
			self.screen.style.MozTransformOrigin = "50% " + percent;
			self.screen.style.OTransformOrigin = "50% " + percent;
			self.screen.style.msTransformOrigin = "50% " + percent;
		};
		
		this.setupTooltip = function()
		{
			FWDS3DCovTooltip.setPrototype();
			
			self.tooltipDO = new FWDS3DCovTooltip(
			{
				skinPath:data.propsObj.skinPath + "/tooltip-skin",
				tooltipMaxWidth:300,
				text:self.curDataListAr[self.id].thumbText,
				btnMode:true
			});
			
			parent.parent.mainDO.addChild(self.tooltipDO);
			
			self.tooltipDO.screen.style.zIndex = 10000;
			
			self.tooltipDO.setAlpha(0);
			self.tooltipDO.setX(-2000);
		};
		
		this.addReflection = function()
		{
			if (!self.imageDO || self.isMobile || FWDS3DCovUtils.isIEAndLessThen9)
				return;
			
			var imgW = self.thumbWidth - self.borderSize * 2;
			var imgH = self.thumbHeight - self.borderSize * 2;
			
			self.reflCanvasDO = new FWDS3DCovSimpleDisplayObject("canvas");
			self.mainDO.addChild(self.reflCanvasDO);
			
			self.reflCanvasDO.screen.width = self.thumbWidth;
			self.reflCanvasDO.screen.height = parent.reflHeight;
			
			var context = self.reflCanvasDO.screen.getContext("2d");
		   
			context.save();
					
			context.translate(0, self.thumbHeight);
			context.scale(1, -1);
			
			if (!data.transparentImages)
			{
				context.fillStyle = self.borderColor2;
				context.fillRect(0, 0, self.thumbWidth, self.thumbHeight);
			}
			
			context.drawImage(self.imageDO.screen, self.borderSize, self.borderSize, imgW, imgH);

			context.restore();
			
			context.globalCompositeOperation = "destination-out";
			var gradient = context.createLinearGradient(0, 0, 0, parent.reflHeight);
			
			gradient.addColorStop(0, "rgba(255, 255, 255, " + (1-parent.reflAlpha) + ")");
			gradient.addColorStop(1, "rgba(255, 255, 255, 1.0)");

			context.fillStyle = gradient;
			context.fillRect(0, 0, self.thumbWidth, parent.reflHeight + 2);
			
			self.setWidth(self.thumbWidth);
			self.reflCanvasDO.setY(self.thumbHeight + parent.reflDist);
			
			if (self.gradientDO)
			{
				self.mainDO.addChild(self.gradientDO);
			}
		};

		this.addImage = function(image)
		{
			self.imageDO = new FWDS3DCovSimpleDisplayObject("img");
			self.imageDO.setScreen(image);
			self.imageHolderDO.addChild(self.imageDO);
			
			self.imageDO.screen.ontouchstart = null;
			
			if (FWDS3DCovUtils.isAndroid)
			{
				self.imageDO.setBackfaceVisibility();
			}
			
			self.imageDO.setWidth(self.thumbWidth - self.borderSize * 2);
			self.imageDO.setHeight(self.thumbHeight - self.borderSize * 2);
			
			self.imageHolderDO.setX(self.borderSize);
			self.imageHolderDO.setY(self.borderSize);
			
			self.imageHolderDO.setWidth(self.thumbWidth - self.borderSize * 2);
			self.imageHolderDO.setHeight(self.thumbHeight - self.borderSize * 2);
			
			if (parent.showRefl)
			{
				self.addReflection();
			}
		};
		
		this.setupGradient = function()
		{
			if (self.isMobile || FWDS3DCovUtils.isIEAndLessThen10 || !parent.showGradient)
				return;
			
			self.gradientDO = new FWDS3DCovDisplayObject("div");
			self.mainDO.addChild(self.gradientDO);
			
			self.gradientDO.setWidth(self.thumbWidth);
			
			if (parent.showRefl && !self.isMobile && !FWDS3DCovUtils.isIEAndLessThen10)
			{
				self.gradientDO.setHeight(self.thumbHeight + parent.reflDist + parent.reflHeight);
			}
			else
			{
				self.gradientDO.setHeight(self.thumbHeight);
			}
			
			self.gradientLeftDO = new FWDS3DCovSimpleDisplayObject("div");
			self.gradientDO.addChild(self.gradientLeftDO);
			
			self.gradientLeftDO.setWidth(self.thumbWidth);
			
			if (parent.showRefl && !self.isMobile && !FWDS3DCovUtils.isIEAndLessThen10)
			{
				self.gradientLeftDO.setHeight(self.thumbHeight + parent.reflDist + parent.reflHeight);
			}
			else
			{
				self.gradientLeftDO.setHeight(self.thumbHeight);
			}
			
			self.gradientLeftDO.setCSSGradient("left", parent.gradientColor1, parent.gradientColor2);
			
			self.gradientRightDO = new FWDS3DCovSimpleDisplayObject("div");
			self.gradientDO.addChild(self.gradientRightDO);
			
			self.gradientRightDO.setWidth(self.thumbWidth);
			
			if (parent.showRefl && !self.isMobile && !FWDS3DCovUtils.isIEAndLessThen10)
			{
				self.gradientRightDO.setHeight(self.thumbHeight + parent.reflDist + parent.reflHeight);
			}
			else
			{
				self.gradientRightDO.setHeight(self.thumbHeight);
			}

			if ((parent.topology == "onesided") || (parent.topology == "frontonesided"))
			{
				self.gradientRightDO.setCSSGradient("left", parent.gradientColor1, parent.gradientColor2);
			}
			else
			{
				self.gradientRightDO.setCSSGradient("left", parent.gradientColor2, parent.gradientColor1);
			}
			
			self.gradientLeftDO.setAlpha(0);
			self.gradientRightDO.setAlpha(0);
		};
		
		this.setGradient = function(pos)
		{
			if (self.gradPos == pos)
				return;

			self.gradPos = pos;
			
			if (!self.isMobile && !FWDS3DCovUtils.isIEAndLessThen10 && parent.showGradient)
			{
				switch (self.gradPos)
				{
					case 0:
						FWDS3DCovModTweenMax.to(self.gradientLeftDO, .8, {alpha:0});
						FWDS3DCovModTweenMax.to(self.gradientRightDO, .8, {alpha:0, onComplete:self.hideGrad});
						break;
					case 1:
						self.gradientDO.setY(0);
						FWDS3DCovModTweenMax.to(self.gradientLeftDO, .8, {alpha:0});
						FWDS3DCovModTweenMax.to(self.gradientRightDO, .8, {alpha:1});
						break;
					case -1:
						self.gradientDO.setY(0);
						FWDS3DCovModTweenMax.to(self.gradientLeftDO, .8, {alpha:1});
						FWDS3DCovModTweenMax.to(self.gradientRightDO, .8, {alpha:0});
						break;
				}
			}
		};
		
		this.hideGrad = function()
		{
			self.gradientDO.setY(2000);
		};
		
		this.setGradient2 = function(pos)
		{
			if (!self.isMobile)
			{
				switch (pos)
				{
					case 0:
						FWDS3DCovModTweenMax.to(self.gradientLeftDO, .8, {alpha:0});
						FWDS3DCovModTweenMax.to(self.gradientRightDO, .8, {alpha:0});
						break;
					case 1:
						self.gradientDO.setY(0);
						FWDS3DCovModTweenMax.to(self.gradientLeftDO, .8, {alpha:0});
						FWDS3DCovModTweenMax.to(self.gradientRightDO, .8, {alpha:1});
						break;
					case -1:
						self.gradientDO.setY(0);
						FWDS3DCovModTweenMax.to(self.gradientLeftDO, .8, {alpha:1});
						FWDS3DCovModTweenMax.to(self.gradientRightDO, .8, {alpha:0});
						break;
				}
			}
		};
		
		this.checkThumbOver = function(e)
		{
			if ((parent.thumbMouseX >= 0) && (parent.thumbMouseX <= self.thumbWidth) && (parent.thumbMouseY >= 0) && (parent.thumbMouseY <= self.thumbHeight))
			{
				self.onThumbOverHandler(e);
			}
			else
			{
				self.onThumbOutHandler();
			}
		};
		
		this.onThumbOverHandler = function(e)
		{
			if (!self.isOver)
			{
				self.isOver = true;

				if (FWDS3DCovUtils.isIEAndLessThen9)
				{
					self.tooltipDO.setAlpha(1);
				}
				else
				{
					FWDS3DCovModTweenMax.to(self.tooltipDO, .4, {alpha:1, ease:Expo.easeOut});
				}
			}
			
			var vmc = FWDS3DCovUtils.getViewportMouseCoordinates(e);
			
			var containerX = parent.parent.rect.left;
			var containerY = parent.parent.rect.top;
			
			if (parent.dynTooltip)
			{
				newX = vmc.screenX - containerX;
				newY = vmc.screenY - containerY - 2;
				
				var pointerDX = 0;
				var tooltipHalfW = self.tooltipDO.getTooltipWidth()/2;
				var tooltipH = self.tooltipDO.getTooltipHeight();
				var swapTooltip = false;
				
				if (newX > parent.stageWidth - tooltipHalfW)
				{
					pointerDX = newX - parent.stageWidth + tooltipHalfW;
					newX = parent.stageWidth - tooltipHalfW;
				}
				
				if (newX < tooltipHalfW)
				{
					pointerDX = newX - tooltipHalfW;
					newX = tooltipHalfW;
				}
				
				if (newY < tooltipH)
				{
					swapTooltip = true;
					newY += 20;
				}
				
				self.tooltipDO.setPointerDX(pointerDX);
				self.tooltipDO.swapTooltip(swapTooltip);
				
				newX = Math.floor(newX);
				newY = Math.floor(newY);
				
				self.tooltipDO.setX(newX);
				self.tooltipDO.setY(newY);
			}
			else
			{
				newX = parent.stageWidth/2;
				newY = parent.stageHeight/2 - self.thumbHeight/2 - 5 + (self.getY() + self.thumbHeight/2);
				
				var pointerDX = 0;
				var tooltipHalfW = self.tooltipDO.getTooltipWidth()/2;
				
				if (newX > parent.stageWidth - tooltipHalfW)
				{
					pointerDX = newX - parent.stageWidth + tooltipHalfW;
					newX = parent.stageWidth - tooltipHalfW;
				}
				
				if (newX < tooltipHalfW)
				{
					pointerDX = newX - tooltipHalfW;
					newX = tooltipHalfW;
				}
				
				self.tooltipDO.setPointerDX(pointerDX);
				self.tooltipDO.swapTooltip(false);
				
				newX = Math.floor(newX);
				newY = Math.floor(newY);

				self.tooltipDO.setX(newX);
				self.tooltipDO.setY(newY);	
			}
		};

		this.onThumbOutHandler = function()
		{
			if (self.isOver)
			{
				self.isOver = false;
				
				if (FWDS3DCovUtils.isIEAndLessThen9)
				{
					self.tooltipDO.setAlpha(0);
					self.posTooltip();
				}
				else
				{
					FWDS3DCovModTweenMax.to(self.tooltipDO, .4, {alpha:0, ease:Expo.easeOut, onComplete:self.posTooltip});
				}
			}
		};
		
		this.posTooltip = function()
		{
			if (!self.isOver)
			{
				self.tooltipDO.setX(-2000);
			}
		};
		
		this.hideTooltip = function()
		{
			if (self.tooltipDO)
			{
				if (FWDS3DCovUtils.isIEAndLessThen9)
				{
					self.tooltipDO.setAlpha(0);
					self.posTooltip();
				}
				else
				{
					FWDS3DCovModTweenMax.to(self.tooltipDO, .4, {alpha:0, ease:Expo.easeOut, onComplete:self.posTooltip});
				}

				self.isOver = false;
			}
		};
		
		this.disableTooltip = function()
		{
			if (self.tooltipDO)
			{
				if (FWDS3DCovUtils.isIEAndLessThen9)
				{
					self.tooltipDO.setAlpha(0);
					self.posTooltip();
				}
				else
				{
					FWDS3DCovModTweenMax.to(self.tooltipDO, .4, {alpha:0, ease:Expo.easeOut, onComplete:self.posTooltip});
				}
				
				self.isOver = false;
			}
		};
		
		this.showThumb3D = function()
		{
			var imgW = self.thumbWidth - self.borderSize * 2;
			var imgH = self.thumbHeight - self.borderSize * 2;
			
			self.imageHolderDO.setX(parseInt(self.thumbWidth/2));
			self.imageHolderDO.setY(parseInt(self.thumbHeight/2));
			
			self.imageHolderDO.setWidth(0);
			self.imageHolderDO.setHeight(0);
			
			FWDS3DCovModTweenMax.to(self.imageHolderDO, .8, {x:self.borderSize, y:self.borderSize, w:imgW, h:imgH, ease:Expo.easeInOut});
			
			self.imageDO.setWidth(imgW);
			self.imageDO.setHeight(imgH);
			
			self.imageDO.setX(-parseInt(imgW/2));
			self.imageDO.setY(-parseInt(imgH/2));
			
			FWDS3DCovModTweenMax.to(self.imageDO, .8, {x:0, y:0, ease:Expo.easeInOut});
			
			if (self.reflCanvasDO)
			{
				self.reflCanvasDO.setAlpha(0);
				FWDS3DCovModTweenMax.to(self.reflCanvasDO, .8, {alpha:1, ease:Expo.easeInOut});
			}
		};
		
		this.showThumb2D = function()
		{
			if (!FWDS3DCovUtils.hasTransform2d)
			{
				var scaleW = Math.floor(self.thumbWidth * self.thumbScale);
				var scaleH = Math.floor(self.thumbHeight * self.thumbScale);
				var borderScale = Math.floor(self.borderSize * self.thumbScale);
				
				if ((self.borderSize > 0) && (borderScale < 1))
				{
					borderScale = 1;
				}
			
				var imgW = scaleW - borderScale * 2;
				var imgH = scaleH - borderScale * 2;
				
				self.imageHolderDO.setX(parseInt(scaleW/2));
				self.imageHolderDO.setY(parseInt(scaleH/2));
				
				self.imageHolderDO.setWidth(0);
				self.imageHolderDO.setHeight(0);
				
				FWDS3DCovModTweenMax.to(self.imageHolderDO, .8, {x:borderScale, y:borderScale, w:imgW, h:imgH, ease:Expo.easeInOut});

				if (self.imageDO)
				{
					self.imageDO.setWidth(imgW);
					self.imageDO.setHeight(imgH);
					
					self.imageDO.setX(-parseInt(imgW/2));
					self.imageDO.setY(-parseInt(imgH/2));
					
					FWDS3DCovModTweenMax.to(self.imageDO, .8, {x:0, y:0, ease:Expo.easeInOut});
					
					if (self.reflCanvasDO)
					{
						self.reflCanvasDO.setAlpha(0);
						FWDS3DCovModTweenMax.to(self.reflCanvasDO, .8, {alpha:1, ease:Expo.easeInOut});
					}
				}
			}
			else
			{
				self.setScale2(self.thumbScale);
				
				var imgW = self.thumbWidth - self.borderSize * 2;
				var imgH = self.thumbHeight - self.borderSize * 2;
				
				self.imageHolderDO.setX(parseInt(self.thumbWidth/2));
				self.imageHolderDO.setY(parseInt(self.thumbHeight/2));
				
				self.imageHolderDO.setWidth(0);
				self.imageHolderDO.setHeight(0);
				
				FWDS3DCovModTweenMax.to(self.imageHolderDO, .8, {x:self.borderSize, y:self.borderSize, w:imgW, h:imgH, ease:Expo.easeInOut});

				if (self.imageDO)
				{
					self.imageDO.setWidth(imgW);
					self.imageDO.setHeight(imgH);
					
					self.imageDO.setX(-parseInt(imgW/2));
					self.imageDO.setY(-parseInt(imgH/2));
					
					FWDS3DCovModTweenMax.to(self.imageDO, .8, {x:0, y:0, ease:Expo.easeInOut});
					
					if (self.reflCanvasDO)
					{
						self.reflCanvasDO.setAlpha(0);
						FWDS3DCovModTweenMax.to(self.reflCanvasDO, .8, {alpha:1, ease:Expo.easeInOut});
					}
				}
			}
		};
		
		this.showThumbIntro2D = function(scale, del)
		{
			self.thumbScale = scale;

			if (!FWDS3DCovUtils.hasTransform2d)
			{
				var scaleW = Math.floor(self.thumbWidth * scale);
				var scaleH = Math.floor(self.thumbHeight * scale);
				var borderScale = Math.floor(self.borderSize * scale);
				
				if ((self.borderSize > 0) && (borderScale < 1))
				{
					borderScale = 1;
				}
				
				var imgW = scaleW - borderScale * 2;
				var imgH = scaleH - borderScale * 2;
				
				self.setWidth(scaleW);
				self.setHeight(scaleH);
				
				self.mainDO.setWidth(scaleW);
				self.mainDO.setHeight(scaleH);
				
				if (self.borderDO)
				{
					self.borderDO.setWidth(scaleW);
					self.borderDO.setHeight(scaleH);
				}
				
				if (self.bgDO)
				{
					self.bgDO.setX(borderScale);
					self.bgDO.setY(borderScale);
					
					self.bgDO.setWidth(imgW);
					self.bgDO.setHeight(imgH);
				}
				
				self.setX(-self.thumbWidth/2);
				self.setY(-self.thumbHeight/2);
				
				if (data.thumbsAlignment == "bottom")
				{
					FWDS3DCovModTweenMax.to(self, .8, {x:Math.floor(self.newX + (self.thumbWidth - scaleW)/2), y:(-Math.floor(parent.thumbsMaxHeight/2) + (parent.thumbsMaxHeight - self.thumbHeight)) * scale, ease:Expo.easeOut});
				}
				else
				{
					FWDS3DCovModTweenMax.to(self, .8, {x:Math.floor(self.newX + (self.thumbWidth - scaleW)/2), y:-Math.floor(scaleH/2), ease:Expo.easeOut});
				}
			}
			else
			{
				self.setScale2(self.thumbScale);
				
				self.setX(-self.thumbWidth/2);
				self.setY(-self.thumbHeight/2);

				FWDS3DCovModTweenMax.to(self, .8, {x:self.newX, y:self.newY, scale:self.thumbScale, delay:del, ease:Quart.easeOut, onComplete:self.setThumbVisibility});
			}
		};
		
		this.setScale = function(scale, alpha)
		{
			self.thumbScale = scale;
			
			self.setVisible(true);
			
			if (!FWDS3DCovUtils.hasTransform2d)
			{
				var scaleW = Math.floor(self.thumbWidth * scale);
				var scaleH = Math.floor(self.thumbHeight * scale);
				var borderScale = Math.floor(self.borderSize * scale);
				
				if ((self.borderSize > 0) && (borderScale < 1))
				{
					borderScale = 1;
				}
				
				if (self.borderDO)
				{
					FWDS3DCovModTweenMax.to(self.borderDO, .8, {w:scaleW, h:scaleH, ease:Quart.easeOut});
				}
				
				if (self.bgDO)
				{
					FWDS3DCovModTweenMax.to(self.bgDO, .8, {x:borderScale, y:borderScale, w:scaleW - borderScale * 2, h:scaleH - borderScale * 2, ease:Quart.easeOut});
				}
				
				if (data.thumbsAlignment == "bottom")
				{
					FWDS3DCovModTweenMax.to(self, .8, {x:Math.floor(self.newX + (self.thumbWidth - scaleW)/2), y:(-Math.floor(parent.thumbsMaxHeight/2) + (parent.thumbsMaxHeight - self.thumbHeight)) * scale, w:scaleW, h:scaleH, alpha:alpha, ease:Quart.easeOut});
				}
				else
				{
					FWDS3DCovModTweenMax.to(self, .8, {x:Math.floor(self.newX + (self.thumbWidth - scaleW)/2), y:-Math.floor(scaleH/2), w:scaleW, h:scaleH, alpha:alpha, ease:Quart.easeOut});
				}
				
				FWDS3DCovModTweenMax.to(self.mainDO, .8, {w:scaleW, h:scaleH, ease:Quart.easeOut});
				FWDS3DCovModTweenMax.to(self.imageHolderDO, .8, {x:borderScale, y:borderScale, w:scaleW - borderScale * 2, h:scaleH - borderScale * 2, ease:Quart.easeOut});

				if (self.imageDO)
				{
					FWDS3DCovModTweenMax.to(self.imageDO, .8, {w:scaleW - borderScale * 2, h:scaleH - borderScale * 2, ease:Quart.easeOut});
				}
			}
			else
			{
				FWDS3DCovModTweenMax.to(self, .8, {x:Math.floor(self.newX), y:Math.floor(self.newY), scale:self.thumbScale, alpha:alpha, ease:Quart.easeOut, onComplete:self.setThumbVisibility});
			}
		};
		
		this.setScaleInfinite = function(scale)
		{
			self.thumbScale = scale;
			
			self.setVisible(true);
			
			if (!FWDS3DCovUtils.hasTransform2d)
			{
				var scaleW = Math.floor(self.thumbWidth * scale);
				var scaleH = Math.floor(self.thumbHeight * scale);
				var borderScale = Math.floor(self.borderSize * scale);
				
				if ((self.borderSize > 0) && (borderScale < 1))
				{
					borderScale = 1;
				}
				
				if (self.borderDO)
				{
					FWDS3DCovModTweenMax.to(self.borderDO, 0, {w:scaleW, h:scaleH, ease:Quart.easeOut});
				}
				
				if (self.bgDO)
				{
					FWDS3DCovModTweenMax.to(self.bgDO, 0, {x:borderScale, y:borderScale, w:scaleW - borderScale * 2, h:scaleH - borderScale * 2, ease:Quart.easeOut});
				}
				
				if (data.thumbsAlignment == "bottom")
				{
					FWDS3DCovModTweenMax.to(self, 0, {x:Math.floor(self.newX + (self.thumbWidth - scaleW)/2), y:(-Math.floor(parent.thumbsMaxHeight/2) + (parent.thumbsMaxHeight - self.thumbHeight)) * scale, w:scaleW, h:scaleH, ease:Quart.easeOut});
				}
				else
				{
					FWDS3DCovModTweenMax.to(self, 0, {x:Math.floor(self.newX + (self.thumbWidth - scaleW)/2), y:-Math.floor(scaleH/2), w:scaleW, h:scaleH, ease:Quart.easeOut});
				}
				
				FWDS3DCovModTweenMax.to(self.mainDO, 0, {w:scaleW, h:scaleH, ease:Quart.easeOut});
				FWDS3DCovModTweenMax.to(self.imageHolderDO, 0, {x:borderScale, y:borderScale, w:scaleW - borderScale * 2, h:scaleH - borderScale * 2, ease:Quart.easeOut});

				if (self.imageDO)
				{
					FWDS3DCovModTweenMax.to(self.imageDO, 0, {w:scaleW - borderScale * 2, h:scaleH - borderScale * 2, ease:Quart.easeOut});
				}
			}
			else
			{
				FWDS3DCovModTweenMax.to(self, 0, {x:Math.floor(self.newX), y:Math.floor(self.newY), scale:self.thumbScale, ease:Quart.easeOut});
			}
		};
		
		this.setThumbVisibility = function()
		{
			if (self.getZIndex() == 0)
			{
				self.setVisible(false);
			}
		};
		
		this.update = function()
		{
			if (parent.showRefl)
			{
				if (!self.reflCanvasDO)
				{
					self.addReflection();
				}
				else
				{
					self.reflCanvasDO.setAlpha(1);
					self.reflCanvasDO.setY(self.thumbHeight + parent.reflDist);
				}
			}
			else
			{
				if (self.reflCanvasDO)
				{
					self.reflCanvasDO.setAlpha(0);
				}
			}
			
			if (parent.showGradient)
			{
				if (!self.gradientDO)
				{
					self.setupGradient();
				}
				else
				{
					self.gradientLeftDO.setCSSGradient("left", parent.gradientColor1, parent.gradientColor2);
					
					if ((parent.topology == "onesided") || (parent.topology == "frontonesided"))
					{
						self.gradientRightDO.setCSSGradient("left", parent.gradientColor1, parent.gradientColor2);
					}
					else
					{
						self.gradientRightDO.setCSSGradient("left", parent.gradientColor2, parent.gradientColor1);
					}
					
					self.setGradient2(self.gradPos);
				}
			}
			else
			{
				if (self.gradientDO)
				{
					self.setGradient2(0);
				}
			}
		};
		
		this.updateRefl = function(sr)
		{
			if (sr)
			{
				if (!self.reflCanvasDO)
				{
					self.addReflection();
				}
				else
				{
					FWDS3DCovModTweenMax.to(self.reflCanvasDO, .8, {alpha:1, ease:Quart.easeOut});
					self.reflCanvasDO.setY(self.thumbHeight + parent.reflDist);
				}
			}
			else
			{
				if (self.reflCanvasDO)
				{
					FWDS3DCovModTweenMax.to(self.reflCanvasDO, .8, {alpha:0, ease:Quart.easeOut});
				}
			}
		};
		
		this.hide = function(del)
		{
			var imgW = self.thumbWidth - self.borderSize * 2;
			var imgH = self.thumbHeight - self.borderSize * 2;
			
			FWDS3DCovModTweenMax.to(self.imageHolderDO, .8, {x:parseInt(self.thumbWidth/2), y:parseInt(self.thumbHeight/2), w:0, h:0, delay:del, ease:Expo.easeInOut});
			
			if (self.imageDO)
			{
				FWDS3DCovModTweenMax.to(self.imageDO, .8, {x:-parseInt(imgW/2), y:-parseInt(imgH/2), delay:del, ease:Expo.easeInOut});
				
				if (self.reflCanvasDO)
				{
					FWDS3DCovModTweenMax.to(self.reflCanvasDO, .8, {alpha:0, delay:del, ease:Expo.easeInOut});
				}
			}
		};

		this.onMouseClickHandler = function()
		{
			self.dispatchEvent(FWDS3DCovThumb.CLICK, {id:self.id});
		};
		
		this.onMouseOverHandler = function(e)
		{
			if (!self.isOver2 && (self.id != parent.curId))
			{
				self.isOver2 = true;

				if (parent.showGradient && self.gradientDO)
				{
					self.setGradient2(0);
				}

				FWDS3DCovModTweenMax.to(self, .6, {z:self.curZ + parent.thumbHoverOffset, ease:Expo.easeOut});
			}
		};

		this.onMouseOutHandler = function()
		{
			if (self.isOver2 && (self.id != parent.curId))
			{
				self.isOver2 = false;
				
				if (parent.showGradient && self.gradientDO)
				{
					self.setGradient2(self.gradPos);
				}
				
				FWDS3DCovModTweenMax.to(self, .6, {z:self.curZ, ease:Expo.easeOut});
			}
		};
		
		this.onMouseTouchHandler = function(e)
		{
			if(e.preventDefault) e.preventDefault();
			
			self.dispatchEvent(FWDS3DCovThumb.CLICK, {id:self.id});
		};
		
		this.enable = function()
		{
			if (self.isEnabled)
				return;
				
			self.isEnabled = true;
			
			if (!self.isMobile && (self.curDataListAr[self.id].mediaType != "none"))
			{
				self.mainDO.setButtonMode(true);
			}
			
			if (!self.isMobile && !self.screen.addEventListener)
			{
				self.mainDO.screen.detachEvent("onclick", self.onMouseClickHandler);
			}
			
			if (self.isMobile)
			{
				if (self.hasPointerEvent)
				{
					self.mainDO.screen.addEventListener("MSPointerUp", self.onMouseTouchHandler);
				}
				else
				{
					self.mainDO.screen.addEventListener("touchend", self.onMouseTouchHandler);
				}
			}
			else
			{
				if (self.screen.addEventListener)
				{
					self.mainDO.screen.addEventListener("click", self.onMouseClickHandler);
					self.mainDO.screen.addEventListener("mouseover", self.onMouseOverHandler);
					self.mainDO.screen.addEventListener("mouseout", self.onMouseOutHandler);
				}
				else
				{
					self.mainDO.screen.attachEvent("onclick", self.onMouseClickHandler);
				}
			}
			
			clearTimeout(self.disableId);
			self.setVisible(true);
		};
		
		this.disable = function()
		{
			if (!self.isEnabled)
				return;
		
			self.isEnabled = false;
			
			self.mainDO.setButtonMode(false);
			
			if (self.isMobile)
			{
				if (self.hasPointerEvent)
				{
					self.mainDO.screen.removeEventListener("MSPointerUp", self.onMouseTouchHandler);
				}
				else
				{
					self.mainDO.screen.removeEventListener("touchend", self.onMouseTouchHandler);
				}
			}
			else
			{
				if (self.screen.removeEventListener)
				{
					self.mainDO.screen.removeEventListener("click", self.onMouseClickHandler);
					self.mainDO.screen.removeEventListener("mouseover", self.onMouseOverHandler);
					self.mainDO.screen.removeEventListener("mouseout", self.onMouseOutHandler);
				}
				else
				{
					self.mainDO.screen.detachEvent("onclick", self.onMouseClickHandler);
				}
			}
			
			clearTimeout(self.disableId);
			self.disableId = setTimeout(self.disableFinish, 800);
		};
		
		this.disableFinish = function()
		{
			self.setVisible(false);
		};
		
		/* destroy */
		this.destroy = function()
		{
			FWDS3DCovModTweenMax.killTweensOf(self);
			FWDS3DCovModTweenMax.killTweensOf(self.mainDO);
			FWDS3DCovModTweenMax.killTweensOf(self.imageHolderDO);
			
			if (self.isMobile)
			{
				if (self.hasPointerEvent)
				{
					self.mainDO.screen.removeEventListener("MSPointerUp", self.onMouseTouchHandler);
				}
				else
				{
					self.mainDO.screen.removeEventListener("touchend", self.onMouseTouchHandler);
				}
			}
			else
			{
				if (self.screen.addEventListener)
				{
					self.mainDO.screen.removeEventListener("click", self.onMouseClickHandler);
				}
				else
				{
					self.mainDO.screen.detachEvent("onclick", self.onMouseClickHandler);
				}
			}
			
			clearTimeout(self.setTextHeightId);
			
			if (self.imageDO)
			{
				FWDS3DCovModTweenMax.killTweensOf(self.imageDO);
				self.imageDO.disposeImage();
				self.imageDO.destroy();
			}

			if (self.bgDO)
			{
				FWDS3DCovModTweenMax.killTweensOf(self.bgDO);
				self.bgDO.destroy();
				self.bgDO = null;
			}
			
			if (self.borderDO)
			{
				FWDS3DCovModTweenMax.killTweensOf(self.borderDO);
				self.borderDO.destroy();
				self.borderDO = null;
			}
			
			if (self.gradientLeftDO)
			{
				FWDS3DCovModTweenMax.killTweensOf(self.gradientLeftDO);
				self.gradientLeftDO.destroy();
				self.gradientLeftDO = null;
			}
			
			if (self.gradientRightDO)
			{
				FWDS3DCovModTweenMax.killTweensOf(self.gradientRightDO);
				self.gradientRightDO.destroy();
				self.gradientRightDO = null;
			}
			
			if (self.textGradientDO)
			{
				FWDS3DCovModTweenMax.killTweensOf(self.textGradientDO);
				self.textGradientDO = null;
			}
			
			if (self.textDO)
			{
				FWDS3DCovModTweenMax.killTweensOf(self.textDO);
				self.textDO = null;
			}
			
			if (self.textHolderDO)
			{
				FWDS3DCovModTweenMax.killTweensOf(self.textHolderDO);
				self.textHolderDO = null
			}
			
			if (self.reflCanvasDO)
			{
				FWDS3DCovModTweenMax.killTweensOf(self.reflCanvasDO);
				self.reflCanvasDO = null;
			}

			self.imageHolderDO.destroy();
			self.mainDO.destroy();

			self.mainDO = null;
			self.borderDO = null;
			self.bgDO = null;
			self.imageHolderDO = null;
			self.imageDO = null;
			self.gradientDO = null;
			self.gradientLeftDO = null;
			self.gradientRightDO = null;
			self.textHolderDO = null;
			self.textGradientDO = null;
			self.textDO = null;
			
			self.id = null;
			self.data = null;
			self.parent = null;
			self.backgroundColor = null;
			self.borderColor = null;
			
			self.screen.innerHTML = "";
			prototype.destroy();
			prototype = null;
			self = null;
			FWDS3DCovThumb.prototype = null;
		};

		this.init();
	};

	/* set prototype */
	FWDS3DCovThumb.setPrototype = function()
	{
		FWDS3DCovThumb.prototype = new FWDS3DCovDisplayObject3D("div", "absolute", "visible");
	};

	FWDS3DCovThumb.CLICK = "click";

	FWDS3DCovThumb.prototype = null;
	window.FWDS3DCovThumb = FWDS3DCovThumb;
}(window));