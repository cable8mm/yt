/* FWDS3DCovCategoriesMenu */
(function(window)
{
	var FWDS3DCovCategoriesMenu = function(parent, labelsAr, curId, maxWidth, menuHeight, catOffset, catColorN, catColorS)
	{
		var self = this;
		var prototype = FWDS3DCovCategoriesMenu.prototype;
		
		this.parent = parent;
		this.labelsAr = labelsAr;
		this.curId = curId;
		this.maxWidth = maxWidth;
		this.menuHeight = menuHeight;
		this.catOffset = catOffset;
		this.catColorN = catColorN;
		this.catColorS = catColorS;

		this.totalItems = self.labelsAr.length;
		this.buttonsAr = [];
		
		this.buttonsHolderDO;
		
		this.disableButtonClick = false;

		this.isMobile = FWDS3DCovUtils.isMobile;
		this.hasPointerEvent = FWDS3DCovUtils.hasPointerEvent;

		// ##########################################//
		/* initialize this */
		// ##########################################//
		this.init = function()
		{
			self.setZ(200000);
			
			self.buttonsHolderDO = new FWDS3DCovDisplayObject("div");
			self.addChild(self.buttonsHolderDO);
			
			var button;
			
			for (var i=0; i<self.totalItems; i++)
			{
				FWDS3DCovCategoriesButton.setPrototype();
				
				button = new FWDS3DCovCategoriesButton(i, self.labelsAr[i], self.catColorN, self.catColorS, self.menuHeight);
				self.buttonsHolderDO.addChild(button);
				
				self.buttonsAr.push(button);
				
				button.addListener(FWDS3DCovCategoriesButton.CLICK, self.onButtonClick);
			}
			
			self.buttonsAr[self.curId].disable();
			
			self.setAlpha(0);
			self.positionButtonsId = setTimeout(self.positionButtons, 50);
		};
		
		this.positionButtons = function()
		{
			var button;
			
			self.totalWidth = self.buttonsAr[0].totalWidth;
			
			for (var i=1; i<self.totalItems; i++)
			{
				button = self.buttonsAr[i];
				
				button.setX(self.buttonsAr[i-1].getX() + self.buttonsAr[i-1].totalWidth + 1);
				self.totalWidth += self.buttonsAr[i].totalWidth + 1;
			}
			
			if (self.totalWidth > self.maxWidth)
			{
				self.setWidth(self.maxWidth);
				
				if (self.isMobile)
				{
					self.setupMobileDrag();
				}
				else if(self.screen.addEventListener)
				{
					self.screen.addEventListener("mousemove", self.onMouseMove);
				}
				else if(self.screen.attachEvent)
				{
					self.screen.attachEvent("onmousemove", self.onMouseMove);
				}
			}
			else
			{
				self.setWidth(self.totalWidth);
			}
			
			self.setHeight(self.menuHeight);
			
			self.buttonsHolderDO.setWidth(self.totalWidth);
			self.buttonsHolderDO.setHeight(self.menuHeight);
			
			self.position();
		};
		
		this.position = function()
		{
			self.setX(Math.floor((self.parent.stageWidth - self.getWidth())/2));
			self.setY(self.catOffset);
			
			FWDS3DCovModTweenMax.to(self, .8, {alpha:1});
		};
		
		this.onButtonClick = function(e)
		{
			self.curId = e.id;
			
			for (var i=0; i<self.totalItems; i++)
			{
				button = self.buttonsAr[i];
				
				if (i == self.curId)
				{
					button.disable();
				}
				else
				{
					button.enable();
				}
			}
			
			self.dispatchEvent(FWDS3DCovCategoriesMenu.CHANGE, {id:self.curId});
		};
		
		this.onMouseMove = function(e)
		{
			var vmc = FWDS3DCovUtils.getViewportMouseCoordinates(e);
			
			var newX = ((vmc.screenX - parent.rect.left - self.getX()) / self.getWidth()) * (self.getWidth() - self.totalWidth);
			
			FWDS3DCovModTweenMax.to(self.buttonsHolderDO, .2, {x:Math.floor(newX)});
		};
		
		this.setValue = function(id)
		{
			self.curId = id;
			
			for (var i=0; i<self.totalItems; i++)
			{
				button = self.buttonsAr[i];
				
				if (i == self.curId)
				{
					button.disable();
				}
				else
				{
					button.enable();
				}
			}
		};
		
		//##########################################//
		/* setup mobile drag */
		//##########################################//
		this.setupMobileDrag = function()
		{
			if (self.hasPointerEvent)
			{
				self.screen.addEventListener("MSPointerDown", self.mobileDragStartHandlerCat);
			}
			else
			{
				self.screen.addEventListener("touchstart", self.mobileDragStartTestCat);
			}
		};
		
		this.mobileDragStartTestCat = function(e)
		{
			var viewportMouseCoordinates = FWDS3DCovUtils.getViewportMouseCoordinates(e);
			
			self.lastPressedX = viewportMouseCoordinates.screenX;
			self.lastPressedY = viewportMouseCoordinates.screenY;
			
			self.curX = self.buttonsHolderDO.getX();
			
			window.addEventListener("touchmove", self.mobileDragMoveTestCat);
			window.addEventListener("touchend", self.mobileDragEndTestCat);
		};
		
		this.mobileDragMoveTestCat = function(e)
		{
			if (e.touches.length != 1) return;
			
			self.disableButtonClick = true;
			
			var viewportMouseCoordinates = FWDS3DCovUtils.getViewportMouseCoordinates(e);	
			
			self.mouseX = viewportMouseCoordinates.screenX;
			self.mouseY = viewportMouseCoordinates.screenY;
			
			var angle = Math.atan2(self.mouseY - self.lastPressedY, self.mouseX - self.lastPressedX);
			var posAngle = Math.abs(angle) * 180 / Math.PI;
			
			if ((posAngle > 120) || (posAngle < 60))
			{
				if(e.preventDefault) e.preventDefault();
				
				var newX = self.curX + (self.mouseX - self.lastPressedX);
				
				newX = Math.min(newX, 0);
				newX = Math.max(newX, self.getWidth() - self.totalWidth);

				FWDS3DCovModTweenMax.to(self.buttonsHolderDO, .2, {x:Math.floor(newX)});
			}
			else
			{
				window.removeEventListener("touchmove", self.mobileDragMoveTestCat);
			}
		};
		
		this.mobileDragEndTestCat = function(e)
		{
			self.disableThumbClick = false;
			
			window.removeEventListener("touchmove", self.mobileDragMoveTestCat);
			window.removeEventListener("touchend", self.mobileDragEndTestCat);
		};
		
		this.mobileDragStartHandlerCat = function(e)
		{
			var viewportMouseCoordinates = FWDS3DCovUtils.getViewportMouseCoordinates(e);

			self.lastPressedX = viewportMouseCoordinates.screenX;	
			
			self.curX = self.buttonsHolderDO.getX();

			window.addEventListener("MSPointerUp", self.mobileDragEndHandlerCat, false);
			window.addEventListener("MSPointerMove", self.mobileDragMoveHandlerCat);
		};
		
		this.mobileDragMoveHandlerCat = function(e)
		{
			if(e.preventDefault) e.preventDefault();
			
			self.disableThumbClick = true;
			
			var viewportMouseCoordinates = FWDS3DCovUtils.getViewportMouseCoordinates(e);	
			
			self.mouseX = viewportMouseCoordinates.screenX;;
			
			var newX = self.curX + (self.mouseX - self.lastPressedX);
			
			newX = Math.max(newX, 0);
			newX = Math.min(newX, self.getWidth() - self.totalWidth);

			FWDS3DCovModTweenMax.to(self.buttonsHolderDO, .2, {x:Math.floor(newX)});
		};

		this.mobileDragEndHandlerCat = function(e)
		{
			self.disableThumbClick = false;
			
			window.removeEventListener("MSPointerUp", self.mobileDragEndHandlerCat);
			window.removeEventListener("MSPointerMove", self.mobileDragMoveHandlerCat);
		};

		// ##############################//
		/* destroy */
		// ##############################//
		this.destroy = function()
		{
			clearTimeout(self.positionButtonsId);
			
			FWDS3DCovModTweenMax.killTweensOf(self);
			FWDS3DCovModTweenMax.killTweensOf(self.buttonsHolderDO);
			
			for (var i=0; i<self.totalItems; i++)
			{
				 self.buttonsAr[i].destroy();
				 self.buttonsAr[i] = null;
			}
			
			self.setInnerHTML("");
			prototype.destroy();
			self = null;
			prototype = null;
			FWDS3DCovCategoriesMenu.prototype = null;
		};

		this.init();
	};

	/* set prototype */
	FWDS3DCovCategoriesMenu.setPrototype = function()
	{
		FWDS3DCovCategoriesMenu.prototype = new FWDS3DCovDisplayObject3D("div");
	};

	FWDS3DCovCategoriesMenu.CHANGE = "onChange";

	FWDS3DCovCategoriesMenu.prototype = null;
	window.FWDS3DCovCategoriesMenu = FWDS3DCovCategoriesMenu;
}(window));