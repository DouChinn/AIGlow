// basical canvas setting
let CanvasHeight = window.innerHeight * 0.8;
let CanvasWidth = window.innerWidth * 0.7;

// json data storage
let descriptions;
let environment;

// api and relevant parameters
let faceapi;
let video;
let detections;
let mouth, nose, leftEye, rightEye, rightEyeBrow, leftEyeBrow;

// call drawTags function
let readyToDrawTags = false; // A flag to indicate when it's safe to draw tags

// black screen activity
let blackScreenActive = false;
let blackScreenStartTime = 0;
const blackScreenDuration = 20000; // 20 seconds
let lastLetterDisplayedTime = 0;


// typewriter effect
// let typewriterText = "DO YOU ENJOY YOUR ANALYSIS? WHAT IS REALLY HAPPENING?";

// Split the text into two parts
let part1 = "DO YOU ENJOY YOUR ANALYSIS?";
let part2 = "WHAT IS REALLY HAPPENING?";
let currentTextLength = 0;
let lastTimeLetterAdded = 0;
const letterInterval = 150; // Time in milliseconds between letters


// Flag to control the appearance of environment words
let startEnvironmentWords = false;
let displayedWords = [];





/// Function to fetch JSON content
function preload() {
    descriptions = loadJSON("json/facial_descriptions_detailed.json");
    environment = loadJSON("json/environment_words.json");
}

// by default all options are set to true
const detection_options = {
    withLandmarks: true,
    withDescriptors: false,
}

function setup() {
    let canvas = createCanvas(CanvasWidth, CanvasHeight);
    canvas.style('display', 'block'); // Add this to prevent default styling that can affect layout
    canvas.style('margin-left', 'auto');
    canvas.style('margin-right', 'auto');
    canvas.style('margin-top', (window.innerHeight - height) / 3 + 'px'); // Center vertically
    canvas.parent('canvas-container'); // Specify the ID of the div where you want the canvas to go

    // load up your video
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide(); // Hide the video element, and just show the canvas
    faceapi = ml5.faceApi(video, detection_options, modelReady)
    textAlign(RIGHT);

    setTimeout(triggerEffect, 10000); // Set a timer for 10s

    textFont('Times New Roman');


}


function windowResized() {

    resizeCanvas(CanvasWidth, CanvasHeight);
    select('canvas').style('margin-top', (window.innerHeight - height) / 2 + 'px'); // Adjust vertical centering on resize

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

// function drawBox(detections) {
//     for (let i = 0; i < detections.length; i++) {
//         const alignedRect = detections[i].alignedRect;
//         const x = alignedRect._box._x
//         const y = alignedRect._box._y
//         const boxWidth = alignedRect._box._width
//         const boxHeight = alignedRect._box._height

//         noFill();
//         stroke(161, 95, 251);
//         strokeWeight(2);
//         rect(x, y, boxWidth, boxHeight);
//     }

// }

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


function draw() {
    if (blackScreenActive && millis() - blackScreenStartTime < blackScreenDuration) {
        background(0); // Set the background to black
        fill(255); // Set the text color to white
        textSize(36); // Set the text size
        textFont('Times New Roman');
        textAlign(CENTER, CENTER);

        // Calculate the total length of both parts
        let totalLength = part1.length + part2.length;

        // Calculate the current length for each part
        let currentLengthPart1 = min(currentTextLength, part1.length);
        let currentLengthPart2 = max(0, currentTextLength - part1.length);

        // Check if it's time to add a new letter
        if (millis() - lastTimeLetterAdded > letterInterval && currentTextLength < totalLength) {
            currentTextLength++;
            lastTimeLetterAdded = millis();

            // If the last letter is added, record the time
            if (currentTextLength === totalLength) {
                lastLetterDisplayedTime = millis();
            }
        }

        // Display the current substring of each part
        text(part1.substring(0, currentLengthPart1), width / 2, height / 2 - 20);
        if (currentLengthPart1 === part1.length) {
            text(part2.substring(0, currentLengthPart2), width / 2, height / 2 + 20);
        }

        // End the black screen effect after 5 seconds of displaying the last letter
        if (lastLetterDisplayedTime > 0 && millis() - lastLetterDisplayedTime > 5000) {
            blackScreenActive = false;
            currentTextLength = 0;
            lastTimeLetterAdded = 0;
            lastLetterDisplayedTime = 0;
        }
    }
    else if (blackScreenActive) {
        // Reset everything once the duration is over
        blackScreenActive = false;
        currentTextLength = 0;
        lastTimeLetterAdded = 0;
        lastLetterDisplayedTime = 0;
    }
    else {
        drawFeatures(); // Call drawFeatures within the draw loop
        drawRandomEnvironmentWords(); // Add random environment words to the array
        drawStoredWords(); // Draw words stored in the array
    }
}



function drawFeatures() {

    // Check the flag before drawing tags
    if (readyToDrawTags) {
        drawTag(nose, "nose");
        drawTag(mouth, "mouth");
        drawTag(leftEye, "leftEye");
        drawTag(rightEye, "rightEye");
        drawTag(leftEyeBrow, "leftEyeBrow");
        drawTag(rightEyeBrow, "rightEyeBrow");
        readyToDrawTags = false; // Reset the flag until the next detection
    }
}


function drawTag(feature, name) {

    // Check if feature is defined and has points
    if (!feature || feature.length == 0) {
        console.log('No feature points available to draw tag.');
        return;
    }

    // 1. Generate a random index for facial feature descriptions
    const randomIndex = Math.floor(Math.random() * descriptions[name].length);
    const randomWord = descriptions[name][randomIndex];

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


function triggerEffect() {
    console.log("Effect triggered after 10s!");
    blackScreenActive = true;
    blackScreenStartTime = millis();
}



function drawRandomEnvironmentWords() {
    if (environment && environment.words && frameCount % 100 === 0) {
        const randomWord = random(environment.words);
        const x = random(width);
        const y = random(height);
        const color = { r: random(255), g: random(255), b: random(255) }; // Assign a random color

        displayedWords.push({ word: randomWord, x: x, y: y, color: color });
    }
}



function drawStoredWords() {
    for (let wordObj of displayedWords) {
        fill(wordObj.color.r, wordObj.color.g, wordObj.color.b); // Use the assigned color
        noStroke();
        textSize(28);
        text(wordObj.word, wordObj.x, wordObj.y);
    }
}


