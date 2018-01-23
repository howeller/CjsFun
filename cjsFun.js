/*
	@version: 2.0.0
	@author: howeller
	@desc: Animation & Timeline Utilities for AnimateCC 2017.5 & 2018 banners.
	@dependencies: createjs_2015.11.26 & easeljs_0.8.2
	@usage:
		* Set global var in DOM
			var fun = null;

		* Initialize & Set custom speed variable on Frame "0" in AnimateCC
			fun = new cjsFun(this);
			fun.sp = 0.6;

		* Execute on any frame:
			fun.fadeIn( this.mc1 ); 								// Use default speed, no delay
			fun.slideIn( this.mc2, fun.sp, 2);			// Use default speed, custom delay, default start point
			fun.slideIn( this.mc3, 0.5, 1.5, 300); 	// Set all custom params
			fun.pauser(3);
			console.log(fun.getTotalRuntTime()); // Place on end frame to log estimated runtime

		* To Extend:
			cjsFun.prototype.slideDown=function(mc, _sp, _delay, _startY){
				this.initMc(mc);
				var startY = _startY||(0-mc.nominalBounds.height),
						delay = _delay||0,
						mySp = _sp||this.sp,
				console.log("slideDown "+this.sp);
				mc.y = startY;
				createjs.Tween.get(mc, {override:true}).wait(delay*1000).to({y:mc.stageY}, mySp*1000, createjs.Ease.quadOut);
			}
			fun = new cjsFun(this);
			fun.slideDown(this.mc4, sp, 1.2, canvas.height);

		* To Automatically build a clickthrough button sized to the stage:
			fun = new cjsFun(this, myClickThoughFunction);
*/

function cjsFun(_timeline,_clickThruFunc){

	var version="2.0.0", // Major. Minor. Bugfix
			instance=null,	// The cached instance
			tl=_timeline,
			totalPauseTime=0,
			resetPool =[];

	// Rewrite the constructor
	cjsFun = function() {
		console.log("Making cjsFun : version "+version);
		return instance;
	}

	cjsFun.prototype = this;			// Carry over the prototype
	instance = new cjsFun();			// The Instance
	instance.constructor = cjsFun;// Reset the constructor pointer

	// Create dynamic clickThrough button if clickthrough function is passed
	if(!!_clickThruFunc && typeof _clickThruFunc === 'function'){
		makeClickThruBtn(_clickThruFunc);
	}

	// Private

	function makeClickThruBtn(_fxn){
		var cjs = cjs||createjs;
		var clickZone = new cjs.Shape();
		var hitArea = new cjs.Shape();
		hitArea.graphics.beginFill("#000").drawRect(0,0,canvas.width,canvas.height); // Get width from canvas or lib.properties object?
		clickZone.hitArea = hitArea;
		clickZone.setBounds(0,0,canvas.width,canvas.height);
		clickZone.x = clickZone.y = clickZone.regX = clickZone.regY = 0;
		clickZone.name = "bgClick";
		clickZone.cursor = "pointer";
		clickZone.addEventListener("click", _fxn);
		// cjsFun.bgClick = clickZone;
		instance.bgClick = clickZone;
		stage.addChild(clickZone);
		stage.setChildIndex(clickZone, 0);// Set to bottom of stack //stage.getNumChildren()-1 (on top)
		console.log("makeClickThruBtn [?] "+clickZone.getBounds()+" "+clickZone+" ");	
	}
	function goTime(){
		tl.play();
	}
	function setReg(mc){
		var stageRegX = mc.regX;
		var stageRegY = mc.regY;

		mc.regX = mc.regY = 0;
		mc.x -= stageRegX;
		mc.y -= stageRegY;
	}

	// Public

	instance.bgClick=null;
	instance.sp=0.3;
	instance.ease = createjs.Ease.quadOut;

	instance.pauser=function(_delay){
		var delay = _delay||0;
		tl.stop();
		totalPauseTime=totalPauseTime||0;
		totalPauseTime+=_delay;
		createjs.Tween.get(tl,{override:true}).wait(delay*1000).call(goTime);
		// console.log("pauser! on frame: "+tl.currentFrame+" for "+_delay+" seconds : totalPauseTime "+totalPauseTime);
	}
	instance.getTotalRuntTime=function(){
		var fps = createjs.Ticker.getFPS();// Updated for AnimateCC2017.5
		var runTime = (tl.totalFrames/fps)+totalPauseTime;
		// console.log("TotalRuntTime is "+(runTime)+" seconds");
		return runTime;
	}
	instance.initMc=function(mc){
		// console.log("initMc "+mc);
		if (!mc.init){
			mc.init = true;
			setReg(mc);
			var bounds = mc.nominalBounds;
			mc.width = bounds.width;
			mc.height = bounds.height;
			mc.stageX = Math.round(mc.x);
			mc.stageY = Math.round(mc.y);
			mc.stageScaleX = mc.scaleX;
			mc.stageScaleY = mc.scaleY;
		}
		if (mc.reset===undefined || mc.reset===true){
			mc.reset = false;
			resetPool.push(mc);	
		}
	}
	/*instance.slideIn=function(_mc, _sp, _delay, _startX){
		this.initMc(_mc);
		var startX = _startX || (0-_mc.nominalBounds.width),
				delay = _delay||0,
				mySp = _sp||this.sp;
		_mc.x = startX;
		createjs.Tween.get(_mc, {override:true}).wait(delay*1000).to({x:_mc.stageX}, mySp*1000, createjs.Ease.quadOut);
	}
	instance.slideDown=function(_mc, _sp, _delay, _startY){
		this.initMc(_mc);
		var startY = _startY||(_mc.y-_mc.nominalBounds.height),
				delay = _delay||0,
				mySp = _sp||this.sp,
				stageX = _mc.stageX;
		_mc.y = startY;
		createjs.Tween.get(_mc, {override:true}).wait(delay*1000).to({y:_mc.stageY}, mySp*1000, createjs.Ease.quadOut);
	}*/
	instance.fadeIn=function(_mc, _options={sp:this.sp, delay:0, ease:this.ease}){
		this.initMc(_mc);
		_mc.alpha = 0;
		createjs.Tween.get(_mc).wait(_options.delay*1000).to({alpha:1}, _options.sp*1000, _options.ease);
	}
	instance.fadeOut=function(_mc, _options={sp:this.sp, delay:0, ease:this.ease}){
		this.initMc(_mc);
		createjs.Tween.get(_mc).wait(_options.delay*1000).to({alpha:0}, _options.sp*1000, _options.ease);
	}
	instance.resetAllMc=function(){
		console.log("resetAllMc ");
		for (var i in resetPool){
			var mc = resetPool[i];
			if (!mc.reset){
				mc.alpha = 1;
				mc.x = mc.stageX;
				mc.y = mc.stageY;
				mc.scaleX = mc.stageScaleX;
				mc.scaleY = mc.stageScaleY;
				mc.nominalBounds.width = mc.width;
				mc.nominalBounds.height = mc.height;
				mc.reset = true;
			}
		}
		resetPool=[];
		totalPauseTime=0;
	}
	return instance;
}