// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var audioplayer = new Player();

audioplayer.init([{
  name: 'noise',
  file: 'noise/00.mp3'
}, {
  name: 'crickets',
  file: 'noise/Crickets2.mp3'
}, {
  name: 'vinyl',
  file: 'noise/Vinyl.mp3'
}, {
  name: 'off',
  file: 'noise/Empty.mp3'
}, {
  name: 'ambiance',
  file: 'ambiance/SomethingICanAlmostRemember.mp3'
}]);

$(document).ready(function() {
	var $playPauseBtn = $('.wn-playpause'),
      $masterVolume = $('.wn-mastervolume'),
      $noiseVolume = $('.wn-noisevolume'),
      $noiseType = $('.wn-type'),
      $ambianceVolume = $('.wn-ambiancevolume'),
      $prevSoundBtn = $('.wn-typebutton.left'),
      $nextSoundBtn = $('.wn-typebutton.right'),
      $ambianceOnCheck = $('#wn-amb-onoff'),
      $lightsOnCheck = $('#wn-lights-onoff'),
      $lightsOverlay = $('.wn-overlay');

  audioplayer.updateSoundDisplay($noiseType[0]);

  $playPauseBtn.click(function () {
    $(this).children('.fa').toggleClass('fa-play').toggleClass('fa-pause');

    //console.log("PLAY / PAUSE");
    audioplayer.playPause();
  });

  $masterVolume.on('input', function () {
    audioplayer.setMasterVolume($(this).val()/100);
  });

  $prevSoundBtn.click(function () {
    audioplayer.prevSound().updateSoundDisplay($noiseType[0]);
  });

  $nextSoundBtn.click(function () {
    audioplayer.nextSound().updateSoundDisplay($noiseType[0]);
  });

  $noiseVolume.on('input', function () {
    audioplayer.setSoundVolume($(this).val()/100);
  });

  $ambianceVolume.on('input', function () {
    audioplayer.setAmbianceVolume($(this).val()/100);
  });

  $ambianceOnCheck.change(function () {
    audioplayer.toggleAmbiance();
  });

  $lightsOnCheck.change(function () {
    $lightsOverlay.toggleClass('off').toggleClass('on');
  });
});
