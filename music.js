
// ================================
// Section: Declare/Initialize Variables
// ================================

// array to hold ordered note resources
let global_scaleNotes = [['C', 'do', 'doe', '1', 0],
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

let global_majorScaleNumbers = [0, 2, 4, 5, 7, 9, 11];

let global_currentKeyNotes = [];

let global_currentKey;

let global_currentMelodyNotes = [];

let global_scenarioRepeats = 2;

let global_scenarioRepeatsCount = 1;

let global_barCount = 1;

let global_roundsToInitialState = 4;

let global_roundsToInitialStateCount = 1;

let global_totalRoundsToRandomizeMelody = 1;

let global_totalRoundsToRandomizeMelodyCount = 1

let global_currentSolfege;

let global_transportPlayId;

// Number of measures for loop
let global_cadenceMeasureLength = "4m";

let global_advanceKeys = true;

let global_playResolution = true;

let global_keyOctaveNum = 4;

// Synths
let global_solfegeSynth;
let global_keySynth;
let global_resolutionSynth;

// create a new sequence with the synth and notes
let global_solfegePart;
let global_keyPart;
let global_resolutionPart;

let global_refNote = "C4";
let global_chordNotes = [["C3", "E3", "G3"], ["F3", "A3", "C4"], ["G3", "B3", "D4"], ["C3", "E3", "G3"]];
let global_bpm = 220;

// Synth declarations
let global_filter;
let global_chord_filter;

// Effects
let global_reverb;
let global_pingPong;

createKeySynth(); // Eventually, move into initialize() function
createResolutionSynth();
createSolfegeSynth();

function initializePlayer() {

    // initialize the transport
    // Tone.Transport.bpm.value = global_bpm;
    // Tone.Transport.loop = true;
    // Tone.Transport.loopStart = 0;
    // Tone.Transport.loopEnd = global_cadenceMeasureLength;
    // Tone.Transport.swing = 0;
    // Tone.Transport.swingSubdivision = "8n";
    // Tone.Transport.timeSignature = [4, 4];


    // TODO: update to set values from the interface
    //      including like values for global_currentSolfege... global_scenarioRepeats, global_roundsToInitialState, global_cadenceMeasureLength, global_advanceKeys, global_playResolution, global_keyOctaveNum, global_bpm
    //      including: global_totalRoundsToRandomizeMelody, global_totalRoundsToRandomizeMelodyCount = 1
    global_scenarioRepeatsCount = 1;
    global_barCount = 1;
    global_roundsToInitialStateCount = 1;

}


// =======================================
// Section: Main Execution On-Click Events
// =======================================

document.getElementById("play-button").addEventListener("click", async function() {

    if (Tone.Transport.state !== 'started') {

        global_transportPlayId = Tone.Transport.scheduleRepeat((time) => {

          console.debug("Called scheduleRepeat anony func, time: " + time); 

          Tone.Transport.bpm.value = global_bpm;

          // Part for reference note
          createSolfegePart(time, createSolfegePattern_changingSolfege(global_refNote, global_cadenceMeasureLength));
          createKeyPart(time, createKeyPattern_changingSolfege(global_refNote, global_keyOctaveNum));
          createResolutionPart(time, createResolutionPattern(global_currentKeyNotes, global_refNote, global_keyOctaveNum));

        }, global_cadenceMeasureLength);

      await Tone.start();
      Tone.Transport.start();
  
    } else {

        createSolfegeSynth();
        initializePlayer();

        Tone.Transport.cancel(global_transportPlayId);
        Tone.Transport.stop();
    }
});


// TODO: make these on-click functions a bit more generic, so I can just send in the several functions that need to be called
// TODO: need make this button stop other buttons progress if currently playing.  Right now, just re-using the same global_transportPlayId
document.getElementById("melody-button").addEventListener("click", async function() {

  if (Tone.Transport.state !== 'started') {

      global_transportPlayId = Tone.Transport.scheduleRepeat((time) => {

        console.debug("Called scheduleRepeat anony func, time: " + time); 

        Tone.Transport.bpm.value = global_bpm;

        // createKeyPart randomizes the key... then the melody is created...
        createKeyPart(time, createKeyPattern_staticSolfege(global_refNote, global_keyOctaveNum));
        createSolfegePart(time, createSolfegePattern_staticSolfege(global_refNote, global_cadenceMeasureLength));

      }, global_cadenceMeasureLength);

    await Tone.start();
    Tone.Transport.start();

  } else {

      createSolfegeSynth();
      initializePlayer();

      Tone.Transport.cancel(global_transportPlayId);
      Tone.Transport.stop();
  }
});


// =====================
// Section: Create Parts
// =====================

function createSolfegePart(time, pattern_function) {

    // TODO: other games... createSolfegePattern_staticSolfege(), createSolfegePattern_changingModes()
    if (global_solfegePart !== undefined) {
        global_solfegePart.dispose();
    }
  
    global_solfegePart = new Tone.Part(
      function(time, event) {
        global_solfegeSynth.triggerAttackRelease(event.note, event.duration, time); //note, "10hz", time);
      },
      pattern_function
    );
  
    // Setup the synth to be ready to play on beat 1
    global_solfegePart.start();//.loop = "true";
}

function createKeyPart(time, pattern_function) {

    // TODO: other games: createSolfegePattern_staticSolfege(), createSolfegePattern_changingModes()
    if (global_keyPart !== undefined) {
        global_keyPart.dispose();
    }
  
    global_keyPart = new Tone.Part(
      function(time, event) {
        global_keySynth.triggerAttackRelease(event.note, event.duration, time); //note, "10hz", time);
      },
      pattern_function
    );
  
    // Setup the synth to be ready to play on beat 1
    global_keyPart.start();//.loop = "true";
}

function createResolutionPart(time, pattern_function) {

  if (global_resolutionPart !== undefined) {
    global_resolutionPart.dispose();
  }

  global_resolutionPart = new Tone.Part(
    function(time, event) {
      global_resolutionSynth.triggerAttackRelease(event.note, event.duration, time);
    },
    pattern_function
  );

  // Setup the synth to be ready to play on beat 1
  global_resolutionPart.start();//.loop = "true";

}


// ========================
// Section: Create Patterns
// ========================

function createSolfegePattern_changingSolfege(refNote, cadenceMeasureLength) {

  return [{time: "0:0", duration: cadenceMeasureLength, note: refNote}];

}


function createKeyPattern_changingSolfege(refNote, keyOctaveNum) {

    // TODO: for this game, global_currentSolfege does not need to be global... but I think for the static solfege game, it does

    // deciding on the key advance here should be moved
    if (global_scenarioRepeatsCount == 1) {
        global_currentSolfege = randomizeScaleDegree(global_scaleNotes); // should remove current scaleNoteDegree from options
        console.debug(global_scenarioRepeatsCount); 
        global_scenarioRepeatsCount += 1;
    } else if (global_scenarioRepeatsCount <= global_scenarioRepeats - 1) {
        console.debug(global_scenarioRepeatsCount); 
        global_scenarioRepeatsCount += 1;
    } else if (global_scenarioRepeatsCount > global_scenarioRepeats - 1) {
        //scaleNoteDegree = randomizeScaleDegree(scaleNotes); // should remove current scaleNoteDegree from options
        console.debug(global_scenarioRepeatsCount); 
        global_scenarioRepeatsCount = 1;
    }

    let contextKey = getContextScale(refNote, global_currentSolfege);

    return createKeyPattern(contextKey, keyOctaveNum)
}


function createKeyPattern(contextKey, keyOctaveNum) {

    // TODO: possibly update major scale notes to be derived by the matches between global_scaleNotes and the following for the key of C: 
    // inTonal.Scale.get(relativeKeyRoot + " major").notes.map(item => Tonal.Note.simplify(item));

    global_currentKeyNotes = getSelectedNotes(global_scaleNotes.map(item => item[0]), keyOctaveNum, contextKey, global_majorScaleNumbers);

    chordNotes = constructChords(global_currentKeyNotes);
  
    // update with more randomness in rhythm and phrasing of chords
  
    // let key_chords = Tonal.Key.majorKey(relativeKeyRoot).triads;

    // let i_iv_v_progression = [key_chords[0], key_chords[3], key_chords[4], key_chords[0]];

    // let chordNotes = i_iv_v_progression.map(chord => appendNumber(Tonal.Chord.notes(chord), keyOctaveNum));

    return [{time: "0:0", duration: "10hz", note: chordNotes[0]}, 
            {time: "0:2", duration: "10hz", note: chordNotes[3]}, 
            {time: "0:4:0", duration: "10hz", note: chordNotes[4]}, 
            {time: "0:6:0", duration: "10hz", note: chordNotes[0]}];
    
}

// adding timing to resolution notes (evenly spaced within half a measure)
function createResolutionPattern(currentKeyNotes, refNote, keyOctaveNum) {
  // Calculate the duration of one measure in seconds
  const secondsPerBeat = 60.0 / Tone.Transport.bpm.value;
  const secondsPerHalfMeasure = secondsPerBeat * 2;

  let refNoteIndex = removeNumber(currentKeyNotes).indexOf(removeNumber(refNote));

  let addRefNote = false;

  if (refNoteIndex == -1) {

      addRefNote = true;

      let allNotesOrdered = getOrderedNotes(global_scaleNotes.map(item => item[0]), currentKeyNotes[0][0]);

      let allNotesRefNoteIndex = allNotesOrdered.indexOf(removeNumber(refNote));

      if (allNotesRefNoteIndex >= 6) { // Note: I could imagine this logic needing to be re-considered if other modes/scales were added.
                                      
          refNoteIndex = removeNumber(currentKeyNotes).indexOf(allNotesOrdered[allNotesRefNoteIndex + 1]); 
      } else {
          refNoteIndex = removeNumber(currentKeyNotes).indexOf(allNotesOrdered[allNotesRefNoteIndex - 1]);
      }
  }

  // if above 4th, resolution up. if below 4th, resolution down
  //indexOfRefNote = removeNumber(currentKeyNotes).indexOf(removeNumber(refNote));

  if (refNoteIndex > 3) {

      // TODO: need to fix the octave of the refNote in this case...

      resolutionNotes = currentKeyNotes.filter((value, index) => index >= refNoteIndex);
      resolutionNotes.push(appendNumber(removeNumber(currentKeyNotes[0]), keyOctaveNum + 1));

      if (addRefNote) {
          //resolutionNotes.reverse().push(refNote); // Fix lower octave issue
          resolutionNotes.reverse().push(appendNumber(removeNumber(refNote), keyOctaveNum + 1));
          resolutionNotes = resolutionNotes.reverse();
      }

  } else {

      resolutionNotes = currentKeyNotes.filter((value, index) => index <= refNoteIndex);
  
      if (addRefNote) {
          // resolutionNotes.push(refNote); // Fix lower octave issue
          resolutionNotes.push(appendNumber(removeNumber(refNote), keyOctaveNum + 1)); 
      }

      resolutionNotes = resolutionNotes.reverse();


  }
  
  resolutionPart = resolutionNotes.map((value, index) => {
      const calculatedValue = (secondsPerHalfMeasure * 6) + secondsPerHalfMeasure/currentKeyNotes.length * index;
      return {time: calculatedValue, duration: "10hz", note: value};
  });

  return resolutionPart;

}


function createSolfegePattern_staticSolfege(refNote, cadenceMeasureLength) {

  // if first time through a scnenario, converts the solfege to melody notes for the current key
  if (global_scenarioRepeatsCount - 1 == 1) { // -1 Because count is advanced in the createKeyPattern_changingSolfege function called just prior

// TODO: check that this doesn't need to be updated for the multi-dimensional array...)

    // take global_currentSolfege and use global_scaleNotes to get the indexes in an array... store in currentMelodyIndexes
    let currentMelodyIndexes = global_currentSolfege.map(note => global_scaleNotes.map(item => item[0]).indexOf(note)); 

    // take global_scaleNotes... order with root being current key... store in reorderedScaleNotes
    let rootIndex = global_scaleNotes.map(item => item[0]).indexOf(global_currentKey);
    let reorderedScaleNotes = [...global_scaleNotes.slice(rootIndex), ...global_scaleNotes.slice(0, rootIndex)];

    // then use currentMelodyIndexes to get the notes from reorderedScaleNotes... store in global_currentMelodyNotes
    global_currentMelodyNotes = currentMelodyIndexes.map(index => reorderedScaleNotes[index]);

  }
  return [{time: "0:0", duration: "4m", note: "A4"}];
  // // TODO: update format here... and also make the note spacing dynamically calculated like in createResolutionPattern
  // return [["2:0", melodyNotes[0] + keyOctaveNum], 
  //         ["2:2", melodyNotes[1] + keyOctaveNum], 
  //         ["2:4", melodyNotes[2] + keyOctaveNum], 
  //         ["2:6", melodyNotes[3] + keyOctaveNum]]; // update to be the several notes...

  // return [{time: "0:0", duration: cadenceMeasureLength, note: refNote}];

  // TODO: finally... update how the solfege notes are displayed on the screen...

}


function createKeyPattern_staticSolfege(refNote, keyOctaveNum) {

  //let contextKey;

  if (global_scenarioRepeatsCount == 1) {

    if (global_roundsToInitialStateCount == 1) {

      if (global_totalRoundsToRandomizeMelodyCount == 1) {

        let possibleMelodyNotes = global_scaleNotes.filter(item => item[4] == true).map(item => item[0]);
        let melodyNoteCount = document.getElementById('num-notes-seq-input').value;
     
        /// Could do this in solfegePattern part too... but  maybe a bit more straight-forward to have all this logic in one place
        global_currentSolfege = getRandomElements(possibleMelodyNotes, melodyNoteCount); // TODO: this call would be updated to support chords

      }

      global_totalRoundsToRandomizeMelodyCount = (global_totalRoundsToRandomizeMelodyCount % (global_totalRoundsToRandomizeMelody)) + 1;

      // set key back to the reference key state
      global_currentKey = removeNumber(refNote);

    } else {

      // TODO: randomize key... but don't let it be the reference key or the most recent key
      // TODO: also... save out this initial state key so that it can be returned to...
      let possibleKeys = global_scaleNotes.filter(item => item[0] != global_currentKey).filter(item => item[0] != removeNumber(refNote)).map(item => item[0]);

      global_currentKey = possibleKeys[Math.floor(Math.random() * possibleKeys.length)][0];

    }

    global_roundsToInitialStateCount = (global_roundsToInitialStateCount % (global_roundsToInitialState)) + 1;

  }

  global_scenarioRepeatsCount = (global_scenarioRepeatsCount % global_scenarioRepeats) + 1;

  
  return createKeyPattern(global_currentKey, keyOctaveNum)


  // global_scenarioRepeats, global_roundsToInitialStateCount, global_totalRoundsToRandomizeMelody 

}


// ======================
// Section: Create Synths
// ======================

function createSolfegeSynth() {

    // TODO: can I do the same kind of synth parameters updates if I return this as a copy?
    global_solfegeSynth = new Tone.PolySynth({});
  
    global_solfegeSynth.set({
        oscillator: {
            type: "sine"
        }
    });
    
    global_solfegeSynth.toDestination();

    global_filter = new Tone.Filter(100, "lowpass").toDestination();
    global_solfegeSynth.connect(global_filter); 
}


// Key Synth
function createKeySynth() {

    global_keySynth = new Tone.PolySynth();

    global_keySynth.set({
        volume: -10,
        oscillator: {
            type: "sine"
        }
    });
    
    global_keySynth.toDestination();


    global_chord_filter = new Tone.Filter(50, "lowpass").toDestination();
    
    global_reverb = new Tone.Reverb({
        decay : 5,
        preDelay : 0.01,
        wet: 1
    });// .toDestination();
  
    global_pingPong = new Tone.PingPongDelay({
        delayTime: '16n',
        feedback: .8,
        wet: .75
    }).toDestination();

    global_keySynth.connect(global_chord_filter);
    global_keySynth.connect(global_pingPong);
    global_keySynth.connect(global_reverb);

}

function createResolutionSynth() {

    global_resolutionSynth = new Tone.PolySynth({
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
}


// ===============================
// Section: Tonal Utilities
// ===============================

// function to randomize which relative scale degree is used based on which values of scaleNotes.map(item => item[3]) are true
function randomizeScaleDegree(scaleNotes) {
    
    // TODO: don't use global_currentSolfege here, check

    let scaleDegrees;
    
    if (global_currentSolfege === undefined | scaleNotes.filter(item => item[4] == true).length == 1)
      scaleDegrees = scaleNotes.filter(item => item[4] == true).map(item => item[0]);
    else 
      scaleDegrees = scaleNotes.filter(item => item[0] != global_currentSolfege).filter(item => item[4] == true).map(item => item[0]);

    let newNote = scaleDegrees[Math.floor(Math.random() * scaleDegrees.length)];

    let newSolfegeNote = scaleNotes.filter(item => item[0] == newNote).map(item => item[1]);

    document.getElementById('current-note').textContent = "Current solfege note: " + newSolfegeNote;

    return newNote;

}


// find major key that make a given note sound like the relative scaleDegree of interest
// for instance, if the note is C3 and the scaleDegree is "mi", then the function should return the major key that makes C3 sound like the "mi" of that scale, which is G# Major
function getContextScale(refNote, currentSolfege) {

  let orderedNotes = getOrderedNotes(global_scaleNotes.map(item => item[0]), removeNumber(refNote));

  // get the index of the scaleDegree in the scaleDegrees array
  let scaleDegreeIndex = global_scaleNotes.map(item => item[0]).indexOf(currentSolfege);

  let contextKey = orderedNotes[(12 - scaleDegreeIndex) % 12];

  // get the note that is the scaleDegreeIndex ahead of the scaleNoteIndex
  // let contextKey = Tone.Frequency(scaleNotes[scaleNoteIndex][0]).transpose(-scaleDegreeIndex).toNote(); //"C5"

  // return the relevantMajorKey
  return contextKey;

}


function getOrderedNotes(allNotes, rootNote) {

  const startNote = allNotes.indexOf(rootNote);

  let rootAllNotes = allNotes.slice(startNote, 12).concat(allNotes.slice(0, startNote))

  return(rootAllNotes);

}


function getSelectedNotes (allNotes, octaveNumber, rootNote, includeNotes) {

  let orderedNotes = getOrderedNotes(allNotes, rootNote);

  //const orderedNotesNumbered = orderedNotes.map(note => {return `${note}${octaveNumber}`});

  // find index of 'C' and if not find index of c# in orderedNotes
  const indexOfNewOctave = orderedNotes.indexOf('C') > -1 ? orderedNotes.indexOf('C') : orderedNotes.indexOf('C#');

  orderedNotes = removeNumber(orderedNotes);

  let orderedNotesNumbered = orderedNotes.map((value, index) => indexOfNewOctave != 0 && index >= indexOfNewOctave ? appendNumber(value, octaveNumber + 1) : appendNumber(value, octaveNumber));

  const filteredNotes = includeNotes.map(item => orderedNotesNumbered[item]);

  return(filteredNotes);

}


function constructChords(scale) {

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


// ===========================
// Section: Sequence Utilities
// ===========================

function createNoteSequence(numMeasures, timeSignature, notes) {
  // Calculate the total number of beats
  let totalBeats = numMeasures * timeSignature;

  // Calculate the duration of each note in beats
  let beatsPerNote = totalBeats / notes.length;

  // Calculate the duration of each note as half the length between each note and the next
  let noteDuration = beatsPerNote / 2;

  // Create the note sequence
  let noteSequence = notes.map((note, index) => {
    return {
      time: `${Math.floor(index * beatsPerNote)}:${Math.floor((index * beatsPerNote) % 1 * 4)}:0`,
      note: note,
      duration: `${Math.floor(noteDuration)}:${Math.floor((noteDuration) % 1 * 4)}:0`
    };
  });

  return noteSequence;
}



// ========================
// Section: Other Utilities
// ========================

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

// function to get random elements from an array
function getRandomElements(arr, count) {
  let result = [];
  for(let i = 0; i < count; i++) {
      result.push(arr[Math.floor(Math.random() * arr.length)]);
  }
  return result;
}