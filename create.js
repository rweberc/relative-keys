// initialize/declare variables

// array to hold ordered note resources
let scaleNotes = [  ['C', 'do', 'doe', '1', 0],
                    ['C#', 'di', 'dee', '2b', 0],
                    ['D', 're', 'ray', '2', 0],
                    ['D#', 'ri', 'ree', '3b', 0],
                    ['E', 'mi', 'me', '3', 0],
                    ['F', 'fa', 'fa', '4', 0],
                    ['F#', 'fi', 'fee', '5b', 0],
                    ['G', 'sol', 'sole', '5', 0],
                    ['G#', 'si', 'see', '6b', 0],
                    ['A', 'la', 'la', '6', 0],
                    ['A#', 'li', 'lee', '7b', 0],
                    ['B', 'ti', 'tee', '7', 0]
                    ];

// example of how to call column [2] and row [3]scaleNotes.map(item => item[2])[3]
// has to be an easier way to select several items at once... [2, 3, 4, 7].map(ind => scaleNotes.map(item => item[2])[ind])

let majorScaleNumbers = [0, 2, 4, 5, 7, 9, 11];

let relativeKeyNotes;

let measureRepeats = 7;

let currentMeasure = 1;

let scaleNoteDegree;


// Number of measures for loop
let scheduleRepeatMeasure = "4m";

let advanceKeys = true;
let playResolution = true;

let keyOctaveNum = 4;


let refNoteSynth;

createRefNoteSynth = function() {

  refNoteSynth = new Tone.PolySynth({
    // "oscillator": {
    //   "type": "sawtooth"
    // }
    // "volume": 0,
    // "detune": 0,
    // "portamento": 0,
    // "filter": {
    //   "type": "lowpass"
    // },
    // "envelope": {
    //   "attack": 0.005,
    //   "attackCurve": "linear",
    //   "decay": 0.1,
    //   "decayCurve": "exponential",
    //   "release": 1,
    //   "releaseCurve": "exponential",
    //   "sustain": 0.3
    // },
    // "oscillator": {
    //   "partialCount": 0,
    //   "partials": [],
    //   "phase": 0,
    //   "type": "sawtooth"
    // }
  });
  
  refNoteSynth.set({
    oscillator: {
      type: "sine"
    }
    // filter: {
    //     type: "highpass",
    //     rolloff: 0,
    //     Q: 100
    // },
    // filterEnvelope: {
    //  attack: 1,
    //  decay: 0.32,
    //  sustain: 0.9,
    //  release: 3,
    //  baseFrequency: 0,
    //  octaves: 4
    // }
    });
    
    refNoteSynth.toDestination();

    // filter.frequency.rampTo(20000, 10);
    refNoteSynth.connect(filter);

}

const filter = new Tone.Filter(100, "lowpass").toDestination();

createRefNoteSynth();


let resSynth = new Tone.PolySynth({
  oscillator: {
    type: "square",
  },
  envelope: {
    attack: 8,
    decay: 16,
    sustain: 20,
    release: 20,
  },
  filter: {
    type: "lowpass",
    rolloff: -12,
    Q: 1,
  },
  filterEnvelope: {
    attack: 4,
    decay: 8,
    sustain: 0.5,
    release: 16,
    baseFrequency: 400,
    octaves: 4,
    exponent: 2,
  },
}).toDestination();

// let refNoteSynth = new Tone.PolySynth().toMaster();
let chordSynth = new Tone.PolySynth();

chordSynth.set({
  volume: -10,
  oscillator: {
    type: "sine"
  }
  // filter: {
  //     type: "highpass",
  //     rolloff: 0,
  //     Q: 100
  // },
  // filterEnvelope: {
  //  attack: 1,
  //  decay: 0.32,
  //  sustain: 0.9,
  //  release: 3,
  //  baseFrequency: 0,
  //  octaves: 4
  // }
  });
  
  chordSynth.toDestination();


const chord_filter = new Tone.Filter(50, "lowpass").toDestination();
chordSynth.connect(chord_filter);

// // Reverb Setup
const rev = new Tone.Reverb({
  decay : 5 ,
  preDelay : 0.01,
  wet: 1
}).toDestination();

// Delay Setup
const pingPong = new Tone.PingPongDelay({
  delayTime: '16n',
  feedback: .8,
  wet: .75
}).toDestination();

