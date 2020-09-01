class Operator{

  //コンストラクタ
  constructor(mixer, track){
    this.ParentMixer = mixer;
    this.ParentTrack = track;
    this.Gain = this.ParentMixer.createGain(this.ParentTrack.Gain, 0);
    this.Volume = this.ParentMixer.createGain(this.Gain, 0);
    this.Oscillator = this.createOscillator(this.Volume);
    this.FeedBack = new FeedBack(this.ParentMixer, this);
  }

  //Oscillator作成
  createOscillator(destination){
    let newOscillator = this.ParentMixer.Context.createOscillator();
    newOscillator.type = "sine";
    newOscillator.connect(destination);
    newOscillator.start(0);
    return newOscillator;
  }

  //Gain設定
  set GainValue(value){
    this.Gain.gain.value = value;
  }

  //Volume設定
  set VolumeValue(value){
    this.Volume.gain.value = value;
  }

  //Frequency設定
  set Frequency(value){
    this.Oscillator.frequency.value = value;
  }

  //Gainの接続切替
  reConnect(destination){
    this.Gain.disconnect();
    this.Gain.connect(destination);
  }

}
