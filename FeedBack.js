class FeedBack{

  constructor(mixer, ope){
    this.ParentMixer = mixer;
    this.ParentOpe = ope;
    this.Delay = this.createDelay(this.ParentOpe.Oscillator.frequency);
    this.Gain = this.ParentMixer.createGain(this.Delay, 0);
    this.ParentOpe.Oscillator.connect(this.Gain);
  }

  createDelay(destination){
    let newDelay = this.ParentMixer.Context.createDelay();
    newDelay.delayTime.value = 1;
    newDelay.connect(destination);
    return newDelay;
  }

  set GainValue(value){
    this.Gain.gain.value = value;
  }

  enable(){
    this.GainValue = 1;
  }

  disable(){
    this.GainValue = 0;
  }

}
