console.log("Loaded audio.js file");

class Player {
  constructor (soundsToLoad, loader) {
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
    this.totalFilesToLoad = 0;
    this.fileItter = 0;
    this.allFilesLoaded = false;
    this.loadingElement = loader;
    this.config = new Config();

    this.loadSounds(soundsToLoad);
  };

  loadSounds (soundsToLoad) {
    this.totalFilesToLoad = soundsToLoad.length;

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
        }, function () {
          this.fileItter++;

          console.log(this.fileItter + " of " + this.totalFilesToLoad + " sound files loaded...");

          if(this.fileItter === this.totalFilesToLoad) {
            this.allFilesLoaded = true;
          }

          if(this.allFilesLoaded) {
            console.log("All files loaded!");

            this.loadingElement.style.display = 'none';
          }
        }.bind(this))
      });

      if(this.sounds[i].name === 'ambiance') {
        this.ambianceGroup.addSound(this.sounds[i].sound);
        this.highestNoiseIndex = i - 1;
      }
      else {
        this.soundGroup.addSound(this.sounds[i].sound);
      }
    }

    this.initConfig();

    this.setSoundVolume(this.soundVolume).setAmbianceVolume(this.ambianceVolume);
  };

  initConfig () {
    if(this.config.has('currentSound')) {
      this.currentSound = this.config.get('currentSound');
    } else {
      this.config.set('cuurentSound', this.currentSound);
    }

    if(this.config.has('soundVolume')) {
      this.soundVolume = this.config.get('soundVolume');
    } else {
      this.config.set('soundVolume', this.soundVolume);
    }

    if(this.config.has('ambianceVolume')) {
      this.ambianceVolume = this.config.get('ambianceVolume');
    } else {
      this.config.set('ambianceVolume', this.ambianceVolume);
    }

    if(this.config.has('masterVolume')) {
      this.masterVolume = this.config.get('masterVolume');
    } else {
      this.config.set('masterVolume', this.masterVolume);
    }

    if(this.config.has('ambianceOn')) {
      this.ambianceOn = this.config.get('ambianceOn');
    } else {
      this.config.set('ambianceOn', this.ambianceOn);
    }

    console.log("Current Sound: " + this.currentSound);
    //console.log(this.currentSound);
    console.log("Sound Volume: " + this.soundVolume);
    //console.log(this.soundVolume);
    console.log("Ambiance Volume: " + this.ambianceVolume);
    //console.log(this.ambianceVolume);
    console.log("Master Volume: " + this.masterVolume);
    //console.log(this.masterVolume);
    console.log("Ambiance On: " + this.ambianceOn);
    //console.log(this.ambianceOn);
  };

  initUI (noiseEl, soundEl, ambianceEl, masterEl, ambianceOnEl) {
    this.updateSoundDisplay(noiseEl);
    this.updateVolumeDisplay(soundEl, ambianceEl, masterEl);
    this.updateAmbianceControl(ambianceOnEl);
  };

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
  this.config.set('ambianceOn', this.ambianceOn);
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
  this.config.set('masterVolume', this.masterVolume);
};

// Set the volume of the noise group to a particular value adjusted for master volume
Player.prototype.setSoundVolume = function (vol) {
  this.soundVolume = vol || this.soundVolume;

  this.soundGroup.volume = this.soundVolume * this.masterVolume;
  this.config.set('soundVolume', this.soundVolume);

  return this;
};

// Set the volume of the ambiance group to a particular value adjusted for master volume
Player.prototype.setAmbianceVolume = function (vol) {
  this.ambianceVolume = vol || this.ambianceVolume;

  this.ambianceGroup.volume = this.ambianceVolume * this.masterVolume;
  this.config.set('ambianceVolume', this.ambianceVolume);

  return this;
};

Player.prototype.updateSoundDisplay = function (element) {
  element.innerHTML = this.getCurrentSound();
};

Player.prototype.updateVolumeDisplay = function (element1, element2, element3) {
  element1.value = this.soundVolume * 100;
  element2.value = this.ambianceVolume * 100;
  element3.value = this.masterVolume * 100;
};

Player.prototype.updateAmbianceControl = function (element) {
  element.checked = this.ambianceOn;
};

Player.prototype.nextSound = function () {
  if(!this.paused) { this.pauseCurrentSound(); }

  if(++this.currentSound > this.highestNoiseIndex) {
    this.currentSound = 0;
  }

  if(!this.paused) { this.playCurrentSound(); }
  this.config.set('currentSound', this.currentSound);

  return this;
};

Player.prototype.prevSound = function () {
  if(!this.paused) { this.pauseCurrentSound(); }

  if(--this.currentSound < 0) {
    this.currentSound = this.highestNoiseIndex;
  }

  if(!this.paused) { this.playCurrentSound(); }
  this.config.set('currentSound', this.currentSound);

  return this;
};

module.exports = Player;
