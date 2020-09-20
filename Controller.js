var _ = {}
$(() => {

  $.extend(_, {
    'mixer': null,
    'initialized' : false,
    'intervalid' : null,
    'boot': () => {
      $('.play').on({
        'change': (e) => {
          let trackIdx = e.target.attributes["data-trackIdx"].value;
          if (e.target.checked){
            _.init();
            _.play(trackIdx);
          } else {
            _.init();
            _.release(trackIdx);
          }
        }
      });
      $('.keystroke').on({
        'mousedown touchstart': (e) => {
          let trackIdx = e.target.attributes["data-trackIdx"].value;
          _.init();
          _.keyOn(trackIdx);
        },
        'mouseup mouseleave touchend': (e) => {
          let trackIdx = e.target.attributes["data-trackIdx"].value;
          _.init();
          _.keyOff(trackIdx);
        }
      });
      $('.play-ope').on({
        'change': (e) => {
          let trackIdx = e.target.attributes["data-trackIdx"].value;
          let opeIdx = e.target.attributes["data-opeIdx"].value;
          if (e.target.checked){
            _.opePlay(trackIdx, opeIdx);
          } else {
            _.opeRelease(trackIdx, opeIdx);
          }
        }
      });
      $('.frequency, .gain, .feedback').on({
        'change input': (e) => {
          let trackIdx = e.target.attributes["data-trackIdx"].value;
          let opeIdx = e.target.attributes["data-opeIdx"].value;
          let frequency = $(`.frequency[data-trackIdx="${trackIdx}"][data-opeIdx="${opeIdx}"]`).val();
          let volume = $(`.gain[data-trackIdx="${trackIdx}"][data-opeIdx="${opeIdx}"]`).val();
          _.opeModify(trackIdx, opeIdx, frequency, volume);
          //feedback
          if (opeIdx === "1"){
            let feedbackEnable = $(`.feedback[data-trackIdx="${trackIdx}"][data-opeIdx="${opeIdx}"]`)[0].checked;
            _.mixer.setOpeFeedBack(trackIdx, opeIdx, feedbackEnable);
          }
        }
      });
      $('#attackTime, #decayTime, #releaseTime, #attackLevel, #sustainLevel').on({
        'change input': (e) => {
          _.init();
          _.mixer.Envelope.setParameter($('#attackTime').val(), $('#decayTime').val(),
          $('#releaseTime').val(), $('#attackLevel').val(), $('#sustainLevel').val());
        }
      });
      $(window).keydown((e) => {
        if (document.activeElement.tagName.toLowerCase() === 'input') return ;
        _.init();
        if ($.isNumeric(e.key)){
          let trackIdx = Number(e.key) - 1;
          if (trackIdx >= 0 && trackIdx < _.mixer.TrackCount){
            _.keyOn(trackIdx);
          }
        }
      });
      $(window).keyup((e) => {
        _.init();
        if ($.isNumeric(e.key)){
          let trackIdx = Number(e.key) - 1;
          if (trackIdx >= 0 && trackIdx < _.mixer.TrackCount){
            _.keyOff(trackIdx);
          }
        }
      });
    },
    'init': () => {
      if (!_.initialized){
        //とりあえず、2 Operators
        let trackCount = $("#main-table tbody tr").length;
        const opeCount = 2;
        _.mixer = new Mixer(trackCount, opeCount);
        for (let trackIdx = 0; trackIdx < trackCount; trackIdx++){
          for (let opeIdx = 0; opeIdx < opeCount; opeIdx++){
            let frequency = $(`.frequency[data-trackIdx="${trackIdx}"][data-opeIdx="${opeIdx}"]`).val();
            let volume = $(`.gain[data-trackIdx="${trackIdx}"][data-opeIdx="${opeIdx}"]`).val();
            _.mixer.setOpeFrequency(trackIdx, opeIdx, frequency);
            _.mixer.setOpeVolume(trackIdx, opeIdx, volume);
          }
        }
        window.clearInterval(_.intervalid);
        _.setAnalyzer();
        _.initialized = true;
      }
    },
    'play': (trackIdx) => {
      _.mixer.setTrackGain(trackIdx, 1);
    },
    'release': (trackIdx) => {
      _.mixer.setTrackGain(trackIdx, 0);
    },
    'keyOn': (trackIdx) => {
      if (!$(`.play[data-trackIdx="${trackIdx}"]`)[0].checked){
        _.mixer.setTrackOn(trackIdx);
      }
    },
    'keyOff': (trackIdx) => {
      if (!$(`.play[data-trackIdx="${trackIdx}"]`)[0].checked){
        _.mixer.setTrackOff(trackIdx);
      }
    },
    'opePlay': (trackIdx, opeIdx) => {
      _.mixer.setOpeGain(trackIdx, opeIdx, 1);
    },
    'opeModify': (trackIdx, opeIdx, frequency, volume) => {
      _.mixer.setOpeFrequency(trackIdx, opeIdx, frequency);
      _.mixer.setOpeVolume(trackIdx, opeIdx, volume);
    },
    'opeRelease': (trackIdx, opeIdx) => {
      _.mixer.setOpeGain(trackIdx, opeIdx, 0);
    },
    'setAnalyzer': () => {
      const analyser = _.mixer.Analyser;
      const canvas = document.getElementById('waveform');
      const canvasContext = canvas.getContext('2d');
      _.intervalid = window.setInterval(() => {
        let datas = new Uint8Array(analyser.fftSize);
        analyser.getByteTimeDomainData(datas);
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        canvasContext.beginPath();
        datas.forEach((data, idx) => {
          let x = (idx / datas.length) * canvas.width;
          let y = (1 - (data / 256)) * canvas.height;
          idx === 0 ? canvasContext.moveTo(x, y) : canvasContext.lineTo(x, y);
        });
        canvasContext.strokeStyle = "rgb(0, 255, 0)";
        canvasContext.stroke();
      }, 200);
    }
  }).boot();

  $('#temperamentLoad').click((e) => {
    let temperamentText = $('#temperamentList').val().replace(/ /g, '');
    let tempList = temperamentText.split(',');
    let frequencyList = tempList.filter(n => $.isNumeric(n));
    temperamentText = frequencyList.join(',');
    $('#temperamentText').val(temperamentText);
    SetTemperament(frequencyList);
  });

  $('#temperamentDelete').click((e) => {
    let temperamentId = $("#temperamentList").children(":selected").attr('temperamentId');
    DeleteTemperament(temperamentId);
  });

  $('#temperamentAdd').click((e) => {
    let temperamentName = $('#temperamentName').val();
    let temperamentText = $('#temperamentText').val().replace(/ /g, '');
    let tempList = temperamentText.split(',');
    let frequencyList = tempList.filter(n => $.isNumeric(n));
    temperamentText = frequencyList.join(',');
    $('#temperamentText').val(temperamentText);
    SetTemperament(frequencyList);
    CreateTemperament(temperamentName, temperamentText);
  });

  GetTemperaments();

});

function SetTemperament(frequencyList){
  if (frequencyList.length === 0) return;
  if (_.mixer) _.mixer.dispose();
  initTable(frequencyList);
  $('input:checkbox').bootstrapToggle();
  _.initialized = false;
  _.boot();
}

function GetTemperaments(){
  const method = "get";
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  fetch('./api/Temperament', {method, headers})
  .then((res)=> res.json())
  .then((json) => {
    $('#temperamentList > option').remove();
    json.forEach((record) => {
      $('#temperamentList').append($('<option>')
      .attr('temperamentId', record['id'])
      .html(record['id'] + ' | ' + record['name'] + ' | ' + record['value']).val(record['value']));
    });
  });
}

function CreateTemperament(name, frequencyList){
  const obj = {
    name : name,
    value : frequencyList
  };
  const method = 'post';
  const body = JSON.stringify(obj);
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  fetch('./api/Temperament', {method, headers, body})
  .then(() => {
    GetTemperaments();
  });
}

function DeleteTemperament(temperamentId){
  const method = "delete";
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  fetch("./api/Temperament/" + temperamentId, {method, headers})
  .then(() => {
    GetTemperaments();
  });
}
