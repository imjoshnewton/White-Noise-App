function Player () {
  this.sounds = []; // All of the sounds the Player has access to
  this.soundGroup = new Pizzicato.Group(); // Noise Group - primarily for adjusting the volume of all noise sounds at the same time
  this.ambianceGroup = new Pizzicato.Group(); // Ambiance Group - same as noise group but for ambiance
  this.currentSound = 0; // Index of the currenlty playing noise sound
  this.highestNoiseIndex = 0; // Last index of a noise sound in the array - for referencing when ambiance sounds start
  this.paused = true; // State variable used for toggling play and paused states
  this.ambianceOn = true;
  this.masterVolume = .75; // The master volume of the entire player
  this.soundVolume = .9; // The volume of all noise sounds
  this.ambianceVolume = .75; // The volume of all ambiance sounds
};

// Initializes the player with an array of objects that link the sound file to the sound name
// Also sets up the sound groups and initializes the groups to the default volumes for the player
Player.prototype.init = function (soundsToLoad) {
  for(var i = 0;i < soundsToLoad.length;++i) {
    this.sounds.push({
      name: soundsToLoad[i].name,
      sound: new Pizzicato.Sound({
        source: 'file',
        options: {
          path: soundsToLoad[i].file,
          loop: true,
          attack: 0.3,
          release: 0.3
        }
      })
    });

    if(this.sounds[i].name === 'ambiance') {
      this.ambianceGroup.addSound(this.sounds[i].sound);
      this.highestNoiseIndex = i - 1;
    }
    else {
      this.soundGroup.addSound(this.sounds[i].sound);
    }
  }

  this.setSoundVolume(this.soundVolume).setAmbianceVolume(this.ambianceVolume);
};

// Play the sound at the current sound index
Player.prototype.playCurrentSound = function () {
  console.log("Playing: " + this.sounds[this.currentSound].name + " at index: " + this.currentSound );

  this.sounds[this.currentSound].sound.play();
};

// Pause the sound at the current sound index
Player.prototype.pauseCurrentSound = function () {
  console.log("Pausing: " + this.sounds[this.currentSound].name + " at index: " + this.currentSound );

  this.sounds[this.currentSound].sound.pause();
};

// Play the sound at the current sound index
Player.prototype.playAmbiance = function () {
  console.log("Playing: " + this.sounds[this.highestNoiseIndex + 1].name + " at index: " + (this.highestNoiseIndex + 1) );

  this.ambianceGroup.play();
};

// Pause the sound at the current sound index
Player.prototype.pauseAmbiance = function () {
  console.log("Pausing: " + this.sounds[this.highestNoiseIndex + 1].name + " at index: " + (this.highestNoiseIndex + 1) );

  this.ambianceGroup.pause();
};

Player.prototype.toggleAmbiance = function () {
  if(this.ambianceOn) {
    this.pauseAmbiance();
  }
  else {
    this.playAmbiance();
  }

  this.ambianceOn = !this.ambianceOn;
};

// Toggle between playing and paused states
Player.prototype.playPause = function () {
  if(this.paused) {
    this.playCurrentSound();
    if(this.ambianceOn) { this.playAmbiance() };
  }
  else {
    this.pauseCurrentSound();
    if(this.ambianceOn) { this.pauseAmbiance() };
  }

  this.paused = !this.paused;
};

// Return the name of the current sound for display purposes
Player.prototype.getCurrentSound = function () {
  return this.sounds[this.currentSound].name;
}

// Updates the master volume for the player as well as adjusting the group volumes by the new master value
Player.prototype.setMasterVolume = function (vol) {
  this.masterVolume = vol;

  this.setSoundVolume().setAmbianceVolume();
};

// Set the volume of the noise group to a particular value adjusted for master volume
Player.prototype.setSoundVolume = function (vol) {
  this.soundVolume = vol || this.soundVolume;

  this.soundGroup.volume = this.soundVolume * this.masterVolume;

  return this;
};

// Set the volume of the ambiance group to a particular value adjusted for master volume
Player.prototype.setAmbianceVolume = function (vol) {
  this.ambianceVolume = vol || this.ambianceVolume;

  this.ambianceGroup.volume = this.ambianceVolume * this.masterVolume;

  return this;
};

Player.prototype.updateSoundDisplay = function (element) {
  element.innerHTML = this.getCurrentSound();
};

Player.prototype.nextSound = function () {
  if(!this.paused) { this.pauseCurrentSound(); }

  if(++this.currentSound > this.highestNoiseIndex) {
    this.currentSound = 0;
  }

  if(!this.paused) { this.playCurrentSound(); }

  return this;
};

Player.prototype.prevSound = function () {
  if(!this.paused) { this.pauseCurrentSound(); }

  if(--this.currentSound < 0) {
    this.currentSound = this.highestNoiseIndex;
  }

  if(!this.paused) { this.playCurrentSound(); }

  return this;
};
