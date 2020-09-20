class Operator{

  constructor(mixer, track){
    this.ParentMixer = mixer;
    this.ParentTrack = track;
    this.Gain = this.ParentMixer.createGain(this.ParentTrack.Gain, 0);
    this.Volume = this.ParentMixer.createGain(this.Gain, 0);
    this.Oscillator = this.createOscillator(this.Volume);
    this.FeedBack = new FeedBack(this.ParentMixer, this);
  }

  createOscillator(destination){
    let newOscillator = this.ParentMixer.Context.createOscillator();
    newOscillator.type = "sine";
    newOscillator.connect(destination);
    newOscillator.start(0);
    return newOscillator;
  }

  set GainValue(value){
    this.Gain.gain.value = value;
  }

  set VolumeValue(value){
    this.Volume.gain.value = value;
  }

  set Frequency(value){
    this.Oscillator.frequency.value = value;
  }

  reConnect(destination){
    this.Gain.disconnect();
    this.Gain.connect(destination);
  }

}
