/*
	Name: 		White Noise App 2.0.4
	
	Updates:	Updated sound framework to use 
				HTML5 Audio instead of Create.js. 
				Simplified the mobile layout using
				flex box. Added loop to audio playback. 
				Fixed support for multiple noise 
				options. CodeKit now minifies CSS
				and JS files for faster loading.
				Removed unuseable volume slider on
				movile. Fixed border issues between
				column and row layout for settings.
				Preload initial audio file on 
				initial application load. Added 
				Unsplash nature photo as default
				background. Added seperate volume
				controls for noise and ambiance 
				players as well as a master volume
				that controls both players together.
				Adjusted layout items to be more 
				categorically focused by seperating
				sound controls and environmental or
				asthetic controls.
						
	To-Dos:		Seemless Looping 
				Add new sounds to sound list
				Create toggle for lights up and down
				Put background and lights in same row
				Volumes based on mobile detection
				Fave Icon as Album Artwork on MP3s
				Fast loading / caching of audio files
				Clean up Unused Code and Files
*/

/** Initiate WOW.js instance **/
new WOW().init();

/** Initialize Utility Variables **/
var allSounds = ["Noise", "Vinyl", "Crickets"];
var soundIndex = 0;
var whichSound = allSounds[soundIndex];
var audioplayer;
var extraplayer;
var source;
var masterVolume = 0.90;
var maxVolume = 0.25;
var maxVolume2 = 0.75;
var fadeInt;
var extfadeInt;
var lightsUp = true;
var ambianceOn = false;
var flip = 0;
var background = new UnsplashPhoto().all().fromCategory("nature").of(["trees", "mountains"]).size(1600, 900).fetch();

// Move to the next sound. (Right arrow.)
function nextSound() {
	soundIndex++;
	
	if (soundIndex > allSounds.length-1) { soundIndex = 0; }
	
	whichSound = allSounds[soundIndex];
	
	updateSource();
	
	if(!audioplayer.paused) { fadeIn(25); }
}

// Move to the previous sound. (Left arrow.)
function prevSound() {
	soundIndex--;
	
	if (soundIndex < 0) { soundIndex = allSounds.length-1; }

	whichSound = allSounds[soundIndex];
	
	updateSource();
	
	if(!audioplayer.paused) { fadeIn(25); }
}

// Update the uadioplayer source
function updateSource() {
	switch(whichSound) {
	    case "Noise":
			source.src='noise/00.mp3';
	        break;
	    case "Vinyl":
			source.src='noise/Vinyl.mp3';
	        break;
	    case "Crickets":
			source.src='noise/Crickets2.mp3';
	        break;
	    default:
			source.src='noise/00.mp3';
	}
	
	if(!audioplayer.paused){ audioplayer.load(); audioplayer.play(); }
	else { audioplayer.load(); }
}

// Bring volume up from 0 to maxVolume
function fadeIn(interval) {
	clearInterval(fadeInt);
	audioplayer.volume = 0;
	audioplayer.play();
	fadeInt = setInterval (incVolume, interval);
}

// Fade volume to 0
function fadeOut(interval) {
	clearInterval(fadeInt);
	fadeInt = setInterval (decVolume, interval);
	
	clearInterval(extfadeInt);
	extfadeInt = setTimeout(audioplayer.pause(), interval);
}

// Increase the volume 
function incVolume(interval) {
	if(audioplayer.volume >= maxVolume) {
		audioplayer.volume = maxVolume;
		clearInterval(fadeInt);
	}
	else {
		audioplayer.volume += 0.01;
	}
}

// Decrease the volume
function decVolume(interval) {
	if(audioplayer.volume <= 0.01) {
		audioplayer.volume = 0;
		//clearInterval(fadeInt);
	}
	else {
		audioplayer.volume -= 0.01;
	}
}

// Bring volume up from 0 to maxVolume2
function extfadeIn(interval) {
	clearInterval(extfadeInt);
	extraplayer.volume = 0;
	extraplayer.play();
	extfadeInt = setInterval (extincVolume, interval);
}

// Fade volume to 0
function extfadeOut(interval) {
	clearInterval(extfadeInt);
	extfadeInt = setInterval (extdecVolume, interval);
	
	clearInterval(extfadeInt);
	extfadeInt = setTimeout(extraplayer.pause(), interval);
}

// Increase the volume 
function extincVolume(interval) {
	if(extraplayer.volume >= maxVolume2) {
		extraplayer.volume = maxVolume2;
		clearInterval(extfadeInt);
	}
	else {
		extraplayer.volume += 0.01;
	}
}

// Decrease the volume
function extdecVolume(interval) {
	if(extraplayer.volume <= 0.01) {
		extraplayer.volume = 0;
		clearInterval(extfadeInt);
	}
	else {
		extraplayer.volume -= 0.01;
	}
}

/** animation end instances for different browsers and cache variables for DOM objects **/
var animationEnd = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
var $audioControlsClass, $noiseTypeDisplay, $playPauseBtn, $masterVolume, $noiseVolume;
var $ambianceVolume, $ambianceSwitch, $backgroundOverlay, $backgroundRefresh;

