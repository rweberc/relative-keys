// initialize/declare variables

// array to hold ordered note resources
let scaleNotes = [  ['C', 'do', 'doe', '1', 0],
                    ['C#', 'di', 'dee', '2b', 0],
                    ['D', 're', 'ray', '2', 1],
                    ['D#', 'ri', 'ree', '3b', 0],
                    ['E', 'mi', 'me', '3', 1],
                    ['F', 'fa', 'fa', '4', 1],
                    ['F#', 'fi', 'fee', '5b', 0],
                    ['G', 'sol', 'sole', '5', 1],
                    ['G#', 'si', 'see', '6b', 0],
                    ['A', 'la', 'la', '6', 1],
                    ['A#', 'li', 'lee', '7b', 0],
                    ['B', 'ti', 'tee', '7', 1]
                    ];

// example of how to call column [2] and row [3]scaleNotes.map(item => item[2])[3]
// has to be an easier way to select several items at once... [2, 3, 4, 7].map(ind => scaleNotes.map(item => item[2])[ind])

let majorScaleNumbers = [0, 2, 4, 5, 7, 9, 11];

let relativeKeyNotes;

let measureRepeats = 4;

let currentMeasure = 1;

let roundsBeforeReturnToBase = 4;

let rounds = 1;

let scaleNoteDegree;

let repeatId;

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

let melodyNotePart;
let melodyChordNotePart;

let refNote = "C4";
let chordNotes = [["C3", "E3", "G3"], ["F3", "A3", "C4"], ["G3", "B3", "D4"], ["C3", "E3", "G3"]];

let melodyNotes = ["D", "E", "F", "G"];

let bpm = 220;

// function to add chords to pattern
function createKeyCenterPattern(refNote, scaleNoteDegree) { // later take in key as argument
    
  // call function that gets chords from keys
  // use that in 2nd column below

  let relativeKeyRoot = getContextMajorScale(refNote, scaleNoteDegree);

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

// function to create reference note patttern
function createMelodyNotePattern() { // later take in key as argument

  melodyNotes = scaleNotes.filter(item => item[4] == true).map(item => item[0]);
  melody_note_ct = document.getElementById('re-base-input').value;
  melodyNotes = getRandomElements(melodyNotes, melody_note_ct);

  // return [["2:2", refNote]]; //refNotes[0]];
  return [["2:0", melodyNotes[0] + keyOctaveNum], 
          ["2:2", melodyNotes[1] + keyOctaveNum], 
          ["2:4", melodyNotes[2] + keyOctaveNum], 
          ["2:6", melodyNotes[3] + keyOctaveNum]]; // update to be the several notes...
}

function getRandomElements(arr, count) {
  let result = [];
  for(let i = 0; i < count; i++) {
      result.push(arr[Math.floor(Math.random() * arr.length)]);
  }
  return result;
}
 
// Need to create the chords and add that function call to the Melody Note call? 
// for create the chords... reateKeyCenterPattern(randomize...C4 etc. from scalenotes ... add the "4", 'C')
// Also, for calculating the solfege melody in the different chord changes... do getOrderedNotes, based on key as root
// Calculate melody note - key in that... if >= 0..just take that [diff] solfege from scalednotes, if < 0, do [12-diff]
// Later add in a blank part for silently singing ahead of time 
// Add in option to shuffle melody... just calls createmelodypattern again...


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
    
        let scaleDegrees;
        
        if (scaleNoteDegree === undefined | scaleNotes.filter(item => item[4] == true).length == 1)
          scaleDegrees = scaleNotes.filter(item => item[4] == true).map(item => item[0]);
        else 
          scaleDegrees = scaleNotes.filter(item => item[0] != scaleNoteDegree).filter(item => item[4] == true).map(item => item[0]);

        let newNote = scaleDegrees[Math.floor(Math.random() * scaleDegrees.length)];

        let newSolfegeNote = scaleNotes.filter(item => item[0] == newNote).map(item => item[1]);

        document.getElementById('current-note').textContent = "Current solfege note: " + newSolfegeNote;

        return newNote;

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

  refNotePart = new Tone.Part(
    function(time, note) {
      refNoteSynth.triggerAttackRelease(note, "4m", time); //note, "10hz", time);
    },
    createRefNotePattern(refNote)
  );


  // Setup the synth to be ready to play on beat 1
  refNotePart.start();//.loop = "true";
}

