import { Keypoint } from "@tensorflow-models/pose-detection";
import { ExerciseStateMachine } from "../stateMachine";
import { FeedbackEngine } from "../feedbackEngine";

export type ExerciseSample = {
  keypoints: Keypoint[];
  timestamp: number;
};

export type ExerciseResult = {
  reps: number;
  state: string;
  accuracy: number;
  feedback?: string | null;
};

export type PositionResult = {
  accuracy: number;
  isDown: boolean;
  isUp: boolean;
  feedbackRules: Array<{ message: string; condition: () => boolean }>;
};

export abstract class BaseExerciseLogic {
  protected stateMachine: ExerciseStateMachine;
  protected feedbackEngine: FeedbackEngine | null = null;
  constructor() {
    this.stateMachine = new ExerciseStateMachine(
      () => this.lastPosition?.isDown ?? false,
      () => this.lastPosition?.isUp ?? false
    );
  }

  protected lastPosition: PositionResult | null = null;

  abstract evaluatePosition(sample: ExerciseSample): PositionResult;

  update(sample: ExerciseSample): ExerciseResult {
    this.lastPosition = this.evaluatePosition(sample);
    if (!this.feedbackEngine) {
      this.feedbackEngine = new FeedbackEngine(this.lastPosition.feedbackRules);
    }
    const { reps, state } = this.stateMachine.update();
    const feedback = this.feedbackEngine?.evaluate() ?? null;
    return { reps, state, accuracy: this.lastPosition.accuracy, feedback };
  }
}