chordSynth.connect(pingPong);
chordSynth.connect(rev);


// // add lfo to refNoteSynth
// // Create an LFO to modulate the amplitude of the synth
// const lfo = new Tone.LFO(.15, .5, 1).start();

// // Create a gain node to control the amplitude of the synth
// const gain = new Tone.Gain().toDestination();

// // Connect the LFO to the gain node
// lfo.connect(gain.gain);

// // Connect the synth to the gain node
// refNoteSynth.connect(gain);


// create a new sequence with the synth and notes
let refNotePart;
let chordPart;
let resPart;

let refNote = "C4";
let chordNotes = [["C3", "E3", "G3"], ["F3", "A3", "C4"], ["G3", "B3", "D4"], ["C3", "E3", "G3"]];
let bpm = 100;

// function to add chords to pattern
function createKeyCenterPattern(refNote, scaleNoteDegree) { // later take in key as argument
    
  // call function that gets chords from keys
  // use that in 2nd column below

  let relativeKeyRoot = getContextMajorScale(refNote, scaleNoteDegree);

  // again, shouldn't happen here...
  // get resolution notes
  relativeKeyNotes = getSelectedNotes(scaleNotes.map(item => item[0]), keyOctaveNum, relativeKeyRoot, majorScaleNumbers);

  chordNotes = constructChords(relativeKeyNotes);

  // update with more randomness in rhythm and phrasing of chords

    return [["0:0", chordNotes[0]], ["0:2", chordNotes[3]], ["0:4:0", chordNotes[4]], ["0:6:0", chordNotes[0]]];
}

// function to create reference note patttern
function createRefNotePattern(refNote) { // later take in key as argument

  // // update with more randomness in rhythm
  // let refNotePattern = [["3m + 2n", refNote]];

  // return [["2:2", refNote]]; //refNotes[0]];
  return [["0:0", refNote]];//refNotes[0]];
}
 
const getOrderedNotes = (allNotes, rootNote) => {

    const startNote = allNotes.indexOf(rootNote);

    let rootAllNotes = allNotes.slice(startNote, 12).concat(allNotes.slice(0, startNote))

    return(rootAllNotes);

}
 
const getSelectedNotes = (allNotes, octaveNumber, rootNote, includeNotes) => {

    let orderedNotes = getOrderedNotes(allNotes, rootNote);

    //const orderedNotesNumbered = orderedNotes.map(note => {return `${note}${octaveNumber}`});

    // find index of 'C' and if not find index of c# in orderedNotes
    const indexOfNewOctave = orderedNotes.indexOf('C') > -1 ? orderedNotes.indexOf('C') : orderedNotes.indexOf('C#');

    orderedNotes = removeNumber(orderedNotes);

    let orderedNotesNumbered = orderedNotes.map((value, index) => indexOfNewOctave != 0 && index >= indexOfNewOctave ? appendNumber(value, octaveNumber + 1) : appendNumber(value, octaveNumber));
    
    const filteredNotes = includeNotes.map(item => orderedNotesNumbered[item]);

    return(filteredNotes);

}

// find major key that make a given note sound like the relative scaleDegree of interest
// for instance, if the note is C3 and the scaleDegree is "mi", then the function should return the major key that makes C3 sound like the "mi" of that scale, which is G# Major
// TODO: update to take in scale with root as 0 instead of taking in scaleNoteIndex
function getContextMajorScale(refNote, scaleDegreeNote) {

    let orderedNotes = getOrderedNotes(scaleNotes.map(item => item[0]), removeNumber(refNote));

    // get the index of the scaleDegree in the scaleDegrees array
    let scaleDegreeIndex = scaleNotes.map(item => item[0]).indexOf(scaleDegreeNote);

    let contextKey = orderedNotes[12 - scaleDegreeIndex];
  
    // get the note that is the scaleDegreeIndex ahead of the scaleNoteIndex
    // let contextKey = Tone.Frequency(scaleNotes[scaleNoteIndex][0]).transpose(-scaleDegreeIndex).toNote(); //"C5"
  
    // return the relevantMajorKey
    return contextKey;
  
}

  // function to randomize which relative scale degree is used based on which values of scaleNotes.map(item => item[3]) are true
function randomizeScaleDegree(scaleNotes) {
    
        let scaleDegrees = scaleNotes.filter(item => item[4] == true).map(item => item[0]);

        return scaleDegrees[Math.floor(Math.random() * scaleDegrees.length)];

}

