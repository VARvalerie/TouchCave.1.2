let myCapture, myVida;
let sounds = [];
let backgroundCapturedFlag = false;

let canvasWidth = 640;
let canvasHeight = 480;

let zoneWidth = 0.05;
let zoneHeight = 0.3;

function preload() {
  console.log('[preload] loading samples...');

  let soundPaths = [
    'mp3/Zone0.mp3', 'mp3/Zone1.mp3', 'mp3/Zone2.mp3', 
    'mp3/Zone3.mp3', 'mp3/Zone4.mp3', 'mp3/Zone5.mp3', 
    'mp3/Zone6.mp3', 'mp3/Zone7.mp3', 'mp3/Zone8.mp3'
  ];

  for (let i = 0; i < soundPaths.length; i++) {
    let sound = loadSound(soundPaths[i], () => {
      console.log(`Sound ${i} loaded successfully.`);
    }, (err) => {
      console.error(`Error loading sound ${i}:`, err);
    });
    sounds.push(sound);
  }

  console.log('[preload] samples loaded');
}

function initCaptureDevice() {
  try {
    myCapture = createCapture(VIDEO);
    myCapture.size(canvasWidth, canvasHeight);
    myCapture.elt.setAttribute('playsinline', '');
    myCapture.hide();

    console.log(`[initCaptureDevice] capture ready. Resolution: ${myCapture.width}x${myCapture.height}`);
  } catch (_err) {
    console.log(`[initCaptureDevice] capture error: ${_err}`);
  }
}

function trigger(zone) {
  // Assuming zone.label is in format 'zoneX', where X is the index.
  let soundIndex = parseInt(zone.label.replace("zone", ""));
  let sound = sounds[soundIndex];

  if (sound && !sound.isPlaying()) {
    sound.play();
    console.log(`Starting playback of sound #${soundIndex}`);
  } else {
    console.log(`Will not start playing sound #${soundIndex} (already playing)`);
  }
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  initCaptureDevice();

  myVida = new Vida(this);
  myVida.progressiveBackgroundFlag = true;
  myVida.imageFilterThreshold = 0.2;
  myVida.imageFilterInvert = true;
  myVida.mirror = myVida.MIRROR_HORIZONTAL;
  myVida.handleActiveZonesFlag = true;

  // Define zones
  myVida.addActiveZone("zone0", 0.03, 0.4, 0.09, 0.25, trigger);
  myVida.addActiveZone("zone1", 0.25, 0.65, 0.09, 0.08, trigger);
  myVida.addActiveZone("zone2", 0.3, 0.3, 0.2, 0.05, trigger);
  myVida.addActiveZone("zone3", 0.4, 0.45, 0.05, 0.05, trigger);
  myVida.addActiveZone("zone4", 0.465, 0.65, 0.05, 0.05, trigger);
  myVida.addActiveZone("zone5", 0.55, 0.35, 0.05, 0.05, trigger);
  myVida.addActiveZone("zone6", 0.58, 0.6, 0.09, 0.09, trigger);
  myVida.addActiveZone("zone7", 0.7, 0.45, 0.05, 0.05, trigger);
  myVida.addActiveZone("zone8", 0.85, 0.6, 0.07, 0.09, trigger);

  myVida.setActiveZonesNormFillThreshold(0.5);

  frameRate(30); // set framerate
  userStartAudio();
}

function draw() {
  if (myCapture !== null && myCapture !== undefined) { // safety check
    background(0, 0, 255); // background color
    
    // Update VIDA with current video frame
    myVida.update(myCapture);

    // Display VIDA's thresholded image
    image(myVida.thresholdImage, 0, 0);
    
    noStroke(); 
    fill(255, 255, 255);
    
    // Draw active zones on the canvas
    myVida.drawActiveZones(0, 0, canvasWidth, canvasHeight);
  } else {
    // If there are issues with the capture device, change background to red
    background(255, 0, 0);
  }
}

function touchEnded() {
  if (myCapture !== null && myCapture !== undefined) {
    myVida.setBackgroundImage(myCapture);
    console.log('Background set');
    backgroundCapturedFlag = true;
  }
}

function touchStarted() {
  userStartAudio(); // Ensure audio plays after user interaction
  if (myCapture && myCapture.elt) {
    myCapture.elt.play(); // Ensure camera starts playing
  }
}


