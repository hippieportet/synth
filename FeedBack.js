class FeedBack{

  //コンストラクタ
  constructor(mixer, ope){
    this.ParentMixer = mixer;
    this.ParentOpe = ope;
    this.Delay = this.createDelay(this.ParentOpe.Oscillator.frequency);
    this.Gain = this.ParentMixer.createGain(this.Delay, 0);
    this.ParentOpe.Oscillator.connect(this.Gain);
  }

  //Delay作成
  createDelay(destination){
    let newDelay = this.ParentMixer.Context.createDelay();
    newDelay.delayTime.value = 1;
    newDelay.connect(destination);
    return newDelay;
  }

  //Gain設定
  set GainValue(value){
    this.Gain.gain.value = value;
  }

  //有効化
  enable(){
    this.GainValue = 1;
  }

  //無効化
  disable(){
    this.GainValue = 0;
  }

}
