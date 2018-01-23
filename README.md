# CjsFun
Animation and Timeline Utility for AnimateCC/createJs generated banners. 

## Dependencies
createjs_2015.11.26

## Native methods
pauser(delay:0)
	*	Pauses timeline for variable amout of time.

getTotalRuntTime:Number
	*	Returns total time pauser was used + main timeline time.

initMc
	*	Records stage position of Movieclip. 
	*	Resets transformation point to 0,0.
	*	Required when extending this module

resetAllMc
	*	For timeline replay events. 
	*	Resets all MovieClip positions and opacity to original positions. 

fadeIn( MovieClip, {sp:Number, delay:Number, ease:createjsEaseFunction})
	*	Fades in a movieclip from opacity 0

fadeOut( MovieClip, {sp:Number, delay:Number, ease:createjsEaseFunction})
	*	Fades out a movieclip to opacity 0
## How to use
Set global var in DOM or on stage
```javascript
var fun = null;
```
Initialize & Set custom speed variable on Frame "0" in AnimateCC
```javascript
fun = new CjsFun(this);
fun.sp = 0.6;
```
Execute on any frame:
```javascript
fun.fadeIn( this.mc1 ); 								// Use default speed, no delay
fun.slideIn( this.mc2, fun.sp, 2);			// Use default speed, custom delay, default start point
fun.slideIn( this.mc3, 0.5, 1.5, 300); 	// Set all custom params
fun.pauser(3.1);
console.log(fun.getTotalRuntTime()); // Place on end frame to log estimated runtime
```

##To Extend:
```javascript
CjsFun.prototype.slideDown=function(mc, _sp, _delay, _startY){
	this.initMc(mc); // Required
	var startY = _startY||(0-mc.nominalBounds.height),
			delay = _delay||0,
			mySp = _sp||this.sp,
	mc.y = startY;
	createjs.Tween.get(mc).wait(delay*1000).to({y:mc.stageY}, mySp*1000, createjs.Ease.quadOut);
}
fun = new CjsFun(this);
fun.slideDown(this.mc4, fun.sp, 1.2, canvas.height);
```
To Automatically build a clickthrough button sized to the stage:
```javascript
fun = new CjsFun(this, myClickThoughFunction);
```