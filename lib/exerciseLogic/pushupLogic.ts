import { Keypoint } from "@tensorflow-models/pose-detection";
import { getAngleAtJoint } from "../angleUtils";
import { BaseExerciseLogic, ExerciseSample, PositionResult } from "./BaseExercise";

const map: Record<string, number> = {
  leftShoulder: 5,
  rightShoulder: 6,
  leftElbow: 7,
  rightElbow: 8,
  leftWrist: 9,
  rightWrist: 10,
  leftHip: 11,
  rightHip: 12
};

const thresholds = { down: 70, up: 160, target: 90 };

const kp = (name: keyof typeof map, kps: Keypoint[]) => kps[map[name]];

export class PushupLogic extends BaseExerciseLogic {
  evaluatePosition(sample: ExerciseSample): PositionResult {
    const { keypoints } = sample;
    const leftElbow = getAngleAtJoint(kp("leftShoulder", keypoints), kp("leftElbow", keypoints), kp("leftWrist", keypoints));
    const rightElbow = getAngleAtJoint(
      kp("rightShoulder", keypoints),
      kp("rightElbow", keypoints),
      kp("rightWrist", keypoints)
    );
    const hipLine = getAngleAtJoint(kp("leftShoulder", keypoints), kp("leftHip", keypoints), kp("rightHip", keypoints));

    const elbowAngle = Math.min(leftElbow ?? 180, rightElbow ?? 180);
    const isDown = elbowAngle < thresholds.down;
    const isUp = elbowAngle > thresholds.up;
    const accuracy = Math.min(100, Math.max(0, 100 - Math.abs(elbowAngle - thresholds.target)));

    return {
      isDown,
      isUp,
      accuracy,
      feedbackRules: [
        {
          message: "Lower your chest",
          condition: () => !isDown && elbowAngle > 130
        },
        {
          message: "Keep your back straight",
          condition: () => (hipLine ?? 180) < 165
        }
      ]
    };
  }
}



