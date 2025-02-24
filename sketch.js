let myCapture, myVida;

let memorylayers, Zone0, Zone1, Zone2, Zone3, Zone4, Zone5, Zone6, Zone7, Zone8;

let sounds = [];

let canvasWidth = 640;
let canvasHeight = 480;

zoneWidth = 0.05;
zoneHeight = 0.3; 

function preload() {
  console.log('[preload] loading samples...');

   Zone0 = loadSound('mp3/Zone0.mp3');
  Zone1 = loadSound('mp3/Zone1.mp3');
  Zone2 = loadSound('mp3/Zone2.mp3');
  Zone3 = loadSound('mp3/Zone3.mp3');
  Zone4 = loadSound('mp3/Zone4.mp3');
  Zone5 = loadSound('mp3/Zone5.mp3');
  Zone6 = loadSound('mp3/Zone6.mp3');
  Zone7 = loadSound('mp3/Zone7.mp3');
  Zone8 = loadSound('mp3/Zone8.mp3');

  sounds = [
    Zone0, 
    Zone1, 
    Zone2, 
    Zone3, 
    Zone4, 
    Zone5, 
    Zone6, 
    Zone7, 
    Zone8,
  ];

  console.log('[preload] samples loaded');
}

function initCaptureDevice() {
  try {
    myCapture = createCapture(VIDEO);
    myCapture.size(canvasWidth, canvasHeight);
    myCapture.elt.setAttribute('playsinline', '');
    myCapture.hide();

    console.log(`[initCaptureDevice] capture ready. Resolution: ${myCapture.width}x${myCapture.height}`);
  } catch(_err) {
    console.log(`[initCaptureDevice] capture error: ${_err}`);
  }
}

function trigger(zone) {
  let soundIndex = myVida.activeZones.indexOf(zone);
  let sound = sounds[soundIndex];

  if (!sound._playing) {
    sounds[soundIndex].play();
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
  
  myVida.addActiveZone(
    "zone0",
    0.03, 0.4, 0.09, 0.25,
    trigger
  );
  myVida.addActiveZone(
    "zone1",
    0.25, 0.65, 0.09, 0.08,
    trigger
  );
  myVida.addActiveZone(
    "zone2",
    0.3, 0.3, 0.2, 0.05,
    trigger
  );
  myVida.addActiveZone(
    "zone3",
    0.4, 0.45, 0.05, 0.05,
    trigger
  );
  myVida.addActiveZone(
    "zone4",
    0.465, 0.65, 0.05, 0.05,
    trigger
  );
  myVida.addActiveZone(
    "zone5",
    0.55, 0.35, 0.05, 0.05,
    trigger
  );
  myVida.addActiveZone(
    "zone6",
    0.58, 0.6, 0.09, 0.09,
    trigger
  );
  myVida.addActiveZone(
    "zone7",
    0.7, 0.45, 0.05, 0.05,
    trigger
  );
  myVida.addActiveZone(
    "zone8",
    0.85, 0.6, 0.07, 0.09,
    trigger
  );
  
  myVida.setActiveZonesNormFillThreshold(0.5);

  frameRate(30); // set framerate
}

function draw() {
  if(myCapture !== null && myCapture !== undefined) { // safety first
    background(0, 0, 255);
    /*
      Call VIDA update function, to which we pass the current video frame as a
      parameter. Usually this function is called in the draw loop (once per
      repetition).
    */
    myVida.update(myCapture);

    /*
      Now we can display images: source video (mirrored) and subsequent stages
      of image transformations made by VIDA.
    */
    // image(myVida.currentImage, 0, 0);
    // image(myVida.backgroundImage, 320, 0);
    // image(myVida.differenceImage, 0, 240);
    image(myVida.thresholdImage, 0, 0)
    noStroke(); 
    fill(255, 255, 255);
    
    /*
      In this example, we use the built-in VIDA function for drawing zones. We
      use the version of the function with two parameters (given in pixels)
      which are the coordinates of the upper left corner of the graphic
      representation of zones. VIDA is also equipped with a version of this
      function with four parameters (the meaning of the first and second
      parameter does not change, and the third and fourth mean width and height
      respectively). For example, to draw the zones on the entire available
      surface, use the function in this way:
        [your vida object].drawActiveZones(0, 0, width, height);
    */
    myVida.drawActiveZones(0, 0, canvasWidth, canvasHeight);
  }
  else {
    /*
      If there are problems with the capture device (it's a simple mechanism so
      not every problem with the camera will be detected, but it's better than
      nothing) we will change the background color to alarmistically red.
    */
    background(255, 0, 0);
  }
}

/*
  Capture current video frame and put it into the VIDA's background buffer.
*/
function touchEnded() {
  if(myCapture !== null && myCapture !== undefined) {
    myVida.setBackgroundImage(myCapture);
    console.log('background set');
    backgroundCapturedFlag = true;
  }
}