$(document).ready(function() {
	
	/** Fix the Margins of the container based on the window size **/
	$('.container').css("margin-top", ($(window).height() - $('.container').height())/2.25);
	
	/** Cache player DOM items **/
	$audioControlsClass = $('.audio-controls');
	$noiseTypeDisplay = $('#noise-type-display');
	$playPauseBtn = $('#playpausebtn');
	$masterVolume = $('#mastervolume')
	$noiseVolume = $('#noisevolume');
	$ambianceVolume = $('#ambiancevolume');
	$backgroundRefresh = $('#background-refresh');
	$ambianceSwitch = $('#myonoffswitch');
	$backgroundOverlay = $('#background-overlay');
	
	/** Initialize Audio Player Objects **/
	audioplayer = document.getElementById("audio-player");
	source = document.getElementById("noise-type");
	extraplayer = document.getElementById("extra-player");
	audioplayer.volume = 0.25;
	extraplayer.volume = 0.75;
	
	/** Set Background Image **/
	$('body').css("background-image", 'url(' + background + ')');
	
	/** Update Noise Display **/
	$($noiseTypeDisplay).html(whichSound);
   
   	/** Interface Control Handlers **/
	$($playPauseBtn).click(function(){
	   if(audioplayer.paused && ambianceOn) { fadeIn(25); extfadeIn(25); console.log("first if"); }
	   else if(audioplayer.paused && !ambianceOn) { fadeIn(25); console.log("second if"); }
	   else { fadeOut(10); extfadeOut(10); console.log("else"); }
   	}); 
   
   	$($noiseVolume).on('input', function() {
	   maxVolume = $(this).val() / 100;
	   
	   audioplayer.volume = maxVolume * masterVolume;
   	});
	
	$($ambianceVolume).on('input', function() {
		maxVolume2 = $(this).val() / 100;
	
		extraplayer.volume = maxVolume2 * masterVolume;
	});
	
	$($masterVolume).on('input', function(){
		masterVolume = $(this).val() / 100;
		
		audioplayer.volume = maxVolume * masterVolume;
		extraplayer.volume = maxVolume2 * masterVolume;
	});
   
   	$('#type-right').click(function() {
	   nextSound();
	   
	   $($noiseTypeDisplay).removeClass().addClass("effect-display fadeOutRight animated").one(animationEnd, function(){
		   $(this).removeClass().addClass("effect-display");
	   });
	   
	   $($noiseTypeDisplay).html(whichSound);
	   
	   $($noiseTypeDisplay).removeClass().addClass("effect-display fadeInLeft animated").one(animationEnd, function(){
		   $(this).removeClass().addClass("effect-display");
	   });
   	});
   
   	$('#type-left').click(function() {
	   prevSound();
	   
	   $($noiseTypeDisplay).removeClass().addClass("effect-display fadeOutLeft animated").one(animationEnd, function(){
		   $(this).removeClass().addClass("effect-display");
	   });
	   
	   $($noiseTypeDisplay).html(whichSound);
	   
	   $($noiseTypeDisplay).removeClass().addClass("effect-display fadeInRight animated").one(animationEnd, function(){
		   $(this).removeClass().addClass("effect-display");
	   });
   	});
   
   	$($backgroundRefresh).click(function(){
		++flip;
	   background = new UnsplashPhoto().all().fromCategory("nature").of(["trees", "mountains"]).size(1600+flip, 900).fetch();
	   
	   $('body').css("background-image", 'url(' + background + ')');
   	});
	
   	$($ambianceSwitch).change(function(){
	   if($(this).is(':checked')){ ambianceOn = true; }
	   else { ambianceOn = false; }
	   
	   if(!audioplayer.paused && ambianceOn) { extfadeIn(25); }
	   else { extfadeOut(20); }
   	});
   
   	$('#lights-toggle').click(function(){
	   if(lightsUp) {
		   $(this).find('h4').html("turn up the lights");
		   
		   lightsUp = false;
		   
		   $('#background-overlay').height($('body,html').height());
		   $('#background-overlay').fadeTo("1s", 0.85);
		   
		   $(this).find('h4').removeClass().addClass("duration-500ms fadeInDown animated").one(animationEnd, function(){
			   $(this).removeClass();
		   });
	   }
	   else {
		   $(this).find('h4').html("turn down the lights");
		   
		   lightsUp = true;
		   
		   $('#background-overlay').height($('body,html').height());
		   $('#background-overlay').fadeTo("1s", 0.40);
		   
		   $(this).find('h4').removeClass().addClass("duration-500ms fadeInUp animated").one(animationEnd, function(){
			   $(this).removeClass();
		   });
	   }
   	});
   
   	/** Audio Player Event Handlers **/
   	audioplayer.addEventListener('timeupdate', function(){
       var buffer = 0.44;
	   
       if(this.currentTime > this.duration - buffer){
           this.currentTime = 2;
       }
   	}, false);
   
   	audioplayer.addEventListener('pause', function(){
       $playPauseBtn.find('span').attr('data-icon', "E" );
	   
	   $playPauseBtn.find('span').removeClass().addClass("zoomIn animated").one(animationEnd, function(){
		   $playPauseBtn.find('span').removeClass();
	   });
   	}, false);
   
   	audioplayer.addEventListener('play', function(){
       $playPauseBtn.find('span').attr('data-icon', "`" );
	   
	   $playPauseBtn.find('span').removeClass().addClass("zoomIn animated").one(animationEnd, function(){
		   $playPauseBtn.find('span').removeClass();
	   });
   	}, false);
   
   	/** Window Event Handlers **/
   	$(window).on('resize', function(){
	   if($(this).width() < 981) {$('#mobile-status-container').remove();}
	   
	   $backgroundOverlay.height($('body,html').height());
	   $backgroundOverlay.width($('body,html').width());
	   
	   $('.container').css("margin-top", ($(window).height() - $('.container').height())/2.25);
   	});
   
   	$(window).on('orientationchange', function() {
	   $backgroundOverlay.height($('body,html').height());
   	});
});