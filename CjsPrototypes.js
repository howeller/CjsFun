/*
/*
	@version: 1.0.1 // Major. Minor. Bugfix
	@author: howeller, eric.howell@ogilvy.com
	@desc: Animation Prototypes to extend CjsFun class.
	@usage: 
		* Declare protoypes before CjsFun instantiation either in the HTML <script> or Frame0 
			
			CjsFun.prototype.slideIn=function(_mc, _sp, _delay, _ease){
				this.initMc(_mc);
				_options = _options || {};
				var delay = _delay||0,
						sp = _options.sp||0.3,
						ease = _options.ease||this.ease,//createjs.Ease.quadOut;//
						startX = _options.startX||(0-_mc.nominalBounds.width);
				_mc.x = startX;
				createjs.Tween.get(_mc, {override:false}).wait(delay*1000).to({x:_mc.stageX}, sp*1000, myEase);
			}
		
		* Instantiate CjsFun on Frame 0	
			this.fun = new CjsFun(this);

		* Execute on any frame:
			this.fun.slideIn( this.mc1, 1.5, {sp:1.1, createjs.Ease.BackIn});
*/			
// console.log("CjsFun.prototype! "+this);

/*
	Slides down mc from -= mc height or specified startY
*/
CjsFun.prototype.slideDown=function(_mc, _delay, _options){
	console.log("slideDown! "+_mc);
	this.initMc(_mc);
	_options = _options || {};
	var delay = _delay||0,
			sp = _options.sp||0.3,
			ease = _options.ease||this.ease,//createjs.Ease.quadOut;//
			startY = _options.startY||(_mc.y-_mc.nominalBounds.height);
	_mc.y = startY;
	createjs.Tween.get(_mc, {override:false}).wait(delay*1000).to({y:_mc.stageY}, sp*1000, ease);
}


/*
	Slides in MC from offstage left or variable startX
*/
CjsFun.prototype.slideIn=function(_mc, _delay, _options){
	this.initMc(_mc);
	_options = _options || {};
	var delay = _delay||0,
			sp = _options.sp||0.3,
			ease = _options.ease||this.ease,//createjs.Ease.quadOut;//
			startX = _options.startX||(0-_mc.nominalBounds.width);
	_mc.x = startX;
	createjs.Tween.get(_mc, {override:false}).wait(delay*1000).to({x:_mc.stageX}, sp*1000, myEase);
}

/*
	Slides in MC from variable startY
*/
CjsFun.prototype.slideUp=function(_mc, _delay, _options){
	this.initMc(_mc);
	_options = _options || {};
	var delay = _delay||0,
			sp = _options.sp||0.3,
			ease = _options.ease||this.ease,//createjs.Ease.quadOut;//
			startY = _options.startY||(canvas.height);
	_mc.y = startY;
	createjs.Tween.get(_mc, {override:false}).wait(delay*1000).to({y:_mc.stageY}, sp*1000, ease);
}

/*
	Tweens out mc to variable x position
*/
CjsFun.prototype.slideOut=function(_mc, _delay, _options){
	this.initMc(_mc);
	_options = _options || {};
	var delay = _delay||0,
			sp = _options.sp||0.3,
			ease = _options.ease||this.ease,//createjs.Ease.quadOut;//
			endX = _options.endX||(0-_mc.nominalBounds.width);
	// console.log("< slideOut _sp"+_sp+" endX:"+endX);
	createjs.Tween.get(_mc, {override:false}).wait(delay).to({x:endX}, sp, myEase);
}

/*
	Tweens scale to from 0 to size on stage.
*/
CjsFun.prototype.scaleIn=function(_mc, _delay, _options){
	this.initMc(_mc);
	_options = _options || {};
	var delay = _delay||0,
			sp = _options.sp||0.3,
			ease = _options.ease||this.ease;//createjs.Ease.quadOut;//
	// console.log("scaleIn! "+_mc.scaleX+" stageScale:"+stageScale);
	_mc.scaleX = _mc.scaleY = 0;
	createjs.Tween.get(_mc,{override:false}).wait(_delay*1000).to({scaleX:_mc.stageScaleX,scaleY:_mc.stageScaleY}, _sp*1000, _ease);
}

/*
	Tweens scale to 0
*/
CjsFun.prototype.scaleOut=function(_mc, _delay, _options){
	this.initMc(_mc);
	_options = _options || {};
	var delay = _delay||0,
			sp = _options.sp||0.3,
			ease = _options.ease||this.ease;//createjs.Ease.quadOut;//
	// console.log("scaleOut! "+_mc.scaleX+" stageScale:"+stageScale);
	createjs.Tween.get(_mc,{override:false}).wait(_delay*1000).to({scaleX:0,scaleY:0}, _sp*1000, _ease);
}

/*
	ONLY WORKS FOR MCs ON MAIN TIMELINE. Returns instance names on movieclips. Name property does not work.
*/
/*createjs.DisplayObject.prototype.getName = function() {
	if (this._cacheName === undefined) {
		var parent = exportRoot;//this.parent;
		var keys = Object.keys(parent);
		var len = keys.length;
		while (--len) {
			if (parent[keys[len]] === this) {
				this._cacheName = keys[len];
				break;
			}
		}
	}
	return this._cacheName;
}*/
