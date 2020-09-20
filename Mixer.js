class Mixer{

  constructor(trackCount, opeCount){
    this.TrackCount = trackCount;
    this.OpeCount = opeCount;
    this.Context = new (window.AudioContext || window.webkitAudioContext);
    this.Analyser = this.createAnalyser(this.Context.destination);
    this.Compressor = this.createCompressor(this.Analyser);
    this.Envelope = new Envelope(this);
    this.Gain = this.createGain(this.Compressor, 1);
    this.Tracks = this.createTracks(trackCount, opeCount);
  }

  dispose() {
    this.Gain.gain.value = 0;
    this.Context.close();
  }

  createAnalyser(destination){
    let newAnalyser = this.Context.createAnalyser();
    newAnalyser.fftSize = 1024;
    newAnalyser.connect(destination);
    return newAnalyser;
  }

  createCompressor(destination){
    let newCompressor = this.Context.createDynamicsCompressor();
    newCompressor.knee.value = 20;
    newCompressor.ratio.value = 12;
    newCompressor.connect(destination);
    return newCompressor;
  }

  createGain(destination, defaultGainValue){
    let newGain = this.Context.createGain();
    newGain.gain.value = defaultGainValue;
    newGain.connect(destination);
    return newGain;
  }

  createTracks(trackCount, opeCount){
    let tracks = [];
    for (let i = 0; i < trackCount; i++){
      tracks.push(new Track(this, opeCount));
    }
    return tracks;
  }

  setTrackGain(trackIdx, value){
    this.Envelope.clear(this.Tracks[trackIdx]);
    this.Tracks[trackIdx].GainValue = value;
  }

  setTrackOn(trackIdx){
    this.Envelope.setTrackOn(this.Tracks[trackIdx]);
  }

  setTrackOff(trackIdx){
    this.Envelope.setTrackOff(this.Tracks[trackIdx]);
  }

  setOpeGain(trackIdx, opeIdx, value){
    this.Tracks[trackIdx].Operators[opeIdx].GainValue = value;
  }

  setOpeVolume(trackIdx, opeIdx, value){
    this.Tracks[trackIdx].Operators[opeIdx].VolumeValue = value;
  }

  setOpeFrequency(trackIdx, opeIdx, value){
    this.Tracks[trackIdx].Operators[opeIdx].Frequency = value;
  }

  setOpeFeedBack(trackIdx, opeIdx, enable){
    if (enable){
      this.Tracks[trackIdx].Operators[opeIdx].FeedBack.enable();
    } else {
      this.Tracks[trackIdx].Operators[opeIdx].FeedBack.disable();
    }

  }

}
