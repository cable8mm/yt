/* thumbs manager */
(function(window)
{
	var FWDS3DCovThumbsManager = function(data, parent)
	{
		var self = this;
		var prototype = FWDS3DCovThumbsManager.prototype;

		this.data = data;
		this.parent = parent;
		
		this.stageWidth = parent.stageWidth;
		this.stageHeight = parent.stageHeight;
		
		this.thumbsHolderDO;

		this.totalThumbs;
		this.thumbsAr = [];
		
		this.nrThumbsToDisplay = data.nrThumbsToDisplay;
		this.infiniteLoop = data.infiniteLoop;
		
		this.dataListId = data.startAtCategory;
		
		this.curDataListAr;
		
		this.dragCurId;
		this.prevCurId;
		this.curId;
		
		this.startPos = data.coverflowStartPosition;
		
		this.thumbWidth = data.thumbWidth;
		this.thumbHeight = data.thumbHeight;
		
		this.borderSize = data.thumbBorderSize;
		
		this.perspective;
		this.sizeRatio;
		
		this.countLoadedThumbsLeft;
		this.countLoadedThumbsRight;
		
		this.controlsDO;
		this.prevButtonDO;
		this.nextButtonDO;
		this.scrollbarDO;
		this.slideshowButtonDO;
		this.textDO;
		
		this.controlsHeight = data.nextButtonNImg.height;
		this.controlsOffset = data.controlsOffset;
		
		this.showText = self.data.showText;
		this.textOffset = self.data.textOffset;
		
		this.thumbXSpace3D = data.thumbXSpace3D;
		this.thumbXOffset3D = data.thumbXOffset3D;
		this.thumbZSpace3D = data.thumbZSpace3D;
		this.thumbZOffset3D = data.thumbZOffset3D;
		this.thumbYAngle3D = data.thumbYAngle3D;
		this.thumbXSpace2D = data.thumbXSpace2D;
		this.thumbXOffset2D = data.thumbXOffset2D;
		this.thumbHoverOffset = data.thumbHoverOffset;
		
		this.topology = data.coverflowTopology;
		
		this.xRot = -data.coverflowXRotation;
		this.yRot = -data.coverflowYRotation;
		
		this.showGradient = data.showGradient;
		this.gradientColor1 = data.gradientColor1;
		this.gradientColor2 = data.gradientColor2;

		this.showTooltip = data.showTooltip;
		this.dynTooltip = data.dynTooltip;
		
		this.showRefl = data.showRefl;
		this.reflHeight = data.reflHeight;
		this.reflDist = data.reflDist;
		this.reflAlpha = data.reflAlpha;
		
		this.introFinished = false;
		this.isPlaying = false;
		this.disableThumbClick = false;
		this.isTextSet = false;
		this.allowToSwitchCat = false;
		this.isTransition = false;
		this.isTextSet = false;
		
		this.showSlideshowButton = data.showSlideshowButton;
		
		this.hasPointerEvent = FWDS3DCovUtils.hasPointerEvent;
		this.isMobile = FWDS3DCovUtils.isMobile;

		this.loadWithDelayIdLeft;
		this.loadWithDelayIdRight;
		this.slideshowTimeoutId;
		this.textTimeoutId;
		this.zSortingId;
		this.hideThumbsFinishedId;
		this.loadImagesId;
		this.setTextHeightId;
		this.setIntroFinishedId;
		this.showControlsId;

		/* init */
		this.init = function()
		{
			self.thumbsHolderDO = new FWDS3DCovDisplayObject3D("div", "absolute", "visible");
			self.addChild(self.thumbsHolderDO);
			
			if(!FWDS3DCovUtils.isEdge) self.thumbsHolderDO.setZ(100000);
			
			self.thumbsHolderDO.setX(Math.floor(self.stageWidth/2));
			self.thumbsHolderDO.setY(Math.floor(self.stageHeight/2));
			
			self.setWidth(self.stageWidth);
			self.setHeight(self.stageHeight);
			
			if ((!self.isMobile && !FWDS3DCovUtils.isSafari) || FWDS3DCovUtils.isAndroidAndWebkit)
			{
				self.thumbsHolderDO.setPreserve3D();
			}
			
			self.thumbsHolderDO.setAngleX(self.xRot);
			self.thumbsHolderDO.setAngleY(self.yRot);
			
			if (!self.isMobile)
			{
				if (self.screen.addEventListener)
				{
					window.addEventListener("mousemove", self.onThumbMove);
				}
				else
				{
					document.attachEvent("onmousemove", self.onThumbMove);
				}
			}
			
			if (self.hasPointerEvent)
			{
				window.addEventListener("MSPointerMove", self.onThumbMove);
			}
			
			self.showScrollbar = data.showScrollbar;
			self.showNextButton = data.showNextButton;
			self.showPrevButton = data.showPrevButton;
			
			if (self.isMobile)
			{
				if (data.disableScrollbarOnMobile)
				{
					self.showScrollbar = false;
				}
				
				if (data.disableNextAndPrevButtonsOnMobile)
				{
					self.showNextButton = false;
					self.showPrevButton = false;
				}	
			}
			
			if (self.nrThumbsToDisplay == 0)
			{
				self.infiniteLoop = false;
			}

			self.showCurrentCat(-1);
			
			if (self.showText)
			{
				self.setupText();
			}
			
			if (self.data.autoplay)
			{
				self.showSlideshowButton = true;
			}
			
			self.setupControls();
		};
		
		this.onThumbMove = function(e)
		{
			if (self.disableThumbClick)
				return;
			
			var vmc = FWDS3DCovUtils.getViewportMouseCoordinates(e);
			
			self.thumbMouseX = vmc.screenX - parent.rect.left - (self.stageWidth - self.curDataListAr[self.curId].thumbWidth)/2;
			self.thumbMouseY = vmc.screenY - parent.rect.top - (self.stageHeight - self.thumbsMaxHeight + (self.thumbsMaxHeight - self.curDataListAr[self.curId].thumbHeight) * 2)/2;

			if (self.showTooltip && !self.isTransition)
			{
				self.thumbsAr[self.curId].checkThumbOver(e);
			}
		};
		
		//##############################################//
		/* show current cat */
		//##############################################//
		this.showCurrentCat = function(id)
		{
			if ((id != self.dataListId) && (id >= 0))
			{
				self.allowToSwitchCat = false;
				self.hideCurrentCat();
				self.dataListId = id;
				
				return;
			}
			
			self.thumbsAr = [];
			self.curDataListAr = self.data.dataListAr[self.dataListId];
			self.totalThumbs = self.curDataListAr.length;
			
			if (self.totalThumbs == 0)
			{
				var message = "This category doesn't contain any thumbnails!";

				self.dispatchEvent(FWDS3DCovThumbsManager.LOAD_ERROR, {text : message});
				
				return;
			}
			
			if (self.isMobile)
			{
				self.totalThumbs = Math.min(self.totalThumbs, data.maxNumberOfThumbsOnMobile);
			}
			
			if (typeof(self.startPos) == "number")
			{
				self.startPos = Math.floor(self.startPos) - 1;
				
				if (self.startPos < 0)
				{
					self.startPos = Math.floor((self.totalThumbs-1)/2);
				}
				else if (self.startPos > self.totalThumbs-1)
				{
					self.startPos = Math.floor((self.totalThumbs-1)/2);
				}
				
				self.curId = self.startPos;
			}
			else
			{
				switch (self.startPos)
				{
					case "left":
						self.curId = 0;
						break;
					case "right":
						self.curId = self.totalThumbs-1;
						break;
					default:
						self.curId = Math.floor((self.totalThumbs-1)/2);
				}
			}
			
			if (self.showScrollbar && self.scrollbarDO)
			{
				self.scrollbarDO.totalItems = self.totalThumbs;
				self.scrollbarDO.curItemId = self.curId;
				self.scrollbarDO.gotoItem2();
			}
			
			self.setThumbsMaxHeight();
			
			self.setPerspectiveAndSizeRatio();
			
			self.setupThumbs();
			
			self.prevCurId = self.curId;
			
			self.startIntro();
		};
		
		this.setThumbsMaxHeight = function()
		{
			self.thumbsMaxHeight = 0;
			
			for (var i=0; i<self.totalThumbs; i++)
			{
				if (self.curDataListAr[i].thumbHeight > self.thumbsMaxHeight)
				{
					self.thumbsMaxHeight = self.curDataListAr[i].thumbHeight;
				}
			}
		};
		
		this.setPerspectiveAndSizeRatio = function()
		{
			var thumbWSum = 0;
			
			for (var i=0; i<self.totalThumbs; i++)
			{
				thumbWSum += self.curDataListAr[i].thumbWidth;
			}
			
			self.avgThumbWidth = thumbWSum / self.totalThumbs;
			
			self.perspective = self.avgThumbWidth * 4;
			self.sizeRatio = self.avgThumbWidth / 200;
			
			self.thumbsHolderDO.setPerspective(self.perspective);
		};
		
		//################################################//
		/* hide current cat */
		//################################################//
		this.hideCurrentCat = function()
		{
			clearTimeout(self.loadWithDelayIdLeft);
			clearTimeout(self.loadWithDelayIdRight);
			clearTimeout(self.textTimeoutId);
			clearInterval(self.zSortingId);
			clearTimeout(self.hideThumbsFinishedId);
			clearTimeout(self.loadImagesId);
			clearTimeout(self.setIntroFinishedId);
			clearTimeout(self.showControlsId);
			clearTimeout(self.transitionId);
			
			self.stopSlideshow();
			
			self.disableThumbClick = true;
			
			if (self.isMobile)
			{
				self.removeMobileDrag();
			}
			
			if (self.image)
			{
				self.image.onload = null;
				self.image.onerror = null;
			}
			
			if (self.imageLeft)
			{
				self.imageLeft.onload = null;
				self.imageLeft.onerror = null;
			}
			
			if (self.imageRight)
			{
				self.imageRight.onload = null;
				self.imageRight.onerror = null;
			}
			
			self.hideThumbs();
		};
		
		this.hideThumbs = function()
		{
			var delay;
			var delayDelta;
			var newX = -self.thumbWidth/2;
			var maxNrOfSideThumbs = Math.max(self.totalThumbs - self.curId, self.curId);
			
			if (self.nrThumbsToDisplay > 0)
			{
				delayDelta = Math.floor(1000/self.nrThumbsToDisplay);
			}
			else
			{
				delayDelta = Math.floor(1000/maxNrOfSideThumbs);
			}
			
			for (var i=0; i<self.totalThumbs; i++)
			{
				thumb = self.thumbsAr[i];
				
				if (i == self.curId)
				{
					self.hideThumbsFinishedId = setTimeout(self.hideThumbsFinished, 1000 + 500);
				}
				else if (self.infiniteLoop)
				{
					if (Math.abs(i - self.curId) <= self.nrThumbsToDisplay)
					{
						delay = Math.abs(self.nrThumbsToDisplay - Math.abs(i - self.curId) + 1) * delayDelta;
						FWDS3DCovModTweenMax.to(thumb, .5, {x:Math.floor(newX), delay:delay/1000, ease:Expo.easeIn});
						thumb.hide((delay - 250)/1000);
					}
					else if (Math.abs(Math.abs(i - self.curId) - self.totalThumbs) <= self.nrThumbsToDisplay)
					{
						delay = Math.abs(self.nrThumbsToDisplay - Math.abs(Math.abs(i - self.curId) - self.totalThumbs) + 1) * delayDelta;
						FWDS3DCovModTweenMax.to(thumb, .5, {x:Math.floor(newX), delay:delay/1000, ease:Expo.easeIn});
						thumb.hide((delay - 250)/1000);
					}
				}
				else if ((self.nrThumbsToDisplay > 0) && (Math.abs(i - self.curId) <= self.nrThumbsToDisplay))
				{
					delay = Math.abs(self.nrThumbsToDisplay - Math.abs(i - self.curId) + 1) * delayDelta;
					FWDS3DCovModTweenMax.to(thumb, .5, {x:Math.floor(newX), delay:delay/1000, ease:Expo.easeIn});
					thumb.hide((delay - 250)/1000);
				}
				else
				{
					delay = Math.abs(maxNrOfSideThumbs - Math.abs(i - self.curId) + 1) * delayDelta;
					FWDS3DCovModTweenMax.to(thumb, .5, {x:Math.floor(newX), delay:delay/1000, ease:Expo.easeIn});
					thumb.hide((delay - 250)/1000);
				}
			}
		};
		
		this.hideThumbsFinished = function()
		{
			for (var i=0; i<self.totalThumbs; i++)
			{
				thumb = self.thumbsAr[i];
				
				if (i == self.curId)
				{
					thumb.hide(0);
					
					FWDS3DCovModTweenMax.to(thumb, .6, {alpha:0, delay:.2, onComplete:self.allThumbsAreTweened});
					
					if (self.textDO)
					{
						FWDS3DCovModTweenMax.to(self.textDO, .6, {alpha:0, delay:.2, ease:Expo.easeOut});
					}
				}
				else
				{
					thumb.setAlpha(0);
				}
			}
		};
		
		this.allThumbsAreTweened = function()
		{
			self.destroyCurrentCat();
			self.showCurrentCat();
		};
		
		this.destroyCurrentCat = function()
		{
			var thumb;
			
			for (var i=0; i<self.totalThumbs; i++)
			{
				thumb = self.thumbsAr[i];
				FWDS3DCovModTweenMax.killTweensOf(thumb);
				self.thumbsHolderDO.removeChild(thumb);
				thumb.destroy();
				thumb = null;
			}
		};
		
		this.startIntro = function()
		{
			self.disableThumbClick = true;
			
			thumb = self.thumbsAr[self.curId];
			
			var newX;
			var newY;
			
			if (self.data.thumbsAlignment == "bottom")
			{
				newX = -Math.floor(self.curDataListAr[self.curId].thumbWidth/2);
				newY = -Math.floor(self.thumbsMaxHeight/2) + (self.thumbsMaxHeight - self.curDataListAr[self.curId].thumbHeight);
			}
			else
			{
				newX = -Math.floor(self.curDataListAr[self.curId].thumbWidth/2);
				newY = -Math.floor(self.curDataListAr[self.curId].thumbHeight/2);
			}
			
			thumb.setGradient(0);
			
			thumb.setX(Math.floor(newX));
			thumb.setY(Math.floor(newY));
			
			thumb.setAlpha(0);
			FWDS3DCovModTweenMax.to(thumb, .8, {alpha:1});
			
			self.thumbsHolderDO.addChild(thumb);
			
			self.loadCenterImage();
			self.loadImagesId = setTimeout(self.loadImages, 600);
		};

		/* setup thumbs */
		this.setupThumbs = function()
		{
			var thumb;
			
			for (var i=0; i<self.totalThumbs; i++)
			{
				FWDS3DCovThumb.setPrototype();
				
				thumb = new FWDS3DCovThumb(i, self.data, self);
				
				self.thumbsAr.push(thumb);
				
				thumb.addListener(FWDS3DCovThumb.CLICK, self.onThumbClick);
			}
		};
		
		this.onThumbClick = function(e)
		{
			if (self.disableThumbClick)
				return;
			
			self.curId = e.id;
			
			self.thumbClickHandler();
		};
		
		this.thumbClickHandler = function()
		{
			if (self.curId != self.prevCurId)
			{
				self.gotoThumb();
			}
			else
			{
				var type = self.curDataListAr[self.curId].mediaType;
				var tempId = self.curId;
				
				if (type == "none")
				{
					return;
				}
				
				if (type != "link")
				{
					for (var i=0; i<self.totalThumbs; i++)
					{
						if ((i < self.curId) && ((self.curDataListAr[i].mediaType == "link") || (self.curDataListAr[i].mediaType == "none")))
						{
							tempId -= 1;
						}
					};
				}
				
				if (type == "link")
				{
					window.open(self.curDataListAr[self.curId].secondObj.url, self.curDataListAr[self.curId].secondObj.target);
				}
				else
				{
					self.dispatchEvent(FWDS3DCovThumbsManager.THUMB_CLICK, {id:tempId});
				}
			}
		};
		
		this.resizeHandler = function()
		{
			if ((self.stageWidth == parent.stageWidth) && (self.stageHeight == parent.stageHeight))
					return;
			
			self.stageWidth = parent.stageWidth;
			self.stageHeight = parent.stageHeight;
			
			self.thumbsHolderDO.setX(Math.floor(self.stageWidth/2));
			self.thumbsHolderDO.setY(Math.floor(self.stageHeight/2));
			
			self.setWidth(self.stageWidth);
			self.setHeight(self.stageHeight);
			
			self.positionControls();
			
			if (self.textDO)
			{
				self.textDO.setX(Math.floor((self.stageWidth - self.thumbWidth)/2));
				
				if (self.data.thumbsAlignment == "bottom")
				{
					self.textDO.setY(Math.floor(self.stageHeight/2 + self.thumbsMaxHeight/2 + self.textOffset));
				}
				else
				{
					self.textDO.setY(Math.floor(self.stageHeight/2 + self.curDataListAr[self.curId].thumbHeight/2 + self.textOffset));
				}
			}
		};
		
		this.setupText = function()
		{
			self.textDO = new FWDS3DCovSimpleDisplayObject("div");
			self.addChild(self.textDO);
			
			self.textDO.getStyle().fontSmoothing = "antialiased";
			self.textDO.getStyle().webkitFontSmoothing = "antialiased";
			self.textDO.getStyle().textRendering = "optimizeLegibility";
			
			self.textDO.setWidth(self.thumbWidth - self.borderSize * 2);
			
			self.textDO.setX(Math.floor((self.stageWidth - self.thumbWidth)/2));
			
			if (self.data.thumbsAlignment == "bottom")
			{
				self.textDO.setY(Math.floor(self.stageHeight/2 + self.thumbsMaxHeight/2 + self.textOffset));
			}
			else
			{
				self.textDO.setY(Math.floor(self.stageHeight/2 + self.curDataListAr[self.curId].thumbHeight/2 + self.textOffset));
			}
		};
		
		this.addThumbText = function()
		{
			if (self.textDO)
			{
				self.textDO.setInnerHTML(self.curDataListAr[self.curId].thumbText);
				
				if (self.data.thumbsAlignment == "bottom")
				{
					self.textDO.setY(Math.floor(self.stageHeight/2 + self.thumbsMaxHeight/2 + self.textOffset));
				}
				else
				{
					self.textDO.setY(Math.floor(self.stageHeight/2 + self.curDataListAr[self.curId].thumbHeight/2 + self.textOffset));
				}
				
				self.textDO.setAlpha(0);
		
				FWDS3DCovModTweenMax.killTweensOf(self.textDO);
				FWDS3DCovModTweenMax.to(self.textDO, .8, {alpha:1, ease:Expo.easeOut});
			}	
		};
		
		this.removeThumbText = function()
		{
			FWDS3DCovModTweenMax.killTweensOf(self.textDO);
			FWDS3DCovModTweenMax.to(self.textDO, .8, {alpha:0, ease:Expo.easeOut});
		};
		
		this.loadImages = function()
		{
			if (FWDS3DCovUtils.hasTransform3d && !self.data.showDisplay2DAlways)
			{	
				self.setupIntro3D();
			}
			else
			{
				self.setupIntro2D();
			}
			
			self.countLoadedThumbsLeft = self.curId - 1;
			self.loadWithDelayIdLeft = setTimeout(self.loadThumbImageLeft, 100);
			
			self.countLoadedThumbsRight = self.curId + 1;
			self.loadWithDelayIdRight = setTimeout(self.loadThumbImageRight, 100);
		};
		
		this.loadCenterImage = function()
		{
			self.imagePath = self.curDataListAr[self.curId].thumbPath;

			self.image = new Image();
			self.image.onerror = self.onImageLoadErrorHandler;
			self.image.onload = self.onImageLoadHandlerCenter;
			self.image.src = self.imagePath;
		};
		
		this.onImageLoadHandlerCenter = function(e)
		{
			var thumb = self.thumbsAr[self.curId];
			
			thumb.addImage(self.image);
			
			if (FWDS3DCovUtils.hasTransform3d && !self.data.showDisplay2DAlways)
			{
				thumb.showThumb3D();
			}
			else
			{
				thumb.showThumb2D();
			}
			
			if (self.showText)
			{
				self.isTextSet = true;

				self.addThumbText();
			}
		};

		this.loadThumbImageLeft = function()
		{
			if (self.countLoadedThumbsLeft < 0)
			{
				if (self.infiniteLoop)
				{
					self.countLoadedThumbsLeft += self.totalThumbs;
				}
				else
				{
					return;
				}
			}
			
			if (self.thumbsAr[self.countLoadedThumbsLeft].hasImage)
				return;
				
			self.thumbsAr[self.countLoadedThumbsLeft].hasImage = true;
			
			self.imagePath = self.curDataListAr[self.countLoadedThumbsLeft].thumbPath;

			self.imageLeft = new Image();
			self.imageLeft.onerror = self.onImageLoadErrorHandler;
			self.imageLeft.onload = self.onImageLoadHandlerLeft;
			self.imageLeft.src = self.imagePath;
		};

		this.onImageLoadHandlerLeft = function(e)
		{
			var thumb = self.thumbsAr[self.countLoadedThumbsLeft];

			thumb.addImage(self.imageLeft);
			
			if (FWDS3DCovUtils.hasTransform3d && !self.data.showDisplay2DAlways)
			{
				thumb.showThumb3D();
			}
			else
			{
				thumb.showThumb2D();
			}
			
			self.countLoadedThumbsLeft--;
			
			self.loadWithDelayIdLeft = setTimeout(self.loadThumbImageLeft, 200);
		};
		
		this.loadThumbImageRight = function()
		{
			if (self.countLoadedThumbsRight > self.totalThumbs-1)
			{				
				if (self.infiniteLoop)
				{
					self.countLoadedThumbsRight -= self.totalThumbs;
				}
				else
				{
					return;
				}
			}
			
			if (self.thumbsAr[self.countLoadedThumbsRight].hasImage)
				return;
				
			self.thumbsAr[self.countLoadedThumbsRight].hasImage = true;
			
			self.imagePath = self.curDataListAr[self.countLoadedThumbsRight].thumbPath;

			self.imageRight = new Image();
			self.imageRight.onerror = self.onImageLoadErrorHandler;
			self.imageRight.onload = self.onImageLoadHandlerRight;
			self.imageRight.src = self.imagePath;
		};

		this.onImageLoadHandlerRight = function(e)
		{
			var thumb = self.thumbsAr[self.countLoadedThumbsRight];

			thumb.addImage(self.imageRight);

			if (FWDS3DCovUtils.hasTransform3d && !self.data.showDisplay2DAlways)
			{
				thumb.showThumb3D();
			}
			else
			{
				thumb.showThumb2D();
			}
			
			self.countLoadedThumbsRight++;
			
			self.loadWithDelayIdRight = setTimeout(self.loadThumbImageRight, 200);
		};

		this.onImageLoadErrorHandler = function(e)
		{
			if (!self || !self.data)
				return;

			var message = "Thumb can't be loaded, probably the path is incorrect <font color='#FFFFFF'>" + self.imagePath + "</font>";

			self.dispatchEvent(FWDS3DCovThumbsManager.LOAD_ERROR, {text : message});
		};
		
		this.setupIntro3D = function()
		{
			var newX;
			var newY;
			var newZ;
			
			var newAngleX;
			var newAngleY;
			var newAlpha;
			
			var delay;
			
			for (var i=0; i<self.totalThumbs; i++)
			{
				thumb = self.thumbsAr[i];
				
				newX = 0;
				newY = 0;
				newZ = 0;
				
				newAngleX = .1;
				newAngleY = 0;
				
				newAlpha = 1;
				
				if (i != self.curId)
				{
					if (self.data.thumbsAlignment == "bottom")
					{
						newX = -Math.floor(self.curDataListAr[i].thumbWidth/2);
						newY = -Math.floor(self.thumbsMaxHeight/2) + (self.thumbsMaxHeight - self.curDataListAr[i].thumbHeight);
					}
					else
					{
						newX = -Math.floor(self.curDataListAr[i].thumbWidth/2);
						newY = -Math.floor(self.curDataListAr[i].thumbHeight/2);
					}
					
					thumb.setX(Math.floor(newX));
					thumb.setY(Math.floor(newY));
				}
				
				var sgn = 0;
				
				if (i < self.curId)
				{
					sgn = -1;
				}
				else if (i > self.curId)
				{
					sgn = 1;
				}
				
				switch (self.topology)
				{
					case "onesided":
						if (i != self.curId)
						{
							if ((self.nrThumbsToDisplay > 0) && (Math.abs(i - self.curId) <= self.nrThumbsToDisplay))
							{
								newX = (self.thumbXSpace3D * Math.abs(i - self.curId) + self.thumbXOffset3D);
								
								if (i < self.curId)
								{
									newZ = -((self.thumbZSpace3D + 1) * (i - self.curId) - self.thumbZOffset3D);
								}
								else
								{
									newZ = -((self.thumbZSpace3D + 1) * (i - self.curId) + self.thumbZOffset3D);
								}

								newAngleY = -self.thumbYAngle3D * sgn;
							}
							else
							{
								if (self.nrThumbsToDisplay > 0)
								{
									newX = (self.thumbXSpace3D * (self.nrThumbsToDisplay + 1) + self.thumbXOffset3D);
									
									if (i < self.curId)
									{
										newZ = -((self.thumbZSpace3D + 1) * (self.nrThumbsToDisplay + 1) * sgn - self.thumbZOffset3D);
									}
									else
									{
										newZ = -((self.thumbZSpace3D + 1) * (self.nrThumbsToDisplay + 1) * sgn + self.thumbZOffset3D);
									}

									newAngleY = -self.thumbYAngle3D * sgn;
									
									newAlpha = 0;
								}
								else
								{
									newX = (self.thumbXSpace3D * Math.abs(i - self.curId) + self.thumbXOffset3D);
									
									if (i < self.curId)
									{
										newZ = -((self.thumbZSpace3D + 1) * (i - self.curId) - self.thumbZOffset3D);
									}
									else
									{
										newZ = -((self.thumbZSpace3D + 1) * (i - self.curId) + self.thumbZOffset3D);
									}

									newAngleY = -self.thumbYAngle3D * sgn;
								}
							}
						}
						break;
					case "frontonesided":
						if (i != self.curId)
						{
							if ((self.nrThumbsToDisplay > 0) && (Math.abs(i - self.curId) <= self.nrThumbsToDisplay))
							{
								if (i < self.curId)
								{
									newX = 0;
									newZ = 1000;
									
									newAlpha = 0;
								}
								else
								{
									newX = (self.thumbXSpace3D * Math.abs(i - self.curId) + self.thumbXOffset3D);
									newZ = -((self.thumbZSpace3D + 1) * (i - self.curId) + self.thumbZOffset3D);
								}
								
								newAngleY = -self.thumbYAngle3D * sgn;
							}
							else
							{
								if (self.nrThumbsToDisplay > 0)
								{
									newX = (self.thumbXSpace3D * (self.nrThumbsToDisplay + 1) + self.thumbXOffset3D);
									newZ = -((self.thumbZSpace3D + 1) * (self.nrThumbsToDisplay + 1) + self.thumbZOffset3D);
									newAngleY = -self.thumbYAngle3D * sgn;
									
									if (i < self.curId)
									{
										newX = 0;
										newZ = 1000;
										
										newAlpha = 0;
									}
									else
									{
										newX = (self.thumbXSpace3D * (self.nrThumbsToDisplay + 1) + self.thumbXOffset3D);
										newZ = -((self.thumbZSpace3D + 1) * (self.nrThumbsToDisplay + 1) * sgn + self.thumbZOffset3D);
									}
									
									newAngleY = -self.thumbYAngle3D * sgn;
									
									newAlpha = 0;
								}
								else
								{
									if (i < self.curId)
									{
										newX = 0;
										newZ = 1000;
										
										newAlpha = 0;
									}
									else
									{
										newX = (self.thumbXSpace3D * Math.abs(i - self.curId) + self.thumbXOffset3D);
										newZ = -((self.thumbZSpace3D + 1) * (i - self.curId) + self.thumbZOffset3D);
									}
									
									newAngleY = -self.thumbYAngle3D * sgn;
								}
							}
						}
						break;
					case "crosssided":
						if (i != self.curId)
						{
							if ((self.nrThumbsToDisplay > 0) && (Math.abs(i - self.curId) <= self.nrThumbsToDisplay))
							{
								if (i < self.curId)
								{
									newX = -(self.thumbXSpace3D * Math.abs(i - self.curId) + self.thumbXOffset3D);
									newZ = -((self.thumbZSpace3D + 1) * (i - self.curId) - self.thumbZOffset3D);
								}
								else
								{
									newX = (self.thumbXSpace3D * Math.abs(i - self.curId) + self.thumbXOffset3D);
									newZ = -((self.thumbZSpace3D + 1) * (i - self.curId) + self.thumbZOffset3D);
								}
								
								newAngleY = -self.thumbYAngle3D * sgn;
							}
							else
							{
								if (self.nrThumbsToDisplay > 0)
								{
									if (i < self.curId)
									{
										newX = -(self.thumbXSpace3D * (self.nrThumbsToDisplay + 1) + self.thumbXOffset3D);
										newZ = -((self.thumbZSpace3D + 1) * (self.nrThumbsToDisplay + 1) * sgn - self.thumbZOffset3D);
									}
									else
									{
										newX = (self.thumbXSpace3D * (self.nrThumbsToDisplay + 1) + self.thumbXOffset3D);
										newZ = -((self.thumbZSpace3D + 1) * (self.nrThumbsToDisplay + 1) * sgn + self.thumbZOffset3D);
									}
									
									newAngleY = -self.thumbYAngle3D * sgn;
									
									newAlpha = 0;
								}
								else
								{
									if (i < self.curId)
									{
										newX = -(self.thumbXSpace3D * Math.abs(i - self.curId) + self.thumbXOffset3D);
										newZ = -((self.thumbZSpace3D + 1) * (i - self.curId) - self.thumbZOffset3D);
									}
									else
									{
										newX = (self.thumbXSpace3D * Math.abs(i - self.curId) + self.thumbXOffset3D);
										newZ = -((self.thumbZSpace3D + 1) * (i - self.curId) + self.thumbZOffset3D);
									}
									
									newAngleY = -self.thumbYAngle3D * sgn;
								}
							}
						}
						break;
					case "accordion":
						if (i != self.curId)
						{
							if ((self.nrThumbsToDisplay > 0) && (Math.abs(i - self.curId) <= self.nrThumbsToDisplay))
							{
								if (Math.abs(i - self.curId) % 2 == 0)
								{
									newX = self.thumbWidth*3/4 * Math.abs(i - self.curId) * sgn;
									newZ = -self.thumbWidth * Math.sqrt(3)/4 * Math.abs(i - self.curId);
									
									newAngleY = 0;
								}
								else
								{
									newX = (self.thumbWidth*3/4 * (Math.abs(i - self.curId)-1) + self.thumbWidth*3/4) * sgn;
									newZ = -self.thumbWidth * Math.sqrt(3)/4 * Math.abs(i - self.curId);
									
									newAngleY = 60 * sgn;
								}
							}
							else
							{
								if (self.nrThumbsToDisplay > 0)
								{
									newX = (self.thumbXSpace3D * (self.nrThumbsToDisplay + 1) + self.thumbXOffset3D);
									newZ = -((self.thumbZSpace3D + 1) * (self.nrThumbsToDisplay + 1) + self.thumbZOffset3D);
									newAngleY = -self.thumbYAngle3D * sgn;
									
									if (Math.abs(i - self.curId) % 2 == 0)
									{
										newX = self.thumbWidth*3/4 * (self.nrThumbsToDisplay + 1) * sgn;
										newZ = -self.thumbWidth * Math.sqrt(3)/4 * (self.nrThumbsToDisplay + 1);
										
										newAngleY = 0;
									}
									else
									{
										newX = (self.thumbWidth*3/4 * ((self.nrThumbsToDisplay + 1)-1) + self.thumbWidth*3/4) * sgn;
										newZ = -self.thumbWidth * Math.sqrt(3)/4 * (self.nrThumbsToDisplay + 1);
										
										newAngleY = 60 * sgn;
									}
									
									newAlpha = 0;
								}
								else
								{
									if (Math.abs(i - self.curId) % 2 == 0)
									{
										newX = self.thumbWidth*3/4 * Math.abs(i - self.curId) * sgn;
										newZ = -self.thumbWidth * Math.sqrt(3)/4 * Math.abs(i - self.curId);
										
										newAngleY = 0;
									}
									else
									{
										newX = (self.thumbWidth*3/4 * (Math.abs(i - self.curId)-1) + self.thumbWidth*3/4) * sgn;
										newZ = -self.thumbWidth * Math.sqrt(3)/4 * Math.abs(i - self.curId);
										
										newAngleY = 60 * sgn;
									}
								}
							}
						}
						break;
					case "flipping":
						if (i != self.curId)
						{
							if (i < self.curId)
							{
								newAngleX = -90;
							}
							else
							{
								if (newAngleX > 90)
								{
									newAngleX = 90;
									newAlpha = 0;
								}
								else
								{
									newAngleX = 10 * Math.abs(i - self.curId);
								}
							}
							
							newX = 0;
							newY = 0;
							newZ = 0;
							
							thumb.updateRefl(false);
						}
						break;
					default:
						if (i != self.curId)
						{
							if (self.infiniteLoop)
							{
								if (Math.abs(i - self.curId) <= self.nrThumbsToDisplay)
								{
									newX = (self.thumbXSpace3D * Math.abs(i - self.curId) + self.thumbXOffset3D) * sgn;
									newZ = -((self.thumbZSpace3D + 1) * Math.abs(i - self.curId) + self.thumbZOffset3D);
									
									newAngleY = -self.thumbYAngle3D * sgn;
								}
								else if (Math.abs(Math.abs(i - self.curId) - self.totalThumbs) <= self.nrThumbsToDisplay)
								{
									sgn *= -1;
								
									newX = (self.thumbXSpace3D * Math.abs(Math.abs(i - self.curId) - self.totalThumbs) + self.thumbXOffset3D) * sgn;
									newZ = -((self.thumbZSpace3D + 1) * Math.abs(Math.abs(i - self.curId) - self.totalThumbs) + self.thumbZOffset3D);
									
									newAngleY = -self.thumbYAngle3D * sgn;
								}
								else
								{
									sgn = -self.getDir(i);
									
									newX = (self.thumbXSpace3D * (self.nrThumbsToDisplay + 1) + self.thumbXOffset3D) * sgn;
									newZ = -((self.thumbZSpace3D + 1) * (self.nrThumbsToDisplay + 1) + self.thumbZOffset3D);
									
									newAngleY = -self.thumbYAngle3D * sgn;
									
									newAlpha = 0;
								}
							}
							else
							{
								if (self.nrThumbsToDisplay > 0)
								{
									if (Math.abs(i - self.curId) <= self.nrThumbsToDisplay)
									{
										newX = (self.thumbXSpace3D * Math.abs(i - self.curId) + self.thumbXOffset3D) * sgn;
										newZ = -((self.thumbZSpace3D + 1) * Math.abs(i - self.curId) + self.thumbZOffset3D);
									
										newAngleY = -self.thumbYAngle3D * sgn;
									}
									else
									{
										newX = (self.thumbXSpace3D * (self.nrThumbsToDisplay + 1) + self.thumbXOffset3D) * sgn;
										newZ = -((self.thumbZSpace3D + 1) * (self.nrThumbsToDisplay + 1) + self.thumbZOffset3D);
										
										newAngleY = -self.thumbYAngle3D * sgn;
										
										newAlpha = 0;
									}
								}
								else
								{
									newX = (self.thumbXSpace3D * Math.abs(i - self.curId) + self.thumbXOffset3D) * sgn;
									newZ = -((self.thumbZSpace3D + 1) * Math.abs(i - self.curId) + self.thumbZOffset3D);
										
									newAngleY = -self.thumbYAngle3D * sgn;
								}
							}
						}
				}
				
				if (self.topology != "accordion")
				{
					newX *= self.sizeRatio;
					newZ *= self.sizeRatio;
				}
				
				newY = 0;
				
				if (self.data.thumbsAlignment == "bottom")
				{
					newX = Math.floor(newX) - Math.floor(self.curDataListAr[i].thumbWidth/2);
					newY = Math.floor(newY) - Math.floor(self.thumbsMaxHeight/2) + (self.thumbsMaxHeight - self.curDataListAr[i].thumbHeight);
				}
				else
				{
					newX = Math.floor(newX) - Math.floor(self.curDataListAr[i].thumbWidth/2);
					newY = Math.floor(newY) - Math.floor(self.curDataListAr[i].thumbHeight/2);
				}

				thumb.setZ(Math.floor(newZ));
				
				if (self.infiniteLoop)
				{
					if (Math.abs(Math.abs(i - self.curId) - self.totalThumbs) <= self.nrThumbsToDisplay)
					{
						delay = Math.abs(Math.abs(i - self.curId) - self.totalThumbs) * Math.floor(1000/(self.totalThumbs/2));
					}
					else
					{
						delay = Math.abs(i - self.curId) * Math.floor(1000/(self.totalThumbs/2));
					}
				}
				else
				{
					delay = Math.abs(i - self.curId) * Math.floor(1000/(self.totalThumbs/2));
				}
				
				FWDS3DCovModTweenMax.to(thumb, .8, {x:Math.floor(newX), y:Math.floor(newY), z:Math.floor(newZ), angleX:newAngleX, angleY:newAngleY, alpha:newAlpha, delay:delay/1000, ease:Quart.easeOut});
				
				if (self.infiniteLoop)
				{
					if (newAlpha == 0)
					{
						thumb.disable();
					}
					else
					{
						thumb.enable();
					}
				}
				else
				{
					if (self.nrThumbsToDisplay > 0)
					{
						if (Math.abs(i - self.curId) <= self.nrThumbsToDisplay)
						{
							thumb.enable();
						}
						else
						{
							thumb.disable();
						}
					}
				}
				
				thumb.setGradient(sgn);	
				thumb.curZ = Math.floor(newZ);	
				
				self.thumbsHolderDO.addChild(thumb);
			}
			
			if (FWDS3DCovUtils.isIEAndMoreThen9 || !FWDS3DCovUtils.hasTransform3d || self.data.showDisplay2DAlways)
			{
				self.sortZ();
			}
			
			self.setIntroFinishedId = setTimeout(self.setIntroFinished, delay + 800);
			self.showControlsId = setTimeout(self.showControls, delay);
		};
		
		this.setupIntro2D = function()
		{
			var newX;
			var newY;
			var newScale;
			var delay;
			
			for (var i=0; i<self.totalThumbs; i++)
			{
				thumb = self.thumbsAr[i];
				
				newX = 0;
				newY = 0;

				newScale = 1;
				
				var sgn = 0;
				
				if (i < self.curId)
				{
					sgn = -1;
				}
				else if (i > self.curId)
				{
					sgn = 1;
				}
				
				if ((self.nrThumbsToDisplay <= 0) || (self.nrThumbsToDisplay > 13))
				{
					self.nrThumbsToDisplay = 13;
				}
				
				if (i != self.curId)
				{
					if (self.infiniteLoop)
					{
						if (Math.abs(i - self.curId) <= self.nrThumbsToDisplay)
						{
							newX = (self.thumbXSpace2D * Math.abs(i - self.curId) + self.thumbXOffset2D) * sgn;
							newScale = Math.max(.9 - Math.abs(i - self.curId) * .05, .25);
							
							delay = Math.abs(i - self.curId) * Math.floor(1000/self.nrThumbsToDisplay);
							
							thumb.setZIndex(self.nrThumbsToDisplay + 1 - Math.abs(i - self.curId));
						}
						else if (Math.abs(Math.abs(i - self.curId) - self.totalThumbs) <= self.nrThumbsToDisplay)
						{
							sgn *= -1;
							
							newX = (self.thumbXSpace2D * Math.abs(Math.abs(i - self.curId) - self.totalThumbs) + self.thumbXOffset2D) * sgn;
							newScale = Math.max(.9 - Math.abs(Math.abs(i - self.curId) - self.totalThumbs) * .05, .25);
							
							delay = Math.abs(Math.abs(i - self.curId) - self.totalThumbs) * Math.floor(1000/self.nrThumbsToDisplay);
							
							thumb.setZIndex(self.nrThumbsToDisplay + 1 - Math.abs(Math.abs(i - self.curId) - self.totalThumbs));
						}
						else
						{
							sgn = -self.getDir(i);
							
							newX = (self.thumbXSpace2D * (self.nrThumbsToDisplay + 1) + self.thumbXOffset2D) * sgn;
							newScale = Math.max(.9 - (self.nrThumbsToDisplay + 1) * .05, .25);
							
							delay = 0;
							
							thumb.setAlpha(0);
							thumb.setZIndex(0);
							thumb.disable();
						}
					}
					else
					{
						if ((Math.abs(i - self.curId) <= self.nrThumbsToDisplay))
						{
							newX = (self.thumbXSpace2D * Math.abs(i - self.curId) + self.thumbXOffset2D) * sgn;
							newScale = Math.max(.9 - Math.abs(i - self.curId) * .05, .25);
							
							delay = Math.abs(i - self.curId) * Math.floor(1000/self.nrThumbsToDisplay);
							
							thumb.setZIndex(self.nrThumbsToDisplay + 1 - Math.abs(i - self.curId));
						}
						else
						{
							newX = (self.thumbXSpace2D * (self.nrThumbsToDisplay + 1) + self.thumbXOffset2D) * sgn;
							newScale = Math.max(.9 - (self.nrThumbsToDisplay + 1) * .05, .25);	
							
							delay = 0;
							
							thumb.setAlpha(0);
							thumb.setZIndex(0);
							thumb.disable();
						}
					}
				}
				else
				{
					thumb.setZIndex(self.nrThumbsToDisplay + 1);
				}
				
				newX *= self.sizeRatio;
						
				if (self.data.thumbsAlignment == "bottom")
				{
					newX = Math.floor(newX) - Math.floor(self.curDataListAr[i].thumbWidth/2);
					newY = Math.floor(newY) - Math.floor(self.thumbsMaxHeight/2) + (self.thumbsMaxHeight - self.curDataListAr[i].thumbHeight);
				}
				else
				{
					newX = Math.floor(newX) - Math.floor(self.curDataListAr[i].thumbWidth/2);
					newY = Math.floor(newY) - Math.floor(self.curDataListAr[i].thumbHeight/2);
				}
				
				thumb.newX = Math.floor(newX);
				thumb.newY = Math.floor(newY);
				
				thumb.showThumbIntro2D(newScale, delay/1000);
				
				thumb.setGradient(sgn);	
				
				self.thumbsHolderDO.addChild(thumb);
			}
			
			self.setIntroFinishedId = setTimeout(self.setIntroFinished, delay + 800);
			self.showControlsId = setTimeout(self.showControls, delay);
		};
		
		this.setIntroFinished = function()
		{
			self.introFinished = true;
			self.allowToSwitchCat = true;
			self.disableThumbClick = false;
			
			self.dispatchEvent(FWDS3DCovThumbsManager.THUMBS_INTRO_FINISH);
			
			if (self.isMobile)
			{
				self.setupMobileDrag();
			}
			
			if (FWDS3DCovUtils.isIEAndMoreThen9 || !FWDS3DCovUtils.hasTransform3d || self.data.showDisplay2DAlways)
			{
				self.zSortingId = setInterval(self.sortZ, 16);
			}
			
			if (self.data.autoplay)
			{
				if (self.slideshowButtonDO)
				{
					self.slideshowButtonDO.onClick();
					self.slideshowButtonDO.onMouseOut();
				}
			}
		};
		
		this.gotoThumb = function()
		{
			if (!self.introFinished)
				return;

			if (self.showScrollbar && !self.scrollbarDO.isPressed)
			{
				self.scrollbarDO.gotoItem(self.curId, true);
			}

			if (self.isPlaying)
			{
				clearTimeout(self.slideshowTimeoutId);
				self.slideshowTimeoutId = setTimeout(self.startTimeAgain, self.data.transitionDelay);
				
				if (self.slideshowButtonDO.isCounting)
				{
					self.slideshowButtonDO.resetCounter();
				}
			}
			
			if (self.showText)
			{
				if (self.isTextSet)
				{
					self.isTextSet = false;

					self.removeThumbText();
					
					clearTimeout(self.textTimeoutId);
					self.textTimeoutId = setTimeout(self.setThumbText, 800);
				}
				else
				{
					clearTimeout(self.textTimeoutId);
					self.textTimeoutId = setTimeout(self.setThumbText, 800);
				}
			}
			
			self.isTransition = true;
			
			clearTimeout(self.transitionId);
			self.transitionId = setTimeout(self.setTransition, 800);

			if (FWDS3DCovUtils.hasTransform3d && !self.data.showDisplay2DAlways)
			{	
				self.gotoThumb3D();
			}
			else
			{
				self.gotoThumb2D();
			}
			
			self.hideTooltip();
			
			self.prevCurId = self.curId;
			
			self.dispatchEvent(FWDS3DCovThumbsManager.THUMB_CHANGE, {id:self.curId});
		};
		
		this.setTransition = function()
		{
			self.isTransition = false;
		};
		
		this.setThumbText = function()
		{
			self.isTextSet = true;
			
			self.addThumbText();
		};
		
		this.gotoThumb3D = function()
		{
			var newX;
			var newY;
			var newZ;
			
			var newAngleX;
			var newAngleY;
			var newAlpha;
			
			var tweenThumb;
			
			for (var i=0; i<self.totalThumbs; i++)
			{
				thumb = self.thumbsAr[i];
				
				newX = 0;
				newY = 0;
				newZ = 0;
				
				newAngleX = .1;
				newAngleY = 0;
				newAlpha = 1;
				
				tweenThumb = true;
				
				var sgn = 0;
				
				if (i < self.curId)
				{
					sgn = -1;
				}
				else if (i > self.curId)
				{
					sgn = 1;
				}
				
				if ((i == self.curId) && self.showRefl)
				{
					thumb.updateRefl(true);
				}
				
				switch (self.topology)
				{
					case "onesided":
						if (i != self.curId)
						{
							if ((self.nrThumbsToDisplay > 0) && (Math.abs(i - self.curId) <= self.nrThumbsToDisplay))
							{
								newX = (self.thumbXSpace3D * Math.abs(i - self.curId) + self.thumbXOffset3D);
								
								if (i < self.curId)
								{
									newZ = -((self.thumbZSpace3D + 1) * (i - self.curId) - self.thumbZOffset3D);
								}
								else
								{
									newZ = -((self.thumbZSpace3D + 1) * (i - self.curId) + self.thumbZOffset3D);
								}

								newAngleY = -self.thumbYAngle3D * sgn;
							}
							else
							{
								if (self.nrThumbsToDisplay > 0)
								{
									newX = (self.thumbXSpace3D * (self.nrThumbsToDisplay + 1) + self.thumbXOffset3D);
									
									if (i < self.curId)
									{
										newZ = -((self.thumbZSpace3D + 1) * (self.nrThumbsToDisplay + 1) * sgn - self.thumbZOffset3D);
									}
									else
									{
										newZ = -((self.thumbZSpace3D + 1) * (self.nrThumbsToDisplay + 1) * sgn + self.thumbZOffset3D);
									}

									newAngleY = -self.thumbYAngle3D * sgn;
									
									newAlpha = 0;
								}
								else
								{
									newX = (self.thumbXSpace3D * Math.abs(i - self.curId) + self.thumbXOffset3D);
									
									if (i < self.curId)
									{
										newZ = -((self.thumbZSpace3D + 1) * (i - self.curId) - self.thumbZOffset3D);
									}
									else
									{
										newZ = -((self.thumbZSpace3D + 1) * (i - self.curId) + self.thumbZOffset3D);
									}

									newAngleY = -self.thumbYAngle3D * sgn;
								}
							}
						}
						break;
					case "frontonesided":
						if (i != self.curId)
						{
							if ((self.nrThumbsToDisplay > 0) && (Math.abs(i - self.curId) <= self.nrThumbsToDisplay))
							{
								if (i < self.curId)
								{
									newX = 0;
									newZ = 1000;
									
									newAlpha = 0;
								}
								else
								{
									newX = (self.thumbXSpace3D * Math.abs(i - self.curId) + self.thumbXOffset3D);
									newZ = -((self.thumbZSpace3D + 1) * (i - self.curId) + self.thumbZOffset3D);
								}
								
								newAngleY = -self.thumbYAngle3D * sgn;
							}
							else
							{
								if (self.nrThumbsToDisplay > 0)
								{
									newX = (self.thumbXSpace3D * (self.nrThumbsToDisplay + 1) + self.thumbXOffset3D);
									newZ = -((self.thumbZSpace3D + 1) * (self.nrThumbsToDisplay + 1) + self.thumbZOffset3D);
									newAngleY = -self.thumbYAngle3D * sgn;
									
									if (i < self.curId)
									{
										newX = 0;
										newZ = 1000;
										
										newAlpha = 0;
									}
									else
									{
										newX = (self.thumbXSpace3D * (self.nrThumbsToDisplay + 1) + self.thumbXOffset3D);
										newZ = -((self.thumbZSpace3D + 1) * (self.nrThumbsToDisplay + 1) * sgn + self.thumbZOffset3D);
									}
									
									newAngleY = -self.thumbYAngle3D * sgn;
									
									newAlpha = 0;
								}
								else
								{
									if (i < self.curId)
									{
										newX = 0;
										newZ = 1000;
										
										newAlpha = 0;
									}
									else
									{
										newX = (self.thumbXSpace3D * Math.abs(i - self.curId) + self.thumbXOffset3D);
										newZ = -((self.thumbZSpace3D + 1) * (i - self.curId) + self.thumbZOffset3D);
									}
									
									newAngleY = -self.thumbYAngle3D * sgn;
								}
							}
						}
						break;
					case "crosssided":
						if (i != self.curId)
						{
							if ((self.nrThumbsToDisplay > 0) && (Math.abs(i - self.curId) <= self.nrThumbsToDisplay))
							{
								if (i < self.curId)
								{
									newX = -(self.thumbXSpace3D * Math.abs(i - self.curId) + self.thumbXOffset3D);
									newZ = -((self.thumbZSpace3D + 1) * (i - self.curId) - self.thumbZOffset3D);
								}
								else
								{
									newX = (self.thumbXSpace3D * Math.abs(i - self.curId) + self.thumbXOffset3D);
									newZ = -((self.thumbZSpace3D + 1) * (i - self.curId) + self.thumbZOffset3D);
								}
								
								newAngleY = -self.thumbYAngle3D * sgn;
							}
							else
							{
								if (self.nrThumbsToDisplay > 0)
								{
									if (i < self.curId)
									{
										newX = -(self.thumbXSpace3D * (self.nrThumbsToDisplay + 1) + self.thumbXOffset3D);
										newZ = -((self.thumbZSpace3D + 1) * (self.nrThumbsToDisplay + 1) * sgn - self.thumbZOffset3D);
									}
									else
									{
										newX = (self.thumbXSpace3D * (self.nrThumbsToDisplay + 1) + self.thumbXOffset3D);
										newZ = -((self.thumbZSpace3D + 1) * (self.nrThumbsToDisplay + 1) * sgn + self.thumbZOffset3D);
									}
									
									newAngleY = -self.thumbYAngle3D * sgn;
									
									newAlpha = 0;
								}
								else
								{
									if (i < self.curId)
									{
										newX = -(self.thumbXSpace3D * Math.abs(i - self.curId) + self.thumbXOffset3D);
										newZ = -((self.thumbZSpace3D + 1) * (i - self.curId) - self.thumbZOffset3D);
									}
									else
									{
										newX = (self.thumbXSpace3D * Math.abs(i - self.curId) + self.thumbXOffset3D);
										newZ = -((self.thumbZSpace3D + 1) * (i - self.curId) + self.thumbZOffset3D);
									}
									
									newAngleY = -self.thumbYAngle3D * sgn;
								}
							}
						}
						break;
					case "accordion":
						if (i != self.curId)
						{
							if ((self.nrThumbsToDisplay > 0) && (Math.abs(i - self.curId) <= self.nrThumbsToDisplay))
							{
								if (Math.abs(i - self.curId) % 2 == 0)
								{
									newX = self.thumbWidth*3/4 * Math.abs(i - self.curId) * sgn;
									newZ = -self.thumbWidth * Math.sqrt(3)/4 * Math.abs(i - self.curId);
									
									newAngleY = 0;
								}
								else
								{
									newX = (self.thumbWidth*3/4 * (Math.abs(i - self.curId)-1) + self.thumbWidth*3/4) * sgn;
									newZ = -self.thumbWidth * Math.sqrt(3)/4 * Math.abs(i - self.curId);
									
									newAngleY = 60 * sgn;
								}
							}
							else
							{
								if (self.nrThumbsToDisplay > 0)
								{
									newX = (self.thumbXSpace3D * (self.nrThumbsToDisplay + 1) + self.thumbXOffset3D);
									newZ = -((self.thumbZSpace3D + 1) * (self.nrThumbsToDisplay + 1) + self.thumbZOffset3D);
									newAngleY = -self.thumbYAngle3D * sgn;
									
									if (Math.abs(i - self.curId) % 2 == 0)
									{
										newX = self.thumbWidth*3/4 * (self.nrThumbsToDisplay + 1) * sgn;
										newZ = -self.thumbWidth * Math.sqrt(3)/4 * (self.nrThumbsToDisplay + 1);
										
										newAngleY = 0;
									}
									else
									{
										newX = (self.thumbWidth*3/4 * ((self.nrThumbsToDisplay + 1)-1) + self.thumbWidth*3/4) * sgn;
										newZ = -self.thumbWidth * Math.sqrt(3)/4 * (self.nrThumbsToDisplay + 1);
										
										newAngleY = 60 * sgn;
									}
									
									newAlpha = 0;
								}
								else
								{
									if (Math.abs(i - self.curId) % 2 == 0)
									{
										newX = self.thumbWidth*3/4 * Math.abs(i - self.curId) * sgn;
										newZ = -self.thumbWidth * Math.sqrt(3)/4 * Math.abs(i - self.curId);
										
										newAngleY = 0;
									}
									else
									{
										newX = (self.thumbWidth*3/4 * (Math.abs(i - self.curId)-1) + self.thumbWidth*3/4) * sgn;
										newZ = -self.thumbWidth * Math.sqrt(3)/4 * Math.abs(i - self.curId);
										
										newAngleY = 60 * sgn;
									}
								}
							}
						}
						break;
					case "flipping":
						if (i != self.curId)
						{
							if (i < self.curId)
							{
								newAngleX = -90;
							}
							else
							{
								if (newAngleX > 90)
								{
									newAngleX = 90;
									newAlpha = 0;
								}
								else
								{
									newAngleX = 10 * Math.abs(i - self.curId);
								}
							}
							
							thumb.updateRefl(false);
						}
						break;
					default:
						if (i != self.curId)
						{
							if (self.infiniteLoop)
							{
								if (Math.abs(i - self.curId) <= self.nrThumbsToDisplay)
								{
									newX = (self.thumbXSpace3D * Math.abs(i - self.curId) + self.thumbXOffset3D) * sgn;
									newZ = -((self.thumbZSpace3D + 1) * Math.abs(i - self.curId) + self.thumbZOffset3D);
									
									newAngleY = -self.thumbYAngle3D * sgn;
									
									if (thumb.curAlpha == 0)
									{
										var tempSgn = -self.getDir(i);
										
										var tempNewX = (self.thumbXSpace3D * (self.nrThumbsToDisplay + 1) + self.thumbXOffset3D) * tempSgn;
										var tempNewZ = -((self.thumbZSpace3D + 1) * (self.nrThumbsToDisplay + 1) + self.thumbZOffset3D);
										
										var tempNewAngleY = -self.thumbYAngle3D * tempSgn;
										
										tempNewX *= self.sizeRatio;
										tempNewZ *= self.sizeRatio;
										
										if (self.data.thumbsAlignment == "bottom")
										{
											tempNewX = Math.floor(tempNewX) - Math.floor(self.curDataListAr[i].thumbWidth/2);
										}
										else
										{
											tempNewX = Math.floor(tempNewX) - Math.floor(self.curDataListAr[i].thumbWidth/2);
										}
										
										thumb.setX(tempNewX);
										thumb.setZ(tempNewZ);
										thumb.setAngleY(tempNewAngleY);
									}
								}
								else if (Math.abs(Math.abs(i - self.curId) - self.totalThumbs) <= self.nrThumbsToDisplay)
								{
									sgn *= -1;
								
									newX = (self.thumbXSpace3D * Math.abs(Math.abs(i - self.curId) - self.totalThumbs) + self.thumbXOffset3D) * sgn;
									newZ = -((self.thumbZSpace3D + 1) * Math.abs(Math.abs(i - self.curId) - self.totalThumbs) + self.thumbZOffset3D);
									
									newAngleY = -self.thumbYAngle3D * sgn;
									
									if (thumb.curAlpha == 0)
									{
										var tempSgn = -self.getDir(i);
										
										var tempNewX = (self.thumbXSpace3D * (self.nrThumbsToDisplay + 1) + self.thumbXOffset3D) * tempSgn;
										var tempNewZ = -((self.thumbZSpace3D + 1) * (self.nrThumbsToDisplay + 1) + self.thumbZOffset3D);
										
										var tempNewAngleY = -self.thumbYAngle3D * tempSgn;
										
										tempNewX *= self.sizeRatio;
										tempNewZ *= self.sizeRatio;
										
										if (self.data.thumbsAlignment == "bottom")
										{
											tempNewX = Math.floor(tempNewX) - Math.floor(self.curDataListAr[i].thumbWidth/2);
										}
										else
										{
											tempNewX = Math.floor(tempNewX) - Math.floor(self.curDataListAr[i].thumbWidth/2);
										}
										
										thumb.setX(tempNewX);
										thumb.setZ(tempNewZ);
										thumb.setAngleY(tempNewAngleY);
									}
								}
								else
								{
									sgn = -self.getDir(i);
									
									newX = (self.thumbXSpace3D * (self.nrThumbsToDisplay + 1) + self.thumbXOffset3D) * sgn;
									newZ = -((self.thumbZSpace3D + 1) * (self.nrThumbsToDisplay + 1) + self.thumbZOffset3D);
									
									newAngleY = -self.thumbYAngle3D * sgn;
									
									newAlpha = 0;
									
									if (thumb.curAlpha == 0)
									{
										tweenThumb = false;
									}
								}
							}
							else
							{
								if (self.nrThumbsToDisplay > 0)
								{
									if (Math.abs(i - self.curId) <= self.nrThumbsToDisplay)
									{
										newX = (self.thumbXSpace3D * Math.abs(i - self.curId) + self.thumbXOffset3D) * sgn;
										newZ = -((self.thumbZSpace3D + 1) * Math.abs(i - self.curId) + self.thumbZOffset3D);
									
										newAngleY = -self.thumbYAngle3D * sgn;
									}
									else
									{
										newX = (self.thumbXSpace3D * (self.nrThumbsToDisplay + 1) + self.thumbXOffset3D) * sgn;
										newZ = -((self.thumbZSpace3D + 1) * (self.nrThumbsToDisplay + 1) + self.thumbZOffset3D);
										
										newAngleY = -self.thumbYAngle3D * sgn;
										
										newAlpha = 0;
									}
								}
								else
								{
									newX = (self.thumbXSpace3D * Math.abs(i - self.curId) + self.thumbXOffset3D) * sgn;
									newZ = -((self.thumbZSpace3D + 1) * Math.abs(i - self.curId) + self.thumbZOffset3D);
										
									newAngleY = -self.thumbYAngle3D * sgn;
								}
							}
						}
				}
				
				if (self.topology != "accordion")
				{
					newX *= self.sizeRatio;
					newZ *= self.sizeRatio;
				}
				
				if (self.data.thumbsAlignment == "bottom")
				{
					newX = Math.floor(newX) - Math.floor(self.curDataListAr[i].thumbWidth/2);
					newY = Math.floor(newY) - Math.floor(self.thumbsMaxHeight/2) + (self.thumbsMaxHeight - self.curDataListAr[i].thumbHeight);
				}
				else
				{
					newX = Math.floor(newX) - Math.floor(self.curDataListAr[i].thumbWidth/2);
					newY = Math.floor(newY) - Math.floor(self.curDataListAr[i].thumbHeight/2);
				}
				
				if (tweenThumb)
				{
					FWDS3DCovModTweenMax.killTweensOf(thumb);
					FWDS3DCovModTweenMax.to(thumb, .8, {x:Math.floor(newX), y:Math.floor(newY), z:Math.floor(newZ), angleX:newAngleX, angleY:newAngleY, alpha:newAlpha, ease:Quart.easeOut});
				}
				
				if (self.infiniteLoop)
				{
					if (newAlpha == 0)
					{
						thumb.disable();
					}
					else
					{
						thumb.enable();
					}
				}
				else
				{
					if (self.nrThumbsToDisplay > 0)
					{
						if (Math.abs(i - self.curId) <= self.nrThumbsToDisplay)
						{
							thumb.enable();
						}
						else
						{
							thumb.disable();
						}
					}
				}
				
				thumb.curX = Math.floor(newX);
				thumb.curZ = Math.floor(newZ);
				thumb.curAlpha = newAlpha;
				thumb.setGradient(sgn);
			}
		};
		
		this.getDir = function(id)
		{
			var dir;
			
			if (id < self.curId)
			{
				if (self.curId - id <= Math.floor(self.totalThumbs/2))
				{
					dir = 1;
				}
				else
				{
					dir = -1;
				}
			}
			else
			{
				if (id - self.curId <= Math.floor(self.totalThumbs/2))
				{
					dir = -1;
				}
				else
				{
					dir = 1;
				}
			}
			
			return dir;
		};
		
		this.gotoThumb2D = function()
		{
			var newX;
			var newY;
			
			var newScale;
			var newAlpha;
			var tweenThumb;
			
			for (var i=0; i<self.totalThumbs; i++)
			{
				thumb = self.thumbsAr[i];
				
				newX = 0;
				newY = 0;

				newScale = 1;
				newAlpha = 1;
				
				tweenThumb = true;
				
				var sgn = 0;
				
				if (i < self.curId)
				{
					sgn = -1;
				}
				else if (i > self.curId)
				{
					sgn = 1;
				}
				
				if ((self.nrThumbsToDisplay <= 0) || (self.nrThumbsToDisplay > 13))
				{
					self.nrThumbsToDisplay = 13;
				}
				
				if (i != self.curId)
				{
					if (self.infiniteLoop)
					{
						if (Math.abs(i - self.curId) <= self.nrThumbsToDisplay)
						{
							newX = (self.thumbXSpace2D * Math.abs(i - self.curId) + self.thumbXOffset2D) * sgn;
							newScale = Math.max(.9 - Math.abs(i - self.curId) * .05, .25);
							
							if (thumb.curAlpha == 0)
							{
								var tempSgn = -self.getDir(i);
								
								var tempNewX = (self.thumbXSpace2D * (self.nrThumbsToDisplay + 1) + self.thumbXOffset2D) * tempSgn;
								var tempNewScale = Math.max(.9 - (self.nrThumbsToDisplay + 1) * .05, .25);
								
								tempNewX *= self.sizeRatio;
								
								if (self.data.thumbsAlignment == "bottom")
								{
									tempNewX = Math.floor(tempNewX) - Math.floor(self.curDataListAr[i].thumbWidth/2);
								}
								else
								{
									tempNewX = Math.floor(tempNewX) - Math.floor(self.curDataListAr[i].thumbWidth/2);
								}
								
								thumb.newX = Math.floor(tempNewX);
								
								thumb.setScaleInfinite(tempNewScale);
							}
						}
						else if (Math.abs(Math.abs(i - self.curId) - self.totalThumbs) <= self.nrThumbsToDisplay)
						{
							sgn *= -1;
							
							newX = (self.thumbXSpace2D * Math.abs(Math.abs(i - self.curId) - self.totalThumbs) + self.thumbXOffset2D) * sgn;
							newScale = Math.max(.9 - Math.abs(Math.abs(i - self.curId) - self.totalThumbs) * .05, .25);
							
							if (thumb.curAlpha == 0)
							{
								var tempSgn = -self.getDir(i);
								
								var tempNewX = (self.thumbXSpace2D * (self.nrThumbsToDisplay + 1) + self.thumbXOffset2D) * tempSgn;
								var tempNewScale = Math.max(.9 - (self.nrThumbsToDisplay + 1) * .05, .25);
								
								tempNewX *= self.sizeRatio;
								
								if (self.data.thumbsAlignment == "bottom")
								{
									tempNewX = Math.floor(tempNewX) - Math.floor(self.curDataListAr[i].thumbWidth/2);
								}
								else
								{
									tempNewX = Math.floor(tempNewX) - Math.floor(self.curDataListAr[i].thumbWidth/2);
								}
								
								thumb.newX = Math.floor(tempNewX);
									
								thumb.setScaleInfinite(tempNewScale);
							}
						}
						else
						{
							sgn = -self.getDir(i);
							
							newX = (self.thumbXSpace2D * (self.nrThumbsToDisplay + 1) + self.thumbXOffset2D) * sgn;
							newScale = Math.max(.9 - (self.nrThumbsToDisplay + 1) * .05, .25);
							
							newAlpha = 0;
							
							if (thumb.curAlpha == 0)
							{
								tweenThumb = false;
							}
						}
					}
					else
					{
						if ((Math.abs(i - self.curId) <= self.nrThumbsToDisplay))
						{
							newX = (self.thumbXSpace2D * Math.abs(i - self.curId) + self.thumbXOffset2D) * sgn;
							newScale = Math.max(.9 - Math.abs(i - self.curId) * .05, .25);
						}
						else
						{
							newX = (self.thumbXSpace2D * (self.nrThumbsToDisplay + 1) + self.thumbXOffset2D) * sgn;
							newScale = Math.max(.9 - (self.nrThumbsToDisplay + 1) * .05, .25);

							newAlpha = 0;
						}
					}
				}
				
				newX *= self.sizeRatio;
				
				if (self.data.thumbsAlignment == "bottom")
				{
					newX = Math.floor(newX) - Math.floor(self.curDataListAr[i].thumbWidth/2);
					newY = Math.floor(newY) - Math.floor(self.thumbsMaxHeight/2) + (self.thumbsMaxHeight - self.curDataListAr[i].thumbHeight);
				}
				else
				{
					newX = Math.floor(newX) - Math.floor(self.curDataListAr[i].thumbWidth/2);
					newY = Math.floor(newY) - Math.floor(self.curDataListAr[i].thumbHeight/2);
				}
				
				thumb.newX = Math.floor(newX);
				thumb.newY = Math.floor(newY);
					
				if (tweenThumb)
				{
					thumb.setScale(newScale, newAlpha);
				}
				
				if (self.infiniteLoop)
				{
					if (newAlpha == 0)
					{
						thumb.disable();
					}
					else
					{
						thumb.enable();
					}
				}
				else
				{
					if (Math.abs(i - self.curId) <= self.nrThumbsToDisplay)
					{
						thumb.enable();
					}
					else
					{
						thumb.disable();
					}
				}
				
				thumb.curAlpha = newAlpha;
				thumb.setGradient(sgn);
			}
		};
		
		this.sortZ = function()
		{
			var minX = 10000;
			var centerId;
			var zIndex;
			
			for (var i=0; i<self.totalThumbs; i++)
			{
				thumb = self.thumbsAr[i];
				
				var tx = thumb.getX() + Math.floor(self.curDataListAr[i].thumbWidth/2);
				
				if (Math.abs(tx) < minX)
				{
					minX = Math.abs(tx);
					centerId = i;
				}
			}
			
			var x1 = self.thumbsAr[0].curX;
			var x2 = self.thumbsAr[self.totalThumbs-1].curX;
			
			var s = 0;
			
			for (var i=1; i<self.totalThumbs-1; i++)
			{
				thumb = self.thumbsAr[i];
				
				if ((thumb.curX == x1) || (thumb.curX == x2))
				{
					s++;
				}
			}
			
			if ((s > self.totalThumbs/2) && (self.topology != "flipping") && FWDS3DCovUtils.hasTransform3d && !self.data.showDisplay2DAlways)
			{
				for (var i=0; i<self.totalThumbs; i++)
				{
					thumb = self.thumbsAr[i];
					
					zIndex = Math.floor(thumb.getZ());
					
					if (zIndex != thumb.getZIndex())
					{
						thumb.setZIndex(zIndex);
					}
				}
			}
			else
			{
				for (var i=0; i<self.totalThumbs; i++)
				{
					thumb = self.thumbsAr[i];
					
					if (self.infiniteLoop)
					{
						if (Math.abs(i - centerId) <= self.nrThumbsToDisplay)
						{
							zIndex = self.nrThumbsToDisplay + 1 - Math.abs(i - centerId);
						}
						else if (Math.abs(Math.abs(i - centerId) - self.totalThumbs) <= self.nrThumbsToDisplay)
						{
							zIndex = self.nrThumbsToDisplay + 1 - Math.abs(Math.abs(i - centerId) - self.totalThumbs);
						}
						else
						{
							zIndex = 0;
						}
					}
					else
					{
						if (self.nrThumbsToDisplay > 0)
						{
							if (Math.abs(i - centerId) <= self.nrThumbsToDisplay)
							{
								zIndex = self.nrThumbsToDisplay + 1 - Math.abs(i - centerId);
							}
							else
							{
								zIndex = 0;
							}
						}
						else
						{
							zIndex = Math.floor(self.totalThumbs/2) - Math.abs(i - centerId);
						}
					}
					
					if (zIndex != thumb.getZIndex())
					{
						thumb.setZIndex(zIndex);
					}
				}
			}
		};
		
		this.hideTooltip = function()
		{
			for (var i=0; i<self.totalThumbs; i++)
			{
				self.thumbsAr[i].hideTooltip();
			}
		};
		
		this.setupControls = function()
		{
			self.controlsDO = new FWDS3DCovDisplayObject3D("div");
			self.addChild(self.controlsDO);
			
			self.controlsDO.setZ(200000);
			
			self.controlsWidth = self.data.prevButtonNImg.width;
			
			if (self.showScrollbar)
			{
				self.setupScrollbar();
			}
			
			if (self.showPrevButton)
			{
				self.setupPrevButton();
			}
			
			if (self.showNextButton)
			{
				self.setupNextButton();
			}
			
			if (self.showSlideshowButton)
			{
				self.setupSlideshowButton();
			}
			
			if (self.data.enableMouseWheelScroll)
			{
				self.addMouseWheelSupport();
			}
			
			if (self.data.addKeyboardSupport)
			{
				self.addKeyboardSupport();
			}

			if (self.showScrollbar)
			{
				self.controlsWidth -= self.scrollbarDO.getWidth();
				self.scrollbarDO.scrollbarMaxWidth -=  self.controlsWidth;
				self.scrollbarDO.resize2();
				self.scrollbarDO.resize(self.stageWidth, self.controlsWidth);
				
				var newX = self.scrollbarDO.getX() + self.scrollbarDO.getWidth() + 1;

				if (self.showNextButton)
				{
					self.nextButtonDO.setX(newX);
					
					newX += self.nextButtonDO.getWidth() + 1;
				}
				
				if (data.showSlideshowButton)
				{
					self.slideshowButtonDO.setX(newX);
				}
			}
			
			if (self.showScrollbar)
			{
				self.controlsDO.setX(Math.floor((self.stageWidth - (self.controlsWidth + self.scrollbarDO.getWidth()))/2));
				self.controlsDO.setWidth(self.controlsWidth + self.scrollbarDO.getWidth());
			}
			else
			{
				self.controlsDO.setX(Math.floor((self.stageWidth - self.controlsWidth)/2));
				self.controlsDO.setWidth(self.controlsWidth);
			}
			
			if (self.data.controlsPos)
			{
				self.controlsDO.setY(-self.controlsHeight);
			}
			else
			{
				self.controlsDO.setY(self.stageHeight);
			}
			
			self.controlsDO.setHeight(self.data.prevButtonNImg.height);
		};
		
		this.showControls = function()
		{
			if (self.data.controlsPos)
			{
				FWDS3DCovModTweenMax.to(self.controlsDO, .8, {y:self.controlsOffset, ease : Expo.easeOut});
			}
			else
			{
				FWDS3DCovModTweenMax.to(self.controlsDO, .8, {y:self.stageHeight - self.controlsHeight - self.controlsOffset, ease : Expo.easeOut});
			}
		};
		
		this.positionControls = function()
		{
			if (self.showScrollbar)
			{
				self.scrollbarDO.resize(self.stageWidth, self.controlsWidth);
				
				var newX = self.scrollbarDO.getX() + self.scrollbarDO.getWidth() + 1;

				if (self.showNextButton)
				{
					self.nextButtonDO.setX(newX);
					
					newX += self.nextButtonDO.getWidth() + 1;
				}
				
				if (data.showSlideshowButton)
				{
					self.slideshowButtonDO.setX(newX);
				}
			}

			if (self.showScrollbar)
			{
				self.controlsDO.setX(Math.floor((self.stageWidth - (self.controlsWidth + self.scrollbarDO.getWidth()))/2));
				self.controlsDO.setWidth(self.controlsWidth + self.scrollbarDO.getWidth());
			}
			else
			{
				self.controlsDO.setX(Math.floor((self.stageWidth - self.controlsWidth)/2));
				self.controlsDO.setWidth(self.controlsWidth);
			}
			
			if (self.data.controlsPos)
			{
				self.controlsDO.setY(self.controlsOffset);
			}
			else
			{
				self.controlsDO.setY(self.stageHeight - self.controlsHeight - self.controlsOffset);
			}
		};
		
		this.setupPrevButton = function()
		{
			FWDS3DCovSimpleButton.setPrototype();
			
			self.prevButtonDO = new FWDS3DCovSimpleButton(self.data.prevButtonNImg, self.data.prevButtonSImg);
			self.prevButtonDO.addListener(FWDS3DCovSimpleButton.CLICK, self.prevButtonOnClickHandler);
			self.controlsDO.addChild(self.prevButtonDO);
		};
		
		this.prevButtonOnClickHandler = function()
		{
			if (self.infiniteLoop)
			{
				if (self.curId == 0)
				{
					self.curId = self.totalThumbs-1;
				}
				else
				{
					self.curId--;
				}
				
				self.gotoThumb();
			}
			else
			{
				if (self.curId > 0)
				{
					self.curId--;
					self.gotoThumb();
				}
			}
		};
		
		this.setupNextButton = function()
		{
			FWDS3DCovSimpleButton.setPrototype();
			
			self.nextButtonDO = new FWDS3DCovSimpleButton(self.data.nextButtonNImg, self.data.nextButtonSImg);
			self.nextButtonDO.addListener(FWDS3DCovSimpleButton.CLICK, self.nextButtonOnClickHandler);
			self.controlsDO.addChild(self.nextButtonDO);
			
			self.nextButtonDO.setX(self.controlsWidth + 1);
			self.controlsWidth += self.nextButtonDO.getWidth() + 1;
		};
		
		this.nextButtonOnClickHandler = function()
		{	
			if (self.infiniteLoop)
			{
				if (self.curId == self.totalThumbs-1)
				{
					self.curId = 0;
				}
				else
				{
					self.curId++;
				}
				
				self.gotoThumb();
			}
			else
			{
				if (self.curId < self.totalThumbs-1)
				{
					self.curId++;
					self.gotoThumb();
				}
			}
		};
		
		this.setupSlideshowButton = function()
		{
			FWDS3DCovSlideshowButton.setPrototype();
			
			self.slideshowButtonDO = new FWDS3DCovSlideshowButton(self.data);
			self.slideshowButtonDO.addListener(FWDS3DCovSlideshowButton.PLAY_CLICK, self.onSlideshowButtonPlayClickHandler);
			self.slideshowButtonDO.addListener(FWDS3DCovSlideshowButton.PAUSE_CLICK, self.onSlideshowButtonPauseClickHandler);
			self.slideshowButtonDO.addListener(FWDS3DCovSlideshowButton.TIME, self.onSlideshowButtonTime);
			self.controlsDO.addChild(self.slideshowButtonDO);
			
			self.slideshowButtonDO.setX(self.controlsWidth + 1);
			self.controlsWidth += self.slideshowButtonDO.getWidth() + 1;
			
			if (!self.data.showSlideshowButton)
			{
				self.slideshowButtonDO.setVisible(false);
			}
		};
		
		this.onSlideshowButtonPlayClickHandler = function()
		{
			self.isPlaying = true;
		};
		
		this.onSlideshowButtonPauseClickHandler = function()
		{
			self.isPlaying = false;
			clearTimeout(self.slideshowTimeoutId);
		};
		
		this.startSlideshow = function()
		{
			if (!self.isPlaying)
			{
				self.isPlaying = true;
				
				self.slideshowButtonDO.start();
				self.slideshowButtonDO.onMouseOut();
			}
		};
		
		this.stopSlideshow = function()
		{
			if (self.isPlaying)
			{
				self.isPlaying = false;
				clearTimeout(self.slideshowTimeoutId);
				
				self.slideshowButtonDO.stop();
				self.slideshowButtonDO.onMouseOut();
			}
		};
		
		this.onSlideshowButtonTime = function()
		{
			if (self.curId == self.totalThumbs-1)
			{
				self.curId = 0;
			}
			else
			{
				self.curId++;
			}
			
			self.gotoThumb();
		};
		
		this.startTimeAgain = function()
		{
			self.slideshowButtonDO.start();
		};

		this.setupScrollbar = function()
		{
			FWDS3DCovScrollbar.setPrototype();
			
			self.scrollbarDO = new FWDS3DCovScrollbar(self.data, self.totalThumbs, self.curId);
			self.scrollbarDO.addListener(FWDS3DCovScrollbar.MOVE, self.onScrollbarMove);
			self.controlsDO.addChild(self.scrollbarDO);
			
			self.scrollbarDO.setX(self.controlsWidth + 1);
			self.controlsWidth += self.scrollbarDO.getWidth() + 1;
		};
		
		this.onScrollbarMove = function(e)
		{
			self.curId = e.id;
			self.gotoThumb();
		};
		
		this.addMouseWheelSupport = function()
		{
			if (window.addEventListener)
			{
				self.parent.mainDO.screen.addEventListener("mousewheel", self.mouseWheelHandler);
				self.parent.mainDO.screen.addEventListener('DOMMouseScroll', self.mouseWheelHandler);
			}
			else if (document.attachEvent)
			{
				self.parent.mainDO.screen.attachEvent("onmousewheel", self.mouseWheelHandler);
			}
		};
		
		this.mouseWheelHandler = function(e)
		{
			if (!self.introFinished || !self.allowToSwitchCat)
				return;
				
			if (self.showScrollbar && self.scrollbarDO.isPressed)
				return;
			
			var dir = e.detail || e.wheelDelta;	
			
			if (e.wheelDelta)
				dir *= -1;
			
			if (self.infiniteLoop)
			{
				if (dir > 0)
				{
					if (self.curId == self.totalThumbs-1)
					{
						self.curId = 0;
					}
					else
					{
						self.curId++;
					}
				}
				else if (dir < 0)
				{
					if (self.curId == 0)
					{
						self.curId = self.totalThumbs-1;
					}
					else
					{
						self.curId--;
					}
				}
				
				self.gotoThumb();
			}
			else
			{
				if (dir > 0)
				{
					if (self.curId < self.totalThumbs-1)
					{
						self.curId++;
						self.gotoThumb();
					}
				}
				else if (dir < 0)
				{
					if (self.curId > 0)
					{
						self.curId--;
						self.gotoThumb();
					}
				}
			}
			
			if (e.preventDefault)
			{
				e.preventDefault();
			}
			else
			{
				return false;
			}
		};
		
		//##########################################//
		/* setup mobile drag */
		//##########################################//
		this.setupMobileDrag = function()
		{
			if (self.hasPointerEvent)
			{
				self.parent.mainDO.screen.addEventListener("MSPointerDown", self.mobileDragStartHandler);
			}
			else
			{
				self.parent.mainDO.screen.addEventListener("touchstart", self.mobileDragStartTest);
			}
		};
		
		this.mobileDragStartTest = function(e)
		{
			var viewportMouseCoordinates = FWDS3DCovUtils.getViewportMouseCoordinates(e);	
			
			if (viewportMouseCoordinates.screenY > self.controlsDO.getGlobalY())
				return;
			
			self.lastPressedX = viewportMouseCoordinates.screenX;
			self.lastPressedY = viewportMouseCoordinates.screenY;
			
			self.dragCurId = self.curId;
			
			window.addEventListener("touchmove", self.mobileDragMoveTest);
			window.addEventListener("touchend", self.mobileDragEndTest);
		};
		
		this.mobileDragMoveTest = function(e)
		{
			if (e.touches.length != 1) return;
			
			self.disableThumbClick = true;
			
			var viewportMouseCoordinates = FWDS3DCovUtils.getViewportMouseCoordinates(e);	
			
			self.mouseX = viewportMouseCoordinates.screenX;
			self.mouseY = viewportMouseCoordinates.screenY;
			
			var angle = Math.atan2(self.mouseY - self.lastPressedY, self.mouseX - self.lastPressedX);
			var posAngle = Math.abs(angle) * 180 / Math.PI;
			
			if ((posAngle > 120) || (posAngle < 60))
			{
				if(e.preventDefault) e.preventDefault();
				
				self.curId = self.dragCurId + Math.floor(-(self.mouseX - self.lastPressedX) / 100);
				
				if (self.infiniteLoop)
				{
					if (self.curId < 0)
					{
						self.curId = self.totalThumbs-1;
					}
					else if (self.curId > self.totalThumbs-1)
					{
						self.curId = 0;
					}
				}
				else
				{
					if (self.curId < 0)
					{
						self.curId = 0;
					}
					else if (self.curId > self.totalThumbs-1)
					{
						self.curId = self.totalThumbs-1;
					}
				}
				
				if (self.curId != self.prevCurId)
				{
					self.gotoThumb();
				}
			}
			else
			{
				window.removeEventListener("touchmove", self.mobileDragMoveTest);
			}
		};
		
		this.mobileDragEndTest = function(e)
		{
			self.disableThumbClick = false;
			
			window.removeEventListener("touchmove", self.mobileDragMoveTest);
			window.removeEventListener("touchend", self.mobileDragEndTest);
		};
		
		this.mobileDragStartHandler = function(e)
		{
			var viewportMouseCoordinates = FWDS3DCovUtils.getViewportMouseCoordinates(e);		
			
			if (viewportMouseCoordinates.screenY > self.controlsDO.getGlobalY())
				return;

			self.lastPressedX = viewportMouseCoordinates.screenX;	
			
			self.dragCurId = self.curId;

			window.addEventListener("MSPointerUp", self.mobileDragEndHandler, false);
			window.addEventListener("MSPointerMove", self.mobileDragMoveHandler);
		};
		
		this.mobileDragMoveHandler = function(e)
		{
			if(e.preventDefault) e.preventDefault();
			
			self.disableThumbClick = true;
			
			var viewportMouseCoordinates = FWDS3DCovUtils.getViewportMouseCoordinates(e);	
			
			self.mouseX = viewportMouseCoordinates.screenX;;
			
			self.curId = self.dragCurId + Math.floor(-(self.mouseX - self.lastPressedX) / 100);
			
			if (self.curId < 0)
			{
				self.curId = 0;
			}
			else if (self.curId > self.totalThumbs-1)
			{
				self.curId = self.totalThumbs-1;
			}
			
			if (self.curId != self.prevCurId)
			{
				self.gotoThumb();
			}
		};

		this.mobileDragEndHandler = function(e)
		{
			self.disableThumbClick = false;
			
			window.removeEventListener("MSPointerUp", self.mobileDragEndHandler);
			window.removeEventListener("MSPointerMove", self.mobileDragMoveHandler);
		};
		
		this.removeMobileDrag = function()
		{
			if (self.hasPointerEvent)
			{
				self.parent.mainDO.screen.removeEventListener("MSPointerDown", self.mobileDragStartHandler);
				window.removeEventListener("MSPointerUp", self.mobileDragEndHandler);
				window.removeEventListener("MSPointerMove", self.mobileDragMoveHandler);
			}
			else
			{
				if (window.addEventListener)
				{
					self.parent.mainDO.screen.removeEventListener("touchstart", self.mobileDragStartTest);
					window.removeEventListener("touchmove", self.mobileDragMoveTest);
					window.removeEventListener("touchmove", self.mobileDragMoveHandler);
					window.removeEventListener("touchend", self.mobileDragEndTest);
				}
			}
		};
		
		//####################################//
		/* add keyboard support */
		//####################################//
		this.addKeyboardSupport = function()
		{
			if(document.addEventListener){
				document.addEventListener("keydown",  this.onKeyDownHandler);	
				document.addEventListener("keyup",  this.onKeyUpHandler);	
			}else{
				document.attachEvent("onkeydown",  this.onKeyDownHandler);	
				document.attachEvent("onkeyup",  this.onKeyUpHandler);	
			}
		};
		
		this.onKeyDownHandler = function(e)
		{
			if (!self.introFinished || !self.allowToSwitchCat)
				return;
				
			if (self.showScrollbar && self.scrollbarDO.isPressed)
				return;
				
			if (parent.lightboxDO && parent.lightboxDO.isShowed_bl)
				return;
				
			if(document.removeEventListener){
				document.removeEventListener("keydown",  self.onKeyDownHandler);
			}else{
				document.detachEvent("onkeydown",  self.onKeyDownHandler);
			}
			
			if (self.infiniteLoop)
			{
				if (e.keyCode == 39)
				{
					if (self.curId == self.totalThumbs-1)
					{
						self.curId = 0;
					}
					else
					{
						self.curId++;
					}
					
					self.gotoThumb();
			
					if(e.preventDefault)
					{
						e.preventDefault();
					}
					else
					{
						return false;
					}
				}
				else if (e.keyCode == 37)
				{
					if (self.curId == 0)
					{
						self.curId = self.totalThumbs-1;
					}
					else
					{
						self.curId--;
					}
					
					self.gotoThumb();
			
					if(e.preventDefault)
					{
						e.preventDefault();
					}
					else
					{
						return false;
					}
				}
			}
			else
			{
				if (e.keyCode == 39)
				{
					if (self.curId < self.totalThumbs-1)
					{
						self.curId++;
						self.gotoThumb();
					}
			
					if(e.preventDefault)
					{
						e.preventDefault();
					}
					else
					{
						return false;
					}
				}
				else if (e.keyCode == 37)
				{
					if (self.curId > 0)
					{
						self.curId--;
						self.gotoThumb();
					}
					
					if(e.preventDefault)
					{
						e.preventDefault();
					}
					else
					{
						return false;
					}
				}
			}
		};
		
		this.onKeyUpHandler = function(e)
		{
			if(document.addEventListener){
				document.addEventListener("keydown",  self.onKeyDownHandler);	
			}else{
				document.attachEvent("onkeydown",  self.onKeyDownHandler);	
			}
		};
		
		this.setPreset = function(e)
		{
			self.thumbXOffset3D = e[0];
			self.thumbXSpace3D = e[1];
			self.thumbZOffset3D = e[2];
			self.thumbZSpace3D = e[3];
			self.thumbYAngle3D = e[4];
			self.thumbHoverOffset = e[5];

			self.nrThumbsToDisplay = e[6];
			self.showRefl = e[7];
			self.reflDist = e[8];
			self.showGradient = e[9];
			
			FWDS3DCovModTweenMax.to(self.thumbsHolderDO, .8, {angleX:e[10], angleY:e[11], ease:Quart.easeOut});
			
			self.topology = e[12];
			self.gradientColor1 = e[14];
			self.gradientColor2 = e[15];
			
			for (var i=0; i<self.totalThumbs; i++)
			{
				self.thumbsAr[i].update();
			}
			
			self.gotoThumb();
		};
		
		/* destroy */
		this.destroy = function()
		{
			clearTimeout(self.loadWithDelayIdLeft);
			clearTimeout(self.loadWithDelayIdRight);
			clearTimeout(self.slideshowTimeoutId);
			clearTimeout(self.textTimeoutId);
			clearInterval(self.zSortingId);
			clearTimeout(self.hideThumbsFinishedId);
			clearTimeout(self.loadImagesId);
			clearTimeout(self.setTextHeightId);
			clearTimeout(self.setIntroFinishedId);
			clearTimeout(self.showControlsId);
			clearTimeout(self.transitionId);
			
			if (!self.isMobile)
			{
				if (self.screen.addEventListener)
				{
					window.removeEventListener("mousemove", self.onThumbMove);
				}
				else
				{
					document.detachEvent("onmousemove", self.onThumbMove);
				}
			}
			
			if (self.hasPointerEvent)
			{
				window.removeEventListener("MSPointerMove", self.onThumbMove);
			}
			
			if (self.hasPointerEvent)
			{
				self.parent.mainDO.screen.removeEventListener("MSPointerDown", self.mobileDragStartHandler);
				window.removeEventListener("MSPointerUp", self.mobileDragEndHandler);
				window.removeEventListener("MSPointerMove", self.mobileDragMoveHandler);
			}
			else
			{
				if (window.addEventListener)
				{
					self.parent.mainDO.screen.removeEventListener("touchstart", self.mobileDragStartTest);
					window.removeEventListener("touchmove", self.mobileDragMoveTest);
					window.removeEventListener("touchend", self.mobileDragEndTest);
				}
			}
			
			if (window.addEventListener)
			{
				self.parent.mainDO.screen.removeEventListener("mousewheel", self.mouseWheelHandler);
				self.parent.mainDO.screen.removeEventListener('DOMMouseScroll', self.mouseWheelHandler);
			}
			else if (document.attachEvent)
			{
				self.parent.mainDO.screen.detachEvent("onmousewheel", self.mouseWheelHandler);
			}
			
			if (self.addKeyboardSupport)
			{
				if(document.removeEventListener){
					document.removeEventListener("keydown",  this.onKeyDownHandler);	
					document.removeEventListener("keyup",  this.onKeyUpHandler);	
				}else if(document.attachEvent){
					document.detachEvent("onkeydown",  this.onKeyDownHandler);	
					document.detachEvent("onkeyup",  this.onKeyUpHandler);	
				}
			}
			
			if (self.image)
			{
				self.image.onload = null;
				self.image.onerror = null;
				self.image.src = "";
			}

			if (self.imageLeft)
			{
				self.imageLeft.onload = null;
				self.imageLeft.onerror = null;
				self.imageLeft.src = "";
			}
			
			if (self.imageRight)
			{
				self.imageRight.onload = null;
				self.imageRight.onerror = null;
				self.imageRight.src = "";
			}
			
			self.image = null;
			self.imageLeft = null;
			self.imageRight = null;

			/* destroy thumbs */
			for (var i=0; i<self.totalThumbs; i++)
			{
				FWDS3DCovModTweenMax.killTweensOf(self.thumbsAr[i]);
				self.thumbsAr[i].destroy();
				self.thumbsAr[i] = null;
			};

			self.thumbsAr = null;
			
			if (self.prevButtonDO)
			{
				self.prevButtonDO.destroy();
				self.prevButtonDO = null;
			}
			
			if (self.nextButtonDO)
			{
				self.nextButtonDO.destroy();
				self.nextButtonDO = null;
			}
			
			if (self.scrollbarDO)
			{
				self.scrollbarDO.destroy();
				self.scrollbarDO = null;
			}
			
			if (self.slideshowButtonDO)
			{
				self.slideshowButtonDO.destroy();
				self.slideshowButtonDO = null;
			}
			
			if (self.textDO && self.textDO.screen)
			{
				FWDS3DCovModTweenMax.killTweensOf(self.textDO);
				self.textDO.destroy();
				self.textDO = null;
			}
			
			if (self.thumbOverDO)
			{
				self.thumbOverDO.destroy();
				self.thumbOverDO = null;
			}

			if (self.thumbsHolderDO)
			{
				FWDS3DCovModTweenMax.killTweensOf(self.thumbsHolderDO);
				self.thumbsHolderDO.destroy();
				self.thumbsHolderDO = null;
			}
			
			if (self.controlsDO)
			{
				FWDS3DCovModTweenMax.killTweensOf(self.controlsDO);
				self.controlsDO.destroy();
				self.controlsDO = null;
			}
			
			self.screen.innerHTML = "";
			self = null;
			prototype.destroy();
			prototype = null;
			FWDS3DCovThumbsManager.prototype = null;
		};
		
		this.init();
	};

	/* set prototype */
	FWDS3DCovThumbsManager.setPrototype = function()
	{
		FWDS3DCovThumbsManager.prototype = new FWDS3DCovDisplayObject3D("div");
	};
	
	FWDS3DCovThumbsManager.THUMB_CLICK = "onThumbClick";
	FWDS3DCovThumbsManager.LOAD_ERROR = "onLoadError";
	FWDS3DCovThumbsManager.THUMBS_INTRO_FINISH = "onThumbsIntroFinish";
	FWDS3DCovThumbsManager.THUMB_CHANGE = "onThumbChange";

	window.FWDS3DCovThumbsManager = FWDS3DCovThumbsManager;

}(window));