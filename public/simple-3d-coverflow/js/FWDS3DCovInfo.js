/* Info screen */
(function (window){
	
	var FWDS3DCovInfo = function(){
		
		var self = this;
		var prototype = FWDS3DCovInfo.prototype;
		
		/* init */
		this.init = function(){
			this.setWidth(500);
			this.setBkColor("#FF0000");
			this.getStyle().padding = "10px";
		};
		
		this.showText = function(txt){
			this.setInnerHTML(txt);
		};
		
		/* destroy */
		this.destroy = function(){

			prototype.destroy();
			FWDS3DCovInfo.prototype = null;
			self = null;
		};
		
		this.init();
	};
		
	/* set prototype */
	FWDS3DCovInfo.setPrototype = function(){
		FWDS3DCovInfo.prototype = new FWDS3DCovDisplayObject("div", "relative");
	};
	
	FWDS3DCovInfo.prototype = null;
	window.FWDS3DCovInfo = FWDS3DCovInfo;
}(window));