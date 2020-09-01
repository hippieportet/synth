class Mixer{

  //コンストラクタ
  constructor(trackCount, opeCount){
    this.TrackCount = trackCount;
    this.OpeCount = opeCount;
    this.Context = new (window.AudioContext || window.webkitAudioContext);
    this.Analyser = this.createAnalyser(this.Context.destination);
    this.Compressor = this.createCompressor(this.Analyser);
    this.Gain = this.createGain(this.Compressor, 1);
    this.Tracks = this.createTracks(trackCount, opeCount);
  }

  //デストラクタ
  dispose() {
    this.Gain.gain.value = 0;
    this.Context.close();
  }

  //Analyser作成
  createAnalyser(destination){
    let newAnalyser = this.Context.createAnalyser();
    newAnalyser.fftSize = 1024;
    newAnalyser.connect(destination);
    return newAnalyser;
  }

  //Compressor作成
  createCompressor(destination){
    let newCompressor = this.Context.createDynamicsCompressor();
    newCompressor.knee.value = 20;
    newCompressor.ratio.value = 12;
    newCompressor.connect(destination);
    return newCompressor;
  }

  //Gain作成
  createGain(destination, defaultGainValue){
    let newGain = this.Context.createGain();
    newGain.gain.value = defaultGainValue;
    newGain.connect(destination);
    return newGain;
  }

  //Trackのリスト作成
  createTracks(trackCount, opeCount){
    let tracks = [];
    for (let i = 0; i < trackCount; i++){
      tracks.push(new Track(this, opeCount));
    }
    return tracks;
  }

  //TrackのGain設定
  setTrackGain(trackIdx, value){
    this.Tracks[trackIdx].GainValue = value;
  }

  //OperatorのGain設定
  setOpeGain(trackIdx, opeIdx, value){
    this.Tracks[trackIdx].Operators[opeIdx].GainValue = value;
  }

  //OperatorのVolume設定
  setOpeVolume(trackIdx, opeIdx, value){
    this.Tracks[trackIdx].Operators[opeIdx].VolumeValue = value;
  }

  //OperatorのFrequency設定
  setOpeFrequency(trackIdx, opeIdx, value){
    this.Tracks[trackIdx].Operators[opeIdx].Frequency = value;
  }

  //OperatorのFeedBack設定
  setOpeFeedBack(trackIdx, opeIdx, enable){
    if (enable){
      this.Tracks[trackIdx].Operators[opeIdx].FeedBack.enable();
    } else {
      this.Tracks[trackIdx].Operators[opeIdx].FeedBack.disable();
    }

  }

}
