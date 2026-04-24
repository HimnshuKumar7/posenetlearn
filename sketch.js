let video;
let bodyPose;
let poses = [];
let connections; // 1. Create a variable to hold the skeleton connection map

function preload() {
  bodyPose = ml5.bodyPose();
}

function setup() {
  createCanvas(600, 400);
  video = createCapture(VIDEO);
  video.size(600, 400);
  video.hide();

  bodyPose.detectStart(video, gotPoses);
  
  // 2. Fetch the standard skeleton connections for the model
  connections = bodyPose.getSkeleton(); 
  
  console.log("Model is ready and detecting!");
}

function gotPoses(results) {
  poses = results;
}

function draw() {
  image(video, 0, 0, width, height);

  // Loop through all detected poses
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    
    // 3. DRAW THE SKELETON LINES
    // We loop through the 'connections' map we got in setup()
    for (let j = 0; j < connections.length; j++) {
      let partAIndex = connections[j][0];
      let partBIndex = connections[j][1];
      
      let keypointA = pose.keypoints[partAIndex];
      let keypointB = pose.keypoints[partBIndex];

      // Only draw a line if we are confident that BOTH points are actually on the screen
      if (keypointA.confidence > 0.1 && keypointB.confidence > 0.1) {
        stroke(255, 0, 0); // Red line
        strokeWeight(2);   // Line thickness
        line(keypointA.x, keypointA.y, keypointB.x, keypointB.y);
      }
    }

    // 4. DRAW THE KEYPOINTS (Dots)
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];

      if (keypoint.confidence > 0.1) {
        fill(0, 255, 0); // Green dots
        noStroke();
        circle(keypoint.x, keypoint.y, 10);
      }
    }
  }
}