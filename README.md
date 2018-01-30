# CjsFun
Animation and Timeline Utility for Animate Generated HTML Banners.

## Dependencies
[createjs_2015.11.26](https://github.com/CreateJS/Combined)
-Shared Library for [DCM ads](https://s0.2mdn.net/ads/studio/cached_libs/createjs_2015.11.26_54e1c3722102182bb133912ad4442e19_min.js)
-Shared Library for [Sizmek ads](https://secure-ds.serving-sys.com/BurstingcachedScripts/libraries/createjs/createjs-2015.11.26.min.js)

## Properties
**globalSpeed**: 0.3<br/>
- Set a global default speed for animation functions.

**ease**: createjs.Ease.quadOut<br/>
- Set a global default ease for animation functions.

## Methods
**pauser**(delay:0)<br/>
- Pauses timeline for variable amout of time.

**getTotalRuntTime**:Number<br/>
- Returns total time pauser was used + main timeline time.

**initMc** ( Movieclip, { useStageReg:Boolean } )<br/>
- Records stage position, scale, & opacity of Movieclip. 
- Resets transformation point to 0,0 unless useStageReg arguement is passed.<br/>
- Required when extending this module

**replay**<br/>
- Built in replay event callback.<br/>
- Tells main timeline to gotoAndPlay(0) and calls resetAllMc()

**resetAllMc**<br/>
- For timeline replay events. <br/>
- Resets all MovieClip positions and opacity to original positions. 

**fadeIn**( MovieClip, delay:Number, { sp: globalSpeed, ease: createjsEaseFunction })<br/>
- Fades in a movieclip from opacity 0

**fadeOut**( MovieClip, delay:Number, { sp: globalSpeed, ease: createjsEaseFunction })<br/>
- Fades out a movieclip to opacity 0

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
fun.fadeIn( this.mc1 );	// Use default speed, no delay
fun.slideIn( this.mc2, 1.1, { sp:fun.globaSpeed });	// Use global speed, custom delay, default start point
fun.slideIn( this.mc3, 2.2, { sp:0.35, startX:300 });	// Set all custom params
fun.pauser(3.1); 
console.log(fun.getTotalRuntTime()); // Place on end frame to log estimated runtime
```
To Automatically build a clickthrough button sized to the stage:
```javascript
fun = new CjsFun(this, myClickThoughFunction);
```
To replay animation and reset all programatic tweens:
```javascript
this.my_replay_button.addEventlistener( "click", fun.replay, false);
```
To only reset all programatic tweens in custome replay event handler:
```javascript
this.my_replay_button.addEventlistener( "click", onReplayClick, false);

function onReplayClick(e){
	// Custom code
	fun.resetAllMc();
}
```
## To Extend:
```javascript
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
```
