# CjsFun
Singelton Timeline Utility for Adobe Animate HTML Banners.

## Constructor
CjsFun( `this:timeline`, `myClickThoughFunction:function` )
- `this` the stage timeline
- `myClickThoughFunction` accepts optional function to generate a dynamic button and apply your function as a click event. 

## Properties
**globalSpeed**: `0.3`
- Set a global default speed for animation functions.

**globalEase**: `createjs.Ease.quadOut`
- Set a global default ease for animation functions.

## Methods
**pauser**( `Number:0` )
- Pauses timeline for variable amout of time.

**getTotalRuntTime**
- Returns total time pauser was used + main timeline time.

**initMc** ( `Movieclip, { useStageReg:false }` )
- Records stage position, scale, & alpha of Movieclip. 
- Resets transformation point to 0,0 unless useStageReg arguement is passed.
- Required when extending this module

**replay**
- Built in replay event callback.
- Tells main timeline to gotoAndPlay(0) and calls resetAllMc()

**resetAllMc**
- For timeline replay events.
- Resets all MovieClip positions and alpha to original positions. 

**fadeIn**( `MovieClip, delay: 0, { sp: globalSpeed, ease: globalEase }`)
- Fades in a movieclip from alpha 0

**fadeOut**( `MovieClip, delay: 0, { sp: globalSpeed, ease: globalEase }`)
- Fades out a movieclip to alpha 0

## How to use
Set global var in DOM or on stage
```javascript
var fun = null;
```
Initialize & Set custom speed variable on Frame "0" in AnimateCC
```javascript
fun = new CjsFun( this );
fun.sp = 0.6;
fun.ease = createjs.Ease.cubicInOut;
```
To Automatically build a clickthrough button sized to the stage:
```javascript
fun = new CjsFun( this, myClickThoughFunction );
```
Execute on any frame:
```javascript
// Use only defaults, no delay.
fun.fadeIn( this.mc1 );	
// Set custom delay. Use default speed, ease.  
fun.fadeIn( this.mc2, 1.1);	
// Set all custom params
fun.fadeIn( this.mc3, 1.5, { sp: 0.5, ease: createjs.Ease.cubicInOut });
// Pause Timeline for 3 seconds
fun.pauser(3);
// Place on last frame to log estimated runtime
console.log(fun.getTotalRuntTime());
```
To replay animation and reset all programatic tweens:
```javascript
this.my_replay_button.addEventlistener( "click", fun.replay, false);
```
To only reset all programatic tweens in custome replay event handler:
```javascript
this.my_replay_button.addEventlistener( "click", onReplayClick, false);

function onReplayClick(e){
	// Your custom code
	fun.resetAllMc();
}
```
## To Extend:
```javascript
CjsFun.prototype.slideDown = function( _mc, _delay, _options ){
	this.initMc( _mc ); // Required
	_options = _options || {};
	var delay = _delay || 0,
		sp = _options.sp || 0.3,
		ease = _options.ease || createjs.Ease.quadOut;
		startY = _options.startY || (_mc.y - _mc.nominalBounds.height);
	mc.y = startY;
	createjs.Tween.get(mc, { override:true }).wait( delay*1000 ).to({ y: mc.stageY }, sp*1000, ease );
}
```
Then on framescript:
```javascript
fun.slideDown( this.mc4, 1.2, { sp: 0.5, startY: 600 });
```

## Dependencies
[createjs_2015.11.26](https://github.com/CreateJS/Combined)
- Shared Library for [DCM ads](https://s0.2mdn.net/ads/studio/cached_libs/createjs_2015.11.26_54e1c3722102182bb133912ad4442e19_min.js)
- Shared Library for [Sizmek ads](https://secure-ds.serving-sys.com/BurstingcachedScripts/libraries/createjs/createjs-2015.11.26.min.js)
