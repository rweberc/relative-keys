
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
                    
// Add values for each of the mode notes in the key of C
let modesInC = {
  'Ionian': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  'Dorian': ['C', 'D', 'D#', 'F', 'G', 'A', 'A#'],
  'Phrygian': ['C', 'C#', 'D#', 'F', 'G', 'G#', 'A#'],
  'Lydian': ['C', 'D', 'E', 'F#', 'G', 'A', 'B'],
  'Mixolydian': ['C', 'D', 'E', 'F', 'G', 'A', 'A#'],
  'Aeolian': ['C', 'D', 'D#', 'F', 'G', 'G#', 'A#'],
  'Locrian': ['C', 'C#', 'D#', 'F', 'F#', 'G#', 'A#']
};

global_scaleNotes = global_scaleNotes.map(item => {
  // Check if the note is in each mode
  let isInModes = Object.values(modesInC).map(notes => notes.includes(item[0]) ? 1 : 0);

  // Add the new values to the nested array
  return [...item, ...isInModes];
});

const arrayModesIndexBegin = 5; // constant to use to identify where the mode items are defined in the global_scaleNotes array

// example of how to call column [2] and row [3]scaleNotes.map(item => item[2])[3]
// has to be an easier way to select several items at once... [2, 3, 4, 7].map(ind => scaleNotes.map(item => item[2])[ind])

// let global_majorScaleNumbers = [0, 2, 4, 5, 7, 9, 11]; // TODO: update to constant

let global_keySynth;
let global_solfegeSynth;
let global_resolutionSynth;

let global_filter;
let global_chord_filter;
let global_reverb;
let global_pingPong;

let global_keyPart;
let global_solfegePart;
let global_resolutionPart;
let global_speakMelodySequence;
let global_speakModeSequence;
let global_speakRefSolfegeSequence;

let global_refNote;
let global_bpm;
let global_transportPlayId;
let global_currentGame = "changingSolfege"; // "staticSolfege", "changingSolfege", "modeMelodies"
let global_activeGameTab;

let global_scenarioRepeats;
let global_scenarioRepeatsCount;

let global_referenceNoteChangeCount;
let global_referenceNoteChanges;

let global_roundsToInitialState;
let global_roundsToInitialStateCount;
let global_totalRoundsToRandomizeMelody;
let global_totalRoundsToRandomizeMelodyCount;

let global_totalRoundsToRandomizeModeMelodyCount;
let global_totalRoundsToRandomizeModeMelody;

let global_cadenceMeasureLength;

let global_currentKeyNotes;
let global_currentKey;
let global_currentMelodyNotes;
let global_melodyNoteDuration;
let global_speakSolfege;
let global_currentSolfegeWRT_C;
let global_currentSolfegeWRT_DO;

let global_currentMode;
let global_originalMode;
let global_selectedModes;
let global_originalModeMelody




// let global_currentKeyNotes = [];

// let global_currentKey;

// let global_currentMelodyNotes = [];

// let global_scenarioRepeats = document.getElementById('scenario-input').value;

// let global_scenarioRepeatsCount = 1;

// // let global_barCount = 1;

// let global_roundsToInitialState = document.getElementById('re-base-input').value;

// let global_roundsToInitialStateCount = 1;

// let global_totalRoundsToRandomizeMelody = document.getElementById('num-base-returns-input').value;

// let global_totalRoundsToRandomizeMelodyCount = 1

// let global_melodyNoteDuration = document.getElementById('mel-duration-slider').value/100.0;

// let global_currentSolfegeWRT_C; // Even though this is call "currentSolfege"... the values are the letter (C, D, E, etc.) values associated with a root of C solfege notes.  This needs to be updated to be more straight-forward.

// let global_currentSolfegeWRT_DO;

// let global_transportPlayId;

// // Number of measures for loop
// let global_cadenceMeasureLength = "4m";

// let global_playResolution = true;

// let global_keyOctaveNum = 4;

// // Synths
// let global_solfegeSynth;
// let global_keySynth;
// let global_resolutionSynth;

// // create a new sequence with the synth and notes
// let global_solfegePart;
// let global_keyPart;
// let global_resolutionPart;

// let global_refNote = "C4";
// // let global_chordNotes = [["C3", "E3", "G3"], ["F3", "A3", "C4"], ["G3", "B3", "D4"], ["C3", "E3", "G3"]];
// let global_bpm = 220;

// // Synth declarations
// let global_filter;
// let global_chord_filter;

// // Effects
// let global_reverb;
// let global_pingPong;

initializePlayer();