chordPartFunction = function(time) {
  console.debug("Called chordPartFunction, time: " + time); 

  if (chordPart !== undefined) {
    chordPart.dispose();
  }

  // chordNotes = chordNotes;

  // deciding on the key advance here should be moved
  if (currentMeasure == 1) {
      scaleNoteDegree = randomizeScaleDegree(scaleNotes); // should remove current scaleNoteDegree from options
      console.debug(currentMeasure); 
      currentMeasure += 1;
  } else if (currentMeasure <= measureRepeats - 1) {
      console.debug(currentMeasure); 
      currentMeasure += 1;
  } else if (currentMeasure > measureRepeats - 1) {
      //scaleNoteDegree = randomizeScaleDegree(scaleNotes); // should remove current scaleNoteDegree from options
      console.debug(currentMeasure); 
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
    // let scaleNoteDegree = randomizeScaleDegree(scaleNotes);

    resPart = new Tone.Part(
      function(time, note) {
        resSynth.triggerAttackRelease(note, "10hz", time);
      },
      createResolutionPattern(relativeKeyNotes)
    );
  

    // Setup the synth to be ready to play on beat 1
    resPart.start();//.loop = "true";

}

melodyNotePartFunction = function(time) {

  if (melodyNotePart !== undefined) {
    melodyNotePart.dispose();
  }

  melodyNotePart = new Tone.Part(
    function(time, note) {
      refNoteSynth.triggerAttackRelease(note, "10hz", time); //note, "10hz", time);
    },
    createMelodyNotePattern()
  );


  // Setup the synth to be ready to play on beat 1
  melodyNotePart.start();//.loop = "true";
}


melodyChordNotePartFunction = function(time) {

  if (melodyChordNotePart !== undefined) {
    melodyChordNotePart.dispose();
  }

  // TODO: choosing of the chord change... 
  // Maybe for now, just have it do every other... later... pick how many measures until return to reference/C base
  if (currentMeasure == 1) {

    if (rounds == 1) {

      scaleNoteDegree = "C"; 
      rounds = (rounds % roundsBeforeReturnToBase) + 1;

    } else if (rounds < roundsBeforeReturnToBase) {

      rounds += 1;
      scaleNoteDegree = scaleNotes.filter(item => item[0] != scaleNoteDegree).map(item => item[0])[Math.floor(Math.random() * scaleDegrees.length - 1)];

    }
        
    console.debug(currentMeasure); 
    currentMeasure += 1;
} else if (currentMeasure <= measureRepeats - 1) {
    console.debug(currentMeasure); 
    currentMeasure += 1;
} else if (currentMeasure > measureRepeats - 1) {
    //scaleNoteDegree = randomizeScaleDegree(scaleNotes); // should remove current scaleNoteDegree from options
    console.debug(currentMeasure); 
    currentMeasure = 1;
}



  melodyChordNotePart = new Tone.Part(
    function(time, note) {
      chordSynth.triggerAttackRelease(note, "10hz", time); //note, "10hz", time);
    },
    createMelodyChordPattern(scaleNoteDegree)
  );


  // Setup the synth to be ready to play on beat 1
  melodyChordNotePart.start();//.loop = "true";
}


function createMelodyChordPattern(scaleNoteDegree) {

  relativeKeyNotes = getSelectedNotes(scaleNotes.map(item => item[0]), keyOctaveNum, scaleNoteDegree, majorScaleNumbers);

  chordNotes = constructChords(relativeKeyNotes);

  // update with more randomness in rhythm and phrasing of chords

  return [["0:0", chordNotes[0]], ["0:2", chordNotes[3]], ["0:4:0", chordNotes[4]], ["0:6:0", chordNotes[0]]];
          

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
        repeatId = Tone.Transport.scheduleRepeat((time) => {

          console.debug("Called scheduleRepeat anony func, time: " + time); 

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
      currentMeasure = 1;
      refNoteSynth.releaseAll();
      refNoteSynth.dispose();
      createRefNoteSynth();
      Tone.Transport.cancel(repeatId);
      Tone.Transport.stop();
      
  
    }
  
  });
  
document.getElementById("melody-button").addEventListener("click", function() {

////// TODO... will need to update the structure here so there a toggle for which game playing?  and then possibly just have one button grayed out when active
if (Tone.Transport.state !== 'started') {

  //createSequence();
  //createPart();
  repeatId = Tone.Transport.scheduleRepeat((time) => {

    Tone.Transport.bpm.value = bpm;

    melodyNotePartFunction(time);

    melodyChordNotePartFunction(time)

  }, "4m");

Tone.Transport.start();

} else {
  // refNoteSynth.volume.value = -100;
  currentMeasure = 1;
  // refNoteSynth.releaseAll();
  // refNoteSynth.dispose();
  createRefNoteSynth();
  Tone.Transport.cancel(repeatId);
  Tone.Transport.stop();
}

 // TODO:
 
 // Need to add option to select how often to return to "base" melody
 // Need option to say how many notes shold be selected
 // At first, can start in C and then just pick those notes that are selected ... if respect base, then select from pool of selected how many notes
 //   Need function to create part from this...
 // Need option to random to select the next chord change (respect "return to base" number... note... this count likely shold be started over each time stopped)
 // Need function that will calculate what the existing notes are as solfege notes for given keys
 // Later down the road... need option to update what the default/base note situation is
 // Need to shut off the ref-note if it's playing already


});
  

 // Create option that can select how many notes to play at the same time...  I would think just starting with one chord... but maybe have option of chord progression over chord progression?

 // Would be nice to choose more how the key center is establish... especially if there could be one note cloud version...

 // Would be nice to add pitch recognition to allow singing the same melody over different keys...