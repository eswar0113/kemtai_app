export type RepState = "idle" | "down" | "up";

export class ExerciseStateMachine {
  private state: RepState = "idle";
  private repCount = 0;

  constructor(private downThreshold: () => boolean, private upThreshold: () => boolean) {}

  update() {
    if (this.state === "idle" && this.downThreshold()) {
      this.state = "down";
    }
    if (this.state === "down" && this.upThreshold()) {
      this.state = "up";
      this.repCount += 1;
    }
    if (this.state === "up" && this.downThreshold()) {
      this.state = "down";
    }
    return { state: this.state, reps: this.repCount };
  }

  reset() {
    this.state = "idle";
    this.repCount = 0;
  }
}



