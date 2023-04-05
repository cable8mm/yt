/* FWDS3DCovTooltip */
(function(window)
{
	var FWDS3DCovTooltip = function(propsObj)
	{
		var self = this;
		var prototype = FWDS3DCovTooltip.prototype;

		this.tooltipMainDO;
		this.tooltipTopDO;
		this.tooltipBottomDO;
		this.tooltipCenterDO;
		this.tooltipLeftDO;
		this.tooltipRightDO;
		this.tooltipHolderDO;
		this.tooltipPointerBottomDO;
		this.tooltipPointerTopDO;
		this.tooltipTextDO;
		this.tooltipOverDO;
		
		this.tooltipMaxWidth = propsObj.tooltipMaxWidth;
		this.text = propsObj.text;
		this.btnMode = propsObj.btnMode;
		
		this.tooltipMarginSpace = 6;
		this.tooltipShadowOffset = 3;
		
		this.pointerDX = 0;
		this.pointerWidth = 0;
		this.pointerHeight = 0;
		
		this.tooltipSwapped = false;
		this.tooltipWidth = 0;
		this.tooltipHeight = 0;
		
		// ##########################################//
		/* initialize this */
		// ##########################################//
		this.init = function()
		{
			self.setupText();
		};

		this.setupText = function()
		{
			self.tooltipMainDO = new FWDS3DCovDisplayObject("div");
			self.addChild(self.tooltipMainDO);
			
			self.tooltipHolderDO = new FWDS3DCovDisplayObject("div");
			self.tooltipMainDO.addChild(self.tooltipHolderDO);
			
			self.tooltipHolderDO.setWidth(1000);
			
			self.tooltipTextDO = new FWDS3DCovSimpleDisplayObject("div");
			self.tooltipHolderDO.addChild(self.tooltipTextDO);
			
			self.tooltipTextDO.getStyle().fontSmoothing = "antialiased";
			self.tooltipTextDO.getStyle().webkitFontSmoothing = "antialiased";
			self.tooltipTextDO.getStyle().textRendering = "optimizeLegibility";
			
			self.tooltipTextDO.setInnerHTML(self.text);
			
			self.setTextWidthId = setTimeout(self.setTextWidth, 10);
		};
		
		this.setTextWidth = function()
		{
			if (self.tooltipTextDO.getWidth() > self.tooltipMaxWidth)
			{
				self.tooltipTextDO.setWidth(self.tooltipMaxWidth);
				self.setTextHeightId = setTimeout(self.setTextHeight, 10);
			}
			else
			{
				self.textWidth = self.tooltipTextDO.getWidth();
				self.textHeight = self.tooltipTextDO.getHeight();
				
				self.setupTooltip();
			}
		};
		
		this.setTextHeight = function()
		{
			self.textWidth = self.tooltipTextDO.getWidth();
			self.textHeight = self.tooltipTextDO.getHeight();
			
			self.setupTooltip();
		};
		
		this.setupTooltip = function()
		{
			//center
			self.tooltipCenterDO = new FWDS3DCovSimpleDisplayObject("img");
			self.tooltipCenterDO.screen.src = propsObj.skinPath + "/center.png";
			self.tooltipHolderDO.addChild(self.tooltipCenterDO);
			
			self.tooltipCenterDO.setWidth(self.textWidth + self.tooltipShadowOffset * 2 + 2);
			self.tooltipCenterDO.setHeight(self.textHeight + self.tooltipShadowOffset * 2 + 2);
			
			self.tooltipCenterDO.setX(self.tooltipMarginSpace - 1);
			self.tooltipCenterDO.setY(self.tooltipMarginSpace - 1);
			
			// top
			self.tooltipTopDO = new FWDS3DCovSimpleDisplayObject("img");
			self.tooltipTopDO.screen.src = propsObj.skinPath + "/top.png";
			self.tooltipHolderDO.addChild(self.tooltipTopDO);
			
			self.tooltipTopDO.setWidth(self.textWidth + self.tooltipMarginSpace * 2);
			self.tooltipTopDO.setHeight(self.tooltipMarginSpace);
			
			self.tooltipTopDO.setX(self.tooltipShadowOffset);
			
			//left
			self.tooltipLeftDO = new FWDS3DCovSimpleDisplayObject("img");
			self.tooltipLeftDO.screen.src = propsObj.skinPath + "/left.png";
			self.tooltipHolderDO.addChild(self.tooltipLeftDO);
			
			self.tooltipLeftDO.setWidth(self.tooltipMarginSpace);
			self.tooltipLeftDO.setHeight(self.textHeight + self.tooltipMarginSpace * 2);
			
			self.tooltipLeftDO.setY(self.tooltipShadowOffset);
			
			//right
			self.tooltipRightDO = new FWDS3DCovSimpleDisplayObject("img");
			self.tooltipRightDO.screen.src = propsObj.skinPath + "/right.png";
			self.tooltipHolderDO.addChild(self.tooltipRightDO);
			
			self.tooltipRightDO.setWidth(self.tooltipMarginSpace);
			self.tooltipRightDO.setHeight(self.textHeight + self.tooltipMarginSpace * 2);
			
			self.tooltipRightDO.setX(self.textWidth + self.tooltipMarginSpace + self.tooltipShadowOffset * 2);
			self.tooltipRightDO.setY(self.tooltipShadowOffset);
			
			//bottom
			self.tooltipBottomDO = new FWDS3DCovSimpleDisplayObject("img");
			self.tooltipBottomDO.screen.src = propsObj.skinPath + "/bottom.png";
			self.tooltipHolderDO.addChild(self.tooltipBottomDO);
			
			self.tooltipBottomDO.setWidth(self.textWidth + self.tooltipMarginSpace * 2);
			self.tooltipBottomDO.setHeight(self.tooltipMarginSpace);
			
			self.tooltipBottomDO.setX(self.tooltipShadowOffset);
			self.tooltipBottomDO.setY(self.textHeight + self.tooltipMarginSpace + self.tooltipShadowOffset * 2);
			
			//pointer bottom
			self.image1 = new Image();
			self.image1.onload = self.onPointerBottomLoad;
			self.image1.src = propsObj.skinPath + "/pointerBottom.png";
			
			//text
			self.tooltipHolderDO.addChild(self.tooltipTextDO);
			
			self.tooltipTextDO.setX(self.tooltipMarginSpace + self.tooltipShadowOffset);
			self.tooltipTextDO.setY(self.tooltipMarginSpace + self.tooltipShadowOffset);
		};
		
		this.onPointerBottomLoad = function()
		{
			self.tooltipPointerBottomDO = new FWDS3DCovSimpleDisplayObject("img");
			self.tooltipPointerBottomDO.setScreen(self.image1);
			self.tooltipMainDO.addChild(self.tooltipPointerBottomDO);
			
			self.pointerWidth = self.tooltipPointerBottomDO.getWidth();
			self.pointerHeight = self.tooltipPointerBottomDO.getHeight();
			
			self.tooltipPointerBottomDO.setX(Math.floor((self.textWidth + 2 * self.tooltipMarginSpace + self.tooltipShadowOffset * 2 - self.pointerWidth)/2));
			self.tooltipPointerBottomDO.setY(self.textHeight + 2 * self.tooltipMarginSpace + self.tooltipShadowOffset);
			
			//pointer top
			self.image2 = new Image();
			self.image2.onload = self.onPointerTopLoad;
			self.image2.src = propsObj.skinPath + "/pointerTop.png";
		};
		
		this.onPointerTopLoad = function()
		{
			self.tooltipPointerTopDO = new FWDS3DCovSimpleDisplayObject("img");
			self.tooltipPointerTopDO.setScreen(self.image2);
			self.tooltipMainDO.addChild(self.tooltipPointerTopDO);
			
			self.tooltipPointerTopDO.setX(-500);
			
			self.tooltipPointerTopDO.setX(Math.floor((self.textWidth + 2 * self.tooltipMarginSpace + self.tooltipShadowOffset * 2 - self.pointerWidth)/2));
			self.tooltipPointerTopDO.setY(self.tooltipShadowOffset);
			
			self.tooltipHolderDO.setWidth(self.textWidth + 2 * self.tooltipMarginSpace + self.tooltipShadowOffset * 2);
			self.tooltipHolderDO.setHeight(self.textHeight + 2 * self.tooltipMarginSpace + self.pointerHeight);
			
			self.tooltipMainDO.setWidth(self.textWidth + 2 * self.tooltipMarginSpace + self.tooltipShadowOffset * 2);
			self.tooltipMainDO.setHeight(self.textHeight + 2 * self.tooltipMarginSpace + self.pointerHeight + self.tooltipShadowOffset * 2);
			
			self.tooltipMainDO.setX(-Math.floor(self.tooltipMainDO.getWidth()/2));
			self.tooltipMainDO.setY(-self.tooltipMainDO.getHeight());
			
			self.tooltipOverDO = new FWDS3DCovDisplayObject("div");
			self.addChild(self.tooltipOverDO);
			
			self.tooltipOverDO.setWidth(self.textWidth + 2 * self.tooltipMarginSpace);
			self.tooltipOverDO.setHeight(self.textHeight + 2 * self.tooltipMarginSpace + self.pointerHeight);
			
			self.tooltipOverDO.setX(-Math.floor(self.tooltipMainDO.getWidth()/2));
			self.tooltipOverDO.setY(-self.tooltipMainDO.getHeight());
			
			if (self.btnMode)
			{
				self.setButtonMode(true);
			}
			
			self.tooltipWidth = self.textWidth + 2 * self.tooltipMarginSpace;
			self.tooltipHeight = self.textHeight + 2 * self.tooltipMarginSpace + self.pointerHeight;
		};
		
		this.getTooltipWidth = function()
		{
			return self.tooltipWidth;
		};
		
		this.getTooltipHeight = function()
		{
			return self.tooltipHeight;
		};
		
		this.setPointerDX = function(dx)
		{
			if (self.pointerDX == dx)
				return;
			
			self.pointerDX = dx;
			
			if (self.tooltipPointerBottomDO)
			{
				self.tooltipPointerBottomDO.setX(Math.floor((self.textWidth + 2 * self.tooltipMarginSpace + self.tooltipShadowOffset * 2 - self.pointerWidth)/2 + self.pointerDX));
			}
			
			if (self.tooltipPointerTopDO)
			{
				self.tooltipPointerTopDO.setX(Math.floor((self.textWidth + 2 * self.tooltipMarginSpace + self.tooltipShadowOffset * 2 - self.pointerWidth)/2 + self.pointerDX));
			}
		};
		
		this.swapTooltip = function(st)
		{			
			self.tooltipSwapped = st;
			
			if (self.tooltipSwapped)
			{
				self.tooltipMainDO.setY(0);
				self.tooltipHolderDO.setY(self.pointerHeight);
				
				if (self.tooltipOverDO)
				{
					self.tooltipOverDO.setY(0);
				}
				
				if (self.tooltipPointerTopDO)
				{
					self.tooltipPointerTopDO.setX(Math.floor((self.textWidth + 2 * self.tooltipMarginSpace + self.tooltipShadowOffset * 2 - self.pointerWidth)/2 + self.pointerDX));
				}
				
				if (self.tooltipPointerBottomDO)
				{
					self.tooltipPointerBottomDO.setX(-500);
				}
			}
			else
			{
				self.tooltipMainDO.setY(-self.tooltipMainDO.getHeight());
				self.tooltipHolderDO.setY(0);
				
				if (self.tooltipOverDO)
				{
					self.tooltipOverDO.setY(-self.tooltipMainDO.getHeight());
				}
				
				if (self.tooltipPointerTopDO)
				{
					self.tooltipPointerTopDO.setX(-500);
				}
				
				if (self.tooltipPointerBottomDO)
				{
					self.tooltipPointerBottomDO.setX(Math.floor((self.textWidth + 2 * self.tooltipMarginSpace + self.tooltipShadowOffset * 2 - self.pointerWidth)/2 + self.pointerDX));
				}
			}
		};

		// ##############################//
		/* destroy */
		// ##############################//
		this.destroy = function()
		{	
			clearTimeout(self.setTextWidthId);
			clearTimeout(self.setTextHeightId);
			
			self.tooltipMainDO.destroy();
			self.tooltipTopDO.destroy();
			self.tooltipBottomDO.destroy();
			self.tooltipCenterDO.destroy();
			self.tooltipLeftDO.destroy();
			self.tooltipRightDO.destroy();
			self.tooltipHolderDO.destroy();
			self.tooltipPointerBottomDO.destroy();
			self.tooltipPointerTopDO.destroy();
			self.tooltipTextDO.destroy();
			self.tooltipOverDO.destroy();
			
			self.tooltipMainDO = null;
			self.tooltipTopDO = null;
			self.tooltipBottomDO = null;
			self.tooltipCenterDO = null;
			self.tooltipLeftDO = null;
			self.tooltipRightDO = null;
			self.tooltipHolderDO = null;
			self.tooltipPointerBottomDO = null;
			self.tooltipPointerTopDO = null;
			self.tooltipTextDO = null;
			self.tooltipOverDO = null;
			
			self.setInnerHTML("");
			prototype.destroy();
			self = null;
			prototype = null;
			FWDS3DCovTooltip.prototype = null;
		};

		this.init();
	};

	/* set prototype */
	FWDS3DCovTooltip.setPrototype = function()
	{
		FWDS3DCovTooltip.prototype = new FWDS3DCovDisplayObject("div", "absolute", "visible");
	};

	FWDS3DCovTooltip.CHANGE = "onChange";

	FWDS3DCovTooltip.prototype = null;
	window.FWDS3DCovTooltip = FWDS3DCovTooltip;
}(window));