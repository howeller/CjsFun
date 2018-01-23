/*
	@version: 1.0.7
	@author: howeller
	@desc: Animation & Timeline Utilities for AnimateCC 2017.5 & 2018 banners.
	@dependencies: createjs_2015.11.26 & easeljs_0.8.2
	@usage:
		* Set global var in DOM
			var fun = null;

		* Initialize, Build click through button & Set custom speed variable on Frame "0" in AnimateCC
			fun = cjsFun.init(this, myClickThroughFunction);
			fun.sp = 0.6;

		* Execute on any frame:
			fun.fadeIn( this.mc1 ); 								// Use default speed, no delay
			fun.slideIn( this.mc2, fun.sp, 2);			// Use default speed, custom delay, default start point
			fun.slideIn( this.mc3, 0.5, 1.5, 300); 	// Set all custom params
			fun.pauser(3);
			console.log(fun.getTotalRuntTime()); // Place on end frame to log estimated runtime
*/

var cjsFun=(function(){
	var version="1.0.7",
			instance=null,
			tl=null;

	function createInstance(){

		// Private
		var totalPauseTime=0,
				resetPool =[];

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
		function initMc(mc){
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
		function makeClickThruBtn(_fxn){
			var clickZone = new cjs.Shape();
			//var clickZone = new cjs.MovieClip(); // Use Movieclip or Shape?
			var hitArea = new cjs.Shape();
			hitArea.graphics.beginFill("#000").drawRect(0,0,canvas.width,canvas.height); // Get width from canvas or lib.properties object?
			clickZone.hitArea = hitArea;
			clickZone.setBounds(0,0,canvas.width,canvas.height);
			clickZone.x = clickZone.y = clickZone.regX = clickZone.regY = 0;
			clickZone.name = "bgClick";
			clickZone.cursor = "pointer";
			clickZone.addEventListener("click", _fxn);
			cjsFun.bgClick = clickZone;
			stage.addChild(clickZone);
			stage.setChildIndex( clickZone, 0);// Set to bottom of stack //stage.getNumChildren()-1 (on top)
			console.log("makeClickThruBtn [?] "+clickZone.getBounds()+" "+clickZone);	
		}
		return{
			 // Public 
			bgClick:null,
			sp:0.3,
			pauser:function(_delay){
				var delay = _delay||0;
				tl.stop();
				totalPauseTime=totalPauseTime||0;
				totalPauseTime+=_delay;
				createjs.Tween.get(tl,{override:true}).wait(delay*1000).call(goTime);
				// console.log("pauser! on frame: "+tl.currentFrame+" for "+_delay+" seconds : totalPauseTime "+totalPauseTime);
			},
			getTotalRuntTime:function(){
				var fps = createjs.Ticker.getFPS();// Updated for AnimateCC2017.5
				var runTime = (tl.totalFrames/fps)+totalPauseTime;
				// console.log("TotalRuntTime is "+(runTime)+" seconds");
				return runTime;
			},
			slideIn:function(mc, _sp, _delay, _startX){
				initMc(mc);
				var startX = _startX || (0-mc.nominalBounds.width),
						delay = _delay||0,
						mySp = _sp||instance.sp;
				mc.x = startX;
				createjs.Tween.get(mc, {override:true}).wait(delay*1000).to({x:mc.stageX}, mySp*1000, createjs.Ease.quadOut);
			},
			slideDown:function(mc, _sp, _delay, _startY){
				initMc(mc);
				var startY = _startY||(mc.y-mc.nominalBounds.height),
						delay = _delay||0,
						mySp = _sp||instance.sp,
						stageX = mc.stageX;
				mc.y = startY;
				createjs.Tween.get(mc, {override:true}).wait(delay*1000).to({y:mc.stageY}, mySp*1000, createjs.Ease.quadOut);
			},
			fadeIn:function(mc, _sp, _delay){
				initMc(mc);
				var delay = _delay||0,
						mySp = _sp||instance.sp;
				mc.alpha = 0;
				createjs.Tween.get(mc).wait(delay*1000).to({alpha:1}, mySp*1000, createjs.Ease.quadOut);
			},
			fadeOut:function(mc, _sp, _delay){
				initMc(mc);
				var delay = _delay||0,
						mySp = _sp||instance.sp;
				createjs.Tween.get(mc).wait(delay*1000).to({alpha:0}, mySp*1000, createjs.Ease.quadOut);
			},
			resetAllMc:function(){
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
		}
	}
	return{
		init:function(_timeline, _clickThruFunc){
			// Get the cjsFun instance if one exists or create one if it doesn't
			if ( !instance ) {
				tl = _timeline;
				instance = createInstance();
				if(!!_clickThruFunc && typeof _clickThruFunc === 'function'){
					makeClickThruBtn(_clickThruFunc);
				}
				console.log("Making cjsFun : version "+version);
			}
			return instance;
		}
	}
})();	