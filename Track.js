class Track{

  constructor(mixer, opeCount){
    this.ParentMixer = mixer;
    this.Gain = this.ParentMixer.createGain(this.ParentMixer.Gain, 0);
    this.Operators = this.createOperators(opeCount);
    this.IsKeyDowning = false;

    //Track ← carrier1 ← modulator1のアルゴリズム
    //アルゴリズムの切替はAlgorithm.jsにやらせる予定。
    this.Operators[0].GainValue = 1;
    this.Operators[0].reConnect(this.Gain);
    this.Operators[1].GainValue = 0;
    this.Operators[1].reConnect(this.Operators[0].Oscillator.frequency);
  }

  createOperators(opeCount){
    let operators = [];
    for (let i = 0; i < opeCount; i++){
      operators.push(new Operator(this.ParentMixer, this));
    }
    return operators;
  }

  set GainValue(value){
    this.Gain.gain.value = value;
  }

}
