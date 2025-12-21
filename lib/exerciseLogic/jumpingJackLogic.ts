import { Keypoint } from "@tensorflow-models/pose-detection";
import { getAngleAtJoint } from "../angleUtils";
import { BaseExerciseLogic, ExerciseSample, PositionResult } from "./BaseExercise";

const map: Record<string, number> = {
  leftShoulder: 5,
  rightShoulder: 6,
  leftElbow: 7,
  rightElbow: 8,
  leftHip: 11,
  rightHip: 12,
  leftKnee: 13,
  rightKnee: 14,
  leftAnkle: 15,
  rightAnkle: 16
};
const kp = (name: keyof typeof map, kps: Keypoint[]) => kps[map[name]];

export class JumpingJackLogic extends BaseExerciseLogic {
  evaluatePosition(sample: ExerciseSample): PositionResult {
    const { keypoints } = sample;
    const shoulderAngle = getAngleAtJoint(kp("leftElbow", keypoints), kp("leftShoulder", keypoints), kp("leftHip", keypoints));
    const legAngle = getAngleAtJoint(kp("leftHip", keypoints), kp("leftKnee", keypoints), kp("leftAnkle", keypoints));

    const isUp = (shoulderAngle ?? 0) < 60 && (legAngle ?? 180) > 170;
    const isDown = (shoulderAngle ?? 180) > 120;
    const accuracy = Math.min(100, Math.max(0, 100 - Math.abs((shoulderAngle ?? 0) - 80)));

    return {
      isDown,
      isUp,
      accuracy,
      feedbackRules: [
        {
          message: "Raise your arms higher",
          condition: () => !isUp && (shoulderAngle ?? 180) > 90
        }
      ]
    };
  }
}



