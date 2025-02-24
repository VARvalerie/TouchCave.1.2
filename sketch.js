let myCapture, myVida;

let memorylayers, Zone0, Zone1, Zone2, Zone3, Zone4, Zone5, Zone6, Zone7, Zone8;

let sounds = [];

let canvasWidth = 640;
let canvasHeight = 480;

let zoneWidth = 0.05;
let zoneHeight = 0.3;

function preload() {
  console.log('[preload] loading samples...');

  sounds = [
    loadSound('mp3/Zone0.mp3'),
    loadSound('mp3/Zone1.mp3'),
    loadSound('mp3/Zone2.mp3'),
    loadSound('mp3/Zone3.mp3'),
    loadSound('mp3/Zone4.mp3'),
    loadSound('mp3/Zone5.mp3'),
    loadSound('mp3/Zone6.mp3'),
    loadSound('mp3/Zone7.mp3'),
    loadSound('mp3/Zone8.mp3'),
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
  } catch (_err) {
    console.error(`[initCaptureDevice] capture error: ${_err}`);
  }
}

function trigger(zone) {
  let soundIndex = parseInt(zone.label.replace('zone', ''), 10);
  let sound = sounds[soundIndex];

  if (sound && !sound.isPlaying()) {
    sound.play();
    console.log(`Starting playback of sound #${soundIndex}`);
  } else {
    console.log(`Will not start playing sound #${soundIndex} (already playing or undefined)`);
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

  const zoneData = [
    { label: "zone0", x: 0.03, y: 0.4, w: 0.09, h: 0.25 },
    { label: "zone1", x: 0.25, y: 0.65, w: 0.09, h: 0.08 },
    { label: "zone2", x: 0.3, y: 0.3, w: 0.2, h: 0.05 },
    { label: "zone3", x: 0.4, y: 0.45, w: 0.05, h: 0.05 },
    { label: "zone4", x: 0.465, y: 0.65, w: 0.05, h: 0.05 },
    { label: "zone5", x: 0.55, y: 0.35, w: 0.05, h: 0.05 },
    { label: "zone6", x: 0.58, y: 0.6, w: 0.09, h: 0.09 },
    { label: "zone7", x: 0.7, y: 0.45, w: 0.05, h: 0.05 },
    { label: "zone8", x: 0.85, y: 0.6, w: 0.07, h: 0.09 },
  ];

  zoneData.forEach(zone => {
    myVida.addActiveZone(zone.label, zone.x, zone.y, zone.w, zone.h, trigger);
  });

  myVida.setActiveZonesNormFillThreshold(0.5);

  frameRate(30); // Set framerate
}

function draw() {
  if (myCapture) {
    background(0, 0, 255);
    myVida.update(myCapture);
    image(myVida.thresholdImage, 0, 0);
    noStroke();
    fill(255, 255, 255);
    myVida.drawActiveZones(0, 0, canvasWidth, canvasHeight);
  } else {
    background(255, 0, 0);
  }
}

function touchEnded() {
  if (myCapture) {
    myVida.setBackgroundImage(myCapture);
    console.log('Background set');
  }
}
