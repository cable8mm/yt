/* 3DCoverflow */
(function(window)
{
	var FWDSimple3DCoverflow = function(props)
	{
		var self = this;
		
		this.mainDO;
		this.preloaderDO;
		this.customContextMenuDO;
		this.infoDO;
		this.thumbsManagerDO;
		this.bgDO;
		this.categoriesMenuDO;
		this.disableDO;

		this.stageWidth;
		this.stageHeight;
		this.originalWidth;
		this.originalHeight;
		
		this.resizeHandlerId1;
		this.resizeHandlerId2;
		this.orientationChangeId;
		
		this.rect;
		
		this.listeners = {events_ar:[]};
		
		this.autoScale = false;
		this.doNotExceedOriginalSize = true;
		this.orientationChangeComplete = true;
		this.isFullScreen = false;
		this.preloaderLoaded = false;
		
		this.apiReady = false;
		this.apiReadyFirstTime = false;

		this.isMobile = FWDS3DCovUtils.isMobile;

		/* init */
		this.init = function()
		{
			TweenLite.ticker.useRAF(false);
			
			self.propsObj = props;

			if (!self.propsObj)
			{
				alert("FWDSimple3DCoverflow properties object is undefined!");
				return;
			}
			
			if (!self.propsObj.displayType)
			{
				alert("Display type is not specified!");
				return;
			}
		
			self.displayType = props.displayType.toLowerCase();
			self.body = document.getElementsByTagName("body")[0];
			
			if (!self.propsObj.coverflowHolderDivId)
			{
				alert("Property coverflowHolderDivId is not defined in the FWDSimple3DCoverflow object constructor!");
				return;
			}
			
			if (!FWDS3DCovUtils.getChildById(self.propsObj.coverflowHolderDivId))
			{
				alert("FWDSimple3DCoverflow holder div is not found, please make sure that the div exists and the id is correct! " + self.propsObj.coverflowHolderDivId);
				return;
			}
			
			if (!self.propsObj.coverflowWidth)
			{
				alert("The coverflow width is not defined, plese make sure that the coverflowWidth property is definded in the FWDSimple3DCoverflow constructor!");
				return;
			}
			
			if (!self.propsObj.coverflowHeight)
			{
				alert("The coverflow height is not defined, plese make sure that the coverflowHeight property is definded in the FWDSimple3DCoverflow constructor!");
				return;
			}
		
			self.stageContainer = FWDS3DCovUtils.getChildById(self.propsObj.coverflowHolderDivId);
			
			self.autoScale = self.propsObj.autoScale == "yes" ? true : false;
			
			self.originalWidth = self.propsObj.coverflowWidth;
			self.originalHeight = self.propsObj.coverflowHeight;
			
			self.setupMainDO();
			
			self.setupInfo();
			self.setupData();
			
			self.startResizeHandler();
		};

		// #############################################//
		/* setup main do */
		// #############################################//
		this.setupMainDO = function()
		{
			self.mainDO = new FWDS3DCovDisplayObject("div", "relative");
			self.mainDO.setSelectable(false);
			self.mainDO.setBkColor(self.propsObj.backgroundColor);
			
			self.mainDO.getStyle().msTouchAction = "none";

			if (self.displayType == FWDSimple3DCoverflow.FLUID_WIDTH)
			{	
				self.mainDO.getStyle().position = "absolute";
				
				if (FWDS3DCovUtils.isIE7)
				{
					self.body.appendChild(self.mainDO.screen);
				}
				else
				{
					document.body.appendChild(self.mainDO.screen);
					
					if (self.propsObj.fluidWidthZIndex)
					{
						self.mainDO.screen.style.zIndex = self.propsObj.fluidWidthZIndex;
					}
					
					self.mainDO.screen.id = self.propsObj.coverflowHolderDivId + "-fluidwidth";
				}
			}
			else
			{
				self.stageContainer.appendChild(self.mainDO.screen);
			}
		};
		
		this.setBackgrounds = function()
		{
			if (self.propsObj.backgroundImagePath)
			{
				self.bgDO = new FWDS3DCovDisplayObject("div");
				self.mainDO.addChild(self.bgDO);
				
				self.bgDO.setWidth(self.originalWidth);
				self.bgDO.setHeight(self.originalHeight);
				
				self.bgDO.screen.style.backgroundImage = "url(" + self.propsObj.backgroundImagePath + ")";
				self.bgDO.screen.style.backgroundRepeat = self.propsObj.backgroundRepeat;
				
				self.bgDO.setAlpha(0);
				FWDS3DCovModTweenMax.to(self.bgDO, .8, {alpha:1});
			}
		};

		// #############################################//
		/* setup info */
		// #############################################//
		this.setupInfo = function()
		{
			FWDS3DCovInfo.setPrototype();
			self.infoDO = new FWDS3DCovInfo();
		};
		
		//#############################################//
		/* resize handler */
		//#############################################//
		this.startResizeHandler = function()
		{
			if (window.addEventListener)
			{
				window.addEventListener("resize", self.onResizeHandler);
				window.addEventListener("scroll", self.onScrollHandler);
				window.addEventListener("orientationchange", self.orientationChange);
			}
			else if (window.attachEvent)
			{
				window.attachEvent("onresize", self.onResizeHandler);
				window.attachEvent("onscroll", self.onScrollHandler);
			}
			
			self.resizeHandlerId2 = setTimeout(self.resizeHandler, 50);
			
			if (self.displayType == FWDSimple3DCoverflow.FLUID_WIDTH)
			{
				self.resizeHandlerId1 = setTimeout(self.resizeHandler, 800);
			}
		};
		
		this.onResizeHandler = function(e)
		{
			if (self.isMobile)
			{
				clearTimeout(self.resizeHandlerId2);
				self.resizeHandlerId2 = setTimeout(self.resizeHandler, 200);
			}
			else
			{
				self.resizeHandler();
			}	
		};
		
		this.onScrollHandler = function(e)
		{
			if (self.displayType == FWDSimple3DCoverflow.FLUID_WIDTH)
			{
				self.scrollHandler();
			}
			
			self.rect = self.mainDO.screen.getBoundingClientRect();
		};
		
		this.orientationChange = function()
		{
			if (self.displayType == FWDSimple3DCoverflow.FLUID_WIDTH)
			{
				self.orientationChangeComplete = false;
				
				clearTimeout(self.scrollEndId);
				clearTimeout(self.resizeHandlerId2);
				clearTimeout(self.orientationChangeId);
				
				self.orientationChangeId = setTimeout(function()
				{
					self.orientationChangeComplete = true; 
					self.resizeHandler();
				}, 1000);
				
				self.mainDO.setX(0);
				self.mainDO.setWidth(0);
			}
		};
		
		//##########################################//
		/* resize and scroll handler */
		//##########################################//
		this.scrollHandler = function()
		{
			if (!self.orientationChangeComplete)
				return;
			
			var scrollOffsets = FWDS3DCovUtils.getScrollOffsets();
		
			self.pageXOffset = scrollOffsets.x;
			self.pageYOffset = scrollOffsets.y;
			
			if (self.displayType == FWDSimple3DCoverflow.FLUID_WIDTH)
			{
				if (self.isMobile)
				{
					clearTimeout(self.scrollEndId);
					self.scrollEndId = setTimeout(self.resizeHandler, 200);		
				}
				else
				{
					self.mainDO.setX(self.pageXOffset);
				}
				
				self.mainDO.setY(Math.round(self.stageContainer.getBoundingClientRect().top + self.pageYOffset));
			}
		};
		
		this.resizeHandler = function()
		{
			if (!self.orientationChangeComplete)
				return;
			
			var scrollOffsets = FWDS3DCovUtils.getScrollOffsets();
			var viewportSize = FWDS3DCovUtils.getViewportSize();
			var scale;
			
			self.viewportWidth = parseInt(viewportSize.w);
			self.viewportHeight = parseInt(viewportSize.h);
			self.pageXOffset = parseInt(scrollOffsets.x);
			self.pageYOffset = parseInt(scrollOffsets.y);
			
			if (self.displayType == FWDSimple3DCoverflow.FLUID_WIDTH)
			{
				self.stageWidth = viewportSize.w;
				self.stageHeight = viewportSize.h;
				
				if (self.autoScale)
				{
					scale = Math.min(self.stageWidth/self.originalWidth, 1);
					self.stageHeight = Math.max(parseInt(scale * self.originalHeight), 300);
					self.stageContainer.style.height = self.stageHeight + "px";
				}
				else
				{
					self.stageHeight = self.originalHeight;
					self.stageContainer.style.height = self.stageHeight + "px";
				}
				
				self.mainDO.setX(self.pageXOffset);
				self.mainDO.setY(Math.round(self.stageContainer.getBoundingClientRect().top + self.pageYOffset));
			}
			else if (self.displayType == FWDSimple3DCoverflow.RESPONSIVE)
			{
				if (self.autoScale)
				{
					self.stageContainer.style.width = "100%";
					
					if (self.stageContainer.offsetWidth > self.originalWidth)
					{
						scale = 1;
					}
					else
					{
						scale = self.stageContainer.offsetWidth/self.originalWidth;
					}
					
					self.stageWidth = self.stageContainer.offsetWidth;
					self.stageHeight = Math.max(parseInt(scale * self.originalHeight), 300);
					
					self.stageContainer.style.height = self.stageHeight + "px";
				}
				else
				{
					self.stageContainer.style.width = "100%";
					
					self.stageWidth = self.stageContainer.offsetWidth;
					self.stageHeight = self.originalHeight;
					
					self.stageContainer.style.height = self.originalHeight + "px";
				}
				
				self.mainDO.setX(0);
				self.mainDO.setY(0);
			}
			else
			{
				if (self.autoScale)
				{
					self.stageContainer.style.width = "100%";
					
					if (self.stageContainer.offsetWidth > self.originalWidth)
					{
						self.stageContainer.style.width = self.originalWidth + "px";
					}
					
					scale = self.stageContainer.offsetWidth/self.originalWidth;
					
					self.stageWidth = parseInt(scale * self.originalWidth);
					self.stageHeight = Math.max(parseInt(scale * self.originalHeight), 300);
					self.stageContainer.style.height = self.stageHeight + "px";
				}
				else
				{
					self.stageWidth = self.originalWidth;
					self.stageHeight = self.originalHeight;
					
					self.stageContainer.style.width = self.originalWidth + "px";
					self.stageContainer.style.height = self.originalHeight + "px";
				}
				
				self.mainDO.setX(0);
				self.mainDO.setY(0);
			}
			
			self.mainDO.setWidth(self.stageWidth);
			self.mainDO.setHeight(self.stageHeight);
			
			self.rect = self.mainDO.screen.getBoundingClientRect();
		
			self.positionPreloader();
			
			if (self.thumbsManagerDO)
			{
				self.thumbsManagerDO.resizeHandler();
				
				if(!self.thumbsManagerDO.allowToSwitchCat)
				{
					self.disableDO.setWidth(self.stageWidth);
					self.disableDO.setHeight(self.stageHeight);
				}
			}
			
			if (self.preloaderLoaded)
			{
				if (self.propsObj.backgroundImagePath)
				{
					self.bgDO.setWidth(self.stageWidth);
					self.bgDO.setHeight(self.stageHeight);
				}
			}
			
			if (self.categoriesMenuDO)
			{
				self.categoriesMenuDO.position();
			}
		};

		// #############################################//
		/* setup context menu */
		// #############################################//
		this.setupContextMenu = function()
		{
			self.customContextMenuDO = new FWDS3DCovContextMenu(self.mainDO, self.data.rightClickContextMenu);
		};

		// #############################################//
		/* setup data */
		// #############################################//
		this.setupData = function()
		{
			FWDS3DCovData.setPrototype();
			
			self.data = new FWDS3DCovData(self.propsObj);
			self.data.addListener(FWDS3DCovData.PRELOADER_LOAD_DONE, self.onPreloaderLoadDone);
			self.data.addListener(FWDS3DCovData.LOAD_ERROR, self.dataLoadError);
			self.data.addListener(FWDS3DCovData.LOAD_DONE, self.dataLoadComplete);
		};

		this.onPreloaderLoadDone = function()
		{
			self.setBackgrounds();
			self.setupPreloader();
			self.positionPreloader();
			
			if (!self.isMobile)
			{
				self.setupContextMenu();
			}
			
			self.preloaderLoaded = true;

			self.resizeHandler();
		};

		this.dataLoadError = function(e, text)
		{
			self.mainDO.addChild(self.infoDO);
			self.infoDO.showText(e.text);
		};

		this.dataLoadComplete = function(e)
		{
			self.dispatchEvent(FWDSimple3DCoverflow.DATA_LOADED);
			self.dispatchEvent(FWDSimple3DCoverflow.INTRO_START);
			
			if (self.data.showDisplay2DAlways)
			{
				FWDS3DCovUtils.hasTransform3d = false;
			}
			
			self.preloaderDO.hide(true);
			self.setupThumbsManager();
			
			if (self.data.showCategoriesMenu)
			{
				self.setupCategoriesMenu();
			}
			
			if (!self.data.enableHtmlContent)
			{
				self.setupLightBox();
			}
		
			self.setupDisable();
		};

		// #############################################//
		/* setup preloader */
		// #############################################//
		this.setupPreloader = function()
		{
			FWDS3DCovPreloader.setPrototype();
			
			self.preloaderDO = new FWDS3DCovPreloader(self.data.mainPreloaderImg, 85, 36, 20, 50);
			self.mainDO.addChild(self.preloaderDO);
			
			self.preloaderDO.show();
		};

		this.positionPreloader = function()
		{
			if (self.preloaderDO)
			{
				self.preloaderDO.setX(parseInt((self.stageWidth - self.preloaderDO.getWidth()) / 2));
				self.preloaderDO.setY(parseInt((self.stageHeight - self.preloaderDO.getHeight()) / 2) + 7);
			}
		};

		// ###########################################//
		/* setup thumbs manager */
		// ###########################################//
		this.setupThumbsManager = function()
		{
			FWDS3DCovThumbsManager.setPrototype();
			
			self.thumbsManagerDO = new FWDS3DCovThumbsManager(self.data, self);
			self.thumbsManagerDO.addListener(FWDS3DCovThumbsManager.THUMB_CLICK, self.onThumbsManagerThumbClick);
			self.thumbsManagerDO.addListener(FWDS3DCovThumbsManager.LOAD_ERROR, self.onThumbsManagerLoadError);
			self.thumbsManagerDO.addListener(FWDS3DCovThumbsManager.THUMBS_INTRO_FINISH, self.onThumbsManagerIntroFinish);
			self.thumbsManagerDO.addListener(FWDS3DCovThumbsManager.THUMB_CHANGE, self.onThumbsManagerThumbChange);
			self.mainDO.addChild(self.thumbsManagerDO);
			
			if (self.stageWidth)
			{
				self.thumbsManagerDO.resizeHandler();
			}
		};
		
		this.onThumbsManagerThumbClick = function(e)
		{
			if (!self.data.enableHtmlContent)
			{
				if (!self.lightboxDO.isShowed_bl)
				{
					self.thumbsManagerDO.stopSlideshow();
					self.lightboxDO.show(e.id);
				}
			}
		};

		this.onThumbsManagerLoadError = function(e)
		{
			self.mainDO.addChild(self.infoDO);
			self.infoDO.showText(e.text);
		};
		
		this.onThumbsManagerIntroFinish = function()
		{
			self.enableAll();
			self.dispatchEvent(FWDSimple3DCoverflow.INTRO_FINISH);
			
			self.apiReady = true;
			
			if (!self.apiReadyFirstTime)
			{
				self.apiReadyFirstTime = true;
			
				self.dispatchEvent(FWDSimple3DCoverflow.IS_API_READY);
			}
			
			self.dispatchEvent(FWDSimple3DCoverflow.CATEGORY_CHANGE, {id:self.thumbsManagerDO.dataListId});
		};
		
		this.onThumbsManagerThumbChange = function(e)
		{
			self.dispatchEvent(FWDSimple3DCoverflow.THUMB_CHANGE, {id:e.id});
		};
		
		this.setPreset = function(e)
		{
			self.thumbsManagerDO.setPreset(e);
		};
		
		//#############################################//
		/* setup categories menu */
		//############################################//
		this.setupCategoriesMenu = function()
		{
			FWDS3DCovCategoriesMenu.setPrototype();
			
			self.categoriesMenuDO = new FWDS3DCovCategoriesMenu(self, self.data.categoriesAr, self.data.startAtCategory, self.data.catMaxWidth, 21, self.data.catOffset, self.data.catColorNormal, self.data.catColorSelected);
			
			self.categoriesMenuDO.addListener(FWDS3DCovCategoriesMenu.CHANGE, self.onCategoriesMenuChange);
			self.mainDO.addChild(self.categoriesMenuDO);
		};
		
		this.onCategoriesMenuChange = function(e)
		{
			if (self.thumbsManagerDO.allowToSwitchCat)
			{
				self.disableAll();
				self.thumbsManagerDO.showCurrentCat(e.id);
				self.dispatchEvent(FWDSimple3DCoverflow.INTRO_START);
				
				if (!self.data.enableHtmlContent)
				{
					self.lightboxDO.updateData(self.data.lightboxAr[e.id]);
				}
				
				self.apiReady = false;
			}
		};
		
		//#############################################//
		/* setup lightbox */
		//#############################################//
		this.setupLightBox = function()
		{
			FWDS3DCovLightBox.setPrototype();
			
			this.lightboxDO = new FWDS3DCovLightBox(
			{
				//main data array
				data_ar:self.data.lightboxAr[self.data.startAtCategory],
				//skin
				lightboxPreloader_img:this.data.lightboxPreloader_img,
				slideShowPreloader_img:this.data.slideShowPreloader_img,
				closeN_img:this.data.lightboxCloseButtonN_img,
				closeS_img:this.data.lightboxCloseButtonS_img,
				nextN_img:this.data.lightboxNextButtonN_img,
				nextS_img:this.data.lightboxNextButtonS_img,
				prevN_img:this.data.lightboxPrevButtonN_img,
				prevS_img:this.data.lightboxPrevButtonS_img,
				maximizeN_img:this.data.lightboxMaximizeN_img,
				maximizeS_img:this.data.lightboxMaximizeS_img,
				minimizeN_img:this.data.lightboxMinimizeN_img,
				minimizeS_img:this.data.lightboxMinimizeS_img,
				infoOpenN_img:this.data.lightboxInfoOpenN_img,
				infoOpenS_img:this.data.lightboxInfoOpenS_img,
				infoCloseN_img:this.data.lightboxInfoCloseN_img,
				infoCloseS_img:this.data.lightboxInfoCloseS_img,
				playN_img:this.data.lightboxPlayN_img,
				playS_img:this.data.lightboxPlayS_img,
				pauseN_img:this.data.lightboxPauseN_img,
				pauseS_img:this.data.lightboxPauseS_img,
				//properties
				rightClickContextMenu:self.data.rightClickContextMenu,
				addKeyboardSupport_bl:self.data.addLightBoxKeyboardSupport_bl,
				showNextAndPrevButtons:self.data.showLightBoxNextAndPrevButtons_bl,
				showZoomButton:self.data.showLightBoxZoomButton_bl,
				showInfoButton:self.data.showLightBoxInfoButton_bl,
				showSlideshowButton:self.data.showLightBoxSlideShowButton_bl,
				slideShowAutoPlay:self.data.slideShowAutoPlay_bl,
				showInfoWindowByDefault:self.data.showInfoWindowByDefault_bl,
				lightBoxVideoAutoPlay:self.data.lightBoxVideoAutoPlay_bl,
				infoWindowBackgroundColor:self.data.lightBoxInfoWindowBackgroundColor_str,
				infoWindowBackgroundOpacity:self.data.lightBoxInfoWindowBackgroundOpacity,
				backgroundColor_str:self.data.lightBoxBackgroundColor_str,
				backgroundOpacity:self.data.lightBoxMainBackgroundOpacity,
				itemBackgroundColor_str:self.data.lightBoxItemBackgroundColor_str,
				borderColor_str1:self.data.lightBoxItemBorderColor_str1,
				borderColor_str2:self.data.lightBoxItemBorderColor_str2,
				borderSize:self.data.lightBoxBorderSize,
				borderRadius:self.data.lightBoxBorderRadius,
				slideShowDelay:self.data.lightBoxSlideShowDelay,
				videoWidth:self.data.lightBoxVideoWidth,
				videoHeight:self.data.lightBoxVideoHeight,
				iframeWidth:self.data.lightBoxIframeWidth,
				iframeHeight:self.data.lightBoxIframeHeight
			});
		};
		
		//##############################################//
		/* setup disable */
		//#############################################//
		this.setupDisable = function()
		{
			self.disableDO = new FWDS3DCovDisplayObject3D("div");
			
			self.disableDO.setZ(300000);
			
			if (FWDS3DCovUtils.isIE)
			{
				self.disableDO.setBkColor("#000000");
				self.disableDO.setAlpha(.001);
			}
			
			self.mainDO.addChild(self.disableDO);
			
			self.disableAll();
		};
		
		this.disableAll = function()
		{
			self.disableDO.setWidth(self.stageWidth);
			self.disableDO.setHeight(self.stageHeight);
		};
		
		this.enableAll = function()
		{
			self.disableDO.setWidth(0);
			self.disableDO.setHeight(0);
		};
		
		//#############################################//
		/* API functions */
		//#############################################//
		this.isAPIReady = function()
		{
			return self.apiReady;
		};
		
		this.getCurrentCategoryId = function()
		{
			if (self.apiReady)
			{
				return self.thumbsManagerDO.dataListId;
			}
		};
		
		this.switchCategory = function(id)
		{
			if (self.apiReady)
			{
				if ((id >= 0) && (id < self.data.dataListAr.length))
				{
					self.disableAll();
					self.thumbsManagerDO.showCurrentCat(id);
					self.dispatchEvent(FWDSimple3DCoverflow.INTRO_START);
					
					if (!self.data.enableHtmlContent && self.lightboxDO)
					{
						self.lightboxDO.updateData(self.data.lightboxAr[id]);
					}
					
					if (self.categoriesMenuDO)
					{
						self.categoriesMenuDO.setValue(id);
					}
					
					self.apiReady = false;
				}
			}
		};
		
		this.getCurrentThumbId = function()
		{
			if (self.apiReady)
			{
				return self.thumbsManagerDO.curId;
			}
		};
		
		this.gotoThumb = function(id)
		{
			if (self.apiReady)
			{
				if ((id >= 0) && (id < self.thumbsManagerDO.totalThumbs) && (id != self.thumbsManagerDO.curId))
				{
					self.thumbsManagerDO.curId = id;
					self.thumbsManagerDO.gotoThumb();
				}
			}
		};
		
		this.isSlideshowPlaying = function()
		{
			return self.thumbsManagerDO.isPlaying;
		};
		
		this.startSlideshow = function()
		{
			if (self.apiReady)
			{
				self.thumbsManagerDO.startSlideshow();
			}
		};
		
		this.stopSlideshow = function()
		{
			if (self.apiReady)
			{
				self.thumbsManagerDO.stopSlideshow();
			}
		};
		
		//#############################################//
		/* Event dispatcher */
		//#############################################//
		this.addListener = function (type, listener)
		{
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	if(typeof listener != "function") throw Error("listener must be of type Function.");
	    	
	    	
	        var event = {};
	        event.type = type;
	        event.listener = listener;
	        event.target = this;
	        this.listeners.events_ar.push(event);
	    };
	    
	    this.dispatchEvent = function(type, props)
	    {
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	
	        for (var i=0, len=this.listeners.events_ar.length; i < len; i++){
	        	if(this.listeners.events_ar[i].target === this && this.listeners.events_ar[i].type === type){		
	    	        if(props){
	    	        	for(var prop in props){
	    	        		this.listeners.events_ar[i][prop] = props[prop];
	    	        	}
	    	        }
	        		this.listeners.events_ar[i].listener.call(this, this.listeners.events_ar[i]);
	        	}
	        }
	    };
	    
	   this.removeListener = function(type, listener)
	   {
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	if(typeof listener != "function") throw Error("listener must be of type Function." + type);
	    	
	        for (var i=0, len=this.listeners.events_ar.length; i < len; i++){
	        	if(this.listeners.events_ar[i].target === this 
	        			&& this.listeners.events_ar[i].type === type
	        			&& this.listeners.events_ar[i].listener ===  listener
	        	){
	        		this.listeners.events_ar.splice(i,1);
	        		break;
	        	}
	        }  
	    };

		/* destroy */
		this.destroy = function()
		{
			if (window.removeEventListener)
			{
				window.removeEventListener("resize", self.onResizeHandler);
				window.removeEventListener("scroll", self.onScrollHandler);
				window.removeEventListener("orientationchange", self.orientationChance);
			}
			else if (window.detachEvent)
			{
				window.detachEvent("onresize", self.onResizeHandler);
				window.detachEvent("onscroll", self.onScrollHandler);
			}
			
			clearTimeout(self.scrollEndId);
			clearTimeout(self.resizeHandlerId1);
			clearTimeout(self.resizeHandlerId2);
			clearTimeout(self.orientationChangeId);
			
			if (self.data)
			{
				self.data.destroy();
			}

			if (self.customContextMenuDO)
			{
				self.customContextMenuDO.destroy();
			}

			if (self.infoDO)
			{
				self.infoDO.destroy();
			}

			if (self.preloaderDO)
			{
				self.preloaderDO.destroy();
			}
			
			if (self.thumbsManagerDO)
			{
				self.thumbsManagerDO.destroy();
			}
			
			if (self.bgDO)
			{
				FWDS3DCovModTweenMax.killTweensOf(self.bgDO);
				self.bgDO.destroy();
			}
			
			if (self.categoriesMenuDO)
			{
				self.categoriesMenuDO.destroy();
			}
			
			if (self.disableDO)
			{
				self.disableDO.destroy();
			}
			
			if (self.displayType == FWDSimple3DCoverflow.FLUID_WIDTH)
			{	
				if (FWDS3DCovUtils.isIE7)
				{
					self.body.removeChild(self.mainDO.screen);
				}
				else
				{
					document.body.removeChild(self.mainDO.screen);
				}
			}
			else
			{
				self.stageContainer.removeChild(self.mainDO.screen);
			}
			
			if (self.mainDO)
			{
				self.mainDO.screen.innerHTML = "";
				self.mainDO.destroy();
			}
			
			self.listeners = null;
			self.preloaderDO = null;
			self.customContextMenuDO = null;
			self.infoDO = null;
			self.thumbsManagerDO = null;
			self.bgDO = null;
			self.categoriesMenuDO = null;
			self.disableDO = null;
			self.mainDO = null;
			self = null;
		};

		this.init();
	};

	FWDSimple3DCoverflow.FLUID_WIDTH = "fluidwidth";
	FWDSimple3DCoverflow.RESPONSIVE = "responsive";
	FWDSimple3DCoverflow.FIXED = "fixed";
	
	FWDSimple3DCoverflow.INTRO_START = "onsIntroStart";
	FWDSimple3DCoverflow.INTRO_FINISH = "onsIntroFinish";
	FWDSimple3DCoverflow.DATA_LOADED = "onDataLoaded";
	FWDSimple3DCoverflow.IS_API_READY = "isAPIReady";
	FWDSimple3DCoverflow.CATEGORY_CHANGE = "categoryChanged";
	FWDSimple3DCoverflow.THUMB_CHANGE = "thumbChanged";
	
	window.FWDSimple3DCoverflow = FWDSimple3DCoverflow;

}(window));