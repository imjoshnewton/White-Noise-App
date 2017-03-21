function Player () {
  this.sounds = [];
  this.soundGroup = new Pizzicato.Group();
  this.ambianceGroup = new Pizzicato.Group();
  this.currentSound = 0;
  this.highestNoiseIndex = 0;
  this.paused = true;
  this.masterVolume = .75;
  this.soundVolume = .9;
  this.ambianceVolume = .75;
};

Player.prototype.init = function (soundsToLoad) {
  for(var i = 0;i < soundsToLoad.length;++i) {
    this.sounds.push({
      name: soundsToLoad[i].name,
      sound: new Pizzicato.Sound(soundsToLoad[i].file)
    });

    if(this.sounds[i].name === 'ambiance') {
      this.ambianceGroup.addSound(this.sounds[i].sound);
      this.highestNoiseIndex = i - 1;
    }
    else {
      this.soundGroup.addSound(this.sounds[i].sound);
    }
  }

  this.setSoundVolume(this.soundVolume);
  this.setAmbianceVolume(this.ambianceVolume);
};

Player.prototype.playCurrentSound = function () {
  this.sounds[this.currentSound].sound.play();
};

Player.prototype.pauseCurrentSound = function () {
  this.sounds[this.currentSound].sound.pause();
};

Player.prototype.playPause = function () {
  if(this.paused) {
    this.playCurrentSound();
  }
  else {
    this.pauseCurrentSound();
  }

  this.paused = !this.paused;
};

Player.prototype.getCurrentSound = function () {
  return this.sounds[this.currentSound].name;
}

Player.prototype.setMasterVolume = function (vol) {
  this.masterVolume = vol;

  this.setSoundVolume();
  this.setAmbianceVolume();
};

Player.prototype.setSoundVolume = function (vol) {
  this.soundVolume = vol || this.soundVolume;
  this.soundGroup.volume = this.soundVolume * this.masterVolume;
};

Player.prototype.setAmbianceVolume = function (vol) {
  this.ambianceVolume = vol || this.ambianceVolume;
  this.ambianceGroup.volume = this.ambianceVolume * this.masterVolume;
};
