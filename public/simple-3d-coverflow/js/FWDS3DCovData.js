/* Data */
(function(window)
{
	var FWDS3DCovData = function(props)
	{
		var self = this;
		var prototype = FWDS3DCovData.prototype;

		this.propsObj = props;
		this.rootElement = null;
		this.graphicsPathsAr = [];
		this.imagesAr = [];
		this.dataListAr = [];
		this.lightboxAr = [];
		this.categoriesAr = [];
		
		this.totalGraphics;
		
		this.countLoadedGraphics = 0;

		this.parseDelayId;

		// ###################################//
		/* init */
		// ###################################//
		this.init = function()
		{
			self.parseDelayId = setTimeout(self.parseProperties, 100);
		};

		this.parseProperties = function()
		{
			var errorMessage;

			// check for coverflowDataListDivId property.
			if (!self.propsObj.coverflowDataListDivId)
			{
				errorMessage = "Coverflow data list id is not defined in FWDSimple3DCoverflow constructor function!";
				self.dispatchEvent(FWDS3DCovData.LOAD_ERROR, {text : errorMessage});
				
				return;
			};

			// set the root element of the coverflow list.
			self.rootElement = FWDS3DCovUtils.getChildById(self.propsObj.coverflowDataListDivId);
			
			if (!self.rootElement)
			{
				errorMessage = "Make sure that the div with the id <font color='#FFFFFF'>" + self.propsObj.coverflowDataListDivId + "</font> exists, this represents the coverflow data list.";
				self.dispatchEvent(FWDS3DCovData.LOAD_ERROR, {text : errorMessage});
				
				return;
			}
			
			// set main properties.
			self.backgroundColor = self.propsObj.backgroundColor || "transparent";
			self.thumbWidth = self.propsObj.thumbnailWidth || 400;
			self.thumbHeight = self.propsObj.thumbnailHeight || 266;
			self.thumbXOffset3D = self.propsObj.thumbnailXOffset3D || 0;
			self.thumbXSpace3D = self.propsObj.thumbnailXSpace3D || 0;
			self.thumbZOffset3D = self.propsObj.thumbnailZOffset3D || 0;
			self.thumbZSpace3D = self.propsObj.thumbnailZSpace3D || 0;
			self.thumbYAngle3D = self.propsObj.thumbnailYAngle3D || 0;
			self.thumbXOffset2D = self.propsObj.thumbnailXOffset2D || 0;
			self.thumbXSpace2D = self.propsObj.thumbnailXSpace2D || 0;
			self.thumbHoverOffset = self.propsObj.thumbnailHoverOffset || 0;
			self.thumbBorderSize = self.propsObj.thumbnailBorderSize || 0;
			self.thumbBackgroundColor = self.propsObj.thumbnailBackgroundColor || "transparent";
			self.thumbBorderColor1 = self.propsObj.thumbnailBorderColor1 || "transparent";
			self.thumbBorderColor2 = self.propsObj.thumbnailBorderColor2 || "transparent";
			
			self.thumbWidth += self.thumbBorderSize * 2;
			self.thumbHeight += self.thumbBorderSize * 2;
			
			if (self.propsObj.numberOfThumbnailsToDisplayLeftAndRight == "all")
			{
				self.nrThumbsToDisplay = 0;
			}
			else
			{
				self.nrThumbsToDisplay = self.propsObj.numberOfThumbnailsToDisplayLeftAndRight || 0;
			}
						
			self.transparentImages = self.propsObj.transparentImages == "yes" ? true : false;
			self.maxNumberOfThumbsOnMobile = self.propsObj.maxNumberOfThumbnailsOnMobile || 15;
			self.thumbsAlignment = self.propsObj.thumbnailsAlignment;
			self.showGradient = self.propsObj.showThumbnailsGradient == "yes" ? true : false;
			self.gradientColor1 = self.propsObj.thumbnailGradientColor1;
			self.gradientColor2 = self.propsObj.thumbnailGradientColor2;
			self.showText = self.propsObj.showText == "yes" ? true : false;
			self.textOffset = self.propsObj.textOffset || 10;
			self.showBoxShadow = self.propsObj.showThumbnailBoxShadow == "yes" ? true : false;
			self.thumbBoxShadowCss = self.propsObj.thumbnailBoxShadowCss;
			self.showTooltip = self.propsObj.showTooltip == "yes" ? true : false;
			self.dynTooltip = self.propsObj.dynamicTooltip == "yes" ? true : false;
			self.showDisplay2DAlways = self.propsObj.showDisplay2DAlways == "yes" ? true : false;
			self.coverflowStartPosition = self.propsObj.coverflowStartPosition;
			self.coverflowTopology = self.propsObj.coverflowTopology;
			self.coverflowXRotation = self.propsObj.coverflowXRotation;
			self.coverflowYRotation = self.propsObj.coverflowYRotation;
			self.rightClickContextMenu = self.propsObj.rightClickContextMenu;
			self.infiniteLoop = self.propsObj.infiniteLoop == "yes" ? true : false;
			
			//reflection
			self.showRefl = self.propsObj.showReflection == "yes" ? true : false;
			self.reflHeight = self.propsObj.reflectionHeight || 100;
			self.reflDist = self.propsObj.reflectionDistance || 0;
			self.reflAlpha = self.propsObj.reflectionOpacity || .5;
			
			//controls
			self.showScrollbar = self.propsObj.showScrollbar == "yes" ? true : false;
			self.disableScrollbarOnMobile = self.propsObj.disableScrollbarOnMobile == "yes" ? true : false;
			self.disableNextAndPrevButtonsOnMobile = self.propsObj.disableNextAndPrevButtonsOnMobile == "yes" ? true : false;
			self.enableMouseWheelScroll = self.propsObj.enableMouseWheelScroll == "yes" ? true : false;
			self.controlsMaxWidth = self.propsObj.controlsMaxWidth || 800;
			self.handlerWidth = self.propsObj.scrollbarHandlerWidth || 300;
			self.scrollbarTextColorNormal = self.propsObj.scrollbarTextColorNormal || "#777777";
			self.scrollbarTextColorSelected = self.propsObj.scrollbarTextColorSelected || "#FFFFFF";
			self.slideshowDelay = self.propsObj.slideshowDelay || 5000;
			self.autoplay = self.propsObj.autoplay == "yes" ? true : false;
			self.showPrevButton = self.propsObj.showPrevButton == "yes" ? true : false;
			self.showNextButton = self.propsObj.showNextButton == "yes" ? true : false;
			self.showSlideshowButton = self.propsObj.showSlideshowButton == "yes" ? true : false;
			self.slideshowTimerColor = self.propsObj.slideshowTimerColor || "#777777";
			self.addKeyboardSupport = self.propsObj.addKeyboardSupport == "yes" ? true : false;
			self.controlsPos = self.propsObj.controlsPosition == "top" ? true : false;
			self.controlsOffset = self.propsObj.controlsOffset || 15;
			
			// categories
			self.showCategoriesMenu = self.propsObj.showCategoriesMenu == "yes" ? true : false;
			self.catMaxWidth = self.propsObj.categoriesMenuMaxWidth || 700;
			self.catOffset = self.propsObj.categoriesMenuOffset || 25;
			self.catColorNormal = self.propsObj.categoryColorNormal;
			self.catColorSelected = self.propsObj.categoryColorSelected;
			
			//lightbox
			self.addLightBoxKeyboardSupport_bl = self.propsObj.addLightBoxKeyboardSupport; 
			self.addLightBoxKeyboardSupport_bl = self.addLightBoxKeyboardSupport_bl == "no" ? false : true;
			
			self.showLightBoxNextAndPrevButtons_bl = self.propsObj.showLightBoxNextAndPrevButtons; 
			self.showLightBoxNextAndPrevButtons_bl = self.showLightBoxNextAndPrevButtons_bl == "no" ? false : true;
			
			self.showInfoWindowByDefault_bl = self.propsObj.showLightBoxInfoWindowByDefault; 
			self.showInfoWindowByDefault_bl = self.showInfoWindowByDefault_bl == "yes" ? true : false;
			
			self.lightBoxVideoAutoPlay_bl = self.propsObj.lightBoxVideoAutoPlay; 
			self.lightBoxVideoAutoPlay_bl = self.lightBoxVideoAutoPlay_bl == "yes" ? true : false;
		
			self.showLightBoxZoomButton_bl = self.propsObj.showLightBoxZoomButton; 
			self.showLightBoxZoomButton_bl = self.showLightBoxZoomButton_bl == "no" ? false : true;
			
			self.showLightBoxInfoButton_bl = self.propsObj.showLightBoxInfoButton;
			self.showLightBoxInfoButton_bl = self.showLightBoxInfoButton_bl == "no" ? false : true;
			
			self.showLightBoxSlideShowButton_bl =  self.propsObj.showLightBoxSlideShowButton;
			self.showLightBoxSlideShowButton_bl =  self.showLightBoxSlideShowButton_bl == "no" ? false : true;
			
			self.slideShowAutoPlay_bl = self.propsObj.slideShowAutoPlay;
			self.slideShowAutoPlay_bl = self.slideShowAutoPlay_bl == "yes" ? true : false;
			
			self.lightBoxVideoWidth = self.propsObj.lightBoxVideoWidth || 640;
			self.lightBoxVideoHeight = self.propsObj.lightBoxVideoHeight || 480;
			self.lightBoxIframeWidth = self.propsObj.lightBoxIframeWidth || 800;
			self.lightBoxIframeHeight = self.propsObj.lightBoxIframeHeight || 600;
			
			self.lightBoxInfoWindowBackgroundColor_str =  self.propsObj.lightBoxInfoWindowBackgroundColor || "transparent";
			self.lightBoxBackgroundColor_str = self.propsObj.lightBoxBackgroundColor || "transparent";
			self.lightBoxInfoWindowBackgroundOpacity =  self.propsObj.lightBoxInfoWindowBackgroundOpacity || 1;
			self.lightBoxBackgroundOpacity = self.propsObj.lightBoxInfoWindowBackgroundOpacity || 1;
			self.lightBoxMainBackgroundOpacity = self.propsObj.lightBoxMainBackgroundOpacity || 1;
			self.lightBoxItemBorderColor_str1 = self.propsObj.lightBoxItemBorderColor1 || "transparent";
			self.lightBoxItemBorderColor_str2 = self.propsObj.lightBoxItemBorderColor2 || "transparent";
			self.lightBoxItemBackgroundColor_str = self.propsObj.lightBoxItemBackgroundColor || "transparent";
			self.lightBoxBorderSize = self.propsObj.lightBoxBorderSize || 0;
			self.lightBoxBorderRadius = self.propsObj.lightBoxBorderRadius || 0;
			self.lightBoxSlideShowDelay = self.propsObj.lightBoxSlideShowDelay || 4000;
			
			// parse datalist.
			var dataListAr = FWDS3DCovUtils.getChildrenFromAttribute(self.rootElement, "data-cat");
			
			if (!dataListAr)
			{
				errorMessage = "At least one datalist ul tag with the attribute <font color='#FFFFFF'>data-cat</font> must be defined.";
				self.dispatchEvent(FWDS3DCovData.LOAD_ERROR, {text:errorMessage});
				return;
			}
			
			var totalDataLists = dataListAr.length;
			var allMediaAr = [];
			var mediaAr;
			var dataAr;
			var childKidsAr;
			var curUlElem;
			var totalChildren;
			var totalInnerChildren;
			var dataListChildrenAr;
			var mediaKid;
			var attributeMissing;
			var dataListPositionError;
			var positionError;

			for (var i=0; i<totalDataLists; i++)
			{
				curUlElem = dataListAr[i];
				dataAr = [];
				mediaAr = [];
				dataListChildrenAr = FWDS3DCovUtils.getChildren(curUlElem);
				totalChildren = dataListChildrenAr.length;

				for (var j=0; j<totalChildren; j++)
				{
					var obj = {};
					var child = dataListChildrenAr[j];
					var childKidsAr = FWDS3DCovUtils.getChildren(child);
					
					dataListPositionError = i + 1;
					positionError = j + 1;
					
					totalInnerChildren = childKidsAr.length;
					
					
					// check for data-thumbnail-path attribute.
					var hasError = true;
					
					for (var k=0; k<totalInnerChildren; k++)
					{
						attributeMissing = "data-thumbnail-path";
						
						if (FWDS3DCovUtils.hasAttribute(childKidsAr[k], "data-thumbnail-path"))
						{
							hasError = false;
							obj.thumbPath = FWDS3DCovUtils.trim(FWDS3DCovUtils.getAttributeValue(childKidsAr[k], "data-thumbnail-path"));
							mediaKid = childKidsAr[k];
							
							break;
						}
					}
					
					if (hasError)
					{
						errorMessage = "Element with attribute <font color='#FFFFFF'>" + attributeMissing + "</font> is not defined in the datalist number - <font color='#FFFFFF'>" + dataListPositionError + "</font> at position - <font color='#FFFFFF'>" + positionError + "</font> in the datalist ul element.";
						self.dispatchEvent(FWDS3DCovData.LOAD_ERROR, {text:errorMessage});
						return;
					}
					
					if (FWDS3DCovUtils.hasAttribute(mediaKid, "data-thumbnail-width") && FWDS3DCovUtils.hasAttribute(mediaKid, "data-thumbnail-height"))
					{
						obj.thumbWidth = parseInt(FWDS3DCovUtils.trim(FWDS3DCovUtils.getAttributeValue(mediaKid, "data-thumbnail-width"))) + self.thumbBorderSize * 2;
						obj.thumbHeight = parseInt(FWDS3DCovUtils.trim(FWDS3DCovUtils.getAttributeValue(mediaKid, "data-thumbnail-height"))) + self.thumbBorderSize * 2;
					}
					else
					{
						obj.thumbWidth = self.thumbWidth;
						obj.thumbHeight = self.thumbHeight;
					}
					
					if (self.showTooltip || self.showText)
					{
						// check for data-thumbnail-text attribute.
						var hasError = true;
						
						for (var k=0; k<totalInnerChildren; k++)
						{
							attributeMissing = "data-thumbnail-text";
							
							if (FWDS3DCovUtils.hasAttribute(childKidsAr[k], "data-thumbnail-text"))
							{
								hasError = false;
								obj.thumbText = childKidsAr[k].innerHTML;
								mediaKid = childKidsAr[k];
								
								break;
							}
						}
						
						if (hasError)
						{
							errorMessage = "Element with attribute <font color='#FFFFFF'>" + attributeMissing + "</font> is not defined in the datalist number - <font color='#FFFFFF'>" + dataListPositionError + "</font> at position - <font color='#FFFFFF'>" + positionError + "</font> in the datalist ul element.";
							self.dispatchEvent(FWDS3DCovData.LOAD_ERROR, {text : errorMessage});
							return;
						}
					}
					
					//check for data-type attribute.
					hasError = true;
					
					for (var k=0; k<totalInnerChildren; k++)
					{
						attributeMissing = "data-type";
						
						if (FWDS3DCovUtils.hasAttribute(childKidsAr[k], "data-type"))
						{
							hasError = false;
							obj.mediaType = FWDS3DCovUtils.trim(FWDS3DCovUtils.getAttributeValue(childKidsAr[k], "data-type"));
							
							break;
						}
					}
					
					if (hasError)
					{
						errorMessage = "Element with attribute <font color='#FFFFFF'>" + attributeMissing + "</font> is not defined in the datalist number - <font color='#FFFFFF'>" + dataListPositionError + "</font> at position - <font color='#FFFFFF'>" + positionError + "</font> in the datalist ul element.";
						self.dispatchEvent(FWDS3DCovData.LOAD_ERROR, {text:errorMessage});
						return;
					}
					
					if (obj.mediaType != "none")
					{
						//check for data-url attribute.
						hasError = true;
						
						for (var k=0; k<totalInnerChildren; k++)
						{
							attributeMissing = "data-url";
							
							if (FWDS3DCovUtils.hasAttribute(childKidsAr[k], "data-url"))
							{
								hasError = false;
								mediaKid = childKidsAr[k];
								
								break;
							}
						}
						
						if (hasError)
						{
							errorMessage = "Element with attribute <font color='#FFFFFF'>" + attributeMissing + "</font> is not defined in the datalist number - <font color='#FFFFFF'>" + dataListPositionError + "</font> at position - <font color='#FFFFFF'>" + positionError + "</font> in the datalist ul element.";
							self.dispatchEvent(FWDS3DCovData.LOAD_ERROR, {text:errorMessage});
							return;
						}
					}
					
					mediaKid = childKidsAr[k];
					
					//set arrays for lightbox.
					var secondObj = {};
					secondObj.dataType = FWDS3DCovUtils.trim(FWDS3DCovUtils.getAttributeValue(mediaKid, "data-type"));
					secondObj.url = FWDS3DCovUtils.trim(FWDS3DCovUtils.getAttributeValue(mediaKid, "data-url"));
					secondObj.target = FWDS3DCovUtils.getAttributeValue(mediaKid, "data-target");	
					secondObj.info = FWDS3DCovUtils.getAttributeValue(mediaKid, "data-info");
					
					if(!secondObj.target) secondObj.target = "_blank";
					
					//check for data-info attribute.
					for (var k=0; k<totalInnerChildren; k++)
					{
						if(FWDS3DCovUtils.hasAttribute(childKidsAr[k], "data-info"))
						{
							secondObj.infoText = childKidsAr[k].innerHTML;
							break;
						}
					}
					
					obj.secondObj = secondObj;
					
					if ((obj.mediaType != "link") && (obj.mediaType != "none"))
					{
						mediaAr.push(secondObj);
						allMediaAr.push(secondObj);
					}
					
					dataAr[j] = obj;
				}
				
				self.categoriesAr[i] = FWDS3DCovUtils.getAttributeValue(curUlElem, "data-cat") || "not defined!";
				self.dataListAr[i] = dataAr;
				self.lightboxAr[i] = mediaAr;
			}
			
			self.startAtCategory = self.propsObj.startAtCategory || 1;
			if(isNaN(self.startAtCategory)) self.startAtCategory = 1;
			if(self.startAtCategory <= 0) self.startAtCategory = 1;
			if(self.startAtCategory > totalDataLists) self.startAtCategory = totalDataLists;
			
			self.startAtCategory -= 1;
			
			if (!self.propsObj.skinPath)
			{
				self.dispatchEvent(FWDS3DCovData.LOAD_ERROR, {text:"Coverflow graphics skin path is not defined in FWDSimple3DCoverflow constructor function!"});
				return;
			}
			
			//set coverflow graphics paths
			self.preloaderPath = self.propsObj.skinPath + "/preloader.png";
			var nextButtonNPath = self.propsObj.skinPath + "/nextButtonNormalState.png";
			var nextButtonSPath = self.propsObj.skinPath + "/nextButtonSelectedState.png";
			var prevButtonNPath = self.propsObj.skinPath + "/prevButtonNormalState.png";
			var prevButtonSPath = self.propsObj.skinPath + "/prevButtonSelectedState.png";
			var playButtonNPath = self.propsObj.skinPath + "/playButtonNormalState.png";
			var playButtonSPath = self.propsObj.skinPath + "/playButtonSelectedState.png";
			var pauseButtonPath = self.propsObj.skinPath + "/pauseButtonSelectedState.png";
			var handlerLeftNPath = self.propsObj.skinPath + "/handlerLeftNormal.png";
			var handlerLeftSPath = self.propsObj.skinPath + "/handlerLeftSelected.png";
			self.handlerCenterNPath = self.propsObj.skinPath + "/handlerCenterNormal.png";
			self.handlerCenterSPath = self.propsObj.skinPath + "/handlerCenterSelected.png";
			var handlerRightNPath = self.propsObj.skinPath + "/handlerRightNormal.png";
			var handlerRightSPath = self.propsObj.skinPath + "/handlerRightSelected.png";
			var trackLeftPath = self.propsObj.skinPath + "/trackLeft.png";
			self.trackCenterPath = self.propsObj.skinPath + "/trackCenter.png";
			var trackRightPath = self.propsObj.skinPath + "/trackRight.png";
			var slideshowTimerPath = self.propsObj.skinPath + "/slideshowTimer.png";
			var slideShowPreloaderPath_str = self.propsObj.skinPath + "/slideShowPreloader.png";
			var lightboxCloseButtonN_str = self.propsObj.skinPath + "/closeButtonNormalState.png";
			var lightboxCloseButtonS_str = self.propsObj.skinPath + "/closeButtonSelectedState.png";
			var lightboxNextButtonN_str = self.propsObj.skinPath + "/lightboxNextButtonNormalState.png";
			var lightboxNextButtonS_str = self.propsObj.skinPath + "/lightboxNextButtonSelectedState.png";
			var lightboxPrevButtonN_str = self.propsObj.skinPath + "/lightboxPrevButtonNormalState.png";
			var lightboxPrevButtonS_str = self.propsObj.skinPath + "/lightboxPrevButtonSelectedState.png";
			var lightboxPlayButtonN_str = self.propsObj.skinPath + "/lightboxPlayButtonNormalState.png";
			var lightboxPlayButtonS_str = self.propsObj.skinPath + "/lightboxPlayButtonSelectedState.png";
			var lightboxPauseButtonN_str = self.propsObj.skinPath + "/lightboxPauseButtonNormalState.png";
			var lightboxPauseButtonS_str = self.propsObj.skinPath + "/lightboxPauseButtonSelectedState.png";
			var lightboxMaximizeButtonN_str = self.propsObj.skinPath + "/maximizeButtonNormalState.png";
			var lightboxMaximizeButtonS_str = self.propsObj.skinPath + "/maximizeButtonSelectedState.png";
			var lightboxMinimizeButtonN_str = self.propsObj.skinPath + "/minimizeButtonNormalState.png";
			var lightboxMinimizeButtonS_str = self.propsObj.skinPath + "/minimizeButtonSelectedState.png";
			var lightboxInfoButtonOpenN_str = self.propsObj.skinPath + "/infoButtonOpenNormalState.png";
			var lightboxInfoButtonOpenS_str = self.propsObj.skinPath + "/infoButtonOpenSelectedState.png";
			var lightboxInfoButtonCloseN_str = self.propsObj.skinPath + "/infoButtonCloseNormalPath.png";
			var lightboxInfoButtonCloseS_str = self.propsObj.skinPath + "/infoButtonCloseSelectedPath.png";
			
			//add paths
			self.graphicsPathsAr.push(nextButtonNPath);
			self.graphicsPathsAr.push(nextButtonSPath);
			self.graphicsPathsAr.push(prevButtonNPath);
			self.graphicsPathsAr.push(prevButtonSPath);
			self.graphicsPathsAr.push(playButtonNPath);
			self.graphicsPathsAr.push(playButtonSPath);
			self.graphicsPathsAr.push(pauseButtonPath);
			self.graphicsPathsAr.push(handlerLeftNPath);
			self.graphicsPathsAr.push(handlerLeftSPath);
			self.graphicsPathsAr.push(self.handlerCenterNPath);
			self.graphicsPathsAr.push(self.handlerCenterSPath);
			self.graphicsPathsAr.push(handlerRightNPath);
			self.graphicsPathsAr.push(handlerRightSPath);
			self.graphicsPathsAr.push(trackLeftPath);
			self.graphicsPathsAr.push(self.trackCenterPath);
			self.graphicsPathsAr.push(trackRightPath);
			self.graphicsPathsAr.push(slideshowTimerPath);
			self.graphicsPathsAr.push(self.preloaderPath);
			self.graphicsPathsAr.push(lightboxCloseButtonN_str);
			self.graphicsPathsAr.push(lightboxCloseButtonS_str);
			self.graphicsPathsAr.push(lightboxNextButtonN_str);
			self.graphicsPathsAr.push(lightboxNextButtonS_str);
			self.graphicsPathsAr.push(lightboxPrevButtonN_str);
			self.graphicsPathsAr.push(lightboxPrevButtonS_str);
			self.graphicsPathsAr.push(lightboxPlayButtonN_str);
			self.graphicsPathsAr.push(lightboxPlayButtonS_str);
			self.graphicsPathsAr.push(lightboxPauseButtonN_str);
			self.graphicsPathsAr.push(lightboxPauseButtonS_str);
			self.graphicsPathsAr.push(lightboxMaximizeButtonN_str);
			self.graphicsPathsAr.push(lightboxMaximizeButtonS_str);
			self.graphicsPathsAr.push(lightboxMinimizeButtonN_str);
			self.graphicsPathsAr.push(lightboxMinimizeButtonS_str);
			self.graphicsPathsAr.push(lightboxInfoButtonOpenN_str);
			self.graphicsPathsAr.push(lightboxInfoButtonOpenS_str);
			self.graphicsPathsAr.push(lightboxInfoButtonCloseN_str);
			self.graphicsPathsAr.push(lightboxInfoButtonCloseS_str);
			self.graphicsPathsAr.push(slideShowPreloaderPath_str);
			
			self.totalGraphics = self.graphicsPathsAr.length;
			
			// set images
			self.mainPreloaderImg = new Image();
			self.nextButtonNImg = new Image();
			self.nextButtonSImg = new Image();
			self.prevButtonNImg = new Image();
			self.prevButtonSImg = new Image();
			self.playButtonNImg = new Image();
			self.playButtonSImg = new Image();
			self.pauseButtonImg = new Image();
			self.handlerLeftNImg = new Image();
			self.handlerLeftSImg = new Image();
			self.handlerCenterNImg = new Image();
			self.handlerCenterSImg = new Image();
			self.handlerRightNImg = new Image();
			self.handlerRightSImg = new Image();
			self.trackLeftImg = new Image();
			self.trackCenterImg = new Image();
			self.trackRightImg = new Image();
			self.slideshowTimerImg = new Image();
			self.lightboxPreloader_img = new Image();
			self.lightboxCloseButtonN_img = new Image();
			self.lightboxCloseButtonS_img = new Image();
			self.lightboxNextButtonN_img = new Image();
			self.lightboxNextButtonS_img = new Image();
			self.lightboxPrevButtonN_img = new Image();
			self.lightboxPrevButtonS_img = new Image();
			self.lightboxPlayN_img = new Image();
			self.lightboxPlayS_img = new Image();
			self.lightboxPauseN_img = new Image();
			self.lightboxPauseS_img = new Image();
			self.lightboxMaximizeN_img = new Image();
			self.lightboxMaximizeS_img = new Image();
			self.lightboxMinimizeN_img = new Image();
			self.lightboxMinimizeS_img = new Image();
			self.lightboxInfoOpenN_img = new Image();
			self.lightboxInfoOpenS_img = new Image();
			self.lightboxInfoCloseN_img = new Image();
			self.lightboxInfoCloseS_img = new Image();
			self.slideShowPreloader_img = new Image();
			
			// add images in array
			self.imagesAr.push(self.nextButtonNImg);
			self.imagesAr.push(self.nextButtonSImg);
			self.imagesAr.push(self.prevButtonNImg);
			self.imagesAr.push(self.prevButtonSImg);
			self.imagesAr.push(self.playButtonNImg);
			self.imagesAr.push(self.playButtonSImg);
			self.imagesAr.push(self.pauseButtonImg);
			self.imagesAr.push(self.handlerLeftNImg);
			self.imagesAr.push(self.handlerLeftSImg);
			self.imagesAr.push(self.handlerCenterNImg);
			self.imagesAr.push(self.handlerCenterSImg);
			self.imagesAr.push(self.handlerRightNImg);
			self.imagesAr.push(self.handlerRightSImg);
			self.imagesAr.push(self.trackLeftImg);
			self.imagesAr.push(self.trackCenterImg);
			self.imagesAr.push(self.trackRightImg);
			self.imagesAr.push(self.slideshowTimerImg);
			self.imagesAr.push(self.lightboxPreloader_img);
			self.imagesAr.push(self.lightboxCloseButtonN_img);
			self.imagesAr.push(self.lightboxCloseButtonS_img);
			self.imagesAr.push(self.lightboxNextButtonN_img);
			self.imagesAr.push(self.lightboxNextButtonS_img);
			self.imagesAr.push(self.lightboxPrevButtonN_img);
			self.imagesAr.push(self.lightboxPrevButtonS_img);
			self.imagesAr.push(self.lightboxPlayN_img);
			self.imagesAr.push(self.lightboxPlayS_img);
			self.imagesAr.push(self.lightboxPauseN_img);
			self.imagesAr.push(self.lightboxPauseS_img);
			self.imagesAr.push(self.lightboxMaximizeN_img);
			self.imagesAr.push(self.lightboxMaximizeS_img);
			self.imagesAr.push(self.lightboxMinimizeN_img);
			self.imagesAr.push(self.lightboxMinimizeS_img);
			self.imagesAr.push(self.lightboxInfoOpenN_img);
			self.imagesAr.push(self.lightboxInfoOpenS_img);
			self.imagesAr.push(self.lightboxInfoCloseN_img);
			self.imagesAr.push(self.lightboxInfoCloseS_img);
			self.imagesAr.push(self.slideShowPreloader_img);
			
			//Remove datalist element.
			try
			{
				self.rootElement.parentNode.removeChild(self.rootElement);
			}
			catch(e){};

			self.loadPreloader();
		};
		
		this.loadPreloader = function()
		{
			var imagePath = self.preloaderPath;
			var image = self.mainPreloaderImg;
			
			image.onload = self.onPreloaderImageLoadHandler;
			image.onerror = self.onImageLoadErrorHandler;
			image.src = imagePath;
		};
		
		this.onPreloaderImageLoadHandler = function(e)
		{
			self.dispatchEvent(FWDS3DCovData.PRELOADER_LOAD_DONE);
			self.loadGraphics();
		};

		this.loadGraphics = function()
		{	
			for (var i=0; i<self.totalGraphics; i++)
			{
				var imagePath = self.graphicsPathsAr[i];
				var image = self.imagesAr[i];
				
				image.onload = self.onImageLoadHandler;
				image.onerror = self.onImageLoadErrorHandler;
				
				image.src = imagePath;
			}
		};
		
		this.onImageLoadHandler = function(e)
		{
			self.countLoadedGraphics++;
			
			if (self.countLoadedGraphics == self.totalGraphics)
			{
				self.dispatchEvent(FWDS3DCovData.LOAD_DONE);
			}
		};

		this.onImageLoadErrorHandler = function(e)
		{
			var message;
			
			if (FWDS3DCovUtils.isIE8)
			{
				message = "Graphics image not found!";
			}
			else
			{
				message = "Graphics image not found! <font color='#FFFFFF'>" + e.target.src + "</font>";
			}

			var err = {text : message};
			
			self.dispatchEvent(FWDS3DCovData.LOAD_ERROR, err);
		};
		
		/* check if element with and attribute exists or throw error */
		this.checkForAttribute = function(e, attr)
		{
			var test = FWDS3DCovUtils.getChildFromNodeListFromAttribute(e, attr);
			
			test = test ? FWDS3DCovUtils.trim(FWDS3DCovUtils.getAttributeValue(test, attr)) : undefined;
			
			if (!test)
			{
				self.dispatchEvent(FWDS3DCovData.LOAD_ERROR, {text:"Element  with attribute <font color='#FFFFFF'>" + attr + "</font> is not defined."});
				return;
			}
			
			return test;
		};

		/* destroy */
		this.destroy = function()
		{
			clearTimeout(self.parseDelayId);
			
			var image = self.mainPreloaderImg;
			
			image.onload = null;
			image.onerror = null;	
			image.src = "";
			image = null;
			
			for (var i=0; i<self.totalGraphics; i++)
			{
				image = self.imagesAr[i];
				
				image.onload = null;
				image.onerror = null;	
				image.src = "";
				image = null;
			}

			self.propsObj = null;
			self.imagesAr = null;
			self.graphicsPathsAr = null;
			self.imagesAr = null;
			self.dataListAr = null;
			self.lightboxAr = null;
			self.categoriesAr = null;
			
			if(this.mainPreloaderImg) this.mainPreloaderImg.src = "";
			if(this.thumbTitleGradientImg) this.thumbTitleGradientImg.src = "";
			if(this.nextButtonNImg) this.nextButtonNImg.src = "";
			if(this.nextButtonSImg) this.nextButtonSImg.src = "";
			if(this.prevButtonNImg) this.prevButtonNImg.src = "";
			if(this.prevButtonSImg) this.prevButtonSImg.src = "";
			if(this.playButtonNImg) this.playButtonNImg.src = "";
			if(this.playButtonSImg) this.playButtonSImg.src = "";
			if(this.pauseButtonNImg) this.pauseButtonNImg.src = "";
			if(this.pauseButtonSImg) this.pauseButtonSImg.src = "";
			if(this.handlerLeftNImg) this.handlerLeftNImg.src = "";
			if(this.handlerLeftSImg) this.handlerLeftSImg.src = "";
			if(this.handlerCenterNImg) this.handlerCenterNImg.src = "";
			if(this.handlerCenterSImg) this.handlerCenterSImg.src = "";
			if(this.handlerRightNImg) this.handlerRightNImg.src = "";
			if(this.handlerRightSImg) this.handlerRightSImg.src = "";
			if(this.trackLeftImg) this.trackLeftImg.src = "";
			if(this.trackCenterImg) this.trackCenterImg.src = "";
			if(this.trackRightImg) this.trackRightImg.src = "";
			if(this.slideshowTimerImg) this.slideshowTimerImg.src = "";
			
			this.mainPreloaderImg = null;
			this.thumbTitleGradientImg = null;
			this.nextButtonNImg = null;
			this.nextButtonSImg = null;
			this.prevButtonNImg = null;
			this.prevButtonSImg = null;
			this.playButtonNImg = null;
			this.playButtonSImg = null;
			this.pauseButtonNImg = null;
			this.pauseButtonSImg = null;
			this.handlerLeftNImg = null;
			this.handlerLeftSImg = null;
			this.handlerCenterNImg = null;
			this.handlerCenterSImg = null;
			this.handlerRightNImg = null;
			this.handlerRightSImg = null;
			this.trackLeftImg = null;
			this.trackCenterImg = null;
			this.trackRightImg = null;
			this.slideshowTimerImg = null;
			
			//lightbox
			if(this.lightboxCloseButtonN_img) this.lightboxCloseButtonN_img.src = "";
			if(this.lightboxCloseButtonS_img) this.lightboxCloseButtonS_img.src = "";
			if(this.lightboxNextButtonN_img) this.lightboxNextButtonN_img.src = "";
			if(this.lightboxNextButtonS_img) this.lightboxNextButtonS_img.src = "";
			if(this.lightboxPrevButtonN_img) this.lightboxPrevButtonN_img.src = "";
			if(this.lightboxPrevButtonS_img) this.lightboxPrevButtonS_img.src = "";
			if(this.lightboxPlayN_img) this.lightboxPlayN_img.src = "";
			if(this.lightboxPlayS_img) this.lightboxPlayS_img.src = "";
			if(this.lightboxPauseN_img) this.lightboxPauseN_img.src = "";
			if(this.lightboxPauseS_img) this.lightboxPauseS_img.src = "";
			if(this.lightboxMaximizeN_img) this.lightboxMaximizeN_img.src = "";
			if(this.lightboxMaximizeS_img) this.lightboxMaximizeS_img.src = "";
			if(this.lightboxMinimizeN_img) this.lightboxMinimizeN_img.src = "";
			if(this.lightboxMinimizeS_img) this.lightboxMinimizeS_img.src = "";
			if(this.lightboxInfoOpenN_img) this.lightboxInfoOpenN_img.src = "";
			if(this.lightboxInfoOpenS_img) this.lightboxInfoOpenS_img.src = "";
			if(this.lightboxInfoCloseN_img) this.lightboxInfoCloseN_img.src = "";
			if(this.lightboxInfoCloseS_img) this.lightboxInfoCloseS_img.src = "";
			
			this.lightboxCloseButtonN_img = null;
			this.lightboxCloseButtonS_img = null;
			this.lightboxNextButtonN_img = null;
			this.lightboxNextButtonS_img = null;
			this.lightboxPrevButtonN_img = null;
			this.lightboxPrevButtonS_img = null;
			this.lightboxPlayN_img = null;
			this.lightboxPlayS_img = null;
			this.lightboxPauseN_img = null;
			this.lightboxPauseS_img = null;
			this.lightboxMaximizeN_img = null;
			this.lightboxMaximizeS_img = null;
			this.lightboxMinimizeN_img = null;
			this.lightboxMinimizeS_img = null;
			this.lightboxInfoOpenN_img = null;
			this.lightboxInfoOpenS_img = null;
			this.lightboxInfoCloseN_img = null;
			this.lightboxInfoCloseS_img = null;

			prototype.destroy();
			self = null;
			prototype = null;
			FWDS3DCovData.prototype = null;
		};

		this.init();
	};

	/* set prototype */
	FWDS3DCovData.setPrototype = function()
	{
		FWDS3DCovData.prototype = new FWDS3DCovEventDispatcher();
	};

	FWDS3DCovData.prototype = null;
	FWDS3DCovData.PRELOADER_LOAD_DONE = "onPreloaderLoadDone";
	FWDS3DCovData.LOAD_DONE = "onLoadDone";
	FWDS3DCovData.LOAD_ERROR = "onLoadError";

	window.FWDS3DCovData = FWDS3DCovData;
}(window));