function initializePlayer() {

  createKeySynth(); // Eventually, move into initialize() function
  createResolutionSynth();
  createSolfegeSynth();

  //global_currentGame = "";

  global_bpm = document.getElementById("tempo-slider").value;

  // initialize the transport
  Tone.Transport.bpm.value = global_bpm;
  // Tone.Transport.loop = true;
  // Tone.Transport.loopStart = 0;
  // Tone.Transport.loopEnd = global_cadenceMeasureLength;
  // Tone.Transport.swing = 0;
  // Tone.Transport.swingSubdivision = "8n";
  // Tone.Transport.timeSignature = [4, 4];


  // TODO: update to set values from the interface
  //      including like values for global_currentSolfege... global_scenarioRepeats, global_roundsToInitialState, global_cadenceMeasureLength, global_playResolution, global_keyOctaveNum, global_bpm
  //      including: global_totalRoundsToRandomizeMelody, global_totalRoundsToRandomizeMelodyCount = 1
  global_scenarioRepeats = document.getElementById('scenario-input').value;
  global_scenarioRepeatsCount = 1;
  global_referenceNoteChanges = document.getElementById('ref-count-input').value;
  global_referenceNoteChangeCount = 1;
  global_roundsToInitialState = document.getElementById('re-base-input').value;
  global_roundsToInitialStateCount = 1;
  global_totalRoundsToRandomizeMelody = document.getElementById('num-base-returns-input').value;
  global_totalRoundsToRandomizeMelodyCount = 1;
  global_melodyNoteDuration = document.getElementById('mel-duration-slider').value/100.0;
  global_speakSolfege = document.getElementById('speak-solfege-checkbox').checked;
  global_totalRoundsToRandomizeModeMelodyCount = 1;
  global_totalRoundsToRandomizeModeMelody = document.getElementById('num-mel-rounds-input').value;

  global_cadenceMeasureLength = "4m";
  global_playResolution = true;
  global_keyOctaveNum = 4;
  global_refNote = document.getElementById('ref-note').value;

  global_currentMode = -1;
  global_originalMode = -1;

  global_selectedModes = Array.from(document.querySelectorAll('input[name="modes"]:checked')).map(input => input.value);

}

function resetPlayer() {

  Tone.Transport.cancel(); // Seems like overkill... but when using global_transportPlayId, seemed to have some delay on being populated when one game would "interrupt" another, and the previous game wouldn't get properly reset
  Tone.Transport.stop();
  Tone.Transport.cancel(global_transportPlayId); 

  // Similar to above, these may also be overkill resets... would require more testing scenarios to confirm.
  global_keySynth.releaseAll();
  global_solfegeSynth.releaseAll();
  global_resolutionSynth.releaseAll();

  global_keySynth.dispose();
  global_solfegeSynth.dispose();
  global_resolutionSynth.dispose();

  if (global_keyPart !== undefined) {
    global_keyPart.dispose();
  }

  if (global_solfegePart !== undefined) {
    global_solfegePart.dispose();
  }

  if (global_resolutionPart !== undefined) {
    global_resolutionPart.dispose();
  }

  if (global_speakMelodySequence !== undefined) {
    global_speakMelodySequence.dispose();
  }
  
  if (global_speakRefSolfegeSequence !== undefined) {
    global_speakRefSolfegeSequence.dispose();
  }
  

  if (global_speakModeSequence !== undefined) {
    global_speakModeSequence.dispose();
  }

  initializePlayer(); // This sets Transport....bpm... does it matter if it is before or after the previous lines of code?

}

// =======================================
// Section: Main Execution On-Click Events
// =======================================

document.getElementById("transport-button").addEventListener("click", async function() {

  //let currentGame = global_currentGame;

  document.getElementById("transport-button").disabled = true;

  if (Tone.Transport.state !== 'started') {

    // global_currentGame = "changingSolfege";

    Tone.Transport.bpm.value = global_bpm;

    global_transportPlayId = Tone.Transport.scheduleRepeat((time) => {

      console.debug("Called scheduleRepeat anony func, time: " + time); 
      
      if (global_currentGame == "staticSolfege") { // Game 2

        // createKeyPart randomizes the key... then the melody is created...
        createKeyPart(time, createKeyPattern_staticSolfege(global_refNote, global_keyOctaveNum));
        createSolfegePart(time, createSolfegePattern_staticSolfege(global_refNote, global_keyOctaveNum, global_melodyNoteDuration));
        createSpeakMelodySequence(time);

      } else if (global_currentGame == "changingSolfege") { // Game 1
        
        // Part for reference note
        createKeyPart(time, createKeyPattern_changingSolfege(global_keyOctaveNum));
        createSolfegePart(time, createSolfegePattern_changingSolfege(global_refNote, global_cadenceMeasureLength));
        createResolutionPart(time, createResolutionPattern(global_currentKeyNotes, global_refNote, global_keyOctaveNum));
        createSpeakRefSolfegeSequence(time);

      } else if (global_currentGame == "modeMelodies") {

        createKeyPart(time, createKeyPattern_modesGame(global_refNote, global_keyOctaveNum));
        createSolfegePart(time, createSolfegePattern_modesGame(global_refNote, global_keyOctaveNum, global_melodyNoteDuration)); // TODO: don't borrow this from other screen!
        createSpeakModeSequence(time);

      } else {

        return; // see if I can just return here... or if I need to do something else

      }

    }, global_cadenceMeasureLength);

    await Tone.start();
    Tone.Transport.start();

    document.getElementById("transport-button").innerHTML = 'Stop';

  } else {

    resetPlayer();

    document.getElementById("transport-button").innerHTML = 'Play';

  }

  document.getElementById("transport-button").disabled = false; // TODO: should likely update to a 'this' type of reference

});



