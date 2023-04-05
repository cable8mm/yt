/* Slide show time manager */
(function(window){
	
	var FWDS3DCovTimerManager = function(delay, autoplay){
		
		var self = this;
		var prototpype = FWDS3DCovTimerManager.prototype;
		
		this.timeOutId;
		this.delay = delay;
		this.isStopped_bl = !autoplay;
		
		this.stop = function(){
			clearTimeout(this.timeOutId);
			this.dispatchEvent(FWDS3DCovTimerManager.STOP);
		};
		
		this.start = function(){
			if(!this.isStopped_bl){
				this.timeOutId = setTimeout(this.onTimeHanlder, this.delay);
				this.dispatchEvent(FWDS3DCovTimerManager.START);
			}
		};
		
		this.onTimeHanlder = function(){
			self.dispatchEvent(FWDS3DCovTimerManager.TIME);
		};
		
		/* destroy */
		this.destroy = function(){
			
			clearTimeout(this.timeOutId);
			
			prototpype.destroy();
			self = null;
			prototpype = null;
			FWDS3DCovTimerManager.prototype = null;
		};
	};

	FWDS3DCovTimerManager.setProtptype = function(){
		FWDS3DCovTimerManager.prototype = new FWDS3DCovEventDispatcher();
	};
	
	FWDS3DCovTimerManager.START = "start";
	FWDS3DCovTimerManager.STOP = "stop";
	FWDS3DCovTimerManager.TIME = "time";
	
	FWDS3DCovTimerManager.prototype = null;
	window.FWDS3DCovTimerManager = FWDS3DCovTimerManager;
	
}(window));