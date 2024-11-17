let mic, fft, Df;
let waveform;

let f0 = 0;
let frequence = 0;
let delat_f = 0;
let button;
let buffer = 0;
let buf_size = 0;
let buf_size_MAX = 10;
let moy_delta_f = 0;

// paramètres capture audio
let bins = 1024 * 2 * 2;
let smooth = 0.8;
let dt = 0.0;


function setup() {  
  let div = createDiv();
  div.id('application');

  let titre = createElement("h1","Mesure de l'effet Doppler");
  titre.parent(div);
  
  let c = createCanvas(600, 400);
  c.parent(div);
  
  button = createButton("Définir la fréquence de la source immobile");  
  button.mousePressed(fixFreq);  
  button.parent(div);

  textFont("Courier New");
  textSize(32);
  textStyle(BOLD);

  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT(smooth, bins);
  fft.setInput(mic);
  Df = sampleRate() / (2 * fft.bins);
  dt = 1 / sampleRate();
}

function fixFreq() {
  f0 = frequence;
}

function getPeriodsMarks(waveform) {
  let T = [];
  for (i = 0; i < waveform.length - 1; i++) {
    sn = waveform[i];
    sn_1 = waveform[i + 1];
    if (sn <= 0 && sn_1 >= 0) {
      let x = -sn / (sn_1 - sn) + i;
      T.push(x);
    }
  }
  return T;
}

function draw() {
  background(255);
  waveform = fft.waveform();

  let T = getPeriodsMarks(waveform);

  let N = T.length - 1;
  let periode = ((T[N] - T[0]) / N) * dt;
  frequence = 1 / periode;
  delat_f = frequence - f0;

  if (buf_size < buf_size_MAX) {
    buf_size = buf_size + 1;
    buffer = buffer + delat_f;
  } else {
    moy_delta_f = buffer / buf_size_MAX;
    buffer = 0;
    buf_size = 0;
  }

  fill(color("black"));
  textAlign(CENTER)
  text("Fréquence de la source (Hz)", width * 0.5, 60);
  text(frequence.toFixed(1),width * 0.5, 120);

  text("Différence de fréquence (Hz)",width * 0.5, 200);
  text(moy_delta_f.toFixed(0), width * 0.5, 260);

  rectMode(CORNER);
  
  noStroke();
  if( moy_delta_f> 0){
    fill(color("blue"));
    rect(width/2 , 300, moy_delta_f * 10 , 50 ,0,10,10,0);
  }else{
    fill(color("red"));
    rect(width/2 + moy_delta_f*10  , 300, -moy_delta_f * 10 , 50 ,10,0,0,10);
  }
  
  stroke(color("black"));
  strokeWeight(2);
  line(width/2,290,width/2, 360 );
  noStroke();
  
}