// alert(getSelectedNotes(scaleNotes[0], 1, 'C', [0, 2, 4, 5, 7, 9, 11]));

const constructChords = (scale) => {

    //const scaleWithOctave = addOctaveNumbers(scale, octave);
  
    scaleWithOctave = scale;
  
    const getNextChordNote = (note, nextNoteNumber) => {
  
      const nextNoteInScaleIndex = scaleWithOctave.indexOf(note) + nextNoteNumber - 1;
  
      let nextNote;
  
  
      if (typeof(scaleWithOctave[nextNoteInScaleIndex]) !== 'undefined') {
  
        nextNote = scaleWithOctave[nextNoteInScaleIndex];
  
      } else {
  
        nextNote = scaleWithOctave[nextNoteInScaleIndex - 6];
  
        const updatedOctave = parseInt(nextNote.charAt(nextNote.length - 1)) + 1; // parseInt(nextNote.slice(1)) + 1;  // todo... I think this is messing up for items like A#1... returning #1... try something like .charAt(myString.length - 1);
  
        nextNote = `${removeNumber(nextNote)}${updatedOctave}`; // `${nextNote.slice(0,1)}${updatedOctave}`;
  
      }
  
      return nextNote;
  
    }
  
    const chordArray = scaleWithOctave.map(note => {
  
      let thirdNote = getNextChordNote(note, 3)
  
      let fifthNote = getNextChordNote(note, 5)

      const chord = [note, thirdNote, fifthNote]

      return chord
  
    })
  
    return chordArray;
  
}

// function to return number audio
function speakNumber(number) {
  
  let note = scaleNotes[number - 1][2];

  let utterance = new SpeechSynthesisUtterance(note);
  utterance.volume = 1; // From 0 to 1
  utterance.pitch = .9;
  // var voices = window.speechSynthesis.getVoices();
  // utterance.voice = voices[10]; 
  speechSynthesis.speak(utterance);

}

// function to remove number from string
function removeNumber(str) {
  
  if (Array.isArray(str)) {
    return str.map((s) => s.replace(/[0-9]/g, ''));
  } else {
    return str.replace(/[0-9]/g, '');
  }
}

// function to append number to either single string or array of strings
function appendNumber(str, num) {
  if (Array.isArray(str)) {
    return str.map((s) => s + num);
  } else {
    return str + num;
  }
}

refNotePartFunction = function(time) {

  if (refNotePart !== undefined) {
    refNotePart.dispose();
  }

  //refNote = refNote;

  refNotePart = new Tone.Part(
    function(time, note) {
      refNoteSynth.triggerAttackRelease(note, "4m", time); //note, "10hz", time);
    },
    createRefNotePattern(refNote)
  );


  // Setup the synth to be ready to play on beat 1
  refNotePart.start();//.loop = "true";

  // synth.triggerAttackRelease("B4", "8n", "+0:0:1");
  // synth.triggerAttackRelease("A4", "8n", "+0:1:1");
  // synth.triggerAttackRelease("D4", "8n", "+0:2:1");
  // synth.triggerAttackRelease("C4", "8n", "+0:3:1");
  // synth.triggerAttackRelease("F4", "8n", "+1:0:1");
  // synth.triggerAttackRelease("E4", "8n", "+1:1:1");
  // synth.triggerAttackRelease("A5", "8n", "+1:2:1");
  // synth.triggerAttackRelease("G4", "8n", "+1:3:1");

}

chordPartFunction = function(time) {

  if (chordPart !== undefined) {
    chordPart.dispose();
  }

  // chordNotes = chordNotes;

  // deciding on the key advance here should be moved
  if (currentMeasure == 1) {
      scaleNoteDegree = randomizeScaleDegree(scaleNotes); // should remove current scaleNoteDegree from options
      currentMeasure += 1;
  } else if (currentMeasure <= measureRepeats) {
      currentMeasure += 1;
  } else if (currentMeasure > measureRepeats) {
      scaleNoteDegree = randomizeScaleDegree(scaleNotes); // should remove current scaleNoteDegree from options
      currentMeasure = 1;
  }

  chordPart = new Tone.Part(
    function(time, note) {
      chordSynth.triggerAttackRelease(note, "10hz", time);
    },
    createKeyCenterPattern(refNote, scaleNoteDegree)
  );


  // Setup the synth to be ready to play on beat 1
  chordPart.start();//.loop = "true";


}

