/*
	@version: 2.1.1
	@author: howeller, eric@howellstudio.com
	@desc: Animation & Timeline Utilities for AnimateCC 2017.5 & 2018 banners.
	@dependencies: createjs_2015.11.26 & easeljs_0.8.2
	@usage:
		* Set global var in DOM
			var fun = null;

		* Initialize & Set custom speed variable on Frame "0" in AnimateCC
			fun = new CjsFun(this);
			fun.sp = 0.6;

		* Execute on any frame:
			fun.fadeIn( this.mc1 );	// Use default speed, no delay
			fun.slideIn( this.mc2, fun.sp, 2);	// Use default speed, custom delay, default start point
			fun.slideIn( this.mc3, 0.5, 1.5, 300);	// Set all custom params
			fun.pauser(3);
			console.log(fun.getTotalRuntTime()); // Place on end frame to log estimated runtime

		* To Extend:
			CjsFun.prototype.slideDown=function(_mc, _delay, _options){
				this.initMc(mc); // Required
				_options=_options||{};
				var delay = _delay||0,
						sp = _options.sp||0.3,
						ease = _options.ease||createjs.Ease.quadOut;
						startY = _options.startY||(_mc.y-_mc.nominalBounds.height);
				mc.y = startY;
				createjs.Tween.get(mc, {override:true}).wait(delay*1000).to({y:mc.stageY}, sp*1000, ease);
			}
			Framescript:
			fun.slideDown(this.mc4, 1.2, { sp: 0.5, startY: 600 });

		* To Automatically build a clickthrough button sized to the stage:
			fun = new CjsFun(this, myClickThoughFunction);
*/

function CjsFun(_timeline,_clickThruFunc){

	var version="2.1.1", // Major. Minor. Bugfix
			instance=null,	// The cached instance
			tl=_timeline,
			totalPauseTime=0,
			resetPool =[];

	// Rewrite the constructor
	CjsFun = function() {
		return instance;
	}

	CjsFun.prototype = this;			// Carry over the prototype
	instance = new CjsFun();			// The Instance
	instance.constructor = CjsFun;// Reset the constructor pointer
	console.log("Making CjsFun : version "+version);

	// Create dynamic clickThrough button if clickthrough function is passed
	if(!!_clickThruFunc && typeof _clickThruFunc === 'function'){
		makeClickThruBtn(_clickThruFunc);
	}

	// Private

	function makeClickThruBtn(_fxn){
		var cjs = cjs||createjs;
		var clickZone = new cjs.Shape();
		var hitArea = new cjs.Shape();
		hitArea.graphics.beginFill("#000").drawRect(0,0,canvas.width,canvas.height);
		clickZone.hitArea = hitArea;
		clickZone.setBounds(0,0,canvas.width,canvas.height);
		clickZone.x = clickZone.y = clickZone.regX = clickZone.regY = 0;
		clickZone.name = "bgClick";
		clickZone.cursor = "pointer";
		clickZone.addEventListener("click", _fxn);
		instance.bgClick = clickZone;
		stage.addChild(clickZone);
		stage.setChildIndex(clickZone, 0);// Set to bottom of stack //stage.getNumChildren()-1 (on top)
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
	instance.globalSpeed=0.3;
	instance.ease = createjs.Ease.quadOut;

	instance.pauser=function(_delay){
		var delay = _delay||0;
		tl.stop();
		totalPauseTime=totalPauseTime||0;
		totalPauseTime+=_delay;
		createjs.Tween.get(tl,{override:true}).wait(delay*1000).call(function(){tl.play()});
	}
	instance.getTotalRuntTime=function(){
		var fps = createjs.Ticker.getFPS();// Updated for AnimateCC2017.5
		var runTime = (tl.totalFrames/fps)+totalPauseTime;
		return runTime;
	}
	instance.initMc=function(mc, _options){
		if (!mc.init){
			_options=_options||{};
			mc.init = true;
			if (!_options.useStageReg){setReg(mc)}
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
	instance.fadeIn=function(_mc, _delay, _options){
		this.initMc(_mc);
		_options = _options || {};
		var delay = _delay||0,
				sp = _options.sp||this.globalSpeed,
				ease = _options.ease||this.ease;
		_mc.alpha = 0;
		createjs.Tween.get(_mc).wait(delay*1000).to({alpha:1}, sp*1000, ease);
	}
	instance.fadeOut=function(_mc, _delay, _options){
		this.initMc(_mc);
		_options = _options || {};
		var delay = _delay||0,
				sp = _options.sp||this.globalSpeed,
				ease = _options.ease||this.ease;
		createjs.Tween.get(_mc).wait(delay*1000).to({alpha:0}, sp*1000, ease);
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
	instance.replay=function(){
		instance.resetAllMc();
		tl.gotoAndPlay(0);
	}
	return instance;
}