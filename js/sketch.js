let CanvasHeight = window.innerHeight * 0.5;
let CanvasWidth = window.innerWidth * 0.5;

let descriptions;

let faceapi;
let video;
let detections;
let mouth, nose, leftEye, rightEye, rightEyeBrow, leftEyeBrow;

let readyToDrawTags = false; // A flag to indicate when it's safe to draw tags

/// Function to fetch JSON content
function preload() {
    descriptions = loadJSON("json/facial_descriptions_detailed.json");
}


// by default all options are set to true
const detection_options = {
    withLandmarks: true,
    withDescriptors: false,
}

function setup() {
    let canvas = createCanvas(CanvasWidth, CanvasHeight);
    canvas.style('display', 'block'); // Add this to prevent default styling that can affect layout
    canvas.parent('canvas-container'); // Specify the ID of the div where you want the canvas to go

    // load up your video
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide(); // Hide the video element, and just show the canvas
    faceapi = ml5.faceApi(video, detection_options, modelReady)
    textAlign(RIGHT);

    // // Ensure descriptions is loaded before accessing it
    // if (descriptions) {
    //     for (let key in descriptions) {
    //         for (let i = 0; i < descriptions[key].length; i++) {
    //             console.log(key + ": " + descriptions[key][i]);
    //         }
    //     }
    // }

    // your setup code here
    setTimeout(triggerEffect, 12000); // Set a timer for 2 minutes

}

// When the mouse is pressed, stop the loop
function mousePressed() {
    noLoop();
}

// When the mouse is released, start the loop again
function mouseReleased() {
    loop();
}


function windowResized() {
    CanvasWidth = window.innerWidth * 0.9;
    CanvasHeight = window.innerHeight * 0.9;
    resizeCanvas(CanvasWidth, CanvasHeight);
}

function modelReady() {
    console.log('ready!')
    console.log(faceapi)
    faceapi.detect(gotResults)

}

function gotResults(err, result) {
    if (err) {
        console.log(err)
        return
    }
    // console.log(result)
    detections = result;


    image(video, 0, 0, width, height)
    
    if (detections && detections.length > 0) {
        // Draw landmarks for the detected face
        drawLandmarks(detections);

        // After drawing landmarks, it's safe to draw tags
        readyToDrawTags = true;
    } else {
        readyToDrawTags = false;
    }

    faceapi.detect(gotResults)

}

function drawBox(detections) {
    for (let i = 0; i < detections.length; i++) {
        const alignedRect = detections[i].alignedRect;
        const x = alignedRect._box._x
        const y = alignedRect._box._y
        const boxWidth = alignedRect._box._width
        const boxHeight = alignedRect._box._height

        noFill();
        stroke(161, 95, 251);
        strokeWeight(2);
        rect(x, y, boxWidth, boxHeight);
    }

}

function drawLandmarks(detections) {
    noFill();
    stroke(61, 95, 251)
    strokeWeight(2)

    for (let i = 0; i < detections.length; i++) {

        //yuhan: FACIAL FEATURES
        mouth = detections[i].parts.mouth;
        nose = detections[i].parts.nose;
        leftEye = detections[i].parts.leftEye;
        rightEye = detections[i].parts.rightEye;
        rightEyeBrow = detections[i].parts.rightEyeBrow;
        leftEyeBrow = detections[i].parts.leftEyeBrow;

        drawPart(mouth, true);
        drawPart(nose, false);
        drawPart(leftEye, true);
        drawPart(leftEyeBrow, false);
        drawPart(rightEye, true);
        drawPart(rightEyeBrow, false);

    }

}


function drawPart(feature, closed) {

    beginShape();
    for (let i = 0; i < feature.length; i++) {
        const x = feature[i]._x
        const y = feature[i]._y
        vertex(x, y)
    }

    if (closed === true) {
        endShape(CLOSE);
    } else {
        endShape();
    }

}


function printWhatWeGot(detections) {
    for (i = 0; i < detection.lenth; i++) {
        detections[i].parts.mouth;
    }

}


function drawTag(feature) {

    // Check if feature is defined and has points
    if (!feature || feature.length == 0) {
        console.log('No feature points available to draw tag.');
        return;
    }
    console.log("draTag");
    // 1. Generate a random index for facial feature descriptions
    const randomIndex = Math.floor(Math.random() * feature.length);
    const randomWord = feature[randomIndex];

    // 2. Generate a random color
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    const randomColor = color(r, g, b);

    // 3. Generate a random point within the detected feature points
    const randomPointIndex = Math.floor(Math.random() * feature.length);
    const x = feature[randomPointIndex]._x
    const y = feature[randomPointIndex]._y


    // 4. Draw the text at the point in that color
    fill(randomColor);
    noStroke();
    textSize(18); // You can adjust the size of the text as needed
    text(randomWord, x, y);
}


function draw() {

    // Check the flag before drawing tags
    if (readyToDrawTags) {
        drawTag(mouth);
        drawTag(leftEye);
        drawTag(rightEye);
        drawTag(leftEyeBrow);
        drawTag(rightEyeBrow);
        readyToDrawTags = false; // Reset the flag until the next detection
    }
}


function triggerEffect() {
    // the effect you want to activate after 2 minutes
    console.log("Effect triggered after 2 minutes!");
}