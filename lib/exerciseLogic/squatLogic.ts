import { Keypoint } from "@tensorflow-models/pose-detection";
import { averageAngle, getAngleAtJoint } from "../angleUtils";
import { BaseExerciseLogic, ExerciseSample, PositionResult } from "./BaseExercise";

const thresholds = {
  down: 70,
  up: 160,
  target: 90
};

const kp = (name: string, keypoints: Keypoint[]) => {
  const map: Record<string, number> = {
    leftHip: 11,
    rightHip: 12,
    leftKnee: 13,
    rightKnee: 14,
    leftAnkle: 15,
    rightAnkle: 16,
    leftShoulder: 5,
    rightShoulder: 6
  };
  return keypoints[map[name]];
};

export class SquatLogic extends BaseExerciseLogic {
  evaluatePosition(sample: ExerciseSample): PositionResult {
    const { keypoints } = sample;
    const leftKnee = getAngleAtJoint(kp("leftHip", keypoints), kp("leftKnee", keypoints), kp("leftAnkle", keypoints));
    const rightKnee = getAngleAtJoint(
      kp("rightHip", keypoints),
      kp("rightKnee", keypoints),
      kp("rightAnkle", keypoints)
    );
    const hipAngle = averageAngle([leftKnee, rightKnee]) ?? 180;
    const shoulderHip = getAngleAtJoint(kp("leftShoulder", keypoints), kp("leftHip", keypoints), kp("leftKnee", keypoints));

    const isDown = hipAngle < thresholds.down;
    const isUp = hipAngle > thresholds.up;
    const accuracy = Math.min(100, Math.max(0, 100 - Math.abs((hipAngle ?? 0) - thresholds.target)));

    return {
      isDown,
      isUp,
      accuracy,
      feedbackRules: [
        {
          message: "Bend your knees more",
          condition: () => !isDown && hipAngle > 120
        },
        {
          message: "Keep your back straight",
          condition: () => (shoulderHip ?? 180) < 150
        }
      ]
    };
  }
}