resolutionPartFunction = function(time) {

  if (resPart !== undefined) {
      resPart.dispose();
    }

    // chordNotes = chordNotes;

    // deciding on the key advance here should be moved
    let scaleNoteDegree = randomizeScaleDegree(scaleNotes);

    resPart = new Tone.Part(
      function(time, note) {
        resSynth.triggerAttackRelease(note, "10hz", time);
      },
      createResolutionPattern(relativeKeyNotes)
    );
  

    // Setup the synth to be ready to play on beat 1
    resPart.start();//.loop = "true";

}


  // adding timing to resolution notes (evenly spaced within half a measure)
function createResolutionPattern(relativeKeyNotes) {

  // Calculate the duration of one measure in seconds
  const secondsPerBeat = 60.0 / Tone.Transport.bpm.value;
  const secondsPerHalfMeasure = secondsPerBeat * 2;

  let refNoteIndex = removeNumber(relativeKeyNotes).indexOf(removeNumber(refNote));

  let addRefNote = false;

  if (refNoteIndex == -1) {

      addRefNote = true;

      let allNotesOrdered = getOrderedNotes(scaleNotes.map(item => item[0]), relativeKeyNotes[0][0]);

      let allNotesRefNoteIndex = allNotesOrdered.indexOf(removeNumber(refNote));

      if (allNotesRefNoteIndex > 6) {

          refNoteIndex = removeNumber(relativeKeyNotes).indexOf(allNotesOrdered[allNotesRefNoteIndex + 1]); 
      } else {
          refNoteIndex = removeNumber(relativeKeyNotes).indexOf(allNotesOrdered[allNotesRefNoteIndex - 1]);
      }
  }

  // if above 4th, resolution up. if below 4th, resolution down
  //indexOfRefNote = removeNumber(relativeKeyNotes).indexOf(removeNumber(refNote));

  if (refNoteIndex > 3) {

      // TODO: need to fix the octave of the refNote in this case...

      resolutionNotes = relativeKeyNotes.filter((value, index) => index >= refNoteIndex);
      resolutionNotes.push(appendNumber(removeNumber(relativeKeyNotes[0]), keyOctaveNum + 1));

      if (addRefNote) {
          resolutionNotes.reverse().push(refNote);
          resolutionNotes = resolutionNotes.reverse();
      }

  } else {

      resolutionNotes = relativeKeyNotes.filter((value, index) => index <= refNoteIndex);
  
      if (addRefNote) {
          resolutionNotes.push(refNote);
      }

      resolutionNotes = resolutionNotes.reverse();


  }
  
  resolutionPart = resolutionNotes.map((value, index) => {
      const calculatedValue = (secondsPerHalfMeasure * 6) + secondsPerHalfMeasure/relativeKeyNotes.length * index;
      return [calculatedValue, value];
  });

  return resolutionPart;

}
  
// document.getElementById("synth-slider").addEventListener("onchange", function() {

//   //refNoteSynth.volume.value = -100;
//   refNoteSynth.set({
//     harmonicity: 10,
//     envelope: {
//         attack: 0.01,
//     },
//     oscillator: {
//         type: "square"
//     },
//     filter: {
//         rolloff: -50,
//     }
//     });


// });


document.getElementById("play-button").addEventListener("click", function() {

    if (Tone.Transport.state !== 'started') {

        //createSequence();
        //createPart();
        Tone.Transport.scheduleRepeat((time) => {

          Tone.Transport.bpm.value = bpm;

          // Part for reference note
          refNotePartFunction(time);

          // Part for chords
          chordPartFunction(time);

          resolutionPartFunction(time);

        }, "4m");

      Tone.Transport.start();
  
    } else {
      // refNoteSynth.volume.value = -100;
      refNoteSynth.releaseAll();
      refNoteSynth.dispose();
      createRefNoteSynth();
      Tone.Transport.stop();
  
    }
  
  });
  
document.getElementById("shuffle-button").addEventListener("click", function() {
  // if (synthPart !== undefined) {
  //   synthPart.dispose();
  // }
  // partNotes = [[0, "C6"], ["0:2", "C8"], ["0:3:2", "G8"]];
  // createPart();

  synthPart.at("+0", "C#5");
  //synthPart.start();

});
  