// document.getElementById("play-button").addEventListener("click", async function() {

//   let playNow = false;

//   if (Tone.Transport.state !== 'started') {

//     playNow = true;

//   } else {

//     if (global_currentGame !== "changingSolfege")
//       playNow = true;

//     resetPlayer();

//   }

//   if (playNow) {

//     global_currentGame = "changingSolfege";

//     Tone.Transport.bpm.value = global_bpm;

//     global_transportPlayId = Tone.Transport.scheduleRepeat((time) => {

//       console.debug("Called scheduleRepeat anony func, time: " + time); 

//       // Part for reference note
//       createSolfegePart(time, createSolfegePattern_changingSolfege(global_refNote, global_cadenceMeasureLength));
//       createKeyPart(time, createKeyPattern_changingSolfege(global_refNote, global_keyOctaveNum));
//       createResolutionPart(time, createResolutionPattern(global_currentKeyNotes, global_refNote, global_keyOctaveNum));

//     }, global_cadenceMeasureLength);

//     await Tone.start();
//     Tone.Transport.start();

//   } //else {

//   //   resetPlayer();

//   // }
// });


// // TODO: make these on-click functions a bit more generic, so I can just send in the several functions that need to be called
// // TODO: need make this button stop other buttons progress if currently playing.  Right now, just re-using the same global_transportPlayId
// document.getElementById("melody-button").addEventListener("click", async function() {

//   let playNow = false;

//   if (Tone.Transport.state !== 'started') {

//     playNow = true;

//   } else {

//     if (global_currentGame !== "staticSolfege")
//       playNow = true;

//     resetPlayer();

//   }

//   if (playNow) {

//     global_currentGame = "staticSolfege";

//     Tone.Transport.bpm.value = global_bpm;

//     global_transportPlayId = Tone.Transport.scheduleRepeat((time) => {

//       console.debug("Called scheduleRepeat anony func, time: " + time); 

//       // createKeyPart randomizes the key... then the melody is created...
//       createKeyPart(time, createKeyPattern_staticSolfege(global_refNote, global_keyOctaveNum));
//       createSolfegePart(time, createSolfegePattern_staticSolfege(global_refNote, global_keyOctaveNum, global_melodyNoteDuration));

//     }, global_cadenceMeasureLength);

//     await Tone.start();
//     Tone.Transport.start();

//   } //else {

//   //   resetPlayer();
//   // }
// });


// =====================
// Section: Create Parts
// =====================

function createSolfegePart(time, pattern_function) {

    if (global_solfegePart !== undefined) {
        global_solfegePart.dispose();
    }
  
    global_solfegePart = new Tone.Part(
      function(time, event) {
        global_solfegeSynth.triggerAttackRelease(event.note, event.duration, time); //note, , time);
      },
      pattern_function
    );
  
    // Setup the synth to be ready to play on beat 1
    global_solfegePart.start();//.loop = "true";
}

