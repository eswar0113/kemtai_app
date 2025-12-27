import { Keypoint } from "@tensorflow-models/pose-detection";
import { BaseExerciseLogic, ExerciseSample, PositionResult } from "./BaseExercise";

const map: Record<string, number> = {
  nose: 0,
  leftEye: 1,
  rightEye: 2,
  leftEar: 3,
  rightEar: 4,
  leftShoulder: 5,
  rightShoulder: 6
};

const kp = (name: keyof typeof map, kps: Keypoint[]) => kps[map[name]];

export class HeadRotationLogic extends BaseExerciseLogic {
  private lastDirection: "left" | "right" | "center" = "center";
  private centerThreshold = 0.2; // Threshold for considering head centered
  private rotationThreshold = 0.3; // Minimum rotation to count as rotated

  evaluatePosition(sample: ExerciseSample): PositionResult {
    const { keypoints } = sample;
    
    const nose = kp("nose", keypoints);
    const leftEar = kp("leftEar", keypoints);
    const rightEar = kp("rightEar", keypoints);
    const leftShoulder = kp("leftShoulder", keypoints);
    const rightShoulder = kp("rightShoulder", keypoints);

    // Check if keypoints are available
    if (!nose || !leftEar || !rightEar || !leftShoulder || !rightShoulder) {
      return {
        isDown: false,
        isUp: false,
        accuracy: 50,
        feedbackRules: []
      };
    }

    // Calculate the center point between ears
    const earCenterX = (leftEar.x + rightEar.x) / 2;
    
    // Calculate the distance between ears (for normalization)
    const earDistance = Math.sqrt(
      Math.pow(rightEar.x - leftEar.x, 2) + Math.pow(rightEar.y - leftEar.y, 2)
    );

    if (earDistance < 20) {
      // Ears too close together, likely not detected properly
      return {
        isDown: false,
        isUp: false,
        accuracy: 50,
        feedbackRules: []
      };
    }

    // Calculate how far the nose is from the center (normalized)
    const noseOffset = (nose.x - earCenterX) / earDistance;
    
    // Determine current direction
    let currentDirection: "left" | "right" | "center";
    if (Math.abs(noseOffset) < this.centerThreshold) {
      currentDirection = "center";
    } else if (noseOffset > 0) {
      currentDirection = "right";
    } else {
      currentDirection = "left";
    }

    // For state machine: 
    // isDown = head is rotated to one side (left or right)
    // isUp = head returns to center
    const isDown = currentDirection !== "center" && Math.abs(noseOffset) > this.rotationThreshold;
    const isUp = currentDirection === "center" && Math.abs(noseOffset) < this.centerThreshold;

    // Update last direction
    this.lastDirection = currentDirection;

    // Calculate accuracy based on rotation range
    // Good rotation should have nose offset between 0.3 and 0.6
    const maxRotation = Math.max(0.3, Math.min(0.6, Math.abs(noseOffset)));
    const rotationAccuracy = Math.min(100, Math.max(0, (maxRotation / 0.6) * 100));

    // Check if shoulders are level (good posture)
    // Calculate shoulder line angle
    const shoulderSlope = (rightShoulder.y - leftShoulder.y) / (rightShoulder.x - leftShoulder.x);
    const shoulderAngle = Math.abs(Math.atan(shoulderSlope) * (180 / Math.PI));
    const shoulderLevel = Math.abs(shoulderAngle); // Should be close to 0 for level shoulders
    const postureAccuracy = Math.max(0, 100 - shoulderLevel * 3);

    // Combined accuracy (weighted: 70% rotation, 30% posture)
    const accuracy = rotationAccuracy * 0.7 + postureAccuracy * 0.3;

    return {
      isDown,
      isUp,
      accuracy,
      feedbackRules: [
        {
          message: "Rotate your head more to the side",
          condition: () => isDown && Math.abs(noseOffset) < 0.35
        },
        {
          message: "Keep your shoulders level",
          condition: () => shoulderLevel > 10
        },
        {
          message: "Return to center position",
          condition: () => !isUp && currentDirection !== "center" && Math.abs(noseOffset) > 0.5
        }
      ]
    };
  }
}

