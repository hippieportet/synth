class Envelope{

  constructor(mixer){
    this.ParentMixer = mixer;
    this.AttackTime = 0.5;
    //this.HoldTime = 1;
    this.DecayTime = 0.2;
    //this.FadeTime = 1;
    this.ReleaseTime = 0.3;
    this.AttackLevel = 1;
    //this.DecayLevel = 1;
    this.SustainLevel = 0.7;
    //this.PhaseMultiply = 1;
    //this.DetuneIndex = 0;
  }

  setParameter(attackTime, decayTime, releaseTime, attackLevel, sustainLevel){
    this.AttackTime = parseFloat(attackTime);
    this.DecayTime = parseFloat(decayTime);
    this.ReleaseTime = parseFloat(releaseTime);
    this.AttackLevel = parseFloat(attackLevel);
    this.SustainLevel = parseFloat(sustainLevel);
  }

  clear(track){
    track.Gain.gain.cancelScheduledValues(0);
  }

  setTrackOn(track){
    if (track.IsKeyDowning === true){
       return;
     }
    track.IsKeyDowning = true;
    let now = this.ParentMixer.Context.currentTime;
    let rootValue = this.AttackLevel;
    track.Gain.gain.cancelScheduledValues(0);
    if (track.Gain.gain.value > 0){
      track.Gain.gain.setValueAtTime(track.Gain.gain.value, now);
    } else {
      track.Gain.gain.setValueAtTime(0.0, now);
    }
    track.Gain.gain.linearRampToValueAtTime(rootValue, now + this.AttackTime);
    track.Gain.gain.linearRampToValueAtTime(this.SustainLevel * rootValue, now + this.AttackTime + this.DecayTime);
  }

  setTrackOff(track){
    track.IsKeyDowning = false;
    let now = this.ParentMixer.Context.currentTime;
    var rootValue = track.Gain.gain.value;
    track.Gain.gain.cancelScheduledValues(0);
    track.Gain.gain.setValueAtTime(track.Gain.gain.value, now);
    track.Gain.gain.linearRampToValueAtTime(0.0, now + this.ReleaseTime);
  }

}