function createKeyPart(time, pattern_function) {

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




function createSpeakRefSolfegeSequence(time) {

  if (global_speakRefSolfegeSequence !== undefined) {
    global_speakRefSolfegeSequence.dispose();
  }

  // Create a new Tone.js sequence
  global_speakRefSolfegeSequence = new Tone.Sequence((time, note) => {

    if (global_speakSolfege == true
          // && global_totalRoundsToRandomizeMelodyCount == 2 
          // && global_roundsToInitialStateCount == 2 
          && global_scenarioRepeatsCount == 2 ) { // counts are already incremented
      // Trigger the speech synthesis
      speakEvent(global_scaleNotes.filter(item => item[0] == note).map(item => item[2]).join(''));
    }

  }, [global_currentSolfegeWRT_C], "4n");

  global_speakRefSolfegeSequence.loop = false;

  // Start the sequence
  global_speakRefSolfegeSequence.start();

}

function createSpeakMelodySequence(time) {

  if (global_speakMelodySequence !== undefined) {
    global_speakMelodySequence.dispose();
  }

  // Create a new Tone.js sequence
  global_speakMelodySequence = new Tone.Sequence((time, note) => {

    if (global_speakSolfege == true
          && global_totalRoundsToRandomizeMelodyCount == 2 
          && global_roundsToInitialStateCount == 2 
          && global_scenarioRepeatsCount  == 2 ) { // counts are already incremented
      // Trigger the speech synthesis
      speakEvent(global_scaleNotes.filter(item => item[1] == note).map(item => item[2]).join(''));
    }

  }, global_currentSolfegeWRT_DO, "4n");

  global_speakMelodySequence.loop = false;

  // Start the sequence
  global_speakMelodySequence.start();

}

function createSpeakModeSequence(time) {

  if (global_speakModeSequence !== undefined) {
    global_speakModeSequence.dispose();
  }

  // Create a new Tone.js sequence
  global_speakModeSequence = new Tone.Sequence((time, note) => {

    if (global_speakSolfege == true
          && global_scenarioRepeatsCount  == 2) 
    { // counts are already incremented
      // Trigger the speech synthesis
      speakEvent(note);
    }

  }, [Object.keys(modesInC)[global_currentMode]], "4n");

  global_speakModeSequence.loop = false;

  // Start the sequence
  global_speakModeSequence.start();

}

// ========================
// Section: Create Patterns
// ========================

/////////////// Changing Solfege Game Pattern Functions

function createSolfegePattern_changingSolfege(refNote, cadenceMeasureLength) {

  return [{time: "0:0", duration: cadenceMeasureLength, note: refNote + "4"}]; // TODO: add in an octave option here for refNote?

}

function createKeyPattern_changingSolfege(keyOctaveNum) {

    // TODO: for this game, global_currentSolfege does not need to be global... but I think for the static solfege game, it does

    // deciding on the key advance here should be moved
    // TODO: update this with the mod logic for the scenarioRepeatsCount increments
    // if (global_scenarioRepeatsCount == 1) {

    //     // Decide whether to randomize the reference note
    //     if (global_referenceNoteChanges != 0 && global_referenceNoteChangeCount >= global_referenceNoteChanges) {
    //       let possibleReferenceNotes = global_scaleNotes.filter(item => item[0] != global_refNote).map(item => item[0]);
    //       global_refNote = possibleReferenceNotes[Math.floor(Math.random() * possibleReferenceNotes.length)][0];
    //       document.getElementById('ref-note').value = global_refNote;
    //     }

    //     global_referenceNoteChangeCount = (global_referenceNoteChangeCount % (global_referenceNoteChanges)) + 1;

    //     global_currentSolfegeWRT_C = randomizeScaleDegree(global_scaleNotes); // should remove current scaleNoteDegree from options
    //     console.debug(global_scenarioRepeatsCount); 
    //     global_scenarioRepeatsCount += 1;
    // } else if (global_scenarioRepeatsCount <= global_scenarioRepeats - 1) {
    //     console.debug(global_scenarioRepeatsCount); 
    //     global_scenarioRepeatsCount += 1;
    // } else if (global_scenarioRepeatsCount > global_scenarioRepeats - 1) {
    //     //scaleNoteDegree = randomizeScaleDegree(scaleNotes); // should remove current scaleNoteDegree from options
    //     console.debug(global_scenarioRepeatsCount); 
    //     global_scenarioRepeatsCount = 1;
    // }
    
    if (global_scenarioRepeatsCount == 1) {

      // Decide whether to randomize the reference note
      if (global_referenceNoteChanges != 0 && global_referenceNoteChangeCount >= global_referenceNoteChanges) {

        let possibleReferenceNotes = global_scaleNotes.filter(item => item[0] != global_refNote).map(item => item[0]);
        global_refNote = possibleReferenceNotes[Math.floor(Math.random() * possibleReferenceNotes.length)][0];

        document.getElementById('ref-note').value = global_refNote;
      }

      global_referenceNoteChangeCount = (global_referenceNoteChangeCount % (global_referenceNoteChanges)) + 1;

      global_currentSolfegeWRT_C = randomizeScaleDegree(global_scaleNotes); // should remove current scaleNoteDegree from options

    }

    global_scenarioRepeatsCount = (global_scenarioRepeatsCount % global_scenarioRepeats) + 1;

    let contextKey = getContextScale(global_refNote, global_currentSolfegeWRT_C);

    return createKeyPattern(contextKey, keyOctaveNum)
}


function createKeyPattern(contextKey, keyOctaveNum, scaleNotes = getModeIndexes(global_scaleNotes, arrayModesIndexBegin)) { // default to major scale


  document.getElementById('current-key').textContent = "Current key playing: " + contextKey;

  // For... set to Ionian (major) mode if not defined... since no option to select mode yet in games 1 or 2...
  if (global_currentMode == -1) {
    document.getElementById('current-mode').textContent = "Current mode playing: " + "Ionian";
  } else {
    document.getElementById('current-mode').textContent = "Current mode playing: " + Object.keys(modesInC)[global_currentMode];
  }
  

    // TODO: possibly update major scale notes to be derived by the matches between global_scaleNotes and the following for the key of C: 
    // inTonal.Scale.get(relativeKeyRoot + " major").notes.map(item => Tonal.Note.simplify(item));

    global_currentKeyNotes = getSelectedNotes(global_scaleNotes.map(item => item[0]), keyOctaveNum, contextKey, scaleNotes);
    
    chordNotes = constructChords(global_currentKeyNotes);
  
    // update with more randomness in rhythm and phrasing of chords
  
    // let key_chords = Tonal.Key.majorKey(relativeKeyRoot).triads;

    // let i_iv_v_progression = [key_chords[0], key_chords[3], key_chords[4], key_chords[0]];

    // let chordNotes = i_iv_v_progression.map(chord => appendNumber(Tonal.Chord.notes(chord), keyOctaveNum));

    // TODO: figure out if "10hz" is really functioning here at all
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
  
  // resolutionPart = resolutionNotes.map((value, index) => {
  //     const calculatedValue = (secondsPerHalfMeasure * 6) + secondsPerHalfMeasure/resolutionNotes.length * index;
  //     return {time: calculatedValue, duration: "10hz", note: value};
  // });

  // resolutionPart = createNoteSequence(.5, Tone.Transport.timeSignature, resolutionNotes, "3:0:0", Tone.Transport.bpm.value);

  resolutionPart = createNoteSequence_seconds(.5, Tone.Transport.timeSignature, resolutionNotes, 3, Tone.Transport.bpm.value, "10hz");

  return resolutionPart;

}

///////////  Static Solfege Game Pattern Functions

function createSolfegePattern_staticSolfege(refNote, keyOctaveNum, note_duration) {

  //console.debug("createSolfegePattern_staticSolfege, global_scenarioRepeatsCount: " + global_scenarioRepeatsCount); 

  // if first time through a scnenario, converts the solfege to melody notes for the current key
  if (global_scenarioRepeatsCount - 1 <= 1) { // -1 Because count is advanced in the createKeyPattern_changingSolfege function called just prior

  // TODO: check that this doesn't need to be updated for the multi-dimensional array...)
    // console.debug("global_currentKey: " + global_currentKey); 

    // take global_currentSolfege and use global_scaleNotes to get the indexes in an array... store in currentMelodyIndexes
   
    // take global_scaleNotes... order with root being current key... store in reorderedScaleNotes
    let rootIndex = global_scaleNotes.map(item => item[0]).indexOf(global_currentKey);
    let reorderedScaleNotes = [...global_scaleNotes.slice(rootIndex), ...global_scaleNotes.slice(0, rootIndex)];

    // update the associated solfege notes
    //reorderedScaleNotes = [reorderedScaleNotes.map(item => item[0]), global_scaleNotes.map(item => item[1])];
    reorderedScaleNotes = reorderedScaleNotes.map((item, index) => { return {note: item[0], solfege: global_scaleNotes[index][1]}});

    let cIndex = reorderedScaleNotes.findIndex(item => item["note"] === 'C');

    reorderedScaleNotes = reorderedScaleNotes.map((item, index) => {
      
      let newOctave = index < cIndex | cIndex == 0 ? keyOctaveNum : keyOctaveNum + 1;
      return {...item, octave: newOctave};
    });

    // then use currentMelodyIndexes to get the notes from reorderedScaleNotes... store in global_currentMelodyNotes
    global_currentMelodyNotes = global_currentSolfegeWRT_DO.map(solfege => { // TODO: there got to be a simpler syntax that can replace this
      // let index = reorderedScaleNotes["solfege"].indexOf(solfege);
      // let note = reorderedScaleNotes["note"][index] + reorderedScaleNotes["octave"][index];

      let note = reorderedScaleNotes.find(item => item.solfege === solfege).note + reorderedScaleNotes.find(item => item.solfege === solfege).octave;
      return {note, solfege};
    });
    
    // console.debug(global_currentMelodyNotes);

  }
  //return [{time: "0:0", duration: "4m", note: "A4"}];

  let staticSolfegePart = createNoteSequence_seconds(.7, Tone.Transport.timeSignature, global_currentMelodyNotes.map(item => item["note"]), 2.75, Tone.Transport.bpm.value, note_duration);
  // TODO: finally... update how the solfege notes are displayed on the screen...

  return staticSolfegePart
}


function createKeyPattern_staticSolfege(refNote, keyOctaveNum) {

  // console.debug("global_totalRoundsToRandomizeMelodyCount: " + global_totalRoundsToRandomizeMelodyCount); 
  // console.debug("global_roundsToInitialStateCount: " + global_roundsToInitialStateCount); 
  // console.debug("global_scenarioRepeatsCount: " + global_scenarioRepeatsCount); 
  // console.debug("global_currentKey begin: " + global_currentKey);

  if (global_scenarioRepeatsCount == 1) {

    if (global_roundsToInitialStateCount == 1) {

      if (global_totalRoundsToRandomizeMelodyCount == 1) {

        let possibleMelodyNotes = global_scaleNotes.filter(item => item[4] == true).map(item => item[0]);
        let melodyNoteCount = document.getElementById('num-notes-seq-input').value; // TODO: call this outside of the function
     
        /// Could do this in solfegePattern part too... but  maybe a bit more straight-forward to have all this logic in one place
        global_currentSolfegeWRT_DO = getRandomElements(possibleMelodyNotes, melodyNoteCount).map(letter => {
          // Find the index of the letter in the first elements of global_scaleNotes
          let index = global_scaleNotes.findIndex(item => item[0] === letter);
        
          // If the letter was found, return the corresponding solfege value
          // If the letter was not found, return the original letter
          return index !== -1 ? global_scaleNotes[index][1] : letter;
        });
        // TODO: this call would be updated to support chords
        // TODO: also could update this to add an octave argument

        document.getElementById('current-note').textContent = "Current solfege note: " + global_currentSolfegeWRT_DO.join(', ');

        // console.debug("Current solfege note: " + global_currentSolfegeWRT_DO.join(', '));

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

  global_scenarioRepeatsCount = (global_scenarioRepeatsCount % global_scenarioRepeats) + 1; // TODO: really not sure this makes sense here... should it be done in the createSolfegePattern_staticSolfege function?

  // console.debug("global_currentKey end: " + global_currentKey);

  return createKeyPattern(global_currentKey, keyOctaveNum)

  // global_scenarioRepeats, global_roundsToInitialStateCount, global_totalRoundsToRandomizeMelody 

}


//////////////// Mode Melodies Game Pattern Functions

function createSolfegePattern_modesGame(refNote, keyOctaveNum, note_duration) {


  //fix next time start understand why 1) global_originalMode and global_currentMode might be same value on initial transposeMelody call... also, then why there are null notes sent localStorage...
  
  // if first time through a scnenario, converts the solfege to melody notes for the current key
  if (global_scenarioRepeatsCount == 1) { // -1 Because count is advanced in the createKeyPattern_changingSolfege function called just prior

    if (global_totalRoundsToRandomizeModeMelodyCount == 1) {

      let melodyNoteCount = document.getElementById('num-notes-seq-input').value; // TODO: call this outside the function

      // from current mode, create  current melody
      let modeIndexes = getModeIndexes(global_scaleNotes, global_currentMode + arrayModesIndexBegin);


      //TODO: fix this call below ext
      let modeNotes = global_scaleNotes.filter((_, index) => modeIndexes.includes(index)).map(item => item[0]);

      // TODO: here is where it's assumed that the initial root note is C... need to update this to be more flexible
      global_currentMelodyNotes = getRandomElements(modeNotes, melodyNoteCount); // TODO: this is includes a different set of data elements than what is used in the static solfege game... should be updated and reflected in the call below...

      // Assign this to original mode melody
      global_originalModeMelody = global_currentMelodyNotes;

      global_originalMode = global_currentMode;

    } else {

      // take original mode melody and adjust it for current mode...
      global_currentMelodyNotes = transposeMelody(global_originalModeMelody, // TODO: this is includes a different set of data elements than what is used in the static solfege game... should be updated and reflected in the call below...
        getModeNotesInC(global_scaleNotes, global_originalMode + arrayModesIndexBegin),  
        getModeNotesInC(global_scaleNotes, global_currentMode + arrayModesIndexBegin) );
      
    }

    global_totalRoundsToRandomizeModeMelodyCount = (global_totalRoundsToRandomizeModeMelodyCount % (global_totalRoundsToRandomizeModeMelody)) + 1;

  }

  global_scenarioRepeatsCount = (global_scenarioRepeatsCount % global_scenarioRepeats) + 1;


  /// placeholder... these solfege names do no apply to all the different modes....
  let solfegeDisplayNotes = global_currentMelodyNotes.map(note => {
    let scaleNote = global_scaleNotes.find(item => item[0] === note);
    return scaleNote ? scaleNote[3] : null;
  });
  document.getElementById('current-note').textContent = "Current solfege note [placeholder numbers]: " + solfegeDisplayNotes.join(', ');

  // update notes form and global_keyOctaveNum reference to local?
  let modeSolfegePart = createNoteSequence_seconds(.7, Tone.Transport.timeSignature, appendNumber(global_currentMelodyNotes, global_keyOctaveNum), 2, Tone.Transport.bpm.value, note_duration);
  // TODO: finally... update how the solfege notes are displayed on the screen...

  return modeSolfegePart
}


function createKeyPattern_modesGame(refNote, keyOctaveNum) {

  if (global_scenarioRepeatsCount == 1) {

    // TODO: for now, refNote note used... but should be integrated to allow varying the root in the future
    global_currentKey = "C"; //document.getElementById('ref-note').value;

    // Pick a random mode from global_selectedModes, excluding the current mode
    if (global_currentMode == -1 || global_selectedModes.length == 1) { 
      global_currentMode = Number(global_selectedModes.map(item => item)[Math.floor(Math.random() * global_selectedModes.length)]);
    } else {
      //globel_previousMode = global_currentMode;
      let possibleModes = global_selectedModes.filter(item => item != global_currentMode).map(item => item);
      global_currentMode = Number(possibleModes.map(item => item)[Math.floor(Math.random() * possibleModes.length)]);
    }

    console.debug("global_currentMode: " + global_currentMode);
  }

  //document.getElementById('current-mode').textContent = "Current mode playing: " + Object.keys(modesInC)[global_currentMode];

  return createKeyPattern(global_currentKey, keyOctaveNum, getModeIndexes(global_scaleNotes, global_currentMode + arrayModesIndexBegin));
  // return;

}




//     if (global_roundsToInitialStateCount == 1) {

//       if (global_totalRoundsToRandomizeModeMelodyCount == 1) {

//         let possibleMelodyNotes = global_scaleNotes.filter(item => item[4] == true).map(item => item[0]);
//         let melodyNoteCount = document.getElementById('num-notes-seq-input').value;
     
//         /// Could do this in solfegePattern part too... but  maybe a bit more straight-forward to have all this logic in one place
//         global_currentSolfegeWRT_DO = getRandomElements(possibleMelodyNotes, melodyNoteCount).map(letter => {
//           // Find the index of the letter in the first elements of global_scaleNotes
//           let index = global_scaleNotes.findIndex(item => item[0] === letter);
        
//           // If the letter was found, return the corresponding solfege value
//           // If the letter was not found, return the original letter
//           return index !== -1 ? global_scaleNotes[index][1] : letter;
//         });
//         // TODO: this call would be updated to support chords
//         // TODO: also could update this to add an octave argument

//         document.getElementById('current-note').textContent = "Current solfege note: " + global_currentSolfegeWRT_DO.join(', ');

//         // console.debug("Current solfege note: " + global_currentSolfegeWRT_DO.join(', '));

//       }

//       global_totalRoundsToRandomizeMelodyCount = (global_totalRoundsToRandomizeMelodyCount % (global_totalRoundsToRandomizeMelody)) + 1;

//       // set key back to the reference key state
//       global_currentKey = removeNumber(refNote);

//     } else {

//       // TODO: randomize key... but don't let it be the reference key or the most recent key
//       // TODO: also... save out this initial state key so that it can be returned to...
//       let possibleKeys = global_scaleNotes.filter(item => item[0] != global_currentKey).filter(item => item[0] != removeNumber(refNote)).map(item => item[0]);

//       global_currentKey = possibleKeys[Math.floor(Math.random() * possibleKeys.length)][0];

//     }

//     global_roundsToInitialStateCount = (global_roundsToInitialStateCount % (global_roundsToInitialState)) + 1;

//   }

//   global_scenarioRepeatsCount = (global_scenarioRepeatsCount % global_scenarioRepeats) + 1;

//   // console.debug("global_currentKey end: " + global_currentKey);

//   return createKeyPattern(global_currentKey, keyOctaveNum)

//   // global_scenarioRepeats, global_roundsToInitialStateCount, global_totalRoundsToRandomizeMelody 

// }



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
    
    global_solfegeSynth.volume.value = document.getElementById("refsynthvol-slider").value;

    global_solfegeSynth.toDestination();

    global_filter = new Tone.Filter(100, "lowpass").toDestination();
    global_solfegeSynth.connect(global_filter); 

    // // Create an LFO to modulate the amplitude of the synth
    let lfo = new Tone.LFO(frequency = .20, min = .2, max = .7).start();

    // // Create a gain node to control the amplitude of the synth
    let gain = new Tone.Gain().toDestination();

    // // Connect the LFO to the gain node
    lfo.connect(gain.gain);

    // // Connect the synth to the gain node
    global_solfegeSynth.connect(gain);
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

    global_keySynth.volume.value = document.getElementById("chordsynthvol-slider").value;

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
      });
      
      global_resolutionSynth.volume.value = document.getElementById("ressynthvol-slider").value;
      global_resolutionSynth.toDestination();
}


// ===============================
// Section: Tonal Utilities
// ===============================

// function to randomize which relative scale degree is used based on which values of scaleNotes.map(item => item[3]) are true
function randomizeScaleDegree(scaleNotes) {
    
    // TODO: don't use global_currentSolfege here, check

    let scaleDegrees;
    
    if (global_currentSolfegeWRT_C === undefined | scaleNotes.filter(item => item[4] == true).length == 1)
      scaleDegrees = scaleNotes.filter(item => item[4] == true).map(item => item[0]);
    else 
      scaleDegrees = scaleNotes.filter(item => item[0] != global_currentSolfegeWRT_C).filter(item => item[4] == true).map(item => item[0]);

    let newNote = scaleDegrees[Math.floor(Math.random() * scaleDegrees.length)];

    let newSolfegeNote = scaleNotes.filter(item => item[0] == newNote).map(item => item[1]);

    document.getElementById('current-note').textContent = "Current solfege note: " + newSolfegeNote;

    return newNote;

}


// find major key that make a given note sound like the relative scaleDegree of interest
// for instance, if the note is C3 and the scaleDegree is "mi", then the function should return the major key that makes C3 sound like the "mi" of that scale, which is G# Major
function getContextScale(refNote, currentSolfege) {

  let orderedNotes = getOrderedNotes(global_scaleNotes.map(item => item[0]), removeNumber(refNote)); // TODO: does refNote ever need a number removed?

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

      // nextNote = scaleWithOctave[nextNoteInScaleIndex - 6];  // TEMP... TODO: this could be a breaking change, have to evaluateoutput...
      nextNote = scaleWithOctave[nextNoteInScaleIndex - 7]; 

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

function speakEvent(solfege_name) {
  
  //let note = global_scaleNotes[number - 1][2];

  let utterance = new SpeechSynthesisUtterance(solfege_name);
  utterance.volume = 1; // From 0 to 1
  utterance.pitch = .9;
  // var voices = window.speechSynthesis.getVoices();
  // utterance.voice = voices[10]; 
  speechSynthesis.speak(utterance);

}


function transposeMelody(melody, originalMode, targetMode) {
  let transposedMelody = [];

  for (let note of melody) {
      // Find the interval of the note from the root note in the original mode
      let interval = originalMode.indexOf(note);

      // If the target mode has a note at the same interval, use that note
      if (targetMode[interval] !== undefined) {
          transposedMelody.push(targetMode[interval]);
      } else {
          // If the target mode doesn't have a note at the same interval,
          // find the closest interval in the target mode and use the note at that interval
          let closestInterval = findClosestInterval(interval, targetMode);
          transposedMelody.push(targetMode[closestInterval]);
      }
  }

  return transposedMelody;
}

function findClosestInterval(interval, mode) {
  let closest = 0;
  let smallestDifference = Math.abs(mode[0] - interval);

  for (let i = 1; i < mode.length; i++) {
      let difference = Math.abs(mode[i] - interval);
      if (difference < smallestDifference) {
          smallestDifference = difference;
          closest = i;
      }
  }

  return closest;
}



// ===========================
// Section: Sequence Utilities
// ===========================

function createNoteSequence_seconds(numMeasures, timeSignature, notes, initialOffsetMeasures, bpm, note_duration) {

  const secondsPerBeat = 60.0 / bpm;
  // const secondsPerHalfMeasure = secondsPerBeat * 2;
  const initialOffsetMeasuresInSeconds = initialOffsetMeasures * secondsPerBeat * timeSignature;
  const totalMeasureLengthInSeconds = numMeasures * secondsPerBeat * timeSignature;

  return notes.map((value, index) => {
    const calculatedValue = initialOffsetMeasuresInSeconds + totalMeasureLengthInSeconds/notes.length * index;
    return {time: calculatedValue, duration: note_duration, note: value};
});

  // resolutionPart = resolutionNotes.map((value, index) => {
  //     const calculatedValue = (secondsPerHalfMeasure * 6) + secondsPerHalfMeasure/resolutionNotes.length * index;
  //     return {time: calculatedValue, duration: "10hz", note: value};
  // });

}

// function createNoteSequence_beats(numMeasures, timeSignature, notes, initialOffset, tempo) {
//   // Calculate the total number of beats
//   let totalBeats = numMeasures * (timeSignature / 4);

//   // Calculate the duration of each note in beats
//   let beatsPerNote = totalBeats / notes.length;

//   // Calculate the duration of each note in Hz (1 / duration in seconds)
//   let noteDurationHz = 1 / (beatsPerNote / 2);

//   // Split the initial offset into its components and convert to beats
//   let [offsetMeasures, offsetBeats, offsetSixteenths] = initialOffset.split(':').map(Number);
//   let totalOffsetBeats = offsetMeasures * (timeSignature / 4) + offsetBeats + offsetSixteenths / 4;

//   // Convert beats to seconds (60 seconds per minute / tempo in beats per minute)
//   let beatDurationSeconds = 60 / tempo;

//   // Create the note sequence
//   let noteSequence = notes.map((note, index) => {
//     let noteTime = (index * beatsPerNote + totalOffsetBeats) * beatDurationSeconds;
//     return {
//       time: noteTime,
//       note: note,
//       duration: noteDurationHz
//     };
//   });

//   return noteSequence;
// }



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

function removeLetter(str) {
  
  if (Array.isArray(str)) {
    return str.map((s) => s.replace(/[a-zA-Z]/g, ''));
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
  
  console.debug("random function: " + result);

  return result;
}

// return the indexes of the mode of interest
function getModeIndexes(scaleNotes, mode_item_number) {

  let indexes = scaleNotes.reduce((acc, item, index) => {
    // Check if the last item of the nested array is 1
    if (item[mode_item_number] === 1) {
        // If it is, add the index to the accumulator
        acc.push(index);
    }
  
    // Return the accumulator
    return acc;
  }, []);

  return indexes;

}

function getModeNotesInC(scaleNotes, mode_item_number) {

  let modeNotes = getModeIndexes(scaleNotes, mode_item_number);

  let modeNotesInC = modeNotes.map(index => scaleNotes[index][0]);

  return modeNotesInC;

}
