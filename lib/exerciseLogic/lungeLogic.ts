import { Keypoint } from "@tensorflow-models/pose-detection";
import { getAngleAtJoint } from "../angleUtils";
import { BaseExerciseLogic, ExerciseSample, PositionResult } from "./BaseExercise";

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
const kp = (name: keyof typeof map, kps: Keypoint[]) => kps[map[name]];

export class LungeLogic extends BaseExerciseLogic {
  evaluatePosition(sample: ExerciseSample): PositionResult {
    const { keypoints } = sample;
    const frontKnee = getAngleAtJoint(kp("leftHip", keypoints), kp("leftKnee", keypoints), kp("leftAnkle", keypoints));
    const backKnee = getAngleAtJoint(kp("rightHip", keypoints), kp("rightKnee", keypoints), kp("rightAnkle", keypoints));
    const torso = getAngleAtJoint(kp("leftShoulder", keypoints), kp("leftHip", keypoints), kp("leftKnee", keypoints));

    const kneeAngle = Math.min(frontKnee ?? 180, backKnee ?? 180);
    const isDown = kneeAngle < 90;
    const isUp = kneeAngle > 160;
    const accuracy = Math.min(100, Math.max(0, 100 - Math.abs(kneeAngle - 100)));

    return {
      isDown,
      isUp,
      accuracy,
      feedbackRules: [
        {
          message: "Lower your hips",
          condition: () => !isDown && kneeAngle > 120
        },
        {
          message: "Keep torso upright",
          condition: () => (torso ?? 180) < 150
        }
      ]
    };
  }
}



